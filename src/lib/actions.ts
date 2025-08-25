'use server';

import { filterSpam, type FilterSpamOutput } from '@/ai/flows/filter-spam';

export async function checkSpamAction(emailContent: string): Promise<FilterSpamOutput> {
  try {
    const result = await filterSpam({ emailContent });
    return result;
  } catch (error) {
    console.error('Error in checkSpamAction:', error);
    // Return a default non-spam response on error to avoid blocking UI
    return { isSpam: false, spamReason: 'Error checking spam status.' };
  }
}
