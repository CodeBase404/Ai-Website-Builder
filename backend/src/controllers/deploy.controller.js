// import path from "path";
// import os from "os";
// import fs from "fs-extra";
import fetch from "node-fetch";
// import { saveFilesToDisk } from "../utils/saveFilesToDisk.js";
// import { buildProject } from "../utils/buildVite.js";
// import { zipDistFolder } from "../utils/zipDistFolder.js";

// export const deployViteProject = async (req, res) => {
//   const { files } = req.body;

//   if (!files || !Array.isArray(files)) {
//     return res.status(400).json({ success: false, error: "No files provided" });
//   }

//   const tempProjectDir = path.join(os.tmpdir(), `vite-project-${Date.now()}`);
//   const distPath = path.join(tempProjectDir, "dist");
//   const zipPath = path.join(os.tmpdir(), `vite-project-${Date.now()}.zip`);

//   try {
//     await saveFilesToDisk(files, tempProjectDir);
//     await buildProject(tempProjectDir);
//     await zipDistFolder(distPath, zipPath);

//     res.download(zipPath); // or deploy to Netlify if needed
//   } catch (err) {
//     console.error("Build error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

export const deployProject = async (req, res) => {
  const { files } = req.body;

  if (!files || !Array.isArray(files)) {
    return res.status(400).json({ success: false, error: "No files provided." });
  }

  try {
    const vercelFiles = files.map(({ path, content }) => ({
      file: path.startsWith("/") ? path.slice(1) : path,
      data: content,
    }));

    const response = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "genify-project",
        files: vercelFiles,
        target: "production", // ✅ important to define
        projectSettings: {
          framework: null,
        },
      }),
    });

    const result = await response.json();

    if (response.ok && result?.url) {
      res.json({ success: true, url: `https://${result.url}` });
    } else {
      console.error("❌ Vercel API error:", result);
      res.status(500).json({ success: false, error: result });
    }
  } catch (err) {
    console.error("❌ Server Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
