import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the digital signage system
  
  // Get staff status
  app.get("/api/staff-status", async (req, res) => {
    try {
      const staffStatusList = await storage.getAllStaffStatus();
      res.json(staffStatusList);
    } catch (error) {
      res.status(500).json({ message: "Failed to get staff status" });
    }
  });

  // Update staff status
  app.post("/api/staff-status", async (req, res) => {
    try {
      // Validate the request body
      const staffSchema = z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          isAvailable: z.boolean(),
        })
      );
      
      const validatedData = staffSchema.parse(req.body);
      const updatedStaff = await storage.updateStaffStatus(validatedData);
      res.json(updatedStaff);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid staff status data",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get latest announcement (for backward compatibility)
  app.get("/api/announcement", async (req, res) => {
    try {
      const announcement = await storage.getLatestAnnouncement();
      if (!announcement) {
        return res.status(404).json({ message: "No announcements found" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ message: "Failed to get announcement" });
    }
  });
  
  // Get all active announcements for running text
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get announcements" });
    }
  });

  // Create new announcement
  app.post("/api/announcements", async (req, res) => {
    try {
      // Validate the request body
      const announcementSchema = z.object({
        text: z.string().min(1, "Announcement text is required"),
        isActive: z.boolean().optional().default(true),
        priority: z.number().int().optional().default(0),
      });
      
      const validatedData = announcementSchema.parse(req.body);
      const newAnnouncement = await storage.createAnnouncement(validatedData);
      res.json(newAnnouncement);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid announcement data",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Update existing announcement
  app.patch("/api/announcements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid announcement ID" });
      }
      
      // Validate the request body
      const announcementSchema = z.object({
        text: z.string().min(1).optional(),
        isActive: z.boolean().optional(),
        priority: z.number().int().optional(),
      });
      
      const validatedData = announcementSchema.parse(req.body);
      const updatedAnnouncement = await storage.updateAnnouncement(id, validatedData);
      
      if (!updatedAnnouncement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      
      res.json(updatedAnnouncement);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid announcement data",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Delete announcement
  app.delete("/api/announcements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid announcement ID" });
      }
      
      const success = await storage.deleteAnnouncement(id);
      if (!success) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete announcement" });
    }
  });
  
  // Get video configuration (for backward compatibility)
  app.get("/api/video-config", async (req, res) => {
    try {
      const videoConfig = await storage.getVideoConfig();
      if (!videoConfig) {
        return res.status(404).json({ message: "No video configuration found" });
      }
      res.json(videoConfig);
    } catch (error) {
      res.status(500).json({ message: "Failed to get video configuration" });
    }
  });
  
  // Update video configuration (for backward compatibility)
  app.post("/api/video-config", async (req, res) => {
    try {
      // Validate the request body
      const videoConfigSchema = z.object({
        videoId: z.string().min(1, "YouTube Video ID is required"),
        title: z.string().optional(),
      });
      
      const validatedData = videoConfigSchema.parse(req.body);
      const updatedConfig = await storage.updateVideoConfig(validatedData);
      res.json(updatedConfig);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid video configuration data",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Get all active videos in the playlist
  app.get("/api/video-playlist", async (req, res) => {
    try {
      const videos = await storage.getAllVideoPlaylist();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to get video playlist" });
    }
  });
  
  // Get a specific video from the playlist
  app.get("/api/video-playlist/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }
      
      const video = await storage.getVideoPlaylistItem(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to get video" });
    }
  });
  
  // Add a new video to the playlist
  app.post("/api/video-playlist", async (req, res) => {
    try {
      // Validate the request body
      const videoSchema = z.object({
        videoId: z.string().min(1, "YouTube Video ID is required"),
        title: z.string().optional(),
        isActive: z.boolean().optional().default(true),
        priority: z.number().int().optional().default(0),
      });
      
      const validatedData = videoSchema.parse(req.body);
      const newVideo = await storage.addToVideoPlaylist(validatedData);
      res.json(newVideo);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid video data",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Update an existing video in the playlist
  app.patch("/api/video-playlist/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }
      
      // Validate the request body
      const videoSchema = z.object({
        videoId: z.string().min(1).optional(),
        title: z.string().optional(),
        isActive: z.boolean().optional(),
        priority: z.number().int().optional(),
      });
      
      const validatedData = videoSchema.parse(req.body);
      const updatedVideo = await storage.updateVideoPlaylistItem(id, validatedData);
      
      if (!updatedVideo) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json(updatedVideo);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid video data",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Delete a video from the playlist
  app.delete("/api/video-playlist/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }
      
      const success = await storage.deleteVideoPlaylistItem(id);
      if (!success) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
