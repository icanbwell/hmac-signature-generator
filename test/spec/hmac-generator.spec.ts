import { test, expect } from '@playwright/test';
import { HmacGeneratorPage } from '../page/hmac-generator-page';

test.describe('HMAC Generator Page', () => {
    let hmacGeneratorPage: HmacGeneratorPage;

    test.beforeEach(async ({ page }) => {
        hmacGeneratorPage = new HmacGeneratorPage(page);
        await hmacGeneratorPage.goto();
    });

    test.afterEach(async ({ page }) => {
        await page.reload();
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

    test('Should not generate HMAC signature when required field is empty', async () => {
        await hmacGeneratorPage.fillClientKey('');
        await hmacGeneratorPage.generateSignature();

        // is the client key element marked as invalid?
        const clientKeyInput = hmacGeneratorPage.page.locator(hmacGeneratorPage.clientKeyInput);
        const clientKeyInputIsValid = await clientKeyInput.evaluate((el: HTMLInputElement) => el.checkValidity());
        expect(clientKeyInputIsValid).toBe(false);

        // are the signature and cURL command elements hidden?
        const preSignature = hmacGeneratorPage.page.locator(hmacGeneratorPage.preSignature);
        const preCurl = hmacGeneratorPage.page.locator(hmacGeneratorPage.preCurl);

        expect(preSignature).not.toBeVisible();
        expect(preCurl).not.toBeVisible();
    });
});
