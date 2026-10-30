import { Trash2 } from "lucide-react";

const ROUND_TYPES = ["Online Assessment", "Technical", "HR", "Managerial", "System Design", "Group Discussion", "Coding", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const RESULTS = ["Cleared", "Rejected", "Pending", "N/A"];

const RoundEditor = ({ round, index, onChange, onRemove, canRemove }) => {
  const update = (field, value) => onChange(index, { ...round, [field]: value });

  return (
    <div className="border border-gray-200 rounded-md p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Round {index + 1}</span>
        {canRemove && (
          <button type="button" onClick={() => onRemove(index)} className="text-gray-400 hover:text-red-600">
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label-field">Round name</label>
          <input required value={round.roundName} onChange={(e) => update("roundName", e.target.value)} placeholder="e.g. Technical Interview 1" className="input-field" />
        </div>
        <div>
          <label className="label-field">Round type</label>
          <select value={round.roundType} onChange={(e) => update("roundType", e.target.value)} className="input-field">
            {ROUND_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label-field">Duration</label>
          <input value={round.duration} onChange={(e) => update("duration", e.target.value)} placeholder="e.g. 45 mins" className="input-field" />
        </div>
        <div>
          <label className="label-field">Difficulty</label>
          <select value={round.difficulty} onChange={(e) => update("difficulty", e.target.value)} className="input-field">
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label-field">Questions asked</label>
          <textarea required rows={3} value={round.questionsAsked} onChange={(e) => update("questionsAsked", e.target.value)} placeholder="List the questions or problems you were asked" className="input-field" />
        </div>
        <div className="sm:col-span-2">
          <label className="label-field">How it went (optional)</label>
          <textarea rows={2} value={round.experience} onChange={(e) => update("experience", e.target.value)} placeholder="Interviewer's tone, how confident you felt, etc." className="input-field" />
        </div>
        <div>
          <label className="label-field">Round result</label>
          <select value={round.result} onChange={(e) => update("result", e.target.value)} className="input-field">
            {RESULTS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default RoundEditor;
