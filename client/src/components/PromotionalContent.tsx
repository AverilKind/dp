import { FaFacebookSquare, FaInstagram, FaYoutube, FaTwitter, FaGlobe } from "react-icons/fa";

const PromotionalContent = () => {
  return (
    <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
      {/* City Emblem and Title */}
      <div className="relative bg-accent p-6">
        <div className="absolute left-6 top-6">
          {/* City emblem would go here in a real implementation */}
          <div className="w-20 h-20 flex items-center justify-center bg-white/80 rounded-full shadow-md">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 22h18" />
              <path d="M5 3v4" />
              <path d="M19 3v4" />
              <path d="M12 13l-3 3h6l-3 3" />
              <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
              <path d="M9 10h.01" />
              <path d="M15 10h.01" />
              <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
              <path d="M12 8v5" />
            </svg>
          </div>
        </div>
        
        <div className="ml-24">
          <h2 className="text-4xl md:text-5xl font-bold text-indigo-700">KURSUS</h2>
          <h2 className="text-4xl md:text-5xl font-bold text-indigo-700">SKB SALATIGA</h2>
          <p className="mt-2 text-gray-700">Mari bangun sesuatu yang kreatif bersama kami</p>
        </div>
      </div>
      
      <div className="p-4 flex items-center justify-center relative">
        {/* Educational illustration with 3D objects */}
        <div className="w-full h-[300px] rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
          {/* SVG of educational elements (rocket, school items, etc) */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" className="w-full h-full">
            {/* Rocket */}
            <g transform="translate(400, 200) scale(1.2)">
              <path d="M-60,-80 C-70,-30 -70,30 -60,80 L-40,80 C-30,30 -30,-30 -40,-80 Z" fill="#5271FF" />
              <circle cx="-50" cy="0" r="15" fill="#FF7A7A" />
              <path d="M-70,-30 L-90,-40 L-90,-20 Z" fill="#76FF7A" />
              <path d="M-70,30 L-90,40 L-90,20 Z" fill="#76FF7A" />
              
              {/* Cloud/Smoke */}
              <g transform="translate(-50, 90)">
                <circle cx="0" cy="0" r="10" fill="white" />
                <circle cx="-15" cy="5" r="8" fill="white" />
                <circle cx="15" cy="5" r="8" fill="white" />
                <circle cx="-7" cy="12" r="7" fill="white" />
                <circle cx="7" cy="12" r="7" fill="white" />
              </g>
            </g>
            
            {/* School/Education Elements */}
            <g transform="translate(500, 200)">
              <circle cx="0" cy="0" r="50" fill="#5271FF" />
              <rect x="-30" y="-30" width="60" height="60" rx="5" fill="#FFDE59" />
              <circle cx="50" cy="-30" r="20" fill="#FF7A7A" />
            </g>
            
            {/* Dollar/Money Elements */}
            <g transform="translate(300, 150)">
              <circle cx="0" cy="0" r="25" fill="#FFC876" />
              <text x="0" y="8" font-size="30" text-anchor="middle" fill="#895600">$</text>
            </g>
            <g transform="translate(480, 280)">
              <circle cx="0" cy="0" r="25" fill="#FFC876" />
              <text x="0" y="8" font-size="30" text-anchor="middle" fill="#895600">$</text>
            </g>
          </svg>
        </div>
        
        {/* Social media and contact links with icons */}
        <div className="absolute bottom-8 left-6 flex flex-wrap items-center gap-4 bg-white/80 backdrop-blur p-2 rounded-lg">
          <div className="flex items-center text-gray-700 text-sm">
            <FaFacebookSquare className="mr-1" />
            <span>@skbsalatiga</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <FaInstagram className="mr-1" />
            <span>@skbsalatiga</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <FaYoutube className="mr-1" />
            <span>SKB-PKB Salatiga</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <FaGlobe className="mr-1" />
            <span>skbsalatiga.id</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <FaTwitter className="mr-1" />
            <span>@skbsltg</span>
          </div>
        </div>
        
        {/* Copyright badge */}
        <div className="absolute bottom-8 left-6 bg-secondary text-white px-3 py-1 rounded-lg text-sm">
          © ICT SKB Salatiga 2025
        </div>
      </div>
    </div>
  );
};

export default PromotionalContent;
