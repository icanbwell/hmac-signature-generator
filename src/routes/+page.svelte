<script>
  let environment = "client-sandbox";
  let request = "data-export";
  let userId = "FzwTYDxrfi7%2FUIQp3tSTdw%3D%3D";
  let xBwellDate = new Date().toISOString().slice(0, 16);
  let xBwellContentSha512 =
    "z4PhNX7vuL3xVChQ1m2AB9Yg5AULVxXcg/SpIdNs6c5H0NE8XYXysP+DGNKHfuwvY7kxvUdBeoGlODJ6+SfaPg==";
  let xBwellClientKey = "";
  let xBwellClientUserToken = "";
  let hmacSignature = "";
  let host = "";
  let path = "";

  // Generate HMAC signature
  async function generateHmac() {
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
  <div class="flex flex-col">
    <label for="environment" class="mb-2 text-gray-700">Environment</label>
    <select
      id="environment"
      bind:value={environment}
      class="p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="dev">dev</option>
      <option value="client-sandbox">client-sandbox</option>
      <option value="staging">staging</option>
    </select>
  </div>

  <div class="flex flex-col">
    <label for="request" class="mb-2 text-gray-700">Request</label>
    <select
      id="request"
      bind:value={request}
      class="p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="user-delete">user delete</option>
      <option value="data-export">data export</option>
    </select>
  </div>

  <div class="flex flex-col">
    <label for="userId" class="mb-2 text-gray-700">userId</label>
    <input
      type="text"
      placeholder="Enter user ID..."
      id="userId"
      bind:value={userId}
      class="p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div class="flex flex-col">
    <label for="hmacSecret" class="mb-2 text-gray-700">HMAC Secret</label>
    <input
      type="text"
      placeholder="Enter HMAC Secret..."
      id="hmacSecret"
      bind:value={hmacSecret}
      class="p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div class="flex flex-col">
    <label for="x-bwell-date" class="mb-2 text-gray-700">x-bwell-date</label>
    <input
      type="datetime-local"
      id="x-bwell-date"
      bind:value={xBwellDate}
      class="p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div class="flex flex-col">
    <label for="x-bwell-client-key" class="mb-2 text-gray-700"
      >x-bwell-client-key</label
    >
    <textarea
      placeholder="Enter client key..."
      id="x-bwell-client-key"
      bind:value={xBwellClientKey}
      class="p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    ></textarea>
  </div>

  <div class="flex flex-col">
    <label for="x-bwell-content-sha512" class="mb-2 text-gray-700"
      >x-bwell-content-sha512</label
    >
    <textarea
      placeholder="Enter content..."
      id="x-bwell-content-sha512"
      bind:value={xBwellContentSha512}
      class="p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    ></textarea>
  </div>

  <div class="flex flex-col">
    <label for="x-bwell-client-user-token" class="mb-2 text-gray-700"
      >x-bwell-client-user-token</label
    >
    <textarea
      placeholder="Enter user token..."
      id="x-bwell-client-user-token"
      bind:value={xBwellClientUserToken}
      class="p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    ></textarea>
  </div>
</div>

<button
  on:click={generateHmac}
  class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  Generate HMAC
</button>

<!-- Display the generated HMAC signature -->
{#if hmacSignature}
  <p class="mt-4 text-gray-700">Generated HMAC: {hmacSignature}</p>
{/if}
