import dbConnect from "@/src/lib/db";
import UserModel from "@/src/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // Check if the user already exists
    if (existingUserByUsername) {
      return new Response(
        JSON.stringify({ success: false, message: "Username already exists" }),
        { status: 400 },
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if the user already exists
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User already exists with this email",
          }),
          { status: 400 },
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(
          Date.now() + 60 * 60 * 1000,
        );
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    if (!emailResponse.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: emailResponse.message || "Failed to send verification email",
        }),
        { status: 500 },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "User registered successfully. Please check your email for verification.",
      }),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 },
    );
  }
}
