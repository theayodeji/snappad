import { NextRequest } from "next/server";
import Property from "@/models/Property";
import dbConnect from "@/lib/dbConnect";
import { verifyAuth } from "@/lib/auth";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const decodedToken = await verifyAuth(req);
    const userId = decodedToken.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if(user.role !== "host"){
      throw new Error("User is not a host");
    }

    const properties = await Property.find({ hostId: userId });
    return new Response(JSON.stringify(properties), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}