import { TodoList } from "@/components/TodoList"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession()
  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <main className="max-w-4xl mx-auto mt-4">
      <TodoList />
    </main>
  )
} 