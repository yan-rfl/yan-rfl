import { useState, useRef } from "react";
import { IoLogoGithub } from "react-icons/io";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { PiBrowserBold, PiGlobeHemisphereEastLight } from "react-icons/pi";

interface ProjectProps {
  title: string;
  photos?: string[];
  description: string;
  myRole?: string;
  techStack?: string[];
  openHere?: string;
  link?: string;
  githubUrl?: string;
}

const linkClass =
  "flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#e11d48] transition-colors cursor-pointer";

export default function Project({
  title,
  photos = [],
  description,
  myRole,
  techStack,
  openHere,
  link,
  githubUrl,
}: ProjectProps) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollTo = (i: number) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      left: i * containerRef.current.clientWidth,
      behavior: "smooth",
    });
    setIndex(i);
  };

  const prev = () => scrollTo(Math.max(0, index - 1));
  const next = () => scrollTo(Math.min(photos.length - 1, index + 1));

  const handleScroll = () => {
    if (!containerRef.current) return;
    const newIndex = Math.round(
      containerRef.current.scrollLeft / containerRef.current.clientWidth
    );
    setIndex(newIndex);
  };

  const handleOpenHere = () => {
    if (!openHere) return;
    window.parent.postMessage(
      {
        type: "open-window",
        id: `proj-${encodeURIComponent(openHere).slice(0, 40)}`,
        title,
        src: openHere,
        emoji: "🌎",
      },
      "*"
    );
  };

  return (
    <div className="rounded-2xl border border-violet-100 overflow-hidden bg-white shadow-sm flex flex-col">
      {/* Photo slideshow */}
      {photos.length > 0 ? (
        <div className="relative shrink-0">
          {/* Scrollable strip */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex overflow-x-scroll snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {photos.map((photo, i) => (
              <div key={i} className="shrink-0 w-full snap-start aspect-video">
                <img
                  src={photo}
                  alt={`${title} screenshot ${i + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>

          {/* Prev / Next buttons */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
              >
                <HiChevronLeft size={15} />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
              >
                <HiChevronRight size={15} />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className={`block w-1.5 h-1.5 rounded-full transition-colors ${
                      i === index ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="aspect-video bg-linear-to-br from-rose-50 to-violet-100 flex items-center justify-center shrink-0">
          <span className="text-3xl opacity-30">🖼</span>
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        <h3 className="font-bold text-gray-900 text-base leading-snug">{title}</h3>
        <div className="text-sm text-gray-500 leading-relaxed">
          <p className={expanded ? "" : "line-clamp-5"}>{description}</p>
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="text-xs text-violet-500 hover:text-violet-700 transition-colors mt-1 cursor-pointer"
            >
              read more...
            </button>
          ) : (
            <button
              onClick={() => setExpanded(false)}
              className="text-xs text-violet-500 hover:text-violet-700 transition-colors mt-1 cursor-pointer"
            >
              read less...
            </button>
          )}
        </div>

        {/* My Role */}
        {myRole && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">My Role</span>
            <span className="text-sm text-gray-700">{myRole}</span>
          </div>
        )}

        {/* Tech Stack */}
        {techStack && techStack.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Tech Stack</span>
            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs rounded-full font-medium"
                  style={{ background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action links */}
        {(openHere || link || githubUrl) && (
          <div className="flex items-center gap-4">
            {openHere && (
              <button onClick={handleOpenHere} className={linkClass}>
                <PiBrowserBold size={15} />
                Open Here
              </button>
            )}
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <PiGlobeHemisphereEastLight size={15} />
                Open In Browser
              </a>
            )}
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <IoLogoGithub size={15} />
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
