import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔥 do not return by default
    },

    profilePicture: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 150,
      default: "",
    },

    village: { type: String, trim: true, default: "" },
    district: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    farmSize: { type: Number, default: 0 }, // in acres
    cropsGrown: { type: [String], default: [] },
    farmingType: {
      type: String,
      enum: ["Organic", "Traditional", "Hydroponic", "Mixed", "Other", ""],
      default: "",
    },
    role: {
      type: String,
      enum: ["farmer", "expert", "krishi_center", "government"],
      default: "farmer",
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      }
    },

    website: {
      type: String,
      default: "",
    },

    accountType: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      index: true,
    },

    accessibility: {
      type: String,
      enum: ["active", "deactivated"],
      default: "active",
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    // 🔥 STORE COUNTS ONLY
    followersCount: {
      type: Number,
      default: 0,
      index: true,
    },

    followingCount: {
      type: Number,
      default: 0,
    },

    postsCount: {
      type: Number,
      default: 0,
    },

    helpScore: {
      type: Number,
      default: 0,
      index: true,
    },

    // tokens should not be stored like this in production
    refreshToken: {
      type: String,
      select: false,
    },

    verificationToken: String,
    verificationExpires: Date,

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);


// Index for search
userSchema.index({ username: "text", name: "text" });


// 🔐 Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


// Generate JWT
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );
};


export default mongoose.model("User", userSchema);