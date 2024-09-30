import { describe, it, expect } from 'vitest';
import { generateHmacSignature, makeCurl, INITIAL_PARAMS } from './hmac-generator';
import type { HmacGeneratorParams } from './hmac-generator';

describe('generateHmacSignature', () => {
    it('should generate a valid HMAC signature', async () => {
        const params: HmacGeneratorParams = {
            ...INITIAL_PARAMS,
            secret: 'test-secret',
            xBwellClientKey: 'test-client-key',
            xBwellClientUserToken: 'test-user-token',
        };

        const signature = await generateHmacSignature(params);
        expect(signature).toBeDefined();
    });
})

describe('makeCurl', () => {
    it('should generate a valid cURL command', async () => {
        const params: HmacGeneratorParams = {
            ...INITIAL_PARAMS,
            secret: 'test-secret',
            xBwellClientKey: 'test-client-key',
            xBwellClientUserToken: 'test-user-token',
        };

        const signature = await generateHmacSignature(params);
        const curlCommand = makeCurl(signature, params);

        expect(curlCommand).toContain(`--request ${params.method}`);
        expect(curlCommand).toContain(params.url);
        expect(curlCommand).toContain(`Authorization: HMAC-SHA512 SignedHeaders=x-bwell-date;host;x-bwell-client-user-token;x-bwell-client-key;x-bwell-content-sha512&Signature=${signature}`);
        expect(curlCommand).toContain(`x-bwell-date: ${params.xBwellDate}`);
        expect(curlCommand).toContain(`x-bwell-client-key: ${params.xBwellClientKey}`);
        expect(curlCommand).toContain(`x-bwell-content-sha512: ${params.xBwellContentSha512}`);
        expect(curlCommand).toContain(`x-bwell-client-user-token: ${params.xBwellClientUserToken}`);
    });
});
