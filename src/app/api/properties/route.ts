// app/api/properties/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Property from '@/models/Property';

export async function GET(request: Request) {
  await dbConnect(); // Connect to the database

  try {
    const properties = await Property.find({});
    return NextResponse.json({ success: true, data: properties });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  await dbConnect(); // Connect to the database

  try {
    const body = await request.json(); // Get the request body
    const property = await Property.create(body); // Create a new property

    return NextResponse.json({ success: true, data: property }, { status: 201 }); // 201 Created
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json({ success: false, message: messages }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}