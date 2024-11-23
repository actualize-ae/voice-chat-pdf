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

const formSchema = z.object({
    email: z.string().email({
        message: "Invalid Email!"
    }),
    password: z.string().min(6, {
        message: "Password must be atleast 6 characters!"
    })
})

interface SignInFormProps {
    handleSignIn: ({ email, password }: {
        email: string;
        password: string;
    }) => Promise<void>
}

export function SignInForm({ handleSignIn }: SignInFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        handleSignIn({
            ...values
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
                            <Input type="password" placeholder="secret-pattern" {...field} />
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
                Log in
            </ShimmerButton>
        </form>
    </Form>
}