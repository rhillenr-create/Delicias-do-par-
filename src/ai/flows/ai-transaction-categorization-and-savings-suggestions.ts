'use server';
/**
 * @fileOverview This file implements an AI flow for categorizing financial transactions
 * and providing cost-saving suggestions for an açaíteria business.
 *
 * - categorizeTransactionAndSuggestSavings - A function that categorizes a transaction
 *   description and provides cost-saving suggestions.
 * - AITransactionCategorizationAndSavingsSuggestionsInput -
 *   The input type for the categorizeTransactionAndSuggestSavings function.
 * - AITransactionCategorizationAndSavingsSuggestionsOutput -
 *   The return type for the categorizeTransactionAndSuggestSavings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AITransactionCategorizationAndSavingsSuggestionsInputSchema = z.object({
  description: z
    .string()
    .describe('The description of the transaction to categorize and analyze for cost-saving.'),
});
export type AITransactionCategorizationAndSavingsSuggestionsInput = z.infer<
  typeof AITransactionCategorizationAndSavingsSuggestionsInputSchema
>;

const AITransactionCategorizationAndSavingsSuggestionsOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'A concise category for the transaction (e.g., "Ingredientes", "Utilities", "Marketing", "Salaries", "Rent", "Equipment Maintenance", "Delivery Fees", "Administrative", "Other").'
    ),
  suggestions: z
    .array(z.string())
    .describe(
      'A list of actionable cost-saving suggestions related to the transaction category or description, specifically tailored for an açaíteria business.'
    ),
});
export type AITransactionCategorizationAndSavingsSuggestionsOutput = z.infer<
  typeof AITransactionCategorizationAndSavingsSuggestionsOutputSchema
>;

export async function categorizeTransactionAndSuggestSavings(
  input: AITransactionCategorizationAndSavingsSuggestionsInput
): Promise<AITransactionCategorizationAndSavingsSuggestionsOutput> {
  return aiTransactionCategorizationAndSavingsSuggestionsFlow(input);
}

const aiTransactionCategorizationAndSavingsSuggestionsPrompt = ai.definePrompt({
  name: 'aiTransactionCategorizationAndSavingsSuggestionsPrompt',
  input: {schema: AITransactionCategorizationAndSavingsSuggestionsInputSchema},
  output: {schema: AITransactionCategorizationAndSavingsSuggestionsOutputSchema},
  prompt: `You are an AI financial advisor for an açaíteria business. Your task is to analyze a transaction description, categorize it, and provide specific, actionable cost-saving suggestions tailored for an açaíteria.

Categorize the transaction into one of the following: "Ingredientes", "Utilities", "Marketing", "Salaries", "Rent", "Equipment Maintenance", "Delivery Fees", "Administrative", "Other".

Based on the transaction description and its category, suggest ways the açaíteria can reduce costs or optimize spending in that area. Provide at least one, and up to three, distinct suggestions.

Transaction Description: {{{description}}}`,
});

const aiTransactionCategorizationAndSavingsSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiTransactionCategorizationAndSavingsSuggestionsFlow',
    inputSchema: AITransactionCategorizationAndSavingsSuggestionsInputSchema,
    outputSchema: AITransactionCategorizationAndSavingsSuggestionsOutputSchema,
  },
  async (input) => {
    const {output} = await aiTransactionCategorizationAndSavingsSuggestionsPrompt(input);
    return output!;
  }
);
