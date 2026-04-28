import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import PendingTasks from "@/components/admin/PendingTasks";
import ManageApplications from "@/components/admin/ManageApplications";
import ActiveTasks from "@/components/admin/ActiveTasks";
import FadeIn from "@/components/ui/FadeIn";

export default async function AdminPage() {
  const session = await auth();
  if (!session || (session.user as { role?: string })?.role !== "ADMIN") redirect("/");

  const pendingTasks = await prisma.task.findMany({
    where: { status: "PENDING" },
    include: { creator: true },
    orderBy: { createdAt: "desc" }
  });

  const activeTasks = await prisma.task.findMany({
    where: { status: "PUBLISHED" },
    include: {
      creator: true,
      _count: { select: { applications: { where: { status: "APPROVED" } } } }
    },
    orderBy: { createdAt: "desc" }
  });

  const pendingApplications = await prisma.application.findMany({
    where: { status: "PENDING" },
    include: {
      user: true,
      task: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={session.user ?? null} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FadeIn>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Espace Administration</h1>
                <p className="text-gray-500 mt-1">Gérez les propositions et les candidatures des consultants.</p>
            </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-12">
                <FadeIn delay={0.1}>
                    <section>
                        <div className="flex items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Tâches en attente</h2>
                            <span className="ml-3 bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full">
                                {pendingTasks.length}
                            </span>
                        </div>
                        <PendingTasks tasks={pendingTasks} />
                    </section>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <section>
                        <div className="flex items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Candidatures à traiter</h2>
                            <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                                {pendingApplications.length}
                            </span>
                        </div>
                        <ManageApplications applications={pendingApplications} />
                    </section>
                </FadeIn>
            </div>

            <div className="lg:col-span-4">
                <FadeIn delay={0.3}>
                    <section className="sticky top-28">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Tâches publiées</h2>
                        <ActiveTasks tasks={activeTasks} />
                    </section>
                </FadeIn>
            </div>
        </div>
      </main>
    </div>
  );
}
