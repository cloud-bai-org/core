export interface Temple {
  id: string
  name: string
  address: string
  description: string
  deities: string[]
  routes: WorshipRoute[]
}

export interface Deity {
  id: string
  name: string
  title: string
  description: string
  offerings: string[]
}

export type OfferingCategoryId = 'fruit' | 'flower' | 'food' | 'beverage' | 'meat' | 'pastry' | 'other'

export interface OfferingCategory {
  id: OfferingCategoryId
  name: string
  icon: string
}

export interface Offering {
  id: string
  name: string
  category: OfferingCategoryId
  emoji: string
  description: string
}

export interface AltarOffering {
  instanceId: string
  offeringId: string
  x: number
  y: number
}

export interface WorshipRoute {
  id: string
  name: string
  steps: WorshipRouteStep[]
}

export interface WorshipRouteStep {
  order: number
  deityId: string
  location: string
}
