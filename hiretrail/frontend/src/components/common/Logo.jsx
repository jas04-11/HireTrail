import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const Logo = ({ className = "" }) => (
  <Link to="/" className={`flex items-center gap-2 ${className}`}>
    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-white">
      <Briefcase size={16} />
    </span>
    <span className="text-lg font-bold text-gray-900">
      Hire<span className="text-primary-600">Trail</span>
    </span>
  </Link>
);

export default Logo;
