import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";
import { isReview } from "@/lib/mode";

type TestimonialCardProps = {
  testimonial: Testimonial;
  className?: string;
};

/** Quote card with the development-only placeholder variant (design.md 6.4). */
export function TestimonialCard({
  testimonial,
  className = "",
}: TestimonialCardProps) {
  return (
    <figure
      className={`flex h-full flex-col rounded-md bg-white p-6 ${
        testimonial.isPlaceholder
          ? "border border-dashed border-stone-300"
          : "border border-stone-300 shadow-1"
      } ${className}`}
    >
      {testimonial.isPlaceholder ? (
        <p className="type-label w-fit rounded-full bg-stone-100 px-2.5 py-1 text-text-muted">
          Placeholder
        </p>
      ) : null}

      <blockquote className="font-display mt-4 text-[1.375rem] italic leading-snug text-text">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <figcaption className="mt-auto pt-5">
        <p className="type-spec">{testimonial.name}</p>
        <p className="type-small text-text-muted">{testimonial.role}</p>
      </figcaption>
    </figure>
  );
}

/**
 * Testimonials band. Placeholders render in review mode so the client can see
 * the layout; live mode hides them and the whole band when no real quote exists.
 */
export function Testimonials({ className = "" }: { className?: string }) {
  const visible = TESTIMONIALS.filter(
    (testimonial) => !testimonial.isPlaceholder || isReview(),
  );

  if (visible.length === 0) return null;

  return (
    <section
      className={`section-y border-y border-stone-300 bg-white ${className}`}
    >
      <Container>
        <SectionHeading eyebrow="Testimonials" title="What customers say" />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {visible.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.name}-${index}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
