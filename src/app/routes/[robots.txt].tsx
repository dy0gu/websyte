import { env } from "~/utils/env";

// Dynamic robots.txt generator route
export const loader = () => {
	const content = `
            User-agent: *
            Allow: /$
            Disallow: /

            Sitemap: ${env.DOMAIN}/sitemap.xml
        `;
	return new Response(content, {
		status: 200,
		headers: {
			"Content-Type": "text/plain",
		},
	});
};
