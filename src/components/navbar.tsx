import Link from 'next/link';
import { Home, Upload, PlayCircle, CreativeCommons, Menu } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { supabseAuthClient } from '@/lib/supabase/auth';
import { useRouter } from 'next/router';
import { signOut } from '@/lib/api/utils';

export function NavbarComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="bg-white shadow-sm">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Home className="h-8 w-8 text-rose-500" />
              <span className="ml-2 text-xl font-semibold text-gray-800">
                DocTalk
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/upload"
                className="border-transparent text-gray-500 hover:border-rose-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Documents
              </Link>
              <Link
                href="/"
                className="border-transparent text-gray-500 hover:border-rose-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Playground
              </Link>
              <Link
                href="/embeddings"
                className="border-transparent text-gray-500 hover:border-rose-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <CreativeCommons className="mr-2 h-4 w-4" />
                Generate Embeddings
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button
              onClick={async () => {
                await signOut();
                router.push('/signin');
              }}
              variant="outline"
              className="text-rose-500 border-rose-500 hover:bg-rose-50"
            >
              Sign Out
            </Button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="#view=upload"
              className="text-gray-600 hover:bg-rose-50 hover:text-rose-500 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
            >
              <Upload className="inline-block mr-2 h-4 w-4" />
              Upload Documents
            </Link>
            <Link
              href="#view=playground"
              className="text-gray-600 hover:bg-rose-50 hover:text-rose-500 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
            >
              <PlayCircle className="inline-block mr-2 h-4 w-4" />
              Playground
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="mt-3 space-y-1">
              <Button
                variant="outline"
                className="w-full justify-start text-rose-500 border-rose-500 hover:bg-rose-50"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
