var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "5mb" }));
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/gemini/generate-controls", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "GEMINI_API_KEY environment variable is missing in server environment." });
      }
      const { gameTitle, playstyle, platform = "pc" } = req.body;
      if (!gameTitle || typeof gameTitle !== "string") {
        return res.status(400).json({ error: "A valid 'gameTitle' is required." });
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const prompt = `Generate a comprehensive video game control scheme and combo guide for the game: "${gameTitle}"${playstyle ? ` focusing on playstyle/character: "${playstyle}"` : ""} on default platform "${platform}".
Return a JSON object with this EXACT structure:
{
  "name": "${gameTitle}",
  "genre": "FPS/Action RPG/Fighting/Battle Royale/Sports/Sandbox/MOBA/Strategy/Co-op Shooter/Racing/General",
  "developer": "Developer Name",
  "defaultPlatform": "${platform}",
  "categories": [
    {
      "name": "Category Name (e.g. Basic Movement, Combat & Attacks, Special Abilities, Vehicle Controls, Utility & Menus)",
      "items": [
        {
          "id": "item-1",
          "description": "Action name (e.g. Sprint, Light Attack, Special Ability, Reload)",
          "keys": "\`Button/Key Combination\` Description / Note if applicable",
          "platformKeys": {
            "pc": "\`W A S D\` / \`LMB\`",
            "xbox": "\`A\` / \`RT\`",
            "playstation": "\`Cross\` / \`R2\`",
            "switch": "\`B\` / \`ZR\`"
          },
          "notes": "Optional tip or timing note"
        }
      ]
    }
  ],
  "combos": [
    {
      "name": "Combo / Sequence Name",
      "sequence": "Button1 -> Button2 -> Button3",
      "description": "Short explanation of what the combo or sequence accomplishes"
    }
  ]
}
Make sure the key combinations are accurate for real video games. Include at least 3 categories and 10-15 key control bindings total, plus 2-3 iconic combos or skill sequences.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      });
      const textOutput = response.text;
      if (!textOutput) {
        return res.status(500).json({ error: "Gemini AI returned empty response." });
      }
      const parsedData = JSON.parse(textOutput.trim());
      let md = `# ${parsedData.name || gameTitle}
`;
      if (parsedData.categories && Array.isArray(parsedData.categories)) {
        for (const cat of parsedData.categories) {
          md += `
## ${cat.name}
`;
          if (cat.items && Array.isArray(cat.items)) {
            for (const item of cat.items) {
              md += `* ${item.keys.startsWith("`") ? item.keys : `\`${item.keys}\``} ${item.description}
`;
            }
          }
        }
      }
      return res.json({
        profile: {
          id: `game-${Date.now()}`,
          name: parsedData.name || gameTitle,
          genre: parsedData.genre || "General",
          developer: parsedData.developer || "Unknown",
          platformSupport: ["pc", "xbox", "playstation", "switch"],
          defaultPlatform: parsedData.defaultPlatform || platform,
          md,
          categories: parsedData.categories || [],
          combos: parsedData.combos || []
        }
      });
    } catch (error) {
      console.error("Error in /api/gemini/generate-controls:", error);
      return res.status(500).json({ error: error?.message || "Failed to generate game controls with Gemini AI." });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
