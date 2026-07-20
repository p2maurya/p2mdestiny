import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const property = await prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        owner: { select: { name: true, phone: true, image: true } },
        ratings: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ property });
  } catch {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const userId = (session.user as { id: string }).id;
  const userRole = (session.user as { role?: string }).role;
  if (existing.ownerId !== userId && userRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const property = await prisma.property.update({ where: { id }, data: body });
  return NextResponse.json({ property });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const userId = (session.user as { id: string }).id;
  const userRole = (session.user as { role?: string }).role;
  if (existing.ownerId !== userId && userRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.property.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
