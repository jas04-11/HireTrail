import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { experienceApi } from "../api/experienceApi";
import ExperienceCard from "../components/experience/ExperienceCard";
import { CardSkeleton } from "../components/common/Loader";

const RESULT_OPTIONS = ["Selected", "Rejected", "Waitlisted", "Awaited"];
const TYPE_OPTIONS = ["Internship", "Full-Time", "Internship + PPO"];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [experiences, setExperiences] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const search = searchParams.get("search") || "";
  const result = searchParams.get("result") || "";
  const jobType = searchParams.get("jobType") || "";
  const sort = searchParams.get("sort") || "latest";
  const page = parseInt(searchParams.get("page") || "1");

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, sort };
      if (search) params.search = search;
      if (result) params.result = result;
      if (jobType) params.jobType = jobType;
      const { data } = await experienceApi.list(params);
      setExperiences(data.experiences);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, result, jobType, sort, page]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const hasFilters = search || result || jobType;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {search ? `Results for "${search}"` : "Explore interview experiences"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{pagination.total || 0} experiences found</p>
      </div>

      <div className="card p-4 mb-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label-field">Final result</label>
            <select value={result} onChange={(e) => updateParam("result", e.target.value)} className="input-field">
              <option value="">All results</option>
              {RESULT_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Job type</label>
            <select value={jobType} onChange={(e) => updateParam("jobType", e.target.value)} className="input-field">
              <option value="">All types</option>
              {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Sort by</label>
            <select value={sort} onChange={(e) => updateParam("sort", e.target.value)} className="input-field">
              <option value="latest">Latest</option>
              <option value="popular">Most liked</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
        {hasFilters && (
          <button onClick={() => setSearchParams({})} className="mt-3 text-sm text-red-600 hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : experiences.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">
          No experiences match your search. Try different filters.
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experiences.map((exp) => <ExperienceCard key={exp._id} experience={exp} />)}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateParam("page", String(i + 1))}
                  className={`h-8 w-8 rounded-md text-sm ${page === i + 1 ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;
