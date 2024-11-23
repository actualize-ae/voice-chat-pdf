import Link from 'next/link';
import { useRouter } from 'next/router';
import { signUpWithEmailPassword } from '@/lib/api/utils';
import { Toaster } from 'react-hot-toast';
import { CompanyLogo } from '@/components/logo/CompanyLogo';
import { AnimatedBeamDemo } from '@/components/animated/AnimatedBeamDemo';
import ShineBorder from '@/components/ui/shine-border';
import { SignupForm } from '@/components/forms/SignUp';
import { cn } from '@/lib/utils';
import DotPattern from '@/components/ui/dot-pattern';
import WordPullUp from '@/components/ui/word-pull-up';



export default function SignUpPage() {
  const router = useRouter();
  const handleSignup = async ({
    email,
    password
  }: {
    email: string,
    password: string
  }) => {
    await signUpWithEmailPassword({
      email,
      password
    });
    router.push('/');
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
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
          words="Sign up now to talk 💬 to your docs"
        />
        <SignupForm handleSignup={handleSignup} />
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/signin" className="text-rose-500 hover:underline">
            Log in
          </Link>
        </p>
      </ShineBorder>
    </div>
  );
}
