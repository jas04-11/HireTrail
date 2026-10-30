import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GraduationCap, MapPin, Building2, Linkedin, Github, Globe } from "lucide-react";
import { userApi } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import ExperienceCard from "../components/experience/ExperienceCard";
import { PageLoader } from "../components/common/Loader";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi
      .getPublicProfile(id)
      .then(({ data }) => {
        setProfile(data.user);
        setExperiences(data.experiences);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!profile) {
    return <div className="mx-auto max-w-lg px-4 py-20 text-center text-gray-900 font-semibold">Profile not found</div>;
  }

  const isOwnProfile = currentUser?._id === id;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="card p-6 mb-8">
        <div className="flex flex-wrap items-start gap-5">
          <div className="h-20 w-20 shrink-0 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold">
            {profile.name?.charAt(0)}
          </div>

          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
              {isOwnProfile && (
                <Link to="/profile/edit" className="btn-secondary !py-1 !px-3 text-xs">Edit profile</Link>
              )}
            </div>
            {profile.headline && <p className="mt-1 text-primary-600 text-sm">{profile.headline}</p>}
            {profile.bio && <p className="mt-2 text-sm text-gray-600 max-w-lg">{profile.bio}</p>}

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
              {profile.college && (
                <span className="flex items-center gap-1.5"><GraduationCap size={14} /> {profile.college}{profile.branch && ` · ${profile.branch}`}</span>
              )}
              {profile.currentCompany && <span className="flex items-center gap-1.5"><Building2 size={14} /> {profile.currentCompany}</span>}
              {profile.location && <span className="flex items-center gap-1.5"><MapPin size={14} /> {profile.location}</span>}
            </div>

            {profile.skills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.skills.map((s) => <span key={s} className="badge bg-gray-100 text-gray-600">{s}</span>)}
              </div>
            )}

            {(profile.socialLinks?.linkedin || profile.socialLinks?.github || profile.socialLinks?.portfolio) && (
              <div className="mt-3 flex items-center gap-3 text-gray-400">
                {profile.socialLinks.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary-600"><Linkedin size={17} /></a>}
                {profile.socialLinks.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-primary-600"><Github size={17} /></a>}
                {profile.socialLinks.portfolio && <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer" className="hover:text-primary-600"><Globe size={17} /></a>}
              </div>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {experiences.length} shared experience{experiences.length !== 1 ? "s" : ""}
      </h2>

      {experiences.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">No public experiences shared yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {experiences.map((exp) => <ExperienceCard key={exp._id} experience={exp} />)}
        </div>
      )}
    </div>
  );
};

export default Profile;
