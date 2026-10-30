import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Building2 } from "lucide-react";
import { companyApi } from "../api/companyApi";
import { PageLoader } from "../components/common/Loader";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await companyApi.list(query ? { search: query } : {});
        setCompanies(data.companies);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Companies</h1>
      <p className="text-sm text-gray-500 mb-6">Browse interview experiences by company.</p>

      <div className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies..."
          className="input-field !pl-9"
        />
      </div>

      {loading ? (
        <PageLoader />
      ) : companies.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">No companies found for "{query}"</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {companies.map((c) => (
            <Link
              key={c._id}
              to={`/companies/${c.slug}`}
              className="card flex flex-col items-center text-center p-5 hover:border-primary-300 transition-colors"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                <Building2 size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{c.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{c.experienceCount} experience{c.experienceCount !== 1 ? "s" : ""}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;
