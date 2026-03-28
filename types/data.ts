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

export interface Offering {
  id: string
  name: string
  category: 'fruit' | 'flower' | 'food' | 'beverage' | 'other'
  description: string
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
