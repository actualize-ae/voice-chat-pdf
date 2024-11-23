"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ShimmerButton from "../ui/shimmer-button"
import { User, UserPlus } from "lucide-react"

const formSchema = z.object({
    email: z.string().email({
        message: "Invalid Email!"
    }),
    password: z.string().min(6, {
        message: "Password must be atleast 6 characters!"
    }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

interface SignUpFormProps {
    handleSignup: ({ email, password }: {
        email: string;
        password: string;
    }) => Promise<void>
}

export function SignupForm({ handleSignup }: SignUpFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        handleSignup({
            email: values.email,
            password: values.password
        })
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg italic">Username</FormLabel>
                        <FormControl>
                            <Input placeholder="john.doe@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage className="text-md" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg italic">Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Password with minimum 6 characters" {...field} />
                        </FormControl>
                        <FormMessage className="text-md" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg italic">Confirm Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Password with minimum 6 characters" {...field} />
                        </FormControl>
                        <FormMessage className="text-md" />
                    </FormItem>
                )}
            />
            <ShimmerButton
                type="submit"
                background="#059669"
                borderRadius='10px'
                shimmerSize="3px"
                className="w-full shadow-2xl font-bold"
            >
                Sign Up
            </ShimmerButton>
        </form>
    </Form>
}