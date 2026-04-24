import { useState, useRef, useEffect } from "react";
import { IoLogoGithub } from "react-icons/io";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { PiBrowserBold, PiGlobeHemisphereEastLight } from "react-icons/pi";

interface Project {
    title: string;
    year: string;
    photos?: string[];
    description: string;
    myRole?: string;
    techStack?: string[];
    openHere?: string;
    link?: string;
    githubUrl?: string;
}

const PROJECTS: Project[] = [
    {
        title: "Ping!",
        year: "2026",
        photos: ["/Ping/1.png", "/Ping/2.png", "/Ping/3.png", "/Ping/4.png"],
        description: "Ping! is an intelligent communication and reporting system designed for LCAS laboratory operations. It centralizes previously scattered communication channels and replaces manual reporting processes with a more efficient, data-driven workflow. The platform features Ping! Bot, an AI-powered assistant that uses Retrieval-Augmented Generation (RAG) to provide instant solutions for common issues, reducing repetitive support requests and easing the workload of the Operation & System Development (OSD) team.",
        techStack: ["NextJS", "Tailwind CSS", "MySQL", "ExpressJS"],
    },
    {
        title: "Backup LCAS",
        year: "2025",
        photos: ["/BackupLCAS/1.png", "/BackupLCAS/2.png", "/BackupLCAS/3.png", "/BackupLCAS/4.png", "/BackupLCAS/5.png", "/BackupLCAS/6.png"],
        description: "Backup LCAS is a comprehensive web-based platform designed to streamline file management and backup processes for Bina Nusantara University. It enables users to efficiently navigate and organize server file structures while providing students with a secure space to submit project backups. Staff members can request and manage backups through an integrated ticketing system, ensuring quick and reliable data retrieval.",
        myRole: "Backend Developer",
        techStack: ["NextJS", "Tailwind CSS", "MySQL", "ExpressJS"],
    },
    {
        title: "Legacy Portfolio",
        year: "2024",
        photos: ["/Yanrfl/1.png", "/Yanrfl/2.png"],
        description: "My old portfolio followed a similar concept to this one, but back then I was obsessed with terminal-style UIs because I used NVIM as my main IDE. Since my previous portfolio only explored the basic concept of an operating system and terminal-based interface, I decided to create a more polished and complete operating system UI design for my current portfolio.",
        myRole: "Fullstack Developer",
        techStack: ["NextJS", "TypeScript", "Tailwind CSS"],
        openHere: "https://yanrfl.vercel.app/",
        link: "https://yanrfl.vercel.app/",
    },
    {
        title: "Miserease",
        year: "2024",
        photos: ["/Miserease/1.png", "/Miserease/2.png", "/Miserease/3.png"],
        description: "Miserease is a web application inspired by Social Comparison Theory, which suggests that people often feel better when they know others are facing similar challenges. It serves as a platform where users can share their problems in the form of stories, with the hope of easing their burdens through connection and understanding. Created as my team GNBKitchen's submission for GarudaHacks 4.0.",
        myRole: "Backend Developer",
        techStack: ["ReactJS", "Tailwind CSS", "TypeScript"],
        openHere: "https://miserease.vercel.app",
        link: "https://miserease.vercel.app",
        githubUrl: "https://github.com/victorhalimm/Miserease",
    },
    {
        title: "Codehub",
        year: "2024",
        photos: ["/Codehub/1.png", "/Codehub/2.png", "/Codehub/3.png", "/Codehub/4.png"],
        description: "CodeHub is a commercial website created for one of my college projects. It was designed as a community platform for programmers, where members can connect with one another and gain access to weekly training sessions and exercises to improve their skills. The website was built using only HTML and CSS within a few days.",
        myRole: "Frontend Developer",
        techStack: ["HTML", "CSS"],
        openHere: "https://codehub-alpha.vercel.app",
        link: "https://codehub-alpha.vercel.app",
        githubUrl: "https://github.com/RR23-2/Codehub",
    },
];

const linkClass =
    "flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#e11d48] transition-colors cursor-pointer";

// ── Per-project slide (owns its own photo index) ────────────────────────────
function ProjectSlide({ project, containerRef }: {
    project: Project;
    containerRef: (el: HTMLDivElement | null) => void;
}) {
    const [photoIdx, setPhotoIdx] = useState(0);
    const slideRef = useRef<HTMLDivElement>(null);

    function prev() {
        const n = Math.max(0, photoIdx - 1);
        setPhotoIdx(n);
        slideRef.current?.scrollTo({ left: n * slideRef.current.clientWidth, behavior: "smooth" });
    }

    function next() {
        const max = (project.photos?.length ?? 1) - 1;
        const n = Math.min(max, photoIdx + 1);
        setPhotoIdx(n);
        slideRef.current?.scrollTo({ left: n * slideRef.current.clientWidth, behavior: "smooth" });
    }

    function onSlideScroll() {
        if (!slideRef.current) return;
        setPhotoIdx(Math.round(slideRef.current.scrollLeft / slideRef.current.clientWidth));
    }

    function openHere() {
        if (!project.openHere) return;
        window.parent.postMessage(
            {
                type: "open-window",
                id: `proj-${encodeURIComponent(project.openHere).slice(0, 40)}`,
                title: project.title,
                src: project.openHere,
                emoji: "🌎",
            },
            "*"
        );
    }

    return (
        // snap-start + h-full makes this slide fill the outer container exactly.
        // overflow-y-auto lets long content scroll; once that inner scroll hits
        // the end the outer snap container takes over.
        <div ref={containerRef} className="snap-start h-full overflow-y-auto shrink-0" style={{ scrollbarWidth: "none" }}>
            {/* Photo slideshow */}
            <div className="relative shrink-0 bg-gray-50 h-72">
                {project.photos && project.photos.length > 0 ? (
                    <>
                        <div
                            ref={slideRef}
                            onScroll={onSlideScroll}
                            className="flex overflow-x-scroll snap-x snap-mandatory h-full [&::-webkit-scrollbar]:hidden"
                            style={{ scrollbarWidth: "none" }}
                        >
                            {project.photos.map((src, i) => (
                                <div key={i} className="shrink-0 w-full snap-start h-full">
                                    <img
                                        src={src}
                                        alt={`${project.title} screenshot ${i + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                        {project.photos.length > 1 && (
                            <>
                                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer">
                                    <HiChevronLeft size={15} />
                                </button>
                                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer">
                                    <HiChevronRight size={15} />
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                    {project.photos.map((_, i) => (
                                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === photoIdx ? "bg-white" : "bg-white/40"}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="h-full bg-linear-to-br from-rose-50 to-violet-100 flex items-center justify-center">
                        <span className="text-3xl opacity-30">🖼</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{project.title}</h2>
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

// ── useIsNarrow ─────────────────────────────────────────────────────────────
function useIsNarrow() {
    const [narrow, setNarrow] = useState(false);
    useEffect(() => {
        const check = () => setNarrow(window.innerWidth < 640);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return narrow;
}

// ── Main layout ──────────────────────────────────────────────────────────────
export default function ProjectsLayout() {
    const isNarrow = useIsNarrow();
    const [selectedIdx, setSelectedIdx] = useState(0);
    const selectedIdxRef = useRef(0);
    selectedIdxRef.current = selectedIdx;

    const outerRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const leftPanelRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Keep left panel scrolled to show the active item
    useEffect(() => {
        const panel = leftPanelRef.current;
        const item = itemRefs.current[selectedIdx];
        if (!panel || !item) return;
        const itemTop = item.offsetTop;
        const itemBottom = itemTop + item.offsetHeight;
        const { scrollTop, clientHeight } = panel;
        if (itemTop < scrollTop) {
            panel.scrollTo({ top: itemTop, behavior: "smooth" });
        } else if (itemBottom > scrollTop + clientHeight) {
            panel.scrollTo({ top: itemBottom - clientHeight, behavior: "smooth" });
        }
    }, [selectedIdx]);

    // Snap container scrolled → update active index and reset the previous slide
    function handleOuterScroll() {
        const el = outerRef.current;
        if (!el) return;
        const idx = Math.round(el.scrollTop / el.clientHeight);
        if (idx !== selectedIdxRef.current) {
            const prev = slideRefs.current[selectedIdxRef.current];
            if (prev) prev.scrollTop = 0;
            setSelectedIdx(idx);
        }
    }

    // Left panel click → scroll snap container to that project
    function selectProject(idx: number) {
        outerRef.current?.scrollTo({
            top: idx * (outerRef.current.clientHeight),
            behavior: "smooth",
        });
    }

    return (
        <div className="flex h-dvh overflow-hidden bg-white">
            {/* ── Left panel ── */}
            {!isNarrow && (
                <div ref={leftPanelRef} className="w-40 shrink-0 border-r border-violet-100 overflow-y-auto flex flex-col bg-gray-50/60">
                    <div className="px-3 py-3 border-b border-violet-100 shrink-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Projects</p>
                    </div>

                    {PROJECTS.map((p, i) => (
                        <button
                            key={i}
                            ref={(el) => { itemRefs.current[i] = el; }}
                            onClick={() => selectProject(i)}
                            className={`project-item w-full text-left flex flex-col p-2.5 gap-2 border-b border-violet-50 transition-all duration-200 border-l-[3px] ${
                                i === selectedIdx
                                    ? "border-l-rose-400"
                                    : "border-l-transparent hover:bg-violet-50/70"
                            }`}
                            style={{
                                animationDelay: `${i * 65}ms`,
                                ...(i === selectedIdx
                                    ? { background: "linear-gradient(135deg, rgba(251,146,60,0.10) 0%, rgba(225,29,72,0.07) 50%, rgba(124,58,237,0.09) 100%)" }
                                    : {}),
                            }}
                        >
                            {p.photos?.[0] ? (
                                <img src={p.photos[0]} alt={p.title} className="w-full aspect-video object-cover rounded-md" />
                            ) : (
                                <div className="w-full aspect-video rounded-md bg-linear-to-br from-violet-100 to-pink-100" />
                            )}
                            <div>
                                <p className={`text-[11px] font-semibold leading-snug truncate ${i === selectedIdx ? "text-rose-600" : "text-gray-700"}`}>
                                    {p.title}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{p.year}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* ── Right panel: snap-scroll container ── */}
            <div
                ref={outerRef}
                onScroll={handleOuterScroll}
                className="flex-1 overflow-y-scroll snap-y snap-mandatory"
                style={{ scrollbarWidth: "none" }}
            >
                {PROJECTS.map((p, i) => (
                    <ProjectSlide
                        key={p.title}
                        project={p}
                        containerRef={(el) => { slideRefs.current[i] = el; }}
                    />
                ))}
            </div>
        </div>
    );
}
