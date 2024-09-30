<script>
  export let id;
  export let label;
  export let options = [];
  export let value = ""; 

  function handleChange(event) {
    value = event.target.value;
  }
</script>

<div class="flex flex-col">
  <label for={id} class="mb-2 text-gray-700">{label}</label>
  <select
    {id}
    bind:value
    on:change={handleChange}
    class="p-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
  >
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
</div>
