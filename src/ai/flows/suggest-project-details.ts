'use server';
/**
 * @fileOverview AI-powered tool to suggest project details based on a description.
 *
 * - suggestProjectDetails - A function that suggests project details.
 * - SuggestProjectDetailsInput - The input type for the suggestProjectDetails function.
 * - SuggestProjectDetailsOutput - The return type for the suggestProjectDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProjectDetailsInputSchema = z.object({
  description: z
    .string()
    .describe('The description of the project for which to suggest details.'),
});
export type SuggestProjectDetailsInput = z.infer<
  typeof SuggestProjectDetailsInputSchema
>;

const SuggestProjectDetailsOutputSchema = z.object({
  projectType: z
    .string()
    .describe('Suggested project type based on the description.'),
  publicObjective: z
    .string()
    .describe('Suggested public objective for the project.'),
  scope: z.string().describe('Suggested scope of the project.'),
});
export type SuggestProjectDetailsOutput = z.infer<
  typeof SuggestProjectDetailsOutputSchema
>;

export async function suggestProjectDetails(
  input: SuggestProjectDetailsInput
): Promise<SuggestProjectDetailsOutput> {
  return suggestProjectDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProjectDetailsPrompt',
  input: {schema: SuggestProjectDetailsInputSchema},
  output: {schema: SuggestProjectDetailsOutputSchema},
  prompt: `You are an AI assistant designed to suggest project details.

  Based on the following project description, suggest a project type, a public objective, and a scope for the project.

  Description: {{{description}}}

  Please provide the suggestions in a structured format.
  `,
});

const suggestProjectDetailsFlow = ai.defineFlow(
  {
    name: 'suggestProjectDetailsFlow',
    inputSchema: SuggestProjectDetailsInputSchema,
    outputSchema: SuggestProjectDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
