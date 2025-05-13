import {
  users,
  type User,
  type InsertUser,
  staffStatus,
  type StaffStatusType,
  type InsertStaffStatus,
  announcements,
  type AnnouncementType,
  type InsertAnnouncement,
  videoConfig,
  type VideoConfigType,
  type InsertVideoConfig,
  videoPlaylist,
  type VideoPlaylistType,
  type InsertVideoPlaylist,
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Staff status operations
  getAllStaffStatus(): Promise<StaffStatusType[]>;
  updateStaffStatus(staffList: StaffStatusType[]): Promise<StaffStatusType[]>;

  // Announcement operations
  getLatestAnnouncement(): Promise<AnnouncementType | undefined>; // For backward compatibility
  getAllAnnouncements(): Promise<AnnouncementType[]>; // Get all active announcements
  createAnnouncement(
    announcement: InsertAnnouncement
  ): Promise<AnnouncementType>;
  updateAnnouncement(
    id: number,
    announcement: Partial<InsertAnnouncement>
  ): Promise<AnnouncementType | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;

  // Video configuration operations (for backward compatibility)
  getVideoConfig(): Promise<VideoConfigType | undefined>;
  updateVideoConfig(config: InsertVideoConfig): Promise<VideoConfigType>;

  // Video playlist operations (for multiple videos)
  getAllVideoPlaylist(): Promise<VideoPlaylistType[]>;
  getVideoPlaylistItem(id: number): Promise<VideoPlaylistType | undefined>;
  addToVideoPlaylist(item: InsertVideoPlaylist): Promise<VideoPlaylistType>;
  updateVideoPlaylistItem(
    id: number,
    item: Partial<InsertVideoPlaylist>
  ): Promise<VideoPlaylistType | undefined>;
  deleteVideoPlaylistItem(id: number): Promise<boolean>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private staffStatusList: Map<number, StaffStatusType>;
  private announcementList: Map<number, AnnouncementType>;
  private videoConfigData: Map<number, VideoConfigType>;
  private videoPlaylistData: Map<number, VideoPlaylistType>;
  private userId: number;
  private staffId: number;
  private announcementId: number;
  private videoConfigId: number;
  private videoPlaylistId: number;

  constructor() {
    this.users = new Map();
    this.staffStatusList = new Map();
    this.announcementList = new Map();
    this.videoConfigData = new Map();
    this.videoPlaylistData = new Map();
    this.userId = 1;
    this.staffId = 1;
    this.announcementId = 1;
    this.videoConfigId = 1;
    this.videoPlaylistId = 1;

    // Initialize with default staff
    const defaultStaff = [
      { id: this.staffId++, title: "KEPALA DINAS", isAvailable: false },
      { id: this.staffId++, title: "SEKRETARIS", isAvailable: false },
      { id: this.staffId++, title: "ICT", isAvailable: true },
      { id: this.staffId++, title: "KEUANGAN", isAvailable: true },
      { id: this.staffId++, title: "PENGAWAS", isAvailable: false },
    ];

    defaultStaff.forEach((staff) => {
      this.staffStatusList.set(staff.id, staff);
    });

    // Initialize with a default announcement
    const defaultAnnouncement = {
      id: this.announcementId++,
      text: "Pendaftaran kursus komputer periode Januari 2024 telah dibuka. Silakan hubungi kantor SKB Salatiga untuk informasi lebih lanjut.",
      isActive: true,
      priority: 1,
      createdAt: String(Date.now()),
    };

    this.announcementList.set(defaultAnnouncement.id, defaultAnnouncement);

    // Initialize with default video configuration
    const defaultVideoConfig = {
      id: this.videoConfigId++,
      videoId: "b6IVH_Xk1gE", // Example YouTube video ID
      title: "Video Promosi SKB Salatiga",
      updatedAt: String(Date.now()),
    };

    this.videoConfigData.set(defaultVideoConfig.id, defaultVideoConfig);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Staff status methods
  async getAllStaffStatus(): Promise<StaffStatusType[]> {
    return Array.from(this.staffStatusList.values());
  }

  async updateStaffStatus(
    staffList: StaffStatusType[]
  ): Promise<StaffStatusType[]> {
    // Clear existing staff list
    this.staffStatusList.clear();

    // Add updated staff list
    staffList.forEach((staff) => {
      this.staffStatusList.set(staff.id, staff);
    });

    return this.getAllStaffStatus();
  }

  // Announcement methods
  async getLatestAnnouncement(): Promise<AnnouncementType | undefined> {
    const announcements = Array.from(this.announcementList.values());
    if (announcements.length === 0) return undefined;

    // Sort by creation time (newest first)
    return announcements.sort(
      (a, b) => Number(b.createdAt) - Number(a.createdAt)
    )[0];
  }

  async getAllAnnouncements(): Promise<AnnouncementType[]> {
    const announcements = Array.from(this.announcementList.values())
      .filter((a) => a.isActive)
      .sort((a, b) => a.priority - b.priority);
    return announcements;
  }

  async createAnnouncement(
    announcement: InsertAnnouncement
  ): Promise<AnnouncementType> {
    const id = this.announcementId++;
    const newAnnouncement: AnnouncementType = {
      id,
      text: announcement.text,
      isActive: announcement.isActive ?? true,
      priority: announcement.priority ?? 0,
      createdAt: String(Date.now()),
    };

    this.announcementList.set(id, newAnnouncement);
    return newAnnouncement;
  }

  async updateAnnouncement(
    id: number,
    announcement: Partial<InsertAnnouncement>
  ): Promise<AnnouncementType | undefined> {
    const existingAnnouncement = this.announcementList.get(id);
    if (!existingAnnouncement) return undefined;

    const updatedAnnouncement = {
      ...existingAnnouncement,
      ...announcement,
    };

    this.announcementList.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcementList.delete(id);
  }

  // Video configuration methods
  async getVideoConfig(): Promise<VideoConfigType | undefined> {
    const configs = Array.from(this.videoConfigData.values());
    if (configs.length === 0) return undefined;

    // Return the most recently updated config
    return configs.sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))[0];
  }

  async updateVideoConfig(config: InsertVideoConfig): Promise<VideoConfigType> {
    // Clear existing configurations (we only need the most recent one)
    this.videoConfigData.clear();

    const id = this.videoConfigId++;
    const newConfig: VideoConfigType = {
      id,
      videoId: config.videoId,
      title: config.title || null,
      updatedAt: String(Date.now()),
    };

    this.videoConfigData.set(id, newConfig);
    return newConfig;
  }

  // Video playlist methods
  async getAllVideoPlaylist(): Promise<VideoPlaylistType[]> {
    const videos = Array.from(this.videoPlaylistData.values())
      .filter((v) => v.isActive)
      .sort((a, b) => a.priority - b.priority);
    return videos;
  }

  async getVideoPlaylistItem(
    id: number
  ): Promise<VideoPlaylistType | undefined> {
    return this.videoPlaylistData.get(id);
  }

  async addToVideoPlaylist(
    item: InsertVideoPlaylist
  ): Promise<VideoPlaylistType> {
    const id = this.videoPlaylistId++;
    const newItem: VideoPlaylistType = {
      id,
      videoId: item.videoId,
      title: item.title || null,
      isActive: item.isActive ?? true,
      priority: item.priority ?? 0,
      updatedAt: String(Date.now()),
    };

    this.videoPlaylistData.set(id, newItem);
    return newItem;
  }

  async updateVideoPlaylistItem(
    id: number,
    item: Partial<InsertVideoPlaylist>
  ): Promise<VideoPlaylistType | undefined> {
    const existingItem = this.videoPlaylistData.get(id);
    if (!existingItem) return undefined;

    const updatedItem = {
      ...existingItem,
      ...item,
    };

    this.videoPlaylistData.set(id, updatedItem);
    return updatedItem;
  }

  async deleteVideoPlaylistItem(id: number): Promise<boolean> {
    return this.videoPlaylistData.delete(id);
  }

  async addStaff({
    title,
    isAvailable,
  }: {
    title: string;
    isAvailable: boolean;
  }) {
    const id = this.staffId++;
    const newStaff = { id, title, isAvailable };
    this.staffStatusList.set(id, newStaff);
    return newStaff;
  }

  async deleteStaff(id: number) {
    return this.staffStatusList.delete(id);
  }
}

// We'll decide which storage implementation to use based on environment
// If we have a DATABASE_URL, use the database storage, otherwise use memory storage
import { DatabaseStorage } from "./storage-db";

export const storage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();
