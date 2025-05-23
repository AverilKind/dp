import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Staff Status schema
export const staffStatus = pgTable("staff_status", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  isAvailable: boolean("is_available").notNull().default(false),
});

export const insertStaffStatusSchema = createInsertSchema(staffStatus).pick({
  title: true,
  isAvailable: true,
});

export type InsertStaffStatus = z.infer<typeof insertStaffStatusSchema>;
export type StaffStatusType = typeof staffStatus.$inferSelect;

// Announcements schema
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  priority: integer("priority").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).pick({
  text: true,
  isActive: true,
  priority: true,
});

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type AnnouncementType = typeof announcements.$inferSelect;

// Video configuration schema (for backward compatibility)
export const videoConfig = pgTable("video_config", {
  id: serial("id").primaryKey(),
  videoId: text("video_id").notNull(),
  title: text("title"),
  updatedAt: text("updated_at").notNull(),
});

export const insertVideoConfigSchema = createInsertSchema(videoConfig).pick({
  videoId: true,
  title: true,
});

export type InsertVideoConfig = z.infer<typeof insertVideoConfigSchema>;
export type VideoConfigType = typeof videoConfig.$inferSelect;

// Video playlist schema (for multiple videos)
export const videoPlaylist = pgTable("video_playlist", {
  id: serial("id").primaryKey(),
  videoId: text("video_id").notNull(),
  title: text("title"),
  isActive: boolean("is_active").notNull().default(true),
  priority: integer("priority").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});

export const insertVideoPlaylistSchema = createInsertSchema(videoPlaylist).pick({
  videoId: true,
  title: true,
  isActive: true,
  priority: true,
});

export type InsertVideoPlaylist = z.infer<typeof insertVideoPlaylistSchema>;
export type VideoPlaylistType = typeof videoPlaylist.$inferSelect;
