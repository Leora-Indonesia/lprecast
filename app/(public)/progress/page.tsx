import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import fs from "fs"
import path from "path"

interface Task {
  number: string
  task: string
  status: string
  dueDate: string
  notes: string
}

function parseProgressMarkdown(content: string): Task[] {
  const lines = content.split("\n")
  const tasks: Task[] = []

  for (const line of lines) {
    // Skip non-table lines
    if (!line.startsWith("| ")) continue
    // Skip separator lines
    if (line.includes("---")) continue

    const parts = line.split("|").filter(Boolean)
    if (parts.length >= 5) {
      const number = parts[0].trim()
      const task = parts[1].trim()
      const status = parts[2].trim()
      const dueDate = parts[3].trim()
      const notes = parts[4]?.trim() || ""

      // Skip header row - number column should start with digit
      if (!/^\d/.test(number)) continue

      if (number && task && status) {
        tasks.push({ number, task, status, dueDate, notes })
      }
    }
  }

  return tasks
}

function getStatusBadge(status: string) {
  const statusLower = status.toLowerCase()

  if (statusLower === "done") {
    return <Badge className="bg-green-500">Done</Badge>
  } else if (statusLower === "in progress") {
    return <Badge className="bg-blue-500">In Progress</Badge>
  } else {
    return <Badge variant="secondary">Not Started</Badge>
  }
}

export default function ProgressPage() {
  const progressPath = path.join(process.cwd(), "docs/tasks/PROGRESS.md")
  const content = fs.readFileSync(progressPath, "utf-8")
  const tasks = parseProgressMarkdown(content)

  return (
    <div className="container mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            MVP Progress Tracker
          </CardTitle>
          <p className="text-muted-foreground">
            Track progress semua tasks untuk LPrecast MVP
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">#</th>
                  <th className="px-4 py-3 text-left font-medium">Task</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Due Date</th>
                  <th className="px-4 py-3 text-left font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.number} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{task.number}</td>
                    <td className="px-4 py-3">{task.task}</td>
                    <td className="px-4 py-3">{getStatusBadge(task.status)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {task.dueDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {task.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
