import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="mx-auto max-w-md px-4 py-24 text-center">
    <p className="text-5xl font-bold text-gray-200">404</p>
    <h1 className="mt-3 text-xl font-bold text-gray-900">Page not found</h1>
    <p className="mt-1 text-sm text-gray-500">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary mt-6 inline-flex">Back home</Link>
  </div>
);

export default NotFound;
