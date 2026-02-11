import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.posts.list.path, async (req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  app.post(api.posts.create.path, async (req, res) => {
    try {
      const input = api.posts.create.input.parse(req.body);
      const post = await storage.createPost(input);
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Seed data
  const existingPosts = await storage.getPosts();
  if (existingPosts.length === 0) {
    await storage.createPost({
      title: "5 Trimmers Under ₹1000 That Actually Last",
      excerpt: "We tested 20 different models so you don't have to.",
      category: "Grooming",
      imageUrl: "https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&q=80&w=800",
      content: "Full review content here..."
    });
    await storage.createPost({
      title: "The Minimalist's Guide to Wardrobe Essentials",
      excerpt: "Building a capsule wardrobe with just 10 items.",
      category: "Lifestyle",
      imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800",
      content: "Full guide content here..."
    });
    await storage.createPost({
      title: "Morning Rituals for a Zen Start",
      excerpt: "How to structure your first hour for maximum productivity.",
      category: "Wellness",
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
      content: "Full content here..."
    });
  }

  return httpServer;
}
