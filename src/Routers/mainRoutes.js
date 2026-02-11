const express = require("express");
const { nanoid } = require("nanoid");
const asyncHandler = require("../Middlewares/asyncHandler");
const AppError = require("../Error/AppError");
const { pool } = require("../Config/config");
const { getNow } = require("../Utils/helper");

const mainRouter = express.Router();

// Health check
mainRouter.get("/api/healthz", async (req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

// Create a paste
mainRouter.post(
  "/api/pastes",
  asyncHandler(async (req, res) => {
    const { content, ttl_seconds, max_views } = req.body;

    // Validation
    if (!content || typeof content !== "string" || content.trim() === "") {
      throw new AppError("Content is required", 400);
    }

    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        throw new AppError("ttl_seconds must be >= 1", 400);
      }
    }

    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        throw new AppError("max_views must be >= 1", 400);
      }
    }

    // Generate nanoid
    const id = nanoid(10);

    // Time handling (TEST_MODE aware)
    const now = getNow(req);
    const expires_at =
      ttl_seconds !== undefined ? now + ttl_seconds * 1000 : null;

    // Insert into DB
    await pool.query(
      `
      INSERT INTO pastes (id, content, created_at, expires_at, max_views)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [id, content, now, expires_at, max_views ?? null],
    );

    // Response
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.status(201).json({
      id,
      url: `${baseUrl}/p/${id}`,
    });
  }),
);

// Fetch a paste (API)
mainRouter.get(
  "/api/pastes/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const now = getNow(req);

    // Fetch paste
    const result = await pool.query("SELECT * FROM pastes WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      throw new AppError("Paste not found", 404);
    }

    const paste = result.rows[0];

    // Check TTL
    if (paste.expires_at !== null && now >= paste.expires_at) {
      throw new AppError("Paste expired", 404);
    }

    // Check view limit
    if (paste.max_views !== null && paste.views >= paste.max_views) {
      throw new AppError("View limit exceeded", 404);
    }

    // Increment views (only after checks)
    await pool.query("UPDATE pastes SET views = views + 1 WHERE id = $1", [id]);

    // Prepare response fields
    const remaining_views =
      paste.max_views === null
        ? null
        : Math.max(paste.max_views - (paste.views + 1), 0);

    let expires_at = null;

    if (paste.expires_at !== null) {
      const expiryMs = Number(paste.expires_at);
      if (!Number.isNaN(expiryMs)) {
        expires_at = new Date(expiryMs).toISOString();
      }
    }

    // Respond
    res.status(200).json({
      content: paste.content,
      remaining_views,
      expires_at,
    });
  }),
);

// View a paste (HTML)
mainRouter.get(
  "/p/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const now = getNow(req);

    // Fetch paste
    const result = await pool.query("SELECT * FROM pastes WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      throw new AppError("Paste not found", 404);
    }

    const paste = result.rows[0];

    // Check TTL
    if (paste.expires_at !== null && now >= Number(paste.expires_at)) {
      throw new AppError("Paste expired", 404);
    }

    // Check view limit
    if (paste.max_views !== null && paste.views >= paste.max_views) {
      throw new AppError("View limit exceeded", 404);
    }

    // Increment views
    await pool.query("UPDATE pastes SET views = views + 1 WHERE id = $1", [id]);

    // SAFE HTML escaping (CRITICAL)
    const escapedContent = paste.content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    // Return HTML
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Paste</title>
          <style>
            body {
              font-family: monospace;
              background: #f6f8fa;
              padding: 20px;
            }
            pre {
              background: #fff;
              padding: 16px;
              border-radius: 6px;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          </style>
        </head>
        <body>
          <pre>${escapedContent}</pre>
        </body>
      </html>
    `);
  }),
);

module.exports = mainRouter;
