// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom', // Use a browser-like environment in tests
        include: ['src/**/*.{test,spec}.{js,ts}'], // Only run tests in the 'src' directory
    },
});
