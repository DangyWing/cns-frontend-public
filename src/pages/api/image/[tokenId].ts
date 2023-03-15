import type { NextApiRequest, NextApiResponse } from "next";
import { GetNameFromTokenId } from "../../../components/GetNameFromTokenId";
import { Canvas, GlobalFonts } from "@napi-rs/canvas";
import { join } from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tokenId } = req.query;

  if (!tokenId) return res.status(400).json({ error: "Missing tokenId in request" });
  if (typeof tokenId !== "string") return res.status(400).json({ error: "Invalid tokenId in request" });

  GlobalFonts.registerFromPath(join(__dirname, "/../../../../../public/fonts/Modeseven.ttf"), "Modeseven");
  GlobalFonts.registerFromPath(join(__dirname, "/../../../../../public/fonts/Inter-Regular.ttf"), "Inter");

  const name = await GetNameFromTokenId({ tokenId: tokenId });

  if (!name) return res.status(400).json({ error: "Invalid response" });

  const WIDTH = 700;
  const HEIGHT = 700;

  const canvas = new Canvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#111111";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillRect(0, 0, 700, 700);
  ctx.fillStyle = "#11d888";
  ctx.font = "20px ModeSeven, Courier, Courier New, Consolas, monospace, Inter";

  ctx.fillText("canto name service", 50, 320);
  ctx.fillText(name.concat(".canto"), 50, 50);

  const encodeType = "png";

  const buffer = await canvas.encode(encodeType);

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Disposition", "inline");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(buffer);
}
