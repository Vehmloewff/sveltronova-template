import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";
import chalk from "chalk";

const target = process.env.APP_TARGET_BUILD_PLATFORM;
const build = process.env.BUILD_APP;
const watching = process.env.ROLLUP_WATCH;

let commandToRun = `./node_modules/.bin/cordova ${
  build ? "build" : "run"
} ${target}`;

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "www/build/bundle.js"
  },
  plugins: [
    svelte({
      dev: !build,
      css: css => {
        css.write("www/build/bundle.css");
      }
    }),
    resolve({
      browser: true,
      dedupe: importee =>
        importee === "svelte" || importee.startsWith("svelte/")
    }),
    commonjs(),
    serve(commandToRun),
    watching && livereload("platforms"),
    build && terser()
  ],
  watch: {
    clearScreen: false
  }
};

function serve(command) {
  const { exec } = require("child_process");

  let cp = null;

  function log(data) {
    data.split(`\n`).forEach(line => {
      console.log(chalk.blue`[cordova]`, line);
    });
  }

  return {
    writeBundle() {
      if (cp) cp.kill();
      cp = exec(command);

      cp.stdout.on("data", log);
      cp.stderr.on("data", log);
    }
  };
}
