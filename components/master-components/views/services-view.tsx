"use client"

import { useState, Suspense } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Edit, Trash2, Search, TrendingUp, Users, DollarSign, Activity } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ServiceEditorModal } from "./modals/service-editor-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

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

interface ApiService {
  id: string
  name: string
  nameKey: string | null
  description: string
  category: string
  status: string
  icon: string | null
  image: string | null
  users: number | null
  revenue: number | null
  growth: number | null
  keyFeatures: string[]
  requirements: string[]
  created_at: string
  updated_at: string
}

// Transform API service to UI service
function transformService(apiService: ApiService): Service {
  return {
    id: apiService.id,
    name: apiService.name,
    nameKey: apiService.nameKey || undefined,
    description: apiService.description,
    category: apiService.category,
    status: apiService.status as "active" | "inactive",
    icon: apiService.icon || undefined,
    image: apiService.image || undefined,
    users: apiService.users ?? undefined,
    revenue: apiService.revenue ?? undefined,
    growth: apiService.growth ?? undefined,
    keyFeatures: apiService.keyFeatures || [],
    requirements: apiService.requirements || [],
  }
}

// Fetch services from API
async function fetchServices(): Promise<Service[]> {
  const response = await fetch('/api/services')
  if (!response.ok) {
    throw new Error('Failed to fetch services')
  }
  const data: ApiService[] = await response.json()
  return data.map(transformService)
}

// Skeleton loader component
function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="bg-card border border-border">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Stats skeleton
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="bg-card border border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-5 w-5 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Services content component
function ServicesContent({ 
  showModal, 
  setShowModal, 
  editingService, 
  setEditingService 
}: {
  showModal: boolean
  setShowModal: (show: boolean) => void
  editingService: Service | null
  setEditingService: (service: Service | null) => void
}) {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)

  // Fetch services using React Query
  const { data: services = [], isLoading, error } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: fetchServices,
    staleTime: 30000, // 30 seconds
  })

  // Create service mutation
  const createMutation = useMutation({
    mutationFn: async (service: Omit<Service, 'id'>) => {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create service')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service created successfully', {
        description: 'The new service has been added to your list.',
      })
      setShowModal(false)
      setEditingService(null)
    },
    onError: (error: Error) => {
      toast.error('Failed to create service', {
        description: error.message || 'An error occurred while creating the service.',
      })
    },
  })

  // Update service mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...service }: Service) => {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update service')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service updated successfully', {
        description: 'The service changes have been saved.',
      })
      setShowModal(false)
      setEditingService(null)
    },
    onError: (error: Error) => {
      toast.error('Failed to update service', {
        description: error.message || 'An error occurred while updating the service.',
      })
    },
  })

  // Delete service mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete service')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service deleted successfully', {
        description: 'The service has been permanently removed.',
      })
      setDeleteDialogOpen(false)
      setServiceToDelete(null)
    },
    onError: (error: Error) => {
      toast.error('Failed to delete service', {
        description: error.message || 'An error occurred while deleting the service.',
      })
    },
  })

  const filteredServices = services.filter((service) => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    totalServices: services.length,
    active: services.filter(s => s.status === "active").length,
    totalUsers: services.reduce((sum, s) => sum + (s.users || 0), 0),
    totalRevenue: services.reduce((sum, s) => sum + (s.revenue || 0), 0),
  }

  const handleSave = (service: Service) => {
    if (editingService) {
      updateMutation.mutate(service)
    } else {
      const { id, ...serviceData } = service
      createMutation.mutate(serviceData)
    }
  }

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (serviceToDelete) {
      deleteMutation.mutate(serviceToDelete.id)
    }
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Error loading services: {error instanceof Error ? error.message : 'Unknown error'}</p>
        <Button onClick={() => queryClient.refetchQueries({ queryKey: ['services'] })}>
          Retry
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <>
        <StatsSkeleton />
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1" />
        </div>
        <ServicesSkeleton />
      </>
    )
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        <Card className="bg-card border border-border border-l-4 border-l-primary">
          <CardContent className="p-3 sm:p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Total Services</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{stats.totalServices}</p>
              </div>
              <Activity className="w-5 h-5 text-primary opacity-50 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border border-l-4 border-l-secondary">
          <CardContent className="p-3 sm:p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Active</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{stats.active}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-secondary opacity-50 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border border-l-4 border-l-info">
          <CardContent className="p-3 sm:p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Total Users</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-5 h-5 text-info opacity-50 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border border-l-4 border-l-warning">
          <CardContent className="p-3 sm:p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="w-5 h-5 text-warning opacity-50 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search services by name or category..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-10 bg-background border-border text-foreground"
          />
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'No services found matching your search.' : 'No services yet. Create your first service!'}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => {
                setEditingService(null)
                setShowModal(true)
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Service
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-xl transition-all duration-300 bg-card border border-border group">
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors break-words">{service.name}</h3>
                    {service.nameKey && (
                      <p className="text-xs text-muted-foreground mt-0.5">ID: <span className="font-mono text-foreground">{service.nameKey}</span></p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                  </div>
                  <Badge variant={service.status === "active" ? "default" : "secondary"} className={service.status === "active" ? "bg-green-100 text-green-800 border-0 flex-shrink-0" : ""}>
                    {service.status}
                  </Badge>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground font-medium">Category: <span className="text-foreground">{service.category}</span></p>
                </div>

                {(service.keyFeatures && service.keyFeatures.length > 0) && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground">Key Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {service.keyFeatures.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {(service.requirements && service.requirements.length > 0) && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground">Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {service.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="bg-warning/20 text-warning border-warning/30 text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="bg-primary/10 rounded p-2 border border-border">
                    <p className="text-xs text-muted-foreground font-medium">Users</p>
                    <p className="text-xs sm:text-sm font-bold text-foreground break-words">{(service.users || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-warning/10 rounded p-2 border border-border">
                    <p className="text-xs text-muted-foreground font-medium">Revenue</p>
                    <p className="text-xs sm:text-sm font-bold text-foreground">${(service.revenue || 0) / 1000}K</p>
                  </div>
                  <div className="bg-success/10 rounded p-2 border border-border">
                    <p className="text-xs text-muted-foreground font-medium">Growth</p>
                    <p className="text-xs sm:text-sm font-bold text-foreground">+{service.growth || 0}%</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-border flex-wrap">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      setEditingService(service)
                      setShowModal(true)
                    }}
                    className="flex-1 hover:bg-accent hover:text-accent-foreground min-w-0"
                    disabled={updateMutation.isPending || deleteMutation.isPending}
                  >
                    <Edit className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">Edit</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeleteClick(service)}
                    className="flex-1 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-red-300 min-w-0"
                    disabled={updateMutation.isPending || deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <ServiceEditorModal
          service={editingService}
          onClose={() => {
            setShowModal(false)
            setEditingService(null)
          }}
          onSave={handleSave}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{serviceToDelete?.name}</strong>? This action cannot be undone and will permanently remove the service from your system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Service'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function ServicesView() {
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Services Management</h1>
              <p className="text-muted-foreground mt-2">Manage financial services and track performance</p>
            </div>
            <Button
              onClick={() => {
                setEditingService(null)
                setShowModal(true)
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Service
            </Button>
          </div>

          <Suspense fallback={
            <div className="space-y-6">
              <StatsSkeleton />
              <div className="flex gap-3">
                <Skeleton className="h-10 flex-1" />
              </div>
              <ServicesSkeleton />
            </div>
          }>
            <ServicesContent showModal={showModal} setShowModal={setShowModal} editingService={editingService} setEditingService={setEditingService} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
