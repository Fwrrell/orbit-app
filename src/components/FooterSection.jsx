import { Github } from "lucide-react";

export function FooterSection() {
  const sha = import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA;
  const owner = import.meta.env.VITE_VERCEL_GIT_REPO_OWNER;
  const repo = import.meta.env.VITE_VERCEL_GIT_REPO_SLUG;

  const shortSha = sha?.slice(0, 7);

  const repoUrl = owner && repo ? `https://github.com/${owner}/${repo}` : null;

  const commitUrl =
    owner && repo && sha
      ? `https://github.com/${owner}/${repo}/commit/${sha}`
      : null;

  return (
    <footer className="pb-20 pt-10 border-t border-white/10 px-8 lg:px-20 text-center font-display">
      <div className="flex items-center justify-center gap-3 mb-8 opacity-50">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              src="/orbit-logo.png"
              alt="Orbit Logo"
              className="h-24 w-auto object-contain transition-transform"
            />
          </a>
        </div>
        <span className="text-sm font-bold tracking-[0.3em] text-white">
          ORBIT PROJECT
        </span>
      </div>

      {/* Source & Commit */}
      {(repoUrl || commitUrl) && (
        <div className="mb-6 flex items-center justify-center gap-4 text-xs font-mono text-[#aec3b0]/50">
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#aec3b0] transition-colors"
            >
              <Github className="w-4 h-4" />
              Source
            </a>
          )}

          {repoUrl && commitUrl && <span>·</span>}

          {commitUrl && (
            <a
              href={commitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#aec3b0] transition-colors"
            >
              Commit {shortSha}
            </a>
          )}
        </div>
      )}

      {/* Copyright */}
      <p className="text-sm text-[#aec3b0]/40 font-semibold">
        © 2025 — ALL RIGHTS RESERVED
      </p>
    </footer>
  );
}
