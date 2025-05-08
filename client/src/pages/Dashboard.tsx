import Header from "@/components/Header";
import VideoEmbed from "@/components/VideoEmbed";
import InfoPanel from "@/components/InfoPanel";
import RunningText from "@/components/RunningText";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Header />
      
      <div className="container mx-auto p-4">
        <div className="border-b border-neutral-mid mb-4"></div>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <VideoEmbed />
          </div>
          <InfoPanel />
        </div>
        
        <RunningText />
        
        {/* Admin link - normally this would be hidden/protected in production */}
        <div className="mt-6 text-right">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Admin Panel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
