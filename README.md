# Test a MapsGL layer toggle in Storybook

Test a temperature toggle against the button state and the Xweather MapsGL
layer. Remove one SDK call to see the test catch a broken control.

Follow [the walkthrough](docs/testing-mapsgl.md) to run the example and
reproduce the failure.

## Run locally

Use Node 20 or later.

```sh
npm ci
npx playwright install chromium
cp .env.example .env
```

Keep an existing `.env`. Set the Xweather credentials and Mapbox token, then start Storybook.

```sh
npm run storybook
```

Open http://localhost:6006/?path=/story/mapsgl-weathermap--toggles-temperature.
Run the tests from another terminal.

```sh
npm run test:maps
```

The repo contains one map component and two Storybook tests. The first checks
weather data availability. The second hides and restores the same SDK layer.
These tests use live services. They check integration behavior and do not
compare screenshots.

## CI

`npm run build` and `npm run build-storybook` run on pushes and pull requests.
Live Chromium tests run on main pushes or manual dispatch with repository
secrets `XWEATHER_CLIENT_ID`, `XWEATHER_CLIENT_SECRET`, and `MAPBOX_ACCESS_TOKEN`.
The live job fails if you omit a secret. The build includes browser credentials,
so configure account restrictions before sharing it. CI keeps those builds
on the runner.
