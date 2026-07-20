import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { propertyId, value, comment } = await req.json();
  if (!propertyId || !value) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const userId = (session.user as { id: string }).id;

  await prisma.rating.upsert({
    where: { userId_propertyId: { userId, propertyId } },
    update: { value, comment },
    create: { userId, propertyId, value, comment },
  });

  const agg = await prisma.rating.aggregate({
    where: { propertyId },
    _avg: { value: true },
  });

  await prisma.property.update({
    where: { id: propertyId },
    data: { ratingAvg: agg._avg.value ?? 0 },
  });

  return NextResponse.json({ ratingAvg: agg._avg.value ?? 0 });
}
