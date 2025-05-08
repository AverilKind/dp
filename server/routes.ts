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

  // Get latest announcement
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

  // Create/update announcement
  app.post("/api/announcement", async (req, res) => {
    try {
      // Validate the request body
      const announcementSchema = z.object({
        text: z.string().min(1, "Announcement text is required"),
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

  const httpServer = createServer(app);
  return httpServer;
}
