<script>
  import InputField from "@/components/InputField.svelte";
  import SelectField from "@/components/SelectField.svelte";
  import TextAreaField from "@/components/TextAreaField.svelte";
  import CopyPasteBlock from "@/components/CopyPasteBlock.svelte";
  import { generate } from "@/lib/hmac-generator";

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
  let curlCommand = "";

  const generateHmacSignature = () => {
    const data = {
      environment,
      request,
      userId,
      xBwellDate,
      xBwellContentSha512,
      xBwellClientKey,
      xBwellClientUserToken,
      hmacSecret,
    };

    const { signature, curl } = generate(data);
    hmacSignature = signature;
    curlCommand = curl;
  };
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
  on:click={generateHmacSignature}
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
