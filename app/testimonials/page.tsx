"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Quote,
  Star,
  StarHalf,
  Play,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Award,
  Users,
  TrendingUp,
} from "lucide-react"

// Custom testimonial carousel component
const TestimonialCarousel = ({ testimonials }: { testimonials: any[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextSlide = () => {
    setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1))
  }

  const prevSlide = () => {
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1))
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-xl bg-white shadow-lg border-2 border-primary/10">
        <div className="relative p-8 md:p-12">
          <div className="absolute top-6 right-6 flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < testimonials[activeIndex].rating ? "text-yellow-400" : "text-gray-300"}`}
                fill={i < testimonials[activeIndex].rating ? "currentColor" : "none"}
              />
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#00CC66] shrink-0">
              <Image
                src={testimonials[activeIndex].image || "/placeholder.svg"}
                alt={testimonials[activeIndex].name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <Quote className="h-10 w-10 text-[#00CC66] mb-4 opacity-50" />
              <p className="text-gray-700 italic text-lg md:text-xl mb-6">"{testimonials[activeIndex].quote}"</p>
              <div>
                <h3 className="text-xl font-bold text-primary">{testimonials[activeIndex].name}</h3>
                <p className="text-[#00CC66] font-medium">{testimonials[activeIndex].role}</p>
                <div className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-gray-500 text-sm">{testimonials[activeIndex].location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5"
        >
          <ChevronLeft className="h-5 w-5 text-primary" />
        </Button>
        <div className="flex items-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === activeIndex ? "bg-primary w-6" : "bg-primary/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5"
        >
          <ChevronRight className="h-5 w-5 text-primary" />
        </Button>
      </div>
    </div>
  )
}

// Rating component
const Rating = ({ score }: { score: number }) => {
  const fullStars = Math.floor(score)
  const hasHalfStar = score % 1 >= 0.5

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
      ))}
      {hasHalfStar && <StarHalf className="h-5 w-5 text-yellow-400" fill="currentColor" />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="h-5 w-5 text-gray-300" />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600">{score.toFixed(1)}</span>
    </div>
  )
}

export default function TestimonialsPage() {
  // Featured testimonials data
  const featuredTestimonials = [
    {
      name: "Maria Tembo",
      role: "Small Business Owner",
      quote:
        "Before Pollen AI, I couldn't get a loan to expand my tailoring business. Their AI credit scoring saw my potential where traditional banks couldn't. Now my business has tripled in size!",
      image: "/placeholder.svg?height=400&width=400",
      rating: 5,
      location: "Lusaka, Zambia",
      category: "business",
    },
    {
      name: "John Mulenga",
      role: "Farmer",
      quote:
        "The solar irrigation equipment I financed through Pollen AI has changed everything. My crop yields have increased by 60%, and I'm no longer dependent on unpredictable rainfall.",
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.5,
      location: "Choma, Zambia",
      category: "agriculture",
    },
    {
      name: "Grace Banda",
      role: "Teacher",
      quote:
        "I've been able to save consistently for the first time in my life. The interest rates are better than any bank, and I love knowing my savings are helping others in my community.",
      image: "/placeholder.svg?height=400&width=400",
      rating: 5,
      location: "Kitwe, Zambia",
      category: "savings",
    },
    {
      name: "Samuel Phiri",
      role: "Tech Entrepreneur",
      quote:
        "Pollen AI's business financing helped me launch my tech startup when no one else would take a chance on me. Their understanding of the local market and flexible terms were exactly what I needed.",
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.5,
      location: "Ndola, Zambia",
      category: "business",
    },
    {
      name: "Esther Mwanza",
      role: "Healthcare Worker",
      quote:
        "The emergency loan feature saved me when I had unexpected medical expenses. The process was so simple, and I received the funds within hours. I'm forever grateful.",
      image: "/placeholder.svg?height=400&width=400",
      rating: 5,
      location: "Livingstone, Zambia",
      category: "personal",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Animation */}
      <section className="relative py-20 md:py-28 bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#00CC66]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-20 w-60 h-60 bg-[#00CC66]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-[#00CC66]/15 rounded-full blur-3xl"></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-[#00CC66]/20 text-[#00CC66] border-none px-4 py-1 text-sm">
              Real Stories, Real Impact
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 leading-tight">
              Voices of <span className="text-[#00CC66]">Financial Inclusion</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Discover how Pollen AI is transforming lives and communities through accessible financial services.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-[#00CC66] hover:bg-[#00BB55] text-white">
                Share Your Story
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Watch Video Testimonials
                <Play className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center">
              <ThumbsUp className="h-6 w-6 text-primary mr-2" />
              <span className="text-gray-700 font-medium">4.8/5 Average Rating</span>
            </div>
            <div className="flex items-center">
              <Users className="h-6 w-6 text-primary mr-2" />
              <span className="text-gray-700 font-medium">25,000+ Satisfied Users</span>
            </div>
            <div className="flex items-center">
              <Award className="h-6 w-6 text-primary mr-2" />
              <span className="text-gray-700 font-medium">Financial Inclusion Award 2023</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-primary mr-2" />
              <span className="text-gray-700 font-medium">98% Recommend Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Testimonial Carousel */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-2 bg-primary/10 text-primary border-none px-3 py-1 text-sm">
              Featured Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Hear From Our Community</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Real stories from real people whose lives have been transformed by Pollen AI's financial solutions.
            </p>
          </div>

          <TestimonialCarousel testimonials={featuredTestimonials} />
        </div>
      </section>

      {/* Categorized Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-2 bg-primary/10 text-primary border-none px-3 py-1 text-sm">
              Browse By Category
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
              Success Stories By Service
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Explore testimonials based on the financial services that made the biggest impact.
            </p>
          </div>

          <Tabs defaultValue="business" className="w-full max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-100 p-1">
                <TabsTrigger
                  value="business"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Business Loans
                </TabsTrigger>
                <TabsTrigger
                  value="agriculture"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Agriculture
                </TabsTrigger>
                <TabsTrigger
                  value="savings"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Savings
                </TabsTrigger>
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Personal
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="business" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredTestimonials
                  .filter((t) => t.category === "business")
                  .map((testimonial, index) => (
                    <Card
                      key={index}
                      className="border-2 border-primary/10 hover:border-primary/30 transition-all overflow-hidden"
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                            <Image
                              src={testimonial.image || "/placeholder.svg"}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-6 md:w-2/3">
                            <div className="mb-4">
                              <Rating score={testimonial.rating} />
                            </div>
                            <Quote className="h-6 w-6 text-[#00CC66] mb-2" />
                            <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                            <div>
                              <h3 className="text-lg font-bold text-primary">{testimonial.name}</h3>
                              <p className="text-[#00CC66]">{testimonial.role}</p>
                              <div className="flex items-center mt-1">
                                <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                                <span className="text-gray-500 text-xs">{testimonial.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="agriculture" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredTestimonials
                  .filter((t) => t.category === "agriculture")
                  .map((testimonial, index) => (
                    <Card
                      key={index}
                      className="border-2 border-primary/10 hover:border-primary/30 transition-all overflow-hidden"
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                            <Image
                              src={testimonial.image || "/placeholder.svg"}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-6 md:w-2/3">
                            <div className="mb-4">
                              <Rating score={testimonial.rating} />
                            </div>
                            <Quote className="h-6 w-6 text-[#00CC66] mb-2" />
                            <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                            <div>
                              <h3 className="text-lg font-bold text-primary">{testimonial.name}</h3>
                              <p className="text-[#00CC66]">{testimonial.role}</p>
                              <div className="flex items-center mt-1">
                                <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                                <span className="text-gray-500 text-xs">{testimonial.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="savings" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredTestimonials
                  .filter((t) => t.category === "savings")
                  .map((testimonial, index) => (
                    <Card
                      key={index}
                      className="border-2 border-primary/10 hover:border-primary/30 transition-all overflow-hidden"
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                            <Image
                              src={testimonial.image || "/placeholder.svg"}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-6 md:w-2/3">
                            <div className="mb-4">
                              <Rating score={testimonial.rating} />
                            </div>
                            <Quote className="h-6 w-6 text-[#00CC66] mb-2" />
                            <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                            <div>
                              <h3 className="text-lg font-bold text-primary">{testimonial.name}</h3>
                              <p className="text-[#00CC66]">{testimonial.role}</p>
                              <div className="flex items-center mt-1">
                                <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                                <span className="text-gray-500 text-xs">{testimonial.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="personal" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredTestimonials
                  .filter((t) => t.category === "personal")
                  .map((testimonial, index) => (
                    <Card
                      key={index}
                      className="border-2 border-primary/10 hover:border-primary/30 transition-all overflow-hidden"
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                            <Image
                              src={testimonial.image || "/placeholder.svg"}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-6 md:w-2/3">
                            <div className="mb-4">
                              <Rating score={testimonial.rating} />
                            </div>
                            <Quote className="h-6 w-6 text-[#00CC66] mb-2" />
                            <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                            <div>
                              <h3 className="text-lg font-bold text-primary">{testimonial.name}</h3>
                              <p className="text-[#00CC66]">{testimonial.role}</p>
                              <div className="flex items-center mt-1">
                                <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                                <span className="text-gray-500 text-xs">{testimonial.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-2 bg-primary/10 text-primary border-none px-3 py-1 text-sm">Watch & Listen</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Video Testimonials</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Watch our users share their experiences with Pollen AI in their own words.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "How Pollen AI Helped My Business Grow",
                person: "David Phiri, Small Business Owner",
                duration: "3:42",
                views: "2.4K",
              },
              {
                title: "From Unbanked to Financially Empowered",
                person: "Sarah Mutale, Market Vendor",
                duration: "4:15",
                views: "1.8K",
              },
              {
                title: "Transforming Agriculture with Solar Financing",
                person: "Joseph Banda, Farmer",
                duration: "5:21",
                views: "3.1K",
              },
            ].map((video, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all"
              >
                <div className="relative aspect-video">
                  <Image
                    src="/placeholder.svg?height=720&width=1280"
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-all">
                    <div className="w-16 h-16 rounded-full bg-[#00CC66] flex items-center justify-center cursor-pointer transform group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-primary line-clamp-1">{video.title}</h3>
                  <p className="text-[#00CC66] mt-1">{video.person}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{video.views} views</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      Watch Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button className="bg-primary hover:bg-[#002244]">
              View All Videos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Metrics Section with Animation */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5"></div>
        <div className="absolute inset-0 bg-linear-to-b from-white via-white/95 to-white"></div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-2 bg-primary/10 text-primary border-none px-3 py-1 text-sm">
              Measurable Results
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Our Impact in Numbers</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              The statistics that showcase our commitment to financial inclusion and community development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                value: "25,000+",
                label: "Loans Disbursed",
                description: "Empowering entrepreneurs and individuals",
                icon: <TrendingUp className="h-10 w-10 text-[#00CC66]" />,
              },
              {
                value: "18,500+",
                label: "Savings Accounts",
                description: "Building financial security for families",
                icon: <Users className="h-10 w-10 text-[#00CC66]" />,
              },
              {
                value: "500+",
                label: "Climate Projects",
                description: "Supporting sustainable agriculture",
                icon: <Award className="h-10 w-10 text-[#00CC66]" />,
              },
              {
                value: "$12M+",
                label: "Total Financing",
                description: "Invested in underserved communities",
                icon: <ThumbsUp className="h-10 w-10 text-[#00CC66]" />,
              },
            ].map((metric, index) => (
              <Card
                key={index}
                className="border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 mx-auto bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center">
                    {metric.icon}
                  </div>
                  <p className="text-4xl font-bold text-primary">{metric.value}</p>
                  <p className="text-[#00CC66] font-semibold mt-2">{metric.label}</p>
                  <p className="text-gray-600 text-sm mt-2">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact Map */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-2 bg-primary/10 text-primary border-none px-3 py-1 text-sm">Global Reach</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Community Impact Map</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Explore how Pollen AI is transforming communities across Zambia and beyond.
            </p>
          </div>

          <div className="relative h-[500px] rounded-xl overflow-hidden shadow-xl mb-8">
            <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
              <Image src="/placeholder.svg?height=1000&width=1600" alt="Impact Map" fill className="object-cover" />
              <div className="absolute inset-0">
                {/* Map pins would be placed here in a real implementation */}
                <div className="absolute top-[30%] left-[25%] animate-pulse">
                  <div className="relative">
                    <MapPin className="h-8 w-8 text-[#00CC66]" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <div className="absolute top-[45%] left-[40%] animate-pulse">
                  <div className="relative">
                    <MapPin className="h-8 w-8 text-[#00CC66]" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <div className="absolute top-[60%] left-[30%] animate-pulse">
                  <div className="relative">
                    <MapPin className="h-8 w-8 text-[#00CC66]" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Choma Village Solar Project"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                <Badge className="mb-2 bg-[#00CC66] border-none w-fit">Agriculture</Badge>
                <h3 className="text-2xl font-bold text-white">Choma Village Solar Project</h3>
                <p className="text-white/80 mt-2">50 farmers equipped with solar irrigation</p>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-primary">Choma Village Solar Project</h3>
              <p className="text-gray-600">
                In Choma Village, 50 farmers received financing for solar irrigation equipment through Pollen AI's
                climate financing program. The results have been transformative:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#00CC66] mr-2 mt-1">•</span>
                  <span className="text-gray-600">60% increase in average crop yields</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00CC66] mr-2 mt-1">•</span>
                  <span className="text-gray-600">Year-round farming now possible, creating more stable incomes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00CC66] mr-2 mt-1">•</span>
                  <span className="text-gray-600">30% reduction in water usage through efficient irrigation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00CC66] mr-2 mt-1">•</span>
                  <span className="text-gray-600">Creation of 75 new jobs in the community</span>
                </li>
              </ul>
              <div className="flex items-center gap-4 mt-6">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Farmer Portrait"
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-[#00CC66]"
                />
                <div>
                  <p className="font-medium text-primary">"My life has completely changed."</p>
                  <p className="text-gray-600 text-sm">- James Mwanza, Lead Farmer</p>
                </div>
              </div>
              <Button className="bg-primary hover:bg-[#002244] mt-4">
                Read Full Case Study
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <h3 className="text-2xl font-bold text-primary">Lusaka Women Entrepreneurs Network</h3>
              <p className="text-gray-600">
                Pollen AI provided microloans to 200 women entrepreneurs in Lusaka who were previously unable to access
                traditional financing. The impact has been significant:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#00CC66] mr-2 mt-1">•</span>
                  <span className="text-gray-600">85% of businesses reported revenue growth within 6 months</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00CC66] mr-2 mt-1">•</span>
                  <span className="text-gray-600">350 new jobs created across the network</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00CC66] mr-2 mt-1">•</span>
                  <span className="text-gray-600">
                    98% loan repayment rate, demonstrating the effectiveness of our AI credit scoring
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00CC66] mr-2 mt-1">•</span>
                  <span className="text-gray-600">120 women have opened savings accounts for the first time</span>
                </li>
              </ul>
              <div className="flex items-center gap-4 mt-6">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Entrepreneur Portrait"
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-[#00CC66]"
                />
                <div>
                  <p className="font-medium text-primary">"I can now send all my children to school."</p>
                  <p className="text-gray-600 text-sm">- Grace Mulenga, Business Owner</p>
                </div>
              </div>
              <Button className="bg-primary hover:bg-[#002244] mt-4">
                Read Full Case Study
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl order-1 md:order-2">
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Lusaka Women Entrepreneurs"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                <Badge className="mb-2 bg-[#00CC66] border-none w-fit">Business</Badge>
                <h3 className="text-2xl font-bold text-white">Women Entrepreneurs Network</h3>
                <p className="text-white/80 mt-2">200 women-led businesses financed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Your Testimonial */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto bg-primary/5 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#00CC66]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <Badge className="mb-2 bg-primary/10 text-primary border-none px-3 py-1 text-sm">
                  Share Your Experience
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
                  Submit Your Success Story
                </h2>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                  Your story could inspire others to take the first step toward financial inclusion.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                      Service Used
                    </label>
                    <select
                      id="service"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select a service</option>
                      <option value="business">Business Loan</option>
                      <option value="agriculture">Agricultural Financing</option>
                      <option value="savings">Savings Account</option>
                      <option value="personal">Personal Loan</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Story
                    </label>
                    <textarea
                      id="story"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Share how Pollen AI has impacted your life..."
                    ></textarea>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="consent"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                      I consent to having my story and photo shared on the Pollen AI website
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button size="lg" className="bg-[#00CC66] hover:bg-[#00BB55] text-white">
                  Submit Your Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#00CC66]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#00CC66]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white border-none px-4 py-1 text-sm">Join Our Community</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-6">
              Be Part of Our Success Story
            </h2>
            <p className="text-white/80 md:text-xl mb-8">
              Experience the difference that accessible financial services can make in your life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-[#00CC66] hover:bg-[#00BB55] text-white">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More About Our Services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

