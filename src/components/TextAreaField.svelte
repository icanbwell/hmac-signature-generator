<script>
  export let id;
  export let label;
  export let placeholder = "";
  export let value = ""; // Use "value" for binding
  export let required = true;

  function handleInput(event) {
    value = event.target.value;
  }
</script>

<div class="flex flex-col">
  <label for={id} class="mb-2 text-gray-700">{label}</label>
  <textarea
    required={required}
    {id}
    {placeholder}
    bind:value
    on:input={handleInput}
    class="p-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
  ></textarea>
</div>
