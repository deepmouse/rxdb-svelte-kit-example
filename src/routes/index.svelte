<script lang="ts">
	import { createRxDatabase, addRxPlugin } from 'rxdb';
	import { from, merge, of, Subject, combineLatest } from 'rxjs';
	import { filter, map, switchMap, pluck } from 'rxjs/operators';
	import { browser } from '$app/env';
	import * as idb from 'pouchdb-adapter-idb';

	let initialCounter$ = of('Loading...');

	let saveCount$ = new Subject();

	const schema = {
		title: 'counter schema',
		version: 0,
		type: 'object',
		properties: {
			id: {
				type: 'string',
				primary: true
			},
			count: {
				type: 'number'
			}
		}
	};

	if (browser) {
		addRxPlugin(idb);

		(async function () {
			const db = await createRxDatabase({
				name: 'mydb',
				adapter: 'idb',
				ignoreDuplicate: true
			});

			await db.addCollections({
				counters: {
					schema: schema
				}
			});

			const counterCollection = db.counters;

			const existingClickCounter$ = from(
				counterCollection
					.findOne({
						selector: {
							id: 'clicks'
						}
					})
					.exec()
			);

			const clickCounterNotFound$ = existingClickCounter$.pipe(filter((doc) => doc === null));
			const clickCounterFound$ = existingClickCounter$.pipe(filter((doc) => doc !== null));

			const insertNewCounter$ = clickCounterNotFound$.pipe(
				switchMap(() => {
					return counterCollection.insert({
						id: 'clicks',
						count: 0
					});
				})
			);

			const initialDoc$ = merge(clickCounterFound$, insertNewCounter$);

			const updateDoc$ = combineLatest([initialDoc$, saveCount$]);

			updateDoc$.subscribe(([doc]) => {
				doc.update({
					$set: {
						count: count
					}
				});
			});

			initialCounter$ = initialDoc$.pipe(pluck('count'));
		})();
	}
	let count;

	const increment = () => {
		count += 1;
		saveCount$.next();
	};

	$: count = $initialCounter$;
</script>

<p>
	Count: {count}
</p>
<button on:click={() => increment()}>+1</button>
