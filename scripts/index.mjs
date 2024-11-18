import dotenv from 'dotenv';
import inquirer from 'inquirer';
import { createBucket, createSupabaseClient  } from './setup-supabase.mjs';
import { createSupabaseDatabase } from './setup-supabase-db.mjs';

dotenv.config();
// 
const questions = [{
  type: 'input',
  name: 'supabaseUrl',
  message: 'Supabase URL(Read from supabase configs)',
}, {
  type: 'input',
  name: 'supabaseAnonKey',
  message: 'Supabase Anonymous key',
}]

inquirer.prompt([...questions, {
  type: 'confirm',
  name: 'createBucket',
  message: 'Create Supabase Bucket?(Click No if you already have public bucket)'
},
{
    type: 'input',
    name: 'bucketName',
    message: `Name of Bucket
        Note: This must be same as env variable NEXT_PUBLIC_SUPABASE_BUCKET_NAME
    `,
    default: process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME,
    when(answers){
      return answers.createBucket
    }
},
{
    type: 'number',
    name: 'fileSizeLimit',
    message: `Maximum file size(MB)`,
    default: 1,
    when(answers){
      return answers.createBucket
    }
},
{
    type: 'rawlist',
    name: 'allowedMimeTypes',
    message: `Allowed Mime Types`,
    choices: ['application/pdf'],
    when(answers){
      return answers.createBucket
    }
},
{
  type: 'confirm',
  name: 'executeRpc',
  message: 'Execute supabase rpc(This must match the rpc name from Supabase dashboard)',
}, {
    type: 'input',
    name: 'rpcName',
    message: `Name of Postgres rpc`,
    default: 'create-document-table',
    when(answers){
      return answers.executeRpc
    }
}, {
    type: 'input',
    name: 'tableName',
    message: `Name of Database table
        Note: This must be same as env variable NEXT_PUBLIC_SUPABASE_USER_TABLE_NAME
    `,
    default: process.env.NEXT_PUBLIC_SUPABASE_USER_TABLE_NAME,
    when(answers){
      return answers.executeRpc
    }
}]).then(async (answers) => {
  // Create supabase client
  const supabase = createSupabaseClient(answers.supabaseUrl, answers.supabaseAnonKey)
  if(answers.createBucket){
    await createBucket(supabase, {
        bucketName: answers.bucketName,
        fileSizeLimit: answers.fileSizeLimit * 1024 * 1024,
        allowedMimeTypes: answers.allowedMimeTypes
    })
  }
  if(answers.executeRpc){
    await createSupabaseDatabase(supabase, {
        databaseTableName: answers.tableName,
        rpcName: answers.rpcName
    })
  }
}).catch((error) => {
  console.error('Error occured', error)
})