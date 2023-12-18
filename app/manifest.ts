import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		start_url: "/",
		display: "standalone",
		prefer_related_applications: false,
	};
}
