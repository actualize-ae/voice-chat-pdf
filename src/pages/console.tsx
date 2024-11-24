import { AppDock } from '@/components/navigation/AppDock';
import ConsolePage from './ConsolePage';
import { cn } from '@/lib/utils';
import DotPattern from '@/components/ui/dot-pattern';


export default function App() {
    return (
        <>
            <AppDock />
            <DotPattern
                className={cn(
                    "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
                )}
            />
            <ConsolePage />
        </>
    );
}