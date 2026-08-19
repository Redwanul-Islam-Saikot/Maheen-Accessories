import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Service from '@/lib/model/Service';

export const dynamic = 'force-dynamic';

// UPDATE SERVICE (PATCH)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();

    // Next.js 15+ async params handle
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is missing' }, { status: 400 });
    }

    const body = await req.json();

    // $set ব্যবহার করে MongoDB ডাটা আপডেট
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedService }, { status: 200 });
  } catch (error: any) {
    console.error('Update Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Fallback for PUT
export async function PUT(req: Request, ctx: any) {
  return PATCH(req, ctx);
}

// DELETE SERVICE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await Service.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}