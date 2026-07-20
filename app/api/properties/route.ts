import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/properties?type=RENT&city=Lucknow&minPrice=0&maxPrice=100000&category=Flat&bedrooms=2
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const type = sp.get("type");
  const city = sp.get("city");
  const category = sp.get("category");
  const bedrooms = sp.get("bedrooms");
  const minPrice = sp.get("minPrice");
  const maxPrice = sp.get("maxPrice");
  const q = sp.get("q");
  const page = Number(sp.get("page") ?? "1");
  const pageSize = Number(sp.get("pageSize") ?? "12");

  const where: Record<string, unknown> = { status: "APPROVED" };
  if (type) where.type = type;
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (category) where.category = category;
  if (bedrooms) where.bedrooms = Number(bedrooms);
  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice ? { gte: Number(minPrice) } : {}),
      ...(maxPrice ? { lte: Number(maxPrice) } : {}),
    };
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
    ];
  }

  try {
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: { owner: { select: { name: true, phone: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({ properties, total, page, pageSize });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

// POST /api/properties
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    description,
    price,
    type,
    category,
    bedrooms,
    bathrooms,
    area,
    address,
    city,
    state,
    latitude,
    longitude,
    images,
    videoUrl,
  } = body;

  if (!title || !description || !price || !type || !category || !area || !address || !city || !state) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: Number(price),
        type,
        category,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        area: Number(area),
        address,
        city,
        state,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        images: images ?? [],
        videoUrl: videoUrl ?? null,
        ownerId: (session.user as { id: string }).id,
        status: "PENDING",
      },
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
