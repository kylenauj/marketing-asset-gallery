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
  { id: 'litti',       name: 'LITTI.',                    color: '#004B6C', provinces: ['ON','AB','BC','SK'] },
  { id: 'greazy',      name: 'GREAZY',                    color: '#A2D074', provinces: ['ON','AB','BC'] },
  { id: 'shatterizer', name: 'Shatterizer',               color: '#EDDC61', provinces: ['ON','AB','SK'] },
  { id: 'buddyblooms', name: 'Buddy Blooms',              color: '#f0997b', provinces: ['ON','BC'] },
  { id: 'countryside', name: 'Countryside Cannabis',      color: '#97C459', provinces: ['ON'] },
  { id: 'ellevia',     name: 'Ellevia',                   color: '#ED93B1', provinces: ['ON','AB','BC'] },
]

export const ASSET_TYPES = [
  { id: 'sellsheet', label: 'Sell sheet',             icon: 'ti-file-description', color: '#fce9e9', iconColor: '#b83232' },
  { id: 'logo',      label: 'Logo pack',              icon: 'ti-vector-triangle',  color: '#fef8e3', iconColor: '#8a6800' },
  { id: 'tvad',      label: 'TV ad',                  icon: 'ti-device-tv',        color: '#e8eef8', iconColor: '#2a4fa0' },
  { id: 'webcard',   label: 'Web product card',       icon: 'ti-browser',          color: '#e8f4ec', iconColor: '#2d7a45' },
  { id: 'weekly',    label: 'Weekly inventory',       icon: 'ti-calendar-stats',   color: '#e8f8f4', iconColor: '#0f6e56' },
  { id: 'pk',        label: 'Product knowledge',      icon: 'ti-bulb',             color: '#f3e8fc', iconColor: '#6a2da0' },
  { id: 'brandbook', label: 'Brand book',             icon: 'ti-books',            color: '#fff0e8', iconColor: '#a04010' },
]
