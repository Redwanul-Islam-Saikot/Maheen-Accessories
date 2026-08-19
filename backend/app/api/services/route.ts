import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Service from '@/lib/model/Service';

// Next.js ক্যাশিং সম্পূর্ণ বন্ধ করা
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({}).sort({ serviceNumber: 1 });
    
    return NextResponse.json(
      { success: true, data: services },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newService = await Service.create(body);
    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}