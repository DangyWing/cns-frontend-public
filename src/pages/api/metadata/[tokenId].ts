import type { NextApiRequest, NextApiResponse } from "next";
import { MakeTokenMetadata } from "../../../components/MakeTokenMetadata";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tokenId } = req.query;

  if (!tokenId) return res.status(400).json({ error: "Missing tokenId in request" });

  if (typeof tokenId !== "string") return res.status(400).json({ error: "Invalid tokenId in request" });

  const metadata = await MakeTokenMetadata({ tokenId });

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(metadata);
}
