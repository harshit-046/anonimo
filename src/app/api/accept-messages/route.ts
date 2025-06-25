import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from "@/lib/dbConnect";
import userModel from '@/model/User';
import { User } from 'next-auth';



export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
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

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        );
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept messages"
                },
                {
                    status: 401
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "user status to accept messages is updated",
                updatedUser
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("failed to update user status to accept messages");
        return Response.json(
            {
                success: false,
                message: "failed to update user status to accept messages"
            },
            {
                status: 500
            }
        )
    }

}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
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

    const userId = user._id;
    try {
        const foundUser: User = await userModel.findById(userId) as User; //temp
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                {
                    status: 404
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "status of accepting message",
                getStatusOfMessage: foundUser.isAcceptingMessages
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("failed to get user status to accept messages");
        return Response.json(
            {
                success: false,
                message: "failed to get user status to accept messages"
            },
            {
                status: 500
            }
        )
    }

}