import type { Config } from "tailwindcss";

const config: Config = {
	content: ["src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				mono: ["Roboto Mono"],
			},
			animation: {
				title: "title 3s ease-out forwards",
				"fade-in": "fade-in 3s ease-in-out forwards",
				"fade-left": "fade-left 3s ease-in-out forwards",
				"fade-right": "fade-right 3s ease-in-out forwards",
				"fade-blink": "fade-blink 1s ease-in-out infinite",
			},
			keyframes: {
				title: {
					"0%": {
						"line-height": "0%",
						"letter-spacing": "0.25em",
						opacity: "0",
					},
					"25%": {
						"line-height": "0%",
						opacity: "0%",
					},
					"80%": {
						opacity: "100%",
					},

					"100%": {
						"line-height": "100%",
						opacity: "100%",
					},
				},
				"fade-in": {
					"0%": {
						opacity: "0%",
					},
					"75%": {
						opacity: "0%",
					},
					"100%": {
						opacity: "100%",
					},
				},
				"fade-left": {
					"0%": {
						transform: "translateX(100%)",
						opacity: "0%",
					},

					"30%": {
						transform: "translateX(0%)",
						opacity: "100%",
					},
					"100%": {
						opacity: "0%",
					},
				},
				"fade-right": {
					"0%": {
						transform: "translateX(-100%)",
						opacity: "0%",
					},

					"30%": {
						transform: "translateX(0%)",
						opacity: "100%",
					},
					"100%": {
						opacity: "0%",
					},
				},
				"fade-blink": {
					"0%, 100%": { opacity: "100%" },
					"50%": { opacity: "0%" },
				},
			},
		},
	},
};

export default config;
