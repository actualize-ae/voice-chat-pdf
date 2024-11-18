import { CohereClient } from 'cohere-ai';

export const cohereClient = new CohereClient({
  token: process.env.COHERE_API_KEY || '',
});
