import express from "express";
import fetch from "node-fetch";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

// Proxy for Google Drive Folders to list files from public folders
app.get("/api/drive-folder", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing folder id" });
  
  try {
    const url = `https://drive.google.com/embeddedfolderview?id=${id}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
      }
    });
    
    const html = await response.text();
    const files: { id: string; name: string }[] = [];
    
    try {
      // Look for the JSON-like metadata that Drive often embeds
      // It looks like ["id", "title", ...]
      const metadataMatches = html.matchAll(/\["([-_\w]{25,})","([^"]{2,100})"[,\]]/g);
      for (const match of metadataMatches) {
        const id = match[1];
        const name = match[2];
        // Heuristic: names usually don't have certain characters, and avoid obvious non-names
        if (!name.startsWith('http') && !name.includes('\\u') && name.length >= 2) {
           files.push({ id, name: name.replace(/\\x27/g, "'").replace(/\\x22/g, '"') });
        }
      }

      // Fallback 1: flip-entry-title
      if (files.length === 0) {
        const idMatches = [...html.matchAll(/\/file\/d\/([-\w]{25,})\//g)].map(m => m[1]);
        const titleMatches = [...html.matchAll(/class="flip-entry-title"[^>]*>(.*?)<\/div>/g)].map(m => m[1].trim());
        if (idMatches.length > 0 && idMatches.length === titleMatches.length) {
          for (let i = 0; i < idMatches.length; i++) {
            files.push({ id: idMatches[i], name: titleMatches[i] });
          }
        }
      }

      // Fallback 2: aria-label
      if (files.length === 0) {
        const ariaMatches = html.matchAll(/\/file\/d\/([-\w]{25,})\/[^>]*aria-label="(.*?)"/g);
        for (const match of ariaMatches) {
          files.push({ id: match[1], name: match[2].trim() });
        }
      }
    } catch (e) {
      console.warn("Parsing failed:", e);
    }
    
    // Dedup and fallback
    const uniqueFilesMap = new Map();
    files.forEach(f => uniqueFilesMap.set(f.id, f));
    
    // If empty, try a blind ID match as a last resort
    if (uniqueFilesMap.size === 0) {
      const simpleMatch = html.matchAll(/\/file\/d\/([-\w]{25,})/g);
      [...new Set([...simpleMatch].map(m => m[1]))].forEach(id => {
        uniqueFilesMap.set(id, { id, name: `Image ${id.substring(0, 4)}` });
      });
    }

    res.json(Array.from(uniqueFilesMap.values()));
  } catch (error: any) {
    console.error("Drive Folder Proxy Error:", error);
    res.status(500).json({ error: "Failed to list drive folder files", details: error.message });
  }
});

// Proxy for Google Sheets to avoid CORS
app.get("/api/sheets", async (req, res) => {
  const { id, sheet } = req.query;
  if (!id || !sheet) {
    return res.status(400).json({ error: "Missing id or sheet parameter" });
  }

  const formats = [
    `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet as string)}`,
    `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&sheet=${encodeURIComponent(sheet as string)}`
  ];

  let lastError: any = null;

  for (const url of formats) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      const body = await response.text();

      if (response.ok && body.includes(',')) {
        if (body.trim().startsWith('<!doctype html>') || body.trim().startsWith('<html>')) {
          continue;
        }
        res.setHeader('Content-Type', 'text/csv');
        return res.send(body);
      } else {
        lastError = { status: response.status, body: body.substring(0, 100) };
      }
    } catch (error: any) {
      lastError = error;
    }
  }

  res.status(502).json({ 
    error: "Failed to fetch spreadsheet data after multiple attempts.", 
    details: lastError?.message || lastError?.body || "Unknown error"
  });
});

// AI Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Convert history for generateContent
    // NOTE: Gemini API history MUST start with 'user'
    let contents = messages.map((m: any) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    // Strip leading 'model' messages if they exist
    while (contents.length > 0 && contents[0].role === 'model') {
      contents.shift();
    }

    if (contents.length === 0) {
      return res.status(400).json({ error: "No user message provided to history" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "Failed to get AI response", details: error.message || String(error) });
  }
});

// Export the app for Vercel
export default app;
