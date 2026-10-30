import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import { companyApi } from "../api/companyApi";
import ExperienceCard from "../components/experience/ExperienceCard";
import { PageLoader } from "../components/common/Loader";

const CompanyDetail = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      setError(false);
      try {
        const { data } = await companyApi.getBySlug(slug);
        setData(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [slug]);

  if (loading) return <PageLoader />;

  if (error || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-lg font-semibold text-gray-900">Company not found</p>
        <Link to="/companies" className="btn-secondary mt-4 inline-flex">Back to companies</Link>
      </div>
    );
  }

  const { company, experiences, stats } = data;
  const selectionRate = stats.totalExperiences ? Math.round((stats.selected / stats.totalExperiences) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="card p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary-50 text-primary-600 shrink-0">
            <Building2 size={24} />
          </div>
          <div className="flex-1 min-w-[180px]">
            <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
            {company.industry && <p className="text-sm text-gray-500">{company.industry}</p>}
          </div>
          <div className="flex gap-6 ml-auto text-center">
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.totalExperiences}</p>
              <p className="text-xs text-gray-400">Experiences</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{selectionRate}%</p>
              <p className="text-xs text-gray-400">Selection rate</p>
            </div>
          </div>
        </div>

        {stats.roles?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
            {stats.roles.map((r) => <span key={r} className="badge bg-gray-100 text-gray-600">{r}</span>)}
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {experiences.length} interview experience{experiences.length !== 1 ? "s" : ""}
      </h2>

      {experiences.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">
          No experiences logged for {company.name} yet.
          <div><Link to="/experiences/new" className="btn-primary mt-4 inline-flex">Be the first to share</Link></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {experiences.map((exp) => <ExperienceCard key={exp._id} experience={exp} />)}
        </div>
      )}
    </div>
  );
};

export default CompanyDetail;
