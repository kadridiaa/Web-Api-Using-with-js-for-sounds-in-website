// src/app.mjs
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "node:url";
import crypto from "crypto";
import multer from "multer";
import cors from "cors"; // ← Import CORS

// import utility functions from utils.mjs
import {
  slugify, safePresetPath, fileExists,
  readJSON, writeJSON, listPresetFiles, validatePreset
} from "./utils.mjs";

export const app = express();

// 🌟 Activer CORS pour toutes les origines (développement)
app.use(cors());

// JSON body parser
app.use(express.json({ limit: "2mb" }));

// Multer pour upload
const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const folder = req.params.folder || "";
      const destDir = path.join(DATA_DIR, folder);
      await fs.mkdir(destDir, { recursive: true }).catch(() => {});
      cb(null, destDir);
    },
    filename: (req, file, cb) => cb(null, file.originalname)
  }),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// --------- Paths ---------
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
export const PUBLIC_DIR = process.env.PUBLIC_DIR
  ? path.resolve(process.env.PUBLIC_DIR)
  : path.resolve(__dirname, "../public");
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(PUBLIC_DIR, "presets");

app.use(express.static(PUBLIC_DIR));
await fs.mkdir(DATA_DIR, { recursive: true }).catch(() => {});

// ------- Routes -------
app.get("/api/health", (_req, res) => res.json({ ok: true, now: new Date().toISOString() }));

app.get("/api/presets", async (req, res, next) => {
  try {
    const { q, type, factory } = req.query;
    const files = await listPresetFiles();
    let items = await Promise.all(files.map((f) => readJSON(path.join(DATA_DIR, f))));

    if (type) items = items.filter((p) => p?.type?.toLowerCase() === type.toLowerCase());
    if (factory !== undefined) {
      const want = String(factory) === "true";
      items = items.filter((p) => Boolean(p?.isFactoryPresets) === want);
    }
    if (q) {
      const needle = String(q).toLowerCase();
      items = items.filter((p) => {
        const inName = p?.name?.toLowerCase().includes(needle);
        const inSamples = Array.isArray(p?.samples) && p.samples.some((s) =>
          s && (s.name?.toLowerCase().includes(needle) || s.url?.toLowerCase().includes(needle))
        );
        return inName || inSamples;
      });
    }

    res.json(items);
  } catch (e) { next(e); }
});

app.get("/api/presets/:name", async (req, res, next) => {
  try {
    const file = safePresetPath(req.params.name);
    if (!(await fileExists(file))) return res.status(404).json({ error: "Preset not found" });
    res.json(await readJSON(file));
  } catch (e) { next(e); }
});

// POST upload, PUT, PATCH, DELETE… restent identiques

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});
