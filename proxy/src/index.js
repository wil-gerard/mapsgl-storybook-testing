// MapsGL trades the client ID and secret for a bearer token at /auth/token and
// sends that token with every tile request. Only the trade needs the real
// credentials, so the Worker adds them there and passes tile requests through.
const UPSTREAM = "https://a-prod.v1.mapsgl.api.xweather.com";

export default {
  async fetch(request, env) {
    // Browsers send Origin on these cross origin requests, so a missing or
    // unknown origin is not the published Storybook.
    const origin = request.headers.get("Origin");
    if (!origin || !env.ALLOWED_ORIGINS.split(",").includes(origin)) {
      return new Response("Forbidden", { status: 403 });
    }
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      Vary: "Origin",
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    // Origin can be forged outside a browser, so a per client limit caps how
    // much of the Xweather quota one caller can spend.
    const client = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await env.LIMITER.limit({ key: client });
    if (!success) return new Response("Too many requests", { status: 429, headers: cors });

    const url = new URL(request.url);
    const isToken = url.pathname === "/auth/token";
    const isTile = url.pathname === "/tile" || url.pathname.startsWith("/tile/");
    if (!isToken && !isTile) return new Response("Not found", { status: 404, headers: cors });
    if (request.method !== "GET" && request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: cors });
    }

    const headers = new Headers();
    let body;
    if (isToken) {
      headers.set("Content-Type", "application/x-www-form-urlencoded");
      headers.set("Authorization", `Basic ${btoa(`${env.XWEATHER_CLIENT_ID}:${env.XWEATHER_CLIENT_SECRET}`)}`);
      body = "grant_type=client_credentials";
    } else {
      const auth = request.headers.get("Authorization");
      const type = request.headers.get("Content-Type");
      if (auth) headers.set("Authorization", auth);
      if (type) headers.set("Content-Type", type);
      // Tile requests are POSTs whose JSON body selects the datasets and time.
      if (request.method === "POST") body = await request.arrayBuffer();
    }

    // Xweather answers tile requests with a redirect to a public image URL.
    // The browser follows it directly, so image traffic skips the Worker.
    const upstream = await fetch(UPSTREAM + url.pathname + url.search, {
      method: isToken ? "POST" : request.method,
      headers,
      body,
      redirect: "manual",
    });
    const response = new Response(upstream.body, upstream);
    for (const [name, value] of Object.entries(cors)) response.headers.set(name, value);
    return response;
  },
};
