export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
    CONNECT = "CONNECT",
    TRACE = "TRACE",
}

export type HmacGeneratorParams = {
    url: string;
    method: HttpMethod;
    userId: string;
    xBwellDate: string;
    xBwellClientUserToken: string;
    xBwellClientKey: string;
    xBwellContentSha512: string;
    secret: string;
}

export const INITIAL_PARAMS: HmacGeneratorParams = {
    url: "",
    method: HttpMethod.POST,
    userId: "FzwTYDxrfi7%2FUIQp3tSTdw%3D%3D",
    xBwellDate: new Date().toISOString().slice(0, 16),
    xBwellContentSha512:
        "z4PhNX7vuL3xVChQ1m2AB9Yg5AULVxXcg/SpIdNs6c5H0NE8XYXysP+DGNKHfuwvY7kxvUdBeoGlODJ6+SfaPg==",
    xBwellClientKey: "",
    xBwellClientUserToken: "",
    secret: "",
}

interface ParsedUrl {
    host: string;
    path: string;
}

function parseUrl(url: string): ParsedUrl {
    const parsedUrl = new URL(url);
    const host = parsedUrl.host;
    const path = parsedUrl.pathname;

    return { host, path };
}

export async function generateHmacSignature(params: HmacGeneratorParams): Promise<string> {
    const {
        url,
        xBwellDate,
        xBwellClientUserToken,
        xBwellClientKey,
        xBwellContentSha512,
        method,
        secret,
    } = params;

    const { host, path } = parseUrl(url);

    // Assemble the string to sign
    const stringToSign = [
        method.toUpperCase(),
        path,
        `${xBwellDate};${host};${xBwellClientUserToken};${xBwellClientKey};${xBwellContentSha512}`,
    ].join("\n");

    // Encode the data and the key
    const encoder = new TextEncoder();
    const key = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-512" },
        false,
        ["sign"]
    );

    // Generate the HMAC signature
    const signature = await window.crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(stringToSign)
    );

    // Convert ArrayBuffer to base64 string
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

export async function sha512(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const makeCurl = (signature: string, params: HmacGeneratorParams): string => {
    const curlCommand = `curl --request ${params.method} \\
        --url ${params.url} \\
        --header 'Authorization: HMAC-SHA512 SignedHeaders=x-bwell-date;host;x-bwell-client-user-token;x-bwell-client-key;x-bwell-content-sha512&Signature=${signature}' \\
        --header 'x-bwell-date: ${params.xBwellDate}' \\
        --header 'x-bwell-client-key: ${params.xBwellClientKey}' \\
        --header 'x-bwell-content-sha512: ${params.xBwellContentSha512}' \\
        --header 'x-bwell-client-user-token: ${params.xBwellClientUserToken}' \\
        --header 'accept: application/json'`;

    return curlCommand;
}