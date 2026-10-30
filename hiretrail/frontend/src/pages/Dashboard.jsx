import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, Heart, MessageCircle, Eye, Pencil, Trash2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { experienceApi } from "../api/experienceApi";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "../components/common/Loader";
import { formatDate } from "../utils/formatDate";

const Dashboard = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    experienceApi
      .mine()
      .then(({ data }) => setExperiences(data.experiences))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience permanently?")) return;
    try {
      await experienceApi.remove(id);
      setExperiences((prev) => prev.filter((e) => e._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error("Could not delete");
    }
  };

  const totals = {
    experiences: experiences.length,
    likes: experiences.reduce((sum, e) => sum + (e.likeCount || e.likes?.length || 0), 0),
    comments: experiences.reduce((sum, e) => sum + (e.commentCount || e.comments?.length || 0), 0),
    views: experiences.reduce((sum, e) => sum + (e.views || 0), 0),
  };

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(" ")[0]}</h1>
        </div>
        <Link to="/experiences/new" className="btn-primary">
          <Plus size={16} /> Share experience
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FileText size={16} />} label="Experiences" value={totals.experiences} />
        <StatCard icon={<Heart size={16} />} label="Total likes" value={totals.likes} />
        <StatCard icon={<MessageCircle size={16} />} label="Comments" value={totals.comments} />
        <StatCard icon={<Eye size={16} />} label="Total views" value={totals.views} />
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your experiences</h2>

      {experiences.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-semibold text-gray-900 mb-1">You haven't shared anything yet</p>
          <p className="text-sm text-gray-500 mb-4">Your first interview experience could help a junior a lot.</p>
          <Link to="/experiences/new" className="btn-primary inline-flex">
            <Plus size={16} /> Share your first experience
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div key={exp._id} className="card p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-600 font-semibold">
                  {exp.companyNameSnapshot?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{exp.companyNameSnapshot} · {exp.jobRole}</p>
                  <p className="text-xs text-gray-400">{formatDate(exp.interviewDate)} · {exp.finalResult}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link to={`/experiences/${exp._id}`} className="p-2 text-gray-500 hover:text-gray-800"><ExternalLink size={15} /></Link>
                <Link to={`/experiences/${exp._id}/edit`} className="p-2 text-gray-500 hover:text-gray-800"><Pencil size={15} /></Link>
                <button onClick={() => handleDelete(exp._id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="card p-4">
    <div className="flex items-center gap-2 text-primary-600 mb-2">{icon}</div>
    <p className="text-xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-400">{label}</p>
  </div>
);

export default Dashboard;
