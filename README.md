# Weather components, pinned clocks

A small component kit built on the Xweather API, documented in Storybook, with
visual regression running through Chromatic.

The components are the excuse. The point is what happens when you snapshot a UI
whose content is tied to the current moment.

## Setup

```
npm create vite@latest weather-kit -- --template react-ts
cd weather-kit
npx storybook@latest init
npx storybook@latest add @chromatic-com/storybook
```

Drop the contents of `src/` into the new project, import `styles.css` in
`.storybook/preview.ts`, then

```
npm run storybook
npx chromatic --project-token=<token>
```

## The thing to actually observe

Run Chromatic once. Wait ten minutes. Run it again without touching a line of
code. Three stories will come back changed.

- `CurrentConditions/LiveClock` moves from "Updated 2 minutes ago" to
  "Updated 12 minutes ago"
- `AlertBanner` counts down toward expiry
- `HourlyStrip/LiveClock` shifts its highlighted column one cell right

None of that is a regression. It is the clock leaking into the render.

The fix is in `src/clock.tsx`. No component calls `new Date()` directly. They
read the current instant from context, which means a story can pin it. Compare
the `LiveClock` and `Pinned` stories of either component to see the difference.

`HourlyStrip` is the interesting one. It renders no timestamp at all, so it
looks immune, and it drifts anyway because "which hour is now" is itself a read
of the clock.

## Notes for the write up

Things worth checking before you write, because the answers belong in the post
and none of them are guessable from here.

1. How many runs it took before a false diff appeared, and which story went
   first
2. Whether Chromatic's own diff threshold absorbed the small changes and only
   flagged the larger ones
3. What the TurboSnap behaviour was, given no source file changed between runs
4. Whether pinning the clock in a decorator was enough, or whether anything
   else leaked, timezone being the obvious candidate

The generalisation at the end writes itself once you have the screenshots.
Relative timestamps show up in almost every dashboard, so this is not a weather
problem. Weather is just where it is impossible to ignore.
