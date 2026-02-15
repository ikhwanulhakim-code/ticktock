import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "TickTock — Free Online Countdown Timer & Deadline Tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const iconBuffer = await readFile(
    join(process.cwd(), "public", "app_icon.png"),
  );
  const iconBase64 = `data:image/png;base64,${iconBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Background Layer ── */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "linear-gradient(to bottom right, #0f172a 0%, #1e293b 100%)",
          }}
        />

        {/* ── Grid Pattern Overlay ── */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundImage:
              "linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.3,
          }}
        />

        {/* ── Accent Shapes ── */}
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.15)",
            top: "-100px",
            right: "100px",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(236, 72, 153, 0.1)",
            bottom: "-80px",
            left: "80px",
            filter: "blur(50px)",
          }}
        />

        {/* ── Content Layer ── */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            position: "relative",
            zIndex: 10,
          }}
        >
        {/* ── App Icon ── */}
        <img
          src={iconBase64}
          alt="TickTock"
          width={180}
          height={180}
          style={{
            borderRadius: "36px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            marginBottom: "40px",
          }}
        />

        {/* ── Brand Name ── */}
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span
            style={{
              fontSize: "120px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-4px",
              lineHeight: 1,
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            Tick
          </span>
          <span
            style={{
              fontSize: "120px",
              fontWeight: 800,
              color: "rgba(255, 255, 255, 0.7)",
              letterSpacing: "-4px",
              lineHeight: 1,
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
          >
            Tock
          </span>
        </div>

        {/* ── Tagline ── */}
        <div
          style={{
            fontSize: "44px",
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.85)",
            letterSpacing: "2px",
            marginTop: "24px",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
          }}
        >
          Free Countdown Timer
        </div>
      </div>
    </div>
    ),
    { ...size },
  );
}
