import type { Meta, StoryObj } from "@storybook/react";
import { AlertBanner } from "./AlertBanner";
import { ClockProvider } from "../clock";
import raw from "../fixtures/alert.json";

const alert = raw.response[0];
const PINNED = new Date("2026-10-09T15:41:00-05:00");

const meta = {
  title: "Weather/AlertBanner",
  component: AlertBanner,
  decorators: [
    (Story) => (
      <ClockProvider at={PINNED}>
        <Story />
      </ClockProvider>
    ),
  ],
} satisfies Meta<typeof AlertBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Advisory: Story = { args: { alert } };

export const Warning: Story = {
  args: {
    alert: {
      ...alert,
      details: {
        ...alert.details,
        name: "SEVERE THUNDERSTORM WARNING",
        priority: 1,
        body: "At 341 PM, a severe thunderstorm was located near Chanhassen, moving east at 45 mph. Hail up to one inch and winds in excess of 60 mph are expected.",
      },
    },
  },
};

// The countdown is the thing that drifts. Pinning the clock is what makes
// this story a stable baseline rather than a moving target.
export const MinutesFromExpiry: Story = {
  args: { alert },
  decorators: [
    (Story) => (
      <ClockProvider at={new Date("2026-10-09T18:47:00-05:00")}>
        <Story />
      </ClockProvider>
    ),
  ],
};
