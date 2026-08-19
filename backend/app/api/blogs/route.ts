import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Blog from '@/lib/model/Blog';

// GET ALL BLOGS
export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: blogs }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// CREATE NEW BLOG
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.title || !body.dateBadge || !body.imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Title, Date Badge and Image URL are required' },
        { status: 400 }
      );
    }

    const newBlog = await Blog.create(body);
    return NextResponse.json({ success: true, data: newBlog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create blog' },
      { status: 500 }
    );
  }
}