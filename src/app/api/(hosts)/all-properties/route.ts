import { NextRequest } from "next/server";
import Property from "@/models/Property";
import dbConnect from "@/lib/dbConnect";
import { verifyAuth } from "@/lib/auth";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  await dbConnect();

  const decodedToken = await verifyAuth(req);
  const userId = decodedToken.id;

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  if(user.role !== "host"){
    return new Response(JSON.stringify({ error: "User is not a host" }), { status: 403 });
  }

  const properties = await Property.find({ hostId: userId });
  return new Response(JSON.stringify(properties), { status: 200 });
}