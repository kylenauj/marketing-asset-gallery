import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const PROVINCES = [
  { code: 'ON', name: 'Ontario' },
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'SK', name: 'Saskatchewan' },
  ]

export const BRANDS = [
  { id: 'litti',       name: 'LITTI.',               color: '#004B6C', provinces: ['ON','AB','BC','SK'] },
  { id: 'greazy',      name: 'GREAZY',               color: '#A2D074', provinces: ['ON','AB','BC'] },
  { id: 'shatterizer', name: 'Shatterizer',           color: '#EDDC61', provinces: ['ON','AB','SK'] },
  { id: 'buddyblooms', name: 'Buddy Blooms',          color: '#f0997b', provinces: ['ON','BC'] },
  { id: 'countryside', name: 'Countryside Cannabis',  color: '#97C459', provinces: ['ON'] },
  { id: 'ellevia',     name: 'Ellevia',               color: '#ED93B1', provinces: ['ON','AB','BC'] },
  ]

// SKU-level asset types (attached to a specific product)
export const SKU_ASSET_TYPES = [
  { id: 'sellsheet', label: 'Sell Sheet',        icon: 'ti-file-description', color: '#fce9e9', iconColor: '#b83232' },
  { id: 'tvad',      label: 'TV Ad',             icon: 'ti-device-tv',        color: '#e8eef8', iconColor: '#2a4fa0' },
  { id: 'webcard',   label: 'Web Product Card',  icon: 'ti-browser',          color: '#e8f4ec', iconColor: '#2d7a45' },
  { id: 'pk',        label: 'Product Knowledge', icon: 'ti-bulb',             color: '#f3e8fc', iconColor: '#6a2da0' },
  ]

// Brand-level asset types (not tied to a specific SKU)
export const BRAND_ASSET_TYPES = [
  { id: 'logo',      label: 'Logo Pack',          icon: 'ti-vector-triangle',  color: '#fef8e3', iconColor: '#8a6800' },
  { id: 'brandbook', label: 'Brand Book',          icon: 'ti-books',            color: '#fff0e8', iconColor: '#a04010' },
  { id: 'weekly',    label: 'Weekly Inventory',    icon: 'ti-calendar-stats',   color: '#e8f8f4', iconColor: '#0f6e56' },
  ]

export const ALL_ASSET_TYPES = [...SKU_ASSET_TYPES, ...BRAND_ASSET_TYPES]

// Legacy export for inventory page compatibility
export const ASSET_TYPES = ALL_ASSET_TYPES
