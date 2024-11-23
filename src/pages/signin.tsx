import Link from 'next/link';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import { loginWithEmailPassword } from '@/lib/api/utils';
import { CompanyLogo } from '@/components/logo/CompanyLogo';
import { AnimatedBeamDemo } from '@/components/animated/AnimatedBeamDemo';
import ShineBorder from "@/components/ui/shine-border";
import WordPullUp from "@/components/ui/word-pull-up";
import { cn } from '@/lib/utils';
import DotPattern from '@/components/ui/dot-pattern';
import { SignInForm } from '@/components/forms/SignIn';

export default function SignInPage() {
  const router = useRouter();

  const handleSignIn = async ({ email, password }: { email: string, password: string }) => {
    await loginWithEmailPassword({
      email,
      password,
    });
    router.push('/');
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Toaster position="top-right" reverseOrder={false} />
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
        )}
      />
      <ShineBorder
        className="relative p-8 flex w-[80%] md:w-[30%] flex-col items-center justify-center overflow-hidden rounded-lg border-2 bg-white md:shadow-2xl"
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
      >
        <div className="flex items-center justify-center mb-2">
          <CompanyLogo />
        </div>
        <AnimatedBeamDemo />
        <WordPullUp
          className="text-2xl font-bold tracking-[-0.02em] italic text-[#0EA5E9] dark:text-white md:leading-[5rem]"
          words="Sign in to talk 💬 to your docs"
        />
        <SignInForm handleSignIn={handleSignIn} />
        <p className="mt-6 text-center text-sm text-gray-600">
          Don &apos;t have an account?{' '}
          <Link href="/signup" className="text-rose-500 hover:underline">
            Sign up
          </Link>
        </p>
      </ShineBorder>

    </div>
  );
}
