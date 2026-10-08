# Test a MapsGL layer toggle in Storybook

Click the temperature toggle and the button changes. Remove the call to
MapsGL and the weather layer stays visible. You can check `aria-pressed` and
still miss the bug.

In this example, you test the button and the SDK layer, then remove the
visibility call to confirm that your test catches the broken control.

You can run the example in Storybook with MapsGL 1.10.2, Mapbox GL JS 3.32.0,
and live temperature data over Minneapolis.

## Before you start

Clone the [example repository](https://github.com/wil-gerard/mapsgl-storybook-testing).
The stories load live weather data on a Mapbox base map, so you need an
Xweather account with MapsGL access and a Mapbox account.

**Xweather.** Create an app in your Xweather account to get a client ID and
client secret. The
[MapsGL getting started guide](https://www.xweather.com/docs/mapsgl/getting-started)
covers signing up and creating access keys. Each app has a namespace that
limits which domains can use its keys. If the map fails to load, check that
the namespace allows the host where Storybook runs, such as `localhost`.

**Mapbox.** Your account's default public token works. It starts with `pk.`
and appears on your [access tokens page](https://console.mapbox.com/account/access-tokens/).
Do not use a secret token that starts with `sk.`, because Mapbox GL JS rejects
it. See [Mapbox access tokens](https://docs.mapbox.com/help/getting-started/access-tokens/)
for more about tokens.

Add the three values to `.env`.

```sh
XWEATHER_CLIENT_ID=your_client_id
XWEATHER_CLIENT_SECRET=your_client_secret
MAPBOX_ACCESS_TOKEN=pk.your_token
```

Vite embeds these values in the browser build, so keep `.env` out of version
control and do not publish the build. To look at the stories without
credentials, open the
[published Storybook](https://wil-gerard.github.io/mapsgl-storybook-testing/).

## Establish readiness before clicking

A controller can initialize before weather data is available. `WeatherMap.tsx`
reports readiness only after the layer returns a finite temperature at the map
center and the host map emits a render event. An error or a timeout after 45 seconds
produces an error state instead. The load story checks that contract before
calling the map ready.

The load test requires weather data at the map center. To check rendered
colors or placement, you would need a separate visual test.

## Assert both sides of the integration

The toggle story gets the layer from the readiness callback, clicks the
public control, and checks both states.

```ts
const layer = controller.getWeatherLayer("temperatures");
if (!layer || Array.isArray(layer)) throw new Error("Expected one temperature layer");
const button = canvas.getByRole("button", { name: "Temperature layer" });

await userEvent.click(button);
await expect(button).toHaveAttribute("aria-pressed", "false");
await expect(layer.visible).toBe(false);
```

Click again to restore visibility. The story checks that the controller still
holds the same layer instance, so you can catch a toggle that replaces the layer.
See [the complete stories](../src/components/WeatherMap.stories.tsx).

## Prove the test can fail

Follow [the local setup](../README.md#run-locally). For the mutation experiment,
serve a built Storybook so hot reload cannot interrupt the test.

```sh
npm run build-storybook
python3 -m http.server 6007 --bind 127.0.0.1 --directory storybook-static
```

Run the tests from another terminal.

```sh
npm run test:maps -- --url http://127.0.0.1:6007
```

Remove this line from `WeatherMap.tsx`, rebuild, and rerun.

```ts
instance.setWeatherLayerVisibility("temperatures", next);
```

The button still changes, so its assertion passes. The SDK layer stays visible,
so `expect(layer.visible).toBe(false)` fails. Restore the line, rebuild, and
rerun to confirm recovery. Keep the mutation out of the final code.

Both tests passed locally in Chromium on October 7, 2026. Removing the visibility call failed only the toggle test with `expected true to be false`;
missing credentials also failed the success tests.

## Coverage

You now have a test for the connection between your control and MapsGL.
Removing the SDK call gives you a concrete failure to reproduce and debug.

These live tests can also fail because of credentials, networks, or service
availability. They do not validate weather accuracy or rendered colors or layer compositing. Stable screenshot comparisons require controlled weather inputs and a
verified rendering environment; we have not established those conditions in this example.
