type JsonLdProps = {
  /** One schema.org object, or a list emitted as a JSON array. */
  data: Record<string, unknown> | readonly Record<string, unknown>[];
};

/** Structured data script. Escapes `<` so product text cannot close the tag. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
