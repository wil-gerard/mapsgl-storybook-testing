import type { Meta, StoryObj } from "@storybook/react";
import { CurrentConditions } from "./CurrentConditions";
import { ClockProvider } from "../clock";
import raw from "../fixtures/minneapolis.json";

const data = {
  place: raw.response[0].place,
  periods: raw.response[0].periods,
};

// The instant every pinned story is rendered at. One constant, shared by the
// whole kit, so a reviewer comparing two components sees the same moment.
const PINNED = new Date("2026-10-09T15:41:00-05:00");

const meta = {
  title: "Weather/CurrentConditions",
  component: CurrentConditions,
} satisfies Meta<typeof CurrentConditions>;

export default meta;
type Story = StoryObj<typeof meta>;

// Run this one through Chromatic twice, a few minutes apart, and watch it
// report a visual change nobody made.
export const LiveClock: Story = {
  args: { data },
};

export const Pinned: Story = {
  args: { data },
  decorators: [
    (Story) => (
      <ClockProvider at={PINNED}>
        <Story />
      </ClockProvider>
    ),
  ],
};

export const StaleReading: Story = {
  args: { data },
  decorators: [
    (Story) => (
      <ClockProvider at={new Date("2026-10-09T18:12:00-05:00")}>
        <Story />
      </ClockProvider>
    ),
  ],
};
