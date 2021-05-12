<script lang="ts" context="module">
	import * as RxDB from 'rxdb';
	const { createRxDatabase, addRxPlugin } = RxDB;
	import { from, merge, of, Subject, combineLatest, NEVER } from 'rxjs';
	import { filter, switchMap, pluck, shareReplay, tap } from 'rxjs/operators/index.js';
	import { browser } from '$app/env';
</script>

<script lang="ts">
	import * as idb from 'pouchdb-adapter-idb';

	let count$ = of('Loading...');

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

	const db$ = (browser ? of(null) : NEVER).pipe(
		tap(() => addRxPlugin(idb)),
		switchMap(() => {
			return from(
				createRxDatabase({
					name: 'mydb',
					adapter: 'idb',
					ignoreDuplicate: true
				})
			);
		}),
		shareReplay(1)
	);

	const coll$ = db$.pipe(
		switchMap((db) => {
			return from(
				db.addCollections({
					counters: {
						schema: schema
					}
				})
			);
		}),
		shareReplay(1)
	);

	const existingClickCounter$ = combineLatest([coll$, db$]).pipe(
		switchMap(([_, db]) => {
			return from(
				db.counters
					.findOne({
						selector: {
							id: 'clicks'
						}
					})
					.exec()
			);
		}),
		shareReplay(1)
	);

	const clickCounterNotFound$ = existingClickCounter$.pipe(filter((doc) => doc === null));
	const clickCounterFound$ = existingClickCounter$.pipe(filter((doc) => doc !== null));

	const insertNewCounter$ = combineLatest([clickCounterNotFound$, db$]).pipe(
		switchMap(([_, db]) => {
			return db.counters.insert({
				id: 'clicks',
				count: 0
			});
		}),
		shareReplay(1)
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

	count$ = initialDoc$.pipe(pluck('count'));

	let count;

	const increment = () => {
		count += 1;
		saveCount$.next();
	};

	$: count = $count$;
</script>

<p>
	Count: {count}
</p>
<button on:click={() => increment()}>+1</button>
