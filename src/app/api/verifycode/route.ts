import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent('username');
        const user = await userModel.findOne({ decodedUsername })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                {
                    status: 500
                }
            )
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if (isCodeNotExpired && isCodeValid) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "Accouunt verified successfully"
                },
                {
                    status: 200
                }
            )
        }
        else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "verification code expire please sign up again to get a new code"
                },
                {
                    status: 400
                }
            )
        }
        else {
            return Response.json(
                {
                    success: false,
                    message: "Incorrect verification code"
                },
                { 
                    status: 400
                }
            )
        }


    } catch (error) {
        console.log("Error verifying user", error);
        return Response.json(
            {
                success: false,
                message: "Error in verifying user"
            },
            {
                status: 500
            }
        )
    }

}