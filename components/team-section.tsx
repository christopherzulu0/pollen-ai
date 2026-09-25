"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Linkedin, Twitter, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  fullBio?: string
  expertise: string[]
  image: string
  socialLinks: {
    linkedin?: string
    twitter?: string
    email?: string
    website?: string
  }
}

export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Chief Executive Officer",
      bio: "Former fintech executive with 15+ years of experience in financial inclusion initiatives across Africa.",
      fullBio:
        "Sarah Johnson is a visionary leader with over 15 years of experience in the fintech industry. Prior to founding Pollen AI, she led digital transformation initiatives at several major financial institutions across Africa, focusing on expanding access to financial services in underserved communities. Sarah holds an MBA from Harvard Business School and a Bachelor's degree in Computer Science from MIT. Her unique combination of technical expertise and business acumen has been instrumental in developing Pollen AI's innovative approach to financial inclusion.",
      expertise: ["Financial Inclusion", "Strategic Leadership", "Digital Transformation", "Sustainable Finance"],
      image: "/placeholder.svg?height=400&width=400",
      socialLinks: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        email: "sarah@pollenai.com",
      },
    },
    {
      id: 2,
      name: "Michael Banda",
      role: "Chief Technology Officer",
      bio: "AI and blockchain specialist with a background in developing financial solutions for emerging markets.",
      fullBio:
        "Michael Banda is a pioneering technologist specializing in AI and blockchain applications for financial services. With a Ph.D. in Computer Science from Stanford University, Michael has published numerous papers on machine learning algorithms for credit scoring in low-data environments. Before joining Pollen AI, he led the development of blockchain-based payment systems at a leading African fintech company, reaching over 2 million previously unbanked users. Michael is passionate about leveraging cutting-edge technology to solve real-world problems in emerging markets.",
      expertise: ["Artificial Intelligence", "Blockchain", "Distributed Systems", "Machine Learning"],
      image: "/placeholder.svg?height=400&width=400",
      socialLinks: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        website: "https://michaelbanda.com",
      },
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "Chief Financial Officer",
      bio: "Financial expert with experience in microfinance and sustainable investment strategies.",
      fullBio:
        "Priya Patel brings over 12 years of experience in financial management and microfinance to Pollen AI. She previously served as the Finance Director for a major international microfinance institution, where she oversaw a loan portfolio of $200 million across six African countries. Priya holds a Master's degree in Finance from London School of Economics and is a certified Financial Risk Manager. Her expertise in sustainable finance and impact investing has helped Pollen AI develop financially viable models that prioritize social impact alongside returns.",
      expertise: ["Microfinance", "Risk Management", "Impact Investing", "Financial Modeling"],
      image: "/placeholder.svg?height=400&width=400",
      socialLinks: {
        linkedin: "https://linkedin.com",
        email: "priya@pollenai.com",
      },
    },
    {
      id: 4,
      name: "David Mwanza",
      role: "Head of Climate Initiatives",
      bio: "Environmental scientist focused on creating sustainable financing solutions for agricultural communities.",
      fullBio:
        "David Mwanza is an environmental scientist and climate finance expert with a passion for sustainable agriculture. He holds a Ph.D. in Environmental Science from the University of Cape Town and has worked extensively with smallholder farmers across Eastern and Southern Africa. Before joining Pollen AI, David led climate resilience programs at a major international development organization, securing over $50 million in climate financing for agricultural projects. His deep understanding of both environmental challenges and agricultural practices informs Pollen AI's approach to climate financing.",
      expertise: ["Climate Finance", "Sustainable Agriculture", "Environmental Science", "Carbon Markets"],
      image: "/placeholder.svg?height=400&width=400",
      socialLinks: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        email: "david@pollenai.com",
      },
    },
    {
      id: 5,
      name: "Amara Okafor",
      role: "Head of Product",
      bio: "UX specialist with expertise in designing digital financial services for low-literacy users.",
      fullBio:
        "Amara Okafor is a product design expert specializing in creating intuitive financial interfaces for users with limited digital literacy. With a Master's degree in Human-Computer Interaction from Carnegie Mellon University, Amara has pioneered innovative approaches to financial product design that overcome barriers of language, literacy, and technical familiarity. Before joining Pollen AI, she led product teams at several fintech startups across West Africa, where her user-centered designs helped increase adoption rates by over 200% among rural users. Amara regularly speaks at international conferences on inclusive design and financial technology.",
      expertise: ["Product Design", "User Experience", "Financial Inclusion", "Behavioral Economics"],
      image: "/placeholder.svg?height=400&width=400",
      socialLinks: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        website: "https://amaraokafor.com",
      },
    },
    {
      id: 6,
      name: "Kwame Nkrumah",
      role: "Head of Partnerships",
      bio: "Business development expert with extensive connections across African financial institutions and regulatory bodies.",
      fullBio:
        "Kwame Nkrumah brings over 15 years of experience in business development and strategic partnerships across the African financial sector. His deep network of relationships with banks, microfinance institutions, telecom companies, and regulatory bodies has been instrumental in Pollen AI's rapid expansion across multiple markets. Kwame previously served as the Director of Strategic Partnerships for a pan-African banking group, where he established successful collaborations with over 30 financial institutions. He holds an MBA from INSEAD and serves on the boards of several fintech industry associations.",
      expertise: ["Strategic Partnerships", "Business Development", "Regulatory Affairs", "Market Expansion"],
      image: "/placeholder.svg?height=400&width=400",
      socialLinks: {
        linkedin: "https://linkedin.com",
        email: "kwame@pollenai.com",
      },
    },
    {
      id: 7,
      name: "Fatima Al-Hassan",
      role: "Head of Data Science",
      bio: "Data scientist specializing in alternative credit scoring models for underserved populations.",
      fullBio:
        "Fatima Al-Hassan is a leading data scientist with specialized expertise in developing alternative credit scoring models for individuals without traditional financial histories. With a Ph.D. in Statistics from Oxford University, Fatima has pioneered innovative approaches to risk assessment using non-traditional data sources such as mobile phone usage, utility payments, and social connections. Her research has been published in top academic journals, and her models have enabled financial access for over 500,000 previously excluded individuals. At Pollen AI, Fatima leads a team of data scientists working to continuously improve the company's AI-powered credit assessment algorithms.",
      expertise: ["Data Science", "Machine Learning", "Alternative Credit Scoring", "Predictive Analytics"],
      image: "/placeholder.svg?height=400&width=400",
      socialLinks: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        website: "https://fatimaalhassan.com",
      },
    },
    {
      id: 8,
      name: "Gabriel Osei",
      role: "Head of Security",
      bio: "Cybersecurity expert with experience securing financial systems in challenging environments.",
      fullBio:
        "Gabriel Osei is a cybersecurity expert with over 12 years of experience protecting financial systems in challenging technological environments. Before joining Pollen AI, he served as the Chief Information Security Officer for a major African banking group, where he developed innovative security protocols for mobile banking systems operating in areas with limited connectivity. Gabriel holds multiple advanced security certifications including CISSP and CISM, and regularly advises fintech startups on security best practices. His approach to security at Pollen AI balances robust protection with the need for accessible, user-friendly systems.",
      expertise: ["Cybersecurity", "Blockchain Security", "Risk Management", "Compliance"],
      image: "/placeholder.svg?height=400&width=400",
      socialLinks: {
        linkedin: "https://linkedin.com",
        email: "gabriel@pollenai.com",
      },
    },
  ]

  return (
    <div className="py-12 md:py-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#003366] dark:text-white mb-4">
            Meet Our <span className="text-[#00CC66]">Leadership Team</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-[800px] mx-auto md:text-lg">
            Our diverse team combines expertise in AI, blockchain, finance, and sustainable development to create
            innovative solutions for financial inclusion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card
                className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex space-x-2">
                      {member.socialLinks.linkedin && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/40"
                        >
                          <Linkedin className="h-4 w-4" />
                          <span className="sr-only">LinkedIn</span>
                        </Button>
                      )}
                      {member.socialLinks.twitter && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/40"
                        >
                          <Twitter className="h-4 w-4" />
                          <span className="sr-only">Twitter</span>
                        </Button>
                      )}
                      {member.socialLinks.email && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/40"
                        >
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </Button>
                      )}
                      {member.socialLinks.website && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/40"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Website</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-[#003366] dark:text-white mb-1">{member.name}</h3>
                  <p className="text-[#00CC66] dark:text-[#00CC66] font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">{member.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
            {selectedMember && (
              <>
                <div className="relative h-48 sm:h-64 w-full">
                  <Image
                    src={selectedMember.image || "/placeholder.svg"}
                    alt={selectedMember.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <h2 className="text-white text-2xl font-bold">{selectedMember.name}</h2>
                    <p className="text-[#00CC66] font-medium">{selectedMember.role}</p>
                  </div>
                </div>
                <DialogHeader className="px-6 pt-6 pb-0">
                  <DialogTitle className="sr-only">{selectedMember.name}</DialogTitle>
                  <DialogDescription className="text-base text-gray-700 dark:text-gray-300">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedMember.expertise.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-[#003366]/10 text-[#003366] dark:bg-[#003366]/20 dark:text-[#00CC66] border-[#003366]/20"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="mb-4">{selectedMember.fullBio || selectedMember.bio}</p>
                    <div className="flex space-x-3 pt-2">
                      {selectedMember.socialLinks.linkedin && (
                        <Button size="icon" variant="outline" className="h-9 w-9 rounded-full">
                          <Linkedin className="h-4 w-4" />
                          <span className="sr-only">LinkedIn</span>
                        </Button>
                      )}
                      {selectedMember.socialLinks.twitter && (
                        <Button size="icon" variant="outline" className="h-9 w-9 rounded-full">
                          <Twitter className="h-4 w-4" />
                          <span className="sr-only">Twitter</span>
                        </Button>
                      )}
                      {selectedMember.socialLinks.email && (
                        <Button size="icon" variant="outline" className="h-9 w-9 rounded-full">
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </Button>
                      )}
                      {selectedMember.socialLinks.website && (
                        <Button size="icon" variant="outline" className="h-9 w-9 rounded-full">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Website</span>
                        </Button>
                      )}
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </>
            )}
          </DialogContent>
        </Dialog>

        <div className="mt-16 text-center">
          <Button className="bg-[#003366] hover:bg-[#002244] text-white rounded-full group transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg hover:shadow-[#003366]/20">
            Join Our Team
            <ExternalLink className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}

