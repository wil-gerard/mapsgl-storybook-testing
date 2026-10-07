import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Account, MapboxMapController } from "@xweather/mapsgl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@xweather/mapsgl/dist/mapsgl.css";
import "./WeatherMap.css";

export type WeatherMapProps = {
  onReady?: (controller: MapboxMapController) => void;
};

const CENTER = { lon: -93.265, lat: 44.9778 };

export function WeatherMap({ onReady }: WeatherMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const controller = useRef<MapboxMapController>();
  const readyCallback = useRef(onReady);
  readyCallback.current = onReady;
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const clientId = import.meta.env.XWEATHER_CLIENT_ID;
    const clientSecret = import.meta.env.XWEATHER_CLIENT_SECRET;
    const accessToken = import.meta.env.MAPBOX_ACCESS_TOKEN;
    if (!container.current || !clientId || !clientSecret || !accessToken) {
      setStatus("error");
      return;
    }

    let disposed = false;
    let reportedReady = false;
    let failed = false;
    let map: mapboxgl.Map | undefined;
    let instance: MapboxMapController | undefined;
    const fail = () => {
      if (!disposed) {
        failed = true;
        setStatus("error");
      }
    };
    // A stalled or unauthorized request must not leave the test waiting forever.
    const timeout = window.setTimeout(fail, 45000);

    try {
      map = new mapboxgl.Map({
        container: container.current,
        accessToken,
        style: "mapbox://styles/mapbox/light-v11",
        center: [CENTER.lon, CENTER.lat],
        zoom: 5,
        bearing: 0,
        pitch: 0,
        projection: "mercator",
        interactive: false,
      });
      map.on("error", fail);
      instance = new MapboxMapController(map, {
        account: new Account(clientId, clientSecret),
        units: { temperature: "F" },
      });
      controller.current = instance;
      instance.on("error", fail);
      instance.on("load", () => {
        if (disposed || failed || !instance) return;
        instance.addLegendControl(container.current!);
        instance.addWeatherLayer("temperatures");
      });

      // Initialization alone can succeed on an empty map. Require actual weather
      // data at the center and a host-map render before reporting readiness.
      map.on("render", () => {
        if (disposed || failed || reportedReady || !instance || !instance.isReady || instance.isLoading) return;
        const layer = instance.getWeatherLayer("temperatures");
        if (!layer || Array.isArray(layer) || !layer.visible) return;
        const sample = layer.queryFeatures(CENTER, map!.getZoom(), false, false);
        if (!sample || sample.nodata || !Number.isFinite(sample.value)) return;
        reportedReady = true;
        window.clearTimeout(timeout);
        setStatus("ready");
        readyCallback.current?.(instance);
      });
    } catch {
      fail();
    }

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      controller.current = undefined;
      instance?.dispose();
      map?.remove();
    };
  }, []);

  function toggleTemperature() {
    const instance = controller.current;
    if (!instance || status !== "ready") return;
    const next = !visible;
    instance.setWeatherLayerVisibility("temperatures", next);
    setVisible(next);
  }

  return (
    <section className="weather-map" aria-label="Minneapolis weather map">
      <div className="weather-map-toolbar">
        <h2>Minneapolis temperatures</h2>
        <button
          type="button"
          aria-pressed={visible}
          disabled={status !== "ready"}
          onClick={toggleTemperature}
        >
          Temperature layer
        </button>
      </div>
      <div className="weather-map-canvas" ref={container} />
      <p role={status === "error" ? "alert" : "status"}>
        {status === "loading" && "Loading weather map…"}
        {status === "ready" && "Weather map ready"}
        {status === "error" && "Weather map unavailable. Check credentials, service access, and network connectivity."}
      </p>
    </section>
  );
}
