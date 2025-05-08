import AdminPanel from "@/components/AdminPanel";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-neutral-light">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Digital Signage Admin</h1>
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Display
            </Button>
          </Link>
        </div>
      </header>
      
      <AdminPanel />
    </div>
  );
};

export default Admin;
