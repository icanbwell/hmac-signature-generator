export type HmacGeneratorParams = {
    environment: string;
    userId: string;
    request: string;
    xBwellDate: string;
    xBwellClientUserToken: string;
    xBwellClientKey: string;
    xBwellContentSha512: string;
    secret: string;
}

export const INITIAL_PARAMS: HmacGeneratorParams = {
    environment: "client-sandbox",
    request: "data-export",
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
    method: string;
    path: string;
}

function parseUrl(params: HmacGeneratorParams): ParsedUrl {
    // Assemble the host and path
    const host = `user-data-ops.${params.environment}.icanbwell.com`;
    let path = `/users/${params.userId}`;
    let method = "DELETE";

    if (params.request === "data-export") {
        method = "POST";
        path = `/users/${params.userId}/data-exports`;
    }

    return {
        host,
        method,
        path,
    }
}

export async function generateHmacSignature(params: HmacGeneratorParams): Promise<string> {
    const {
        xBwellDate,
        xBwellClientUserToken,
        xBwellClientKey,
        xBwellContentSha512,
        secret,
    } = params;

    const { host, method, path } = parseUrl(params);

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

export const makeCurl = (signature: string, params: HmacGeneratorParams): string => {
    const { host, method, path } = parseUrl(params);

    const curlCommand = `curl --request ${method} \\
        --url https://${host}${path} \\
        --header 'Authorization: HMAC-SHA512 SignedHeaders=x-bwell-date;host;x-bwell-client-user-token;x-bwell-client-key;x-bwell-content-sha512&Signature=${signature}' \\
        --header 'x-bwell-date: ${params.xBwellDate}' \\
        --header 'x-bwell-client-key: ${params.xBwellClientKey}' \\
        --header 'x-bwell-content-sha512: ${params.xBwellContentSha512}' \\
        --header 'x-bwell-client-user-token: ${params.xBwellClientUserToken}' \\
        --header 'accept: application/json'`;

    return curlCommand;
}