# rxdb-svelte-kit-example

An example project on how to use [RxDB](https://rxdb.info/) with [svelte-kit](https://kit.svelte.dev/).

Svelte kit is in beta, so this project may break at any time. It is working as of May 1st 2021.

To run this example:

    npm install
    npm run dev

And navigate to http://localhost:3000

The example checks for the `browser` in `$app/env` and doesn't run RxDB on the backend. This means that it will work offline with a SPA that has server side rendering disabled.