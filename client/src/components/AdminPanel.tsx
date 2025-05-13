import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  StaffStatusType,
  AnnouncementType,
  VideoConfigType,
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Announcement state and mutation
  const [announcement, setAnnouncement] = useState("");
  const { data: currentAnnouncement } = useQuery<AnnouncementType>({
    queryKey: ["/api/announcement"],
  });

  useEffect(() => {
    if (currentAnnouncement) {
      setAnnouncement(currentAnnouncement.text);
    }
  }, [currentAnnouncement]);

  const updateAnnouncementMutation = useMutation({
    mutationFn: async (text: string) => {
      await apiRequest("POST", "/api/announcement", { text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcement"] });
      toast({
        title: "Success",
        description: "Pengumuman diperbarui!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Gagal memperbarui pengumuman: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Video Configuration state and mutation
  const [videoId, setVideoId] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const { data: currentVideoConfig } = useQuery<VideoConfigType>({
    queryKey: ["/api/video-config"],
  });

  useEffect(() => {
    if (currentVideoConfig) {
      setVideoId(currentVideoConfig.videoId);
      setVideoTitle(currentVideoConfig.title || "");
    }
  }, [currentVideoConfig]);

  const updateVideoConfigMutation = useMutation({
    mutationFn: async (config: { videoId: string; title: string }) => {
      await apiRequest("POST", "/api/video-config", config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/video-config"] });
      toast({
        title: "Success",
        description: "Konfigurasi video diperbarui!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Gagal memperbarui konfigurasi video: ${error}`,
        variant: "destructive",
      });
    },
  });

  const handleSaveVideoConfig = () => {
    if (!videoId) {
      toast({
        title: "Error",
        description: "ID video YouTube harus diisi",
        variant: "destructive",
      });
      return;
    }
    updateVideoConfigMutation.mutate({ videoId, title: videoTitle });
  };

  // Staff status state and mutation
  const { data: staffListData } = useQuery<StaffStatusType[]>({
    queryKey: ["/api/staff-status"],
  });

  const [staffStatus, setStaffStatus] = useState<StaffStatusType[]>([]);

  useEffect(() => {
    if (staffListData) {
      setStaffStatus(staffListData);
    }
  }, [staffListData]);

  const updateStaffStatusMutation = useMutation({
    mutationFn: async (updatedStaff: StaffStatusType[]) => {
      await apiRequest("POST", "/api/staff-status", updatedStaff);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff-status"] });
      toast({
        title: "Success",
        description: "Status staf diperbarui!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Gagal memperbarui status staf: ${error}`,
        variant: "destructive",
      });
    },
  });

  const handleToggleStaffStatus = (id: number) => {
    const updatedStaff = staffStatus.map((staff) =>
      staff.id === id ? { ...staff, isAvailable: !staff.isAvailable } : staff
    );
    setStaffStatus(updatedStaff);
  };

  const handleSaveStaffStatus = () => {
    updateStaffStatusMutation.mutate(staffStatus);
  };

  const handleSaveAnnouncement = () => {
    updateAnnouncementMutation.mutate(announcement);
  };

  // Tambahkan state dan handler di atas komponen return
  const [namaBaru, setNamaBaru] = useState("");

  const handleTambahStaf = async () => {
    if (!namaBaru.trim()) return;
    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: namaBaru }),
    });
    if (res.ok) {
      const newStaff = await res.json();
      setStaffStatus([...staffStatus, newStaff]);
      setNamaBaru("");
    }
  };

  const handleHapusStaf = async (id) => {
    const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
    if (res.ok) setStaffStatus(staffStatus.filter((s) => s.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <Tabs defaultValue="announcement">
        <TabsList className="mb-4">
          <TabsTrigger value="announcement">Pengumuman</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="staff">Status Staf</TabsTrigger>
        </TabsList>

        <TabsContent value="announcement">
          <Card>
            <CardHeader>
              <CardTitle>Perbarui Running Text</CardTitle>
              <CardDescription>
                Atur teks pengumuman yang akan berjalan di bagian bawah layar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Masukkan teks pengumuman di sini..."
                className="mb-4"
                rows={4}
              />
              <Button
                onClick={handleSaveAnnouncement}
                disabled={updateAnnouncementMutation.isPending}
              >
                {updateAnnouncementMutation.isPending
                  ? "Menyimpan..."
                  : "Simpan Pengumuman"}
              </Button>

              <div className="mt-8 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-2">
                  Kelola Banyak Pengumuman
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Anda dapat menambahkan beberapa pengumuman untuk ditampilkan
                  pada Running Text.
                </p>
                <a
                  href="/admin/announcements"
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium"
                >
                  Buka Halaman Kelola Pengumuman
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle>Konfigurasi Video</CardTitle>
              <CardDescription>
                Atur video YouTube yang akan ditampilkan pada frame utama.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="video-id">YouTube Video ID</Label>
                  <div className="text-sm text-gray-500 mb-1">
                    Contoh: untuk URL
                    https://www.youtube.com/watch?v=b6IVH_Xk1gE, ID-nya adalah
                    b6IVH_Xk1gE
                  </div>
                  <Input
                    id="video-id"
                    value={videoId}
                    onChange={(e) => setVideoId(e.target.value)}
                    placeholder="Masukkan ID video YouTube"
                    className="mb-4"
                  />
                </div>
                <div>
                  <Label htmlFor="video-title">Judul Video (Opsional)</Label>
                  <Input
                    id="video-title"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Masukkan judul video"
                    className="mb-4"
                  />
                </div>
                <Button
                  onClick={handleSaveVideoConfig}
                  disabled={updateVideoConfigMutation.isPending}
                >
                  {updateVideoConfigMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan Konfigurasi Video"}
                </Button>

                <div className="mt-8 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-2">
                    Kelola Video Playlist
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Anda dapat menambahkan beberapa video ke playlist untuk
                    diputar secara bergantian.
                  </p>
                  <a
                    href="/admin/video-playlist"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium"
                  >
                    Buka Halaman Playlist Video
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Status Kehadiran Staf</CardTitle>
              <CardDescription>
                Perbarui status kehadiran pejabat di kantor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Form tambah staf */}
              <div className="flex items-center gap-2 mb-4">
                <Input
                  value={namaBaru}
                  onChange={(e) => setNamaBaru(e.target.value)}
                  placeholder="Nama staf baru"
                />
                <Button onClick={handleTambahStaf} variant="secondary">
                  Tambah
                </Button>
              </div>
              <div className="space-y-4">
                {staffStatus.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <Label htmlFor={`staff-${staff.id}`}>{staff.title}</Label>
                    <div className="flex items-center space-x-2">
                      <span
                        className={
                          staff.isAvailable ? "text-green-600" : "text-red-600"
                        }
                      >
                        {staff.isAvailable ? "ADA" : "TIDAK ADA"}
                      </span>
                      <Switch
                        id={`staff-${staff.id}`}
                        checked={staff.isAvailable}
                        onCheckedChange={() =>
                          handleToggleStaffStatus(staff.id)
                        }
                      />
                      <Button
                        onClick={() => handleHapusStaf(staff.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleSaveStaffStatus}
                className="mt-4"
                disabled={updateStaffStatusMutation.isPending}
              >
                {updateStaffStatusMutation.isPending
                  ? "Menyimpan..."
                  : "Simpan Status Staf"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
