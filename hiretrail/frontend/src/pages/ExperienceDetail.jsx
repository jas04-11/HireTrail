import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, Bookmark, Pencil, Trash2, Calendar, Briefcase, IndianRupee, MonitorSmartphone } from "lucide-react";
import toast from "react-hot-toast";
import { experienceApi } from "../api/experienceApi";
import { userApi } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import RoundsRail from "../components/experience/RoundsRail";
import CommentSection from "../components/experience/CommentSection";
import { PageLoader } from "../components/common/Loader";
import { formatDate } from "../utils/formatDate";

const resultBadge = {
  Selected: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Waitlisted: "bg-yellow-100 text-yellow-700",
  Awaited: "bg-gray-100 text-gray-600",
};

const ExperienceDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchExperience = async () => {
      setLoading(true);
      try {
        const { data } = await experienceApi.getById(id);
        setExperience(data.experience);
        setLikeCount(data.experience.likeCount || 0);
        setLiked(data.experience.likes?.some((l) => l === user?._id || l?._id === user?._id));
        setBookmarked(user?.bookmarks?.some((b) => b === id || b?._id === id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [id, user]);

  const handleLike = async () => {
    if (!isAuthenticated) return toast.error("Log in to like this experience");
    try {
      const { data } = await experienceApi.toggleLike(id);
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) return toast.error("Log in to bookmark this experience");
    try {
      const { data } = await userApi.toggleBookmark(id);
      setBookmarked(data.bookmarked);
      toast.success(data.bookmarked ? "Bookmarked" : "Removed from bookmarks");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this experience permanently?")) return;
    try {
      await experienceApi.remove(id);
      toast.success("Experience deleted");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete");
    }
  };

  if (loading) return <PageLoader />;
  if (!experience) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-lg font-semibold text-gray-900">Experience not found</p>
        <Link to="/explore" className="btn-secondary mt-4 inline-flex">Back to explore</Link>
      </div>
    );
  }

  const isOwner = user?._id === experience.author?._id;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="card p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to={`/companies/${experience.company?.slug}`}
              className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-50 text-primary-600 font-semibold shrink-0"
            >
              {experience.companyNameSnapshot?.charAt(0)}
            </Link>
            <div>
              <Link to={`/companies/${experience.company?.slug}`} className="text-lg font-bold text-gray-900 hover:text-primary-600">
                {experience.companyNameSnapshot}
              </Link>
              <p className="text-sm text-gray-500">{experience.jobRole}</p>
            </div>
          </div>
          <span className={`badge ${resultBadge[experience.finalResult]}`}>{experience.finalResult}</span>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-100 pt-4">
          <MetaItem icon={<Briefcase size={14} />} label="Job type" value={experience.jobType} />
          <MetaItem icon={<IndianRupee size={14} />} label="Package" value={experience.packageOffered || "Not disclosed"} />
          <MetaItem icon={<Calendar size={14} />} label="Date" value={formatDate(experience.interviewDate)} />
          <MetaItem icon={<MonitorSmartphone size={14} />} label="Mode" value={experience.interviewMode} />
        </div>

        {experience.eligibilityCriteria && (
          <p className="mt-3 text-sm text-gray-600 border-t border-gray-100 pt-3">
            <span className="text-gray-400">Eligibility: </span>{experience.eligibilityCriteria}
          </p>
        )}

        {experience.technologies?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
            {experience.technologies.map((t) => <span key={t} className="badge bg-gray-100 text-gray-600">{t}</span>)}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <Link
            to={experience.isAnonymous ? "#" : `/profile/${experience.author?._id}`}
            className={`flex items-center gap-2 ${experience.isAnonymous ? "pointer-events-none" : ""}`}
          >
            <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
              {experience.author?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{experience.author?.name}</p>
              {experience.author?.headline && <p className="text-xs text-gray-400">{experience.author.headline}</p>}
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm ${liked ? "border-red-200 bg-red-50 text-red-600" : "border-gray-300 text-gray-600"}`}
            >
              <Heart size={15} fill={liked ? "currentColor" : "none"} /> {likeCount}
            </button>
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm ${bookmarked ? "border-yellow-200 bg-yellow-50 text-yellow-600" : "border-gray-300 text-gray-600"}`}
            >
              <Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
            </button>
            {isOwner && (
              <>
                <Link to={`/experiences/${id}/edit`} className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600">
                  <Pencil size={15} />
                </Link>
                <button onClick={handleDelete} className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600">
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">The interview journey</h2>
        <RoundsRail rounds={experience.rounds} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <InsightCard title="Resources used" content={experience.resourcesUsed} />
        <InsightCard title="Preparation strategy" content={experience.preparationStrategy} />
        <InsightCard title="Mistakes made" content={experience.mistakesMade} />
        <InsightCard title="Tips for juniors" content={experience.tipsForJuniors} />
      </div>

      <div className="card p-6">
        <CommentSection
          experienceId={id}
          comments={experience.comments || []}
          onCommentsChange={(comments) => setExperience((prev) => ({ ...prev, comments }))}
        />
      </div>
    </div>
  );
};

const MetaItem = ({ icon, label, value }) => (
  <div>
    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
      {icon}<span className="text-xs">{label}</span>
    </div>
    <p className="text-sm font-medium text-gray-800">{value}</p>
  </div>
);

const InsightCard = ({ title, content }) => {
  if (!content) return null;
  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{title}</h3>
      <p className="text-sm text-gray-600 whitespace-pre-line">{content}</p>
    </div>
  );
};

export default ExperienceDetail;
