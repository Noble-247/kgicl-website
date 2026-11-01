import { CloudImage } from "@/components/CloudImage";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  className?: string;
};

/** Project card: 3:2 photo, title, location pill, type and description (design.md 6.4). */
export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-md border border-stone-300 bg-white shadow-1 ${className}`}
    >
      <div className="aspect-[3/2] bg-stone-100">
        <CloudImage
          publicId={project.image.publicId}
          alt={project.image.alt}
          fit="cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          width={640}
          height={427}
        />
      </div>

      <div className="p-5">
        <h3 className="type-h3">{project.title}</h3>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {project.location ? (
            <span className="type-small rounded-full border border-stone-300 px-2.5 py-0.5 text-text-muted">
              {project.location}
            </span>
          ) : null}
          <p className="type-label text-red-deep">{project.type}</p>
        </div>

        <p className="type-small mt-3 text-text-muted">{project.description}</p>
      </div>
    </article>
  );
}
