// This file uses server-side code.
'use server';

/**
 * @fileOverview Implements a Genkit flow to filter spam emails using an LLM.
 *
 * - filterSpam - A function that filters an email to determine if it is spam.
 * - FilterSpamInput - The input type for the filterSpam function.
 * - FilterSpamOutput - The return type for the filterSpam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterSpamInputSchema = z.object({
  emailContent: z.string().describe('The content of the email to be checked for spam.'),
});
export type FilterSpamInput = z.infer<typeof FilterSpamInputSchema>;

const FilterSpamOutputSchema = z.object({
  isSpam: z.boolean().describe('Whether the email is considered spam or not.'),
  spamReason: z
    .string()
    .optional()
    .describe('The reason why the email is considered spam.'),
});
export type FilterSpamOutput = z.infer<typeof FilterSpamOutputSchema>;

export async function filterSpam(input: FilterSpamInput): Promise<FilterSpamOutput> {
  return filterSpamFlow(input);
}

const filterSpamPrompt = ai.definePrompt({
  name: 'filterSpamPrompt',
  input: {schema: FilterSpamInputSchema},
  output: {schema: FilterSpamOutputSchema},
  prompt: `You are an AI email spam filter.

  Analyze the content of the email provided and determine if it is spam or not.
  Return isSpam as true if the email is spam, and false if it is not.
  If the email is spam, provide a reason in spamReason.

  Email content: {{{emailContent}}}`,
});

const filterSpamFlow = ai.defineFlow(
  {
    name: 'filterSpamFlow',
    inputSchema: FilterSpamInputSchema,
    outputSchema: FilterSpamOutputSchema,
  },
  async input => {
    const {output} = await filterSpamPrompt(input);
    return output!;
  }
);
