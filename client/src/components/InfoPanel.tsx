import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { StaffStatusType } from "@shared/schema";

const InfoPanel = () => {
  const { data: staffStatus, isLoading } = useQuery<StaffStatusType[]>({
    queryKey: ["/api/staff-status"],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold uppercase bg-muted p-2 rounded">TEXT INFORMASI PEJABAT SETEMPAT</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-muted h-16 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4">
        <h3 className="text-lg font-bold uppercase bg-muted p-2 rounded">TEXT INFORMASI PEJABAT SETEMPAT</h3>
      </div>
      
      <div className="space-y-3">
        {staffStatus?.map((staff) => (
          <div 
            key={staff.id} 
            className={`${staff.isAvailable ? 'bg-green-100 status-available' : 'bg-red-100 status-unavailable'} rounded-full px-4 py-3 flex items-center status-indicator`}
          >
            <div className="flex-shrink-0 w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <User className="text-white h-5 w-5" />
            </div>
            <div className="ml-3">
              <span className="font-medium">{staff.title} - </span>
              <span className={staff.isAvailable ? 'text-green-600' : 'text-red-600'}>
                {staff.isAvailable ? 'ADA' : 'TIDAK ADA'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoPanel;
