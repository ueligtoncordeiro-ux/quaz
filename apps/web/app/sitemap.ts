import type { MetadataRoute } from "next";
import { brand } from "@quaz/config";

const routes = [
  "",
  "/como-funciona",
  "/onde-estamos",
  "/seja-parceiro",
  "/ajuda",
  "/termos",
  "/privacidade"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${brand.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}
