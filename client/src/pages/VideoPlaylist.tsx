import { useEffect, useState } from "react";
import { apiRequest } from "../lib/queryClient";
import { useQuery } from "@tanstack/react-query";

type VideoItem = {
  id: number;
  videoId: string;
  title: string | null;
  isActive: boolean;
  priority: number;
  updatedAt: string;
};

export default function VideoPlaylistAdmin() {
  const [newVideoId, setNewVideoId] = useState("");
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch video playlist
  const { data: videos = [], refetch } = useQuery<VideoItem[]>({
    queryKey: ["/api/video-playlist"],
    refetchOnWindowFocus: false,
  });

  // Add new video
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!newVideoId.trim()) {
      setError("YouTube Video ID diperlukan");
      return;
    }
    
    setIsAdding(true);
    
    try {
      await apiRequest("POST", "/api/video-playlist", {
        videoId: newVideoId,
        title: newVideoTitle.trim() || null,
      });
      
      setNewVideoId("");
      setNewVideoTitle("");
      setSuccess("Video berhasil ditambahkan");
      refetch();
    } catch (err) {
      setError("Gagal menambahkan video. Pastikan ID video valid.");
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  // Delete video
  const handleDeleteVideo = async (id: number) => {
    if (!confirm("Anda yakin ingin menghapus video ini?")) return;
    
    setError(null);
    setSuccess(null);
    
    try {
      await apiRequest("DELETE", `/api/video-playlist/${id}`);
      setSuccess("Video berhasil dihapus");
      refetch();
    } catch (err) {
      setError("Gagal menghapus video");
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
        <h1 className="text-3xl font-bold mb-2">Kelola Video Playlist</h1>
        <p className="text-gray-600">
          Tambahkan atau hapus video dari playlist yang ditampilkan di halaman utama
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

      {/* Add new video form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Tambah Video Baru</h2>
        <form onSubmit={handleAddVideo}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              YouTube Video ID
            </label>
            <input
              type="text"
              value={newVideoId}
              onChange={(e) => setNewVideoId(e.target.value)}
              placeholder="Contoh: dQw4w9WgXcQ atau URL lengkap"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <p className="text-xs text-gray-500 mt-1">
              Anda bisa memasukkan ID video atau URL lengkap YouTube
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Judul Video
            </label>
            <input
              type="text"
              value={newVideoTitle}
              onChange={(e) => setNewVideoTitle(e.target.value)}
              placeholder="Masukkan judul untuk video ini"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAdding}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {isAdding ? "Menambahkan..." : "Tambah Video"}
            </button>
          </div>
        </form>
      </div>

      {/* Video list */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Daftar Video Playlist</h2>
        
        {videos.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada video dalam playlist</p>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video.id} className="border rounded-lg p-4 flex items-start">
                <div className="flex-shrink-0 w-32 h-20 mr-4 overflow-hidden rounded bg-gray-200">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold">{video.title || "Video tanpa judul"}</h3>
                  <p className="text-sm text-gray-500">ID: {video.videoId}</p>
                </div>
                <button
                  onClick={() => handleDeleteVideo(video.id)}
                  className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                >
                  Hapus
                </button>
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