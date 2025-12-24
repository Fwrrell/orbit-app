import { Network, Github } from "lucide-react";

export function Footer() {
  const sha = import.meta.env.VERCEL_GIT_COMMIT_SHA;
  const owner = import.meta.env.VERCEL_GIT_REPO_OWNER;
  const repo = import.meta.env.VERCEL_GIT_REPO_SLUG;

  const shortSha = sha?.slice(0, 7);

  const repoUrl = owner && repo ? `https://github.com/${owner}/${repo}` : null;

  const commitUrl =
    owner && repo && sha
      ? `https://github.com/${owner}/${repo}/commit/${sha}`
      : null;

  return (
    <footer className="py-20 border-t border-white/5 px-8 lg:px-20 text-center">
      <div className="flex items-center justify-center gap-3 mb-8 opacity-50">
        <Network className="text-[#aec3b0] w-5 h-5" />
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
      <p className="text-sm text-[#aec3b0]/40 font-mono">
        © 2025 — ALL RIGHTS RESERVED
      </p>
    </footer>
  );
}
