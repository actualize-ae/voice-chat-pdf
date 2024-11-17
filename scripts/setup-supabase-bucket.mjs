
export const createBucket = async (supabase, {
  bucketName,
  fileSizeLimit,
  allowedMimeTypes
}) => {
  // Create a bucket for the audio knowledge base
  const { data, error } = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit,
    allowedMimeTypes,
  });

  if (error) {
    console.error('Error creating bucket:', error);
  } else {
    console.log('Bucket created successfully:', data);
  }  
}