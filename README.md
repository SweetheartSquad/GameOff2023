# Taxi Quest 66

![animated cover](./promo/cover.gif)

## Development

```sh
npm i # installs dependencies
npm start # starts dev server
npm run build # creates production build
```

Hot-reload is available for [`./src/assets/main-en.strand`](./src/assets/main-en.strand) which allows you to interactively edit passages, but most other changes will trigger a page refresh.

[pixi3d docs](https://api.pixi3d.org/index.html)

## Release

1. Bump the package version (`npm version patch/minor/major`)
2. Push changes
3. Go to [release action](https://github.com/SweetheartSquad/GameOff2023/actions/workflows/release.yml)
4. Select "Run workflow", and confirm on `main` branch

The workflow will automatically create a build and upload it to itch.io.
