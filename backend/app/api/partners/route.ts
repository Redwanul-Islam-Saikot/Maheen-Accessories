import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Partner from '@/lib/model/Partner';

export async function GET() {
  try {
    await connectDB();
    const partners = await Partner.find({}).sort({ createdAt: 1 });
    return NextResponse.json(partners);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, logoUrl } = await req.json();

    if (!name || !logoUrl) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const partner = await Partner.create({ name, logoUrl });
    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}