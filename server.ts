import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Game Controls & Combos Generator Endpoint
  app.post("/api/gemini/generate-controls", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "GEMINI_API_KEY environment variable is missing in server environment." });
      }

      const { gameTitle, playstyle, platform = 'pc' } = req.body;
      if (!gameTitle || typeof gameTitle !== 'string') {
        return res.status(400).json({ error: "A valid 'gameTitle' is required." });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Generate a comprehensive video game control scheme and combo guide for the game: "${gameTitle}"${playstyle ? ` focusing on playstyle/character: "${playstyle}"` : ''} on default platform "${platform}".
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
          temperature: 0.7,
        }
      });

      const textOutput = response.text;
      if (!textOutput) {
        return res.status(500).json({ error: "Gemini AI returned empty response." });
      }

      const parsedData = JSON.parse(textOutput.trim());
      
      // Convert to markdown for backwards compatibility
      let md = `# ${parsedData.name || gameTitle}\n`;
      if (parsedData.categories && Array.isArray(parsedData.categories)) {
        for (const cat of parsedData.categories) {
          md += `\n## ${cat.name}\n`;
          if (cat.items && Array.isArray(cat.items)) {
            for (const item of cat.items) {
              md += `* ${item.keys.startsWith('`') ? item.keys : `\`${item.keys}\``} ${item.description}\n`;
            }
          }
        }
      }

      return res.json({
        profile: {
          id: `game-${Date.now()}`,
          name: parsedData.name || gameTitle,
          genre: parsedData.genre || 'General',
          developer: parsedData.developer || 'Unknown',
          platformSupport: ['pc', 'xbox', 'playstation', 'switch'],
          defaultPlatform: parsedData.defaultPlatform || platform,
          md: md,
          categories: parsedData.categories || [],
          combos: parsedData.combos || []
        }
      });
    } catch (error: any) {
      console.error("Error in /api/gemini/generate-controls:", error);
      return res.status(500).json({ error: error?.message || "Failed to generate game controls with Gemini AI." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
