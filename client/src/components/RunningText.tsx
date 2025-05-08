import { useQuery } from "@tanstack/react-query";
import { AnnouncementType } from "@shared/schema";
import { useState, useEffect } from "react";

// Each running text item gets its own animation timing
const RunningTextItem = ({ text, index }: { text: string; index: number }) => {
  // Calculate different animation durations based on text length
  const baseDuration = 20; // base duration in seconds
  const durationFactor = Math.max(0.5, Math.min(2, text.length / 100)); // adjust based on text length
  const animationDuration = baseDuration * durationFactor;
  
  return (
    <p 
      className={`running-text text-lg`} 
      style={{ 
        animationDuration: `${animationDuration}s`,
        animationDelay: `${index * 1}s` // stagger start times
      }}
    >
      {text}
    </p>
  );
};

const RunningText = () => {
  // Query all announcements instead of just the latest one
  const { data: announcements, isLoading } = useQuery<AnnouncementType[]>({
    queryKey: ["/api/announcements"],
  });
  
  // For cycling through multiple announcements (future enhancement)
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Cycle through announcements if there are multiple
  useEffect(() => {
    if (announcements && announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
        );
      }, 10000); // Change every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [announcements]);
  
  if (isLoading) {
    return (
      <div className="mt-6 bg-primary text-white p-3 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-1 text-center">INFORMASI PENGUMUMAN</h3>
        <div className="bg-white/10 p-2 overflow-hidden rounded">
          <div className="h-8 bg-white/20 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // If there are no announcements
  if (!announcements || announcements.length === 0) {
    return (
      <div className="mt-6 bg-primary text-white p-3 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-1 text-center">INFORMASI PENGUMUMAN</h3>
        <div className="bg-white/10 p-2 overflow-hidden rounded">
          <p className="text-center py-2">Tidak ada pengumuman saat ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-primary text-white p-3 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-1 text-center">INFORMASI PENGUMUMAN</h3>
      <div className="bg-white/10 p-2 overflow-hidden rounded flex flex-col space-y-2">
        {announcements.map((announcement, index) => (
          <div key={announcement.id} className="overflow-hidden">
            <RunningTextItem 
              text={announcement.text} 
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RunningText;
