import { env } from "../utils/env";

enum Frequency {
	Always = "always",
	Hourly = "hourly",
	Daily = "daily",
	Weekly = "weekly",
	Monthly = "monthly",
	Yearly = "yearly",
	Never = "never",
}

// Dynamic sitemap.xml generator route
export const loader = () => {
	const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
	<loc>${env.DOMAIN}</loc>
	<lastmod>${new Date().toISOString()}</lastmod>
	<changefreq>${Frequency.Weekly}</changefreq>
	<priority>1.0</priority>
	</url>
</urlset>
`;
	return new Response(content, {
		status: 200,
		headers: {
			"Content-Type": "application/xml",
		},
	});
};
