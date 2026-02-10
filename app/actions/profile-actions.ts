"use strict";

"use server";

import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/writeClient";
import { USER_ID_BY_CLERK_ID_QUERY } from "@/sanity/queries/users";
import { sanityFetch } from "@/sanity/lib/live";
import { revalidatePath } from "next/cache";

export type ProfileUpdateData = {
    role?: string;
    bio?: string;
    phone?: string;
    image?: string;
    expertise?: string[];
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        github?: string;
        instagram?: string;
        linkedin?: string;
    };
};

export async function updateProfile(data: ProfileUpdateData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // Get Sanity user ID
    const { data: user } = await sanityFetch({
        query: USER_ID_BY_CLERK_ID_QUERY,
        params: { clerkId: userId },
    });

    if (!user || !user._id) {
        throw new Error("User not found in Sanity");
    }

    try {
        await writeClient
            .patch(user._id)
            .set({
                role: data.role,
                bio: data.bio,
                phone: data.phone,
                image: data.image,
                expertise: data.expertise,
                socialLinks: data.socialLinks,
            })
            .commit();

        revalidatePath("/support/settings");
        revalidatePath("/contact");
        revalidatePath("/member"); // Just in case it's used there too

        return { success: true };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}
