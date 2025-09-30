const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');
const { spawnSync } = require('child_process');

const _filename = __dirname + '/merge-prisma.ts';
const _dirname = path.dirname(__filename);

const modulesDir = path.join(__dirname, '..', 'modules');
const outFile = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const tmpFile = path.join(__dirname, '..', 'prisma', 'schema.tmp.prisma');

const lenient = process.argv.includes('--lenient');

function naturalSort(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function runInherit(cmd: string, args?: string[], opts = {}) {
  // Use cmd /c for Windows compatibility, quote args with spaces
  // Ensure paths are properly formatted for Windows
  const processedArgs = args ? args.map((arg) => {
    // If it's a path-like argument with forward slashes, don't add quotes
    if (arg.includes('/') && !arg.includes(' ')) {
      return arg;
    }
    // Otherwise, quote if it has spaces
    return arg.includes(' ') ? `"${arg}"` : arg;
  }) : [];
  
  const fullArgs = [
    '/d',
    '/s',
    '/c',
    cmd,
    ...processedArgs,
  ];
  console.log(`Executing command: cmd ${fullArgs.join(' ')}`);
  const result = spawnSync('cmd', fullArgs, { stdio: 'inherit', encoding: 'utf8', ...opts });
  console.log(
    `Command result: status=${result.status}, error=${result.error || 'none'}, stdout=${
      result.stdout || 'none'
    }, stderr=${result.stderr || 'none'}`
  );
  return result;
}

function runCapture(cmd: string, args?: string[], opts = {}) {
  // Ensure paths are properly formatted for Windows
  const processedArgs = args ? args.map((arg) => {
    // If it's a path-like argument with forward slashes, don't add quotes
    if (arg.includes('/') && !arg.includes(' ')) {
      return arg;
    }
    // Otherwise, quote if it has spaces
    return arg.includes(' ') ? `"${arg}"` : arg;
  }) : [];
  
  const fullArgs = [
    '/d',
    '/s',
    '/c',
    cmd,
    ...processedArgs,
  ];
  console.log(`Executing command (capture): cmd ${fullArgs.join(' ')}`);
  const result = spawnSync('cmd', fullArgs, { encoding: 'utf8', ...opts });
  console.log(
    `Command result (capture): status=${result.status}, error=${result.error || 'none'}, stdout=${
      result.stdout || 'none'
    }, stderr=${result.stderr || 'none'}`
  );
  return result;
}

function fail(msg: string) {
  console.error('\nERROR:', msg);
  console.error(`Temp schema left at: ${tmpFile}\n`);
  process.exit(1);
}

function scanModules() {
  console.log(`Scanning modules directory: ${modulesDir}`);
  if (!fs.existsSync(modulesDir)) {
    throw new Error(`modules directory not found: ${modulesDir}`);
  }
  const files = fs
    .readdirSync(modulesDir)
    .filter((f: string) => f.endsWith('.prisma'))
    .sort(naturalSort);
  if (files.length === 0) throw new Error(`No .prisma files found in ${modulesDir}`);
  console.log(`Found ${files.length} .prisma files: ${files.join(', ')}`);

  const fileContents = {};
  for (const f of files) {
    const p = path.join(modulesDir, f);
    let content = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
    // Trim BOM if present
    if (content.charCodeAt(0) === 0xfeff) content = content.slice(1);
    (fileContents as { [key: string]: string })[f] = content;
    console.log(`Read file ${f}, length: ${content.length} characters`);
  }
  return { files, fileContents };
}

function basicChecks(files: string[], fileContents: { [key: string]: string }) {
  console.log('Running basic validation checks on module files...');
  const filesWithBlockComments = [];
  const filesWithDatasourceOrGenerator = [];
  const jsTsArtifacts = [];
  const invalidMapValues = [];
  const enumMap = new Map();
  const modelMap = new Map();

  for (const f of files) {
    const content = fileContents[f];
    console.log(`Checking file: ${f}`);
    if (content.includes('/*') || content.includes('*/')) {
      console.log(`Found block comments in ${f}`);
      filesWithBlockComments.push(f);
    }
    if (/^\s*(datasource|generator)\s+/m.test(content)) {
      console.log(`Found datasource or generator in ${f}`);
      filesWithDatasourceOrGenerator.push(f);
    }

    // Detect JS/TS artifacts
    if (/^\s*(import |export |const |let |function )/m.test(content)) {
      console.log(`Found potential JS/TS artifacts in ${f}`);
      jsTsArtifacts.push(f);
    }

    // Collect enums
    const enumRegex = /^\s*enum\s+([A-Za-z0-9_]+)\s*{/gm;
    let m;
    while ((m = enumRegex.exec(content)) !== null) {
      const name = m[1];
      console.log(`Found enum ${name} in ${f}`);
      enumMap.set(name, (enumMap.get(name) || []).concat(f));
    }

    // Collect models
    const modelRegex = /^\s*model\s+([A-Za-z0-9_]+)\s*{/gm;
    while ((m = modelRegex.exec(content)) !== null) {
      const name = m[1];
      console.log(`Found model ${name} in ${f}`);
      modelMap.set(name, (modelMap.get(name) || []).concat(f));
    }

    // Check @map values
    const mapRegex = /@map\(\s*"([^"]+)"\s*\)/g;
    const lines = content.split('\n');
    let mm;
    while ((mm = mapRegex.exec(content)) !== null) {
      const mapped = mm[1];
      const idx = mm.index;
      const before = content.slice(0, idx);
      const line = before.split('\n').length;
      if (mapped.includes('@') || mapped.includes('.')) {
        console.log(`Found invalid @map value "${mapped}" at ${f}:${line}`);
        invalidMapValues.push({ file: f, line, value: mapped });
      }
    }
  }

  // Duplicates
  const duplicateEnums = Array.from(enumMap.entries()).filter(([, arr]) => arr.length > 1);
  const duplicateModels = Array.from(modelMap.entries()).filter(([, arr]) => arr.length > 1);

  // Aggregate errors
  const issues = [];
  if (filesWithBlockComments.length) {
    console.log(`Block comments found in: ${filesWithBlockComments.join(', ')}`);
    issues.push(
      `Block comments (/* ... */) found in modules (Prisma .prisma only supports //):\n  ${filesWithBlockComments.join(
        '\n  '
      )}`
    );
  }
  if (!lenient && filesWithDatasourceOrGenerator.length > 1) {
    console.log(
      `Multiple datasource/generator declarations in: ${filesWithDatasourceOrGenerator.join(', ')}`
    );
    issues.push(
      `Datasource/generator declarations appear in module files: move them to 00-datasource-and-generator.prisma or ensure only one module contains them:\n  ${filesWithDatasourceOrGenerator.join(
        '\n  '
      )}`
    );
  }
  if (jsTsArtifacts.length) {
    console.log(`JS/TS artifacts found in: ${jsTsArtifacts.join(', ')}`);
    issues.push(
      `Possible JS/TS artifacts found in modules (import/const/let/function). Remove stray code:\n  ${jsTsArtifacts.join(
        '\n  '
      )}`
    );
  }
  if (invalidMapValues.length) {
    const lines = invalidMapValues.map(
      (i) => `  - ${i.file}:${i.line} -> mapped value "${i.value}"`
    );
    console.log(`Invalid @map values found:\n${lines.join('\n')}`);
    issues.push(
      `Found @map(...) with values containing '@' or '.' — these are unusual for enum database mappings; consider using plain String for emails or remove @map:\n${lines.join(
        '\n'
      )}`
    );
  }
  if (duplicateEnums.length > 0) {
    const lines = duplicateEnums.map(([name, fl]) => `  - enum ${name}: ${fl.join(', ')}`);
    console.log(`Duplicate enums found:\n${lines.join('\n')}`);
    issues.push(`Duplicate enum definitions across modules:\n${lines.join('\n')}`);
  }
  if (duplicateModels.length > 0) {
    const lines = duplicateModels.map(([name, fl]) => `  - model ${name}: ${fl.join(', ')}`);
    console.log(`Duplicate models found:\n${lines.join('\n')}`);
    issues.push(`Duplicate model definitions across modules:\n${lines.join('\n')}`);
  }

  if (issues.length > 0) {
    throw new Error(issues.join('\n\n'));
  }
  console.log('All basic validation checks passed.');
  return true;
}

function mergeFiles(files: string[], fileContents: { [key: string]: string }) {
  console.log('Merging .prisma files...');
  const parts = [];
  const seenEnums = new Set();
  const seenModels = new Set();
  let seenGenerator = false;
  let seenDatasource = false;

  for (const f of files) {
    console.log(`Processing file: ${f}`);
    const content = fileContents[f];
    const lines = content.split('\n');
    const outLines = [];
    let i = 0;
    while (i < lines.length) {
      const raw = lines[i];
      const trimmed = raw.trim();

      // Skip generator/datasource blocks if already seen (lenient)
      if (/^\s*generator\s+[A-Za-z0-9_]+\s*{/.test(trimmed)) {
        if (seenGenerator) {
          console.log(`Skipping duplicate generator in ${f}`);
          let depth = 0;
          for (; i < lines.length; i++) {
            if (lines[i].includes('{')) depth++;
            if (lines[i].includes('}')) {
              depth--;
              if (depth <= 0) break;
            }
          }
          i++;
          continue;
        } else {
          seenGenerator = true;
          console.log(`Including generator from ${f}`);
        }
      }
      if (/^\s*datasource\s+[A-Za-z0-9_]+\s*{/.test(trimmed)) {
        if (seenDatasource) {
          console.log(`Skipping duplicate datasource in ${f}`);
          let depth = 0;
          for (; i < lines.length; i++) {
            if (lines[i].includes('{')) depth++;
            if (lines[i].includes('}')) {
              depth--;
              if (depth <= 0) break;
            }
          }
          i++;
          continue;
        } else {
          seenDatasource = true;
          console.log(`Including datasource from ${f}`);
        }
      }

      const enumMatch = trimmed.match(/^\s*enum\s+([A-Za-z0-9_]+)\s*{/);
      if (enumMatch) {
        const name = enumMatch[1];
        if (seenEnums.has(name)) {
          console.log(`Skipping duplicate enum ${name} in ${f}`);
          let depth = 0;
          for (; i < lines.length; i++) {
            if (lines[i].includes('{')) depth++;
            if (lines[i].includes('}')) {
              depth--;
              if (depth <= 0) break;
            }
          }
          i++;
          continue;
        } else {
          seenEnums.add(name);
          console.log(`Including enum ${name} from ${f}`);
        }
      }

      const modelMatch = trimmed.match(/^\s*model\s+([A-Za-z0-9_]+)\s*{/);
      if (modelMatch) {
        const name = modelMatch[1];
        if (seenModels.has(name)) {
          console.log(`Skipping duplicate model ${name} in ${f}`);
          let depth = 0;
          for (; i < lines.length; i++) {
            if (lines[i].includes('{')) depth++;
            if (lines[i].includes('}')) {
              depth--;
              if (depth <= 0) break;
            }
          }
          i++;
          continue;
        } else {
          seenModels.add(name);
          console.log(`Including model ${name} from ${f}`);
        }
      }

      outLines.push(raw);
      i++;
    }

    parts.push(
      [
        '// ------------------------------',
        `// File: ${f}`,
        '// ------------------------------',
        outLines.join('\n'),
      ].join('\n')
    );
  }

  const merged = parts.join('\n\n');
  console.log('Merging complete, merged content length:', merged.length);
  return merged;
}

function bracesBalanced(text: string) {
  console.log('Checking braces balance in merged schema...');
  let depth = 0;
  for (const ch of text) {
    if (ch === '{') depth++;
    if (ch === '}') depth--;
    if (depth < 0) {
      console.log('Unbalanced braces detected: too many closing braces');
      return false;
    }
  }
  const balanced = depth === 0;
  console.log(`Braces balance check: ${balanced ? 'Passed' : 'Failed (unclosed braces)'}`);
  return balanced;
}

function main() {
  console.log('Starting Prisma schema merge process...');
  try {
    const { files, fileContents } = scanModules();

    // Check for changes based on modification times
    console.log(`Checking for changes in module files against ${outFile}`);
    let needsMerge = !fs.existsSync(outFile);
    if (!needsMerge) {
      const outMtime = fs.statSync(outFile).mtimeMs;
      for (const f of files) {
        const p = path.join(modulesDir, f);
        const fileMtime = fs.statSync(p).mtimeMs;
        if (fileMtime > outMtime) {
          console.log(`Change detected in ${f} (mtime: ${fileMtime} > ${outMtime})`);
          needsMerge = true;
          break;
        }
      }
    }

    if (!needsMerge) {
      console.log('No changes detected in module files. Skipping merge.');
      return;
    }

    // Basic checks
    console.log('Performing validation checks...');
    basicChecks(files, fileContents);

    // Merge
    const merged = mergeFiles(files, fileContents);

    // Braces check
    if (!bracesBalanced(merged)) {
      fail('Merged schema has unbalanced braces { } — check module files for mismatched blocks.');
    }

    console.log(`Writing temporary schema to ${tmpFile}`);
    fs.writeFileSync(tmpFile, merged, 'utf8');
    console.log(`Wrote temp schema to ${tmpFile} (${files.length} source files).`);

    const tmpFileQuoted = tmpFile;
    const outFileQuoted = outFile;

    console.log('\n tempFile: ', tmpFileQuoted, '\n outFile: ', outFileQuoted);

    // Run prisma format - use normalized path without quotes
    const normalizedTmpPath = tmpFile.replace(/\\/g, '/');
    console.log('Running: npx prisma format --schema', normalizedTmpPath);
    const fmt = runInherit('npx', ['prisma', 'format', '--schema', normalizedTmpPath]);
    console.log('fmt: ', fmt);
    if (fmt.status !== 0) {
      const cap = runCapture('npx', ['prisma', 'format', '--schema', normalizedTmpPath]);

      console.log('cap: ', cap);

      const out = cap.stdout || cap.stderr || '';
      console.log('\nprisma format output:\n', out);

      fail(
        `prisma format failed. Open the temp schema and run 'npx prisma format --schema ${normalizedTmpPath}' to see details.`
      );
    } else {
      console.log('Prisma format succeeded.');
    }

    // Run prisma validate
    console.log('Running: npx prisma validate --schema', normalizedTmpPath);
    const val = runInherit('npx', ['prisma', 'validate', '--schema', normalizedTmpPath]);
    console.log('val: ', val);
    if (val.status !== 0) {
      const cap = runCapture('npx', ['prisma', 'validate', '--schema', normalizedTmpPath]);
      const out = cap.stdout || cap.stderr || '';
      if (out) {
        console.error('\nprisma validate output:\n', out);
      }
      fail(`prisma validate failed. Check the temp schema at ${normalizedTmpPath}.`);
    } else {
      console.log('Prisma validate succeeded.');
    }

    // Write final schema
    console.log(`Writing final schema to ${outFile}`);
    fs.writeFileSync(outFile, merged, 'utf8');
    if (fs.existsSync(tmpFile)) {
      console.log(`Cleaning up temporary schema file ${tmpFile}`);
      fs.unlinkSync(tmpFile);
    }
    console.log(`Merged schema written to ${outFile} ✅`);

    // Run prisma generate
    const normalizedOutPath = outFile.replace(/\\/g, '/');
    console.log('Running: npx prisma generate --schema', normalizedOutPath);
    const gen = runInherit('npx', ['prisma', 'generate', '--schema', normalizedOutPath]);
    if (gen.status !== 0) {
      const cap = runCapture('npx', ['prisma', 'generate', '--schema', normalizedOutPath]);
      const out = cap.stdout || cap.stderr || '';
      if (out) {
        console.error('\nprisma generate output:\n', out);
      }
      fail(`prisma generate failed. Check the schema at ${normalizedOutPath}.`);
    } else {
      console.log('Prisma generate succeeded.');
    }
    console.log('Prisma client generated successfully ✅');
  } catch (err) {
    fail((err as Error).message || String(err));
  }
}

main();
