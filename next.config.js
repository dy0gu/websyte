// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
	compiler: {
		reactRemoveProperties: true,
		removeConsole: true,
		styledComponents: {
			displayName: false,
			minify: true,
			pure: true,
		},
	},
	optimizeFonts: true,
	productionBrowserSourceMaps: true,
	swcMinify: true,
};

module.exports = nextConfig;
