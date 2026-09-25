"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, User, ArrowRight, Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content?: string
  image: string
  date: string
  author: {
    name: string
    avatar: string
  }
  category: string
  tags: string[]
  readTime: number
}

export default function BlogSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "How AI is Revolutionizing Credit Scoring in Emerging Markets",
      excerpt:
        "Traditional credit scoring methods exclude millions. Learn how AI is changing the game by analyzing alternative data points to create accurate credit profiles.",
      image: "/placeholder.svg?height=600&width=800",
      date: "March 15, 2023",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Technology",
      tags: ["AI", "Credit Scoring", "Financial Inclusion"],
      readTime: 5,
    },
    {
      id: 2,
      title: "The Impact of Solar Irrigation on Small-Scale Farming",
      excerpt:
        "Solar-powered irrigation systems are transforming agriculture in rural communities. Discover how climate financing is making this technology accessible.",
      image: "/placeholder.svg?height=600&width=800",
      date: "April 2, 2023",
      author: {
        name: "David Mwanza",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Climate Finance",
      tags: ["Sustainable Agriculture", "Solar Energy", "Climate Finance"],
      readTime: 7,
    },
    {
      id: 3,
      title: "Blockchain and Financial Inclusion: A Perfect Match",
      excerpt:
        "Blockchain technology is removing barriers to financial services. Learn how it's creating transparent, secure, and accessible financial ecosystems.",
      image: "/placeholder.svg?height=600&width=800",
      date: "May 10, 2023",
      author: {
        name: "Michael Banda",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Blockchain",
      tags: ["Blockchain", "Cryptocurrency", "Financial Inclusion"],
      readTime: 6,
    },
    {
      id: 4,
      title: "Women Entrepreneurs: Breaking Barriers with Financial Access",
      excerpt:
        "Women entrepreneurs face unique challenges in accessing finance. See how innovative financial solutions are helping them overcome these obstacles.",
      image: "/placeholder.svg?height=600&width=800",
      date: "June 8, 2023",
      author: {
        name: "Priya Patel",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Financial Inclusion",
      tags: ["Women Entrepreneurs", "Gender Equality", "Microfinance"],
      readTime: 8,
    },
    {
      id: 5,
      title: "The Future of Banking in Africa: Digital and Inclusive",
      excerpt:
        "Traditional banking is being disrupted by digital solutions. Explore how this transformation is creating opportunities for financial inclusion.",
      image: "/placeholder.svg?height=600&width=800",
      date: "July 22, 2023",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Digital Banking",
      tags: ["Digital Banking", "Mobile Money", "Africa"],
      readTime: 6,
    },
    {
      id: 6,
      title: "Carbon Credits: A New Revenue Stream for Rural Communities",
      excerpt:
        "Carbon credit markets are opening up new opportunities. Learn how rural communities can benefit from sustainable practices that generate credits.",
      image: "/placeholder.svg?height=600&width=800",
      date: "August 15, 2023",
      author: {
        name: "David Mwanza",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Climate Finance",
      tags: ["Carbon Credits", "Sustainability", "Rural Development"],
      readTime: 5,
    },
  ]

  // Handle search and filtering
  const handleSearch = () => {
    setIsSearching(true)

    setTimeout(() => {
      const filtered = blogPosts.filter((post) => {
        const matchesSearch =
          searchTerm === "" ||
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesCategory = categoryFilter === "all" || post.category === categoryFilter

        return matchesSearch && matchesCategory
      })

      setFilteredPosts(filtered)
      setIsSearching(false)
    }, 500)
  }

  // Initialize filtered posts with all posts
  useState(() => {
    setFilteredPosts(blogPosts)
  })

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(blogPosts.map((post) => post.category)))]

  // Featured post is the first one
  const featuredPost = blogPosts[0]

  return (
    <div className="py-12 md:py-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#003366] dark:text-white mb-4">
            Latest <span className="text-[#00CC66]">Insights & News</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-[800px] mx-auto md:text-lg">
            Stay updated with the latest trends, insights, and news in financial inclusion, blockchain technology, and
            sustainable development.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <Card className="overflow-hidden border-none shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[#00CC66] hover:bg-[#00BB55]">Featured</Badge>
                </div>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <Badge
                      variant="outline"
                      className="mr-2 bg-[#003366]/10 text-[#003366] dark:bg-[#003366]/20 dark:text-[#00CC66] border-[#003366]/20"
                    >
                      {featuredPost.category}
                    </Badge>
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{featuredPost.author.name}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#003366] dark:text-white mb-3">{featuredPost.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{featuredPost.excerpt}</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredPost.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link href={`/blog/${featuredPost.id}`}>
                  <Button className="bg-[#003366] hover:bg-[#002244] text-white w-full sm:w-auto">
                    Read Full Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setSearchTerm("")
                    setFilteredPosts(blogPosts)
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value)
                  // Auto-search when category changes
                  setTimeout(() => handleSearch(), 0)
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Category</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="bg-[#00CC66] hover:bg-[#00BB55] text-white"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPosts.slice(1).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant="outline"
                      className="bg-white/80 backdrop-blur-sm dark:bg-black/50 text-[#003366] dark:text-white border-white/10"
                    >
                      {post.readTime} min read
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <Badge
                      variant="outline"
                      className="mr-2 bg-[#003366]/10 text-[#003366] dark:bg-[#003366]/20 dark:text-[#00CC66] border-[#003366]/20"
                    >
                      {post.category}
                    </Badge>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#003366] dark:text-white mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                      <Image
                        src={post.author.avatar || "/placeholder.svg"}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{post.author.name}</span>
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-[#00CC66] hover:text-[#00BB55] font-medium flex items-center"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && !isSearching && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="mb-4">
              <Search className="h-12 w-12 mx-auto text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-[#003366] dark:text-white mb-2">No articles found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We couldn't find any articles matching your search criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("all")
                setFilteredPosts(blogPosts)
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Newsletter Subscription */}
        {/* <div className="mt-16 bg-[#003366] dark:bg-[#002244] text-white rounded-xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[140%] bg-[#00CC66]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-[40%] -left-[10%] w-[70%] h-[140%] bg-[#00CC66]/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-white/80 mb-8">
              Stay updated with the latest insights, news, and stories about financial inclusion and technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Your email address"
                type="email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#00CC66]"
              />
              <Button className="bg-[#00CC66] hover:bg-[#00BB55] text-white">Subscribe</Button>
            </div>
            <p className="text-white/60 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div> */}
      </div>
    </div>
  )
}

