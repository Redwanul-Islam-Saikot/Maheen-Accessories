import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // বা আপনার ডাটাবেজ কানেকশনের পাথ
import AboutMaheen from '@/lib/model/AboutMaheen';

// 🟢 PUT Method: Item Update করার জন্য
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js App Router-এ params await করতে হয়
    const body = await req.json();

    const updatedItem = await AboutMaheen.findByIdAndUpdate(
      id,
      {
        ...body,
        paragraph2: body.paragraph2 || '', // optional handling
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return NextResponse.json(
        { success: false, error: 'Item not found in database' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error: any) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update item' },
      { status: 500 }
    );
  }
}

// 🔴 DELETE Method: Item Delete করার জন্য
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedItem = await AboutMaheen.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete item' },
      { status: 500 }
    );
  }
}