"use client";

import { updateApplicationStatus } from "@/app/actions/task-actions";
import { ApplicationWithUserAndTask } from "@/types";

export default function ManageApplications({ applications }: { applications: ApplicationWithUserAndTask[] }) {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 text-gray-500 text-sm">
        Aucune candidature à traiter.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-wivoo-light rounded-full flex items-center justify-center text-wivoo-blue font-bold">
              {app.user.name?.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900">{app.user.name}</p>
              <p className="text-sm text-gray-500">souhaite aider sur <span className="text-wivoo-blue font-medium">{app.task.title}</span></p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => updateApplicationStatus(app.id, "APPROVED")}
              className="px-4 py-2 bg-wivoo-blue text-white text-xs font-bold rounded-lg hover:bg-wivoo-dark transition-all"
            >
              Accepter
            </button>
            <button
              onClick={() => updateApplicationStatus(app.id, "REJECTED")}
              className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition-all"
            >
              Refuser
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
