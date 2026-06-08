import { useState, useEffect, useCallback } from 'react'
import { supabase, PROVINCES, BRANDS, SKU_ASSET_TYPES, BRAND_ASSET_TYPES, ALL_ASSET_TYPES } from './config.js'

const brandById = id => BRANDS.find(b => b.id === id)
const typeById = id => ALL_ASSET_TYPES.find(t => t.id === id)
// -- Hub banner ----------------------------------------------------------------
// Edit BANNER to update the hub page announcement. Set active: false to hide it.
export const BANNER = {
  active: true,
  title: 'New photos available',
  body: 'Fresh lifestyle and product photography is now live. Check each brand for updated assets.',
  cta: null,     // e.g. 'View assets' - set to null to hide button
  ctaUrl: null,  // e.g. 'https://...'
  color: '#004B6C',
}


// Ã¢ÂÂÃ¢ÂÂ App Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
export default function App() {
  const [province, setProvince] = useState(null)
  const [nav, setNav] = useState({ view: 'hub' })
  const go = useCallback((next) => setNav(next), [])
  if (!province) {
    return <ProvinceGate onSelect={p => { setProvince(p); setNav({ view: 'hub' }) }} />
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f4f0' }}>
      <Header province={province} nav={nav} go={go} onSwitch={() => setProvince(null)} />
      <div style={{ flex: 1 }}>
        {nav.view === 'hub' && <HubPage province={province} go={go} />}
        {nav.view === 'brand' && <BrandPage province={province} nav={nav} go={go} />}
        {nav.view === 'sku' && <SkuPage province={province} nav={nav} go={go} />}
        {nav.view === 'inventory' && <InventoryPage />}
      </div>
    </div>
  )
}

// Ã¢ÂÂÃ¢ÂÂ Province gate Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
function ProvinceGate({ onSelect }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#f5f4f0 0%,#e8f0e4 100%)' }}>
      <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 24px' }}>
        <div style={{ width: 56, height: 56, background: '#004B6C', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 22, fontWeight: 500, color: '#fff' }}>M</div>
        <h1 style={{ fontSize: 26, fontWeight: 500, color: '#1a1a1a', marginBottom: 8 }}>Retailer asset hub</h1>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 36, lineHeight: 1.6 }}>Marketing materials for licensed Canadian retailers.<br />Select your province to get started.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {PROVINCES.map(p => (
            <button key={p.code} onClick={() => onSelect(p)}
              style={{ padding: '18px 16px', border: '1px solid #e0deda', borderRadius: 12, background: '#fff', cursor: 'pointer', textAlign: 'center', fontFamily: 'var(--font)', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#004B6C'; e.currentTarget.style.background='#f0f6fa' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#e0deda'; e.currentTarget.style.background='#fff' }}>
              <div style={{ fontSize: 22, fontWeight: 500, color: '#004B6C', marginBottom: 4 }}>{p.code}</div>
              <div style={{ fontSize: 13, color: '#555' }}>{p.name}</div>
            </button>
          ))}
        </div>
        <p style={{ marginTop: 20, fontSize: 12, color: '#999' }}>Don't see your province? <a href="mailto:hello@meracannabis.com" style={{ color: '#004B6C' }}>Contact us</a></p>
      </div>
    </div>
  )
}

// Ã¢ÂÂÃ¢ÂÂ Header Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
function Header({ province, nav, go, onSwitch }) {
  const crumbs = []
  if (nav.brandId) crumbs.push({ label: brandById(nav.brandId)?.name || nav.brandId, action: () => go({ view: 'brand', brandId: nav.brandId }) })
  if (nav.view === 'sku') crumbs.push({ label: 'Product detail', action: null })
  return (
    <div style={{ background: '#004B6C', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div onClick={() => go({ view: 'hub' })} style={{ width: 34, height: 34, background: '#A2D074', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, color: '#2a4a0a', cursor: 'pointer' }}>M</div>
        <span onClick={() => go({ view: 'hub' })} style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', cursor: 'pointer' }}>Hub</span>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="ti ti-chevron-right" style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }} />
            <span onClick={c.action || undefined} style={{ fontSize: 14, color: c.action ? 'rgba(255,255,255,0.75)' : '#fff', fontWeight: c.action ? 400 : 500, cursor: c.action ? 'pointer' : 'default' }}>{c.label}</span>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button onClick={() => go({ view: 'inventory' })} style={{ background: nav.view === 'inventory' ? '#fff' : 'rgba(255,255,255,0.1)', border: 'none', color: nav.view === 'inventory' ? '#004B6C' : 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 16, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <i className="ti ti-package" style={{ fontSize: 13 }} /> Inventory
        </button>
        <span style={{ background: '#EDDC61', color: '#5a4e00', fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20 }}>{province.name}</span>
        <button onClick={onSwitch} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.7)', fontSize: 12, padding: '4px 12px', borderRadius: 20, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <i className="ti ti-refresh" style={{ fontSize: 12 }} /> Switch
        </button>
      </div>
    </div>
  )
}
// Ã¢ÂÂÃ¢ÂÂ Hub page Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
function HubPage({ province, go }) {
  const [newCounts, setNewCounts] = useState({})
  const [totalCounts, setTotalCounts] = useState({})
  const [banner, setBanner] = useState(BANNER)
  const provinceBrands = BRANDS.filter(b => b.provinces.includes(province.code))

  useEffect(() => {
    supabase.from('site_config').select('value').eq('key', 'banner').maybeSingle()
      .then(({ data }) => { if (data?.value) setBanner({ ...BANNER, ...data.value }) })
  }, [])

  useEffect(() => {
    supabase.from('skus').select('brand,is_new').eq('province', province.code)
      .then(({ data }) => {
        const tot = {}, nw = {}
        ;(data || []).forEach(r => {
          tot[r.brand] = (tot[r.brand] || 0) + 1
          if (r.is_new) nw[r.brand] = (nw[r.brand] || 0) + 1
        })
        setTotalCounts(tot); setNewCounts(nw)
      })
  }, [province.code])

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '36px 24px' }}>
      {banner.active && (
        <div style={{ background: banner.color || BANNER.color, borderRadius: 12, marginBottom: 28, overflow: 'hidden' }}>
          {banner.imageUrl && (
            <img src={banner.imageUrl} alt="" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />
          )}
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{banner.title || BANNER.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{banner.body || BANNER.body}</div>
            </div>
            {banner.cta && banner.ctaUrl && (
              <a href={banner.ctaUrl} target="_blank" rel="noopener noreferrer"
                style={{ flexShrink: 0, background: '#fff', color: banner.color || BANNER.color, fontSize: 12, fontWeight: 600, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                {banner.cta}
              </a>
            )}
          </div>
        </div>
      )}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Brands Ã¢ÂÂ {province.name}</h2>
        <p style={{ fontSize: 13, color: '#777' }}>Select a brand to browse products and assets.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {provinceBrands.map(b => {
          const hasNew = (newCounts[b.id] || 0) > 0
          const count = totalCounts[b.id] || 0
          return (
            <div key={b.id} onClick={() => go({ view: 'brand', brandId: b.id })}
              style={{ background: '#fff', border: '1px solid #e8e6e0', borderRadius: 14, padding: '24px 20px', cursor: 'pointer', transition: 'all 0.15s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#004B6C'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,75,108,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#e8e6e0'; e.currentTarget.style.boxShadow='none' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: b.color, borderRadius: '14px 14px 0 0' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, background: b.color + '22', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 20, height: 20, background: b.color, borderRadius: 4 }} />
                </div>
                {hasNew && <span style={{ background: '#d4f5d4', color: '#1a6b1a', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>NEW</span>}
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>{b.name}</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
                {count > 0 ? `${count} product${count !== 1 ? 's' : ''}${hasNew ? ` ÃÂ· ${newCounts[b.id]} new` : ''}` : 'No products yet'}
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {SKU_ASSET_TYPES.map(t => (
                  <span key={t.id} style={{ fontSize: 10, background: t.color, color: t.iconColor, padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>{t.label}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Ã¢ÂÂÃ¢ÂÂ Brand page Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
function BrandPage({ province, nav, go }) {
  const { brandId } = nav
  const b = brandById(brandId)
  const [skus, setSkus] = useState([])
  const [brandAssets, setBrandAssets] = useState([])
  const [view, setView] = useState('skus')
  const [loading, setLoading] = useState(true)
  const [skuAssets, setSkuAssets] = useState([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      supabase.from('skus').select('*').eq('brand', brandId).eq('province', province.code).order('sort_order').order('name'),
      supabase.from('brand_assets').select('*').eq('brand', brandId).eq('province', province.code).order('sort_order'),
    ]).then(([{ data: s }, { data: ba }]) => {
      const skuList = s || []
      setSkus(skuList)
      setBrandAssets(ba || [])
      if (skuList.length > 0) {
        const ids = skuList.map(sk => sk.id)
        supabase.from('sku_assets').select('*').in('sku_id', ids).order('sort_order')
          .then(({ data: sa }) => { setSkuAssets(sa || []); setLoading(false) })
      } else { setLoading(false) }
    })
  }, [brandId, province.code])

  const tabs = [
    { id: 'skus', label: 'By Product', icon: 'ti-list' },
    ...SKU_ASSET_TYPES.map(t => ({ id: t.id, label: t.label, icon: t.icon })),
    ...BRAND_ASSET_TYPES.filter(t => brandAssets.some(a => a.asset_type === t.id)).map(t => ({ id: t.id, label: t.label, icon: t.icon })),
  ]

  if (!b) return null
  return (
    <div style={{ maxWidth: 1060, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #e8e6e0' }}>
        <div style={{ width: 48, height: 48, background: b.color + '22', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 24, height: 24, background: b.color, borderRadius: 5 }} />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{b.name}</h2>
          <div style={{ fontSize: 12, color: '#888' }}>{skus.length} product{skus.length !== 1 ? 's' : ''} in {province.name}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#f0eeea', borderRadius: 10, padding: 4, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            padding: '7px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 12, fontWeight: 500,
            background: view === t.id ? '#fff' : 'none', color: view === t.id ? '#004B6C' : '#666',
            boxShadow: view === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.12s',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <i className={`ti ${t.icon}`} style={{ fontSize: 13 }} />{t.label}
          </button>
        ))}
      </div>
      {loading ? <Spinner /> : (
        <>
          {view === 'skus' && <SkuListView skus={skus} skuAssets={skuAssets} go={go} nav={nav} />}
          {SKU_ASSET_TYPES.some(t => t.id === view) && <AssetTypeView typeId={view} skus={skus} skuAssets={skuAssets} go={go} nav={nav} />}
          {BRAND_ASSET_TYPES.some(t => t.id === view) && <BrandAssetTypeView typeId={view} brandAssets={brandAssets} />}
        </>
      )}
    </div>
  )
}

// Ã¢ÂÂÃ¢ÂÂ SKU list view Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
function SkuListView({ skus, skuAssets, go, nav }) {
  if (skus.length === 0) return <Empty icon="ti-box" text="No products added yet." />
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
      {skus.map(s => {
        const myAssets = skuAssets.filter(a => a.sku_id === s.id)
        const typeIds = [...new Set(myAssets.map(a => a.asset_type))]
        return (
          <div key={s.id} onClick={() => go({ view: 'sku', brandId: nav.brandId, skuId: s.id })}
            style={{ background: '#fff', border: '1px solid #e8e6e0', borderRadius: 12, padding: '18px 16px', cursor: 'pointer', transition: 'all 0.12s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#004B6C'; e.currentTarget.style.background='#f8fbfd' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#e8e6e0'; e.currentTarget.style.background='#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', flex: 1, marginRight: 8 }}>{s.name}</div>
              {s.is_new && <span style={{ background: '#d4f5d4', color: '#1a6b1a', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, whiteSpace: 'nowrap' }}>NEW</span>}
            </div>
            {s.sku_code && <div style={{ fontSize: 11, color: '#999', marginBottom: 10 }}>SKU: {s.sku_code}</div>}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {SKU_ASSET_TYPES.map(t => {
                const cnt = myAssets.filter(a => a.asset_type === t.id).length
                return (
                  <span key={t.id} style={{ fontSize: 10, background: cnt > 0 ? t.color : '#f0f0f0', color: cnt > 0 ? t.iconColor : '#bbb', padding: '2px 8px', borderRadius: 10, fontWeight: 500, opacity: cnt > 0 ? 1 : 0.7 }}>
                    {t.label}{cnt > 1 ? ` (${cnt})` : ''}
                  </span>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
// Ã¢ÂÂÃ¢ÂÂ Asset type view Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
function AssetTypeView({ typeId, skus, skuAssets, go, nav }) {
  const t = SKU_ASSET_TYPES.find(x => x.id === typeId)
  const filtered = skuAssets.filter(a => a.asset_type === typeId)
  if (filtered.length === 0) return <Empty icon={t?.icon || 'ti-file'} text={`No ${t?.label || typeId} assets uploaded yet.`} />
  const skuMap = {}
  skus.forEach(s => { skuMap[s.id] = s })
  const uniqueSkuIds = [...new Set(filtered.map(a => a.sku_id))]
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: '#666' }}>{filtered.length} file{filtered.length !== 1 ? 's' : ''} across {uniqueSkuIds.length} product{uniqueSkuIds.length !== 1 ? 's' : ''}</div>
        <a href={`data:text/plain,${encodeURIComponent(filtered.map(a=>`${skuMap[a.sku_id]?.name}\t${a.label||''}\t${a.url}`).join('\n'))}`}
          download={`${typeId}-urls.txt`}
          style={{ fontSize: 12, color: '#004B6C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid #004B6C', borderRadius: 8 }}>
          <i className="ti ti-download" style={{ fontSize: 13 }} /> Download all URLs
        </a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 10 }}>
        {filtered.map(a => {
          const sku = skuMap[a.sku_id]
          return (
            <AssetCard key={a.id} asset={a} sku={sku} typeInfo={t}
              onSkuClick={() => go({ view: 'sku', brandId: nav.brandId, skuId: a.sku_id })} />
          )
        })}
      </div>
    </div>
  )
}

// Ã¢ÂÂÃ¢ÂÂ Brand asset type view Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
function BrandAssetTypeView({ typeId, brandAssets }) {
  const t = ALL_ASSET_TYPES.find(x => x.id === typeId)
  const files = brandAssets.filter(a => a.asset_type === typeId)
  if (files.length === 0) return <Empty icon={t?.icon || 'ti-file'} text={`No ${t?.label || typeId} assets uploaded yet.`} />
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 10 }}>
      {files.map(a => <AssetCard key={a.id} asset={a} typeInfo={t} />)}
    </div>
  )
}

// Ã¢ÂÂÃ¢ÂÂ SKU detail page Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
function SkuPage({ province, nav, go }) {
  const { brandId, skuId } = nav
  const b = brandById(brandId)
  const [sku, setSku] = useState(null)
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('skus').select('*').eq('id', skuId).single(),
      supabase.from('sku_assets').select('*').eq('sku_id', skuId).order('sort_order'),
    ]).then(([{ data: s }, { data: a }]) => {
      setSku(s); setAssets(a || []); setLoading(false)
    })
  }, [skuId])

  if (loading) return <div style={{ padding: 40 }}><Spinner /></div>
  if (!sku) return null

  const grouped = {}
  assets.forEach(a => { if (!grouped[a.asset_type]) grouped[a.asset_type] = []; grouped[a.asset_type].push(a) })

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ background: '#fff', border: '1px solid #e8e6e0', borderRadius: 14, padding: '20px 22px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: b?.color || '#ccc' }} />
              <span style={{ fontSize: 12, color: '#888' }}>{b?.name}</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>{sku.name}</h2>
            {sku.sku_code && <div style={{ fontSize: 12, color: '#999' }}>SKU: {sku.sku_code}</div>}
          </div>
          {sku.is_new && <span style={{ background: '#d4f5d4', color: '#1a6b1a', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>NEW</span>}
        </div>
      </div>
      {SKU_ASSET_TYPES.map(t => {
        const group = grouped[t.id] || []
        return (
          <div key={t.id} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, background: t.color, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`ti ${t.icon}`} style={{ fontSize: 13, color: t.iconColor }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{t.label}</span>
              <span style={{ fontSize: 12, color: '#aaa' }}>({group.length})</span>
            </div>
            {group.length === 0
              ? <div style={{ fontSize: 12, color: '#bbb', padding: '10px 0' }}>No {t.label.toLowerCase()} uploaded yet</div>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 10 }}>
                  {group.map(a => <AssetCard key={a.id} asset={a} typeInfo={t} />)}
                </div>
            }
          </div>
        )
      })}
      {Object.keys(grouped).length === 0 && <Empty icon="ti-photo-off" text="No assets uploaded for this product yet." />}
    </div>
  )
}

// Ã¢ÂÂÃ¢ÂÂ Asset card Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
function AssetCard({ asset, sku, typeInfo, onSkuClick }) {
  const t = typeInfo || ALL_ASSET_TYPES.find(x => x.id === asset.asset_type) || {}
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e6e0', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: t.color || '#f5f4f0', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className={`ti ${t.icon || 'ti-file'}`} style={{ fontSize: 15, color: t.iconColor || '#666' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {asset.label || t.label}
          </div>
          {sku && (
            <div onClick={e => { e.stopPropagation(); onSkuClick && onSkuClick() }}
              style={{ fontSize: 11, color: '#004B6C', cursor: onSkuClick ? 'pointer' : 'default', marginTop: 1 }}>
              {sku.name}{sku.is_new && <span style={{ marginLeft: 5, background: '#d4f5d4', color: '#1a6b1a', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 10 }}>NEW</span>}
            </div>
          )}
          {asset.file_size && <div style={{ fontSize: 10, color: '#aaa', marginTop: 1 }}>{asset.file_size}</div>}
        </div>
      </div>
      <div style={{ padding: '10px 16px' }}>
        <a href={asset.url} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#004B6C', color: '#fff', borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: 500, textDecoration: 'none', width: '100%' }}>
          <i className="ti ti-external-link" style={{ fontSize: 13 }} /> Open / Download
        </a>
      </div>
    </div>
  )
}

// Ã¢ÂÂÃ¢ÂÂ Inventory page Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
function InventoryPage() {
  const [inventories, setInventories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('inventory').select('*').order('province').order('updated_at', { ascending: false })
      .then(({ data }) => {
        const seen = {}
        const latest = (data || []).filter(r => { if (seen[r.province]) return false; seen[r.province] = true; return true; })
        setInventories(latest)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ padding: 40 }}><Spinner /></div>

  return (
    <div style={{ flex: 1, background: '#f5f4f0' }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '28px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 500, color: '#1a1a1a', marginBottom: 4 }}>Weekly Inventory</div>
          <div style={{ fontSize: 13, color: '#777' }}>Current inventory across all provinces.</div>
        </div>
        {inventories.length === 0 && <Empty icon="ti-package-off" text="No inventory published yet." />}
        {inventories.map(inv => (
          <div key={inv.province} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>
                {PROVINCES.find(p => p.code === inv.province)?.name || inv.province} — Weekly Inventory
              </div>
              {inv.updated_at && <div style={{ fontSize: 12, color: '#999' }}>Updated {new Date(inv.updated_at).toLocaleDateString()}</div>}
            </div>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e6e0', padding: 20 }} dangerouslySetInnerHTML={{ __html: inv.html }} />
          </div>
        ))}
      </div>
    </div>
  )
}
// Ã¢ÂÂÃ¢ÂÂ Shared UI Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
      <i className="ti ti-loader" style={{ fontSize: 24, display: 'block', marginBottom: 8, animation: 'spin 1s linear infinite' }} />
      LoadingÃ¢ÂÂ¦
    </div>
  )
}
function Empty({ icon, text }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: '#bbb' }}>
      <i className={`ti ${icon}`} style={{ fontSize: 28, display: 'block', marginBottom: 10 }} />
      <div style={{ fontSize: 13 }}>{text}</div>
    </div>
  )
}
