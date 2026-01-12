"use client"

import Image from "next/image"
import { useState } from "react"
import {
  ArrowRight,
  Cpu,
  Database,
  LineChart,
  Shield,
  Calendar,
  Lightbulb,
  Award,
  Zap,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Info,
  Download,
  ExternalLink,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"

export default function InnovationsPage() {
  const [activeDemo, setActiveDemo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState("ai")
  const [showGlossary, setShowGlossary] = useState(false)

  const demos = [
    {
      id: 1,
      title: "AI Credit Scoring",
      description: "See how our AI analyzes alternative data to create accurate credit profiles.",
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      id: 2,
      title: "Blockchain Transactions",
      description: "Experience the speed and security of our blockchain-based transaction system.",
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      id: 3,
      title: "Decentralized Markets",
      description: "Explore how our platform connects savers and borrowers without intermediaries.",
      image: "/placeholder.svg?height=600&width=800",
    },
  ]

  const milestones = [
    {
      year: 2018,
      title: "Concept Development",
      description: "Initial research and concept development for AI-powered financial inclusion.",
    },
    {
      year: 2019,
      title: "Prototype Launch",
      description: "First prototype of our AI credit scoring algorithm developed and tested.",
    },
    {
      year: 2020,
      title: "Blockchain Integration",
      description: "Successfully integrated blockchain technology for secure transactions.",
    },
    { year: 2021, title: "First Market Deployment", description: "Launched in first test market with 10,000 users." },
    {
      year: 2022,
      title: "Climate Finance Platform",
      description: "Introduced our climate financing platform for sustainable agriculture.",
    },
    { year: 2023, title: "Global Expansion", description: "Expanded to 5 countries with over 1 million users." },
    {
      year: 2024,
      title: "Advanced AI Models",
      description: "Launched next-generation AI models with 95% accuracy in credit prediction.",
    },
  ]

  const impactMetrics = [
    { metric: "Users Served", value: 1250000, suffix: "+", color: "bg-[#00CC66]" },
    { metric: "Loans Facilitated", value: 850000, suffix: "+", color: "bg-primary" },
    { metric: "Transaction Costs Saved", value: 85, suffix: "%", color: "bg-[#00CC66]" },
    { metric: "Carbon Emissions Reduced", value: 125000, suffix: " tons", color: "bg-primary" },
  ]

  const glossaryTerms = [
    {
      term: "Blockchain",
      definition: "A distributed, decentralized, public ledger that records transactions across many computers.",
    },
    { term: "Smart Contract", definition: "Self-executing contracts with the terms directly written into code." },
    { term: "Decentralized Finance (DeFi)", definition: "Financial applications built on blockchain technologies." },
    {
      term: "Alternative Data",
      definition: "Non-traditional data points used for credit scoring and financial analysis.",
    },
    {
      term: "Carbon Credits",
      definition: "Tradable permits representing the right to emit a specific amount of carbon dioxide.",
    },
  ]

  const handleNextDemo = () => {
    setActiveDemo((prev) => (prev === demos.length - 1 ? 0 : prev + 1))
  }

  const handlePrevDemo = () => {
    setActiveDemo((prev) => (prev === 0 ? demos.length - 1 : prev - 1))
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with 3D Effect and Particles */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-linear-to-br from-[#002244] via-primary to-[#004488]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[40px_40px] opacity-50"></div>

          {/* Animated particles/dots */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/20"
                style={{
                  width: `${Math.random() * 8 + 2}px`,
                  height: `${Math.random() * 8 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-white/10 backdrop-blur-xs px-4 py-2 rounded-full mb-6">
                <span className="text-[#00CC66] font-semibold">Pioneering Financial Technology</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-white">
                Technological <span className="text-[#00CC66]">Innovations</span> Reshaping Finance
              </h1>
              <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl">
                Our cutting-edge solutions are revolutionizing financial inclusion in underserved communities through
                AI, blockchain, and sustainable technologies.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button size="lg" className="bg-[#00CC66] hover:bg-[#00BB55] text-white">
                  Explore Our Technologies
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Request a Demo
                </Button>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="relative h-[300px] md:h-[400px] w-full perspective-1000">
                <div className="absolute inset-0 transform-style-3d rotate-y-12 rotate-x-12 animate-float-slow">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary/80 to-[#00CC66]/80 rounded-2xl backdrop-blur-xs border border-white/20 shadow-2xl"></div>
                  <Image
                    src="/placeholder.svg?height=800&width=800"
                    alt="Innovation Technology Visualization"
                    fill
                    className="object-cover rounded-2xl opacity-80 mix-blend-overlay"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center p-6">
                      <Cpu className="h-16 w-16 mx-auto mb-4 text-[#00CC66]" />
                      <h3 className="text-2xl font-bold mb-2">Next-Gen Financial Technology</h3>
                      <p className="text-white/80">Powering the future of inclusive finance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Interactive Timeline Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Our Journey</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Innovation Timeline</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Explore our journey of technological breakthroughs and milestones.
            </p>
          </div>

          <div className="relative mt-20 mb-10 mx-auto max-w-5xl">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-linear-to-b from-primary to-[#00CC66] transform -translate-x-1/2"></div>

            {/* Timeline events */}
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`relative flex items-center mb-12 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                {/* Year bubble */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-4 border-[#00CC66] shadow-lg">
                    <span className="text-sm font-bold text-primary">{milestone.year}</span>
                  </div>
                </div>

                {/* Content card */}
                <div className={`w-5/12 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                  <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="h-1 bg-linear-to-r from-primary to-[#00CC66]"></div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-primary mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Technology Demos */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#00CC66]/10 text-[#00CC66] hover:bg-[#00CC66]/20">Interactive</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
              Experience Our Technology
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Explore interactive demonstrations of our innovative technologies.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              {/* Demo viewer */}
              <div className="relative h-[400px] md:h-[500px]">
                <Image
                  src={demos[activeDemo].image || "/placeholder.svg"}
                  alt={demos[activeDemo].title}
                  fill
                  className="object-cover transition-opacity duration-500"
                />

                {/* Overlay with controls */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{demos[activeDemo].title}</h3>
                  <p className="text-white/80 mb-6 max-w-xl">{demos[activeDemo].description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full border-white/20 text-white hover:bg-white/10"
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <div className="text-white/80 text-sm">
                        Demo {activeDemo + 1} of {demos.length}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full border-white/20 text-white hover:bg-white/10"
                        onClick={handlePrevDemo}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full border-white/20 text-white hover:bg-white/10"
                        onClick={handleNextDemo}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo thumbnails */}
              <div className="flex p-4 gap-4 bg-white">
                {demos.map((demo, index) => (
                  <div
                    key={demo.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                      activeDemo === index ? "ring-2 ring-[#00CC66]" : "opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setActiveDemo(index)}
                  >
                    <div className="relative w-24 h-16 md:w-32 md:h-20">
                      <Image src={demo.image || "/placeholder.svg"} alt={demo.title} fill className="object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Tabs Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Core Technologies</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Our Technology Stack</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Explore the innovative technologies powering our financial inclusion platform.
            </p>
          </div>

          <Tabs defaultValue="ai" className="max-w-5xl mx-auto" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 md:grid-cols-4 w-full max-w-2xl">
                <TabsTrigger value="ai" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Cpu className="h-4 w-4 mr-2" />
                  AI
                </TabsTrigger>
                <TabsTrigger
                  value="blockchain"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Blockchain
                </TabsTrigger>
                <TabsTrigger
                  value="climate"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <LineChart className="h-4 w-4 mr-2" />
                  Climate Tech
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 md:p-8">
              <TabsContent value="ai" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-4">AI-Powered Credit Scoring</h3>
                    <p className="text-gray-600 mb-6">
                      Our proprietary AI algorithms analyze alternative data points to create accurate credit profiles
                      for individuals without traditional credit histories.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">
                          Neural networks trained on diverse financial behavior patterns
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">
                          Natural language processing for analyzing communication patterns
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">
                          Anomaly detection for fraud prevention and risk assessment
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">
                          Continuous learning models that improve with each transaction
                        </span>
                      </li>
                    </ul>
                    <div className="mt-6">
                      <Button className="bg-primary hover:bg-[#002244]">
                        Learn More About Our AI
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src="/placeholder.svg?height=800&width=600"
                      alt="AI Technology Visualization"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent flex items-end p-6">
                      <div className="text-white">
                        <h4 className="text-lg font-semibold mb-2">AI Model Accuracy</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Credit Risk Prediction</span>
                            <span className="text-sm font-medium">95%</span>
                          </div>
                          <Progress value={95} className="h-2 bg-white/20" indicatorClassName="bg-[#00CC66]" />

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Fraud Detection</span>
                            <span className="text-sm font-medium">98%</span>
                          </div>
                          <Progress value={98} className="h-2 bg-white/20" indicatorClassName="bg-[#00CC66]" />

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Income Stability Assessment</span>
                            <span className="text-sm font-medium">92%</span>
                          </div>
                          <Progress value={92} className="h-2 bg-white/20" indicatorClassName="bg-[#00CC66]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="blockchain" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src="/placeholder.svg?height=800&width=600"
                      alt="Blockchain Technology Visualization"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent flex items-end p-6">
                      <div className="text-white">
                        <h4 className="text-lg font-semibold mb-2">Blockchain Performance</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Transaction Speed</span>
                            <span className="text-sm font-medium">3000 TPS</span>
                          </div>
                          <Progress value={80} className="h-2 bg-white/20" indicatorClassName="bg-[#00CC66]" />

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Energy Efficiency</span>
                            <span className="text-sm font-medium">99.5%</span>
                          </div>
                          <Progress value={99.5} className="h-2 bg-white/20" indicatorClassName="bg-[#00CC66]" />

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Cost Reduction</span>
                            <span className="text-sm font-medium">85%</span>
                          </div>
                          <Progress value={85} className="h-2 bg-white/20" indicatorClassName="bg-[#00CC66]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <h3 className="text-2xl font-bold text-primary mb-4">Blockchain-Based Ledger</h3>
                    <p className="text-gray-600 mb-6">
                      Our blockchain infrastructure ensures all transactions are secure, transparent, and immutable,
                      building trust in communities where traditional banking has failed.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">
                          Energy-efficient consensus mechanism for sustainable operation
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">
                          Smart contracts for automated loan disbursement and repayment
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">
                          Decentralized identity management for secure user authentication
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">
                          Cross-border payment channels with minimal fees and instant settlement
                        </span>
                      </li>
                    </ul>
                    <div className="mt-6">
                      <Button className="bg-primary hover:bg-[#002244]">
                        Explore Our Blockchain
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="climate" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-4">Climate Financing Platform</h3>
                    <p className="text-gray-600 mb-6">
                      Our climate financing platform connects climate-conscious investors with agricultural communities
                      seeking funding for sustainable technologies like solar irrigation.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">
                          Satellite and IoT monitoring of climate project implementation
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">Carbon credit tokenization and transparent marketplace</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">AI-powered climate risk assessment for agricultural loans</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">Blockchain verification of environmental impact claims</span>
                      </li>
                    </ul>
                    <div className="mt-6">
                      <Button className="bg-primary hover:bg-[#002244]">
                        Learn About Climate Finance
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src="/placeholder.svg?height=800&width=600"
                      alt="Climate Technology Visualization"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent flex items-end p-6">
                      <div className="text-white">
                        <h4 className="text-lg font-semibold mb-2">Climate Impact</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Solar Irrigation Systems</span>
                            <span className="text-sm font-medium">5,000+</span>
                          </div>
                          <Progress value={75} className="h-2 bg-white/20" indicatorClassName="bg-[#00CC66]" />

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Carbon Credits Generated</span>
                            <span className="text-sm font-medium">125,000 tons</span>
                          </div>
                          <Progress value={88} className="h-2 bg-white/20" indicatorClassName="bg-[#00CC66]" />

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Farmers Supported</span>
                            <span className="text-sm font-medium">75,000+</span>
                          </div>
                          <Progress value={82} className="h-2 bg-white/20" indicatorClassName="bg-[#00CC66]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src="/placeholder.svg?height=800&width=600"
                      alt="Security Technology Visualization"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent flex items-end p-6">
                      <div className="text-white">
                        <h4 className="text-lg font-semibold mb-2">Security Metrics</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Encryption Strength</span>
                            <span className="text-sm font-medium">256-bit</span>
                          </div>
                          <Progress value={100} className="h-2 bg-white/20" indicatorClassName="bg-[#00CC66]" />

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Penetration Test Success</span>
                            <span className="text-sm font-medium">100%</span>
                          </div>
                          <Progress value={100} className="h-2 bg-white/20" indicatorClassName="bg-[#00CC66]" />

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Compliance Coverage</span>
                            <span className="text-sm font-medium">ISO 27001, GDPR, PCI DSS</span>
                          </div>
                          <Progress value={95} className="h-2 bg-white/20" indicatorClassName="bg-[#00CC66]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <h3 className="text-2xl font-bold text-primary mb-4">Advanced Security Framework</h3>
                    <p className="text-gray-600 mb-6">
                      Our multi-layered security framework ensures the highest level of protection for user data and
                      financial transactions, meeting global compliance standards.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">End-to-end encryption for all data in transit and at rest</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">Multi-factor authentication with biometric verification</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">AI-powered fraud detection system with real-time alerts</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00CC66] mr-2 mt-1">•</span>
                        <span className="text-gray-600">
                          Regular security audits and penetration testing by third parties
                        </span>
                      </li>
                    </ul>
                    <div className="mt-6">
                      <Button className="bg-primary hover:bg-[#002244]">
                        Our Security Approach
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Impact Metrics Section with Animated Counters */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-white/10 text-white hover:bg-white/20">Real Impact</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">Measurable Results</h2>
            <p className="text-white/80 mt-4 max-w-2xl mx-auto">
              Our technologies are creating real-world impact across communities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactMetrics.map((metric, index) => (
              <Card key={index} className="bg-white/5 border-none text-white">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${metric.color} mx-auto mb-4 flex items-center justify-center`}
                  >
                    {index === 0 && <Users className="h-8 w-8 text-white" />}
                    {index === 1 && <Database className="h-8 w-8 text-white" />}
                    {index === 2 && <Zap className="h-8 w-8 text-white" />}
                    {index === 3 && <LineChart className="h-8 w-8 text-white" />}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{metric.metric}</h3>
                  <div className="text-3xl md:text-4xl font-bold text-[#00CC66]">
                    {metric.value.toLocaleString()}
                    {metric.suffix}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Success Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Innovation in Action</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Real-world applications of our technology making a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="relative h-48">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Rural Banking Case Study"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4">
                    <Badge className="bg-[#00CC66] hover:bg-[#00BB55] text-white">Rural Banking</Badge>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">Bringing Banking to Remote Villages</h3>
                <p className="text-gray-600 mb-4">
                  How our mobile banking technology connected 200+ remote villages to the financial system for the first
                  time.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>2023</span>
                  </div>
                  <Button variant="ghost" className="text-primary hover:text-[#002244] p-0 h-auto">
                    Read Case Study
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="relative h-48">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Solar Financing Case Study"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4">
                    <Badge className="bg-[#00CC66] hover:bg-[#00BB55] text-white">Climate Finance</Badge>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">Solar Irrigation Financing Program</h3>
                <p className="text-gray-600 mb-4">
                  How our platform enabled 5,000 small-scale farmers to access solar irrigation technology.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>2022</span>
                  </div>
                  <Button variant="ghost" className="text-primary hover:text-[#002244] p-0 h-auto">
                    Read Case Study
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="relative h-48">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Microfinance Case Study"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4">
                    <Badge className="bg-[#00CC66] hover:bg-[#00BB55] text-white">Microfinance</Badge>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">AI-Powered Microfinance Platform</h3>
                <p className="text-gray-600 mb-4">
                  How our AI credit scoring enabled a 300% increase in loan approvals for women entrepreneurs.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>2023</span>
                  </div>
                  <Button variant="ghost" className="text-primary hover:text-[#002244] p-0 h-auto">
                    Read Case Study
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Technology Diagram */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Technology Stack</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">How Our Technology Works</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              A visual representation of our integrated technology stack.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src="/placeholder.svg?height=1000&width=1200"
                alt="Technology Diagram"
                fill
                className="object-contain"
              />

              {/* Interactive hotspots */}
              <div className="absolute top-[20%] left-[25%]">
                <Button
                  size="icon"
                  className="rounded-full bg-[#00CC66] hover:bg-[#00BB55] h-8 w-8 shadow-lg"
                  onClick={() => setActiveTab("ai")}
                >
                  <Cpu className="h-4 w-4 text-white" />
                </Button>
              </div>

              <div className="absolute top-[40%] left-[60%]">
                <Button
                  size="icon"
                  className="rounded-full bg-primary hover:bg-[#002244] h-8 w-8 shadow-lg"
                  onClick={() => setActiveTab("blockchain")}
                >
                  <Database className="h-4 w-4 text-white" />
                </Button>
              </div>

              <div className="absolute top-[70%] left-[30%]">
                <Button
                  size="icon"
                  className="rounded-full bg-[#00CC66] hover:bg-[#00BB55] h-8 w-8 shadow-lg"
                  onClick={() => setActiveTab("climate")}
                >
                  <LineChart className="h-4 w-4 text-white" />
                </Button>
              </div>

              <div className="absolute top-[50%] left-[75%]">
                <Button
                  size="icon"
                  className="rounded-full bg-primary hover:bg-[#002244] h-8 w-8 shadow-lg"
                  onClick={() => setActiveTab("security")}
                >
                  <Shield className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-4">
                Click on the icons to learn more about each component of our technology stack.
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary border-primary"
                  onClick={() => setShowGlossary(!showGlossary)}
                >
                  <Info className="h-4 w-4 mr-2" />
                  {showGlossary ? "Hide Glossary" : "View Tech Glossary"}
                </Button>
                <Button variant="outline" size="sm" className="text-primary border-primary">
                  <Download className="h-4 w-4 mr-2" />
                  Download Whitepaper
                </Button>
              </div>
            </div>

            {/* Tech Glossary */}
            {showGlossary && (
              <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-primary mb-4">Technology Glossary</h3>
                <Accordion type="single" collapsible className="w-full">
                  {glossaryTerms.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-primary hover:text-[#00CC66]">{item.term}</AccordionTrigger>
                      <AccordionContent className="text-gray-600">{item.definition}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Future Roadmap Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#00CC66]/10 text-[#00CC66] hover:bg-[#00CC66]/20">Looking Ahead</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
              Future Innovation Roadmap
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our vision for the next generation of financial inclusion technologies.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute top-0 bottom-0 left-16 md:left-1/2 w-1 bg-linear-to-b from-primary to-[#00CC66] transform md:-translate-x-1/2"></div>

            <div className="space-y-12">
              <div className="relative flex flex-col md:flex-row items-start">
                <div className="flex items-center mb-4 md:mb-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="md:w-5/12 md:pr-16 md:text-right ml-16 md:ml-0">
                  <h3 className="text-xl font-bold text-primary mb-2">Q3 2024</h3>
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-primary mb-2">Advanced AI Credit Scoring 2.0</h4>
                      <p className="text-gray-600">
                        Next-generation AI models with improved accuracy and expanded alternative data sources.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:w-5/12 md:pl-16 hidden md:block"></div>
              </div>

              <div className="relative flex flex-col md:flex-row items-start">
                <div className="flex items-center mb-4 md:mb-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="md:w-5/12 md:pr-16 hidden md:block"></div>

                <div className="md:w-5/12 md:pl-16 ml-16 md:ml-0">
                  <h3 className="text-xl font-bold text-primary mb-2">Q1 2025</h3>
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-primary mb-2">Quantum-Resistant Blockchain</h4>
                      <p className="text-gray-600">
                        Upgraded blockchain infrastructure with quantum-resistant cryptography for future-proof
                        security.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="relative flex flex-col md:flex-row items-start">
                <div className="flex items-center mb-4 md:mb-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="md:w-5/12 md:pr-16 md:text-right ml-16 md:ml-0">
                  <h3 className="text-xl font-bold text-primary mb-2">Q3 2025</h3>
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-primary mb-2">Decentralized Identity Platform</h4>
                      <p className="text-gray-600">
                        User-controlled digital identity system for secure, private, and portable financial credentials.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:w-5/12 md:pl-16 hidden md:block"></div>
              </div>

              <div className="relative flex flex-col md:flex-row items-start">
                <div className="flex items-center mb-4 md:mb-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10">
                  <div className="w-12 h-12 rounded-full bg-[#00CC66] flex items-center justify-center shadow-lg">
                    <LineChart className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="md:w-5/12 md:pr-16 hidden md:block"></div>

                <div className="md:w-5/12 md:pl-16 ml-16 md:ml-0">
                  <h3 className="text-xl font-bold text-primary mb-2">Q2 2026</h3>
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-primary mb-2">Global Climate Finance Network</h4>
                      <p className="text-gray-600">
                        Expanded climate finance platform connecting investors and projects across 50+ countries.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-linear-to-br from-[#002244] via-primary to-[#004488] text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20">Join the Innovation</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-6">
                Ready to Experience the Future of Finance?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Join thousands of users who are already benefiting from our innovative financial solutions. Request a
                demo to see our technology in action.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-[#00CC66] hover:bg-[#00BB55] text-white">
                  Request a Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Download Whitepaper
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-[300px] md:h-[400px] perspective-1000">
                <div className="absolute inset-0 transform-style-3d rotate-y-12 rotate-x-12 animate-float-slow">
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-xs rounded-2xl border border-white/20 shadow-2xl"></div>
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Innovation Newsletter</h3>
                      <p className="text-white/80 mb-6">
                        Stay updated with our latest technological breakthroughs and innovation stories.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-hidden focus:ring-2 focus:ring-[#00CC66]"
                        />
                        <Button className="bg-[#00CC66] hover:bg-[#00BB55] text-white">Subscribe</Button>
                      </div>
                      <p className="text-xs text-white/60">
                        By subscribing, you agree to receive updates about our innovations. You can unsubscribe at any
                        time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotateY(12deg) rotateX(12deg);
          }
          50% {
            transform: translateY(-10px) rotateY(12deg) rotateX(12deg);
          }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .rotate-y-12 {
          transform: rotateY(12deg);
        }
        
        .rotate-x-12 {
          transform: rotateX(12deg);
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .bg-grid-white {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23FFFFFF' fillOpacity='0.1'%3E%3Crect x='0' y='0' width='50' height='50' /%3E%3Crect x='50' y='50' width='50' height='50' /%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  )
}

