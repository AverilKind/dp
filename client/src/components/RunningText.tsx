import { useQuery } from "@tanstack/react-query";
import { AnnouncementType } from "@shared/schema";
import { useState, useEffect, useMemo } from "react";

const RunningText = () => {
  // Query all announcements instead of just the latest one
  const { data: announcements, isLoading } = useQuery<AnnouncementType[]>({
    queryKey: ["/api/announcements"],
  });
  
  // Combine all announcements into a single text with ' || ' separator
  const combinedText = useMemo(() => {
    if (!announcements || announcements.length === 0) return "";
    return announcements
      .sort((a, b) => a.priority - b.priority)
      .map(a => a.text)
      .join(" || ");
  }, [announcements]);
  
  // Calculate animation duration based on text length
  const animationDuration = useMemo(() => {
    const baseDuration = 30; // base duration in seconds
    if (!combinedText) return baseDuration;
    const textLength = combinedText.length;
    // Longer text should move more slowly to be readable
    const durationFactor = Math.max(0.7, Math.min(2.5, textLength / 80));
    return baseDuration * durationFactor;
  }, [combinedText]);
  
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
      <div className="bg-white/10 p-2 overflow-hidden rounded">
        <div className="overflow-hidden">
          <p 
            className="running-text text-lg" 
            style={{ animationDuration: `${animationDuration}s` }}
          >
            {combinedText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RunningText;
