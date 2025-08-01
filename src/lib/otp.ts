import OtpToken from "@/models/Otp";
import mongoose from "mongoose";

// Generate a 6-digit code
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function saveOrUpdateOtp(userId: mongoose.Types.ObjectId): Promise<string> {
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await OtpToken.findOneAndUpdate(
    { user: userId },
    { code, expiresAt },
    { upsert: true, new: true }
  );

  return code;
}

export async function verifyOtp(userId: mongoose.Types.ObjectId, submittedCode: string) {
  const record = await OtpToken.findOne({ user: userId });

  if (!record) return false;
  if (record.code !== submittedCode) return false;
  if (record.expiresAt < new Date()) return false;

  await OtpToken.deleteOne({ _id: record._id }); // delete after success
  return true;
}

export async function resendOtp(userId: mongoose.Types.ObjectId): Promise<string> {
  return await saveOrUpdateOtp(userId);
}
