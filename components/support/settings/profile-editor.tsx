"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { urlFor } from "@/sanity/lib/image";
import { UploadButton } from "@/utils/uploadthing";
import { updateProfile, ProfileUpdateData } from "@/app/actions/profile-actions";

interface ProfileEditorProps {
    initialData: {
        role?: string;
        bio?: string;
        phone?: string;
        image?: any;
        expertise?: string[];
        socialLinks?: {
            facebook?: string;
            twitter?: string;
            github?: string;
            instagram?: string;
            linkedin?: string;
        };
    };
}

export function ProfileEditor({ initialData }: ProfileEditorProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [formData, setFormData] = useState({
        role: initialData.role || "",
        bio: initialData.bio || "",
        phone: initialData.phone || "",
        image: (() => {
            if (typeof initialData.image === 'string') return initialData.image;
            if (initialData.image && typeof initialData.image === 'object') {
                try {
                    return urlFor(initialData.image).url();
                } catch (e) {
                    return "";
                }
            }
            return "";
        })(),
        expertise: initialData.expertise?.join(", ") || "",
        facebook: initialData.socialLinks?.facebook || "",
        twitter: initialData.socialLinks?.twitter || "",
        github: initialData.socialLinks?.github || "",
        instagram: initialData.socialLinks?.instagram || "",
        linkedin: initialData.socialLinks?.linkedin || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        const updateData: ProfileUpdateData = {
            role: formData.role,
            bio: formData.bio,
            phone: formData.phone,
            image: formData.image,
            expertise: formData.expertise ? formData.expertise.split(",").map((s) => s.trim()).filter(Boolean) : [],
            socialLinks: {
                facebook: formData.facebook,
                twitter: formData.twitter,
                github: formData.github,
                instagram: formData.instagram,
                linkedin: formData.linkedin,
            },
        };

        try {
            const result = await updateProfile(updateData);
            if (result.success) {
                toast.success("Profile updated successfully");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to update profile");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>
                    Information that will be displayed on the public Team page.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 py-4">
                        <div className="relative size-20 overflow-hidden rounded-full bg-muted">
                            {formData.image ? (
                                <img
                                    src={formData.image}
                                    alt="Profile"
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center text-xs text-muted-foreground text-center px-1">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label>Profile Image</Label>
                            <UploadButton
                                endpoint="memberProfileImage"
                                onClientUploadComplete={(res) => {
                                    if (res?.[0]) {
                                        setFormData((prev) => ({ ...prev, image: res[0].url }));
                                        toast.success("Image uploaded successfully");
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    toast.error(`Upload failed: ${error.message}`);
                                }}
                                appearance={{
                                    button: "h-9 px-4 py-2 text-sm",
                                    allowedContent: "hidden",
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role / Job Title</Label>
                            <Input
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="e.g. Founder & CEO"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expertise">Expertise (comma-separated)</Label>
                        <Input
                            id="expertise"
                            name="expertise"
                            value={formData.expertise}
                            onChange={handleChange}
                            placeholder="e.g. React, TypeScript, Product Strategy"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Brief professional summary..."
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-3 pt-2">
                        <h3 className="text-sm font-medium">Social Media Links</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <Input
                                    id="linkedin"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    placeholder="URL"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="twitter">Twitter / X</Label>
                                <Input
                                    id="twitter"
                                    name="twitter"
                                    value={formData.twitter}
                                    onChange={handleChange}
                                    placeholder="URL"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="github">GitHub</Label>
                                <Input
                                    id="github"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleChange}
                                    placeholder="URL"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram</Label>
                                <Input
                                    id="instagram"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    placeholder="URL"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
