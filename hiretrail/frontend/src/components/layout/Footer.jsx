import { Link } from "react-router-dom";
import Logo from "../common/Logo";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-gray-500 max-w-xs">
              A place for students to share how their campus interviews actually went, so juniors can prepare better.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Platform</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/explore" className="hover:text-primary-600">Explore experiences</Link></li>
              <li><Link to="/companies" className="hover:text-primary-600">Companies</Link></li>
              <li><Link to="/experiences/new" className="hover:text-primary-600">Share your interview</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Account</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/login" className="hover:text-primary-600">Log in</Link></li>
              <li><Link to="/register" className="hover:text-primary-600">Create account</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} HireTrail. A student project built with the MERN stack.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
