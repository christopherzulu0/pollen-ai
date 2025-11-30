"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Heart, RotateCcw } from "lucide-react"

interface GroupFiltersProps {
  filters: {
    privacy: string
    status: string
    frequency: string
    contributionRange: [number, number]
    interestRange: [number, number]
    showFavoritesOnly: boolean
  }
  onFilterChange: (filters: {
    privacy: string
    status: string
    frequency: string
    contributionRange: [number, number]
    interestRange: [number, number]
    showFavoritesOnly: boolean
  }) => void
  favorites: Set<string>
}

export function GroupFilters({ filters, onFilterChange, favorites }: GroupFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const resetFilters = () => {
    onFilterChange({
      privacy: "all",
      status: "all",
      frequency: "all",
      contributionRange: [0, 200000],
      interestRange: [0, 10],
      showFavoritesOnly: false,
    })
  }

  return (
    <div className="rounded-xl sm:rounded-2xl border border-border/50 bg-card/95 backdrop-blur-sm shadow-md p-4 sm:p-6 space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Filters</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs rounded-lg">
          <RotateCcw className="mr-1 sm:mr-1.5 size-3 sm:size-3.5" />
          Reset
        </Button>
      </div>

      {favorites.size > 0 && (
        <>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="favorites-only"
              className="flex items-center gap-2 text-xs sm:text-sm font-medium cursor-pointer"
            >
              <Heart className="size-3.5 sm:size-4 fill-red-500 text-red-500" />
              Favorites Only
            </Label>
            <Switch
              id="favorites-only"
              checked={filters.showFavoritesOnly}
              onCheckedChange={(checked) => updateFilter("showFavoritesOnly", checked)}
            />
          </div>
          <Separator />
        </>
      )}

      <div className="space-y-3 sm:space-y-4">
        <Label className="text-xs sm:text-sm font-medium text-foreground">Privacy</Label>
        <RadioGroup value={filters.privacy} onValueChange={(value) => updateFilter("privacy", value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="privacy-all" />
            <Label htmlFor="privacy-all" className="cursor-pointer text-xs sm:text-sm font-normal text-foreground">
              All
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="PUBLIC" id="privacy-public" />
            <Label htmlFor="privacy-public" className="cursor-pointer text-xs sm:text-sm font-normal text-foreground">
              Public
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="PRIVATE" id="privacy-private" />
            <Label htmlFor="privacy-private" className="cursor-pointer text-xs sm:text-sm font-normal text-foreground">
              Private
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="INVITE_ONLY" id="privacy-invite" />
            <Label htmlFor="privacy-invite" className="cursor-pointer text-xs sm:text-sm font-normal text-foreground">
              Invite Only
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-3 sm:space-y-4">
        <Label className="text-xs sm:text-sm font-medium text-foreground">Status</Label>
        <RadioGroup value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="status-all" />
            <Label htmlFor="status-all" className="cursor-pointer text-xs sm:text-sm font-normal text-foreground">
              All
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ACTIVE" id="status-active" />
            <Label htmlFor="status-active" className="cursor-pointer text-xs sm:text-sm font-normal text-foreground">
              Active
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="INACTIVE" id="status-inactive" />
            <Label htmlFor="status-inactive" className="cursor-pointer text-xs sm:text-sm font-normal text-foreground">
              Inactive
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-3 sm:space-y-4">
        <Label className="text-xs sm:text-sm font-medium text-foreground">Frequency</Label>
        <RadioGroup value={filters.frequency} onValueChange={(value) => updateFilter("frequency", value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="freq-all" />
            <Label htmlFor="freq-all" className="cursor-pointer text-xs sm:text-sm font-normal text-foreground">
              All
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="WEEKLY" id="freq-weekly" />
            <Label htmlFor="freq-weekly" className="cursor-pointer text-xs sm:text-sm font-normal text-foreground">
              Weekly
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="BI_WEEKLY" id="freq-biweekly" />
            <Label htmlFor="freq-biweekly" className="cursor-pointer text-xs sm:text-sm font-normal text-foreground">
              Bi-weekly
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="MONTHLY" id="freq-monthly" />
            <Label htmlFor="freq-monthly" className="cursor-pointer text-xs sm:text-sm font-normal text-foreground">
              Monthly
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs sm:text-sm font-medium text-foreground">Contribution</Label>
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            {filters.contributionRange[0].toLocaleString()} - {filters.contributionRange[1].toLocaleString()}
          </span>
        </div>
        <Slider
          value={filters.contributionRange}
          onValueChange={(value) => updateFilter("contributionRange", value as [number, number])}
          min={0}
          max={200000}
          step={10000}
          className="touch-manipulation"
        />
      </div>

      <Separator />

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs sm:text-sm font-medium text-foreground">Interest Rate</Label>
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            {filters.interestRange[0]}% - {filters.interestRange[1]}%
          </span>
        </div>
        <Slider
          value={filters.interestRange}
          onValueChange={(value) => updateFilter("interestRange", value as [number, number])}
          min={0}
          max={10}
          step={0.5}
          className="touch-manipulation"
        />
      </div>
    </div>
  )
}
