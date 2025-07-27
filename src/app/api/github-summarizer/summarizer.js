import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";

/**
 * Summarizes the content of a README.md file from a GitHub repository.
 * @param {object} params
 * @param {string} params.readmeContent - The content of the README.md file.
 * @param {object} params.llm - The LLM instance to use for summarization.
 * @returns {Promise<{ summary: string, cool_facts: string[] }>}
 */
export async function summarizeReadme({ readmeContent, llm }) {
  // Define the system prompt
  const prompt = PromptTemplate.fromTemplate(
    `You are an expert open source analyst.
Summarize the following GitHub README.md content.
Return your answer as a JSON object with two fields:
- "summary": a concise summary of the repository (1-3 sentences)
- "cool_facts": a list of 3-5 interesting or unique facts about the repository

README content:
{context}

Respond ONLY with a valid JSON object.`
  );

  // Create the chain
  const chain = await createStuffDocumentsChain({
    llm,
    prompt,
    outputParser: new StringOutputParser(),
  });

  // Prepare the document input
  const docs = [
    {
      pageContent: readmeContent,
      metadata: {},
    },
  ];

  // Invoke the chain
  const result = await chain.invoke({ context: docs });

  // Parse the output as JSON
  let parsed;
  try {
    parsed = JSON.parse(result);
  } catch (e) {
    // fallback: try to extract JSON from the output
    const match = result.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      throw new Error("Failed to parse LLM output as JSON: " + result);
    }
  }

  // Ensure the output structure
  return {
    summary: parsed.summary || "",
    cool_facts: Array.isArray(parsed.cool_facts) ? parsed.cool_facts : [],
  };
}
