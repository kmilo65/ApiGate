"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Play, Book, Copy, Check } from "lucide-react"

const defaultRequest = `{
  "githubUrl": "https://github.com/assafelovic/gpt-researcher"
}`

const mockResponse = `{
  "message": "GitHub summarization completed successfully",
  "summary": "GPT Researcher is an open deep research agent that generates detailed, factual, and unbiased research reports with citations. It offers customization options for creating domain-specific research agents and addresses misinformation and reliability issues in research tasks.",
  "cool_facts": [
    "GPT Researcher utilizes 'planner' and 'execution' agents to generate research questions, gather information, and aggregate findings into comprehensive reports.",
    "It can generate detailed research reports exceeding 2,000 words and aggregate over 20 sources for objective conclusions.",
    "The project supports Deep Research, a recursive research workflow that explores topics with agentic depth and breadth, with concurrent processing for faster results.",
    "GPT Researcher includes a multi-agent assistant built with LangGraph, showcasing how a team of AI agents can work together to conduct research on a given topic.",
    "The project offers an enhanced frontend with intuitive interfaces, real-time progress tracking, and customizable settings for tailored research experiences."
  ]
}`

const defaultResponse = `{
  "message": "GitHub summarization completed successfully",
  "summary": "GPT Researcher is an open deep research agent that generates detailed, factual, and unbiased research reports with citations. It offers customization options for creating domain-specific research agents and addresses misinformation and reliability issues in research tasks.",
  "cool_facts": [
    "GPT Researcher utilizes 'planner' and 'execution' agents to generate research questions, gather information, and aggregate findings into comprehensive reports.",
    "It can generate detailed research reports exceeding 2,000 words and aggregate over 20 sources for objective conclusions.",
    "The project supports Deep Research, a recursive research workflow that explores topics with agentic depth and breadth, with concurrent processing for faster results.",
    "GPT Researcher includes a multi-agent assistant built with LangGraph, showcasing how a team of AI agents can work together to conduct research on a given topic.",
    "The project offers an enhanced frontend with intuitive interfaces, real-time progress tracking, and customizable settings for tailored research experiences."
  ]
}`

export function ApiDemo() {
  const [request, setRequest] = useState(defaultRequest)
  const [response, setResponse] = useState(defaultResponse)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleTryItOut = async () => {
    setIsLoading(true)
    setResponse("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      // Validate JSON
      JSON.parse(request)
      setResponse(mockResponse)
    } catch (error) {
      setResponse(`{
  "error": "Invalid JSON format",
  "message": "Please check your request format and try again."
}`)
    }

    setIsLoading(false)
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatJson = (jsonString: string) => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2)
    } catch {
      return jsonString
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 font-medium">
            🚀 Interactive Demo
          </Badge>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Try It Out
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test our GitHub analyzer API with real requests. Edit the payload and see instant results.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* API Request Panel */}
          <Card className="border-2 border-gray-200 hover:border-amber-200 transition-all duration-300 hover:shadow-xl transform hover:scale-105 group">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900">API Request</CardTitle>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  POST /api/analyze
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Edit the payload and send a request</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  className="font-mono text-sm min-h-[200px] resize-none border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  placeholder="Enter your JSON request..."
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-amber-50"
                  onClick={() => copyToClipboard(request)}
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleTryItOut}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Try it out
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="border-2 border-amber-500 text-amber-600 hover:bg-amber-50 hover:border-amber-600 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 bg-transparent"
                >
                  <Book className="mr-2 h-4 w-4" />
                  Documentation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API Response Panel */}
          <Card className="border-2 border-gray-200 hover:border-amber-200 transition-all duration-300 hover:shadow-xl transform hover:scale-105 group">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900">API Response</CardTitle>
                <Badge className="bg-green-100 text-green-800 border-green-200">200 OK</Badge>
              </div>
              <p className="text-sm text-gray-600">View the response from the API</p>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {isLoading ? (
                  <div className="flex items-center justify-center min-h-[200px] bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-2 border-dashed border-amber-300">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-4" />
                      <p className="text-amber-700 font-medium">Analyzing repository...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <pre className="bg-gradient-to-br from-gray-50 to-amber-50 p-4 rounded-lg text-sm font-mono overflow-auto max-h-[400px] border border-amber-200">
                      <code className="text-gray-800">{formatJson(response)}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-amber-100"
                      onClick={() => copyToClipboard(response)}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live API endpoint</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span>Real-time responses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>No authentication required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
