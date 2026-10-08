export const siteName = 'Diogo Simões';

export const titleSuffix = `- ${siteName}`;

export function withSiteTitle(title?: string | null): string {
  return title ? `${title} | ${siteName}` : siteName;
}
