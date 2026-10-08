import { loadEnv } from "vite";

// Only the browser SDK credentials belong in the map bundle, never Chromatic's token.
export function mapEnvironment(mode: string) {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    "import.meta.env.XWEATHER_CLIENT_ID": JSON.stringify(env.XWEATHER_CLIENT_ID ?? ""),
    "import.meta.env.XWEATHER_CLIENT_SECRET": JSON.stringify(env.XWEATHER_CLIENT_SECRET ?? ""),
    "import.meta.env.XWEATHER_PROXY_URL": JSON.stringify(env.XWEATHER_PROXY_URL ?? ""),
    "import.meta.env.MAPBOX_ACCESS_TOKEN": JSON.stringify(env.MAPBOX_ACCESS_TOKEN ?? ""),
  };
}
