import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import { getCompanyInterviews } from "../../services/interviewService";

export default function CompanyInterviews() {
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);

  const fetchInterviews = async () => {
    try {
      const data = await getCompanyInterviews();
      setInterviews(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  if (loading) return <Loader text="Loading interviews..." />;

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6">
      <h1 className="text-xl font-bold mb-4">Scheduled Interviews</h1>

      {interviews.length === 0 ? (
        <p className="text-gray-500 text-sm">No interviews scheduled.</p>
      ) : (
        <ul className="space-y-3">
          {interviews.map((i) => (
            <li
              key={i._id}
              className="border rounded-xl p-4 flex justify-between"
            >
              <div>
                <p className="font-semibold">{i.student?.name}</p>
                <p className="text-sm text-gray-500">
                  {i.job?.title}
                </p>
              </div>

              <div className="text-sm text-gray-600">
                {new Date(i.slot).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}