// /tests/pages/HmacGeneratorPage.ts
import { Page } from '@playwright/test';

export class HmacGeneratorPage {
    readonly page: Page;
    readonly urlInput: string;
    readonly methodSelect: string;
    readonly userIdInput: string;
    readonly hmacSecretInput: string;
    readonly generateButton: string;
    readonly preSignature: string;
    readonly preCurl: string;
    readonly clientKeyInput: string;
    readonly clientUserTokenInput: string;

    constructor(page: Page) {
        this.page = page;
        this.urlInput = '#url';
        this.methodSelect = '#method';
        this.userIdInput = '#userId';
        this.hmacSecretInput = '#secret';
        this.generateButton = '#btn-generate-hmac';
        this.preSignature = '#code-block-signature';
        this.preCurl = '#code-block-curl-command';
        this.clientKeyInput = '#x-bwell-client-key';
        this.clientUserTokenInput = '#x-bwell-client-user-token';
    }

    async goto() {
        await this.page.goto('/');
    }

    async enterUrl(url: string) {
        await this.page.fill(this.urlInput, url);
    }

    async selectMethod(value: string) {
        await this.page.selectOption(this.methodSelect, { value });
    }

    async fillUserId(userId: string) {
        await this.page.fill(this.userIdInput, userId);
    }

    async fillHmacSecret(secret: string) {
        await this.page.fill(this.hmacSecretInput, secret);
    }

    async generateSignature() {
        await this.page.click(this.generateButton);
    }

    async getHmacSignature() {
        return this.page.locator(this.preSignature).innerText();
    }

    async getCurlCommand() {
        return this.page.locator(this.preCurl).innerText();
    }

    async fillClientKey(clientKey: string) {
        await this.page.fill(this.clientKeyInput, clientKey);
    }

    async fillClientUserToken(clientUserToken: string) {
        await this.page.fill(this.clientUserTokenInput, clientUserToken);
    }
}
