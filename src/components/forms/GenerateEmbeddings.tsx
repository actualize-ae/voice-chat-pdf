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
import { RadioCardIndicator, RadioCardItem } from "../ui/radio-card"
import { RadioCardGroup } from "../ui/radio-card"
import { Badge } from "../ui/badge"
import { IconBrandOpenai } from "@tabler/icons-react"
import { generateEmbeddings } from "@/lib/api/utils"
import { useLoader } from "@/hooks/use-loader"

const formSchema = z.object({
    embeddingModel: z.string(),
    embeddingApiKey: z.string(),
    embeddingDimension: z.coerce.number().positive(),
    chunkSize: z.coerce.number().positive(),
    chunkOverlap: z.coerce.number().positive()
})

const modelConfigs: {
    [key: string]: {
        llm: string,
        name: string
    }
} = {
    "gpt-4o-mini-text-large": {
        llm: "gpt-4o-mini",
        name: "text-embedding-3-large"
    },
    "gpt-4o-mini-text-small": {
        llm: "gpt-4o-mini",
        name: "text-embedding-3-small"
    }
}

export function GenerateEmbeddingsForm() {
    const { isLoading, showLoader, hideLoader, LoaderComponent } = useLoader({
        loaderType: "ripple"
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            embeddingModel: "gpt-4o-mini-text-large",
            chunkSize: 512,
            chunkOverlap: 20,
            embeddingDimension: 1024
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        showLoader()
        await generateEmbeddings({
            ...values,
            apiKey: values.embeddingApiKey,
            embeddingInfo: {
                ...modelConfigs[values.embeddingModel]
            }
        })
        hideLoader()
    }

    const models: {
        label: string
        value: string
        isRecommended: boolean
    }[] = [
            {
                label: "text-embedding-3-large",
                value: "gpt-4o-mini-text-large",
                isRecommended: true,
            },
            {
                label: "text-embedding-3-small",
                value: "gpt-4o-mini-text-small",
                isRecommended: false,
            },
        ]

    return <Form {...form}>
        <LoaderComponent />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
            <fieldset className="space-y-3 mt-8">
                <Label htmlFor="database" className="font-medium">
                    Choose Embedding
                </Label>
                <RadioCardGroup
                    value={form.watch("embeddingModel")}
                    onValueChange={(value) => {
                        form.setValue("embeddingModel", value)
                    }}
                    className="mt-2 grid grid-cols-1 gap-4 text-sm"
                >
                    {models.map((model) => (
                        <RadioCardItem key={model.value} value={model.value}>
                            <div className="flex items-start gap-3">
                                <RadioCardIndicator className="mt-1" />
                                <div>
                                    {model.isRecommended ? (
                                        <div className="flex items-center gap-2">
                                            <IconBrandOpenai />
                                            <span className="leading-6">{model.label}</span>
                                            <Badge variant="success">Recommended</Badge>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <IconBrandOpenai />
                                            <span className="leading-6">{model.label}</span>
                                        </div>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        <code>
                                            {JSON.stringify(modelConfigs[model.value])}
                                        </code>
                                    </p>
                                </div>
                            </div>
                        </RadioCardItem>
                    ))}
                </RadioCardGroup>
            </fieldset>

            <div className="grid grid-cols-3 gap-4 text-sm">
                <FormField
                    control={form.control}
                    name="embeddingDimension"
                    render={({ field }) => (
                        <FormItem>
                            <LabelInputContainer>
                                <Label className="text-md font-thin">Embedding Dimension</Label>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage className="text-md" />
                            </LabelInputContainer>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="chunkSize"
                    render={({ field }) => (
                        <FormItem>
                            <LabelInputContainer>
                                <Label className="text-md font-thin">Chunk Size</Label>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage className="text-md" />
                            </LabelInputContainer>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="chunkOverlap"
                    render={({ field }) => (
                        <FormItem>
                            <LabelInputContainer>
                                <Label className="text-md font-thin">Chunk Overlap</Label>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage className="text-md" />
                            </LabelInputContainer>
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="embeddingApiKey"
                render={({ field }) => (
                    <FormItem>
                        <LabelInputContainer>
                            <Label className="text-md font-thin">OpenAI API Key</Label>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage className="text-md" />
                        </LabelInputContainer>
                    </FormItem>
                )}
            />
            
            <ShimmerButton
                type="submit"
                background="#059669"
                borderRadius='10px'
                shimmerSize="3px"
                className="w-full shadow-2xl font-bold disabled:opacity-[0.8] disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                Generate Embeddings
            </ShimmerButton>
        </form>
    </Form>
}