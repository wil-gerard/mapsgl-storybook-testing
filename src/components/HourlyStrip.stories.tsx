import type { Meta, StoryObj } from "@storybook/react";
import { HourlyStrip } from "./HourlyStrip";
import { ClockProvider } from "../clock";
import raw from "../fixtures/hourly.json";

const hours = raw.response[0].periods;
const PINNED = new Date("2026-10-09T15:41:00-05:00");

const meta = {
  title: "Weather/HourlyStrip",
  component: HourlyStrip,
} satisfies Meta<typeof HourlyStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

// Nothing here renders a timestamp, yet it still drifts. The highlighted
// column moves one cell to the right every hour.
export const LiveClock: Story = {
  args: { hours },
};

export const Pinned: Story = {
  args: { hours },
  decorators: [
    (Story) => (
      <ClockProvider at={PINNED}>
        <Story />
      </ClockProvider>
    ),
  ],
};

export const EveningRain: Story = {
  args: { hours },
  decorators: [
    (Story) => (
      <ClockProvider at={new Date("2026-10-09T19:10:00-05:00")}>
        <Story />
      </ClockProvider>
    ),
  ],
};
