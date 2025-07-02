import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.text({ type: "*/*" }));

const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) {
  console.error("AUTH_TOKEN not set in .env");
  process.exit(1);
}

//middleware to check auth token
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

let tabs: { title: string; url: string }[] = [];
let resolvePostPromise: ((value: void) => void) | null = null;

app.post('/api/tabs', authenticate, (req: Request, res: Response) => {
  const rawBody = req.body as string;

  // Extract the tabs array substring
  const tabsArrayMatch = rawBody.match(/\[\s*([\s\S]+)\s*\]/);
  if (!tabsArrayMatch) {
    return res.status(400).json({ error: 'No tabs array found' });
  }

  const tabsArrayStr = tabsArrayMatch[0];
  const objectPattern = /\{.*?\}/g;
  const matches = tabsArrayStr.match(objectPattern);

  if (!matches) {
    return res.status(400).json({ error: 'No tab objects found' });
  }

  try {
    tabs = matches.map(objStr => JSON.parse(objStr));
  } catch (e) {
    return res.status(400).json({ error: 'Failed to parse tab objects' });
  }

  // Notify the waiting GET request
  if (resolvePostPromise) {
    resolvePostPromise();
    resolvePostPromise = null; // Reset
  }

  res.status(201).json({ message: 'Tabs received', count: tabs.length });
});

app.get('/api/tabs', authenticate, async (req: Request, res: Response) => {
  try {
    const WEBHOOK_URL = process.env.WEBHOOK_URL as string | undefined;
    if (!WEBHOOK_URL) {
      throw new Error('WEBHOOK_URL is not set');
    }

    // Wait for the POST req to arrive with a timeout
    await new Promise<void>((resolve, reject) => {
      resolvePostPromise = resolve;

      // Timeout fallback
      setTimeout(() => {
        if (resolvePostPromise) {
          resolvePostPromise = null;
          reject(new Error('Timed out waiting for shortcut response'));
        }
      }, 100000); 
    });

    // return updated tabs
    res.json({ tabs });
    
  } catch (err) {
    console.error("Failed to wait for POST:", err);
    res.status(500).json({ error: 'Timed out waiting for tabs' });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));