# hmac-signature-generator

This web app lets you generate an HMAC signature and build a cURL for commands against the `user-data-ops` API.

## Running Locally

Once you've created a project and installed dependencies with `npm install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Many of the values will be populated for you, but you'll need to supply the client key, JWT and HMAC secret. Once all the values are filled in, click "Generate" to see the generated signature and copy a cURL you can paste into your console. 