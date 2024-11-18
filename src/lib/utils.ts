import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabseAuthClient } from './supabase/auth';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';
import appConfig from '@/config/app-config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
