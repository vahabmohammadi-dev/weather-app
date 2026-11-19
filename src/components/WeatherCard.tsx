import Link from "next/link";

/* ----------------------------- Types ----------------------------- */

type Props = { name: string; detailed?: boolean };

type Day = {
  date: string;
  code: number;
  max: number | null;
  min: number | null;
  sunrise: string | null;
  sunset: string | null;
};

type Weather = {
  city: string;
  country: string;
  temp: number | null;
  feels: number | null;
  humidity: number | null;
  wind: number | null;
  windDir: number | null;
  code: number;
  observedAt: string | null;
  days: Day[];
};

/* ---------------------------- Constants --------------------------- */

const CODES: Record<number, string> = {
  0: "آسمان صاف",
  1: "تقریباً صاف",
  2: "نیمه‌ابری",
  3: "ابری",
  45: "مه",
  48: "مه یخی",
  51: "نمنم باران",
  53: "نمنم باران",
  55: "نمنم باران",
  61: "باران ملایم",
  63: "باران",
  65: "باران شدید",
  71: "برف ملایم",
  73: "برف",
  75: "برف سنگین",
  80: "رگبار",
  81: "رگبار",
  82: "رگبار شدید",
  95: "رعدوبرق",
  96: "رعدوبرق و تگرگ",
  99: "رعدوبرق و تگرگ",
};

const ICONS: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌦️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "🌨️",
  73: "❄️",
  75: "❄️",
  80: "🌦️",
  81: "🌧️",
  82: "⛈️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
};

const describe = (c: number) => CODES[c] ?? "نامشخص";
const iconFor = (c: number) => ICONS[c] ?? "❓";

/* --------------------------- Helpers ------------------------------ */

const round = (n: unknown): number | null =>
  typeof n === "number" && Number.isFinite(n) ? Math.round(n) : null;

const fmtTemp = (n: number | null) => (n == null ? "—" : `${n}°`);
const fmtNum = (n: number | null, suffix = "") =>
  n == null ? "—" : `${n}${suffix}`;

const compass = (deg: number | null) => {
  if (deg == null) return "—";
  const dirs = ["شمال", "شمال‌شرق", "شرق", "جنوب‌شرق", "جنوب", "جنوب‌غرب", "غرب", "شمال‌غرب"];
  return dirs[Math.round(deg / 45) % 8];
};

const formatTime = (iso: string | null) => {
  if (!iso) return "—";
  // Open-Meteo: "2025-01-15T06:42" — فقط ساعت رو برمی‌داریم
  const t = iso.split("T")[1]?.slice(0, 5);
  return t ?? "—";
};

const formatWeekday = (dateStr: string) => {
  // T12:00:00 برای جلوگیری از جابه‌جایی روز در timezone
  const d = new Date(`${dateStr}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString("fa-IR", { weekday: "long" });
};

const formatObserved = (iso: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
};

/* ---------------------------- Fetchers ---------------------------- */

async function getWeather(
  name: string,
  withForecast: boolean
): Promise<Weather | null> {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      name
    )}&count=1&language=fa`,
    { next: { revalidate: 86400 } }
  );
  if (!geoRes.ok) return null;

  const geo = await geoRes.json();
  const place = geo.results?.[0];
  if (!place) return null;

  const dailyParam = withForecast
    ? `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&forecast_days=5`
    : "";

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${place.latitude}&longitude=${place.longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,` +
    `wind_speed_10m,wind_direction_10m,weather_code` +
    `&timezone=auto` +
    dailyParam;

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) return null;

  const d = await res.json();
  const cur = d.current ?? {};

  const days: Day[] = withForecast && d.daily?.time
    ? d.daily.time.map((t: string, i: number) => ({
        date: t,
        code: d.daily.weather_code?.[i] ?? 0,
        max: round(d.daily.temperature_2m_max?.[i]),
        min: round(d.daily.temperature_2m_min?.[i]),
        sunrise: d.daily.sunrise?.[i] ?? null,
        sunset: d.daily.sunset?.[i] ?? null,
      }))
    : [];

  return {
    city: place.name,
    country: place.country ?? "",
    temp: round(cur.temperature_2m),
    feels: round(cur.apparent_temperature),
    humidity: round(cur.relative_humidity_2m),
    wind: round(cur.wind_speed_10m),
    windDir: round(cur.wind_direction_10m),
    code: cur.weather_code ?? 0,
    observedAt: cur.time ?? null,
    days,
  };
}

/* --------------------------- Component ---------------------------- */

export default async function WeatherCard({ name, detailed = false }: Props) {
  let w: Weather | null = null;
  try {
    w = await getWeather(name, detailed);
  } catch {
    w = null;
  }

  if (!w) {
    return (
      <div className="error" role="alert" aria-live="polite">
        اطلاعات «{name}» دریافت نشد. نام شهر را بررسی کنید یا دوباره تلاش کنید.
      </div>
    );
  }

  const observed = formatObserved(w.observedAt);
  const cityHref = `/city/${encodeURIComponent(name)}`;

  const body = (
    <>
      <div className="card-head">
        <h3 className="city">{w.city}</h3>
        <span className="country">{w.country}</span>
      </div>

      <div className="temp-row">
        <span className="temp-icon" aria-hidden="true">
          {iconFor(w.code)}
        </span>
        <p className="temp" dir="ltr">
          {fmtTemp(w.temp)}
        </p>
      </div>

      <p className="cond">{describe(w.code)}</p>

      <div className="meta">
        <span>احساس‌شده: {fmtTemp(w.feels)}</span>
        <span>رطوبت: {fmtNum(w.humidity, "٪")}</span>
        <span>
          باد: {fmtNum(w.wind, " km/h")}
          {w.windDir != null ? ` (${compass(w.windDir)})` : ""}
        </span>
      </div>

      {observed && (
        <p className="observed" aria-label="زمان مشاهده">
          آخرین به‌روزرسانی: {observed}
        </p>
      )}

      {detailed && w.days.length > 0 && (
        <div className="forecast">
          {w.days.map((day) => (
            <div className="day" key={day.date}>
              <b>{formatWeekday(day.date)}</b>
              <span aria-hidden="true">{iconFor(day.code)}</span>
              <span className="day-cond">{describe(day.code)}</span>
              <div dir="ltr" className="day-temp">
                {fmtTemp(day.max)} / {fmtTemp(day.min)}
              </div>
              {(day.sunrise || day.sunset) && (
                <small className="sun">
                  ☀️ {formatTime(day.sunrise)} · 🌙 {formatTime(day.sunset)}
                </small>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );

  return detailed ? (
    <div className="card detail">{body}</div>
  ) : (
    <Link href={cityHref} className="card" aria-label={`جزئیات آب‌وهوای ${w.city}`}>
      {body}
    </Link>
  );
}