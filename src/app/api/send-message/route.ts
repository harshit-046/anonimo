import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from "@/lib/dbConnect";
import userModel from '@/model/User';
import { User } from 'next-auth';
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    console.log("1")
    try {
        console.log("2")
        const { username, content } = await request.json();
        console.log(username,content);
        const user = await userModel.findOne({username});
        console.log("4")
        console.log("user :",user);
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "Not authenticated"
                },
                {
                    status: 401
                }
            )
        }
        const isAcceptingMessage = user.isAcceptingMessage;
        console.log("isAcceptingMessage :",isAcceptingMessage);
        if (!isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "user is not accepting message"
                },
                {
                    status: 500
                }
            )
        }
        console.log("content :", content);
        user.message.push({ content, createdAt: new Date() } as Message)
        await user.save();

        return Response.json(
            {
                success: true,
                message: "message sent successfully"
            },
            {
                status: 200
            }
        )
          
    } catch (error) {
        console.log("not able to send message due to internal error")
        return Response.json(
            {
                success: false,
                message: "internal server error"
            },
            {
                status: 500
            }
        )
    }


}