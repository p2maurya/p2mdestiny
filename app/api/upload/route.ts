import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

// POST /api/upload  — body: { file: base64DataUrl, type: "image" | "video" }
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { file, type } = await req.json();
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  try {
    const url = await uploadToCloudinary(
      file,
      type === "video" ? "videos" : "images",
      type === "video" ? "video" : "image"
    );
    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
