import { env } from "~/utils/env";
import { txt } from "remix-utils/responses";

// Dynamic robots.txt generator route
export function loader() {
	return txt(`User-agent: *
		Allow: /$
		Disallow: /

		Sitemap: ${env.DOMAIN}/sitemap.xml
		`);
}
