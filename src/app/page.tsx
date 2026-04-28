import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TaskCard from "@/components/TaskCard";
import Navbar from "@/components/Navbar";
import TaskFormModal from "@/components/TaskFormModal";
import AnimatedCard from "@/components/AnimatedCard";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        { status: "PUBLISHED" },
        { creatorId: session.user?.id }
      ]
    },
    include: {
      creator: true,
      applications: {
        where: { userId: session.user?.id }
      },
      _count: {
        select: { applications: { where: { status: "APPROVED" } } }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={session.user ?? null} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Board des Tâches</h1>
            <p className="mt-2 text-gray-600">Contribuez au développement du cabinet</p>
          </div>
          <TaskFormModal />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tasks.map((task, index) => (
            <AnimatedCard key={task.id} index={index}>
                <TaskCard
                    task={task}
                    currentUserId={session.user?.id}
                    applied={task.applications.length > 0}
                />
            </AnimatedCard>
          ))}
          {tasks.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
               <p className="text-gray-500">Aucune tâche disponible pour le moment.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
