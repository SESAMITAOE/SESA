import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SESA — Software Engineering Student Association",
    short_name: "SESA",
    description: "Official digital platform of SESA, MITAOE.",
    start_url: "/",
    display: "standalone",
    background_color: "#08162a",
    theme_color: "#08162a",
    icons: [{ src: "/sesa-logo.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
