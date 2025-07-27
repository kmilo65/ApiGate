import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// Define the structured output schema
const structuredOutputSchema = z.object({
  summary: z.string().describe("A concise 1-2 sentence summary of what the project does and its main purpose"),
  cool_facts: z.array(z.string()).describe("An array of 3-5 interesting facts about the project (technologies used, features, etc.)")
});

// Summarizer function for GitHub README.md content using LangChain with structured output
export async function summarizeReadme(readmeText) {
  try {
    // Validate input
    if (!readmeText || typeof readmeText !== 'string') {
      return {
        summary: "No README.md content found to summarize.",
        cool_facts: []
      };
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return {
        summary: "Summarization service not configured. Please check OpenAI API key.",
        cool_facts: []
      };
    }

    // Initialize the LLM with structured output
    const llm = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.3,
      openAIApiKey: process.env.OPENAI_API_KEY
    });

    // Define the prompt template
    const prompt = PromptTemplate.fromTemplate(`
      You are an expert open source analyst.
      Analyze this GitHub README and provide insights about the project.
      
      README content:
      {readme}
      
      Focus on understanding what the project does, its main features, and interesting technical aspects.
      Provide a clear, concise summary and identify the most compelling facts about the project.
    `);

    // Create the chain with structured output
    const chain = prompt.pipe(llm.withStructuredOutput(structuredOutputSchema));
    
    // Invoke the chain - result is already parsed and typed!
    const result = await chain.invoke({ readme: readmeText });
    
    // Validate the result structure
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid result structure from LLM');
    }

    // Return the structured result (no manual parsing needed!)
    return {
      summary: result.summary || "Unable to generate summary",
      cool_facts: Array.isArray(result.cool_facts) ? result.cool_facts : []
    };
    
  } catch (error) {
    console.error('Error in LangChain structured summarizer:', error);
    
    // Handle specific error types
    if (error.message?.includes('API key')) {
      return {
        summary: "Authentication error. Please check OpenAI API configuration.",
        cool_facts: []
      };
    }
    
    if (error.message?.includes('rate limit')) {
      return {
        summary: "Rate limit exceeded. Please try again later.",
        cool_facts: []
      };
    }
    
    return {
      summary: "Error occurred while summarizing the README content.",
      cool_facts: []
    };
  }
} 