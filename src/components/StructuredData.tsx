import { ScriptHTMLAttributes } from 'react';

interface StructuredDataProps extends ScriptHTMLAttributes<HTMLScriptElement> {
  data: any;
}

export default function StructuredData({ data, ...props }: StructuredDataProps) {
  return (
    <script
      {...props}
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
