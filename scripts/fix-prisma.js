const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const modulesDir = path.join(__dirname, '..', 'modules');
const outFile = path.join(__dirname, '..', 'prisma', 'schema.prisma');

// Read and merge all .prisma files
console.log('Reading Prisma module files...');
const files = fs.readdirSync(modulesDir)
  .filter(f => f.endsWith('.prisma'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

console.log(`Found ${files.length} .prisma files`);

// Merge files
const parts = [];
for (const file of files) {
  const filePath = path.join(modulesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  parts.push(
    [
      `// ------------------------------`,
      `// File: ${file}`,
      `// ------------------------------`,
      content
    ].join('\n')
  );
}

const merged = parts.join('\n\n');

// Write merged schema
console.log(`Writing merged schema to ${outFile}`);
fs.writeFileSync(outFile, merged, 'utf8');

// Run Prisma generate
try {
  console.log('Running prisma generate...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma schema generated successfully!');
} catch (error) {
  console.error('Error generating Prisma schema:', error.message);
  process.exit(1);
}