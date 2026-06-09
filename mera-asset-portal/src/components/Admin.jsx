import { useState, useEffect, useCallback } from 'react'
import { supabase, PROVINCES, BRANDS, SKU_ASSET_TYPES, BRAND_ASSET_TYPES, SKU_CATEGORIES } from '../config.js'

const sv = x => x || ''

export default function Admin() {
  const [session, setSession] = useState(undefined)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const login = async () => {
    setLoginLoading(true); setLoginErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    if (error) setLoginErr(error.message)
    setLoginLoading(false)
  }

  if (session === undefined) return <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>Loading...</div>

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4f0' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '36px 32px', width: 340, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ width: 40, height: 40, background: '#004B6C', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A2D074', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>M</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Admin sign in</h2>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Mera Cannabis Asset Portal</p>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email"
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: 8, padding: '10px 12px', fontSize: 14, fontFamily: 'var(--font)', marginBottom: 10, boxSizing: 'border-box' }} />
          <input value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="Password" type="password"
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: 8, padding: '10px 12px', fontSize: 14, fontFamily: 'var(--font)', marginBottom: 16, boxSizing: 'border-box' }} />
          {loginErr && <div style={{ color: '#c0392b', fontSize: 13, marginBottom: 12 }}>{loginErr}</div>}
          <button onClick={login} disabled={loginLoading}
            style={{ width: '100%', background: '#004B6C', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 0', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font)' }}>
            {loginLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </div>
    )
  }

  return <AdminPanel onSignOut={() => supabase.auth.signOut()} />
}
// -- Admin Panel ---------------------------------------------------------------
function AdminPanel({ onSignOut }) {
  const [tab, setTab] = useState('skus')
  const [province, setProvince] = useState('ON')
  const [brand, setBrand] = useState('litti')
  const tabs = [
    { id: 'skus', label: 'Products & Assets', icon: 'ti-list' },
    { id: 'brand', label: 'Brand Assets', icon: 'ti-vector-triangle' },
    { id: 'inventory', label: 'Inventory', icon: 'ti-package' },
    { id: 'banner', label: 'Hub Banner', icon: 'ti-speakerphone' },
  ]
  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0' }}>
      <div style={{ background: '#004B6C', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#A2D074', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#2a4a0a' }}>M</div>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>Mera Admin</span>
        </div>
        <button onClick={onSignOut} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.75)', fontSize: 12, padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <i className="ti ti-logout" style={{ fontSize: 12 }} /> Sign out
        </button>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Province</label>
            <select value={province} onChange={e => setProvince(e.target.value)} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontFamily: 'var(--font)', background: '#fff' }}>
              {PROVINCES.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Brand</label>
            <select value={brand} onChange={e => setBrand(e.target.value)} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontFamily: 'var(--font)', background: '#fff' }}>
              {BRANDS.filter(b => b.provinces.includes(province)).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 14px', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 12, fontWeight: 500, background: tab === t.id ? '#004B6C' : '#e8e6e0', color: tab === t.id ? '#fff' : '#444', display: 'flex', alignItems: 'center', gap: 5 }}>
                <i className={`ti ${t.icon}`} style={{ fontSize: 13 }} />{t.label}
              </button>
            ))}
          </div>
        </div>
        {tab === 'skus'      && <SkuManager province={province} brandId={brand} />}
        {tab === 'brand'     && <BrandAssetManager province={province} brandId={brand} />}
        {tab === 'inventory' && <InventoryManager province={province} />}
        {tab === 'banner' && <BannerManager />}
      </div>
    </div>
  )
}

// -- SKU Manager ---------------------------------------------------------------
function SkuManager({ province, brandId }) {
  const [skus, setSkus] = useState([])
  const [loading, setLoading] = useState(true)
  const [addName, setAddName] = useState('')
  const [addCode, setAddCode] = useState('')
  const [addCategory, setAddCategory] = useState('')
  const [adding, setAdding] = useState(false)
  const [expanded, setExpanded] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('skus').select('*').eq('brand', brandId).eq('province', province).order('sort_order').order('name')
    setSkus(data || [])
    setLoading(false)
  }, [brandId, province])

  useEffect(() => { load() }, [load])

  const addSku = async () => {
    if (!addName.trim()) return
    setAdding(true)
    await supabase.from('skus').insert({ brand: brandId, province, name: addName.trim(), sku_code: addCode.trim(), category: addCategory || null })
    setAddName(''); setAddCode(''); setAdding(false); load()
  }

  const deleteSku = async (id) => {
    if (!confirm('Delete this product and all its assets?')) return
    await supabase.from('skus').delete().eq('id', id)
    if (expanded === id) setExpanded(null)
    load()
  }

  const toggleNew = async (sku) => {
    await supabase.from('skus').update({ is_new: !sku.is_new }).eq('id', sku.id)
    load()
  }

  return (
    <div>
      <div style={{ background: '#fff', border: '1px solid #e0deda', borderRadius: 12, padding: '16px 18px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: 160 }}>
          <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Product name *</label>
          <input value={addName} onChange={e => setAddName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSku()} placeholder="e.g. Blue Dream 3.5g"
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: 7, padding: '8px 10px', fontSize: 13, fontFamily: 'var(--font)', boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>SKU code</label>
          <input value={addCode} onChange={e => setAddCode(e.target.value)} placeholder="e.g. BD-35"
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: 7, padding: '8px 10px', fontSize: 13, fontFamily: 'var(--font)', boxSizing: 'border-box' }} />
        </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Category</label>
                <select value={addCategory} onChange={e => setAddCategory(e.target.value)}
                  style={{ width: '100%', border: '1px solid #ddd', borderRadius: 8, padding: '8px 10px', fontSize: 13, fontFamily: 'var(--font)', background: '#fff' }}>
                  <option value="">No category</option>
                  {SKU_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
        <button onClick={addSku} disabled={adding || !addName.trim()} style={{ background: '#004B6C', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
          <i className="ti ti-plus" style={{ fontSize: 14 }} /> Add Product
        </button>
      </div>
      {loading
        ? <div style={{ padding: 30, textAlign: 'center', color: '#aaa' }}>Loading...</div>
        : skus.length === 0
          ? <div style={{ padding: 30, textAlign: 'center', color: '#bbb', fontSize: 13 }}>No products yet. Add one above.</div>
          : skus.map(sku => (
              <SkuRow key={sku.id} sku={sku} expanded={expanded === sku.id}
                onExpand={() => setExpanded(expanded === sku.id ? null : sku.id)}
                onDelete={() => deleteSku(sku.id)}
                onToggleNew={() => toggleNew(sku)}
                onReload={load} />
            ))
      }
    </div>
  )
}
// -- SKU Row -------------------------------------------------------------------
function SkuRow({ sku, expanded, onExpand, onDelete, onToggleNew, onReload }) {
  const [editCategory, setEditCategory] = useState(sku.category || '')

  const saveCategory = async (val) => {
    setEditCategory(val)
    await supabase.from('skus').update({ category: val || null }).eq('id', sku.id)
    onReload()
  }
  const [assets, setAssets] = useState([])
  const [assetsLoaded, setAssetsLoaded] = useState(false)

  useEffect(() => {
    if (expanded && !assetsLoaded) {
      supabase.from('sku_assets').select('*').eq('sku_id', sku.id).order('sort_order').order('asset_type')
        .then(({ data }) => { setAssets(data || []); setAssetsLoaded(true) })
    }
  }, [expanded, sku.id, assetsLoaded])

  const reload = () => {
    supabase.from('sku_assets').select('*').eq('sku_id', sku.id).order('sort_order').order('asset_type')
      .then(({ data }) => setAssets(data || []))
    onReload()
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e0deda', borderRadius: 12, marginBottom: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', cursor: 'pointer', gap: 10 }} onClick={onExpand}>
        <i className={`ti ${expanded ? 'ti-chevron-down' : 'ti-chevron-right'}`} style={{ fontSize: 13, color: '#aaa', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{sku.name}</span>
          {sku.sku_code && <span style={{ fontSize: 11, color: '#aaa', marginLeft: 8 }}>{sku.sku_code}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select value={editCategory} onChange={e => saveCategory(e.target.value)}
                style={{ border: '1px solid #ddd', borderRadius: 6, padding: '4px 8px', fontSize: 12, fontFamily: 'var(--font)', background: '#fff', color: '#444' }}>
                <option value="">No category</option>
                {SKU_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555', cursor: 'pointer' }} onClick={e => e.stopPropagation()}>
            <input type="checkbox" checked={sku.is_new} onChange={onToggleNew} style={{ cursor: 'pointer' }} />
            New badge
          </label>
          <button onClick={e => { e.stopPropagation(); onDelete() }} style={{ background: 'none', border: '1px solid #f5c0c0', color: '#c0392b', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className="ti ti-trash" style={{ fontSize: 12 }} /> Remove
          </button>
        </div>
      </div>
      {expanded && (
        <div style={{ borderTop: '1px solid #f0eeea', padding: '16px' }}>
          {!assetsLoaded
            ? <div style={{ color: '#aaa', fontSize: 13 }}>Loading assets...</div>
            : SKU_ASSET_TYPES.map(type => (
                <AssetTypeSection key={type.id} skuId={sku.id} assetType={type} assets={assets.filter(a => a.asset_type === type.id)} onReload={reload} />
              ))
          }
        </div>
      )}
    </div>
  )
}

// -- Asset Type Section --------------------------------------------------------
function AssetTypeSection({ skuId, assetType, assets, onReload }) {
  const [adding, setAdding] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newSize, setNewSize] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!newUrl.trim()) return
    setSaving(true)
    await supabase.from('sku_assets').insert({ sku_id: skuId, asset_type: assetType.id, url: newUrl.trim(), label: newLabel.trim() || null, file_size: newSize.trim() || null, sort_order: assets.length })
    setNewUrl(''); setNewLabel(''); setNewSize(''); setAdding(false); setSaving(false); onReload()
  }

  const remove = async (id) => {
    await supabase.from('sku_assets').delete().eq('id', id)
    onReload()
  }

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 22, height: 22, background: assetType.color, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className={`ti ${assetType.icon}`} style={{ fontSize: 11, color: assetType.iconColor }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#444' }}>{assetType.label}</span>
          <span style={{ fontSize: 11, color: '#bbb' }}>({assets.length})</span>
        </div>
        <button onClick={() => setAdding(!adding)} style={{ background: adding ? '#f0eeea' : 'none', border: '1px solid #ddd', borderRadius: 6, padding: '3px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font)', color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}>
          <i className={`ti ${adding ? 'ti-x' : 'ti-plus'}`} style={{ fontSize: 11 }} /> {adding ? 'Cancel' : 'Add'}
        </button>
      </div>
      {assets.map(a => <AssetRow key={a.id} asset={a} onRemove={() => remove(a.id)} onReload={onReload} />)}
      {adding && (
        <div style={{ background: '#f8f7f5', borderRadius: 8, padding: '12px', marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 3, minWidth: 200 }}>
            <label style={{ fontSize: 10, color: '#888', display: 'block', marginBottom: 3 }}>SharePoint / URL *</label>
            <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..."
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: 6, padding: '7px 9px', fontSize: 12, fontFamily: 'var(--font)', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 2, minWidth: 130 }}>
            <label style={{ fontSize: 10, color: '#888', display: 'block', marginBottom: 3 }}>Label (optional)</label>
            <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="e.g. Front view"
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: 6, padding: '7px 9px', fontSize: 12, fontFamily: 'var(--font)', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1, minWidth: 90 }}>
            <label style={{ fontSize: 10, color: '#888', display: 'block', marginBottom: 3 }}>Size</label>
            <input value={newSize} onChange={e => setNewSize(e.target.value)} placeholder="e.g. 2.4 MB"
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: 6, padding: '7px 9px', fontSize: 12, fontFamily: 'var(--font)', boxSizing: 'border-box' }} />
          </div>
          <button onClick={save} disabled={saving || !newUrl.trim()} style={{ background: '#004B6C', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
            <i className="ti ti-check" style={{ fontSize: 12 }} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  )
}
// -- Asset Row -----------------------------------------------------------------
function AssetRow({ asset, onRemove, onReload }) {
  const [editing, setEditing] = useState(false)
  const [url, setUrl] = useState(asset.url)
  const [label, setLabel] = useState(sv(asset.label))
  const [size, setSize] = useState(sv(asset.file_size))
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!url.trim()) return
    setSaving(true)
    await supabase.from('sku_assets').update({ url: url.trim(), label: label.trim() || null, file_size: size.trim() || null, updated_at: new Date().toISOString() }).eq('id', asset.id)
    setSaving(false); setEditing(false); onReload()
  }

  if (editing) {
    return (
      <div style={{ background: '#fffbe8', border: '1px solid #f0e080', borderRadius: 8, padding: '10px 12px', marginBottom: 6, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 3, minWidth: 200 }}>
          <input value={url} onChange={e => setUrl(e.target.value)}
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: 6, padding: '6px 9px', fontSize: 12, fontFamily: 'var(--font)', boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: 2, minWidth: 130 }}>
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label"
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: 6, padding: '6px 9px', fontSize: 12, fontFamily: 'var(--font)', boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: 1, minWidth: 90 }}>
          <input value={size} onChange={e => setSize(e.target.value)} placeholder="Size"
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: 6, padding: '6px 9px', fontSize: 12, fontFamily: 'var(--font)', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          <button onClick={save} disabled={saving} style={{ background: '#004B6C', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font)' }}>{saving ? '...' : 'Save'}</button>
          <button onClick={() => setEditing(false)} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '6px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font)' }}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: '#fafaf8', borderRadius: 7, marginBottom: 5, border: '1px solid #eeede9' }}>
      <i className="ti ti-link" style={{ fontSize: 12, color: '#aaa', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: '#1a1a1a', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.label || asset.url}</div>
        {asset.label && <div style={{ fontSize: 10, color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.url}</div>}
      </div>
      {asset.file_size && <span style={{ fontSize: 10, color: '#aaa', whiteSpace: 'nowrap' }}>{asset.file_size}</span>}
      <button onClick={() => setEditing(true)} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 5, padding: '3px 8px', fontSize: 10, cursor: 'pointer', fontFamily: 'var(--font)', color: '#555', flexShrink: 0 }}>Edit</button>
      <button onClick={onRemove} style={{ background: 'none', border: '1px solid #f5c0c0', borderRadius: 5, padding: '3px 8px', fontSize: 10, cursor: 'pointer', fontFamily: 'var(--font)', color: '#c0392b', flexShrink: 0 }}>
        <i className="ti ti-trash" style={{ fontSize: 10 }} />
      </button>
    </div>
  )
}

// -- Brand Asset Manager -------------------------------------------------------
function BrandAssetManager({ province, brandId }) {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [addType, setAddType] = useState(BRAND_ASSET_TYPES[0].id)
  const [addUrl, setAddUrl] = useState('')
  const [addLabel, setAddLabel] = useState('')
  const [addSize, setAddSize] = useState('')
  const [adding, setAdding] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('brand_assets').select('*').eq('brand', brandId).eq('province', province).order('sort_order').order('asset_type')
    setAssets(data || [])
    setLoading(false)
  }, [brandId, province])

  useEffect(() => { load() }, [load])

  const add = async () => {
    if (!addUrl.trim()) return
    setAdding(true)
    await supabase.from('brand_assets').insert({ brand: brandId, province, asset_type: addType, url: addUrl.trim(), label: addLabel.trim() || null, file_size: addSize.trim() || null })
    setAddUrl(''); setAddLabel(''); setAddSize(''); setAdding(false); load()
  }

  const remove = async (id) => {
    await supabase.from('brand_assets').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div style={{ background: '#fff', border: '1px solid #e0deda', borderRadius: 12, padding: '16px 18px', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 12 }}>Add brand-level asset</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Type</label>
            <select value={addType} onChange={e => setAddType(e.target.value)} style={{ border: '1px solid #ddd', borderRadius: 7, padding: '8px 10px', fontSize: 13, fontFamily: 'var(--font)', background: '#fff' }}>
              {BRAND_ASSET_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div style={{ flex: 3, minWidth: 200 }}>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>URL *</label>
            <input value={addUrl} onChange={e => setAddUrl(e.target.value)} placeholder="https://..."
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: 7, padding: '8px 10px', fontSize: 13, fontFamily: 'var(--font)', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 2, minWidth: 130 }}>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Label</label>
            <input value={addLabel} onChange={e => setAddLabel(e.target.value)} placeholder="Optional"
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: 7, padding: '8px 10px', fontSize: 13, fontFamily: 'var(--font)', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1, minWidth: 90 }}>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Size</label>
            <input value={addSize} onChange={e => setAddSize(e.target.value)} placeholder="e.g. 1.2 MB"
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: 7, padding: '8px 10px', fontSize: 13, fontFamily: 'var(--font)', boxSizing: 'border-box' }} />
          </div>
          <button onClick={add} disabled={adding || !addUrl.trim()} style={{ background: '#004B6C', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
            <i className="ti ti-plus" style={{ fontSize: 13 }} /> Add
          </button>
        </div>
      </div>
      {loading
        ? <div style={{ color: '#aaa', padding: 20, textAlign: 'center' }}>Loading...</div>
        : assets.length === 0
          ? <div style={{ color: '#bbb', textAlign: 'center', padding: 30, fontSize: 13 }}>No brand assets yet.</div>
          : BRAND_ASSET_TYPES.map(type => {
              const group = assets.filter(a => a.asset_type === type.id)
              if (group.length === 0) return null
              return (
                <div key={type.id} style={{ background: '#fff', border: '1px solid #e0deda', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                    <div style={{ width: 22, height: 22, background: type.color, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`ti ${type.icon}`} style={{ fontSize: 11, color: type.iconColor }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#444' }}>{type.label}</span>
                  </div>
                  {group.map(a => <AssetRow key={a.id} asset={a} onRemove={() => remove(a.id)} onReload={load} />)}
                </div>
              )
            })
      }
    </div>
  )
}

// -- Inventory Manager ---------------------------------------------------------
function InventoryManager({ province }) {
  const [html, setHtml] = useState('')
  const [meta, setMeta] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = useCallback(async () => {
    const { data } = await supabase.from('inventory').select('*').eq('province', province)
      .order('updated_at', { ascending: false }).limit(1).maybeSingle()
    setHtml(data?.html || ''); setMeta(data || null)
  }, [province])

  useEffect(() => { load() }, [load])

  const publish = async () => {
    if (!html.trim()) return
    setSaving(true)
    if (meta) { await supabase.from('inventory').update({ html, updated_at: new Date().toISOString() }).eq('id', meta.id) }
    else { await supabase.from('inventory').insert({ province, html }) }
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500); load()
  }

  const provName = PROVINCES.find(p => p.code === province)?.name || province

  return (
    <div style={{ background: '#fff', border: '1px solid #e0deda', borderRadius: 12, padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{provName} - Weekly Inventory HTML</div>
        {meta && <div style={{ fontSize: 11, color: '#aaa' }}>Last published: {new Date(meta.updated_at).toLocaleString()}</div>}
      </div>
      <textarea value={html} onChange={e => setHtml(e.target.value)} rows={18} placeholder="Paste HTML here..."
        style={{ width: '100%', border: '1px solid #ddd', borderRadius: 8, padding: '10px 12px', fontSize: 12, fontFamily: 'var(--mono)', lineHeight: 1.5, resize: 'vertical', boxSizing: 'border-box' }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <button onClick={publish} disabled={saving || !html.trim()} style={{ background: saving ? '#aaa' : saved ? '#2ecc71' : '#004B6C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className={`ti ${saved ? 'ti-check' : 'ti-upload'}`} style={{ fontSize: 14 }} />
          {saving ? 'Publishing...' : saved ? 'Published!' : 'Publish'}
        </button>
      </div>
    </div>
  )
}

// -- Banner Manager ------------------------------------------------------------------
function BannerManager() {
  const [form, setForm] = useState({ active: true, title: '', body: '', imageUrl: '', cta: '', ctaUrl: '', color: '#004B6C' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('site_config').select('value').eq('key', 'banner').maybeSingle()
      .then(({ data }) => {
        if (data?.value) setForm(f => ({ ...f, ...data.value }))
        setLoading(false)
      })
  }, [])

  const save = async () => {
    setSaving(true)
    const { data: existing } = await supabase.from('site_config').select('id').eq('key', 'banner').maybeSingle()
    if (existing) {
      await supabase.from('site_config').update({ value: form, updated_at: new Date().toISOString() }).eq('key', 'banner')
    } else {
      await supabase.from('site_config').insert({ key: 'banner', value: form })
    }
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  const field = (label, key, type = 'text', hint = '') => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: '#555', display: 'block', marginBottom: 4 }}>{label}</label>
      <input type={type} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={hint}
        style={{ width: '100%', border: '1px solid #ddd', borderRadius: 8, padding: '9px 12px', fontSize: 13, fontFamily: 'var(--font)', boxSizing: 'border-box' }} />
    </div>
  )

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>Loading...</div>

  return (
    <div style={{ background: '#fff', border: '1px solid #e0deda', borderRadius: 12, padding: '24px 20px', maxWidth: 600 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Hub Banner</div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Changes appear on the hub page for all retailers.</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, padding: '12px 14px', background: '#f8f8f6', borderRadius: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>Banner active</span>
        <button onClick={() => setForm(f => ({ ...f, active: !f.active }))}
          style={{ marginLeft: 'auto', width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: form.active ? '#004B6C' : '#ccc', position: 'relative', transition: 'background 0.2s' }}>
          <span style={{ position: 'absolute', top: 2, left: form.active ? 22 : 2, width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: 'left 0.2s' }} />
        </button>
      </div>

      {field('Title', 'title', 'text', 'e.g. New photos available')}
      {field('Body text', 'body', 'text', 'e.g. Fresh photography is now live...')}
      {field('Image URL', 'imageUrl', 'url', 'https://... (leave blank for no image)')}

      {form.imageUrl && (
        <div style={{ marginBottom: 14 }}>
          <img src={form.imageUrl} alt="preview" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid #e0deda' }} />
        </div>
      )}

      {field('CTA button text', 'cta', 'text', 'e.g. View assets (leave blank to hide button)')}
      {field('CTA button URL', 'ctaUrl', 'url', 'https://...')}

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: '#555', display: 'block', marginBottom: 4 }}>Background colour</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="color" value={form.color || '#004B6C'} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
            style={{ width: 40, height: 36, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
          <input type="text" value={form.color || '#004B6C'} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
            style={{ width: 100, border: '1px solid #ddd', borderRadius: 8, padding: '8px 10px', fontSize: 13, fontFamily: 'var(--font)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <button onClick={save} disabled={saving}
          style={{ background: saving ? '#aaa' : saved ? '#2ecc71' : '#004B6C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 500, cursor: saving ? 'default' : 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className={`ti ${saved ? 'ti-check' : 'ti-device-floppy'}`} style={{ fontSize: 14 }} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save banner'}
        </button>
      </div>
    </div>
  )
}
