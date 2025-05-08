import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoConfigType } from "@shared/schema";

const VideoEmbed = () => {
  // Fetch video configuration from the API
  const { data: videoConfig, isLoading } = useQuery<VideoConfigType>({
    queryKey: ["/api/video-config"],
  });

  // YouTube embed URL with parameters for better embedding
  const youtubeEmbedUrl = videoConfig 
    ? `https://www.youtube.com/embed/${videoConfig.videoId}?rel=0&modestbranding=1&controls=1&showinfo=0`
    : "";

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Skeleton className="w-full aspect-video" />
      </div>
    );
  }

  if (!videoConfig) {
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
          src={youtubeEmbedUrl}
          title={videoConfig.title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      </div>
      <div className="p-2 flex items-center bg-secondary/10">
        <div className="flex items-center space-x-4 text-secondary">
          {/* Simplified player controls */}
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
};

export default VideoEmbed;