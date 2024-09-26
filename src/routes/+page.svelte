<script>
  import InputField from "../components/InputField.svelte";
  import SelectField from "../components/SelectField.svelte";
  import TextAreaField from "../components/TextAreaField.svelte";
  import CopyPasteBlock from "../components/CopyPasteBlock.svelte";

  const environmentOptions = [
    { value: "dev", label: "dev" },
    { value: "client-sandbox", label: "client-sandbox" },
    { value: "staging", label: "staging" },
  ];

  const requestOptions = [
    { value: "user-delete", label: "user delete" },
    { value: "data-export", label: "data export" },
  ];

  let environment = "client-sandbox";
  let request = "data-export";
  let userId = "FzwTYDxrfi7%2FUIQp3tSTdw%3D%3D";
  let xBwellDate = new Date().toISOString().slice(0, 16);
  let xBwellContentSha512 =
    "z4PhNX7vuL3xVChQ1m2AB9Yg5AULVxXcg/SpIdNs6c5H0NE8XYXysP+DGNKHfuwvY7kxvUdBeoGlODJ6+SfaPg==";
  let xBwellClientKey = "";
  let xBwellClientUserToken = "";
  let hmacSecret = "";
  let hmacSignature = "";
  let host = "";
  let path = "";
  let curlCommand = "";

  // Generate HMAC signature and cURL command
  async function generate() {
    try {
      // Collect the data to be used in the HMAC
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
        encoder.encode(hmacSecret),
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
      hmacSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));

      // Construct the cURL command
      curlCommand = `curl --request ${method} \\
        --url https://${host}${path} \\
        --header 'Authorization: HMAC-SHA512 SignedHeaders=x-bwell-date;host;x-bwell-client-user-token;x-bwell-client-key;x-bwell-content-sha512&Signature=${hmacSignature}' \\
        --header 'x-bwell-date: ${xBwellDate}' \\
        --header 'x-bwell-client-key: ${xBwellClientKey}' \\
        --header 'x-bwell-content-sha512: ${xBwellContentSha512}' \\
        --header 'x-bwell-client-user-token: ${xBwellClientUserToken}' \\
        --header 'accept: application/json'`;

      console.log("Generated HMAC Signature:", hmacSignature);
    } catch (error) {
      console.error("HMAC generation failed:", error);
    }
  }
</script>

<h1 class="text-4xl font-bold">HMAC Generator</h1>
<p class="mb-5">
  Enter the values below to generate a valid signature and cURL.
</p>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2 mb-5">
  <SelectField
    id="environment"
    label="Environment"
    options={environmentOptions}
    bind:value={environment}
  />
  <SelectField
    id="request"
    label="Request"
    options={requestOptions}
    bind:value={request}
  />
  <InputField
    id="userId"
    label="userId"
    placeholder="Enter user ID..."
    bind:value={userId}
  />
  <InputField
    id="hmacSecret"
    label="HMAC Secret"
    placeholder="Enter HMAC Secret..."
    bind:value={hmacSecret}
  />
  <InputField
    id="x-bwell-date"
    label="x-bwell-date"
    type="datetime-local"
    bind:value={xBwellDate}
  />
  <TextAreaField
    id="x-bwell-client-key"
    label="x-bwell-client-key"
    placeholder="Enter client key..."
    bind:value={xBwellClientKey}
  />
  <TextAreaField
    id="x-bwell-content-sha512"
    label="x-bwell-content-sha512"
    placeholder="Enter content..."
    bind:value={xBwellContentSha512}
  />
  <TextAreaField
    id="x-bwell-client-user-token"
    label="x-bwell-client-user-token"
    placeholder="Enter user token..."
    bind:value={xBwellClientUserToken}
  />
</div>

<button
  on:click={generate}
  class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  Generate HMAC
</button>

{#if hmacSignature}
  <CopyPasteBlock content={hmacSignature} label="HMAC Signature" />
{/if}

{#if curlCommand}
  <CopyPasteBlock content={curlCommand} label="cURL Command" />
{/if}