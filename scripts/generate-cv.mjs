import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../public/ryan-rafael-cv.pdf");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: "Calibri", "Arial", sans-serif;
    font-size: 10.5pt;
    color: #111;
    background: #fff;
    padding: 36pt 44pt;
    line-height: 1.45;
  }

  /* ── Header ── */
  .name {
    font-size: 22pt;
    font-weight: 700;
    letter-spacing: 0.02em;
    margin-bottom: 3pt;
  }
  .tagline {
    font-size: 10.5pt;
    color: #555;
    margin-bottom: 6pt;
  }
  .contacts {
    font-size: 9.5pt;
    color: #333;
    display: flex;
    flex-wrap: wrap;
    gap: 0 18pt;
    margin-bottom: 2pt;
  }
  .contacts a { color: #333; text-decoration: none; }

  /* ── Section ── */
  .section { margin-top: 14pt; }
  .section-title {
    font-size: 10pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 1.2pt solid #111;
    padding-bottom: 2pt;
    margin-bottom: 8pt;
  }

  /* ── Entry ── */
  .entry { margin-bottom: 9pt; }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .entry-title { font-weight: 700; font-size: 10.5pt; }
  .entry-date  { font-size: 9.5pt; color: #555; white-space: nowrap; }
  .entry-sub   { font-size: 9.5pt; color: #444; margin-top: 1pt; }
  .entry-body  { margin-top: 3pt; }

  ul { padding-left: 14pt; }
  ul li { margin-bottom: 2pt; font-size: 10pt; }

  /* ── Skills ── */
  .skills-grid { display: grid; grid-template-columns: 100pt 1fr; gap: 4pt 0; font-size: 10pt; }
  .skills-label { font-weight: 600; color: #333; }
  .skills-value { color: #111; }

  /* ── Projects ── */
  .proj-tech { font-size: 9pt; color: #555; font-style: italic; }
</style>
</head>
<body>

<!-- ═══════════ HEADER ═══════════ -->
<div class="name">Ryan Rafael</div>
<div class="tagline">Operations &amp; System Development Staff · Full-Stack Developer</div>
<div class="contacts">
  <span>ryan.rafael2004@gmail.com</span>
  <span>+62 821-5783-7123</span>
  <span>linkedin.com/in/yanrfl</span>
  <span>yan-rfl.com</span>
  <span>Tangerang, Banten, Indonesia</span>
</div>

<!-- ═══════════ SUMMARY ═══════════ -->
<div class="section">
  <div class="section-title">Professional Summary</div>
  <p style="font-size:10pt;">
    Detail-oriented software and systems professional with hands-on experience designing,
    building, and maintaining full-stack web applications and IT infrastructure at Bina
    Nusantara University. Comfortable working across the entire stack — from backend APIs
    and relational databases to React frontends and Linux server administration. Proven
    ability to deliver production systems under tight deadlines and to collaborate
    cross-functionally on data-driven operational tools.
  </p>
</div>

<!-- ═══════════ EXPERIENCE ═══════════ -->
<div class="section">
  <div class="section-title">Work Experience</div>

  <div class="entry">
    <div class="entry-header">
      <span class="entry-title">Operations &amp; System Development Staff</span>
      <span class="entry-date">Aug 2024 – Present</span>
    </div>
    <div class="entry-sub">Bina Nusantara University · Alam Sutera Campus · Full-time</div>
    <div class="entry-body">
      <ul>
        <li>Design and develop internal full-stack web systems to automate laboratory operations and reduce manual reporting overhead.</li>
        <li>Built <strong>Ping!</strong> — an AI-powered communication and reporting platform using RAG (Retrieval-Augmented Generation) that centralises lab support channels and reduces repetitive queries to the OSD team.</li>
        <li>Maintain Linux servers, Proxmox hypervisors, Nginx reverse proxies, and campus network infrastructure, ensuring high availability for academic and administrative services.</li>
        <li>Implement CI/CD pipelines with GitHub Actions and Docker to streamline deployments and minimise downtime during releases.</li>
        <li>Collaborate with faculty and operations stakeholders to gather requirements and iterate on system improvements.</li>
      </ul>
    </div>
  </div>
</div>

<!-- ═══════════ EDUCATION ═══════════ -->
<div class="section">
  <div class="section-title">Education</div>

  <div class="entry">
    <div class="entry-header">
      <span class="entry-title">Bachelor of Science in Information Systems</span>
      <span class="entry-date">Expected Feb 2026</span>
    </div>
    <div class="entry-sub">Bina Nusantara University · Alam Sutera Campus</div>
  </div>
</div>

<!-- ═══════════ SKILLS ═══════════ -->
<div class="section">
  <div class="section-title">Technical Skills</div>
  <div class="skills-grid">
    <span class="skills-label">Languages</span>
    <span class="skills-value">JavaScript, TypeScript, PHP, Python, Bash</span>

    <span class="skills-label">Frontend</span>
    <span class="skills-value">React, Next.js, Astro, Tailwind CSS, HTML/CSS</span>

    <span class="skills-label">Backend &amp; DB</span>
    <span class="skills-value">Node.js, Express.js, MySQL, PostgreSQL, MariaDB</span>

    <span class="skills-label">Infrastructure</span>
    <span class="skills-value">Linux, Docker, Nginx, Proxmox, Git, GitHub Actions</span>
  </div>
</div>

<!-- ═══════════ PROJECTS ═══════════ -->
<div class="section">
  <div class="section-title">Projects</div>

  <div class="entry">
    <div class="entry-header">
      <span class="entry-title">Ping! — Lab Communication &amp; Reporting System</span>
      <span class="entry-date">2026</span>
    </div>
    <div class="proj-tech">Next.js · Tailwind CSS · Express.js · MySQL</div>
    <div class="entry-body">
      <ul>
        <li>Centralised previously scattered communication channels for LCAS laboratory operations into a single platform.</li>
        <li>Implemented Ping! Bot, an AI assistant using RAG to resolve common issues instantly, cutting repetitive support requests.</li>
      </ul>
    </div>
  </div>

  <div class="entry">
    <div class="entry-header">
      <span class="entry-title">Backup LCAS — File Management &amp; Backup Platform</span>
      <span class="entry-date">2025</span>
    </div>
    <div class="proj-tech">Next.js · Tailwind CSS · Express.js · MySQL &nbsp;|&nbsp; Role: Backend Developer</div>
    <div class="entry-body">
      <ul>
        <li>Engineered the backend API for a university-wide backup and file-management system serving students and faculty.</li>
        <li>Designed ticketing system for staff backup requests, reducing ad-hoc requests by providing a structured workflow.</li>
      </ul>
    </div>
  </div>

  <div class="entry">
    <div class="entry-header">
      <span class="entry-title">Miserease — Social Story-Sharing Platform</span>
      <span class="entry-date">2024</span>
    </div>
    <div class="proj-tech">React · Tailwind CSS · TypeScript &nbsp;|&nbsp; Role: Backend Developer &nbsp;|&nbsp; GarudaHacks 4.0</div>
    <div class="entry-body">
      <ul>
        <li>Built backend services for a hackathon web app inspired by Social Comparison Theory, enabling users to share problems and find peer connection.</li>
      </ul>
    </div>
  </div>

  <div class="entry">
    <div class="entry-header">
      <span class="entry-title">Codehub — Programmer Community Website</span>
      <span class="entry-date">2024</span>
    </div>
    <div class="proj-tech">HTML · CSS &nbsp;|&nbsp; Role: Frontend Developer</div>
    <div class="entry-body">
      <ul>
        <li>Developed a commercial community platform for programmers featuring weekly training sessions and skill exercises.</li>
      </ul>
    </div>
  </div>
</div>

<!-- ═══════════ LANGUAGES ═══════════ -->
<div class="section">
  <div class="section-title">Languages</div>
  <div class="skills-grid">
    <span class="skills-label">Indonesian</span><span class="skills-value">Native</span>
    <span class="skills-label">English</span><span class="skills-value">Fluent</span>
    <span class="skills-label">Chinese</span><span class="skills-value">Basic</span>
    <span class="skills-label">Japanese</span><span class="skills-value">Basic</span>
  </div>
</div>

</body>
</html>`;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle0" });
await page.pdf({
  path: outPath,
  format: "A4",
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
});
await browser.close();
console.log("CV written to", outPath);
