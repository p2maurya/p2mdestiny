import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const properties = await prisma.property.findMany({
    where: { ownerId: (session.user as { id: string }).id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ properties });
}
