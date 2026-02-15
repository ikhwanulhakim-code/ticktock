import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TickTock — Free Online Countdown Timer & Deadline Tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* App icon — PNG version (Satori doesn't support WebP) */}
        <img
          src="https://tryticktock.vercel.app/app_icon.png"
          alt="TickTock"
          width={120}
          height={120}
          style={{
            borderRadius: "24px",
            marginBottom: "32px",
            boxShadow: "0 20px 60px rgba(99, 102, 241, 0.4)",
          }}
        />

        {/* Brand name — larger for better readability */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "4px",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              fontSize: "96px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-3px",
            }}
          >
            Tick
          </span>
          <span
            style={{
              fontSize: "96px",
              fontWeight: 800,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "-3px",
            }}
          >
            Tock
          </span>
        </div>

        {/* Simple tagline */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "-0.5px",
          }}
        >
          Free Countdown Timer
        </div>
      </div>
    ),
    { ...size },
  );
}
