import { CheckCircle2, XCircle, Clock, Circle } from "lucide-react";

const resultStyles = {
  Cleared: { circle: "bg-green-100 text-green-700", icon: <CheckCircle2 size={14} />, text: "text-green-700" },
  Rejected: { circle: "bg-red-100 text-red-700", icon: <XCircle size={14} />, text: "text-red-700" },
  Pending: { circle: "bg-yellow-100 text-yellow-700", icon: <Clock size={14} />, text: "text-yellow-700" },
  "N/A": { circle: "bg-gray-100 text-gray-500", icon: <Circle size={14} />, text: "text-gray-500" },
};

// Shows each interview round as a simple numbered step, since the rounds
// happened in a real order — this is the main thing that makes an
// experience easy to read at a glance instead of one long paragraph.
const RoundsRail = ({ rounds = [] }) => {
  return (
    <div className="space-y-4">
      {rounds.map((round, idx) => {
        const style = resultStyles[round.result] || resultStyles["N/A"];
        return (
          <div key={idx} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold text-sm ${style.circle}`}>
                  {idx + 1}
                </span>
                <div>
                  <p className="text-xs text-gray-400 uppercase">{round.roundType}</p>
                  <h4 className="font-semibold text-gray-900">{round.roundName}</h4>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {round.duration && <span className="badge bg-gray-100 text-gray-600">{round.duration}</span>}
                <span className="badge bg-gray-100 text-gray-600">{round.difficulty}</span>
                <span className={`flex items-center gap-1 font-medium ${style.text}`}>
                  {style.icon} {round.result}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm pl-11">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-0.5">Questions asked</p>
                <p className="text-gray-700 whitespace-pre-line">{round.questionsAsked}</p>
              </div>
              {round.experience && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">How it went</p>
                  <p className="text-gray-700 whitespace-pre-line">{round.experience}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoundsRail;
