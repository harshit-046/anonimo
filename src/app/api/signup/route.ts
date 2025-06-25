import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        const existingUserByVerifiedByUsername = await userModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserByVerifiedByUsername) {
            console.log("Username already taken");
            return Response.json(
                {
                    success: false,
                    message: "Username already taken please select another username"
                },
                {
                    status: 500
                }
            )
        }
       
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const existingUserByEmail = await userModel.findOne({
            email
        });
     
        if (existingUserByEmail) {
            // check if is verified 
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "User already exits with this email"
                    },
                    {
                        status: 500
                    }
                )
            }
            // if not verified the update the user
            else{
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
        else { // create a new user
          
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []
            })
           
            await newUser.save(); 
           
        }
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully, Please verify your email"
            },
            {
                status: 201
            }
        )
              

    } catch (error) {
        console.error('Error registering user', error);
        return Response.json(
            {
                success: false,
                message: "Error while registering user"
            },
            {
                status: 500
            }
        )
    }
} 