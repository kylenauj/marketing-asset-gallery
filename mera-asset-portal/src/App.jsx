import { useState, useEffect, useCallback } from 'react'
import { supabase, PROVINCES, BRANDS, SKU_ASSET_TYPES, BRAND_ASSET_TYPES, ALL_ASSET_TYPES } from './config.js'

const brandById = id => BRANDS.find(b => b.id === id)

const BANNER_DEFAULTS = {
  active: true,
  title: 'New photos available',
  body: 'Fresh lifestyle and product photography is now live. Check each brand for updated assets.',
  imageUrl: '',
  cta: '',
  ctaUrl: '',
  color: '#004B6C',
}

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
        {nav.view === 'inventory' && <InventoryPage go={go} />}
      </div>
    </div>
  )
}

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

function Header({ province, nav, go, onSwitch }) {
  const crumbs = []
  if (nav.brandId) crumbs.push({ label: brandById(nav.brandId)?.name || nav.brandId, action: () => go({ view: 'brand', brandId: nav.brandId }) })
  if (nav.view === 'sku') crumbs.push({ label: 'Product detail', action: null })
  return (
    <div style={{ background: '#004B6C', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, height: 56 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div onClick={() => go({ view: 'hub' })} style={{ width: 34, height: 34, background: '#A2D074', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#2a4a0a', cursor: 'pointer', letterSpacing: '-0.5px' }}>M</div>
        <span onClick={() => go({ view: 'hub' })} style={{ fontSize: 14, color: nav.view === 'hub' ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: nav.view === 'hub' ? 600 : 400, cursor: 'pointer' }}>Hub</span>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="ti ti-chevron-right" style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }} />
            <span onClick={c.action || undefined} style={{ fontSize: 14, color: c.action ? 'rgba(255,255,255,0.75)' : '#fff', fontWeight: c.action ? 400 : 500, cursor: c.action ? 'pointer' : 'default' }}>{c.label}</span>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => go({ view: 'inventory' })}
          style={{
            background: nav.view === 'inventory' ? '#EDDC61' : '#A2D074',
            border: 'none',
            color: nav.view === 'inventory' ? '#5a4e00' : '#2a4a0a',
            fontSize: 13,
            fontWeight: 700,
            padding: '8px 18px',
            borderRadius: 8,
            cursor: 'pointer',
            fontFamily: 'var(--font)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            letterSpacing: '0.01em',
            boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          }}>
          <i className="ti ti-clipboard-list" style={{ fontSize: 15 }} /> Weekly Inventory
        </button>
        <span style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.18)' }}>{province.name}</span>
        <button onClick={onSwitch} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.6)', fontSize: 12, padding: '5px 12px', borderRadius: 20, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <i className="ti ti-refresh" style={{ fontSize: 12 }} /> Switch
        </button>
      </div>
    </div>
  )
}

function HubPage({ province, go }) {
  const [newCounts, setNewCounts] = useState({})
  const [totalCounts, setTotalCounts] = useState({})
  const [banner, setBanner] = useState(BANNER_DEFAULTS)
  const provinceBrands = BRANDS.filter(b => b.provinces.includes(province.code))

  useEffect(() => {
    supabase.from('site_config').select('value').eq('key', 'banner').maybeSingle()
      .then(({ data }) => { if (data?.value) setBanner({ ...BANNER_DEFAULTS, ...data.value }) })
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
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 24px' }}>
      {banner.active && (
        <div style={{ background: banner.color || '#004B6C', borderRadius: 14, marginBottom: 32, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,75,108,0.13)' }}>
          {banner.imageUrl && <img src={banner.imageUrl} alt="" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />}
          <div style={{ padding: '18px 24px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Update</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{banner.title}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{banner.body}</div>
            {banner.cta && banner.ctaUrl && (
              <a href={banner.ctaUrl} target="_blank" rel="noreferrer"
                style={{ display: 'inline-block', marginTop: 14, background: '#A2D074', color: '#2a4a0a', fontSize: 13, fontWeight: 700, padding: '8px 18px', borderRadius: 8, textDecoration: 'none' }}>
                {banner.cta}
              </a>
            )}
          </div>
        </div>
      )}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Brands - {province.name}</h2>
        <p style={{ fontSize: 14, color: '#888', margin: 0 }}>Select a brand to browse products and assets.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {provinceBrands.map(b => {
          const count = totalCounts[b.id] || 0
          const hasNew = (newCounts[b.id] || 0) > 0
          return (
            <div key={b.id} onClick={() => go({ view: 'brand', brandId: b.id })}
              style={{ background: '#fff', border: '1px solid #e8e5e0', borderRadius: 14, padding: '20px 20px 16px', cursor: 'pointer', transition: 'all 0.15s', position: 'relative', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#004B6C'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,75,108,0.12)'; e.currentTarget.style.transform='translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#e8e5e0'; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.transform='none' }}>
              {hasNew && <span style={{ position: 'absolute', top: 14, right: 14, background: '#A2D074', color: '#2a4a0a', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>NEW</span>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                {b.logoUrl
                  ? <img src={b.logoUrl} alt={b.name} style={{ width: 42, height: 42, objectFit: 'contain', borderRadius: 8, border: '1px solid #eee', background: '#fafafa', padding: 4 }} />
                  : <div style={{ width: 42, height: 42, background: b.color, borderRadius: 8, flexShrink: 0 }} />
                }
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.01em' }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: '#999', marginTop: 1 }}>
                    {count > 0
                      ? count + ' product' + (count !== 1 ? 's' : '') + (hasNew ? ' · ' + newCounts[b.id] + ' new' : '')
                      : 'No products yet'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {SKU_ASSET_TYPES.map(t => (
                  <span key={t.id} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: t.color, color: t.iconColor, fontWeight: 600, letterSpacing: '0.02em' }}>{t.label}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BrandPage({ province, nav, go }) {
  const brand = brandById(nav.brandId)
  const [view, setView] = useState('skus')
  const [skus, setSkus] = useState([])
  const [loading, setLoading] = useState(true)
  const [assetTypeId, setAssetTypeId] = useState(null)

  useEffect(() => {
    setLoading(true)
    supabase.from('skus').select('*').eq('brand', nav.brandId).eq('province', province.code).order('name')
      .then(({ data }) => { setSkus(data || []); setLoading(false) })
  }, [nav.brandId, province.code])

  if (!brand) return <Empty msg="Brand not found" />

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 24px' }}>
      <button onClick={() => go({ view: 'hub' })} style={{ background: 'none', border: 'none', color: '#004B6C', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 20, padding: 0 }}>
        <i className="ti ti-arrow-left" style={{ fontSize: 14 }} /> Back to hub
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        {brand.logoUrl
          ? <img src={brand.logoUrl} alt={brand.name} style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 10, border: '1px solid #eee', background: '#fafafa', padding: 6 }} />
          : <div style={{ width: 56, height: 56, background: brand.color, borderRadius: 10, flexShrink: 0 }} />
        }
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', margin: 0, letterSpacing: '-0.02em' }}>{brand.name}</h2>
          <p style={{ fontSize: 14, color: '#888', margin: '2px 0 0' }}>{province.name} · {skus.length} product{skus.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, borderBottom: '1px solid #e8e5e0', paddingBottom: 0 }}>
        {['skus', ...BRAND_ASSET_TYPES.map(t => t.id)].map(tid => {
          const label = tid === 'skus' ? 'Products' : BRAND_ASSET_TYPES.find(t => t.id === tid)?.label || tid
          const active = view === tid
          return (
            <button key={tid} onClick={() => { setView(tid); setAssetTypeId(tid === 'skus' ? null : tid) }}
              style={{ background: 'none', border: 'none', borderBottom: active ? '2px solid #004B6C' : '2px solid transparent', color: active ? '#004B6C' : '#888', fontSize: 13, fontWeight: active ? 700 : 500, padding: '8px 14px', cursor: 'pointer', fontFamily: 'var(--font)', marginBottom: -1, borderRadius: 0 }}>
              {label}
            </button>
          )
        })}
      </div>
      {loading ? <Spinner /> : view === 'skus'
        ? <SkuListView skus={skus} brand={brand} go={go} />
        : <BrandAssetTypeView brand={brand} assetTypeId={assetTypeId} province={province} />
      }
    </div>
  )
}

function SkuListView({ skus, brand, go }) {
  if (!skus.length) return <Empty msg="No products listed yet for this brand in your province." />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {skus.map(sku => (
        <div key={sku.id} onClick={() => go({ view: 'sku', skuId: sku.id, brandId: brand.id })}
          style={{ background: '#fff', border: '1px solid #e8e5e0', borderRadius: 12, padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.12s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#004B6C'; e.currentTarget.style.boxShadow='0 3px 10px rgba(0,75,108,0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='#e8e5e0'; e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ width: 36, height: 36, background: brand.color, borderRadius: 8, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {sku.is_new && <span style={{ background: '#A2D074', color: '#2a4a0a', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20, marginRight: 7, letterSpacing: '0.04em' }}>NEW</span>}
              {sku.name}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {SKU_ASSET_TYPES.map(t => (
                <span key={t.id} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: t.color, color: t.iconColor, fontWeight: 600 }}>{t.label}</span>
              ))}
            </div>
          </div>
          <i className="ti ti-chevron-right" style={{ fontSize: 16, color: '#ccc' }} />
        </div>
      ))}
    </div>
  )
}

function AssetTypeView({ assets, loading }) {
  if (loading) return <Spinner />
  if (!assets?.length) return <Empty msg="No assets available yet." />
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
      {assets.map(a => <AssetCard key={a.id} asset={a} />)}
    </div>
  )
}

function BrandAssetTypeView({ brand, assetTypeId, province }) {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    supabase.from('assets').select('*').eq('brand', brand.id).eq('asset_type', assetTypeId).eq('province', province.code)
      .then(({ data }) => { setAssets(data || []); setLoading(false) })
  }, [brand.id, assetTypeId, province.code])
  return <AssetTypeView assets={assets} loading={loading} />
}

function SkuPage({ province, nav, go }) {
  const brand = brandById(nav.brandId)
  const [sku, setSku] = useState(null)
  const [activeType, setActiveType] = useState(SKU_ASSET_TYPES[0].id)
  const [assets, setAssets] = useState([])
  const [loadingAssets, setLoadingAssets] = useState(false)

  useEffect(() => {
    supabase.from('skus').select('*').eq('id', nav.skuId).maybeSingle()
      .then(({ data }) => setSku(data))
  }, [nav.skuId])

  useEffect(() => {
    if (!nav.skuId) return
    setLoadingAssets(true)
    supabase.from('assets').select('*').eq('sku_id', nav.skuId).eq('asset_type', activeType)
      .then(({ data }) => { setAssets(data || []); setLoadingAssets(false) })
  }, [nav.skuId, activeType])

  if (!sku) return <div style={{ maxWidth: 960, margin: '40px auto', padding: '0 24px' }}><Spinner /></div>

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 24px' }}>
      <button onClick={() => go({ view: 'brand', brandId: nav.brandId })} style={{ background: 'none', border: 'none', color: '#004B6C', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 20, padding: 0 }}>
        <i className="ti ti-arrow-left" style={{ fontSize: 14 }} /> Back to {brand?.name}
      </button>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          {sku.is_new && <span style={{ background: '#A2D074', color: '#2a4a0a', fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20 }}>NEW</span>}
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: 0, letterSpacing: '-0.01em' }}>{sku.name}</h2>
        </div>
        {sku.format && <p style={{ fontSize: 13, color: '#888', margin: 0 }}>{brand?.name} · {sku.format}</p>}
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {SKU_ASSET_TYPES.map(t => (
          <button key={t.id} onClick={() => setActiveType(t.id)}
            style={{ background: activeType === t.id ? t.color : '#f0efec', border: activeType === t.id ? '1.5px solid ' + t.iconColor : '1.5px solid transparent', color: activeType === t.id ? t.iconColor : '#888', fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <i className={'ti ' + t.icon} style={{ fontSize: 13 }} /> {t.label}
          </button>
        ))}
      </div>
      {loadingAssets ? <Spinner /> : <AssetTypeView assets={assets} loading={false} />}
    </div>
  )
}

function AssetCard({ asset }) {
  return (
    <a href={asset.url} target="_blank" rel="noreferrer"
      style={{ display: 'block', background: '#fff', border: '1px solid #e8e5e0', borderRadius: 12, overflow: 'hidden', textDecoration: 'none', transition: 'all 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor='#004B6C'; e.currentTarget.style.boxShadow='0 4px 14px rgba(0,75,108,0.12)'; e.currentTarget.style.transform='translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='#e8e5e0'; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.transform='none' }}>
      {asset.thumbnail_url
        ? <img src={asset.thumbnail_url} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
        : <div style={{ width: '100%', height: 140, background: '#f0efec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ti ti-file" style={{ fontSize: 32, color: '#bbb' }} />
          </div>
      }
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 3 }}>{asset.name || 'Asset'}</div>
        {asset.description && <div style={{ fontSize: 11, color: '#999', lineHeight: 1.4 }}>{asset.description}</div>}
      </div>
    </a>
  )
}

function InventoryPage({ go }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('weekly_inventory').select('*').order('province').order('section').order('sort_order')
      .then(({ data, error }) => {
        if (error) {
          supabase.from('assets').select('*').eq('asset_type', 'weekly').order('brand')
            .then(({ data: d2 }) => { setItems(d2 || []); setLoading(false) })
        } else {
          setItems(data || []); setLoading(false)
        }
      })
  }, [])

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button onClick={() => go({ view: 'hub' })} style={{ background: '#f0efec', border: 'none', color: '#004B6C', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8 }}>
          <i className="ti ti-arrow-left" style={{ fontSize: 14 }} /> Back to Hub
        </button>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: 0, letterSpacing: '-0.01em' }}>Weekly Inventory</h2>
          <p style={{ fontSize: 13, color: '#999', margin: '2px 0 0' }}>Current stock across all provinces</p>
        </div>
      </div>

      {loading ? <Spinner /> : items.length === 0
        ? (
          <div style={{ background: '#fff', border: '1px solid #e8e5e0', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <i className="ti ti-clipboard-list" style={{ fontSize: 40, color: '#ccc', display: 'block', marginBottom: 12 }} />
              <div style={{ fontSize: 16, fontWeight: 600, color: '#888', marginBottom: 6 }}>No inventory report yet</div>
              <div style={{ fontSize: 13, color: '#bbb' }}>Weekly inventory drops will appear here.</div>
            </div>
          </div>
        )
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.map((item, i) => {
              const brand = brandById(item.brand)
              return (
                <div key={item.id || i} style={{ background: '#fff', border: '1px solid #e8e5e0', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  {brand && <div style={{ width: 10, height: 10, background: brand.color, borderRadius: '50%', flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{item.name || item.title || 'Item'}</div>
                    {item.brand && <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{brand?.name || item.brand} {item.province ? ' · ' + item.province : ''}</div>}
                  </div>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer"
                      style={{ fontSize: 12, fontWeight: 600, color: '#004B6C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      View <i className="ti ti-external-link" style={{ fontSize: 12 }} />
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        )
      }
    </div>
  )
}

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
      <div style={{ width: 28, height: 28, border: '3px solid #e8e5e0', borderTopColor: '#004B6C', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )
}

function Empty({ msg }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: '#aaa' }}>
      <i className="ti ti-inbox" style={{ fontSize: 36, display: 'block', marginBottom: 10 }} />
      <div style={{ fontSize: 14, fontWeight: 500 }}>{msg}</div>
    </div>
  )
}
