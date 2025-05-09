import { useEffect, useState } from "react";
import { apiRequest } from "../lib/queryClient";
import { useQuery } from "@tanstack/react-query";

type AnnouncementItem = {
  id: number;
  text: string;
  isActive: boolean;
  priority: number;
  updatedAt: string;
};

export default function AnnouncementsAdmin() {
  const [newText, setNewText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch announcements
  const { data: announcements = [], refetch } = useQuery<AnnouncementItem[]>({
    queryKey: ["/api/announcements"],
    refetchOnWindowFocus: false,
  });

  // Add new announcement
  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!newText.trim()) {
      setError("Teks pengumuman diperlukan");
      return;
    }
    
    setIsAdding(true);
    
    try {
      await apiRequest("POST", "/api/announcements", {
        text: newText.trim(),
        isActive: true,
      });
      
      setNewText("");
      setSuccess("Pengumuman berhasil ditambahkan");
      refetch();
    } catch (err) {
      setError("Gagal menambahkan pengumuman.");
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  // Delete announcement
  const handleDeleteAnnouncement = async (id: number) => {
    if (!confirm("Anda yakin ingin menghapus pengumuman ini?")) return;
    
    setError(null);
    setSuccess(null);
    
    try {
      await apiRequest("DELETE", `/api/announcements/${id}`);
      setSuccess("Pengumuman berhasil dihapus");
      refetch();
    } catch (err) {
      setError("Gagal menghapus pengumuman");
      console.error(err);
    }
  };

  // Toggle active status
  const handleToggleActive = async (announcement: AnnouncementItem) => {
    try {
      await apiRequest("PATCH", `/api/announcements/${announcement.id}`, {
        isActive: !announcement.isActive,
      });
      setSuccess(`Pengumuman ${announcement.isActive ? 'dinonaktifkan' : 'diaktifkan'}`);
      refetch();
    } catch (err) {
      setError("Gagal mengubah status pengumuman");
      console.error(err);
    }
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Kelola Running Text</h1>
        <p className="text-gray-600">
          Tambahkan atau hapus teks pengumuman yang ditampilkan di bagian bawah layar
        </p>
      </div>

      {/* Alert messages */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
          <p>{success}</p>
        </div>
      )}

      {/* Add new announcement form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Tambah Pengumuman Baru</h2>
        <form onSubmit={handleAddAnnouncement}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Teks Pengumuman
            </label>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Masukkan teks pengumuman..."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAdding}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {isAdding ? "Menambahkan..." : "Tambah Pengumuman"}
            </button>
          </div>
        </form>
      </div>

      {/* Announcements list */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Daftar Pengumuman</h2>
        
        {announcements.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada pengumuman</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center mb-2">
                      <span 
                        className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          announcement.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      ></span>
                      <span className="font-medium text-gray-700">
                        {announcement.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </div>
                    <p className="text-gray-800">{announcement.text}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleActive(announcement)}
                      className={`px-3 py-1 text-sm rounded ${
                        announcement.isActive 
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {announcement.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="bg-red-100 text-red-800 hover:bg-red-200 text-sm px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 flex justify-between">
        <a
          href="/"
          className="text-blue-500 hover:text-blue-600"
        >
          ← Kembali ke Halaman Utama
        </a>
        <a
          href="/admin"
          className="text-blue-500 hover:text-blue-600"
        >
          Kembali ke Admin Panel →
        </a>
      </div>
    </div>
  );
}