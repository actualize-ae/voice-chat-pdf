import { TriangleAlert } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

export function AlertWarning({ title, description }: { title: string, description: string }) {
    return (
        <div className="flex">
            <Alert variant="destructive">

                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>
                    {description}
                </AlertDescription>
            </Alert>
            <span className="relative left-[-0.5rem] top-[-0.3rem] flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
        </div>
    )
}