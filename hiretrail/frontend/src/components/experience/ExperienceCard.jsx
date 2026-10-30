import { Link } from "react-router-dom";
import { Heart, MessageCircle, Eye } from "lucide-react";
import { formatDate } from "../../utils/formatDate";

const resultBadge = {
  Selected: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Waitlisted: "bg-yellow-100 text-yellow-700",
  Awaited: "bg-gray-100 text-gray-600",
};

const ExperienceCard = ({ experience }) => {
  const {
    _id,
    companyNameSnapshot,
    jobRole,
    jobType,
    packageOffered,
    interviewDate,
    finalResult,
    numberOfRounds,
    technologies = [],
    author,
    likeCount,
    commentCount,
    views,
  } = experience;

  return (
    <Link to={`/experiences/${_id}`} className="card block p-4 hover:border-primary-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-600 font-semibold">
            {companyNameSnapshot?.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{companyNameSnapshot}</h3>
            <p className="text-sm text-gray-500 truncate">{jobRole}</p>
          </div>
        </div>
        <span className={`badge shrink-0 ${resultBadge[finalResult]}`}>{finalResult}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
        <span>{jobType}</span>
        {packageOffered && <span>· {packageOffered}</span>}
        <span>· {numberOfRounds} rounds</span>
        <span>· {formatDate(interviewDate)}</span>
      </div>

      {technologies.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {technologies.slice(0, 4).map((t) => (
            <span key={t} className="badge bg-gray-100 text-gray-600">{t}</span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-500 truncate">{author?.name || "Anonymous Student"}</span>
        <div className="flex items-center gap-3 text-gray-400">
          <span className="flex items-center gap-1 text-xs"><Heart size={13} /> {likeCount || 0}</span>
          <span className="flex items-center gap-1 text-xs"><MessageCircle size={13} /> {commentCount || 0}</span>
          <span className="flex items-center gap-1 text-xs"><Eye size={13} /> {views || 0}</span>
        </div>
      </div>
    </Link>
  );
};

export default ExperienceCard;
