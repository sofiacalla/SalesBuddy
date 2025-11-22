// This file configures the Express server to serve static files.
// - Imports required modules (fs, http Server, path, Express).
// - Defines serveStatic() to serve files from the "public" build directory.
// - Throws an error if the build directory does not exist (ensures client is built first).
// - Uses express.static() to serve all files in the "public" folder.
// - Falls back to serving index.html for any unmatched routes (supporting client-side routing).
// - Finally, calls runApp(serveStatic) to start the application with this static file setup.
import fs from "node:fs";
import { type Server } from "node:http";
import path from "node:path";

import express, { type Express, type Request } from "express";

import runApp from "./app";

export async function serveStatic(app: Express, server: Server) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

(async () => {
  await runApp(serveStatic);
})();
