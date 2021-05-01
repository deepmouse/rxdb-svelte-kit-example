# rxdb-svelte-kit-example

An example project on how to use [RxDB](https://rxdb.info/) with [svelte-kit](https://kit.svelte.dev/).

Svelte kit is in beta, so this project may break at any time. It is working as of May 1st 2021.

To run this example:

    npm install
    npm run dev

And navigate to http://localhost:3000

The example checks for the `browser` in `$app/env` and doesn't run RxDB on the backend. This means that it will work offline with a SPA that has server side rendering disabled.

## Steps to reproduce this repo

Here's a rough outline what I did to get RxDB working:

1. `npm install --save events rxdb pouchdb-adapter-idb rxjs`
2. Modify your `svelte.config.js` like so:

```
    kit: {
        vite: {
            define: {
                'process.env': {}
            }
        }
    }
```
3. Add the following to your `app.html` inside `<head>`

```
<script>var global = globalThis</script>
```

These steps might be incomplete and YMMV.

### Usage

```ts
import { createRxDatabase, addRxPlugin } from 'rxdb';
import { Subject } from 'rxjs';
import * as idb from 'pouchdb-adapter-idb';
import { browser } from '$app/env';

const dbSubject$ = new Subject();

if (browser) {
    addRxPlugin(idb);
    (async function () {
        dbSubject$.next(await createRxDatabase({
            name: 'mydb',
            adapter: 'idb',
            ignoreDuplicate: true
        }));
    })()
}

export const db$ = dbSubject$.asObservable()
```

Remember to not use the RxDB API outside a `$app/env.browser = true` check, or otherwise you may encounter errors.