import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ---------------------------------------------------------------------------
// PROVINCES
// To add: copy a line and fill in code + name.
// To remove: delete (or comment out) the line.
// ---------------------------------------------------------------------------
export const PROVINCES = [
  { code: 'ON', name: 'Ontario' },
  { code: 'AB', name: 'Alberta' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'MB', name: 'Manitoba' },
]

// ---------------------------------------------------------------------------
// BRANDS
// provinces: list of province codes this brand appears in.
//   Add 'MB' to include Manitoba, remove 'AB' to exclude Alberta, etc.
// logoUrl: URL to the brand logo image (PNG/SVG). Leave empty string for colour swatch fallback.
// ---------------------------------------------------------------------------
export const BRANDS = [
  {
    id: 'litti',
    name: 'LITTI.',
    color: '#004B6C',
    logoUrl: '',
    provinces: ['ON', 'AB', 'SK', 'MB'],
  },
  {
    id: 'greazy',
    name: 'GREAZY',
    color: '#A2D074',
    logoUrl: '',
    provinces: ['ON', 'AB', 'MB'],
  },
  {
    id: 'shatterizer',
    name: 'Shatterizer',
    color: '#EDDC61',
    logoUrl: '',
    provinces: ['ON', 'AB', 'SK'],
  },
  {
    id: 'buddyblooms',
    name: 'Buddy Blooms',
    color: '#f0997b',
    logoUrl: '',
    provinces: ['ON', 'MB'],
  },
  {
    id: 'countryside',
    name: 'Countryside Cannabis',
    color: '#97C459',
    logoUrl: '',
    provinces: ['ON'],
  },
  {
    id: 'ellevia',
    name: 'Ellevia',
    color: '#ED93B1',
    logoUrl: '',
    provinces: ['ON', 'AB', 'MB'],
  },
]

// ---------------------------------------------------------------------------
// ASSET TYPES - SKU level (shown per product)
// ---------------------------------------------------------------------------
export const SKU_ASSET_TYPES = [
  { id: 'sellsheet', label: 'Sell Sheet',      icon: 'ti-file-description', color: '#fce9e9', iconColor: '#b83232' },
  { id: 'tvad',      label: 'TV Ad',            icon: 'ti-device-tv',        color: '#e8eef8', iconColor: '#2a4fa0' },
  { id: 'webcard',   label: 'Web Product Card', icon: 'ti-browser',          color: '#e8f4ec', iconColor: '#2d7a45' },
  { id: 'brandbook', label: 'Brand Book',       icon: 'ti-books',            color: '#fff0e8', iconColor: '#a04010' },
]

// ---------------------------------------------------------------------------
// ASSET TYPES - Brand level (not tied to a specific product)
// ---------------------------------------------------------------------------
export const BRAND_ASSET_TYPES = [
  { id: 'logo',   label: 'Logo Pack',        icon: 'ti-vector-triangle', color: '#fef8e3', iconColor: '#8a6800' },
  { id: 'weekly', label: 'Weekly Inventory', icon: 'ti-calendar-stats',  color: '#e8f8f4', iconColor: '#0f6e56' },
]

export const ALL_ASSET_TYPES = [...SKU_ASSET_TYPES, ...BRAND_ASSET_TYPES]

// Legacy alias
export const ASSET_TYPES = ALL_ASSET_TYPES
