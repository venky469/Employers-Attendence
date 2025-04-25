import mongoose, { type Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export enum UserRole {
  ADMIN = "admin",
  TEAM_LEAD = "teamLead",
}

export interface IUser extends Document {
  name: string
  email?: string
  mobileNumber: string
  password: string
  role: UserRole
  address?: string
  village?: string
  profileImage?: string
  isApproved: boolean
  preferredLanguage: "telugu" | "english"
  createdAt: Date
  updatedAt: Date
  matchPassword: (enteredPassword: string) => Promise<boolean>
  getSignedJwtToken: () => string
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
      sparse: true,
    },
    mobileNumber: {
      type: String,
      required: [true, "Please add a mobile number"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.TEAM_LEAD,
    },
    address: {
      type: String,
    },
    village: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: function (this: IUser) {
        return this.role === UserRole.ADMIN
      },
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

// Encrypt password using bcrypt
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function (): string {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined")
  }

  // Create the payload
  const payload = {
    id: this._id,
    role: this.role,
  }

  // Create the options object
  const options: jwt.SignOptions = {
    expiresIn:  "30d",
  }

  // Convert the secret to Buffer to avoid type issues
  const secretBuffer = Buffer.from(jwtSecret, "utf8")

  // Sign the token with properly typed parameters
  return jwt.sign(payload, secretBuffer, options)
}

export default mongoose.model<IUser>("User", UserSchema)
