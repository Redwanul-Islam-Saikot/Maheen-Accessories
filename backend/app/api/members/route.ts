import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Member from '@/lib/model/Member';

// GET All Members (সবার আগে যোগ করা মেম্বার সবার আগে থাকবে)
export async function GET() {
  try {
    await connectDB();
    
    // _id: 1 দিলে পুরনো মেম্বারগুলো সবার আগে থাকবে, নতুনগুলো শেষে যোগ হবে
    const members = await Member.find({}).sort({ _id: 1 }); 

    return NextResponse.json({ success: true, data: members });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST Create New Member
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const newMember = await Member.create(body);

    return NextResponse.json({
      success: true,
      message: 'Member added successfully',
      data: newMember,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}