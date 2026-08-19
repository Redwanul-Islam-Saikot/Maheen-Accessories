import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AboutMaheen from '@/lib/model/AboutMaheen';

// GET All Items
export async function GET() {
  try {
    await connectDB();
    const data = await AboutMaheen.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST Create New Item
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newItem = await AboutMaheen.create(body);
    return NextResponse.json({ success: true, data: newItem });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}