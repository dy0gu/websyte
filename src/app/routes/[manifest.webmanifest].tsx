import info from "~/configs/info";

// Dynamic manifest.webmanifest generator route.
export const loader = () => {
    const content = `
        {
            "name": "${info.name}",
            "short_name": "${info.name}",
            "description": "${info.description}",
            "start_url": "/",
            "icons": [
                {
                    "src": "/favicon.svg",
                    "sizes": "any",
                    "type": "image/svg+xml"
                }
            ]
        }
        `;
    return new Response(content, {
        status: 200,
        headers: {
            "Content-Type": "application/manifest+json",
        },
    });
};
