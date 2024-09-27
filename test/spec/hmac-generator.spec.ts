import { test, expect } from '@playwright/test';
import { HmacGeneratorPage } from '../page/hmac-generator-page';

test.describe('HMAC Generator Page', () => {
    let hmacGeneratorPage: HmacGeneratorPage;

    test.beforeEach(async ({ page }) => {
        hmacGeneratorPage = new HmacGeneratorPage(page);
        await hmacGeneratorPage.goto();
    });

    test('should generate HMAC signature and cURL command', async () => {
        await hmacGeneratorPage.fillClientKey('test-client-key');
        await hmacGeneratorPage.fillClientUserToken('test-user-token');
        await hmacGeneratorPage.fillHmacSecret('test-secret');
        await hmacGeneratorPage.generateSignature();

        const hmacSignature = await hmacGeneratorPage.getHmacSignature();
        const curlCommand = await hmacGeneratorPage.getCurlCommand();

        expect(hmacSignature).toBeDefined();
        expect(hmacSignature).not.toBe('');
        expect(curlCommand).toContain('--request POST');
        expect(curlCommand).toContain('https://user-data-ops.client-sandbox.icanbwell.com');
    });
});
