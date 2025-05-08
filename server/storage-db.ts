import { 
  users, type User, type InsertUser,
  staffStatus, type StaffStatusType, type InsertStaffStatus,
  announcements, type AnnouncementType, type InsertAnnouncement,
  videoConfig, type VideoConfigType, type InsertVideoConfig,
  videoPlaylist, type VideoPlaylistType, type InsertVideoPlaylist
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { IStorage } from "./storage";

// Database implementation of the storage interface
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Staff status methods
  async getAllStaffStatus(): Promise<StaffStatusType[]> {
    const staffList = await db.select().from(staffStatus);
    return staffList;
  }

  async updateStaffStatus(staffList: StaffStatusType[]): Promise<StaffStatusType[]> {
    // First, delete existing records (this is a simple approach for the app)
    await db.delete(staffStatus);
    
    // Then insert the new records
    const updatedStaff = await db.insert(staffStatus)
      .values(staffList.map(staff => ({
        id: staff.id,
        title: staff.title,
        isAvailable: staff.isAvailable
      })))
      .returning();
    
    return updatedStaff;
  }

  // Announcement methods
  async getLatestAnnouncement(): Promise<AnnouncementType | undefined> {
    // For backward compatibility
    const [announcement] = await db.select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt))
      .limit(1);
    
    return announcement;
  }
  
  async getAllAnnouncements(): Promise<AnnouncementType[]> {
    // Get all active announcements sorted by priority
    const announcementList = await db.select()
      .from(announcements)
      .where(eq(announcements.isActive, true))
      .orderBy(announcements.priority);
    
    return announcementList;
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<AnnouncementType> {
    const [newAnnouncement] = await db.insert(announcements)
      .values({
        text: announcement.text,
        isActive: announcement.isActive ?? true,
        priority: announcement.priority ?? 0,
        createdAt: String(Date.now())
      })
      .returning();
    
    return newAnnouncement;
  }
  
  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<AnnouncementType | undefined> {
    const [updatedAnnouncement] = await db.update(announcements)
      .set(announcement)
      .where(eq(announcements.id, id))
      .returning();
    
    return updatedAnnouncement;
  }
  
  async deleteAnnouncement(id: number): Promise<boolean> {
    const result = await db.delete(announcements)
      .where(eq(announcements.id, id));
    
    return true;
  }

  // Video configuration methods (for backward compatibility)
  async getVideoConfig(): Promise<VideoConfigType | undefined> {
    const [config] = await db.select()
      .from(videoConfig)
      .orderBy(desc(videoConfig.updatedAt))
      .limit(1);
    
    return config;
  }

  async updateVideoConfig(config: InsertVideoConfig): Promise<VideoConfigType> {
    const [newConfig] = await db.insert(videoConfig)
      .values({
        videoId: config.videoId,
        title: config.title || null,
        updatedAt: String(Date.now())
      })
      .returning();
    
    return newConfig;
  }
  
  // Video playlist methods (for multiple videos)
  async getAllVideoPlaylist(): Promise<VideoPlaylistType[]> {
    // Get all active videos sorted by priority
    const videoList = await db.select()
      .from(videoPlaylist)
      .where(eq(videoPlaylist.isActive, true))
      .orderBy(videoPlaylist.priority);
    
    return videoList;
  }
  
  async getVideoPlaylistItem(id: number): Promise<VideoPlaylistType | undefined> {
    const [video] = await db.select()
      .from(videoPlaylist)
      .where(eq(videoPlaylist.id, id));
    
    return video;
  }
  
  async addToVideoPlaylist(item: InsertVideoPlaylist): Promise<VideoPlaylistType> {
    const [newItem] = await db.insert(videoPlaylist)
      .values({
        videoId: item.videoId,
        title: item.title || null,
        isActive: item.isActive ?? true,
        priority: item.priority ?? 0,
        updatedAt: String(Date.now())
      })
      .returning();
    
    return newItem;
  }
  
  async updateVideoPlaylistItem(id: number, item: Partial<InsertVideoPlaylist>): Promise<VideoPlaylistType | undefined> {
    const [updatedItem] = await db.update(videoPlaylist)
      .set(item)
      .where(eq(videoPlaylist.id, id))
      .returning();
    
    return updatedItem;
  }
  
  async deleteVideoPlaylistItem(id: number): Promise<boolean> {
    const result = await db.delete(videoPlaylist)
      .where(eq(videoPlaylist.id, id));
    
    return true;
  }
}