"use client";

import { Lock } from "lucide-react";
import { updateTaskStatus } from "@/app/actions/task-actions";
import { TaskWithDetails } from "@/types";

export default function ActiveTasks({ tasks }: { tasks: TaskWithDetails[] }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="divide-y divide-gray-50">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors group">
            <div className="flex justify-between items-start">
              <div className="max-w-[200px]">
                <p className="font-bold text-gray-900 text-sm truncate">{task.title}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{task._count.applications} participant(s) validé(s)</p>
              </div>
              <button
                onClick={() => updateTaskStatus(task.id, "CLOSED")}
                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                title="Clôturer les inscriptions"
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-xs italic">
            Aucune tâche publiée.
          </div>
        )}
      </div>
    </div>
  );
}
