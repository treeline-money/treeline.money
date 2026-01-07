// Plugin registry URL - fetched at build time
const PLUGINS_REGISTRY_URL = "https://raw.githubusercontent.com/treeline-money/treeline-releases/main/plugins.json";

export interface Plugin {
  id: string;
  name: string;
  description: string;
  author: string;
  repo: string;
  featured: boolean;
  status?: 'available' | 'coming-soon';
}

interface PluginRegistry {
  description: string;
  plugins: Plugin[];
}

// Fetch plugins from registry at build time
let _plugins: Plugin[] = [];
let _featuredPlugins: Plugin[] = [];

try {
  const response = await fetch(PLUGINS_REGISTRY_URL);
  if (response.ok) {
    const data: PluginRegistry = await response.json();
    _plugins = data.plugins || [];
    _featuredPlugins = _plugins.filter(p => p.featured);
  }
} catch (e) {
  console.error("Failed to fetch plugin registry:", e);
}

// Coming soon plugins (hardcoded until they have repos)
const comingSoonPlugins: Plugin[] = [
  {
    id: 'net-worth',
    name: 'Net Worth Tracker',
    description: 'Track your total net worth over time. See how your assets and liabilities change month to month.',
    author: 'Treeline',
    repo: '',
    featured: false,
    status: 'coming-soon',
  },
  {
    id: 'fire-calculator',
    name: 'FIRE Calculator',
    description: 'Calculate your path to financial independence based on your actual spending and savings rate.',
    author: 'Treeline',
    repo: '',
    featured: false,
    status: 'coming-soon',
  },
];

// Mark fetched plugins as available
const availablePlugins = _plugins.map(p => ({ ...p, status: 'available' as const }));

export const plugins: Plugin[] = [...availablePlugins, ...comingSoonPlugins];
export const featuredPlugins: Plugin[] = _featuredPlugins;

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
