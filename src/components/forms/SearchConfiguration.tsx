"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ShimmerButton from "../ui/shimmer-button"
import { LabelInputContainer } from "@/components/labels/LabelContainer"
import { Label } from "@/components/ui/label"
import appConfig from "@/config/app-config"
import { RadioCardIndicator, RadioCardItem } from "../ui/radio-card"
import { RadioCardGroup } from "../ui/radio-card"
import { Badge } from "../ui/badge"
import { IconBrandOpenai } from "@tabler/icons-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "../ui/slider"
import NumberTicker from "../ui/number-ticker"
import { saveSearchConfigs } from "@/lib/api/utils"
import toast from "react-hot-toast"

const formSchema = z.object({
    "searchType": z.string(),
    "topK": z.coerce.number().positive()
})


export function SearchConfigurationForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            "searchType": "cosine-similarity",
            "topK": 2
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        await saveSearchConfigs(values)
        toast.success("Settings Saved Successfully!")
    }

    const rerankers: {
        label: string
        value: string
        isComingSoon: boolean,
        disabled: boolean
    }[] = [
            {
                label: "Cohere Reranking",
                value: "cohere-reranking",
                isComingSoon: true,
                disabled: true
            }
        ]

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">


            <FormField
                control={form.control}
                name="searchType"
                render={({ field }) => (
                    <FormItem>
                        <Label className="text-md font-thin">Search Type:</Label>
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="min-w-[180px]">
                                <SelectValue placeholder="Search Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cosine-similarity">Cosine Similarity</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="topK"
                render={({ field }) => (
                    <FormItem>
                        <LabelInputContainer>
                            <Label className="text-md font-thin">Top K Results: <NumberTicker className="text-lg font-bold italic" delay={0} value={field.value} /></Label>
                            <FormControl>
                                <Slider
                                    defaultValue={[field.value]}
                                    max={50}
                                    step={1}

                                    value={[field.value]}
                                    onValueChange={([val]) => {
                                        form.setValue("topK", val)
                                    }}
                                />
                            </FormControl>
                            <FormMessage className="text-md" />
                        </LabelInputContainer>
                    </FormItem>
                )}
            />

            <fieldset className="space-y-3 mt-8">
                <Label htmlFor="database" className="font-medium">
                    Reranking
                </Label>
                <RadioCardGroup
                    value={""}
                    className="mt-2 grid grid-cols-1 gap-4 text-sm"
                >
                    {rerankers.map((rerank) => (
                        <RadioCardItem disabled key={rerank.value} value={rerank.value}>
                            <div className="flex items-start gap-3">
                                <RadioCardIndicator className="mt-1" />
                                <div>
                                    {rerank.isComingSoon ? (
                                        <div className="flex items-center gap-2">
                                            <IconBrandOpenai />
                                            <span className="leading-6">{rerank.label}</span>
                                            <Badge variant="neutral">Coming Soon</Badge>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <IconBrandOpenai />
                                            <span className="leading-6">{rerank.label}</span>
                                        </div>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        To further enhance the results of your documents
                                    </p>
                                </div>
                            </div>
                        </RadioCardItem>
                    ))}
                </RadioCardGroup>
            </fieldset>

            <ShimmerButton
                type="submit"
                background="#059669"
                borderRadius='10px'
                shimmerSize="3px"
                className="w-full shadow-2xl font-bold"
            >
                Save Search Configurations
            </ShimmerButton>
        </form>
    </Form>
}