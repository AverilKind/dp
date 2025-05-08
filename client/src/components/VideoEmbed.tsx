import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoConfigType, VideoPlaylistType } from "@shared/schema";
import { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const VideoEmbed = () => {
  // Fetch video playlist from the API
  const { data: videoPlaylist, isLoading: isPlaylistLoading } = useQuery<VideoPlaylistType[]>({
    queryKey: ["/api/video-playlist"],
  });
  
  // For backward compatibility - get old config if playlist is empty
  const { data: videoConfig, isLoading: isConfigLoading } = useQuery<VideoConfigType>({
    queryKey: ["/api/video-config"],
    enabled: !videoPlaylist || videoPlaylist.length === 0,
  });
  
  // Manage current video index
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Current video data
  const currentVideo = videoPlaylist && videoPlaylist.length > 0 
    ? videoPlaylist[currentIndex]
    : videoConfig;
  
  // YouTube embed URL with parameters for better embedding
  const youtubeEmbedUrl = currentVideo
    ? `https://www.youtube.com/embed/${currentVideo.videoId}?rel=0&modestbranding=1&controls=1&showinfo=0&autoplay=1`
    : "";
    
  // Rotate through videos in the playlist
  useEffect(() => {
    if (videoPlaylist && videoPlaylist.length > 1) {
      // Reset any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Create new timer - change video every 5 minutes (300000ms)
      timerRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex === videoPlaylist.length - 1 ? 0 : prevIndex + 1
        );
      }, 300000);
      
      // Clean up on unmount
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [videoPlaylist]);
  
  // Next/previous video functions
  const goToNextVideo = () => {
    if (videoPlaylist && videoPlaylist.length > 1) {
      setCurrentIndex(prevIndex => 
        prevIndex === videoPlaylist.length - 1 ? 0 : prevIndex + 1
      );
      // Reset the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setCurrentIndex(prevIndex => 
            prevIndex === videoPlaylist.length - 1 ? 0 : prevIndex + 1
          );
        }, 300000);
      }
    }
  };
  
  const goToPrevVideo = () => {
    if (videoPlaylist && videoPlaylist.length > 1) {
      setCurrentIndex(prevIndex => 
        prevIndex === 0 ? videoPlaylist.length - 1 : prevIndex - 1
      );
      // Reset the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setCurrentIndex(prevIndex => 
            prevIndex === videoPlaylist.length - 1 ? 0 : prevIndex + 1
          );
        }, 300000);
      }
    }
  };
  
  const isLoading = isPlaylistLoading || (isConfigLoading && (!videoPlaylist || videoPlaylist.length === 0));

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Skeleton className="w-full aspect-video" />
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative w-full aspect-video flex items-center justify-center bg-gray-100">
          <div className="text-gray-500 text-center p-4">
            <p className="text-lg font-medium">DISINI FRAME VIDEO UNTUK EMBED VIDEO DARI YOUTUBE</p>
            <p className="text-sm">Video belum dikonfigurasi</p>
          </div>
        </div>
        <div className="p-2 flex items-center bg-secondary/10">
          <div className="flex items-center space-x-4 text-secondary">
            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow cursor-pointer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full">
              <div className="h-full w-1/3 bg-secondary rounded-full"></div>
            </div>
            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow cursor-pointer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full aspect-video">
        <iframe
          key={currentVideo.videoId} // Key change forces iframe refresh when video changes
          src={youtubeEmbedUrl}
          title={currentVideo.title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      </div>
      <div className="p-2 flex items-center justify-between bg-secondary/10">
        <div className="flex-1 px-4">
          {currentVideo.title && (
            <p className="text-sm font-medium truncate">{currentVideo.title}</p>
          )}
        </div>
        
        {/* Playlist navigation controls - only show if we have more than one video */}
        {videoPlaylist && videoPlaylist.length > 1 && (
          <div className="flex items-center space-x-2">
            <button 
              onClick={goToPrevVideo}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-secondary" />
            </button>
            
            <span className="text-xs text-secondary">
              {currentIndex + 1} / {videoPlaylist.length}
            </span>
            
            <button 
              onClick={goToNextVideo}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-secondary" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoEmbed;