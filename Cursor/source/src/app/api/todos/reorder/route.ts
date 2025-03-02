import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const { todoId, newIndex } = await request.json();

  // 並び順を更新
  await prisma.$transaction(async (tx) => {
    const todos = await tx.todo.findMany({
      where: { userId: user!.id },
      orderBy: { order: "asc" },
    });

    const currentIndex = todos.findIndex((todo) => todo.id === todoId);
    const [movedTodo] = todos.splice(currentIndex, 1);
    todos.splice(newIndex, 0, movedTodo);

    // 新しい順序で更新
    for (let i = 0; i < todos.length; i++) {
      await tx.todo.update({
        where: { id: todos[i].id },
        data: { order: i },
      });
    }
  });

  return NextResponse.json({ success: true });
}
