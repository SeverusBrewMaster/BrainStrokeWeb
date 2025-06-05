import React from 'react';
import AssessmentTable from '../components/AssessmentTable';

const AssessmentsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Risk Assessments</h1>
      <AssessmentTable />
    </div>
  );
};

export default AssessmentsPage;
