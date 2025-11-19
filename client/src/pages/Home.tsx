import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_TITLE } from "@/const";
import { ArrowRight, Bot, Sparkles, Zap, Brain, Code, FileText, BarChart3, Languages, Wand2 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-black">
              {APP_TITLE}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by CrewAI & Groq
          </Badge>
          <h1 className="text-6xl font-bold mb-6 text-black leading-tight">
            Advanced NLP Processing
            <br />
            with Multi-Agent AI
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Harness the power of collaborative AI agents to transform your text into actionable insights.
            Real-time streaming, advanced analysis, and production-ready results.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8">
                Start Processing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Powerful NLP Capabilities</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Multiple specialized AI agents working together to deliver exceptional results
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-gray-200 hover:shadow-xl transition-shadow bg-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Text Summarization</CardTitle>
              <CardDescription>
                Condense lengthy documents into clear, concise summaries while preserving key information
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-gray-200 hover:shadow-xl transition-shadow bg-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Data Analysis</CardTitle>
              <CardDescription>
                Extract insights, identify patterns, and generate actionable recommendations from your data
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-gray-200 hover:shadow-xl transition-shadow bg-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Research & Analysis</CardTitle>
              <CardDescription>
                Comprehensive research with multiple agents collaborating to gather and synthesize information
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-gray-200 hover:shadow-xl transition-shadow bg-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mb-4">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Content Generation</CardTitle>
              <CardDescription>
                Create engaging, well-structured content tailored to your specific requirements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-gray-200 hover:shadow-xl transition-shadow bg-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Code Generation</CardTitle>
              <CardDescription>
                Generate clean, production-ready code with best practices and comprehensive documentation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-gray-200 hover:shadow-xl transition-shadow bg-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mb-4">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Translation</CardTitle>
              <CardDescription>
                Accurate translations preserving context, tone, and cultural nuances across languages
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Live Processing Demo */}
      <section className="container py-16">
        <Card className="border-gray-200 bg-white">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Real-Time Streaming</CardTitle>
            <CardDescription className="text-lg">
              Watch AI agents process your requests in real-time with live progress updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm text-green-400">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span>Processing with CrewAI agents...</span>
              </div>
              <div className="space-y-2 text-gray-300">
                <div>→ Researcher agent analyzing input...</div>
                <div>→ Analyst agent identifying patterns...</div>
                <div>→ Writer agent generating output...</div>
                <div className="text-green-400">✓ Task completed successfully</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container py-20 text-center">
        <div className="max-w-3xl mx-auto bg-orange-500 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
          <p className="text-xl mb-8 text-orange-50">
            Join thousands of users leveraging AI-powered NLP processing for their projects
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container text-center text-gray-600">
          <p>© 2025 {APP_TITLE}. Powered by CrewAI and Groq.</p>
        </div>
      </footer>
    </div>
  );
}
