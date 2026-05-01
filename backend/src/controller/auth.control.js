import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/*
|--------------------------------------------------------------------------
| 1️⃣ Register
|--------------------------------------------------------------------------
*/
export const register = async (req, res) => {
  try {
    const { 
      name, username, email, password, 
      village, district, state, farmSize, cropsGrown, farmingType, role 
    } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      username,
      email,
      password,
      village,
      district,
      state,
      farmSize,
      cropsGrown,
      farmingType,
      role,
      verificationToken,
      verificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    // TODO: send verification email here

    res.status(201).json({
      message: "User registered. Please verify email.",
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 2️⃣ Login
|--------------------------------------------------------------------------
*/
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.accessibility === "deactivated") {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    // Remove sensitive fields before returning
    const userResponse = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      village: user.village,
      district: user.district,
      state: user.state,
      farmSize: user.farmSize,
      cropsGrown: user.cropsGrown,
      farmingType: user.farmingType,
      role: user.role,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount,
    };

    res.json({
      accessToken,
      refreshToken,
      user: userResponse,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 3️⃣ Logout
|--------------------------------------------------------------------------
*/
export const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      refreshToken: null,
    });

    res.json({ message: "Logged out successfully" });

  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 4️⃣ Refresh Token
|--------------------------------------------------------------------------
*/
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = user.generateAccessToken();

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(403).json({ message: "Invalid refresh token", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 5️⃣ Verify Email
|--------------------------------------------------------------------------
*/
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationExpires = null;

    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    console.error("Verify Email Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 6️⃣ Forgot Password
|--------------------------------------------------------------------------
*/
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    // TODO: send reset email

    res.json({ message: "Password reset link sent" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 7️⃣ Reset Password
|--------------------------------------------------------------------------
*/
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| 8️⃣ Change Password (Logged In)
|--------------------------------------------------------------------------
*/
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
