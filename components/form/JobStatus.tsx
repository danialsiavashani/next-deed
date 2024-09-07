'use client';

import { updateApplicationStatus } from '@/app/actions/companyActions';
import { useState } from 'react';

function JobStatus({
  application,
}: {
  application: { id: string; status: string };
}) {
  // State to handle updates
  const [statusUpdates, setStatusUpdates] = useState<{ [key: string]: string }>(
    {}
  );
  const [pending, setPending] = useState(false);

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    setPending(true);
    updateApplicationStatus(applicationId, newStatus)
      .then(() => {
        setStatusUpdates((prev) => ({ ...prev, [applicationId]: newStatus }));
      })
      .catch((error) => {
        console.error('Error updating application status:', error);
      })
      .finally(() => {
        setPending(false);
      });
  };
  return (
    <div className="flex items-center space-x-2">
      <select
        value={application.status}
        onChange={(e) => handleStatusChange(application.id, e.target.value)}
        className="border p-1 rounded"
        disabled={pending}
      >
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
        <option value="interview">Interview</option>
      </select>
    </div>
  );
}
export default JobStatus;
