import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabseAuthClient } from './supabase/auth';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';
import appConfig from '@/config/app-config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-200 focus:dark:ring-blue-700/30",
  // border color
  "focus:border-blue-500 focus:dark:border-blue-700",
]

// Tremor focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
]

export async function uploadFile(file: File): Promise<{
  id: string;
  path: string;
  fullPath: string;
}> {
  const filename = `${nanoid()}.${file.name.split('.').pop()}`;

  const { data, error } = await supabseAuthClient.supabase.storage
    .from(appConfig.supabase.bucketName)
    .upload(filename, file);
  if (error) {
    toast.error(error.message);
    throw error;
  }
  return data;
}

export async function deleteFile(id: string) {

  const { error } = await supabseAuthClient.supabase.storage
    .from(appConfig.supabase.bucketName)
    .remove([id])
  if (error) {
    toast.error('Something went wrong while removing file');
    throw error;
  }
}
