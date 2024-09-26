<h1>HMAC Generator</h1>
<p>Enter the values below to generate a valid signature and cURL.</p>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
  <div class="flex flex-col">
    <label for="x-bwell-date" class="mb-2">x-bwell-date</label>
    <input
      type="datetime-local"
      placeholder="Enter date..."
      id="x-bwell-date"
      class="p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div class="flex flex-col">
    <label for="x-bwell-client-key" class="mb-2">x-bwell-client-key</label>
    <textarea
      placeholder="Enter client key..."
      id="x-bwell-client-key"
      class="p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    ></textarea>
  </div>
</div>
