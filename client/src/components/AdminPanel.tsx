import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffStatusType, AnnouncementType } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Announcement state and mutation
  const [announcement, setAnnouncement] = useState("");

  const updateAnnouncementMutation = useMutation({
    mutationFn: async (text: string) => {
      await apiRequest("POST", "/api/announcement", { text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcement"] });
      toast({
        title: "Success",
        description: "Announcement updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update announcement: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Staff status state and mutation
  const staffList = [
    { id: 1, title: "KEPALA DINAS", isAvailable: false },
    { id: 2, title: "SEKRETARIS", isAvailable: false },
    { id: 3, title: "ICT", isAvailable: true },
    { id: 4, title: "KEUANGAN", isAvailable: true },
    { id: 5, title: "PENGAWAS", isAvailable: false },
  ];

  const [staffStatus, setStaffStatus] = useState<StaffStatusType[]>(staffList);

  const updateStaffStatusMutation = useMutation({
    mutationFn: async (updatedStaff: StaffStatusType[]) => {
      await apiRequest("POST", "/api/staff-status", updatedStaff);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff-status"] });
      toast({
        title: "Success",
        description: "Staff status updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update staff status: ${error}`,
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <Tabs defaultValue="announcement">
        <TabsList className="mb-4">
          <TabsTrigger value="announcement">Pengumuman</TabsTrigger>
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
                {updateAnnouncementMutation.isPending ? "Menyimpan..." : "Simpan Pengumuman"}
              </Button>
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
              <div className="space-y-4">
                {staffStatus.map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between border-b pb-2">
                    <Label htmlFor={`staff-${staff.id}`}>{staff.title}</Label>
                    <div className="flex items-center space-x-2">
                      <span className={staff.isAvailable ? "text-green-600" : "text-red-600"}>
                        {staff.isAvailable ? "ADA" : "TIDAK ADA"}
                      </span>
                      <Switch 
                        id={`staff-${staff.id}`}
                        checked={staff.isAvailable}
                        onCheckedChange={() => handleToggleStaffStatus(staff.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                onClick={handleSaveStaffStatus} 
                className="mt-4"
                disabled={updateStaffStatusMutation.isPending}
              >
                {updateStaffStatusMutation.isPending ? "Menyimpan..." : "Simpan Status Staf"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
