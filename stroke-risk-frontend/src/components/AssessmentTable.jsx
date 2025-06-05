import React, { useEffect, useState } from 'react';

const AssessmentTable = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetch("http://localhost:5000/api/assessments")
    .then(res => res.json())
    .then(data => {
      console.log("Fetched assessments:", data);
      setAssessments(data.data); // ✅ fix here
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching assessments:", err);
      setLoading(false);
    });
}, []);


  if (loading) return <p>Loading assessments...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Risk Assessments</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Age</th>
            <th className="border px-4 py-2">Gender</th>
            <th className="border px-4 py-2">Risk Score</th>
            <th className="border px-4 py-2">Risk Category</th>
            <th className="border px-4 py-2">Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((entry, index) => (
            <tr key={entry.id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{entry.name || 'N/A'}</td>
              <td className="border px-4 py-2">{entry.age || 'N/A'}</td>
              <td className="border px-4 py-2">{entry.gender || 'N/A'}</td>
              <td className="border px-4 py-2">{entry.riskScore}</td>
              <td className="border px-4 py-2">{entry.riskCategory}</td>
              <td className="border px-4 py-2">
                {new Date(entry.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssessmentTable;
