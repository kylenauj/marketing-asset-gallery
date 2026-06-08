import { useState, useEffect } from 'react'
import { supabase, PROVINCES, BRANDS, ASSET_TYPES } from './config.js'

const ALL = 'all'

export default function App() {
  const [province, setProvince] = useState(null)
  const [page, setPage] = useState('brands')
  const [assets, setAssets] = useState([])
  const [activeBrand, setActiveBrand] = useState(ALL)
  const [activeType, setActiveType] = useState(ALL)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!province) return
    setLoading(true)
    supabase.from('assets').select('*')
      .eq('province', province.code)
      .not('sharepoint_url', 'is', null)
      .neq('sharepoint_url', '')
      .then(({ data }) => { setAssets(data || []); setLoading(false) })
  }, [province])

  const provinceBrands = province ? BRANDS.filter(b => b.provinces.includes(province.code)) : []

  const filtered = assets.filter(a => {
    const matchBrand = activeBrand === ALL || a.brand === activeBrand
    const matchType = activeType === ALL || a.asset_type === activeType
    const matchQ = !search || a.label?.toLowerCase().includes(search.toLowerCase())
    return matchBrand && matchType && matchQ
  })

  if (!province) return <ProvinceGate onSelect={p => { setProvince(p); setActiveBrand(ALL); setActiveType(ALL); setPage('brands') }} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header province={province} page={page} onPage={setPage} onSwitch={() => setProvince(null)} />
      {page === 'brands' && (
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar brands={provinceBrands} assets={assets} activeBrand={activeBrand} onBrand={id => { setActiveBrand(id); setActiveType(ALL) }} />
          <Main assets={filtered} activeType={activeType} search={search} loading={loading} onType={setActiveType} onSearch={setSearch} />
        </div>
      )}
      {page === 'inventory' && <InventoryPage province={province} />}
    </div>
  )
}

function ProvinceGate({ onSelect }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f4f0 0%, #e8f0e4 100%)' }}>
      <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 24px' }}>
        <div style={{ width: 56, height: 56, background: '#004B6C', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 22, fontWeight: 500, color: '#fff' }}>M</div>
        <h1 style={{ fontSize: 26, fontWeight: 500, color: '#1a1a1a', marginBottom: 8 }}>Retailer asset hub</h1>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 36, lineHeight: 1.6 }}>Marketing materials for licensed Canadian retailers.<br />Select your province to get started.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {PROVINCES.map(p => (
            <button key={p.code} onClick={() => onSelect(p)} style={{ padding: '18px 16px', border: '1px solid #e0deda', borderRadius: 12, background: '#fff', cursor: 'pointer', textAlign: 'center', fontFamily: 'var(--font)', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#004B6C'; e.currentTarget.style.background = '#f0f6fa' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0deda'; e.currentTarget.style.background = '#fff' }}>
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

function Header({ province, page, onPage, onSwitch }) {
  return (
    <div style={{ background: '#004B6C', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 34, height: 34, background: '#A2D074', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, color: '#2a4a0a' }}>M</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>Mera Cannabis — Retailer Hub</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>Licensed retailer use only</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 3, gap: 2, marginRight: 6 }}>
          {[{id:'brands', label:'Brands', icon:'ti-layout-grid'}, {id:'inventory', label:'Inventory', icon:'ti-package'}].map(t => (
            <button key={t.id} onClick={() => onPage(t.id)} style={{
              padding: '4px 14px', borderRadius: 17, fontSize: 12, fontWeight: 500,
              border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.15s',
              background: page === t.id ? '#fff' : 'none',
              color: page === t.id ? '#004B6C' : 'rgba(255,255,255,0.65)',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <i className={`ti ${t.icon}`} style={{ fontSize: 13 }} />
              {t.label}
            </button>
          ))}
        </div>
        <span style={{ background: '#EDDC61', color: '#5a4e00', fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20 }}>{province.name}</span>
        <button onClick={onSwitch} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.7)', fontSize: 12, padding: '4px 12px', borderRadius: 20, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <i className="ti ti-refresh" style={{ fontSize: 12 }} /> Switch province
        </button>
      </div>
    </div>
  )
}

function Sidebar({ brands, assets, activeBrand, onBrand }) {
  const countFor = id => assets.filter(a => a.brand === id).length
  return (
    <div style={{ width: 200, minWidth: 200, background: '#fff', borderRight: '1px solid #e8e6e0', padding: '16px 0', position: 'sticky', top: 63, alignSelf: 'flex-start', height: 'calc(100vh - 63px)', overflowY: 'auto' }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 16px 10px' }}>Brands</div>
      {[{ id: ALL, name: 'All brands', color: '#ccc' }, ...brands].map(b => {
        const count = b.id === ALL ? assets.length : countFor(b.id)
        const active = activeBrand === b.id
        return (
          <div key={b.id} onClick={() => onBrand(b.id)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 16px', cursor: 'pointer', borderLeft: `2px solid ${active ? '#004B6C' : 'transparent'}`, background: active ? '#f0f6fa' : 'transparent', transition: 'all 0.12s' }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8f7f4' }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: b.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: active ? 500 : 400, color: active ? '#004B6C' : '#444', flex: 1, lineHeight: 1.3 }}>{b.name}</span>
            <span style={{ fontSize: 11, color: active ? '#004B6C' : '#999', background: active ? '#d8eaf5' : '#f0ede8', padding: '1px 6px', borderRadius: 10 }}>{count}</span>
          </div>
        )
      })}
    </div>
  )
}

function Main({ assets, activeType, search, loading, onType, onSearch }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{ padding: '12px 20px', background: '#fff', borderBottom: '1px solid #e8e6e0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#999' }} />
          <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Search assets..."
            style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid #e0deda', borderRadius: 8, fontSize: 13, color: '#1a1a1a', background: '#fafaf8', outline: 'none' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 0, padding: '0 20px', background: '#fff', borderBottom: '1px solid #e8e6e0', overflowX: 'auto' }}>
        {[{ id: 'all', label: 'All types', icon: 'ti-layout-grid' }, ...ASSET_TYPES].map(t => (
          <button key={t.id} onClick={() => onType(t.id)} style={{ padding: '11px 14px', fontSize: 12, border: 'none', borderBottom: `2px solid ${activeType === t.id ? '#004B6C' : 'transparent'}`, background: 'none', color: activeType === t.id ? '#004B6C' : '#777', fontWeight: activeType === t.id ? 500 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap', fontFamily: 'var(--font)', transition: 'all 0.12s' }}>
            <i className={`ti ${t.icon}`} style={{ fontSize: 14 }} />{t.label}
          </button>
        ))}
      </div>
      <div style={{ padding: '20px', flex: 1 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999', fontSize: 13 }}>
            <i className="ti ti-loader" style={{ fontSize: 24, display: 'block', marginBottom: 8 }} />Loading assets...
          </div>
        ) : assets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999', fontSize: 13 }}>
            <i className="ti ti-photo-off" style={{ fontSize: 28, display: 'block', marginBottom: 8, color: '#ccc' }} />No assets found.
          </div>
        ) : (
          <>
            <div style={{ fontSize: 11, color: '#999', marginBottom: 14 }}>{assets.length} asset{assets.length !== 1 ? 's' : ''}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {assets.map(a => <AssetCard key={a.id} asset={a} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function AssetCard({ asset }) {
  const typeInfo = ASSET_TYPES.find(t => t.id === asset.asset_type) || ASSET_TYPES[0]
  const brand = BRANDS.find(b => b.id === asset.brand)
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e6e0', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.12s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#c0cdd6'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e6e0'}>
      <div style={{ height: 96, background: typeInfo.color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <i className={`ti ${typeInfo.icon}`} style={{ fontSize: 30, color: typeInfo.iconColor }} />
        {asset.is_new && <span style={{ position: 'absolute', top: 8, right: 8, background: '#A2D074', color: '#2a4a0a', fontSize: 9, fontWeight: 500, padding: '2px 7px', borderRadius: 10 }}>New</span>}
        {brand && <span style={{ position: 'absolute', bottom: 8, left: 8, background: brand.color, color: '#fff', fontSize: 9, fontWeight: 500, padding: '2px 7px', borderRadius: 10, opacity: 0.9 }}>{brand.name}</span>}
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.3, marginBottom: 6 }}>{asset.label || typeInfo.label}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#999' }}>{asset.file_size || typeInfo.label}</span>
          <a href={asset.sharepoint_url} target="_blank" rel="noopener noreferrer" style={{ color: '#004B6C', fontSize: 16, lineHeight: 1, textDecoration: 'none', transition: 'color 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#A2D074'}
            onMouseLeave={e => e.currentTarget.style.color = '#004B6C'}>
            <i className="ti ti-download" />
          </a>
        </div>
      </div>
    </div>
  )
}

function InventoryPage({ province }) {
  const [html, setHtml] = useState(null)
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    supabase.from('inventory').select('*')
      .eq('province', province.code)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setHtml(data?.html || null)
        setMeta(data)
        setLoading(false)
      })
  }, [province])

  const lastUpdated = meta?.updated_at
    ? new Date(meta.updated_at).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div style={{ flex: 1, background: '#f5f4f0' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#1a1a1a' }}>{province.name} — weekly inventory</div>
            {lastUpdated && <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>Published {lastUpdated}</div>}
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999', fontSize: 13 }}>
            <i className="ti ti-loader" style={{ fontSize: 24, display: 'block', marginBottom: 8 }} />Loading inventory...
          </div>
        )}

        {!loading && !html && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999', fontSize: 13, background: '#fff', borderRadius: 12, border: '1px solid #e8e6e0' }}>
            <i className="ti ti-package-off" style={{ fontSize: 28, display: 'block', marginBottom: 10, color: '#ccc' }} />
            No inventory published yet for {province.name}.<br />
            <span style={{ fontSize: 12, color: '#bbb', marginTop: 6, display: 'block' }}>Check back after the weekly update.</span>
          </div>
        )}

        {!loading && html && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e6e0', overflow: 'hidden' }}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}
      </div>
    </div>
  )
}
