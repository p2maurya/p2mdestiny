import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") return null;
  return session;
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const status = req.nextUrl.searchParams.get("status");

  const [properties, counts] = await Promise.all([
    prisma.property.findMany({
      where: status ? { status: status as "PENDING" | "APPROVED" | "REJECTED" } : undefined,
      include: { owner: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.groupBy({ by: ["status"], _count: true }),
  ]);

  const userCount = await prisma.user.count();
  const inquiryCount = await prisma.inquiry.count();

  return NextResponse.json({ properties, counts, userCount, inquiryCount });
}
