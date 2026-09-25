"use server";

import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

export async function syncUser() {
  try {
    const user = await currentUser();
    if (!user) return;

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) return;

    let dbUser = await prisma.user.findUnique({ where: { clerkUserId: user.id } });
    if (dbUser) return dbUser;

    // User may exist by email (e.g. seeded, invited) but without clerkUserId - update instead of create
    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingByEmail) {
      dbUser = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          clerkUserId: user.id,
          name: `${user.firstName} ${user.lastName}`.trim() || existingByEmail.name,
          phone: user.phoneNumbers[0]?.phoneNumber ?? existingByEmail.phone,
        },
      });
    } else {
      dbUser = await prisma.user.create({
        data: {
          clerkUserId: user.id,
          name: `${user.firstName} ${user.lastName}`.trim(),
          email,
          phone: user.phoneNumbers[0]?.phoneNumber,
        },
      });
    }

    // Push user into existing organizations with Member role when user data didn't exist
    try {
      const clerk = await clerkClient();
      const { data: organizations } = await clerk.organizations.getOrganizationList({ limit: 100 });

      for (const org of organizations ?? []) {
        try {
          await clerk.organizations.createOrganizationMembership({
            organizationId: org.id,
            userId: user.id,
            role: "org:member",
          });
        } catch (membershipError) {
          // User may already be a member; skip and continue
          if (
            membershipError instanceof Error &&
            !membershipError.message?.toLowerCase().includes("already")
          ) {
            console.warn(`[syncUser] Could not add user to org ${org.id}:`, membershipError);
          }
        }
      }
    } catch (orgError) {
      console.warn("[syncUser] Error adding user to organizations:", orgError);
    }

    return dbUser;
  } catch (error) {
    console.log("Error in syncUser server action", error);
  }
}
