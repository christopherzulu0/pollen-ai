"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Upload, Image as ImageIcon, Loader2, Search } from 'lucide-react'
import Image from "next/image"
import { useUploadThing } from '@/lib/uploadthing-react'
import * as LucideIcons from 'lucide-react'

interface Service {
  id: string
  name: string
  nameKey?: string | null
  description: string
  category: string
  status: "active" | "inactive"
  icon?: string | null
  image?: string | null
  users?: number | null
  revenue?: number | null
  growth?: number | null
  keyFeatures?: string[]
  requirements?: string[]
}

// Popular Lucide icons for services
const popularIcons = [
  'Wallet', 'Users', 'Landmark', 'Building', 'Coins', 'Bitcoin', 'CreditCard',
  'PiggyBank', 'DollarSign', 'TrendingUp', 'Shield', 'Zap', 'Globe', 'BarChart3',
  'LineChart', 'Target', 'Rocket', 'Lightbulb', 'Sparkles', 'Lock', 'Key',
  'Banknote', 'Receipt', 'WalletCards', 'Store', 'Briefcase', 'Handshake',
  'UserCircle', 'UsersRound', 'Building2', 'Home', 'Storefront'
]

// Get all available Lucide icons
const allIcons = Object.keys(LucideIcons).filter(
  (name) => 
    typeof (LucideIcons as any)[name] === 'function' &&
    name[0] === name[0].toUpperCase() &&
    !name.startsWith('Icon')
)

interface ServiceEditorModalProps {
  service: Service | null
  onClose: () => void
  onSave: (service: Service) => void
  isSubmitting?: boolean
}

export function ServiceEditorModal({ service, onClose, onSave, isSubmitting = false }: ServiceEditorModalProps) {
  const [formData, setFormData] = useState<Service>(
    service || {
      id: "",
      name: "",
      nameKey: "",
      description: "",
      category: "",
      status: "active",
      icon: null,
      image: null,
      users: 0,
      revenue: 0,
      growth: 0,
      keyFeatures: [],
      requirements: [],
    }
  )

  const [featureInput, setFeatureInput] = useState("")
  const [requirementInput, setRequirementInput] = useState("")
  const [iconSearch, setIconSearch] = useState("")
  const [iconPickerOpen, setIconPickerOpen] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const { startUpload, isUploading } = useUploadThing("serviceImageUploader")

  useEffect(() => {
    if (service) {
      setFormData(service)
    }
  }, [service])

  const handleSave = () => {
    if (formData.name && formData.category && formData.description) {
      onSave(formData)
    }
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        keyFeatures: [...(formData.keyFeatures || []), featureInput],
      })
      setFeatureInput("")
    }
  }

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData({
        ...formData,
        requirements: [...(formData.requirements || []), requirementInput],
      })
      setRequirementInput("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      keyFeatures: formData.keyFeatures?.filter((_, i) => i !== index),
    })
  }

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements?.filter((_, i) => i !== index),
    })
  }

  // Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)

      // Upload to UploadThing
      const uploadedFiles = await startUpload([file])
      
      if (uploadedFiles && uploadedFiles[0]) {
        setFormData((prev) => ({ ...prev, image: uploadedFiles[0].url }))
      } else {
        throw new Error('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  // Remove image
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
  }

  // Select icon
  const handleIconSelect = (iconName: string) => {
    setFormData((prev) => ({ ...prev, icon: iconName }))
    setIconPickerOpen(false)
    setIconSearch("")
  }

  // Get icon component dynamically
  const getIconComponent = (iconName: string | null | undefined) => {
    if (!iconName) return null
    const IconComponent = (LucideIcons as any)[iconName]
    if (!IconComponent || typeof IconComponent !== 'function') return null
    return <IconComponent className="w-5 h-5" />
  }

  // Filter icons based on search
  const filteredIcons = iconSearch
    ? allIcons.filter(icon => icon.toLowerCase().includes(iconSearch.toLowerCase()))
    : popularIcons

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border-0 dark:bg-gray-900 dark:text-white">
        <CardHeader className="flex flex-row justify-between items-center sticky top-0 bg-white dark:bg-gray-900 border-b dark:border-gray-700 z-10">
          <CardTitle className="text-gray-900 dark:text-white">{service ? "Edit Service" : "Create New Service"}</CardTitle>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
        </CardHeader>

        <CardContent className="space-y-4 p-4 sm:p-6 overflow-y-auto flex-1">
          {/* Basic Info */}
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Service Name *</span>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter service name"
                className="mt-1 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Name Key (Optional)</span>
              <Input
                value={formData.nameKey || ""}
                onChange={(e) => setFormData({ ...formData, nameKey: e.target.value })}
                placeholder="e.g., digital-loans, village-banking"
                className="mt-1 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                A URL-friendly identifier for this service (optional)
              </p>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Description *</span>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter a detailed description of the service. Include who it's ideal for, how it works, and key benefits..."
                className="mt-1 min-h-[100px] dark:bg-gray-800 dark:text-white dark:border-gray-700"
                rows={4}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Provide a comprehensive description. You can include details like "ideal for", key benefits, and how the service works.
              </p>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Category *</span>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 w-full border rounded-md p-2 text-sm bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 text-gray-900"
              >
                <option value="">Select a category</option>
                <option value="Digital Loans">Digital Loans</option>
                <option value="Village Banking">Village Banking</option>
                <option value="Crypto Loans">Crypto Loans</option>
                <option value="Institution Banking">Institution Banking</option>
                <option value="Irrigation Loans">Irrigation Loans</option>
                <option value="Other">Other</option>
              </select>
              {formData.category === "Other" && (
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Enter custom category"
                  className="mt-2 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
              )}
            </label>

            {/* Icon Selector */}
            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Icon (Optional)</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Select a Lucide React icon to represent this service
              </p>
              <Popover open={iconPickerOpen} onOpenChange={setIconPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start mt-1 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  >
                    {formData.icon ? (
                      <div className="flex items-center gap-2">
                        {getIconComponent(formData.icon)}
                        <span className="text-gray-900 dark:text-white">{formData.icon}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">Select an icon</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 z-[100] dark:bg-gray-900 dark:border-gray-700" align="start">
                  <div className="p-3 border-b dark:border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Input
                        placeholder="Search icons..."
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                        className="pl-8 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-64">
                    <div className="p-2 grid grid-cols-4 gap-2">
                      {filteredIcons.length > 0 ? (
                        filteredIcons.map((iconName) => {
                          const IconComponent = (LucideIcons as any)[iconName]
                          if (!IconComponent) return null
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => handleIconSelect(iconName)}
                              className={`
                                p-3 rounded-lg border transition-colors flex flex-col items-center justify-center gap-1
                                dark:border-gray-700 dark:text-white
                                ${formData.icon === iconName 
                                  ? 'bg-[#003366] text-white border-[#003366] dark:bg-[#003366]' 
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 bg-white'
                                }
                              `}
                              title={iconName}
                            >
                              <IconComponent className="w-5 h-5" />
                              <span className="text-xs truncate w-full text-center">{iconName}</span>
                            </button>
                          )
                        })
                      ) : (
                        <div className="col-span-4 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                          No icons found
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
              {formData.icon && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData((prev) => ({ ...prev, icon: null }))}
                  className="mt-2"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear icon
                </Button>
              )}
            </label>

            {/* Image Upload */}
            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Service Image (Optional)</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Upload an image for this service (max 16MB)
              </p>
              {formData.image ? (
                <div className="mt-2 space-y-2">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image
                      src={formData.image}
                      alt="Service preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('service-image-input')?.click()}
                    disabled={uploadingImage || isUploading}
                    className="w-full"
                  >
                    {uploadingImage || isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Change Image
                      </>
                    )}
                  </Button>
                  <input
                    id="service-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('service-image-input')?.click()}
                    disabled={uploadingImage || isUploading}
                    className="w-full"
                  >
                    {uploadingImage || isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Upload Image
                      </>
                    )}
                  </Button>
                  <input
                    id="service-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
            </label>
          </div>

          {/* Status and Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Status</span>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                className="mt-1 w-full border rounded-md p-2 text-sm bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 text-gray-900"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Users</span>
              <Input
                type="number"
                value={formData.users || 0}
                onChange={(e) => setFormData({ ...formData, users: parseInt(e.target.value) || 0 })}
                className="mt-1 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Revenue</span>
              <Input
                type="number"
                value={formData.revenue || 0}
                onChange={(e) => setFormData({ ...formData, revenue: parseInt(e.target.value) || 0 })}
                className="mt-1 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Growth %</span>
              <Input
                type="number"
                step="0.1"
                value={formData.growth || 0}
                onChange={(e) => setFormData({ ...formData, growth: parseFloat(e.target.value) || 0 })}
                className="mt-1 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
            </label>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Key Features</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Add key features or benefits of this service (e.g., "AI credit scoring", "Flexible terms", "No collateral needed")
              </p>
              <div className="mt-1 flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="e.g., AI credit scoring, Flexible terms..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
                <Button onClick={addFeature} size="sm" className="flex-shrink-0" type="button">
                  Add
                </Button>
              </div>
            </label>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-gray-50 dark:bg-gray-900">
              {formData.keyFeatures && formData.keyFeatures.length > 0 ? (
                formData.keyFeatures.map((feature, index) => (
                  <div key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {feature}
                    <button
                      onClick={() => removeFeature(index)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100 font-semibold text-base leading-none"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">No features added yet</p>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Requirements</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Add eligibility requirements for this service (e.g., "Valid ID", "3+ months of transaction history", "Cryptocurrency holdings")
              </p>
              <div className="mt-1 flex gap-2">
                <Input
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  placeholder="e.g., Valid ID, 3+ months history..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                  className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
                <Button onClick={addRequirement} size="sm" className="flex-shrink-0" type="button">
                  Add
                </Button>
              </div>
            </label>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-gray-50 dark:bg-gray-900">
              {formData.requirements && formData.requirements.length > 0 ? (
                formData.requirements.map((req, index) => (
                  <div key={index} className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {req}
                    <button
                      onClick={() => removeRequirement(index)}
                      className="text-amber-600 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-100 font-semibold text-base leading-none"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">No requirements added yet</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t dark:border-gray-700">
            <Button
              onClick={onClose}
              variant="ghost"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-[#003366] to-[#00CC66] text-white hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Service"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
