# sveltronova template

A Svelte, Electron, and Cordova template.

## Usage

```bash
npx degit Vehmloewff/sveltronova-template my-app
cd my-app
npm run setup
```

To build the app:

```bash
npm run build -- <platform>
# or
npm run build -- <platform> no-watch
```

To run a dev instance of the app with hot reloading:

```bash
npm run dev # for the browser
# or
npm run dev -- <platform> # to run a specific platform
```

The current platforms are

- `browser`
- `electron`
- `android`

You can run `cordova platform add <new_platform>` to add a new platform.

## License

[MIT](/LICENSE)
