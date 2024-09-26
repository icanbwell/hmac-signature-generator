# hmac-signature-generator

This web app lets you generate an HMAC signature and build a cURL for commands against the `user-data-ops` API.

## Running Locally

Once you've installed dependencies with `npm install`, start a development server:

`npm install`

`npm start`

Navigate to http://localhost:5174/

Many of the values will be populated for you, but you'll need to supply the client key, JWT and HMAC secret. Once all the values are filled in, click "Generate" to see the generated signature and copy a cURL you can paste into your console. 