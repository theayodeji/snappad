import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Property from '@/models/Property';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await context.params;
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: property });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
