import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt =
  "KGICL Goodnews Solar — solar lighting, electrical supplies and industrial supply, Port Harcourt, Nigeria";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

/**
 * Default Open Graph card. Built from the approved brand mark and copy only.
 * Uses the default system font stack bundled with next/og, no web fonts.
 */
export default async function OpengraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public/assets/img/logo-mark-white.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#0A0A0B",
          padding: "64px 80px 92px",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori needs a plain img inside ImageResponse. */}
        <img
          src={logoSrc}
          width={260}
          height={260}
          alt=""
          style={{ flexShrink: 0 }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
            marginLeft: 56,
          }}
        >
          <div
            style={{
              fontSize: 56,
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
            }}
          >
            KGICL Goodnews Solar
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 30,
              lineHeight: 1.4,
              color: "#B8B8BD",
            }}
          >
            Solar lighting, electrical supplies and industrial supply. Port
            Harcourt, Nigeria
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 14,
            display: "flex",
            backgroundColor: "#E30613",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
