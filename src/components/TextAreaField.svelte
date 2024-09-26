<script>
  export let id;
  export let label;
  export let placeholder = "";
  export let bindValue;
</script>

<div class="flex flex-col">
  <label for={id} class="mb-2 text-gray-700">{label}</label>
  <textarea
    {id}
    {placeholder}
    bind:value={bindValue}
    class="p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  ></textarea>
</div>
