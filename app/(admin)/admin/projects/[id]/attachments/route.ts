import { NextResponse } from "next/server"

import {
  addProjectAttachments,
  deleteProjectAttachment,
} from "@/lib/projects/repository"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const formData = await request.formData()
  const files = formData
    .getAll("attachments")
    .filter((value): value is File => value instanceof File && value.size > 0)

  if (files.length === 0) {
    return NextResponse.json(
      { success: false, error: "Pilih minimal satu file" },
      { status: 400 }
    )
  }

  const result = await addProjectAttachments(id, files)

  return NextResponse.json(result, {
    status: result.success ? 200 : result.error === "Unauthorized" ? 401 : 400,
  })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = (await request.json().catch(() => null)) as { path?: string } | null

  if (!body?.path) {
    return NextResponse.json(
      { success: false, error: "Path lampiran wajib diisi" },
      { status: 400 }
    )
  }

  const result = await deleteProjectAttachment(id, body.path)

  return NextResponse.json(result, {
    status: result.success ? 200 : result.error === "Unauthorized" ? 401 : 400,
  })
}
