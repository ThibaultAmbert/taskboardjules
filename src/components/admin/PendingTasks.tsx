"use client";

import { Check, X, User } from "lucide-react";
import { updateTaskStatus } from "@/app/actions/task-actions";
import { TaskWithCreator } from "@/types";

export default function PendingTasks({ tasks }: { tasks: TaskWithCreator[] }) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 text-gray-500 text-sm">
        Aucune tâche en attente de validation.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{task.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center text-xs text-gray-500">
                    <User className="w-3 h-3 mr-1" />
                    Par {task.creator.name}
                </div>
                {task.duration && <span className="text-xs text-gray-400 font-medium">Durée: {task.duration}</span>}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => updateTaskStatus(task.id, "PUBLISHED")}
                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                title="Approuver"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => updateTaskStatus(task.id, "CLOSED")}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                title="Rejeter"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
