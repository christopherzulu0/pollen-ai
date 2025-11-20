'use client'

import { useState, useEffect } from 'react'
import type React from 'react'
import { X, Upload, Image as ImageIcon, Plus, X as XIcon, Loader2 } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUploadThing } from '@/lib/uploadthing-react'

interface BlogPost {
  id?: string
  title: string
  slug?: string
  category: string
  author: string
  authorPosition?: string
  date: string
  description?: string
  status: 'published' | 'draft'
  image?: string
  tags?: string[]
  views?: number
  engagement?: number
}

interface BlogCategory {
  id: string
  name: string
  description: string
}

interface BlogEditorModalProps {
  post: BlogPost | null
  onClose: () => void
  onSave: (post: BlogPost) => void
}

export function BlogEditorModal({ post, onClose, onSave }: BlogEditorModalProps) {
  const { user, isLoaded: isUserLoaded } = useUser()
  
  const [formData, setFormData] = useState<BlogPost>(
    post || {
      title: '',
      slug: '',
      category: '',
      author: '',
      authorPosition: '',
      description: '',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'draft',
      image: '',
      tags: [],
      views: 0,
      engagement: 0,
    }
  )
  const [tagInput, setTagInput] = useState('')
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const { startUpload, isUploading } = useUploadThing("blogImageUploader")

  // Auto-populate author information from user session when creating a new post
  useEffect(() => {
    if (isUserLoaded && user && !post) {
      // Get author name from firstName + lastName
      const firstName = user.firstName || ''
      const lastName = user.lastName || ''
      const fullName = [firstName, lastName].filter(Boolean).join(' ') || user.fullName || user.username || ''
      
      // Get author position from user role (check publicMetadata first, then fallback)
      const userRole = (user.publicMetadata?.role as string) || 
                       (user.publicMetadata?.role_name as string) ||
                       (user.publicMetadata?.position as string) ||
                       'Author'
      
      // Get user profile image
      const userImage = user.imageUrl || ''
      
      setFormData((prev) => ({
        ...prev,
        author: fullName,
        authorPosition: userRole,
        image: prev.image || userImage, // Use user image as default if no image is set
      }))
    }
  }, [isUserLoaded, user, post])

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        setCategoriesError(null)
        const response = await fetch('/api/blog-categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategoriesError('Failed to load categories. Please refresh the page.')
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (!post || (post && !post.slug)) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData((prev) => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.title, post])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'views' || name === 'engagement' ? parseInt(value) || 0 : value,
    }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      setSubmitError(null)

      // Upload to UploadThing
      const uploadedFiles = await startUpload([file])
      
      if (uploadedFiles && uploadedFiles[0]) {
        setFormData((prev) => ({ ...prev, image: uploadedFiles[0].url }))
      } else {
        throw new Error('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setSubmitError('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Ensure views and engagement are set to 0 by default
      const postData = {
        ...formData,
        views: 0,
        engagement: 0,
        description: formData.description || formData.title, // Use title as description if not provided
        authorPosition: formData.authorPosition || 'Author',
      }

      let response
      if (post?.id) {
        // Update existing post
        response = await fetch(`/api/blog-posts/${post.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
      } else {
        // Create new post
        response = await fetch('/api/blog-posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save blog post')
      }

      const savedPost = await response.json()
      
      // Call the onSave callback with the saved post data
      onSave({
        ...postData,
        id: savedPost.id,
      })
      
      onClose()
    } catch (error) {
      console.error('Error saving blog post:', error)
      setSubmitError(error instanceof Error ? error.message : 'Failed to save blog post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>{post ? 'Edit Post' : 'New Post'}</CardTitle>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium text-foreground mb-2 block">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter post title"
                  required
                  className="text-sm"
                />
              </div>
              <div>
                <label htmlFor="category" className="text-sm font-medium text-foreground mb-2 block">
                  Category
                </label>
                {loadingCategories ? (
                  <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-muted">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Loading categories...</span>
                  </div>
                ) : categoriesError ? (
                  <div className="space-y-2">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg bg-white text-foreground text-sm border-destructive"
                      required
                    >
                      <option value="">Select a category</option>
                    </select>
                    <p className="text-xs text-destructive">{categoriesError}</p>
                  </div>
                ) : (
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
                {!loadingCategories && !categoriesError && categories.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No categories available. Please create categories first.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-medium text-foreground mb-2 block">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter post description..."
                required
                rows={4}
                className="w-full px-3 py-2 border rounded-lg bg-white text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>

            {/* Display author information (read-only) */}
            {isUserLoaded && user && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg border border-border">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Author
                  </label>
                  <p className="text-sm font-medium text-foreground">
                    {formData.author || 'Loading...'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Author Position
                  </label>
                  <p className="text-sm font-medium text-foreground">
                    {formData.authorPosition || 'Loading...'}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="text-sm font-medium text-foreground mb-2 block">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-foreground text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              {/* <div>
                <label htmlFor="views" className="text-sm font-medium text-foreground mb-2 block">
                  Views
                </label>
                <Input
                  id="views"
                  name="views"
                  type="number"
                  value={formData.views || 0}
                  onChange={handleChange}
                  placeholder="0"
                  className="text-sm"
                />
              </div> */}
            </div>

            <div>
              <label htmlFor="slug" className="text-sm font-medium text-foreground mb-2 block">
                Slug (URL-friendly)
              </label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug || ''}
                onChange={handleChange}
                placeholder="auto-generated-from-title"
                className="text-sm font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL-friendly version of the title. Auto-generated but can be customized.
              </p>
            </div>

            <div>
              <label htmlFor="image" className="text-sm font-medium text-foreground mb-2 block">
                Featured Image
              </label>
              {formData.image ? (
                <div className="space-y-2">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border bg-muted">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                          <p className="text-sm text-foreground">Uploading...</p>
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                      disabled={uploadingImage}
                      className="absolute top-2 right-2 p-1.5 bg-background/90 hover:bg-background rounded-full shadow-lg transition-colors disabled:opacity-50"
                      aria-label="Remove image"
                    >
                      <XIcon className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg bg-background hover:bg-muted cursor-pointer transition-colors text-sm ${
                      uploadingImage || isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingImage || isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Change Image
                      </>
                    )}
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploadingImage || isUploading}
                    className="hidden"
                  />
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className={`flex flex-col items-center justify-center gap-3 px-6 py-12 border-2 border-dashed border-border rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors ${
                    uploadingImage || isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingImage || isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                      <p className="text-sm font-medium text-foreground">Uploading image...</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 rounded-full bg-background border border-border">
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">Click to upload an image</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploadingImage || isUploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="text-sm font-medium text-foreground mb-2 block">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Enter a tag and press Enter"
                  className="text-sm"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="px-3 py-1 text-sm flex items-center gap-1.5"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive transition-colors"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {submitError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{submitError}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-[#003366] to-[#00CC66] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {post ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  post ? 'Update Post' : 'Create Post'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
