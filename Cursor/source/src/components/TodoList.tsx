"use client"

import { useState, useEffect } from "react"
import { Todo } from "@prisma/client"

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    const response = await fetch("/api/todos")
    const data = await response.json()
    setTodos(data)
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTodo }),
    })

    setNewTodo("")
    fetchTodos()
  }

  return (
    <div>
      <form onSubmit={addTodo} className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="border p-2 mr-2"
          placeholder="新しいTodoを入力"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          追加
        </button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={async () => {
                await fetch(`/api/todos/${todo.id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ completed: !todo.completed }),
                })
                fetchTodos()
              }}
              className="mr-2"
            />
            <span className={todo.completed ? "line-through" : ""}>
              {todo.title}
            </span>
            <button
              onClick={async () => {
                await fetch(`/api/todos/${todo.id}`, {
                  method: "DELETE",
                })
                fetchTodos()
              }}
              className="ml-auto bg-red-500 text-white px-2 py-1 rounded"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
} 