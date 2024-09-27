export interface HmacGeneratorParams {
    environment: string;
    userId: string;
    request: string;
    xBwellDate: string;
    host: string;
    xBwellClientUserToken: string;
    xBwellClientKey: string;
    xBwellContentSha512: string;
    secret: string;
}

export async function generate(params: HmacGeneratorParams): Promise<string> {
    const {
        environment,
        userId,
        request,
        xBwellDate,
        xBwellClientUserToken,
        xBwellClientKey,
        xBwellContentSha512,
        secret,
    } = params;

    // Assemble the host and path
    const host = `user-data-ops.${environment}.icanbwell.com`;
    let path = `/users/${userId}`;
    let method = "DELETE";

    if (request === "data-export") {
        method = "POST";
        path = `/users/${userId}/data-exports`;
    }

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
    const curlCommand = `curl --request ${params.method} \\
        --url https://${params.host}${params.path} \\
        --header 'Authorization: HMAC-SHA512 SignedHeaders=x-bwell-date;host;x-bwell-client-user-token;x-bwell-client-key;x-bwell-content-sha512&Signature=${signature}' \\
        --header 'x-bwell-date: ${params.xBwellDate}' \\
        --header 'x-bwell-client-key: ${params.xBwellClientKey}' \\
        --header 'x-bwell-content-sha512: ${params.xBwellContentSha512}' \\
        --header 'x-bwell-client-user-token: ${params.xBwellClientUserToken}' \\
        --header 'accept: application/json'`;

    return curlCommand;
}