import { useRef } from "react";
import type { ProjectData } from "../data/projects";

interface Props {
    project: ProjectData;
}

export default function ProjectCard({ project }: Props) {
    const cardRef = useRef<HTMLDivElement>(null);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - rect.left) / rect.width - 0.5;
        const dy = (e.clientY - rect.top) / rect.height - 0.5;
        const MAX_TILT = 10;
        const rotX = -dy * MAX_TILT;
        const rotY = dx * MAX_TILT;
        el.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    }

    function handleMouseLeave() {
        const el = cardRef.current;
        if (!el) return;
        el.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
        setTimeout(() => { if (el) el.style.transition = ""; }, 400);
    }

    function handleMouseEnter() {
        const el = cardRef.current;
        if (!el) return;
        el.style.transition = "";
    }

    function handleClick() {
        window.parent.postMessage(
            {
                type: "open-window",
                id: `project-detail-${project.id}`,
                title: project.title,
                src: `/ProjectDetail?id=${project.id}`,
                emoji: "📋",
            },
            "*"
        );
    }

    return (
        <div
            ref={cardRef}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            className="rounded-xl overflow-hidden cursor-pointer bg-white border border-gray-100 shadow-sm hover:shadow-md"
            style={{ transformStyle: "preserve-3d" }}
        >
            {/* Thumbnail */}
            <div className="h-40 bg-gray-50 overflow-hidden">
                {project.photos?.[0] ? (
                    <img
                        src={project.photos[0]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center">
                        <span className="text-3xl opacity-30">🖼</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">{project.title}</h3>
                    <span className="text-[10px] text-gray-400 shrink-0 bg-gray-100 px-2 py-0.5 rounded-full">{project.year}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{project.description}</p>
            </div>
        </div>
    );
}
