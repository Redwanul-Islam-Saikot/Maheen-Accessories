import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Member from '@/lib/model/Member';

// GET Single Member
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const member = await Member.findById(resolvedParams.id);

    if (!member) {
      return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: member });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// UPDATE Member (PATCH)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Member ID is required' }, { status: 400 });
    }

    const body = await request.json();

    // Database Update
    const updatedMember = await Member.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return NextResponse.json({ success: false, error: 'Member not found in database' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Member updated successfully',
      data: updatedMember,
    });
  } catch (error: any) {
    console.error('PATCH Member Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update member' }, { status: 500 });
  }
}

// UPDATE Member Fallback (PUT)
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  return PATCH(request, context);
}

// DELETE Member
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const deletedMember = await Member.findByIdAndDelete(resolvedParams.id);

    if (!deletedMember) {
      return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Member deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}