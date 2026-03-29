export interface TempleLocation {
  lat: number
  lng: number
}

export interface Temple {
  id: string
  name: string
  address: string
  description: string
  location: TempleLocation
  deities: string[]
  halls: TempleHall[]
  routes: WorshipRoute[]
}

export interface TempleHall {
  id: string
  name: string
  deityId: string
  order: number
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
