import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import livereload from 'rollup-plugin-livereload';
import chalk from 'chalk';
import { spawn } from 'child_process';
import nodePath from 'path';

let target = process.env.APP_TARGET_BUILD_PLATFORM;
const build = process.env.BUILD_APP;
const watching = process.env.ROLLUP_WATCH;

const platformShortcuts = {
	desktop: 'electron',
	d: 'electron',
	e: 'electron',
	a: 'android',
	w: 'browser',
	b: 'browser',
};

target = target.replace(/^--?/, ``);

target = platformShortcuts[target] || target;

let commandToRun = `./node_modules/.bin/cordova ${build ? 'build' : 'run'} ${target}`;

if (target === 'electron' && !build) {
	commandToRun += ` --nobuild`;
}

if (build) commandToRun += ` --release`;
else commandToRun += ` --debug`;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'www/build/bundle.js',
	},
	plugins: [
		svelte({
			dev: !build,
			css: css => {
				css.write('www/build/bundle.css');
			},
		}),
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
		}),
		commonjs(),
		serve(commandToRun),
		watching && target !== 'electron' && livereload('platforms'),
		build && terser(),
	],
	watch: {
		clearScreen: false,
	},
};

function serve(command) {
	let cp = null;
	let electronCp = null;

	function log(data) {
		data.toString()
			.split(`\n`)
			.filter(l => l !== '')
			.forEach(line => {
				console.log(chalk.blue`[cordova]`, line);
			});
	}

	return {
		writeBundle() {
			if (cp) cp.kill('SIGINT');
			if (electronCp) electronCp.kill('SIGINT');

			const split = command.split(' ');
			cp = spawn(split.shift(), split).on('error', function(err) {
				throw err;
			});

			if (target === 'electron' && !build) {
				const pathToMain = nodePath.resolve(`platforms/electron/www/cdv-electron-main.js`);

				cp.on('close', () => {
					// Give cordova a split second to recover
					setTimeout(() => {
						electronCp = spawn(`./node_modules/.bin/electron`, [pathToMain]);
					}, 50);
				});
			}

			cp.stdout.on('data', log);
			cp.stderr.on('data', log);

			cp.on('close', code => {
				if (code && !watching) process.exit(code);
			});

			process.on('exit', () => {
				if (cp) cp.kill('SIGINT');
				if (electronCp) electronCp.kill('SIGINT');
			});
		},
	};
}
