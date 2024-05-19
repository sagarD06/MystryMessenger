import UserModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

/*****************************SIGNUP ROUTE********************************************/
export async function POST(request: Request) {
  try {
    dbConnect();

    const { username, email, password } = await request.json();

    /* Checking if user creds entered already belong to a verified USER. */
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message:
            "User already exists with this username!, Please try a different one.",
        },
        { status: 400 }
      );
    }

    /* Checking if user exists with email and updating password and verification for unverified users */
    const existingUserByEmail = await UserModel.findOne({ email });

    let verifyToken = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail?.isVerified) {
        return Response.json(
          {
            success: false,
            message:
              "User already exists with this email!, Please use a different email.",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        let verifyTokenExpiry = new Date();
        verifyTokenExpiry.setHours(verifyTokenExpiry.getHours() + 1);

        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyToken = verifyToken;
        existingUserByEmail.verifyTokenExpiry = verifyTokenExpiry;

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      let verifyTokenExpiry = new Date();
      verifyTokenExpiry.setHours(verifyTokenExpiry.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyToken,
        verifyTokenExpiry,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    /* Send verification email. */

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyToken
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }else{
      console.log(emailResponse);
      
    }

    return Response.json(
      {
        success: true,
        message: "User created successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Something went wrong while siging up the user!", error);
    return Response.json(
      { success: false, message: "Failed to sign up the user!" },
      { status: 500 }
    );
  }
}
