import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import { mapEnvironment } from "../map-env";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-actions", "@storybook/addon-interactions"],
  framework: { name: "@storybook/react-vite", options: {} },
  viteFinal: (config) => mergeConfig(config, {
    define: mapEnvironment(config.mode ?? "development"),
  }),
};

export default config;
