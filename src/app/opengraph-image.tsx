import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TickTock — Free Online Countdown Timer & Deadline Tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const EVENT_COLORS = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];

const DIGIT_PAIRS = [
  { value: "07", label: "days" },
  { value: "12", label: "hours" },
  { value: "34", label: "mins" },
  { value: "56", label: "secs" },
];

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(145deg, #0a0a0a 0%, #111127 40%, #16213e 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "48px 60px",
        }}
      >
        {/* ── Brand row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <img
            src="https://tryticktock.vercel.app/app_icon.png"
            alt="TickTock"
            width={56}
            height={56}
            style={{
              borderRadius: "14px",
              boxShadow: "0 8px 30px rgba(99, 102, 241, 0.35)",
            }}
          />
          <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
            <span
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-2px",
              }}
            >
              Tick
            </span>
            <span
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "-2px",
              }}
            >
              Tock
            </span>
          </div>
        </div>

        {/* ── Countdown hero ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "8px",
            borderRadius: "24px",
            padding: "16px 48px",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 0 100px rgba(99, 102, 241, 0.12)",
          }}
        >
          {DIGIT_PAIRS.map((pair, i) => (
            <div
              key={pair.label}
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              {/* Digit pair */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "112px",
                    fontWeight: 700,
                    color: "#ffffff",
                    fontFamily: '"Courier New", Courier, monospace',
                    letterSpacing: "4px",
                    lineHeight: 1,
                  }}
                >
                  {pair.value}
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase" as const,
                    letterSpacing: "3px",
                  }}
                >
                  {pair.label}
                </span>
              </div>

              {/* Colon separator (skip after last pair) */}
              {i < DIGIT_PAIRS.length - 1 && (
                <span
                  style={{
                    fontSize: "80px",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.2)",
                    fontFamily: '"Courier New", Courier, monospace',
                    lineHeight: 1,
                    marginBottom: "24px",
                  }}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ── Color spectrum bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "36px",
            marginBottom: "28px",
          }}
        >
          {EVENT_COLORS.map((color) => (
            <div
              key={color}
              style={{
                width: "160px",
                height: "6px",
                borderRadius: "3px",
                background: color,
                opacity: 0.85,
              }}
            />
          ))}
        </div>

        {/* ── Tagline ── */}
        <div
          style={{
            fontSize: "26px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.5px",
          }}
        >
          Every second counts.
        </div>
      </div>
    ),
    { ...size },
  );
}
