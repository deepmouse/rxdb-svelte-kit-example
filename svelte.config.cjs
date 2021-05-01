const preprocess = require('svelte-preprocess');
//const { nodeResolve } = require('@rollup/plugin-node-resolve');
//const commonjs = require('@rollup/plugin-commonjs')
//const nodePolyfills = require('rollup-plugin-node-polyfills')
//const globals = require('rollup-plugin-node-globals')
//const builtins = require('rollup-plugin-node-builtins')
//const polyfillNode = require('rollup-plugin-polyfill-node');
//const builtinsPlugin = { ...builtins({ crypto: true }), name: 'rollup-plugin-node-builtins' }

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			define: {
				'process.env': {}
			},
			rollupOptions: {
				plugins: [
					//nodeResolve({ browser: true }),
					//commonjs(),
					//nodePolyfills()
				]
			}
		}
	}
};
