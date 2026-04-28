"use client";

import { useState } from "react";
import { Clock, Calendar, CheckCircle2, Hourglass } from "lucide-react";
import { applyToTask } from "@/app/actions/task-actions";
import { TaskWithDetails } from "@/types";

export default function TaskCard({ task, currentUserId, applied }: {
  task: TaskWithDetails,
  currentUserId: string | undefined,
  applied: boolean
}) {
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(applied);

  const handleApply = async () => {
    if (!currentUserId || hasApplied) return;
    setIsApplying(true);
    try {
      await applyToTask(task.id);
      setHasApplied(true);
    } catch (error) {
      console.error("Failed to apply:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PUBLISHED: "bg-green-100 text-green-800",
    CLOSED: "bg-gray-100 text-gray-800",
  };

  const statusLabels = {
    PENDING: "En attente de validation",
    PUBLISHED: "Ouverte",
    CLOSED: "Clôturée",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusColors[task.status as keyof typeof statusColors]}`}>
          {statusLabels[task.status as keyof typeof statusLabels]}
        </span>
        {task.deadline && (
          <div className="flex items-center text-xs text-gray-500 font-medium">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(task.deadline).toLocaleDateString("fr-FR")}
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{task.title}</h3>
      <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">{task.description}</p>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          {task.duration && (
            <div className="flex items-center text-gray-700 font-medium">
              <Clock className="w-4 h-4 mr-2 text-wivoo-blue" />
              {task.duration}
            </div>
          )}
          <div className="flex items-center text-gray-500 text-xs">
            {task._count.applications} participant(s) validé(s)
          </div>
        </div>

        {task.status === "PUBLISHED" && (
          <button
            onClick={handleApply}
            disabled={hasApplied || isApplying}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${
              hasApplied
              ? "bg-wivoo-light text-wivoo-blue cursor-default"
              : "bg-wivoo-blue text-white hover:bg-wivoo-dark"
            }`}
          >
            {hasApplied ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Déjà positionné
              </>
            ) : isApplying ? (
              <Hourglass className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              "Se positionner"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
