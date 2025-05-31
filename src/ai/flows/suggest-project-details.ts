'use server';
/**
 * @fileOverview Herramienta potenciada por IA para sugerir detalles de proyecto basados en una descripción.
 *
 * - suggestProjectDetails - Una función que sugiere detalles del proyecto.
 * - SuggestProjectDetailsInput - El tipo de entrada para la función suggestProjectDetails.
 * - SuggestProjectDetailsOutput - El tipo de retorno para la función suggestProjectDetails.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProjectDetailsInputSchema = z.object({
  description: z
    .string()
    .describe('La descripción del proyecto para el cual sugerir detalles.'),
});
export type SuggestProjectDetailsInput = z.infer<
  typeof SuggestProjectDetailsInputSchema
>;

const SuggestProjectDetailsOutputSchema = z.object({
  projectType: z
    .string()
    .describe('Tipo de proyecto sugerido basado en la descripción.'),
  publicObjective: z
    .string()
    .describe('Objetivo público sugerido para el proyecto.'),
  scope: z.string().describe('Alcance sugerido del proyecto.'),
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
  prompt: `Eres un asistente de IA diseñado para sugerir detalles de proyectos.

  Basado en la siguiente descripción del proyecto, sugiere un tipo de proyecto, un objetivo público y un alcance para el proyecto.

  Descripción: {{{description}}}
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
