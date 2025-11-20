"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground">Get assistance with your CoopHub account</p>
        </div>
        <Button>
          <Mail className="mr-2 h-4 w-4" />
          Contact Support
        </Button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Common questions about using CoopHub</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4">
              <h4 className="font-medium">How do I create a new group?</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Navigate to the "Create Group" section from the sidebar and follow the step-by-step
                process to set up your new cooperative group.
              </p>
            </div>
            <div className="rounded-md border p-4">
              <h4 className="font-medium">How do payments work?</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                You can make payments through Mobile Money (MOMO) or bank transfers. Navigate to the
                "Deposit/Withdraw" section to process transactions.
              </p>
            </div>
            <div className="rounded-md border p-4">
              <h4 className="font-medium">What happens if I miss a payment?</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Late payments may incur penalties as defined by your group's rules. Contact your group
                administrator for specific details.
              </p>
            </div>
            <div className="rounded-md border p-4">
              <h4 className="font-medium">How secure is my money?</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                CoopHub uses bank-level encryption and security measures to protect your funds and
                personal information. All transactions are monitored and verified.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Get in touch with our support team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">support@coophub.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-medium">Send us a message</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  className="h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <Button className="w-full">Send Message</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Video Tutorials</CardTitle>
          <CardDescription>Learn how to use CoopHub with our video guides</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border">
              <div className="aspect-video bg-muted"></div>
              <div className="p-4">
                <h4 className="font-medium">Getting Started with CoopHub</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Learn the basics of using the CoopHub platform
                </p>
              </div>
            </div>
            <div className="rounded-lg border">
              <div className="aspect-video bg-muted"></div>
              <div className="p-4">
                <h4 className="font-medium">Creating and Managing Groups</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  How to create and effectively manage savings groups
                </p>
              </div>
            </div>
            <div className="rounded-lg border">
              <div className="aspect-video bg-muted"></div>
              <div className="p-4">
                <h4 className="font-medium">Mobile Money Integration</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  How to link and use Mobile Money with CoopHub
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}