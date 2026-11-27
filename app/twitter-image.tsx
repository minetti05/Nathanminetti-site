import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

// Default share image for every page: the wordmark and the hero line, in the site's own type.
export const alt = "Nathan Minetti: Building connections between brands, business and culture.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (w: string) =>
  fs.readFileSync(
    path.join(process.cwd(), "node_modules/@fontsource/cormorant-garamond/files", `cormorant-garamond-latin-${w}-normal.woff`),
  );

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F6F2",
          color: "#202020",
          padding: "72px 80px",
          fontFamily: "Cormorant",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 500 }}>Nathan Minetti</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 1040, height: 1, background: "#202020", marginBottom: 36 }} />
          <div style={{ fontSize: 76, fontWeight: 300, lineHeight: 1.05, maxWidth: 1000 }}>
            Building connections between brands, business and culture.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: font("300"), weight: 300, style: "normal" },
        { name: "Cormorant", data: font("500"), weight: 500, style: "normal" },
      ],
    },
  );
}
