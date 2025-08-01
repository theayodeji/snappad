import { resendOtp } from "@/lib/otp";
import User from "@/models/User";
import { sendOtpMail } from "@/lib/mailer";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return Response.json({ success: false, message: "User not found" }, { status: 404 });

  const code = await resendOtp(user._id);
  await sendOtpMail(user.email, code);

  return Response.json({ success: true, message: "OTP resent successfully" });
}
