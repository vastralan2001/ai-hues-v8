/* Inline JSON-LD structured data. Server-rendered <script> so crawlers see it
   in the static HTML. Pass a plain schema.org object (or array). */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
