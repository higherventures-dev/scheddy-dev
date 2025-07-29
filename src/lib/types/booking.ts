export interface Profile {
  first_name: string
  last_name: string
}

export interface Booking {
  id: string
  start_time: Date
  end_time: Date
  title: string
  created_at?: string
  price?: number
  status: number

  // Nested profiles for joins
  artist?: Profile
  client?: Profile
  studio?: Profile
}