import "#/app/globals.css";
import type { Preview } from "@storybook/react";
import { Inter } from "next/font/google";
import React from "react";
import { initialize, mswLoader } from "msw-storybook-addon";

const inter = Inter({ subsets: ["latin"] });

initialize();

const preview: Preview = {
	decorators: [
		(Story) => (
			<div className={`${inter.className} contents`}>
				<Story />
			</div>
		),
	],
	loaders: [mswLoader],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		nextjs: {
			appDirectory: true,
		},
	},
};

export default preview;
