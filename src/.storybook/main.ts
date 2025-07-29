import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
	stories: ["../**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		"@storybook/addon-a11y",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"storybook-addon-module-mock",
	],
	framework: {
		name: "@storybook/nextjs",
		options: {},
	},
	staticDirs: ["../public"],
	core: {
		disableTelemetry: true,
	},
	env: (config) => ({
		...config,
		GOOGLE_API_KEY: "abcdefghijklmnopqrstuvwxyz",
		NEXT_PUBLIC_SUPABASE_URL: "https://abcdefghijkl.supabase.co",
		NEXT_PUBLIC_SUPABASE_ANON_KEY: "abcdefghijklmnopqrstuvwxyz",
		POSTGRES_URL: "postgresql://postgres:password@localhost:5432/postgres",
	}),
	features: {
		experimentalRSC: true,
	},
	webpackFinal: async (config) => ({
		...config,
		resolve: {
			...config.resolve,
			alias: {
				...config.resolve?.alias,
				pg: require.resolve("#/__mocks__/pg.ts"),
			},
		},
	}),
};
export default config;
