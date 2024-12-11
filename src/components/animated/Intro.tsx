import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { cn } from "@/lib/utils";
import DotPattern from "../ui/dot-pattern";
import Link from "next/link";
import { AppDock } from "../navigation/AppDock";
import uploadImg from "../../../public/onboarding/upload.png"
import embeddingsImg from "../../../public/onboarding/embed.png"
import searchImg from "../../../public/onboarding/search.png"
import { Badge } from "../ui/badge";


export function Intro() {
    const data = [
        {
            title: <Link href="/upload" className="text-[#A855F7]">Upload Documents</Link>,
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-lg font-normal mb-2">
                        Step 1: Upload your documents

                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                        <Badge variant="warning">Disclaimer: The documents uploaded will be stored on public bucket, hence refrain from uploading sensitive documents</Badge>
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <Image
                            src={uploadImg}
                            alt="Upload Documents"
                            className="rounded-lg h-20 md:h-44 lg:h-72 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                        <video autoPlay className="rounded-lg h-20 md:h-44 lg:h-72 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]" width="500" height="500" controls preload="none">
                            <source src={"/onboarding/upload.mp4"} type="video/mp4" />

                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            ),
        },
        {
            title: <h1 className="text-[#A855F7]">Generate Embeddings</h1>,
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-lg font-normal mb-8">
                        Step 2: Once documents are uploaded, you can generate embeddings, which will allow the data to be stored in vector database, and this data will be queried when you speak to the voice agent
                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200 text-lg font-normal mb-8">
                        <Badge variant="error">Note: We recommend keeping smaller chunks of data to keep your openai api usage in check</Badge>
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <Image
                            src={embeddingsImg}
                            alt="Generate Embeddings"
                            className="rounded-lg h-20 md:h-44 lg:h-72 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                        <video autoPlay className="rounded-lg h-20 md:h-44 lg:h-72 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]" width="500" height="500" controls preload="none">
                            <source src={"/onboarding/embed.mp4"} type="video/mp4" />

                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            ),
        },
        {
            title: <h1 className="text-[#A855F7]">Save your search configs</h1>,
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-lg font-normal mb-4">
                        Step 3: Once the embeddings are generated, you can save your search configs, which will allow you to query the data stored in vector database
                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                    <Badge variant="error">Note: We recommend keeping smaller top K values to keep your openai api usage in check</Badge>
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <Image
                            src={searchImg}
                            alt="Search Configs"
                            className="rounded-lg h-72 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                        
                    </div>
                </div>
            ),
        },
        {
            title: <Link href="/console" className="text-[#A855F7]">Speak to your documents in playground</Link>,
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-lg font-normal mb-4">
                        Step 4: Once you complete all steps above, you will be able to ask questions regarding the uploaded documents.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                    <video autoPlay className="rounded-lg h-20 md:h-44 lg:h-72 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]" width="500" height="500" controls preload="none">
                            <source src={"/onboarding/talk.mp4"} type="video/mp4" />

                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div className="w-full">
            <AppDock />
            <Timeline data={data as any[]} />
            <DotPattern
                className={cn(
                    "[mask-image:radial-gradient(1500px_circle_at_center,white,transparent)]",
                )}
            />
        </div>
    );
}