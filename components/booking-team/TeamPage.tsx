'use client'

import Team from './Team'

const teamMembers = [
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/team/image-1.png',
    alt: 'Phillip Bothman',
    name: 'Phillip Bothman',
    role: 'Founder & CEO',
    description: 'A visionary leader driving innovation and collaboration.',
    availability: 'Available',
    expertise: ['Leadership', 'Strategy', 'Product'],
    rating: 4.9,
    reviews: 28,
    email: 'phillip@company.com',
    phone: '+1 (555) 123-4567',
    timezone: 'EST - New York',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      github: '#',
      instagram: '#'
    }
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/team/image-2.png',
    alt: 'James Kenter',
    name: 'James Kenter',
    role: 'Engineering Manager',
    description: 'Leading teams to build smart, scalable solutions.',
    availability: 'Available',
    expertise: ['Backend', 'DevOps', 'Architecture', 'Cloud'],
    rating: 4.8,
    reviews: 34,
    email: 'james@company.com',
    phone: '+1 (555) 234-5678',
    timezone: 'PST - San Francisco',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      github: '#',
      instagram: '#'
    }
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/team/image-3.png',
    alt: 'Cristofer Kenter',
    name: 'Cristofer Kenter',
    role: 'Product Designer',
    description: 'Crafting intuitive and engaging user experiences.',
    availability: 'Available',
    expertise: ['UI/UX', 'Design Systems', 'Wireframing', 'Prototyping'],
    rating: 4.7,
    reviews: 22,
    email: 'cristofer@company.com',
    phone: '+1 (555) 345-6789',
    timezone: 'CST - Chicago',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      github: '#',
      instagram: '#'
    }
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/team/image-4.png',
    alt: 'Alena Lubin',
    name: 'Alena Lubin',
    role: 'Frontend Developer',
    description: 'Bringing designs to life with seamless interfaces.',
    availability: 'Available',
    expertise: ['React', 'TypeScript', 'CSS', 'Next.js'],
    rating: 4.9,
    reviews: 31,
    email: 'alena@company.com',
    phone: '+1 (555) 456-7890',
    timezone: 'EST - Boston',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      github: '#',
      instagram: '#'
    }
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/team/image-8.png',
    alt: 'Jayden Lipshultz',
    name: 'Jayden Lipshultz',
    role: 'Sales Lead',
    description: 'Driving business growth and strong client relationships.',
    availability: 'Available',
    expertise: ['B2B Sales', 'Negotiation', 'Client Relations', 'Partnerships'],
    rating: 4.6,
    reviews: 19,
    email: 'jayden@company.com',
    phone: '+1 (555) 567-8901',
    timezone: 'CST - Austin',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      github: '#',
      instagram: '#'
    }
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/team/image-7.png',
    alt: 'Maria Donin',
    name: 'Maria Donin',
    role: 'Product Manager',
    description: 'Bridging business needs with impactful solutions.',
    availability: 'Available',
    expertise: ['Product Strategy', 'Analytics', 'Roadmapping', 'User Research'],
    rating: 4.8,
    reviews: 26,
    email: 'maria@company.com',
    phone: '+1 (555) 678-9012',
    timezone: 'PST - Seattle',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      github: '#',
      instagram: '#'
    }
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/team/image-6.png',
    alt: 'Carter Saris',
    name: 'Carter Saris',
    role: 'UX Researcher',
    description: 'Uncovering insights to enhance user experiences.',
    availability: 'Available',
    expertise: ['User Research', 'Testing', 'Insights', 'Accessibility'],
    rating: 4.7,
    reviews: 20,
    email: 'carter@company.com',
    phone: '+1 (555) 789-0123',
    timezone: 'CST - Denver',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      github: '#',
      instagram: '#'
    }
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/team/image-5.png',
    alt: 'Ahmad Donin',
    name: 'Ahmad Donin',
    role: 'Customer Success',
    description: 'Ensuring customer satisfaction and long-term success.',
    availability: 'Available',
    expertise: ['Support', 'Onboarding', 'Retention', 'Training'],
    rating: 4.9,
    reviews: 29,
    email: 'ahmad@company.com',
    phone: '+1 (555) 890-1234',
    timezone: 'EST - Miami',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      github: '#',
      instagram: '#'
    }
  }
]

const TeamPage = () => {
  return <Team teamMembers={teamMembers} />
}

export default TeamPage
