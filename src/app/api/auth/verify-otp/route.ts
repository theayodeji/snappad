import { verifyOtp } from "@/lib/otp";
import User from "@/models/User";
import { SignJWT } from "jose";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();
  const { email, otp } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return Response.json({ success: false, message: "User not found" }, { status: 404 });

  const valid = await verifyOtp(user._id, otp);
  if (!valid) return Response.json({ success: false, message: "Invalid or expired OTP" }, { status: 403 });

  user.verified = true;
  await user.save();

  // You could update a 'verified' flag here if desired
  const token = await new SignJWT({ id: user._id.toString() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

  return Response.json({
    success: true,
    message: "OTP verified successfully.",
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
