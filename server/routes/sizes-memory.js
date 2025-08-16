import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// server/routes/../data/pregnancy_sizes.json
const jsonPath = path.resolve(__dirname, "../data/pregnancy_sizes.json");

const rows = JSON.parse(fs.readFileSync(jsonPath, "utf8")).sort((a, b) => a.week - b.week);

router.get("/", (_req, res) => res.json(rows));

router.get("/:week", (req, res) => {
  const w = Number(req.params.week);
  const found = rows.find((r) => r.week === w);
  if (!found) return res.status(404).json({ error: "Not found" });
  res.json(found);
});

export default router;
