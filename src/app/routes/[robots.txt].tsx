// import env from "~/utils/env";

const env = {
    WEBSITE_DOMAIN: "https://nei.dei.uc.pt",
};

// Dynamic robots.txt generator route
export const loader = () => {
    const content = `
            User-agent: *
            Allow: /$
            Disallow: /

            Sitemap: ${env.WEBSITE_DOMAIN}/sitemap.xml
        `;
    return new Response(content, {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
        },
    });
};
