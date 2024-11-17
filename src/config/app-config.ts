
const appConfig = {
  supabase: {
    bucketName: process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || 'audio-kb',
    tableName: process.env.NEXT_PUBLIC_SUPABASE_USER_TABLE_NAME || 'documents',
    projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  }
}

export default appConfig;