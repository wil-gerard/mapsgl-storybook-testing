import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@chromatic-com/storybook"],
  framework: { name: "@storybook/react-vite", options: {} },
};

export default config;
