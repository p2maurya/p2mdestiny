import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { propertyId, message } = await req.json();
  if (!propertyId || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      propertyId,
      message,
      userId: (session.user as { id: string }).id,
    },
  });

  return NextResponse.json({ inquiry }, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const inquiries = await prisma.inquiry.findMany({
    where: { property: { ownerId: (session.user as { id: string }).id } },
    include: { property: { select: { title: true } }, user: { select: { name: true, phone: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ inquiries });
}
