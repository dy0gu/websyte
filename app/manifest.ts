import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Dy0gu",
		short_name: "Dy0gu",
		start_url: "/",
		display: "standalone",
		background_color: "#000000",
		theme_color: "#000000",
	};
}
