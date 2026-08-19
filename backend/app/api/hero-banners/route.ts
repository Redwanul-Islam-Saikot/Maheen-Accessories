import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import HeroBanner from '@/lib/model/HeroBanner';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const banners = await HeroBanner.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: banners });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.title || !body.description || !body.imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Title, Description & Image are required!' },
        { status: 400 }
      );
    }

    const newBanner = await HeroBanner.create(body);
    return NextResponse.json({ success: true, data: newBanner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create banner' },
      { status: 500 }
    );
  }
}