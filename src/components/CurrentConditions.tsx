import { useNow, relativeMinutes } from "../clock";

export type Conditions = {
  place: { name: string; state: string };
  periods: Array<{
    timestamp: number;
    tempF: number;
    feelslikeF: number;
    humidity: number;
    windSpeedMPH: number;
    windGustMPH?: number;
    windDir: string;
    weather: string;
  }>;
};

export function CurrentConditions({ data }: { data: Conditions }) {
  const now = useNow();
  const p = data.periods[0];
  const place = `${titleCase(data.place.name)}, ${data.place.state.toUpperCase()}`;

  return (
    <article className="wx wx-current">
      <p className="wx-place">{place}</p>
      <p className="wx-temp">
        {p.tempF}
        <sup>&deg;F</sup>
      </p>
      <p className="wx-sky">{p.weather}</p>
      <dl className="wx-readings">
        <div>
          <span>Feels like</span>
          <div>{p.feelslikeF}&deg;</div>
        </div>
        <div>
          <span>Humidity</span>
          <div>{p.humidity}%</div>
        </div>
        <div>
          <span>Wind</span>
          <div>
            {p.windDir} {p.windSpeedMPH} mph
          </div>
        </div>
        <div>
          <span>Gusts</span>
          <div>{p.windGustMPH ? `${p.windGustMPH} mph` : "None"}</div>
        </div>
      </dl>
      {/* This line is the whole problem in one string. */}
      <p className="wx-stamp">
        Updated {relativeMinutes(p.timestamp, now)}
      </p>
    </article>
  );
}

function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
