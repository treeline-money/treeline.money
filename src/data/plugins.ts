export interface Plugin {
  id: string;
  name: string;
  description: string;
  repo: string;
}

export const plugins: Plugin[] = [
  {
    id: "emergency-fund",
    name: "Emergency Fund",
    description: "See how long your emergency fund would last based on your actual spending patterns.",
    repo: "https://github.com/treeline-money/plugin-emergency-fund"
  },
  {
    id: "goals",
    name: "Savings Goals",
    description: "Set savings targets and track your progress toward each goal.",
    repo: "https://github.com/treeline-money/plugin-goals"
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    description: "Automatically detects recurring charges from your transaction history.",
    repo: "https://github.com/treeline-money/plugin-subscriptions"
  },
  {
    id: "cashflow",
    name: "Cash Flow",
    description: "Plan ahead by scheduling expected income and expenses.",
    repo: "https://github.com/treeline-money/plugin-cashflow"
  }
];

export function getPlugin(id: string): Plugin | undefined {
  return plugins.find(p => p.id === id);
}

export function getAllPluginIds(): string[] {
  return plugins.map(p => p.id);
}

/**
 * Convert a GitHub repo URL to the raw content URL for PLUGIN_PREVIEW.md
 */
export function getPreviewMarkdownUrl(repo: string): string {
  // https://github.com/treeline-money/plugin-goals ->
  // https://raw.githubusercontent.com/treeline-money/plugin-goals/main/PLUGIN_PREVIEW.md
  const match = repo.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return '';
  const [, owner, repoName] = match;
  return `https://raw.githubusercontent.com/${owner}/${repoName}/main/PLUGIN_PREVIEW.md`;
}

/**
 * Convert relative image/link paths in markdown to absolute GitHub raw URLs
 */
export function resolveMarkdownPaths(markdown: string, repo: string): string {
  const match = repo.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return markdown;
  const [, owner, repoName] = match;
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repoName}/main`;
  const githubBase = `https://github.com/${owner}/${repoName}/blob/main`;

  // Replace relative image paths: ![alt](./path) or ![alt](path)
  let resolved = markdown.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/)\.?\/?([^)]+)\)/g,
    `![$1](${rawBase}/$2)`
  );

  // Replace relative link paths: [text](./path) or [text](path)
  // But not anchors like [text](#anchor)
  resolved = resolved.replace(
    /\[([^\]]+)\]\((?!https?:\/\/)(?!#)\.?\/?([^)]+)\)/g,
    `[$1](${githubBase}/$2)`
  );

  return resolved;
}
