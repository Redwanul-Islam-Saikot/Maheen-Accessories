import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import HeroBanner from '@/lib/model/HeroBanner';

// PATCH: Specific Hero Banner Update করার জন্য
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15+ এ params await করতে হয়
    const body = await req.json();

    const updatedBanner = await HeroBanner.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedBanner) {
      return NextResponse.json(
        { success: false, error: 'Hero Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedBanner });
  } catch (error: any) {
    console.error('API PATCH Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update banner' },
      { status: 500 }
    );
  }
}

// DELETE: Specific Hero Banner Delete করার জন্য
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15+ এ params await করতে হয়

    const deletedBanner = await HeroBanner.findByIdAndDelete(id);

    if (!deletedBanner) {
      return NextResponse.json(
        { success: false, error: 'Hero Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Deleted successfully',
    });
  } catch (error: any) {
    console.error('API DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete' },
      { status: 500 }
    );
  }
}