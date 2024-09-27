<script>
  import InputField from "@/components/InputField.svelte";
  import SelectField from "@/components/SelectField.svelte";
  import TextAreaField from "@/components/TextAreaField.svelte";
  import CopyPasteBlock from "@/components/CopyPasteBlock.svelte";
  import { generateHmacSignature, makeCurl, INITIAL_PARAMS } from "@/lib/hmac-generator";

  const environmentOptions = [
    { value: "dev", label: "dev" },
    { value: "client-sandbox", label: "client-sandbox" },
    { value: "staging", label: "staging" },
  ];

  const requestOptions = [
    { value: "user-delete", label: "user delete" },
    { value: "data-export", label: "data export" },
  ];

  let params = INITIAL_PARAMS;
  let hmacSignature = "";
  let curlCommand = "";

  const generateSignatureAndCurl = async () => {
    hmacSignature = "";
    curlCommand = "";
    hmacSignature = await generateHmacSignature(params);
    curlCommand = makeCurl(hmacSignature, params);
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
    bind:value={params.environment}
  />
  <SelectField
    id="request"
    label="Request"
    options={requestOptions}
    bind:value={params.request}
  />
  <InputField
    id="userId"
    label="userId"
    placeholder="Enter user ID..."
    bind:value={params.userId}
  />
  <InputField
    id="secret"
    label="HMAC Secret"
    placeholder="Enter HMAC Secret..."
    bind:value={params.secret}
  />
  <InputField
    id="x-bwell-date"
    label="x-bwell-date"
    type="datetime-local"
    bind:value={params.xBwellDate}
  />
  <TextAreaField
    id="x-bwell-client-key"
    label="x-bwell-client-key"
    placeholder="Enter client key..."
    bind:value={params.xBwellClientKey}
  />
  <TextAreaField
    id="x-bwell-content-sha512"
    label="x-bwell-content-sha512"
    placeholder="Enter content..."
    bind:value={params.xBwellContentSha512}
  />
  <TextAreaField
    id="x-bwell-client-user-token"
    label="x-bwell-client-user-token"
    placeholder="Enter user token..."
    bind:value={params.xBwellClientUserToken}
  />
</div>

<button
  on:click={generateSignatureAndCurl}
  id="btn-generate-hmac"
  class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
>
  Generate HMAC
</button>

{#if hmacSignature}
  <CopyPasteBlock id="code-block-signature" content={hmacSignature} label="HMAC Signature" />
{/if}

{#if curlCommand}
  <CopyPasteBlock id="code-block-curl-command" content={curlCommand} label="cURL Command" />
{/if}
