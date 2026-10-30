import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userApi } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/common/Loader";

const ProfileEdit = () => {
  const { user, updateUserLocal } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    headline: user?.headline || "",
    bio: user?.bio || "",
    college: user?.college || "",
    branch: user?.branch || "",
    graduationYear: user?.graduationYear || "",
    currentCompany: user?.currentCompany || "",
    location: user?.location || "",
    skills: (user?.skills || []).join(", "),
    linkedin: user?.socialLinks?.linkedin || "",
    github: user?.socialLinks?.github || "",
    portfolio: user?.socialLinks?.portfolio || "",
  });

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        headline: form.headline,
        bio: form.bio,
        college: form.college,
        branch: form.branch,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
        currentCompany: form.currentCompany,
        location: form.location,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        socialLinks: { linkedin: form.linkedin, github: form.github, portfolio: form.portfolio },
      };
      const { data } = await userApi.updateProfile(payload);
      updateUserLocal(data.user);
      toast.success("Profile updated");
      navigate(`/profile/${user._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Complete your profile</h1>
      <p className="text-sm text-gray-500 mb-6">A complete profile helps juniors trust the experiences you share.</p>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 shrink-0 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xl font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{form.name || "Your name"}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Full name</label>
            <input value={form.name} onChange={(e) => update("name", e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label-field">Headline</label>
            <input value={form.headline} onChange={(e) => update("headline", e.target.value)} placeholder="e.g. SDE Intern @ Flipkart" className="input-field" />
          </div>
          <div>
            <label className="label-field">Bio</label>
            <textarea rows={3} value={form.bio} onChange={(e) => update("bio", e.target.value)} className="input-field" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">College</label>
              <input value={form.college} onChange={(e) => update("college", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Branch</label>
              <input value={form.branch} onChange={(e) => update("branch", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Graduation year</label>
              <input type="number" value={form.graduationYear} onChange={(e) => update("graduationYear", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Current company (if any)</label>
              <input value={form.currentCompany} onChange={(e) => update("currentCompany", e.target.value)} className="input-field" />
            </div>
          </div>

          <div>
            <label className="label-field">Location</label>
            <input value={form.location} onChange={(e) => update("location", e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label-field">Skills (comma separated)</label>
            <input value={form.skills} onChange={(e) => update("skills", e.target.value)} placeholder="DSA, React, System Design" className="input-field" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label-field">LinkedIn</label>
              <input value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">GitHub</label>
              <input value={form.github} onChange={(e) => update("github", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Portfolio</label>
              <input value={form.portfolio} onChange={(e) => update("portfolio", e.target.value)} className="input-field" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? <Spinner size={16} /> : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
