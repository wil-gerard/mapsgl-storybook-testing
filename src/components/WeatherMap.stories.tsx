import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import type { MapboxMapController } from "@xweather/mapsgl";
import { WeatherMap } from "./WeatherMap";

const meta = {
  title: "MapsGL/WeatherMap",
  component: WeatherMap,
  tags: ["map-smoke"],
  args: { onReady: fn<(controller: MapboxMapController) => void>() },
} satisfies Meta<typeof WeatherMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoadsWeather: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.queryByRole("alert") ?? canvas.queryByText("Weather map ready")).not.toBeNull();
    }, { timeout: 60000 });
    if (canvas.queryByRole("alert")) throw new Error("Weather map failed to load. Check local credentials and service access.");
    await expect(args.onReady).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole("status")).toHaveTextContent("Weather map ready");
    if (!args.onReady) throw new Error("Expected a readiness callback");
    const controller = args.onReady.mock.calls[0][0];
    const layer = controller.getWeatherLayer("temperatures");
    await expect(layer).toBeDefined();
    if (!layer || Array.isArray(layer)) throw new Error("Expected a single temperature layer");
    await expect(layer.visible).toBe(true);
    const sample = layer.queryFeatures({ lon: -93.265, lat: 44.9778 }, 5, false, false);
    await expect(sample.nodata).toBe(false);
    await expect(Number.isFinite(sample.value)).toBe(true);
  },
};

export const TogglesTemperature: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.queryByRole("alert") ?? canvas.queryByText("Weather map ready")).not.toBeNull();
    }, { timeout: 60000 });
    if (canvas.queryByRole("alert")) throw new Error("Weather map failed to load. Check local credentials and service access.");
    await expect(args.onReady).toHaveBeenCalledTimes(1);
    if (!args.onReady) throw new Error("Expected a readiness callback");
    const controller = args.onReady.mock.calls[0][0];
    const layer = controller.getWeatherLayer("temperatures");
    if (!layer || Array.isArray(layer)) throw new Error("Expected a single temperature layer");
    const button = canvas.getByRole("button", { name: "Temperature layer" });

    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await expect(layer.visible).toBe(false);

    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(layer.visible).toBe(true);
    await expect(controller.getWeatherLayer("temperatures")).toBe(layer);
  },
};
