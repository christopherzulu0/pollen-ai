import { defineField, defineType, defineArrayMember } from "sanity";
import { UserIcon } from "@sanity/icons";

export const userType = defineType({
  name: "user",
  title: "User",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "clerkId",
      title: "Clerk ID",
      type: "string",
      validation: (Rule) => Rule.required().error("Clerk ID is required"),
      readOnly: true,
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "User Image URL",
      type: "string",
      description: "External URL for the profile image (from Uploadthing)",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      description: "Used for the public booking page URL",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Job title or role (e.g., Founder & CEO)",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      description: "Brief professional summary",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "expertise",
      title: "Expertise",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "List of skills or areas of expertise",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "object",
      fields: [
        defineField({ name: "facebook", type: "string", title: "Facebook" }),
        defineField({ name: "twitter", type: "string", title: "Twitter/X" }),
        defineField({ name: "github", type: "string", title: "GitHub" }),
        defineField({ name: "instagram", type: "string", title: "Instagram" }),
        defineField({ name: "linkedin", type: "string", title: "LinkedIn" }),
      ],
    }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "array",
      of: [defineArrayMember({ type: "availabilitySlot" })],
      description: "Time blocks when the user is available",
    }),
    defineField({
      name: "connectedAccounts",
      title: "Connected Accounts",
      type: "array",
      of: [defineArrayMember({ type: "connectedAccount" })],
      description: "Connected Google Calendar accounts",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
    },
  },
});
