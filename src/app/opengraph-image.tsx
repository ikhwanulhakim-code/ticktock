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
        {/* Clock emoji as icon substitute */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            ⏱️
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "4px",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            Tick
          </span>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "-2px",
            }}
          >
            Tock
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: "#e2e8f0",
            marginBottom: "12px",
          }}
        >
          Countdown Manager
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.6)",
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Create and share beautiful countdown timers instantly — no sign-up needed.
        </div>

        {/* Feature badges */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "32px",
          }}
        >
          {["🔗 Shareable Links", "📱 Cross-Device", "⚡ No Sign-up"].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  padding: "8px 20px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {feature}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
