import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Partner from '@/lib/model/Partner';

// 1. UPDATE HANDLER (PUT / PATCH)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // <-- Promise Type Added
) {
  try {
    await connectDB();
    
    // Next.js 15 এ params কে await করতে হয়
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 });
    }

    const body = await req.json();

    const updatedPartner = await Partner.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPartner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPartner, { status: 200 });
  } catch (error: any) {
    console.error('Update Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update partner' },
      { status: 500 }
    );
  }
}

// 2. DELETE HANDLER
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // <-- Promise Type Added
) {
  try {
    await connectDB();

    // Next.js 15 এ params কে await করতে হয়
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 });
    }

    const deletedPartner = await Partner.findByIdAndDelete(id);

    if (!deletedPartner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Partner deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete partner' },
      { status: 500 }
    );
  }
}