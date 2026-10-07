import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Testing Xweather MapsGL with Storybook",
    brandUrl: "?path=/story/mapsgl-weathermap--loads-weather",
    brandTarget: "_self",
  }),
});
