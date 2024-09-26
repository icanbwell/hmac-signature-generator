<script>
  export let id;
  export let label;
  export let type = "text";
  export let placeholder = "";
  export let value = ""; 

  const handleInput = (e) => {
    // Handle different input types accordingly
    value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
  };
</script>

<div class="flex flex-col">
  <label for={id} class="mb-2 text-gray-700">{label}</label>
  <input
    {id}
    {type}
    {placeholder}
    {value}
    on:input={handleInput}
    class="p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
