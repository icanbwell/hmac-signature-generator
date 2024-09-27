import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview', // command to start the app running on localhost
		port: 4173, // use port 4173
	},
	testDir: 'test', // look for test files in the test directory
	testMatch: /(.+\.)?(test|spec)\.[jt]s/, // look for .spec.ts and .test.ts files
	reporter: [
		['html', { outputFolder: 'playwright-report' }], // Generate HTML report
	],
	use: {
		video: 'on', // record video of the tests
		launchOptions: {
			slowMo: 300, // slow the tests down a bit to make the video watchable
		}
	}
};

export default config;
