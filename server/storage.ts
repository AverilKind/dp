import { 
  users, type User, type InsertUser,
  staffStatus, type StaffStatusType, type InsertStaffStatus,
  announcements, type AnnouncementType, type InsertAnnouncement,
  videoConfig, type VideoConfigType, type InsertVideoConfig
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
  getLatestAnnouncement(): Promise<AnnouncementType | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<AnnouncementType>;
  
  // Video configuration operations
  getVideoConfig(): Promise<VideoConfigType | undefined>;
  updateVideoConfig(config: InsertVideoConfig): Promise<VideoConfigType>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private staffStatusList: Map<number, StaffStatusType>;
  private announcementList: Map<number, AnnouncementType>;
  private videoConfigData: Map<number, VideoConfigType>;
  private userId: number;
  private staffId: number;
  private announcementId: number;
  private videoConfigId: number;

  constructor() {
    this.users = new Map();
    this.staffStatusList = new Map();
    this.announcementList = new Map();
    this.videoConfigData = new Map();
    this.userId = 1;
    this.staffId = 1;
    this.announcementId = 1;
    this.videoConfigId = 1;
    
    // Initialize with default staff
    const defaultStaff = [
      { id: this.staffId++, title: "KEPALA DINAS", isAvailable: false },
      { id: this.staffId++, title: "SEKRETARIS", isAvailable: false },
      { id: this.staffId++, title: "ICT", isAvailable: true },
      { id: this.staffId++, title: "KEUANGAN", isAvailable: true },
      { id: this.staffId++, title: "PENGAWAS", isAvailable: false },
    ];
    
    defaultStaff.forEach(staff => {
      this.staffStatusList.set(staff.id, staff);
    });
    
    // Initialize with a default announcement
    const defaultAnnouncement = {
      id: this.announcementId++,
      text: "Pendaftaran kursus komputer periode Januari 2024 telah dibuka. Silakan hubungi kantor SKB Salatiga untuk informasi lebih lanjut.",
      createdAt: Date.now()
    };
    
    this.announcementList.set(defaultAnnouncement.id, defaultAnnouncement);
    
    // Initialize with default video configuration
    const defaultVideoConfig = {
      id: this.videoConfigId++,
      videoId: "b6IVH_Xk1gE", // Example YouTube video ID
      title: "Video Promosi SKB Salatiga",
      updatedAt: Date.now()
    };
    
    this.videoConfigData.set(defaultVideoConfig.id, defaultVideoConfig);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
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

  async updateStaffStatus(staffList: StaffStatusType[]): Promise<StaffStatusType[]> {
    // Clear existing staff list
    this.staffStatusList.clear();
    
    // Add updated staff list
    staffList.forEach(staff => {
      this.staffStatusList.set(staff.id, staff);
    });
    
    return this.getAllStaffStatus();
  }

  // Announcement methods
  async getLatestAnnouncement(): Promise<AnnouncementType | undefined> {
    const announcements = Array.from(this.announcementList.values());
    if (announcements.length === 0) return undefined;
    
    // Sort by creation time (newest first)
    return announcements.sort((a, b) => b.createdAt - a.createdAt)[0];
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<AnnouncementType> {
    const id = this.announcementId++;
    const newAnnouncement: AnnouncementType = { 
      ...announcement, 
      id, 
      createdAt: Date.now()
    };
    
    this.announcementList.set(id, newAnnouncement);
    return newAnnouncement;
  }
  
  // Video configuration methods
  async getVideoConfig(): Promise<VideoConfigType | undefined> {
    const configs = Array.from(this.videoConfigData.values());
    if (configs.length === 0) return undefined;
    
    // Return the most recently updated config
    return configs.sort((a, b) => b.updatedAt - a.updatedAt)[0];
  }
  
  async updateVideoConfig(config: InsertVideoConfig): Promise<VideoConfigType> {
    // Clear existing configurations (we only need the most recent one)
    this.videoConfigData.clear();
    
    const id = this.videoConfigId++;
    const newConfig: VideoConfigType = {
      id,
      videoId: config.videoId,
      title: config.title || null,
      updatedAt: Date.now()
    };
    
    this.videoConfigData.set(id, newConfig);
    return newConfig;
  }
}

// Export the storage instance
export const storage = new MemStorage();
