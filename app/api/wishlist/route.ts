import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { propertyId } = await req.json();
  const userId = (session.user as { id: string }).id;

  const existing = await prisma.wishlist.findUnique({
    where: { userId_propertyId: { userId, propertyId } },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.wishlist.create({ data: { userId, propertyId } });
  return NextResponse.json({ saved: true });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: (session.user as { id: string }).id },
    include: { property: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ wishlist });
}
