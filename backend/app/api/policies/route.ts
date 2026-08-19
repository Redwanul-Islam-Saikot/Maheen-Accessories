import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // Ensure your DB connection helper path is correct
import Policy from '@/lib/model/Policy';

// GET ALL POLICIES
export async function GET() {
  try {
    await connectDB();
    const policies = await Policy.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: policies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// CREATE A POLICY
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newPolicy = await Policy.create(body);
    return NextResponse.json({ success: true, data: newPolicy }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}