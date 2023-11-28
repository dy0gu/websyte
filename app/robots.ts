import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: "/cadastro",
		},
		sitemap: "https://dy0gu.com/sitemap.xml",
	};
}
