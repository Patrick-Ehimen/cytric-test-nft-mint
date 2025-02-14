import mongoose, { Schema, Document } from "mongoose";

export interface INFT extends Document {
  nftId: number;
  name: string;
  description: string;
  logoUrl: string;
  userWalletAddress: string;
}

const NFTSchema: Schema = new Schema(
  {
    nftId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    logoUrl: { type: String, required: true },
    userWalletAddress: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<INFT>("NFT", NFTSchema);
