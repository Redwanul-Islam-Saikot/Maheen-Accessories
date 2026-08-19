import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Portfolio from '@/lib/model/Portfolio';

export const dynamic = 'force-dynamic';

// GET ALL PORTFOLIOS
export async function GET() {
  try {
    await connectDB();
    const items = await Portfolio.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// CREATE NEW PORTFOLIO ITEM
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newItem = await Portfolio.create(body);
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}