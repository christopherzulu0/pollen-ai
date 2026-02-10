import { sanityFetch } from "@/sanity/lib/live";
import { GET_ALL_TEAM_MEMBERS_QUERY } from "@/sanity/queries/users";
import { urlFor } from "@/sanity/lib/image";
import Team from './Team'

export default async function TeamPage() {
  const { data: users } = await sanityFetch({
    query: GET_ALL_TEAM_MEMBERS_QUERY,
  });

  const teamMembers = users.map((user: any) => {
    let imageUrl = 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/team/image-1.png';

    if (typeof user.image === 'string' && user.image.startsWith('http')) {
      imageUrl = user.image;
    } else if (user.image && typeof user.image === 'object') {
      try {
        imageUrl = urlFor(user.image).url();
      } catch (e) {
        console.error("Error generating URL for sanity image:", e);
      }
    }

    return {
      image: imageUrl,
      alt: user.name || 'Team Member',
      name: user.name || 'Anonymous',
      role: user.role || 'Team Member',
      description: user.bio || 'A valued member of our team.',
      availability: 'Available', // Default or could be derived from user.availability
      expertise: user.expertise || [],
      // rating: 5.0, // Placeholder as it's not in schema yet
      // reviews: 0,   // Placeholder
      email: user.email,
      phone: user.phone,
      timezone: 'UTC', // Default
      socialLinks: {
        facebook: user.socialLinks?.facebook || '#',
        twitter: user.socialLinks?.twitter || '#',
        github: user.socialLinks?.github || '#',
        instagram: user.socialLinks?.instagram || '#',
        linkedin: user.socialLinks?.linkedin || '#',
      },
      slug: user.slug?.current,
      clerkId: user.clerkId,
    };
  });

  return <Team teamMembers={teamMembers} />
}

