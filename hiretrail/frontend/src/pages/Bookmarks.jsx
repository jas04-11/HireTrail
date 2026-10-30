import { useState, useEffect } from "react";
import { userApi } from "../api/userApi";
import ExperienceCard from "../components/experience/ExperienceCard";
import { PageLoader } from "../components/common/Loader";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi
      .getMyBookmarks()
      .then(({ data }) => setBookmarks(data.bookmarks))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Your bookmarks</h1>
      <p className="text-sm text-gray-500 mb-6">Experiences you saved to come back to.</p>

      {bookmarks.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">You haven't bookmarked any experiences yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((exp) => <ExperienceCard key={exp._id} experience={exp} />)}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
