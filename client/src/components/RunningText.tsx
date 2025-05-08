import { useQuery } from "@tanstack/react-query";
import { AnnouncementType } from "@shared/schema";

const RunningText = () => {
  const { data: announcement, isLoading } = useQuery<AnnouncementType>({
    queryKey: ["/api/announcement"],
  });

  if (isLoading) {
    return (
      <div className="mt-6 bg-primary text-white p-3 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-1 text-center">INFORMASI RUNNING TEXT</h3>
        <div className="bg-white/10 p-2 overflow-hidden rounded">
          <div className="h-8 bg-white/20 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-primary text-white p-3 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-1 text-center">INFORMASI RUNNING TEXT</h3>
      <div className="bg-white/10 p-2 overflow-hidden rounded">
        <p className="running-text text-lg">
          {announcement?.text || "Tidak ada pengumuman saat ini."}
        </p>
      </div>
    </div>
  );
};

export default RunningText;
