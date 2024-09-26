<script>
  export let content = ""; // The text to display in the code block
  export let label = ""; // Optional label for accessibility

  // Function to copy the content to clipboard
  function copyToClipboard() {
    navigator.clipboard.writeText(content).then(
      () => {
        console.log("Copied to clipboard:", content);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  }
</script>

<div class="relative mt-4">
  <pre
    class="p-2 bg-gray-100 text-gray-800 rounded overflow-x-auto">{content}</pre>
  <button
    on:click={copyToClipboard}
    class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
    aria-label={`Copy ${label}`}
  >
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
      />
    </svg>
  </button>
</div>
