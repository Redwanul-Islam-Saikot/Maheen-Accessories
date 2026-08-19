import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Policy from '@/lib/model/Policy';

type Context = {
  params: Promise<{ id: string }>;
};

// 1. GET SINGLE POLICY (Edit Page-এ Data দেখানোর জন্য)
export async function GET(req: Request, context: Context) {
  try {
    const { id } = await context.params; // await params
    await connectDB();

    const policy = await Policy.findById(id);
    if (!policy) {
      return NextResponse.json({ success: false, message: 'Policy not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: policy });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. UPDATE POLICY
export async function PUT(req: Request, context: Context) {
  try {
    const { id } = await context.params; // await params
    await connectDB();

    const body = await req.json();
    const updatedPolicy = await Policy.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!updatedPolicy) {
      return NextResponse.json({ success: false, message: 'Policy not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedPolicy });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// 3. DELETE POLICY
export async function DELETE(req: Request, context: Context) {
  try {
    const { id } = await context.params; // await params
    await connectDB();

    const deletedPolicy = await Policy.findByIdAndDelete(id);

    if (!deletedPolicy) {
      return NextResponse.json({ success: false, message: 'Policy not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}