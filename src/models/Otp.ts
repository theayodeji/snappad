import mongoose, { Schema, Document } from "mongoose";

export interface IOtpToken extends Document {
  user: mongoose.Types.ObjectId;
  code: string;
  expiresAt: Date;
}

const OtpTokenSchema = new Schema<IOtpToken>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.OtpToken || mongoose.model<IOtpToken>("OtpToken", OtpTokenSchema);
