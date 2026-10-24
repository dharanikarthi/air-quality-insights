import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CloudSun,
  Droplets,
  Gauge,
  Leaf,
  Mask,
  Timer,
  TrendingDown,
  TrendingUp,
  Wind,
} from "lucide-react";
import { cities, categoryMeta, aqiToCategory, type CityAqi } from "@/lib/aqi-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AeroWatch — Live Air Quality Dashboard" },
      {
        name: "description",
        content:
          "Real-time AQI dashboard with pollutant breakdowns, hourly trends and health advisories for Indian cities.",
      },
      { property: "og:title", content: "AeroWatch — Live Air Quality Dashboard" },
      {
        property: "og:description",
        content:
          "Real-time AQI dashboard with pollutant breakdowns, hourly trends and health advisories.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [cityName, setCityName] = useState(cities[0].city);
  const city = cities.find((c) => c.city === cityName) ?? cities[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <Header cityName={cityName} onSelectCity={setCityName} />
        <main className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <HeroCard city={city} />
            <TrendCard city={city} />
            <PollutantGrid city={city} />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <AdvisoryCard city={city} />
            <ConditionsCard city={city} />
            <CityRanking cityName={cityName} onSelectCity={setCityName} />
          </div>
        </main>
        <footer className="mt-10 flex items-center justify-between pb-4 text-xs text-muted-foreground">
          <span>AeroWatch · Air quality index (CPCB scale)</span>
          <span>{city.updatedAt}</span>
        </footer>
      </div>
    </div>
  );
}

/* ---------------------------------- Header --------------------------------- */

function Header({
  cityName,
  onSelectCity,
}: {
  cityName: string;
  onSelectCity: (name: string) => void;
}) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15">
          <Leaf className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight">AeroWatch</p>
          <p className="text-xs text-muted-foreground">Live air quality intelligence</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <nav className="station-card flex items-center gap-1 p-1.5">
          {cities.map((c) => (
            <button
              key={c.city}
              onClick={() => onSelectCity(c.city)}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                c.city === cityName
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {c.city}
            </button>
          ))}
        </nav>
        <div className="station-card flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
          <Timer className="h-4 w-4 text-primary" />
          <span className="tabular font-medium text-foreground">{time ?? "--:--"}</span>
          <span className="hidden sm:inline">IST</span>
        </div>
      </div>
    </header>
  );
}

/* --------------------------------- Hero card -------------------------------- */

function HeroCard({ city }: { city: CityAqi }) {
  const meta = categoryMeta[city.category];
  const prev = city.hourly[city.hourly.length - 3]?.aqi ?? city.aqi;
  const trend = city.aqi - prev;
  const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown;

  return (
    <section className="station-card flex flex-col gap-8 p-8 sm:flex-row sm:items-center">
      <AqiGauge aqi={city.aqi} category={city.category} />
      <div className="flex-1 space-y-6">
        <div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">{city.city}</h1>
            <span className="text-sm text-muted-foreground">{city.region}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Dominant pollutant · <span className="font-medium text-foreground">{city.dominant}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${meta.dimToken} ${meta.token}`}
          >
            <Gauge className="h-4 w-4" />
            {meta.label}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
            <TrendIcon className={`h-4 w-4 ${trend >= 0 ? "text-poor" : "text-good"}`} />
            <span className="tabular font-medium text-foreground">
              {trend >= 0 ? "+" : ""}
              {trend}
            </span>
            vs 2h ago
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <ConditionChip icon={<CloudSun className="h-4 w-4" />} label="Temp" value={`${city.temperature}°C`} />
          <ConditionChip icon={<Droplets className="h-4 w-4" />} label="Humidity" value={`${city.humidity}%`} />
          <ConditionChip icon={<Wind className="h-4 w-4" />} label="Wind" value={`${city.wind} km/h`} />
        </div>
      </div>
    </section>
  );
}

function ConditionChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-secondary px-3.5 py-2.5">
      <span className="text-primary">{icon}</span>
      <div className="leading-tight">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="tabular font-medium">{value}</p>
      </div>
    </div>
  );
}

/* ---------------------------------- Gauge ---------------------------------- */

const GAJI_MAX = 500;

function AqiGauge({ aqi, category }: { aqi: number; category: keyof typeof categoryMeta }) {
  const angle = (Math.min(aqi, GAJI_MAX) / GAJI_MAX) * Math.PI;
  const cx = 100;
  const cy = 100;
  const r = 78;
  const dotX = cx - r * Math.cos(angle);
  const dotY = cy - r * Math.sin(angle);

  const meta = categoryMeta[category];
  const segments = useMemo(
    () => [
      { from: 0, to: 50, color: "var(--color-good)" },
      { from: 50, to: 100, color: "var(--color-fair)" },
      { from: 100, to: 200, color: "var(--color-moderate)" },
      { from: 200, to: 300, color: "var(--color-poor)" },
      { from: 300, to: 500, color: "var(--color-severe)" },
    ],
    [],
  );

  return (
    <div className="relative mx-auto shrink-0" style={{ width: 240, height: 150 }}>
      <svg viewBox="0 0 200 150" className="w-full">
        {/* Track */}
        <path
          d={describeArc(cx, cy, r, Math.PI, 0)}
          fill="none"
          stroke="var(--color-secondary)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Colored segments */}
        {segments.map((s) => (
          <path
            key={s.from}
            d={describeArc(
              cx,
              cy,
              r,
              Math.PI - (s.from / GAJI_MAX) * Math.PI,
              Math.PI - (s.to / GAJI_MAX) * Math.PI,
            )}
            fill="none"
            stroke={s.color}
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.85"
          />
        ))}
        {/* Progress needle dot */}
        <circle cx={dotX} cy={dotY} r="9" fill={`var(--color-${category === "severe" ? "severe" : category})`} />
        <circle cx={dotX} cy={dotY} r="4" fill="var(--color-background)" />
      </svg>
      <div className="absolute inset-x-0 bottom-1 text-center">
        <p className={`tabular text-5xl font-bold leading-none text-glow ${meta.token}`}>{aqi}</p>
        <p className="mt-1.5 text-xs uppercase tracking-widest text-muted-foreground">AQI / 500</p>
      </div>
    </div>
  );
}

function polar(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const s = polar(cx, cy, r, startAngle);
  const e = polar(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
}

/* -------------------------------- Trend card -------------------------------- */

function TrendCard({ city }: { city: CityAqi }) {
  const data = city.hourly.map((h) => ({ ...h, label: `${h.hour}:00` }));

  return (
    <section className="station-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold tracking-tight">24-hour AQI trend</h2>
          <p className="text-xs text-muted-foreground">Hourly readings, CPCB scale</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <LegendDot color="var(--color-good)" label="Good" />
          <LegendDot color="var(--color-fair)" label="Fair" />
          <LegendDot color="var(--color-moderate)" label="Moderate" />
          <LegendDot color="var(--color-poor)" label="Poor" />
          <LegendDot color="var(--color-severe)" label="Severe" />
        </div>
      </div>
      <div className="mt-5 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <YAxis domain={[0, 500]} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} tickLine={false} axisLine={false} width={44} />
            <XAxis dataKey="label" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} tickLine={false} axisLine={false} interval={1} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                color: "var(--color-popover-foreground)",
                fontSize: "13px",
              }}
              labelStyle={{ color: "var(--color-muted-foreground)" }}
            />
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              fill="url(#aqiFill)"
              dot={false}
              activeDot={{ r: 5, fill: "var(--color-primary)", stroke: "var(--color-background)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

/* ------------------------------ Pollutant grid ------------------------------ */

function PollutantGrid({ city }: { city: CityAqi }) {
  return (
    <section>
      <h2 className="mb-3 font-semibold tracking-tight">Pollutant breakdown</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {city.pollutants.map((p) => {
          const ratio = Math.min(p.value / p.limit, 1);
          const cat = aqiToCategory(ratio * 100);
          const meta = categoryMeta[cat];
          return (
            <div key={p.key} className="station-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{p.label}</p>
                <span className={`text-xs font-semibold ${meta.token}`}>{meta.label}</span>
              </div>
              <p className="tabular mt-2 text-2xl font-semibold">
                {p.value}
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">{p.unit}</span>
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full ${meta.dimToken.replace("-dim", "")}`}
                  style={{ width: `${Math.max(ratio * 100, 4)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {Math.round(ratio * 100)}% of safe limit
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------ Advisory card ------------------------------ */

function AdvisoryCard({ city }: { city: CityAqi }) {
  const meta = categoryMeta[city.category];
  return (
    <section className="station-card p-6">
      <div className="flex items-center gap-2.5">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${meta.dimToken}`}>
          <Mask className={`h-4.5 w-4.5 ${meta.token}`} />
        </div>
        <h2 className="font-semibold tracking-tight">Health advisory</h2>
      </div>
      <p className={`mt-4 text-sm font-semibold ${meta.token}`}>{city.advisory.title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{city.advisory.body}</p>
    </section>
  );
}

/* ----------------------------- Conditions card ----------------------------- */

function ConditionsCard({ city }: { city: CityAqi }) {
  const items = [
    { icon: <CloudSun className="h-4 w-4" />, label: "Temperature", value: `${city.temperature}°C` },
    { icon: <Droplets className="h-4 w-4" />, label: "Humidity", value: `${city.humidity}%` },
    { icon: <Wind className="h-4 w-4" />, label: "Wind speed", value: `${city.wind} km/h` },
  ];
  return (
    <section className="station-card p-6">
      <h2 className="font-semibold tracking-tight">Conditions</h2>
      <div className="mt-4 space-y-3">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3 text-sm">
            <span className="flex items-center gap-2.5 text-muted-foreground">
              <span className="text-primary">{it.icon}</span>
              {it.label}
            </span>
            <span className="tabular font-semibold">{it.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ City ranking ------------------------------- */

function CityRanking({
  cityName,
  onSelectCity,
}: {
  cityName: string;
  onSelectCity: (name: string) => void;
}) {
  const ranked = [...cities].sort((a, b) => b.aqi - a.aqi);
  return (
    <section className="station-card p-6">
      <h2 className="font-semibold tracking-tight">City ranking</h2>
      <p className="text-xs text-muted-foreground">Most polluted first</p>
      <div className="mt-4 space-y-1.5">
        {ranked.map((c, i) => {
          const meta = categoryMeta[c.category];
          return (
            <button
              key={c.city}
              onClick={() => onSelectCity(c.city)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                c.city === cityName ? "bg-secondary" : "hover:bg-secondary/60"
              }`}
            >
              <span className="tabular w-5 text-xs text-muted-foreground">{i + 1}</span>
              <span className="flex-1 text-sm font-medium">{c.city}</span>
              <span className={`tabular text-sm font-bold ${meta.token}`}>{c.aqi}</span>
              <span className={`h-2 w-2 rounded-full ${meta.dimToken.replace("-dim", "")}`} />
            </button>
          );
        })}
      </div>
    </section>
  );
}
