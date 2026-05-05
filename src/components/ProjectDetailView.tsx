import { useState, useRef } from "react";
import { PROJECTS } from "../data/projects";
import { IoLogoGithub } from "react-icons/io";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { PiBrowserBold, PiGlobeHemisphereEastLight } from "react-icons/pi";

const linkClass =
    "flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#e11d48] transition-colors cursor-pointer";

// Each slide takes 84% of the container width; the remaining 8% either side
// shows adjacent slides. 7.5% spacers at the start/end let the first and last
// slides centre properly. scrollLeft(i) = i * 0.84 * containerWidth.
const SLIDE_FRAC = 0.84;
const SPACER_FRAC = (1 - SLIDE_FRAC) / 2; // 0.08

export default function ProjectDetailView() {
    const params = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
    );
    const id = params.get("id") ?? "";
    const project = PROJECTS.find((p) => p.id === id);

    const [photoIdx, setPhotoIdx] = useState(0);
    const slideRef = useRef<HTMLDivElement>(null);

    if (!project) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Project not found.
            </div>
        );
    }

    function goTo(n: number) {
        const container = slideRef.current;
        if (!container) return;
        const clamped = Math.max(0, Math.min((project!.photos?.length ?? 1) - 1, n));
        setPhotoIdx(clamped);
        container.scrollTo({ left: clamped * SLIDE_FRAC * container.clientWidth, behavior: "smooth" });
    }

    function onSlideScroll() {
        const container = slideRef.current;
        if (!container) return;
        const idx = Math.round(container.scrollLeft / (SLIDE_FRAC * container.clientWidth));
        setPhotoIdx(Math.max(0, Math.min((project!.photos?.length ?? 1) - 1, idx)));
    }

    function openHere() {
        if (!project!.openHere) return;
        window.parent.postMessage(
            {
                type: "open-window",
                id: `proj-${encodeURIComponent(project!.openHere).slice(0, 40)}`,
                title: project!.title,
                src: project!.openHere,
                emoji: "🌎",
            },
            "*"
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-white" style={{ scrollbarWidth: "none" }}>
            {/* Photo slideshow */}
            <div className="relative bg-gray-100 shrink-0" style={{ height: "22rem" }}>
                {project.photos && project.photos.length > 0 ? (
                    <>
                        <div
                            ref={slideRef}
                            onScroll={onSlideScroll}
                            className="flex h-full overflow-x-scroll snap-x snap-mandatory [&::-webkit-scrollbar]:hidden items-center"
                            style={{ scrollbarWidth: "none" }}
                        >
                            {/* Leading spacer so the first slide can centre */}
                            <div className="shrink-0 h-full" style={{ width: `${SPACER_FRAC * 100}%` }} />

                            {project.photos.map((src, i) => {
                                const dist = Math.abs(i - photoIdx);
                                const isActive = dist === 0;
                                const heightPct = isActive ? 88 : dist === 1 ? 60 : 50;
                                const opacity = isActive ? 1 : dist === 1 ? 0.55 : 0.35;
                                return (
                                    <div
                                        key={i}
                                        className="snap-center shrink-0 px-1 transition-all duration-300"
                                        style={{ width: `${SLIDE_FRAC * 100}%`, height: `${heightPct}%`, opacity }}
                                    >
                                        <div className="w-full h-full rounded-xl overflow-hidden shadow-md bg-gray-50">
                                            <img
                                                src={src}
                                                alt={`${project.title} screenshot ${i + 1}`}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Trailing spacer */}
                            <div className="shrink-0 h-full" style={{ width: `${SPACER_FRAC * 100}%` }} />
                        </div>

                        {project.photos.length > 1 && (
                            <>
                                <button
                                    onClick={() => goTo(photoIdx - 1)}
                                    disabled={photoIdx === 0}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer disabled:opacity-30"
                                >
                                    <HiChevronLeft size={15} />
                                </button>
                                <button
                                    onClick={() => goTo(photoIdx + 1)}
                                    disabled={photoIdx === (project.photos?.length ?? 1) - 1}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer disabled:opacity-30"
                                >
                                    <HiChevronRight size={15} />
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                    {project.photos.map((_, i) => (
                                        <div
                                            key={i}
                                            onClick={() => goTo(i)}
                                            className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${i === photoIdx ? "bg-gray-700" : "bg-gray-400/40"}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="h-full bg-gradient-to-br from-rose-50 to-violet-100 flex items-center justify-center">
                        <span className="text-3xl opacity-30">🖼</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-5">
                <div className="flex items-start justify-between gap-2">
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">{project.title}</h1>
                    <span className="text-xs text-gray-400 shrink-0 mt-1 bg-gray-100 px-2 py-0.5 rounded-full">{project.year}</span>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>

                {project.myRole && (
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">My Role</span>
                        <span className="text-sm text-gray-700">{project.myRole}</span>
                    </div>
                )}

                {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Tech Stack</span>
                        <div className="flex flex-wrap gap-1.5">
                            {project.techStack.map((tag) => (
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

                {(project.openHere || project.link || project.githubUrl) && (
                    <div className="flex items-center gap-4 pt-1">
                        {project.openHere && (
                            <button onClick={openHere} className={linkClass}>
                                <PiBrowserBold size={15} /> Open Here
                            </button>
                        )}
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className={linkClass}>
                                <PiGlobeHemisphereEastLight size={15} /> Open In Browser
                            </a>
                        )}
                        {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                                <IoLogoGithub size={15} /> GitHub
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
