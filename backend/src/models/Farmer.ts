import mongoose, { type Document, Schema } from "mongoose"

export interface IFarmer extends Document {
  name: string
  mobileNumber?: string
  village: string
  landDetails?: string
  teamLeads: mongoose.Types.ObjectId[]
  isActive: boolean
  preferredLanguage: "telugu" | "english"
  createdAt: Date
  updatedAt: Date
}

const FarmerSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    village: {
      type: String,
      required: [true, "Please add a village"],
    },
    landDetails: {
      type: String,
    },
    teamLeads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    preferredLanguage: {
      type: String,
      enum: ["telugu", "english"],
      default: "telugu",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IFarmer>("Farmer", FarmerSchema)
