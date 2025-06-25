"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useParams, useRouter } from "next/navigation"
import { verifySchema } from "@/schemas/verifySchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const page = () => {
    const router = useRouter();
    const params = useParams<{username: string}>();
    const [submitting, setSubmitting] = useState(false);
    // const [otpMessage, setOtpMessage] = useState('');

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        },
    })

    async function onSubmit(data: z.infer<typeof verifySchema>) {
        setSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/verifycode', {
                username: params.username,
                code: data.code
            });
            toast("Success", {
                description: response.data.message,
            })
            router.replace('/signin');
            setSubmitting(false);

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast("Verification status", {
                description: errorMessage,
            })
            setSubmitting(false);
        }

    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md flex justify-center items-center">
                <div className="ml-21">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>One-Time Password</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormDescription>
                                            Please enter the one-time password sent to your email.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {submitting ? (
                                <>
                                    <Button type="button">
                                        <Loader2 className="mr-1 h-4 w-4 animate-spin"/>Please wait
                                    </Button>
                                </>
                            ) : (<Button type="submit">Submit</Button>)}
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default page