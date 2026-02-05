'use client'

import { useState, useMemo } from 'react'
import { FacebookIcon, GithubIcon, InstagramIcon, TwitterIcon, Search, X, Calendar, Clock, CheckCircle2, Star, Zap, MapPin, Mail, Phone, MessageSquare } from 'lucide-react'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type TeamMember = {
  image: string
  alt: string
  name: string
  role: string
  description: string
  expertise?: string[]
  availability?: string
  rating?: number
  reviews?: number
  email?: string
  phone?: string
  timezone?: string
  socialLinks: {
    facebook: string
    twitter: string
    github: string
    instagram: string
  }
}[]

const TIME_SLOTS = ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM', '4:00 PM']
const MEETING_DURATIONS = ['30 min', '1 hour', '1.5 hours']

const Team = ({ teamMembers }: { teamMembers: TeamMember }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedDuration, setSelectedDuration] = useState<string>('')
  const [memberDetails, setMemberDetails] = useState<number | null>(null)

  // Get unique roles and expertise for filters
  const roles = useMemo(() => {
    return Array.from(new Set(teamMembers.map(m => m.role)))
  }, [teamMembers])

  const allExpertise = useMemo(() => {
    const expertise = new Set<string>()
    teamMembers.forEach(m => {
      m.expertise?.forEach(e => expertise.add(e))
    })
    return Array.from(expertise)
  }, [teamMembers])

  // Advanced filtering
  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = !selectedRole || member.role === selectedRole
      const matchesExpertise = !selectedExpertise || member.expertise?.includes(selectedExpertise)
      return matchesSearch && matchesRole && matchesExpertise
    })
  }, [searchQuery, selectedRole, selectedExpertise, teamMembers])

  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }, [filteredMembers])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedRole(null)
    setSelectedExpertise(null)
  }

  return (
    <div className='space-y-6'>
      {/* Advanced Search and Filter Section */}
      <div className='space-y-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border border-primary/10'>
        {/* Search Bar */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search by name, role, or skill...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 py-2 h-auto text-sm'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>

        {/* Role and Expertise Filters */}
        <div className='space-y-3'>
          {/* Role Filters */}
          <div>
            <p className='text-xs font-bold text-[#4C4EFB] mb-2 uppercase tracking-wider'>Filter by Role</p>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant={selectedRole === null ? 'default' : 'outline'}
                onClick={() => setSelectedRole(null)}
                size='sm'
                className={`rounded-full text-xs h-8 ${selectedRole === null ? 'bg-[#4C4EFB] text-white' : 'border-[#4C4EFB]/20 text-[#4C4EFB] hover:bg-[#4C4EFB]/5'}`}
              >
                All
              </Button>
              {roles.map(role => (
                <Button
                  key={role}
                  variant={selectedRole === role ? 'default' : 'outline'}
                  onClick={() => setSelectedRole(role)}
                  size='sm'
                  className={`rounded-full text-xs h-8 ${selectedRole === role ? 'bg-[#4C4EFB] text-white' : 'border-[#4C4EFB]/20 text-[#4C4EFB] hover:bg-[#4C4EFB]/5'}`}
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>

          {/* Expertise Filters */}
          <div>
            <p className='text-xs font-bold text-[#4C4EFB] mb-2 uppercase tracking-wider'>Filter by Expertise</p>
            <div className='flex flex-wrap gap-2'>
              {allExpertise.map(expertise => (
                <Button
                  key={expertise}
                  variant={selectedExpertise === expertise ? 'default' : 'outline'}
                  onClick={() => setSelectedExpertise(selectedExpertise === expertise ? null : expertise)}
                  size='sm'
                  className={`rounded-full text-xs h-8 flex items-center gap-1 ${selectedExpertise === expertise ? 'bg-[#4C4EFB] text-white' : 'border-[#4C4EFB]/20 text-[#4C4EFB] hover:bg-[#4C4EFB]/5'}`}
                >
                  <Zap className='h-3 w-3' />
                  {expertise}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter and Clear */}
        <div className='flex items-center justify-between pt-2 border-t border-primary/10'>
          <p className='text-xs text-muted-foreground'>
            Showing {sortedMembers.length} of {teamMembers.length} team members
          </p>
          {(searchQuery || selectedRole || selectedExpertise) && (
            <Button
              variant='ghost'
              size='sm'
              onClick={resetFilters}
              className='text-xs h-7'
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Team Members Grid */}
      {sortedMembers.length > 0 ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {sortedMembers.map((member, index) => (
            <Card
              key={index}
              className='group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/80'
            >
              <CardContent className='p-0'>
                {/* Image Container with Overlay */}
                <div className='relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10 flex items-center justify-center min-h-72'>
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.alt}
                    className='h-full w-full object-contain object-center group-hover:scale-105 transition-transform duration-500'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                  {/* Availability and Rating Badges */}
                  <div className='absolute top-3 right-3 flex flex-col gap-2'>
                    {member.availability && (
                      <div className='flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-secondary/90 backdrop-blur text-primary text-xs font-semibold'>
                        <CheckCircle2 className='h-3 w-3' />
                        {member.availability}
                      </div>
                    )}
                    {member.rating && (
                      <div className='flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-500/90 backdrop-blur text-white text-xs font-semibold'>
                        <Star className='h-3 w-3 fill-current' />
                        {member.rating}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Container */}
                <div className='relative space-y-3 p-5'>
                  {/* Name, Role and Rating Summary */}
                  <div className='space-y-2'>
                    <div className='flex items-start justify-between gap-2'>
                      <div>
                        <CardTitle className='text-lg font-bold tracking-tight'>{member.name}</CardTitle>
                        <div className='inline-block mt-1'>
                          <p className='text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary/20 text-secondary'>
                            {member.role}
                          </p>
                        </div>
                      </div>
                    </div>
                    {member.rating && (
                      <div className='flex items-center gap-2'>
                        <div className='flex gap-0.5'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < Math.floor(member.rating!) ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'}`}
                            />
                          ))}
                        </div>
                        <span className='text-xs text-muted-foreground'>({member.reviews} reviews)</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className='text-sm text-muted-foreground leading-relaxed line-clamp-2'>
                    {member.description}
                  </p>

                  {/* Expertise Tags */}
                  {member.expertise && member.expertise.length > 0 && (
                    <div className='flex flex-wrap gap-1.5 pt-1'>
                      {member.expertise.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className='text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium'>
                          {skill}
                        </span>
                      ))}
                      {member.expertise.length > 2 && (
                        <span className='text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium cursor-pointer hover:bg-primary/20 transition-colors'>
                          +{member.expertise.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Contact and Info Quick Links */}
                  <div className='flex flex-wrap gap-2 pt-2 pb-1'>
                    {member.email && (
                      <button className='p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all' title='Email'>
                        <Mail className='h-3.5 w-3.5' />
                      </button>
                    )}
                    {member.phone && (
                      <button className='p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all' title='Call'>
                        <Phone className='h-3.5 w-3.5' />
                      </button>
                    )}
                    <button
                      className='p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all'
                      onClick={() => setMemberDetails(memberDetails === index ? null : index)}
                      title='View Details'
                    >
                      <MessageSquare className='h-3.5 w-3.5' />
                    </button>
                  </div>

                  {/* Social Links */}
                  <div className='flex items-center gap-2'>
                    <a
                      href={member.socialLinks.facebook}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={(e) => e.stopPropagation()}
                      className='p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 hover:scale-110 transition-all duration-200'
                    >
                      <FacebookIcon className='h-3.5 w-3.5' />
                    </a>
                    <a
                      href={member.socialLinks.twitter}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={(e) => e.stopPropagation()}
                      className='p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 hover:scale-110 transition-all duration-200'
                    >
                      <TwitterIcon className='h-3.5 w-3.5' />
                    </a>
                    <a
                      href={member.socialLinks.github}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={(e) => e.stopPropagation()}
                      className='p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 hover:scale-110 transition-all duration-200'
                    >
                      <GithubIcon className='h-3.5 w-3.5' />
                    </a>
                    <a
                      href={member.socialLinks.instagram}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={(e) => e.stopPropagation()}
                      className='p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 hover:scale-110 transition-all duration-200'
                    >
                      <InstagramIcon className='h-3.5 w-3.5' />
                    </a>
                  </div>

                  {/* Schedule Meeting Button */}
                  <Button
                    className='w-full mt-2 bg-secondary hover:bg-secondary/90 text-primary font-semibold h-9 text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95'
                    onClick={() => setSelectedMember(selectedMember === index ? null : index)}
                  >
                    <Calendar className='mr-2 h-4 w-4' />
                    Schedule Meeting
                  </Button>

                  {/* Expandable Booking Section */}
                  {selectedMember === index && (
                    <div className='mt-4 p-4 rounded-lg bg-secondary/10 border border-secondary/30 space-y-4 animate-in fade-in duration-200'>
                      {/* Date Selection */}
                      <div>
                        <p className='text-xs font-semibold text-foreground mb-2'>Select Date</p>
                        <input
                          type='date'
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className='w-full px-3 py-2 text-xs rounded-lg border border-primary/20 bg-card text-foreground focus:border-secondary outline-none'
                        />
                      </div>

                      {/* Time Slot Selection */}
                      <div>
                        <p className='text-xs font-semibold text-foreground mb-2'>Select Time</p>
                        <div className='grid grid-cols-2 gap-2'>
                          {TIME_SLOTS.map(slot => (
                            <Button
                              key={slot}
                              variant={selectedTime === slot ? 'default' : 'outline'}
                              size='sm'
                              className='text-xs h-8'
                              onClick={() => setSelectedTime(slot)}
                            >
                              <Clock className='mr-1 h-3 w-3' />
                              {slot}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Duration Selection */}
                      <div>
                        <p className='text-xs font-semibold text-foreground mb-2'>Meeting Duration</p>
                        <div className='flex gap-2'>
                          {MEETING_DURATIONS.map(duration => (
                            <Button
                              key={duration}
                              variant={selectedDuration === duration ? 'default' : 'outline'}
                              size='sm'
                              className='text-xs h-8 flex-1'
                              onClick={() => setSelectedDuration(duration)}
                            >
                              {duration}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Timezone Info */}
                      {member.timezone && (
                        <div className='p-2 rounded-lg bg-primary/5 border border-primary/10'>
                          <p className='text-xs text-muted-foreground flex items-center gap-1'>
                            <MapPin className='h-3 w-3' />
                            {member.timezone}
                          </p>
                        </div>
                      )}

                      {/* Confirm Button */}
                      <Button
                        className='w-full bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={!selectedDate || !selectedTime || !selectedDuration}
                        onClick={() => {
                          console.log(`[v0] Booking confirmed - Date: ${selectedDate}, Time: ${selectedTime}, Duration: ${selectedDuration}`)
                          alert('Booking confirmed! Check your email for details.')
                          setSelectedMember(null)
                          setSelectedDate('')
                          setSelectedTime('')
                          setSelectedDuration('')
                        }}
                      >
                        <CheckCircle2 className='mr-2 h-4 w-4' />
                        Confirm Booking
                      </Button>
                    </div>
                  )}

                  {/* Member Details Modal */}
                  {memberDetails === index && (
                    <div className='mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3 animate-in fade-in duration-200'>
                      <div className='space-y-2 text-sm'>
                        {member.email && (
                          <div className='flex items-center gap-2 text-muted-foreground'>
                            <Mail className='h-4 w-4' />
                            <span className='text-xs'>{member.email}</span>
                          </div>
                        )}
                        {member.phone && (
                          <div className='flex items-center gap-2 text-muted-foreground'>
                            <Phone className='h-4 w-4' />
                            <span className='text-xs'>{member.phone}</span>
                          </div>
                        )}
                        {member.timezone && (
                          <div className='flex items-center gap-2 text-muted-foreground'>
                            <MapPin className='h-4 w-4' />
                            <span className='text-xs'>{member.timezone}</span>
                          </div>
                        )}
                      </div>
                      {member.expertise && (
                        <div className='pt-2 border-t border-primary/10'>
                          <p className='text-xs font-semibold mb-2'>All Expertise</p>
                          <div className='flex flex-wrap gap-1.5'>
                            {member.expertise.map((skill, idx) => (
                              <span key={idx} className='text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium'>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hover Indicator */}
                  <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='h-2 w-2 rounded-full bg-secondary animate-pulse' />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <p className='text-muted-foreground text-sm mb-2'>No team members found</p>
          <p className='text-xs text-muted-foreground mb-4'>Try adjusting your search or filters</p>
          <Button
            variant='outline'
            onClick={resetFilters}
            size='sm'
            className='text-xs h-8'
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default Team
