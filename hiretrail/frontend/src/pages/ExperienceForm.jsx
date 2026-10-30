import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { experienceApi } from "../api/experienceApi";
import RoundEditor from "../components/experience/RoundEditor";
import { Spinner } from "../components/common/Loader";

const emptyRound = (n) => ({
  roundNumber: n,
  roundName: "",
  roundType: "Technical",
  duration: "",
  questionsAsked: "",
  experience: "",
  difficulty: "Medium",
  result: "N/A",
});

// A single, straightforward form. Interview details first, then the
// round-by-round breakdown, then prep notes at the end.
const ExperienceForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    jobRole: "",
    jobType: "Full-Time",
    packageOffered: "",
    interviewDate: "",
    eligibilityCriteria: "",
    interviewMode: "Online",
    rounds: [emptyRound(1)],
    resourcesUsed: "",
    preparationStrategy: "",
    mistakesMade: "",
    tipsForJuniors: "",
    finalResult: "Selected",
    technologies: "",
    tags: "",
    isAnonymous: false,
  });

  useEffect(() => {
    if (!isEdit) return;
    experienceApi
      .getById(id)
      .then(({ data }) => {
        const e = data.experience;
        setForm({
          companyName: e.companyNameSnapshot,
          jobRole: e.jobRole,
          jobType: e.jobType,
          packageOffered: e.packageOffered || "",
          interviewDate: e.interviewDate?.slice(0, 10) || "",
          eligibilityCriteria: e.eligibilityCriteria || "",
          interviewMode: e.interviewMode,
          rounds: e.rounds,
          resourcesUsed: e.resourcesUsed || "",
          preparationStrategy: e.preparationStrategy || "",
          mistakesMade: e.mistakesMade || "",
          tipsForJuniors: e.tipsForJuniors || "",
          finalResult: e.finalResult,
          technologies: (e.technologies || []).join(", "),
          tags: (e.tags || []).join(", "),
          isAnonymous: e.isAnonymous,
        });
      })
      .catch(() => toast.error("Could not load experience"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updateRound = (index, round) => {
    const rounds = [...form.rounds];
    rounds[index] = round;
    update("rounds", rounds);
  };

  const addRound = () => update("rounds", [...form.rounds, emptyRound(form.rounds.length + 1)]);

  const removeRound = (index) => {
    const rounds = form.rounds.filter((_, i) => i !== index).map((r, i) => ({ ...r, roundNumber: i + 1 }));
    update("rounds", rounds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.companyName || !form.jobRole || !form.interviewDate) {
      toast.error("Please fill in company, role, and interview date");
      return;
    }
    const incompleteRound = form.rounds.some((r) => !r.roundName || !r.questionsAsked);
    if (incompleteRound) {
      toast.error("Each round needs a name and the questions asked");
      return;
    }

    setSubmitting(true);
    const payload = {
      ...form,
      numberOfRounds: form.rounds.length,
      technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (isEdit) {
        await experienceApi.update(id, payload);
        toast.success("Experience updated");
        navigate(`/experiences/${id}`);
      } else {
        const { data } = await experienceApi.create(payload);
        toast.success("Experience published");
        navigate(`/experiences/${data.experience._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {isEdit ? "Edit experience" : "Share your interview experience"}
      </h1>
      <p className="text-sm text-gray-500 mb-6">Fill in the details below, round by round.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Basic details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Company name</label>
              <input required value={form.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="e.g. Flipkart" className="input-field" />
            </div>
            <div>
              <label className="label-field">Job role</label>
              <input required value={form.jobRole} onChange={(e) => update("jobRole", e.target.value)} placeholder="e.g. SDE Intern" className="input-field" />
            </div>
            <div>
              <label className="label-field">Job type</label>
              <select value={form.jobType} onChange={(e) => update("jobType", e.target.value)} className="input-field">
                <option>Full-Time</option>
                <option>Internship</option>
                <option>Internship + PPO</option>
              </select>
            </div>
            <div>
              <label className="label-field">Package offered</label>
              <input value={form.packageOffered} onChange={(e) => update("packageOffered", e.target.value)} placeholder="e.g. 12 LPA" className="input-field" />
            </div>
            <div>
              <label className="label-field">Interview date</label>
              <input required type="date" value={form.interviewDate} onChange={(e) => update("interviewDate", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Interview mode</label>
              <select value={form.interviewMode} onChange={(e) => update("interviewMode", e.target.value)} className="input-field">
                <option>Online</option>
                <option>Offline</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Eligibility criteria</label>
            <input value={form.eligibilityCriteria} onChange={(e) => update("eligibilityCriteria", e.target.value)} placeholder="e.g. CGPA 7+, no active backlogs" className="input-field" />
          </div>
          <div>
            <label className="label-field">Final result</label>
            <select value={form.finalResult} onChange={(e) => update("finalResult", e.target.value)} className="input-field">
              <option>Selected</option>
              <option>Rejected</option>
              <option>Waitlisted</option>
              <option>Awaited</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={form.isAnonymous} onChange={(e) => update("isAnonymous", e.target.checked)} className="h-4 w-4" />
            Post this anonymously
          </label>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900">Interview rounds</h2>
          {form.rounds.map((round, i) => (
            <RoundEditor key={i} round={round} index={i} onChange={updateRound} onRemove={removeRound} canRemove={form.rounds.length > 1} />
          ))}
          <button type="button" onClick={addRound} className="btn-secondary w-full">
            <Plus size={15} /> Add another round
          </button>
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Preparation notes</h2>
          <div>
            <label className="label-field">Resources used</label>
            <textarea rows={2} value={form.resourcesUsed} onChange={(e) => update("resourcesUsed", e.target.value)} placeholder="Courses, sheets, books..." className="input-field" />
          </div>
          <div>
            <label className="label-field">Preparation strategy</label>
            <textarea rows={2} value={form.preparationStrategy} onChange={(e) => update("preparationStrategy", e.target.value)} placeholder="How you prepared, timeline..." className="input-field" />
          </div>
          <div>
            <label className="label-field">Mistakes made</label>
            <textarea rows={2} value={form.mistakesMade} onChange={(e) => update("mistakesMade", e.target.value)} placeholder="What you'd do differently" className="input-field" />
          </div>
          <div>
            <label className="label-field">Tips for juniors</label>
            <textarea rows={2} value={form.tipsForJuniors} onChange={(e) => update("tipsForJuniors", e.target.value)} placeholder="Your best advice" className="input-field" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Technologies (comma separated)</label>
              <input value={form.technologies} onChange={(e) => update("technologies", e.target.value)} placeholder="DSA, SQL, React" className="input-field" />
            </div>
            <div>
              <label className="label-field">Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="internship, tier-1" className="input-field" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <Spinner size={16} /> : isEdit ? "Save changes" : "Publish experience"}
        </button>
      </form>
    </div>
  );
};

export default ExperienceForm;
