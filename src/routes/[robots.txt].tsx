import { txt } from "remix-utils/responses";
import { env } from "~/utils/env";

// Dynamic robots.txt generator route
export function loader() {
	return txt(`User-agent: *
Disallow:

Sitemap: ${env.DOMAIN}/sitemap.xml`);
}
