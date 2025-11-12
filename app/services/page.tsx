"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Coins,
  LineChart,
  Shield,
  Landmark,
  Check,
  ChevronRight,
  Users,
  BarChart3,
  Zap,
  Bitcoin,
  Building,
  Wallet,
  Percent,
  Calendar,
  Clock,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Globe,
  Lightbulb,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"

export default function ServicesPage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [loanAmount, setLoanAmount] = useState(5000)
  const [loanTerm, setLoanTerm] = useState(12)
  const [cryptoAmount, setCryptoAmount] = useState(1)
  const [cryptoType, setCryptoType] = useState("BTC")
  const [progress, setProgress] = useState(13)
  const [activeServiceCard, setActiveServiceCard] = useState(0)

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  // Calculate loan details
  const calculateMonthlyPayment = () => {
    const interestRate = 0.059 / 12 // 5.9% APR
    const numberOfPayments = loanTerm
    const principal = loanAmount

    const monthlyPayment =
      (principal * interestRate * Math.pow(1 + interestRate, numberOfPayments)) /
      (Math.pow(1 + interestRate, numberOfPayments) - 1)

    return monthlyPayment.toFixed(2)
  }

  // Calculate crypto loan details
  const calculateCryptoLoan = () => {
    const cryptoPrices: Record<string, number> = {
      BTC: 65000,
      ETH: 3500,
      USDC: 1,
    }

    const loanToValueRatio = 0.7 // 70% LTV
    const price = cryptoPrices[cryptoType as keyof typeof cryptoPrices] || 1
    const collateralValue = cryptoAmount * price
    const maxLoanAmount = collateralValue * loanToValueRatio

    return {
      collateralValue: collateralValue.toFixed(2),
      maxLoanAmount: maxLoanAmount.toFixed(2),
    }
  }

  const cryptoLoanDetails = calculateCryptoLoan()

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-950">
      {/* Hero Section with Animated Background */}
      <section className="relative py-12 md:py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#003366] dark:bg-gray-900 z-0">
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-[#00CC66] dark:bg-emerald-500"
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 15}s infinite ease-in-out`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.5,
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-grid-white bg-grid-8 opacity-10"></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center"
          >
            <motion.div variants={fadeIn} className="text-white dark:text-white">
              <Badge className="mb-4 bg-[#00CC66] hover:bg-[#00CC66]/80 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700">
                Blockchain-Powered Finance
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 md:mb-6 leading-tight">
                Financial Services <span className="text-[#00CC66] dark:text-emerald-400">Reimagined</span>
              </h1>
              <p className="text-white/80 dark:text-white/90 text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-lg">
                Cutting-edge financial solutions powered by blockchain technology, designed to bring economic
                opportunity to everyone.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#00CC66] hover:bg-[#00CC66]/80 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  className="border-2 border-white text-white bg-transparent hover:bg-white/20 dark:border-white dark:text-white dark:hover:bg-white/20"
                >
                  Book a Demo
                </Button>
              </div>
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden"
                    >
                      <Image
                        src={`/placeholder.svg?height=100&width=100`}
                        alt={`User ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-4 h-4 text-yellow-300 ms-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                    <p className="ml-2 text-sm font-medium text-white dark:text-white">4.8 out of 5</p>
                  </div>
                  <p className="text-sm text-white/80 dark:text-white/80">
                    Trusted by <span className="font-bold">25,000+</span> users
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeIn} className="relative perspective-1000 mt-6 lg:mt-0">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-[#00CC66] dark:bg-emerald-600 text-white dark:text-white px-3 py-1 rounded-full text-sm font-medium z-20">
                Blockchain Secured
              </div>
              <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-lg overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 preserve-3d rotate-y-[8deg] group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/90 to-[#003366]/70 dark:from-gray-900/90 dark:to-gray-800/70 z-10 group-hover:opacity-0 transition-opacity duration-300"></div>
                <Image
                  src="/placeholder.svg?height=800&width=600"
                  alt="Financial Services"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-white/20 max-w-xs">
                    <div className="flex items-center mb-2 sm:mb-4">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-[#00CC66] dark:text-emerald-400" />
                      <h3 className="ml-2 text-lg sm:text-xl font-bold text-white dark:text-white">
                        Secure & Transparent
                      </h3>
                    </div>
                    <p className="text-white/90 dark:text-white/90 text-xs sm:text-sm">
                      All transactions are secured by blockchain technology, ensuring transparency and trust for all
                      users.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Tabs Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-[#003366] hover:bg-[#003366]/80 text-white dark:bg-blue-900 dark:hover:bg-blue-800">
              Our Offerings
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-[#003366] dark:text-white mb-4">
              Comprehensive Financial Solutions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 md:text-lg max-w-2xl mx-auto">
              Explore our range of innovative services designed to meet your financial needs
            </p>
          </motion.div>

          <Tabs defaultValue="digital-loans" className="w-full max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger
                value="digital-loans"
                className="data-[state=active]:bg-[#003366] data-[state=active]:text-white dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-white dark:text-gray-200 px-2 py-2 text-xs sm:text-sm md:text-base"
              >
                <Coins className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap">Digital Loans</span>
              </TabsTrigger>
              <TabsTrigger
                value="village-banking"
                className="data-[state=active]:bg-[#003366] data-[state=active]:text-white dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-white dark:text-gray-200 px-2 py-2 text-xs sm:text-sm md:text-base"
              >
                <Landmark className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap">Village Banking</span>
              </TabsTrigger>
            </TabsList>

            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <TabsContent value="digital-loans" className="mt-0">
                <div className="space-y-8">
                  {/* Normal Loans */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                  >
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-[#00CC66]/10 dark:bg-emerald-900/30">
                          <Wallet className="h-6 w-6 text-[#00CC66] dark:text-emerald-400" />
                        </div>
                        <h3 className="ml-2 text-2xl font-bold text-[#003366] dark:text-white">Loans</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Our AI-powered lending platform provides quick access to capital with flexible terms and
                        competitive rates, no collateral required.
                      </p>
                      <ul className="space-y-3">
                        {[
                          "Non-collateralized borrowing enabled by AI credit scoring",
                          "Flexible repayment terms tailored to your income",
                          "Instant approval and disbursement",
                          "No hidden fees or penalties",
                          "Build your credit history with each repayment",
                        ].map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-[#00CC66] dark:text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-800 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Interactive Loan Calculator */}
                      <div className="mt-6 md:mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 className="text-base md:text-lg font-semibold text-[#003366] dark:text-white mb-3 md:mb-4">
                          Loan Calculator
                        </h4>
                        <div className="space-y-3 md:space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                Loan Amount
                              </label>
                              <span className="text-sm font-semibold text-[#003366] dark:text-white">
                                K{loanAmount.toLocaleString()}
                              </span>
                            </div>
                            <Slider
                              value={[loanAmount]}
                              min={100}
                              max={10000}
                              step={100}
                              onValueChange={(value) => setLoanAmount(value[0])}
                              className="dark:bg-gray-700"
                            />
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400">K100</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">K10,000</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                Loan Term
                              </label>
                              <span className="text-sm font-semibold text-[#003366] dark:text-white">
                                {loanTerm} months
                              </span>
                            </div>
                            <Slider
                              value={[loanTerm]}
                              min={3}
                              max={36}
                              step={1}
                              onValueChange={(value) => setLoanTerm(value[0])}
                              className="dark:bg-gray-700"
                            />
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400">3 mo</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">36 mo</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Payment</p>
                              <p className="text-lg md:text-xl font-bold text-[#003366] dark:text-white">
                                K{calculateMonthlyPayment()}
                              </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Interest Rate</p>
                              <p className="text-lg md:text-xl font-bold text-[#003366] dark:text-white">5.9% APR</p>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                            Total repayment:{" "}
                            <span className="font-medium">
                              K{(Number.parseFloat(calculateMonthlyPayment()) * loanTerm).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button className="mt-6 bg-[#003366] hover:bg-[#003366]/80 dark:bg-blue-900 dark:hover:bg-blue-800">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#003366]/80 dark:to-gray-900/80 z-10"></div>
                      <Image
                                              src="/digital.jpg"
                        alt="Normal Loans"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">Application Progress</span>
                          <span className="text-white text-sm">{progress}%</span>
                        </div>
                        <Progress
                          value={progress}
                          className="h-2 bg-white/20"
                          indicatorClassName="bg-[#00CC66] dark:bg-emerald-500"
                        />
                        <div className="flex justify-between mt-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-white mr-1" />
                            <span className="text-white text-sm">5 min approval</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-white mr-1" />
                            <span className="text-white text-sm">Same-day funding</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                                  {/* Divider */}
                                  {/* Crypto Loans */}

                  {/*<div className="border-t border-gray-200 dark:border-gray-700 my-12"></div>*/}

                  
                  {/*<motion.div*/}
                  {/*  initial={{ opacity: 0 }}*/}
                  {/*  animate={{ opacity: 1 }}*/}
                  {/*  transition={{ duration: 0.5, delay: 0.2 }}*/}
                  {/*  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"*/}
                  {/*>*/}
                  {/*  <div className="md:order-2">*/}
                  {/*    <div className="flex items-center mb-4">*/}
                  {/*      <div className="p-2 rounded-full bg-[#00CC66]/10 dark:bg-emerald-900/30">*/}
                  {/*        <Bitcoin className="h-6 w-6 text-[#00CC66] dark:text-emerald-400" />*/}
                  {/*      </div>*/}
                  {/*      <h3 className="ml-2 text-2xl font-bold text-[#003366] dark:text-white">Crypto Loans</h3>*/}
                  {/*    </div>*/}
                  {/*    <p className="text-gray-600 dark:text-gray-300 mb-6">*/}
                  {/*      Leverage your cryptocurrency holdings to access instant liquidity without selling your assets,*/}
                  {/*      with competitive rates and flexible terms.*/}
                  {/*    </p>*/}
                  {/*    <ul className="space-y-3">*/}
                  {/*      {[*/}
                  {/*        "Use your crypto as collateral for instant loans",*/}
                  {/*        "No credit checks required - your crypto is your credit",*/}
                  {/*        "Maintain ownership of your crypto assets",*/}
                  {/*        "Benefit from potential crypto appreciation",*/}
                  {/*        "Multiple cryptocurrency options supported",*/}
                  {/*      ].map((feature, index) => (*/}
                  {/*        <li key={index} className="flex items-start">*/}
                  {/*          <Check className="h-5 w-5 text-[#00CC66] dark:text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />*/}
                  {/*          <span className="dark:text-gray-300">{feature}</span>*/}
                  {/*        </li>*/}
                  {/*      ))}*/}
                  {/*    </ul>*/}

                  {/*    */}{/* Interactive Crypto Loan Calculator */}
                  {/*    <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">*/}
                  {/*      <h4 className="text-lg font-semibold text-[#003366] dark:text-white mb-4">*/}
                  {/*        Crypto Loan Calculator*/}
                  {/*      </h4>*/}
                  {/*      <div className="space-y-4">*/}
                  {/*        <div className="flex items-center gap-4">*/}
                  {/*          <div className="flex-1">*/}
                  {/*            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">*/}
                  {/*              Crypto Amount: {cryptoAmount} {cryptoType}*/}
                  {/*            </label>*/}
                  {/*            <Slider*/}
                  {/*              value={[cryptoAmount]}*/}
                  {/*              min={0.1}*/}
                  {/*              max={10}*/}
                  {/*              step={0.1}*/}
                  {/*              onValueChange={(value) => setCryptoAmount(value[0])}*/}
                  {/*              className="dark:bg-gray-700"*/}
                  {/*            />*/}
                  {/*          </div>*/}
                  {/*          <div className="w-24">*/}
                  {/*            <select*/}
                  {/*              value={cryptoType}*/}
                  {/*              onChange={(e) => setCryptoType(e.target.value)}*/}
                  {/*              className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3"*/}
                  {/*            >*/}
                  {/*              <option value="BTC">BTC</option>*/}
                  {/*              <option value="ETH">ETH</option>*/}
                  {/*              <option value="USDC">USDC</option>*/}
                  {/*            </select>*/}
                  {/*          </div>*/}
                  {/*        </div>*/}
                  {/*        <div className="grid grid-cols-2 gap-4 mt-4">*/}
                  {/*          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">*/}
                  {/*            <p className="text-xs text-gray-500 dark:text-gray-400">Collateral Value</p>*/}
                  {/*            <p className="text-xl font-bold text-[#003366] dark:text-white">*/}
                  {/*              ${cryptoLoanDetails.collateralValue}*/}
                  {/*            </p>*/}
                  {/*          </div>*/}
                  {/*          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">*/}
                  {/*            <p className="text-xs text-gray-500 dark:text-gray-400">Max Loan Amount (70% LTV)</p>*/}
                  {/*            <p className="text-xl font-bold text-[#003366] dark:text-white">*/}
                  {/*              ${cryptoLoanDetails.maxLoanAmount}*/}
                  {/*            </p>*/}
                  {/*          </div>*/}
                  {/*        </div>*/}
                  {/*      </div>*/}
                  {/*    </div>*/}

                  {/*    <Button className="mt-6 bg-[#003366] hover:bg-[#003366]/80 dark:bg-blue-900 dark:hover:bg-blue-800">*/}
                  {/*      Get Crypto Loan*/}
                  {/*      <ArrowRight className="ml-2 h-4 w-4" />*/}
                  {/*    </Button>*/}
                  {/*  </div>*/}
                  {/*  <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg md:order-1">*/}
                  {/*    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#003366]/80 dark:to-gray-900/80 z-10"></div>*/}
                  {/*    <Image*/}
                  {/*      src="/placeholder.svg?height=800&width=600"*/}
                  {/*      alt="Crypto Loans"*/}
                  {/*      fill*/}
                  {/*      className="object-cover"*/}
                  {/*    />*/}
                  {/*    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">*/}
                  {/*      <div className="flex flex-wrap gap-2 mb-4">*/}
                  {/*        {["Bitcoin", "Ethereum", "USDC", "Solana", "Polkadot"].map((crypto, index) => (*/}
                  {/*          <Badge key={index} variant="outline" className="bg-white/10 text-white border-white/20">*/}
                  {/*            {crypto}*/}
                  {/*          </Badge>*/}
                  {/*        ))}*/}
                  {/*      </div>*/}
                  {/*      <div className="flex justify-between">*/}
                  {/*        <div className="flex items-center">*/}
                  {/*          <Lock className="h-4 w-4 text-white mr-1" />*/}
                  {/*          <span className="text-white text-sm">Secure custody</span>*/}
                  {/*        </div>*/}
                  {/*        <div className="flex items-center">*/}
                  {/*          <Percent className="h-4 w-4 text-white mr-1" />*/}
                  {/*          <span className="text-white text-sm">70% LTV ratio</span>*/}
                  {/*        </div>*/}
                  {/*      </div>*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*</motion.div>*/}
                </div>
              </TabsContent>

              <TabsContent value="village-banking" className="mt-0">
                <div className="space-y-8">
                  {/* Individual Loans */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                  >
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-[#00CC66]/10 dark:bg-emerald-900/30">
                          <Users className="h-6 w-6 text-[#00CC66] dark:text-emerald-400" />
                        </div>
                        <h3 className="ml-2 text-2xl font-bold text-[#003366] dark:text-white">Individual Loans</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Join a village banking group on our blockchain platform to access community-powered loans with
                        social accountability and shared growth.
                      </p>
                      <ul className="space-y-3">
                        {[
                          "Join or create a village banking group",
                          "Access loans backed by your community",
                          "Build credit history through group participation",
                          "Transparent terms recorded on blockchain",
                          "Lower interest rates through group guarantees",
                        ].map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-[#00CC66] dark:text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-800 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Group Status Card */}
                      <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 className="text-lg font-semibold text-[#003366] dark:text-white mb-4">
                          Village Banking Group Status
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Active Groups Near You</span>
                            <Badge className="bg-[#00CC66] dark:bg-emerald-600">12 Groups</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Average Group Size</span>
                            <span className="font-medium text-[#003366] dark:text-white">15 members</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Average Loan Size</span>
                            <span className="font-medium text-[#003366] dark:text-white">K2,500</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Next Group Formation</span>
                            <span className="font-medium text-[#003366] dark:text-white">May 15, 2025</span>
                          </div>
                        </div>
                      </div>

                      <Button className="mt-6 bg-[#003366] hover:bg-[#003366]/80 dark:bg-blue-900 dark:hover:bg-blue-800">
                        Join a Group
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#003366]/80 dark:to-gray-900/80 z-10"></div>
                      <Image
                        src="/village.jpg"
                        alt="Individual Loans"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                        <h4 className="text-white font-semibold mb-2">Active Village Banking Groups</h4>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {["Sunrise Savers", "Unity Circle", "Growth Collective", "Future Fund"].map(
                            (group, index) => (
                              <div
                                key={index}
                                className="bg-white/10 backdrop-blur-sm rounded-md p-2 flex items-center"
                              >
                                <div className="w-6 h-6 rounded-full bg-[#00CC66] dark:bg-emerald-500 flex items-center justify-center text-white text-xs mr-2">
                                  {index + 1}
                                </div>
                                <span className="text-white text-sm">{group}</span>
                              </div>
                            ),
                          )}
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-white mr-1" />
                            <span className="text-white text-sm">Community-backed</span>
                          </div>
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-white mr-1" />
                            <span className="text-white text-sm">Blockchain secured</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                                  {/* Divider */}
                                  {/* Institution Loans */}
                  {/*<div className="border-t border-gray-200 dark:border-gray-700 my-12"></div>*/}

                 
                  {/*<motion.div*/}
                  {/*  initial={{ opacity: 0 }}*/}
                  {/*  animate={{ opacity: 1 }}*/}
                  {/*  transition={{ duration: 0.5, delay: 0.2 }}*/}
                  {/*  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"*/}
                  {/*>*/}
                  {/*  <div className="md:order-2">*/}
                  {/*    <div className="flex items-center mb-4">*/}
                  {/*      <div className="p-2 rounded-full bg-[#00CC66]/10 dark:bg-emerald-900/30">*/}
                  {/*        <Building className="h-6 w-6 text-[#00CC66] dark:text-emerald-400" />*/}
                  {/*      </div>*/}
                  {/*      <h3 className="ml-2 text-2xl font-bold text-[#003366] dark:text-white">Institution Loans</h3>*/}
                  {/*    </div>*/}
                  {/*    <p className="text-gray-600 dark:text-gray-300 mb-6">*/}
                  {/*      Empower your organization with blockchain-based village banking solutions that scale community*/}
                  {/*      finance for cooperatives, NGOs, and businesses.*/}
                  {/*    </p>*/}
                  {/*    <ul className="space-y-3">*/}
                  {/*      {[*/}
                  {/*        "Manage multiple village banking groups",*/}
                  {/*        "Automated loan disbursement and collection",*/}
                  {/*        "Real-time reporting and analytics",*/}
                  {/*        "Customizable loan terms for your community",*/}
                  {/*        "Integration with existing financial systems",*/}
                  {/*      ].map((feature, index) => (*/}
                  {/*        <li key={index} className="flex items-start">*/}
                  {/*          <Check className="h-5 w-5 text-[#00CC66] dark:text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />*/}
                  {/*          <span className="dark:text-gray-300">{feature}</span>*/}
                  {/*        </li>*/}
                  {/*      ))}*/}
                  {/*    </ul>*/}

                  {/*    */}{/* Institution Features */}
                  {/*    <div className="mt-8 grid grid-cols-2 gap-4">*/}
                  {/*      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">*/}
                  {/*        <div className="flex items-center mb-2">*/}
                  {/*          <Globe className="h-5 w-5 text-[#00CC66] dark:text-emerald-400 mr-2" />*/}
                  {/*          <h5 className="font-medium text-[#003366] dark:text-white">Global Reach</h5>*/}
                  {/*        </div>*/}
                  {/*        <p className="text-sm text-gray-600 dark:text-gray-300">*/}
                  {/*          Deploy village banking across multiple regions with localized configurations.*/}
                  {/*        </p>*/}
                  {/*      </div>*/}
                  {/*      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">*/}
                  {/*        <div className="flex items-center mb-2">*/}
                  {/*          <LineChart className="h-5 w-5 text-[#00CC66] dark:text-emerald-400 mr-2" />*/}
                  {/*          <h5 className="font-medium text-[#003366] dark:text-white">Advanced Analytics</h5>*/}
                  {/*        </div>*/}
                  {/*        <p className="text-sm text-gray-600 dark:text-gray-300">*/}
                  {/*          Track performance metrics and gain insights into community financial health.*/}
                  {/*        </p>*/}
                  {/*      </div>*/}
                  {/*      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">*/}
                  {/*        <div className="flex items-center mb-2">*/}
                  {/*          <ShieldCheck className="h-5 w-5 text-[#00CC66] dark:text-emerald-400 mr-2" />*/}
                  {/*          <h5 className="font-medium text-[#003366] dark:text-white">Compliance Tools</h5>*/}
                  {/*        </div>*/}
                  {/*        <p className="text-sm text-gray-600 dark:text-gray-300">*/}
                  {/*          Built-in regulatory compliance features for different jurisdictions.*/}
                  {/*        </p>*/}
                  {/*      </div>*/}
                  {/*      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">*/}
                  {/*        <div className="flex items-center mb-2">*/}
                  {/*          <Sparkles className="h-5 w-5 text-[#00CC66] dark:text-emerald-400 mr-2" />*/}
                  {/*          <h5 className="font-medium text-[#003366] dark:text-white">Custom Branding</h5>*/}
                  {/*        </div>*/}
                  {/*        <p className="text-sm text-gray-600 dark:text-gray-300">*/}
                  {/*          White-label solutions with your organization's branding and identity.*/}
                  {/*        </p>*/}
                  {/*      </div>*/}
                  {/*    </div>*/}

                  {/*    <Button className="mt-6 bg-[#003366] hover:bg-[#003366]/80 dark:bg-blue-900 dark:hover:bg-blue-800">*/}
                  {/*      Partner With Us*/}
                  {/*      <ArrowRight className="ml-2 h-4 w-4" />*/}
                  {/*    </Button>*/}
                  {/*  </div>*/}
                  {/*  <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg md:order-1">*/}
                  {/*    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#003366]/80 dark:to-gray-900/80 z-10"></div>*/}
                  {/*    <Image*/}
                  {/*      src="/placeholder.svg?height=800&width=600"*/}
                  {/*      alt="Institution Loans"*/}
                  {/*      fill*/}
                  {/*      className="object-cover"*/}
                  {/*    />*/}
                  {/*    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">*/}
                  {/*      <h4 className="text-white font-semibold mb-2">Partner Organizations</h4>*/}
                  {/*      <div className="grid grid-cols-3 gap-2 mb-4">*/}
                  {/*        {[1, 2, 3, 4, 5, 6].map((org) => (*/}
                  {/*          <div*/}
                  {/*            key={org}*/}
                  {/*            className="bg-white/20 backdrop-blur-sm rounded-md p-2 flex items-center justify-center"*/}
                  {/*          >*/}
                  {/*            <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">*/}
                  {/*              <Building className="h-4 w-4 text-[#003366]" />*/}
                  {/*            </div>*/}
                  {/*          </div>*/}
                  {/*        ))}*/}
                  {/*      </div>*/}
                  {/*      <div className="flex justify-between">*/}
                  {/*        <div className="flex items-center">*/}
                  {/*          <Lightbulb className="h-4 w-4 text-white mr-1" />*/}
                  {/*          <span className="text-white text-sm">Custom solutions</span>*/}
                  {/*        </div>*/}
                  {/*        <div className="flex items-center">*/}
                  {/*          <DollarSign className="h-4 w-4 text-white mr-1" />*/}
                  {/*          <span className="text-white text-sm">Scale with confidence</span>*/}
                  {/*        </div>*/}
                  {/*      </div>*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*</motion.div>*/}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Mobile Service Cards - Swipeable on mobile */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-950 lg:hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <Badge className="mb-4 bg-[#003366] hover:bg-[#003366]/80 text-white dark:bg-blue-900 dark:hover:bg-blue-800">
              Quick Compare
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter text-[#003366] dark:text-white mb-2">
              Swipe to Compare Services
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm max-w-2xl mx-auto">
              Swipe left and right to explore our different financial services
            </p>
          </motion.div>

          <div className="overflow-x-auto pb-4 -mx-4 px-4 flex snap-x snap-mandatory gap-4 scrollbar-hide">
            {[
              {
                title: "Loans",
                icon: <Wallet className="h-6 w-6 text-[#00CC66] dark:text-emerald-400" />,
                description: "Quick access to capital with AI-powered credit scoring and no collateral required.",
                features: ["Non-collateralized", "Flexible terms", "Instant approval", "No hidden fees"],
                cta: "Apply Now",
                highlight: "From 5.9% APR",
              },
              //{
              //  title: "Crypto Loans",
              //  icon: <Bitcoin className="h-6 w-6 text-[#00CC66] dark:text-emerald-400" />,
              //  description: "Use your cryptocurrency as collateral without selling your digital assets.",
              //  features: ["No credit checks", "Keep your crypto", "Multiple coins supported", "Low interest rates"],
              //  cta: "Get Crypto Loan",
              //  highlight: "Up to 70% LTV",
              //},
              {
                title: "Village Banking",
                icon: <Users className="h-6 w-6 text-[#00CC66] dark:text-emerald-400" />,
                description: "Join a community-powered banking group with social accountability and shared growth.",
                features: ["Community support", "Lower rates", "Build credit history", "Transparent terms"],
                cta: "Join a Group",
                highlight: "4.5% APR",
              },
              //{
              //  title: "Institution Banking",
              //  icon: <Building className="h-6 w-6 text-[#00CC66] dark:text-emerald-400" />,
              //  description: "Empower your organization with blockchain-based village banking solutions.",
              //  features: ["Manage multiple groups", "Automated processes", "Real-time analytics", "Custom terms"],
              //  cta: "Partner With Us",
              //  highlight: "500+ Organizations",
              //},
            ].map((service, index) => (
              <div key={index} className="min-w-[280px] w-[85%] max-w-[340px] snap-center">
                <Card className="h-full border-none shadow-lg dark:bg-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-full bg-[#00CC66]/10 dark:bg-emerald-900/30">{service.icon}</div>
                      <Badge className="bg-[#003366] dark:bg-blue-900">{service.highlight}</Badge>
                    </div>
                    <CardTitle className="text-[#003366] dark:text-white text-xl">{service.title}</CardTitle>
                    <CardDescription className="dark:text-gray-300">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-4 w-4 text-[#00CC66] dark:text-emerald-400 mr-2 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-[#003366] hover:bg-[#003366]/80 dark:bg-blue-900 dark:hover:bg-blue-800">
                      {service.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-1">
            {[0, 1, 2, 3].map((dot) => (
              <div
                key={dot}
                className={`h-1.5 rounded-full ${dot === activeServiceCard ? "w-6 bg-[#00CC66] dark:bg-emerald-500" : "w-1.5 bg-gray-300 dark:bg-gray-700"}`}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Comparison Table */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-[#003366] hover:bg-[#003366]/80 text-white dark:bg-blue-900 dark:hover:bg-blue-800">
              Compare Options
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-[#003366] dark:text-white mb-4">
              Find the Right Service for You
            </h2>
            <p className="text-gray-600 dark:text-gray-300 md:text-lg max-w-2xl mx-auto">
              Compare our services to find the perfect fit for your financial needs
            </p>
          </motion.div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle p-4 sm:p-0">
              <div className="overflow-hidden rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  <thead className="bg-[#003366] dark:bg-blue-900 text-white">
                    <tr>
                      <th scope="col" className="py-3 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium">
                        Service
                      </th>
                      <th scope="col" className="py-3 px-3 sm:px-6 text-center text-xs sm:text-sm font-medium">
                        Ideal For
                      </th>
                      <th scope="col" className="py-3 px-3 sm:px-6 text-center text-xs sm:text-sm font-medium">
                        Key Features
                      </th>
                      <th scope="col" className="py-3 px-3 sm:px-6 text-center text-xs sm:text-sm font-medium">
                        Requirements
                      </th>
                      <th scope="col" className="py-3 px-3 sm:px-6 text-center text-xs sm:text-sm font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      {
                        service: "Normal Loans",
                        icon: <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-[#00CC66] dark:text-emerald-400" />,
                        idealFor: "Individuals and small businesses needing quick capital",
                        features: ["AI credit scoring", "Flexible terms", "No collateral needed"],
                        requirements: "Valid ID, 3+ months of transaction history",
                        action: "Apply Now",
                      },
                      {
                        service: "Crypto Loans",
                        icon: <Bitcoin className="h-4 w-4 sm:h-5 sm:w-5 text-[#00CC66] dark:text-emerald-400" />,
                        idealFor: "Crypto holders who need liquidity without selling assets",
                        features: ["Use crypto as collateral", "No credit checks", "Keep ownership of assets"],
                        requirements: "Cryptocurrency holdings, wallet connection",
                        action: "Get Loan",
                      },
                      //{
                      //  service: "Individual Village Banking",
                      //  icon: <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#00CC66] dark:text-emerald-400" />,
                      //  idealFor: "Community members seeking group-backed financing",
                      //  features: ["Community support", "Lower rates", "Social accountability"],
                      //  requirements: "Join a group or form a new group of 5-20 members",
                      //  action: "Join Group",
                      //},
                      {
                        service: "Institution Village Banking",
                        icon: <Building className="h-4 w-4 sm:h-5 sm:w-5 text-[#00CC66] dark:text-emerald-400" />,
                        idealFor: "Organizations managing community finance programs",
                        features: ["Manage multiple groups", "Automated processes", "Custom reporting"],
                        requirements: "Registered organization, implementation meeting",
                        action: "Partner",
                      },
                    ].map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}
                      >
                        <td className="py-3 px-3 sm:px-6 text-xs sm:text-sm border-b border-gray-100 dark:border-gray-600">
                          <div className="flex items-center">
                            {item.icon}
                            <span className="ml-1 sm:ml-2 font-medium text-[#003366] dark:text-white">
                              {item.service}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 sm:px-6 text-center text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          {item.idealFor}
                        </td>
                        <td className="py-3 px-3 sm:px-6">
                          <ul className="text-xs sm:text-sm">
                            {item.features.map((feature, i) => (
                              <li key={i} className="flex items-center justify-center mb-1">
                                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-[#00CC66] dark:text-emerald-400 mr-1 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 px-3 sm:px-6 text-center text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          {item.requirements}
                        </td>
                        <td className="py-3 px-3 sm:px-6 text-center">
                          <Button
                            size="sm"
                            className="bg-[#003366] hover:bg-[#003366]/80 dark:bg-blue-900 dark:hover:bg-blue-800 text-xs px-2 py-1 h-auto"
                          >
                            {item.action}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <Badge className="mb-4 bg-[#003366] hover:bg-[#003366]/80 text-white dark:bg-blue-900 dark:hover:bg-blue-800">
              Process
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-[#003366] dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-lg max-w-2xl mx-auto">
              Our blockchain-powered approach makes accessing financial services simple and transparent
            </p>
          </motion.div>

          <div className="relative">
            {/* Progress Line - Only visible on desktop */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

            <div className="space-y-8 md:space-y-0 relative">
              {[
                {
                  step: "01",
                  title: "Create Your Profile",
                  description:
                    "Sign up and complete your profile with basic information. Our AI system will begin building your financial identity on the blockchain.",
                  icon: <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />,
                  image: "/placeholder.svg?height=400&width=600",
                },
                {
                  step: "02",
                  title: "Choose Your Service",
                  description:
                    "Select from digital loans or village banking options based on your needs. Each service is powered by secure blockchain technology.",
                  icon: <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-white" />,
                  image: "/placeholder.svg?height=400&width=600",
                },
                {
                  step: "03",
                  title: "Access Funds & Grow",
                  description:
                    "Receive funds quickly and securely. As you use our services, your blockchain credit profile improves, unlocking better rates and higher limits.",
                  icon: <Zap className="h-6 w-6 md:h-8 md:w-8 text-white" />,
                  image: "/placeholder.svg?height=400&width=600",
                },
              ].map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  key={index}
                  className={`md:grid md:grid-cols-2 gap-4 md:gap-8 items-center ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className={`relative z-10 ${index % 2 !== 0 ? "md:text-right md:order-2" : "md:order-1"}`}>
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-md relative">
                      <div className="absolute -top-4 md:-top-5 left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#00CC66] dark:bg-emerald-600 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div className="absolute -left-2 md:-left-4 top-0 text-4xl md:text-6xl font-bold text-[#00CC66]/10 dark:text-emerald-500/10">
                        {item.step}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-[#003366] dark:text-white mb-2 md:mb-4 mt-4">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{item.description}</p>
                      <Button
                        variant="link"
                        className="text-[#00CC66] dark:text-emerald-400 p-0 mt-2 md:mt-4 hover:text-[#00CC66]/80 dark:hover:text-emerald-300 text-sm"
                      >
                        Learn more <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                  <div className={`relative z-10 mt-4 md:mt-0 ${index % 2 !== 0 ? "md:order-1" : "md:order-2"}`}>
                    <div className="relative h-[180px] sm:h-[220px] md:h-[250px] lg:h-[300px] rounded-lg overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-105">
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/60 to-transparent dark:from-gray-900/60 flex items-center">
                        <div className="p-4 md:p-6">
                          <Badge className="mb-2 bg-white/20 text-white border-white/10 text-xs">
                            Step {index + 1}
                          </Badge>
                          <h4 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
                            {item.title}
                          </h4>
                          <p className="text-white/80 text-xs sm:text-sm max-w-xs hidden sm:block">
                            {item.description.split(".")[0]}.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-[#003366] hover:bg-[#003366]/80 text-white dark:bg-blue-900 dark:hover:bg-blue-800">
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-[#003366] dark:text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 dark:text-gray-300 md:text-lg max-w-2xl mx-auto">
              Real stories from people and businesses who have transformed their financial lives with our services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Small Business Owner",
                image: "/placeholder.svg?height=200&width=200",
                quote:
                  "The digital loan process was incredibly fast and straightforward. I was able to expand my business without the usual hassle of traditional bank loans.",
                service: "Normal Loans",
              },
              {
                name: "Michael Chen",
                role: "Crypto Investor",
                image: "/placeholder.svg?height=200&width=200",
                quote:
                  "Being able to use my crypto as collateral without selling it was a game-changer. I accessed the cash I needed while my crypto assets continued to grow.",
                service: "Crypto Loans",
              },
              {
                name: "Amara Okafor",
                role: "Village Banking Group Leader",
                image: "/placeholder.svg?height=200&width=200",
                quote:
                  "Our community has thrived with the village banking platform. The blockchain technology ensures transparency and trust among all members.",
                service: "Village Banking",
              },
            ].map((testimonial, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index}
              >
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-[#003366] dark:text-white text-base sm:text-lg">
                          {testimonial.name}
                        </CardTitle>
                        <CardDescription className="dark:text-gray-400 text-xs sm:text-sm">
                          {testimonial.role}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 italic text-sm sm:text-base">
                      "{testimonial.quote}"
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Badge
                      variant="outline"
                      className="border-[#00CC66] text-[#00CC66] dark:border-emerald-500 dark:text-emerald-400"
                    >
                      {testimonial.service}
                    </Badge>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/testimonials">
              <Button
                variant="outline"
                className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-white"
              >
                View All Success Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

      {/* Enhanced FAQ Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-[#003366] hover:bg-[#003366]/80 text-white dark:bg-blue-900 dark:hover:bg-blue-800">
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-[#003366] dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 md:text-lg max-w-2xl mx-auto">
              Find answers to common questions about our services and how they work
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "How does blockchain improve village banking?",
                  answer:
                    "Blockchain technology provides transparency, security, and immutability to village banking operations. All transactions are recorded on a distributed ledger that all members can verify, eliminating disputes and building trust. Smart contracts automate loan disbursements and repayments, reducing administrative overhead and ensuring fairness.",
                },
                {
                  question: "What cryptocurrencies can I use as collateral?",
                  answer:
                    "We currently accept Bitcoin (BTC), Ethereum (ETH), and several major stablecoins as collateral for crypto loans. Our platform continuously evaluates market conditions to ensure competitive loan-to-value ratios while protecting both borrowers and lenders from extreme volatility.",
                },
                {
                  question: "How are interest rates determined?",
                  answer:
                    "Our interest rates are determined by several factors including your credit profile, loan type, collateral (if applicable), and current market conditions. For village banking, rates are often lower due to the community guarantee system. We're transparent about our rates and you'll always know the exact rate before committing.",
                },
              ].map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <AccordionTrigger className="text-[#003366] dark:text-white font-medium text-left text-sm sm:text-base py-3">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300 text-sm">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "How do I join a village banking group?",
                  answer:
                    "You can join an existing group through our platform by browsing available groups in your area or by receiving an invitation from a current member. Alternatively, you can start your own group by inviting 4-19 other members to join. Our platform guides you through the entire setup process, including establishing group rules and contribution schedules.",
                },
                {
                  question: "What happens if I can't repay my loan on time?",
                  answer:
                    "We offer flexible repayment options and work with you to adjust your payment schedule. For village banking loans, your group may have specific policies about late payments. For crypto-collateralized loans, you'll receive notifications as you approach collateral thresholds. Contact our support team as soon as you anticipate any difficulty making a payment.",
                },
                {
                  question: "Is my data secure on the blockchain?",
                  answer:
                    "Yes, we use advanced encryption and privacy-preserving technologies to ensure your personal and financial data remains secure. While transaction records are stored on the blockchain for transparency and verification, personal identifying information is kept off-chain and protected by industry-leading security protocols.",
                },
              ].map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index + 3}`}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <AccordionTrigger className="text-[#003366] dark:text-white font-medium text-left text-sm sm:text-base py-3">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300 text-sm">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">Still have questions? We're here to help.</p>
            <Link href="/contact">
              <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-900 dark:hover:bg-blue-800">
                Contact Our Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-[#003366] dark:bg-gray-900 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter mb-4 md:mb-6">
                Ready to Transform Your <span className="text-[#00CC66] dark:text-emerald-400">Financial Future?</span>
              </h2>
              <p className="text-white/80 dark:text-white/90 text-sm sm:text-base md:text-lg mb-6 md:mb-8">
                Join thousands of individuals and businesses who have already taken control of their finances with our
                innovative blockchain-powered solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#00CC66] hover:bg-[#00CC66]/80 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#003366] dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900"
                >
                  Schedule a Demo
                </Button>
              </div>
              <div className="mt-6 md:mt-8 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden"
                    >
                      <Image
                        src={`/placeholder.svg?height=100&width=100`}
                        alt={`User ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-white/80 dark:text-white/80">
                  Joined by <span className="font-bold">25,000+</span> users worldwide
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00CC66]/20 to-[#00CC66]/5 dark:from-emerald-900/20 dark:to-emerald-900/5 rounded-lg transform rotate-3"></div>
              <Card className="border-none shadow-xl relative z-10 overflow-hidden dark:bg-gray-800">
                <CardHeader className="bg-[#00CC66]/10 dark:bg-emerald-900/20 pb-2">
                  <CardTitle className="text-[#003366] dark:text-white text-base sm:text-lg">Success Metrics</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="space-y-4 sm:space-y-6">
                    {[
                      { label: "Loans Disbursed", value: "K25M+", growth: "+32% this year" },
                      { label: "Village Banking Groups", value: "1,200+", growth: "across 15 countries" },
                      { label: "User Satisfaction", value: "4.8/5", growth: "based on 12,000+ reviews" },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-700"
                      >
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{stat.label}</p>
                          <p className="text-xl sm:text-2xl font-bold text-[#003366] dark:text-white">{stat.value}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[#00CC66] border-[#00CC66] dark:text-emerald-400 dark:border-emerald-500 text-xs whitespace-nowrap"
                        >
                          {stat.growth}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <div className="relative group">
          <button className="w-14 h-14 rounded-full bg-[#00CC66] dark:bg-emerald-600 text-white shadow-lg flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </button>
          <div className="absolute bottom-full right-0 mb-3 transform scale-0 group-hover:scale-100 transition-transform origin-bottom-right">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 flex flex-col gap-2 min-w-[160px]">
              {[
                { label: "Apply for Loan", icon: <Wallet className="h-4 w-4" /> },
                { label: "Join a Group", icon: <Users className="h-4 w-4" /> },
                { label: "Contact Us", icon: <ArrowRight className="h-4 w-4" /> },
              ].map((item, index) => (
                <button
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm text-[#003366] dark:text-white"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

