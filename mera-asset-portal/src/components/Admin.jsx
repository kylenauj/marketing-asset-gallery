import { useState, useEffect, useCallback } from 'react'
import { supabase, PROVINCES, BRANDS, ASSET_TYPES } from '../config.js'

const STATUS = { idle: 'idle', saving: 'saving', saved: 'saved', error: 'error' }

export default function Admin() {
  const [session, setSession] = useState(undefined)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [adminTab, setAdminTab] = useState('assets')
  const [province, setProvince] = useState('ON')
  const [assets, setAssets] = useState({})
  const [statuses, setStatuses] = useState({})
  const [loading, setLoading] = useState(false)
  const [inventoryHtml, setInventoryHtml] = useState('')
  const [inventoryProvince, setInventoryProvince] = useState('ON')
  const [inventorySaving, setInventorySaving] = useState(false)
  const [inventorySaved, setInventorySaved] = useState(false)
  const [inventoryMeta, setInventoryMeta] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const loadAssets = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('assets').select('*').eq('province', province)
    const map = {}
    ;(data || []).forEach(row => { map[`${row.brand}__${row.asset_type}`] = row })
    setAssets(map)
    setLoading(false)
  }, [province])

  const loadInventory = useCallback(async () => {
    const { data } = await supabase
      .from('inventory')
      .select('*')
      .eq('province', inventoryProvince)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (data) {
      setInventoryHtml(data.html || '')
      setInventoryMeta(data)
    } else {
      setInventoryHtml('')
      setInventoryMeta(null)
    }
  }, [inventoryProvince])

  useEffect(() => { if (session) loadAssets() }, [session, loadAssets])
  useEffect(() => { if (session && adminTab === 'inventory') loadInventory() }, [session, adminTab, loadInventory])

  const handleLogin = async () => {
    setLoginLoading(true)
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    if (error) setLoginError(error.message)
    setLoginLoading(false)
  }

  const handleSignOut = async () => { await supabase.auth.signOut() }

  const handleSaveAsset = async (brand, assetType, value, fileSize) => {
    const key = `${brand}__${assetType}`
    setStatuses(s => ({ ...s, [key]: STATUS.saving }))
    const existing = assets[key]
    let error
    if (existing) {
      ({ error } = await supabase.from('assets')
        .update({ sharepoint_url: value, file_size: fileSize, updated_at: new Date().toISOString() })
        .eq('id', existing.id))
    } else {
      ({ error } = await supabase.from('assets')
        .insert({ brand, asset_type: assetType, province, sharepoint_url: value, file_size: fileSize,
          label: `${BRANDS.find(b=>b.id===brand)?.name} — ${ASSET_TYPES.find(t=>t.id===assetType)?.label}` }))
    }
    if (error) {
      setStatuses(s => ({ ...s, [key]: STATUS.error }))
    } else {
      setStatuses(s => ({ ...s, [key]: STATUS.saved }))
      setTimeout(() => setStatuses(s => ({ ...s, [key]: STATUS.idle })), 2000)
      loadAssets()
    }
  }

  const handleToggleNew = async (brand, assetType, currentVal) => {
    const existing = assets[`${brand}__${assetType}`]
    if (!existing) return
    await supabase.from('assets').update({ is_new: !currentVal }).eq('id', existing.id)
    loadAssets()
  }

  const handlePublishInventory = async () => {
    if (!inventoryHtml.trim()) return
    setInventorySaving(true)
    const existing = inventoryMeta
    let error
    if (existing) {
      ({ error } = await supabase.from('inventory')
        .update({ html: inventoryHtml, updated_at: new Date().toISOString() })
        .eq('id', existing.id))
    } else {
      ({ error } = await supabase.from('inventory')
        .insert({ province: inventoryProvince, html: inventoryHtml }))
    }
    setInventorySaving(false)
    if (!error) {
      setInventorySaved(true)
      setTimeout(() => setInventorySaved(false), 3000)
      loadInventory()
    }
  }

  if (session === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4f0' }}>
        <div style={{ fontSize: 13, color: '#999' }}>Loading...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4f0' }}>
        <div style={{ background: '#fff', border: '1px solid #e0deda', borderRadius: 14, padding: '36px 40px', width: 380, textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, background: '#004B6C', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 18, fontWeight: 500, color: '#fff' }}>M</div>
          <h2 style={{ fontSize: 17, fontWeight: 500, marginBottom: 6 }}>Admin panel</h2>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Sign in with your Mera account</p>
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '10px 14px', border: `1px solid ${loginError ? '#e24b4a' : '#e0deda'}`, borderRadius: 8, fontSize: 14, outline: 'none', marginBottom: 8, fontFamily: 'var(--font)' }} />
          <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '10px 14px', border: `1px solid ${loginError ? '#e24b4a' : '#e0deda'}`, borderRadius: 8, fontSize: 14, outline: 'none', marginBottom: 10, fontFamily: 'var(--font)' }} />
          {loginError && <p style={{ fontSize: 12, color: '#e24b4a', marginBottom: 10 }}>{loginError}</p>}
          <button onClick={handleLogin} disabled={loginLoading} style={{ width: '100%', padding: '10px', background: '#004B6C', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loginLoading ? 'default' : 'pointer', fontFamily: 'var(--font)', opacity: loginLoading ? 0.7 : 1 }}>
            {loginLoading ? 'Signing in...' : 'Sign in'}
          </button>
          <p style={{ marginTop: 16, fontSize: 12, color: '#bbb' }}>Accounts managed in Supabase. Contact your admin for access.</p>
        </div>
      </div>
    )
  }

  const provinceBrands = BRANDS.filter(b => b.provinces.includes(province))
  const connectedCount = Object.values(assets).filter(a => a.sharepoint_url).length
  const totalSlots = provinceBrands.length * ASSET_TYPES.length

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0' }}>
      <div style={{ background: '#004B6C', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: '#A2D074', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: '#2a4a0a' }}>M</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>Admin panel</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              {adminTab === 'assets' ? `${connectedCount} of ${totalSlots} asset slots connected` : 'Weekly inventory publisher'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 3, gap: 2, marginRight: 8 }}>
            {['assets', 'inventory'].map(t => (
              <button key={t} onClick={() => setAdminTab(t)} style={{
                padding: '4px 14px', borderRadius: 17, fontSize: 12, fontWeight: 500,
                border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.15s',
                background: adminTab === t ? '#fff' : 'none',
                color: adminTab === t ? '#004B6C' : 'rgba(255,255,255,0.65)',
              }}>{t === 'assets' ? 'Assets' : 'Inventory'}</button>
            ))}
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{session.user.email}</span>
          <button onClick={handleSignOut} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11, border: '1px solid rgba(255,255,255,0.2)', background: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'var(--font)' }}>Sign out</button>
          <a href="/" style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
            <i className="ti ti-external-link" style={{ fontSize: 12 }} /> View portal
          </a>
        </div>
      </div>

      {adminTab === 'assets' && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
            {PROVINCES.map(p => (
              <button key={p.code} onClick={() => setProvince(p.code)} style={{
                padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
                background: province === p.code ? '#004B6C' : '#e0deda',
                color: province === p.code ? '#fff' : '#555', transition: 'all 0.15s',
              }}>{p.code} — {p.name}</button>
            ))}
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>Loading...</div>
          ) : (
            provinceBrands.map(brand => (
              <BrandSection key={brand.id} brand={brand} assets={assets} statuses={statuses} onSave={handleSaveAsset} onToggleNew={handleToggleNew} />
            ))
          )}
        </div>
      )}

      {adminTab === 'inventory' && (
        <InventoryTab
          provinces={PROVINCES}
          province={inventoryProvince}
          onProvince={p => setInventoryProvince(p)}
          html={inventoryHtml}
          onHtml={setInventoryHtml}
          onPublish={handlePublishInventory}
          saving={inventorySaving}
          saved={inventorySaved}
          meta={inventoryMeta}
        />
      )}
    </div>
  )
}

function InventoryTab({ provinces, province, onProvince, html, onHtml, onPublish, saving, saved, meta }) {
  const wordCount = html.trim().length
  const lastUpdated = meta?.updated_at ? new Date(meta.updated_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : null

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
      <div style={{ background: '#fff', border: '1px solid #e0deda', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0ede8', background: '#fafaf8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a' }}>Weekly inventory HTML</div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 3 }}>
              Paste your Mailchimp HTML below and hit publish — retailers see it instantly.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {provinces.map(p => (
              <button key={p.code} onClick={() => onProvince(p.code)} style={{
                padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
                background: province === p.code ? '#004B6C' : '#e8e6e0',
                color: province === p.code ? '#fff' : '#555', transition: 'all 0.15s',
              }}>{p.code}</button>
            ))}
          </div>
        </div>

        {lastUpdated && (
          <div style={{ padding: '10px 24px', borderBottom: '1px solid #f0ede8', background: '#f0f6fa', display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-circle-check" style={{ fontSize: 14, color: '#2d7a45' }} />
            <span style={{ fontSize: 12, color: '#555' }}>
              Currently live — last published <strong>{lastUpdated}</strong>
            </span>
            <span style={{ fontSize: 12, color: '#999', marginLeft: 4 }}>· {province}</span>
          </div>
        )}

        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#999', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
            Mailchimp HTML
          </div>
          <textarea
            value={html}
            onChange={e => onHtml(e.target.value)}
            placeholder="Paste your full Mailchimp inventory HTML here..."
            rows={18}
            style={{
              width: '100%', padding: '12px 14px',
              border: '1px solid #e0deda', borderRadius: 8,
              fontSize: 12, color: '#1a1a1a', background: '#fafaf8',
              fontFamily: 'DM Mono, monospace', lineHeight: 1.6,
              outline: 'none', resize: 'vertical',
            }}
            onFocus={e => e.target.style.borderColor = '#004B6C'}
            onBlur={e => e.target.style.borderColor = '#e0deda'}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
            <span style={{ fontSize: 12, color: '#bbb' }}>
              {wordCount > 0 ? `${wordCount.toLocaleString()} characters` : 'Nothing pasted yet'}
            </span>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {saved && (
                <span style={{ fontSize: 12, color: '#2d7a45', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <i className="ti ti-circle-check" style={{ fontSize: 14 }} /> Published successfully
                </span>
              )}
              <button
                onClick={onPublish}
                disabled={!html.trim() || saving}
                style={{
                  padding: '9px 22px', background: html.trim() ? '#004B6C' : '#e0deda',
                  color: html.trim() ? '#fff' : '#bbb', border: 'none', borderRadius: 8,
                  fontSize: 13, fontWeight: 500, cursor: html.trim() ? 'pointer' : 'default',
                  fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.15s',
                }}
              >
                <i className="ti ti-send" style={{ fontSize: 14 }} />
                {saving ? 'Publishing...' : 'Publish to portal'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid #f0ede8', background: '#fafaf8' }}>
          <div style={{ fontSize: 11, color: '#bbb', lineHeight: 1.6 }}>
            <strong style={{ color: '#999' }}>How to use:</strong> Generate your weekly inventory HTML as usual → copy the full HTML → paste above → select the province → Publish. The inventory page on the retailer portal updates immediately. Each province stores its own inventory separately.
          </div>
        </div>
      </div>
    </div>
  )
}

function BrandSection({ brand, assets, statuses, onSave, onToggleNew }) {
  const connected = ASSET_TYPES.filter(t => assets[`${brand.id}__${t.id}`]?.sharepoint_url).length
  return (
    <div style={{ background: '#fff', border: '1px solid #e0deda', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0ede8', display: 'flex', alignItems: 'center', gap: 10, background: '#fafaf8' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: brand.color, flexShrink: 0 }} />
        <span style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a' }}>{brand.name}</span>
        <span style={{ fontSize: 11, color: connected === ASSET_TYPES.length ? '#2d7a45' : '#999', background: connected === ASSET_TYPES.length ? '#e8f4ec' : '#f0ede8', padding: '2px 8px', borderRadius: 10, marginLeft: 4 }}>
          {connected} / {ASSET_TYPES.length} connected
        </span>
      </div>
      <div style={{ padding: '4px 0' }}>
        {ASSET_TYPES.map(type => (
          <AssetRow key={type.id} brand={brand} type={type} asset={assets[`${brand.id}__${type.id}`]} status={statuses[`${brand.id}__${type.id}`] || STATUS.idle} onSave={onSave} onToggleNew={onToggleNew} />
        ))}
      </div>
    </div>
  )
}

function AssetRow({ brand, type, asset, status, onSave, onToggleNew }) {
  const [url, setUrl] = useState(asset?.sharepoint_url || '')
  const [fileSize, setFileSize] = useState(asset?.file_size || '')
  const hasUrl = !!asset?.sharepoint_url
  const dirty = url !== (asset?.sharepoint_url || '') || fileSize !== (asset?.file_size || '')

  useEffect(() => { setUrl(asset?.sharepoint_url || ''); setFileSize(asset?.file_size || '') }, [asset])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderBottom: '1px solid #f5f3ef', transition: 'background 0.1s' }}
      onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <div style={{ width: 30, height: 30, borderRadius: 7, background: type.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i className={`ti ${type.icon}`} style={{ fontSize: 15, color: type.iconColor }} />
      </div>
      <div style={{ width: 150, flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{type.label}</div>
        <div style={{ fontSize: 11, color: '#999', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: hasUrl ? '#2d7a45' : '#ddd', flexShrink: 0 }} />
          {hasUrl ? 'Connected' : 'Not connected'}
        </div>
      </div>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste SharePoint share URL..."
        style={{ flex: 1, padding: '7px 12px', border: '1px solid #e0deda', borderRadius: 7, fontSize: 12, color: '#1a1a1a', outline: 'none', fontFamily: 'DM Mono, monospace', background: '#fafaf8' }}
        onFocus={e => e.target.style.borderColor = '#004B6C'} onBlur={e => e.target.style.borderColor = '#e0deda'} />
      <input value={fileSize} onChange={e => setFileSize(e.target.value)} placeholder="e.g. 2.1 MB"
        style={{ width: 120, padding: '7px 12px', border: '1px solid #e0deda', borderRadius: 7, fontSize: 12, color: '#1a1a1a', outline: 'none', fontFamily: 'var(--font)', background: '#fafaf8' }}
        onFocus={e => e.target.style.borderColor = '#004B6C'} onBlur={e => e.target.style.borderColor = '#e0deda'} />
      <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#666', cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}>
        <input type="checkbox" checked={!!asset?.is_new} onChange={() => onToggleNew(brand.id, type.id, asset?.is_new)} disabled={!hasUrl} style={{ cursor: 'pointer' }} />
        New
      </label>
      <button onClick={() => onSave(brand.id, type.id, url, fileSize)} disabled={!dirty || status === STATUS.saving}
        style={{ padding: '7px 16px', borderRadius: 7, fontSize: 12, fontWeight: 500, border: 'none', cursor: dirty ? 'pointer' : 'default', fontFamily: 'var(--font)', background: status === STATUS.saved ? '#e8f4ec' : dirty ? '#004B6C' : '#f0ede8', color: status === STATUS.saved ? '#2d7a45' : dirty ? '#fff' : '#bbb', transition: 'all 0.15s', flexShrink: 0 }}>
        {status === STATUS.saving ? 'Saving...' : status === STATUS.saved ? '✓ Saved' : status === STATUS.error ? 'Error' : 'Save'}
      </button>
      {hasUrl && <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#aaa', fontSize: 15, flexShrink: 0 }}><i className="ti ti-external-link" /></a>}
    </div>
  )
}
