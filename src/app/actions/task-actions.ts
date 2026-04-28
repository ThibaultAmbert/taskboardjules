"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/emails/resend";
import { TaskFormData } from "@/types";

const ADMIN_EMAIL = "thibault.ambert@wivoo.fr";

export async function createTask(formData: TaskFormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { title, description, duration, deadline } = formData;
  const isAdmin = (session.user as { role?: string }).role === "ADMIN";

  const task = await prisma.task.create({
    data: {
      title,
      description,
      duration,
      deadline: deadline ? new Date(deadline) : null,
      status: isAdmin ? "PUBLISHED" : "PENDING",
      creatorId: session.user.id,
    },
    include: { creator: true }
  });

  if (!isAdmin) {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: "Nouvelle proposition de tâche",
      html: `
        <h1>Nouvelle proposition de tâche</h1>
        <p><strong>Consultant :</strong> ${task.creator.name}</p>
        <p><strong>Titre :</strong> ${task.title}</p>
        <p><strong>Description :</strong> ${task.description}</p>
        <p><a href="http://localhost:3000/admin">Valider sur la plateforme</a></p>
      `
    });
  }

  revalidatePath("/");
  if (isAdmin) revalidatePath("/admin");
}

export async function applyToTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const application = await prisma.application.create({
    data: {
      taskId,
      userId: session.user.id,
      status: "PENDING",
    },
    include: {
        user: true,
        task: true
    }
  });

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `Nouvelle candidature : ${application.task.title}`,
    html: `
      <h1>Nouvelle candidature</h1>
      <p><strong>Consultant :</strong> ${application.user.name}</p>
      <p><strong>Tâche :</strong> ${application.task.title}</p>
      <p><a href="http://localhost:3000/admin">Gérer les candidatures</a></p>
    `
  });

  revalidatePath("/");
}

export async function updateTaskStatus(taskId: string, status: string) {
    const session = await auth();
    if ((session?.user as { role?: string })?.role !== "ADMIN") throw new Error("Unauthorized");

    const task = await prisma.task.update({
        where: { id: taskId },
        data: { status },
        include: { creator: true }
    });

    if (status === "PUBLISHED" && task.creator.email) {
        await sendEmail({
            to: task.creator.email,
            subject: "Votre tâche a été publiée !",
            html: `
              <h1>Félicitations !</h1>
              <p>Votre proposition "<strong>${task.title}</strong>" a été validée par un administrateur et est maintenant visible sur le board.</p>
              <p><a href="http://localhost:3000/">Voir le board</a></p>
            `
        });
    }

    revalidatePath("/");
    revalidatePath("/admin");
}

export async function updateApplicationStatus(applicationId: string, status: string) {
    const session = await auth();
    if ((session?.user as { role?: string })?.role !== "ADMIN") throw new Error("Unauthorized");

    const app = await prisma.application.update({
        where: { id: applicationId },
        data: { status },
        include: { user: true, task: true }
    });

    if (status === "APPROVED" && app.user.email) {
        await sendEmail({
            to: app.user.email,
            subject: `Candidature validée : ${app.task.title}`,
            html: `
              <h1>C'est parti !</h1>
              <p>Votre positionnement sur la tâche "<strong>${app.task.title}</strong>" a été validé.</p>
              <p>Vous pouvez maintenant commencer à travailler dessus.</p>
            `
        });
    }

    revalidatePath("/");
    revalidatePath("/admin");
}
