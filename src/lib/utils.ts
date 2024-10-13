import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabseAuthClient } from './supabase/auth';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';
import { User } from '@supabase/supabase-js';

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
    .from('audio-kb')
    .upload(filename, file);
  if (error) {
    toast.error(error.message);
    throw error;
  }
  return data;
}
