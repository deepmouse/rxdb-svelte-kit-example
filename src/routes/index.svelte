<script lang="ts">
	import { createRxDatabase, addRxPlugin } from 'rxdb';
	import { browser } from '$app/env';
	import * as idb from 'pouchdb-adapter-idb';

	if (browser) {
		addRxPlugin(idb);

		(async function () {
			const db = await createRxDatabase({
				name: 'mydb',
				adapter: 'idb',
				ignoreDuplicate: true
			});
			console.dir(db);
		})();
	}
</script>
