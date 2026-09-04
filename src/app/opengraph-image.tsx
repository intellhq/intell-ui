/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
} from "@/lib/seo";

export const alt = "INTELL solar inverter monitoring dashboard preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          height: "100%",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#0f1115",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <img
          src={absoluteUrl(DEFAULT_OG_IMAGE)}
          alt=""
          width="1200"
          height="630"
          style={{
            position: "absolute",
            inset: 0,
            height: "100%",
            width: "100%",
            objectFit: "cover",
            opacity: 0.62,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(15,17,21,0.96) 0%, rgba(15,17,21,0.72) 48%, rgba(15,17,21,0.2) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px",
            width: "760px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              marginBottom: "42px",
              fontSize: "38px",
              fontWeight: 800,
              letterSpacing: "-1px",
            }}
          >
            <span>{SITE_NAME.slice(0, 4)}</span>
            <span style={{ color: "#f5a623" }}>{SITE_NAME.slice(4)}</span>
          </div>
          <div
            style={{
              fontSize: "68px",
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: "-2px",
            }}
          >
            AI Solar Inverter Monitoring Platform
          </div>
          <p
            style={{
              marginTop: "28px",
              maxWidth: "680px",
              fontSize: "27px",
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.84)",
            }}
          >
            {SITE_DESCRIPTION}
          </p>
        </div>
      </div>
    ),
    size,
  );
}
