<script>
  import InputField from "@/components/InputField.svelte";
  import SelectField from "@/components/SelectField.svelte";
  import TextAreaField from "@/components/TextAreaField.svelte";
  import CopyPasteBlock from "@/components/CopyPasteBlock.svelte";
  import {
    generateHmacSignature,
    makeCurl,
    INITIAL_PARAMS,
    HttpMethod,
    sha512,
  } from "@/lib/hmac-generator";

  const methodOptions = Object.values(HttpMethod).map((method) => ({
    value: method,
    label: method,
  }));

  let params = INITIAL_PARAMS;

  let hmacSignature = "";
  let curlCommand = "";

  const clearSignatureAndCurl = () => {
    hmacSignature = "";
    curlCommand = "";
  };

  const generateSignatureAndCurl = async () => {
    hmacSignature = await generateHmacSignature(params);
    curlCommand = makeCurl(hmacSignature, params);
  };

  let body = "";

  $: if (body !== undefined && body !== null) {
    updateHash();
  }

  async function updateHash() {
    params = {
      ...params,
      xBwellContentSha512: await sha512(body),
    };

    console.log(params.xBwellContentSha512);
  }
</script>

<h1 class="text-4xl font-bold">HMAC Generator</h1>
<p class="mb-5">
  Enter the values below to generate a valid signature and cURL.
</p>

<form
  action="#"
  on:submit={generateSignatureAndCurl}
  id="frmHmacParams"
  class="grid grid-cols-1 gap-6 md:grid-cols-2 mb-5"
>
  <div class="col-span-1 md:col-span-2">
    <InputField id="url" label="URL" bind:value={params.url} />
  </div>
  <SelectField
    id="method"
    label="Method"
    options={methodOptions}
    bind:value={params.method}
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
    id="body"
    label="Body"
    placeholder="Enter body..."
    bind:value={body}
  />
  <TextAreaField
    id="x-bwell-client-user-token"
    label="x-bwell-client-user-token"
    placeholder="Enter user token..."
    bind:value={params.xBwellClientUserToken}
  />
  <button
    on:click={clearSignatureAndCurl}
    id="btn-generate-hmac"
    class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
    type="submit"
  >
    Generate HMAC
  </button>
</form>

{#if hmacSignature}
  <CopyPasteBlock
    id="code-block-signature"
    content={hmacSignature}
    label="HMAC Signature"
  />
{/if}

{#if curlCommand}
  <CopyPasteBlock
    id="code-block-curl-command"
    content={curlCommand}
    label="cURL Command"
  />
{/if}
