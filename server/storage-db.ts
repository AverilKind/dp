import { 
  users, type User, type InsertUser,
  staffStatus, type StaffStatusType, type InsertStaffStatus,
  announcements, type AnnouncementType, type InsertAnnouncement,
  videoConfig, type VideoConfigType, type InsertVideoConfig
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
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
    const [announcement] = await db.select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt))
      .limit(1);
    
    return announcement;
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<AnnouncementType> {
    const [newAnnouncement] = await db.insert(announcements)
      .values({
        ...announcement,
        createdAt: String(Date.now())
      })
      .returning();
    
    return newAnnouncement;
  }

  // Video configuration methods
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
        ...config,
        updatedAt: String(Date.now())
      })
      .returning();
    
    return newConfig;
  }
}