import { Link } from "react-router-dom";
import { ArrowRight, Building2, Search, MessageSquare, Sparkles } from "lucide-react";

const Landing = () => {
  return (
    <div>
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-semibold text-primary-600 mb-3">Campus placement experiences</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Real interview experiences, shared by students who sat in the room.
            </h1>
            <p className="mt-4 text-gray-600 leading-relaxed">
              HireTrail is where students post exactly how their campus interviews went —
              round by round, question by question — so the next batch doesn't have to
              walk in blind.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/explore" className="btn-primary">
                Explore experiences <ArrowRight size={16} />
              </Link>
              <Link to="/register" className="btn-secondary">
                Share your experience
              </Link>
            </div>
            <div className="mt-8 flex gap-8 text-sm">
              <div>
                <p className="text-xl font-bold text-gray-900">500+</p>
                <p className="text-gray-500">experiences shared</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">100+</p>
                <p className="text-gray-500">companies</p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Flipkart · SDE Intern</p>
                <p className="text-xs text-gray-400">Interview journey</p>
              </div>
              <span className="badge bg-green-100 text-green-700">Selected</span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Online Assessment", sub: "2 DSA + 20 MCQs" },
                { label: "Technical Round 1", sub: "Arrays, DP, SQL" },
                { label: "HR Round", sub: "Fit and motivation" },
              ].map((r, i) => (
                <div key={r.label} className="flex items-center gap-3 border border-gray-100 rounded-md p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.label}</p>
                    <p className="text-xs text-gray-400">{r.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-14 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">What you get on HireTrail</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { icon: <Building2 size={20} />, title: "Company pages", desc: "Every experience is filed under its company." },
            { icon: <Search size={20} />, title: "Search & filter", desc: "Find experiences by company, role, or tech stack." },
            { icon: <MessageSquare size={20} />, title: "Ask questions", desc: "Comment directly on an experience you're curious about." },
            { icon: <Sparkles size={20} />, title: "Post anonymously", desc: "Share honestly, with or without your name attached." },
          ].map((f) => (
            <div key={f.title} className="card p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-4 py-14 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Log your interview", desc: "Fill a simple form with your rounds, questions, and outcome." },
            { step: "2", title: "It goes live", desc: "Your experience is published under the company's page right away." },
            { step: "3", title: "Juniors read it", desc: "Students preparing for that company find your journey when they search." },
          ].map((s) => (
            <div key={s.step} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white font-semibold">
                {s.step}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="card bg-primary-600 border-none p-10 text-center">
          <h2 className="text-2xl font-bold text-white">Your interview could help someone else prepare</h2>
          <p className="mt-2 text-primary-100">It takes about 10 minutes to share.</p>
          <Link to="/register" className="btn-secondary mt-6 inline-flex !bg-white">
            Get started <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
