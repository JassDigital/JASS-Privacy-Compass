import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, ShieldCheck, Compass, Bookmark, GitCompareArrows, SlidersHorizontal, ExternalLink, ChevronRight, X, Check, Globe2, LockKeyhole, Server, Monitor, Sparkles, Heart, Info, Download, RotateCcw, ArrowUpRight } from 'lucide-react';
import catalogue from '../data/catalogue.json';
import './styles.css';

const categories = ['All software', ...new Set(catalogue.map(x => x.category))];
const readSet = (key) => { try { const v = JSON.parse(localStorage.getItem(key) || '[]'); return new Set(Array.isArray(v) ? v : []); } catch { return new Set(); } };
const persist = (key, set) => localStorage.setItem(key, JSON.stringify([...set]));

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All software');
  const [tab, setTab] = useState('discover');
  const [openSource, setOpenSource] = useState(false);
  const [selfHost, setSelfHost] = useState(false);
  const [localFirst, setLocalFirst] = useState(false);
  const [favourites, setFavourites] = useState(() => readSet('jass-privacy-favourites-v1'));
  const [compare, setCompare] = useState(() => readSet('jass-privacy-compare-v1'));
  const [selected, setSelected] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [notice, setNotice] = useState('');

  const toggleSet = (setter, key, id) => setter(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); persist(key, next); return next; });
  const filtered = useMemo(() => catalogue.filter(item => {
    const text = `${item.name} ${item.category} ${item.summary} ${item.platforms.join(' ')} ${item.kind}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (category === 'All software' || item.category === category) && (!openSource || item.kind.toLowerCase().includes('open source') || item.kind.toLowerCase().includes('open data')) && (!selfHost || item.selfHost) && (!localFirst || /local|offline|self-host/i.test(`${item.hosting} ${item.summary}`)) && (tab !== 'saved' || favourites.has(item.id));
  }), [query, category, openSource, selfHost, localFirst, tab, favourites]);
  const compared = catalogue.filter(x => compare.has(x.id));

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ product: 'JASS Privacy Compass', version: '1.0.0', exportedAt: new Date().toISOString(), favourites: [...favourites], compare: [...compare] }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'jass-privacy-compass-settings.json'; a.click(); URL.revokeObjectURL(url); setNotice('Your local preferences export has been prepared.');
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Compass size={23}/></div><div><div className="brand-name">JASS <span>PRIVACY</span></div><div className="brand-sub">COMPASS</div></div></div>
      <div className="side-label">WORKSPACE</div>
      <button className={`nav-item ${tab==='discover'?'active':''}`} onClick={()=>setTab('discover')}><Compass size={18}/> Discover <span className="nav-count">{catalogue.length}</span></button>
      <button className={`nav-item ${tab==='saved'?'active':''}`} onClick={()=>setTab('saved')}><Bookmark size={18}/> Saved <span className="nav-count">{favourites.size}</span></button>
      <button className={`nav-item ${tab==='compare'?'active':''}`} onClick={()=>setTab('compare')}><GitCompareArrows size={18}/> Compare <span className="nav-count">{compare.size}</span></button>
      <div className="side-label category-label">CATEGORIES</div>
      <div className="category-list">{categories.map((c,i)=><button key={c} className={`category-item ${category===c?'selected':''}`} onClick={()=>{setCategory(c);setTab('discover')}}><span className="category-dot"/>{c}<span className="category-number">{i===0?catalogue.length:catalogue.filter(x=>x.category===c).length}</span></button>)}</div>
      <div className="sidebar-bottom"><div className="privacy-mini"><div className="privacy-icon"><ShieldCheck size={18}/></div><div><strong>Private by design</strong><p>Your preferences stay on this device.</p></div></div><div className="version">JASS PRIVACY COMPASS <span>v1.0.0</span></div></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="breadcrumb">JASS Digital Lab <ChevronRight size={14}/> <strong>{tab==='discover'?'Discover':tab==='saved'?'Saved software':'Compare tools'}</strong></div><div className="top-actions"><span className="local-pill"><span/> LOCAL-FIRST</span><button className="icon-button" title="Export local preferences" onClick={exportData}><Download size={17}/></button><div className="avatar">J</div></div></header>
      <div className="content">
        {tab==='compare' ? <>
          <div className="page-heading"><div><div className="eyebrow">MAKE AN INFORMED CHOICE</div><h1>Compare software<span>.</span></h1><p className="lead">Review trade-offs side by side. Privacy depends on configuration and your threat model.</p></div><button className="secondary-button" onClick={()=>{setCompare(new Set());persist('jass-privacy-compare-v1',new Set())}}><RotateCcw size={15}/> Clear comparison</button></div>
          {compared.length<2 ? <div className="empty-state"><div className="empty-icon"><GitCompareArrows size={26}/></div><h3>Choose at least two tools</h3><p>Add tools to comparison from their cards, then come back here to review them side by side.</p><button className="primary-button" onClick={()=>setTab('discover')}>Explore catalogue <ArrowUpRight size={16}/></button></div> : <div className="compare-table-wrap"><table className="compare-table"><thead><tr><th>FEATURE</th>{compared.map(x=><th key={x.id}>{x.name}<a href={x.url} target="_blank" rel="noreferrer"><ExternalLink size={12}/></a></th>)}</tr></thead><tbody>{[['Category',x=>x.category],['Software model',x=>x.kind],['Hosting / data location',x=>x.hosting],['Account required',x=>x.account],['Encryption notes',x=>x.encryption],['Self-hostable',x=>x.selfHost?'Yes':'No'],['Platforms',x=>x.platforms.join(', ')],['Key limitation',x=>x.caveats]].map(([label,get])=><tr key={label}><th>{label}</th>{compared.map(x=><td key={x.id}>{get(x)}</td>)}</tr>)}</tbody></table></div>}
        </> : <>
          <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> YOUR DIGITAL LIFE, YOUR CHOICE</div><h1>Privacy is a <em>practice.</em><br/>Start with better tools.</h1><p>Discover thoughtful alternatives to everyday software. Compare trade-offs, understand the evidence, and choose what fits your needs.</p><div className="hero-points"><span><Check size={14}/> No account needed</span><span><Check size={14}/> Local preferences</span><span><Check size={14}/> Transparent caveats</span></div></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-shield"><ShieldCheck size={57} strokeWidth={1.2}/></div><div className="orbit-label label-top"><LockKeyhole size={14}/> YOUR DATA</div><div className="orbit-label label-bottom"><Globe2 size={14}/> YOUR CHOICE</div><div className="spark spark-one">✳</div><div className="spark spark-two">✦</div></div><div className="hero-index"><span>01</span><div/></div></section>
          <section className="search-section"><div className="search-box"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tools, categories, or use cases…" aria-label="Search privacy software"/><kbd>⌕</kbd></div><button className={`filter-button ${showFilters?'filter-active':''}`} onClick={()=>setShowFilters(!showFilters)}><SlidersHorizontal size={17}/> Filters <span className="filter-count">{[openSource,selfHost,localFirst].filter(Boolean).length || ''}</span></button></section>
          {showFilters&&<div className="filter-panel"><label><input type="checkbox" checked={openSource} onChange={e=>setOpenSource(e.target.checked)}/> Open source / open data</label><label><input type="checkbox" checked={selfHost} onChange={e=>setSelfHost(e.target.checked)}/> Self-hostable</label><label><input type="checkbox" checked={localFirst} onChange={e=>setLocalFirst(e.target.checked)}/> Local / offline options</label><button onClick={()=>{setOpenSource(false);setSelfHost(false);setLocalFirst(false)}}>Reset filters</button></div>}
          <div className="section-heading"><div><div className="eyebrow">THE DIRECTORY</div><h2>{tab==='saved'?'Your saved tools':category==='All software'?'Explore privacy alternatives':category}<span className="period">.</span></h2><p>{tab==='saved'?'Your locally saved shortlist.':`A starting point for informed choices — ${filtered.length} ${filtered.length===1?'tool':'tools'} to explore.`}</p></div><div className="sort-note"><span className="live-dot"/> CURATED DIRECTORY</div></div>
          <div className="catalogue-grid">{filtered.map(item=><article className="tool-card" key={item.id}><div className="card-top"><div className={`tool-monogram monogram-${item.category.toLowerCase().replace(/[^a-z]/g,'').slice(0,8)}`}>{item.name.split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase()}</div><div className="card-badges"><span className="type-badge">{item.kind}</span>{item.selfHost&&<span className="selfhost-badge">SELF-HOST</span>}</div><button className={`save-button ${favourites.has(item.id)?'is-saved':''}`} title={favourites.has(item.id)?'Remove saved tool':'Save tool'} onClick={()=>toggleSet(setFavourites,'jass-privacy-favourites-v1',item.id)}><Bookmark size={17} fill={favourites.has(item.id)?'currentColor':'none'}/></button></div><div className="tool-category">{item.category.toUpperCase()}</div><h3>{item.name}</h3><p className="tool-summary">{item.summary}</p><div className="card-meta"><span><Monitor size={13}/>{item.platforms.slice(0,3).join(', ')}{item.platforms.length>3?' +':''}</span><span><Server size={13}/>{item.account==='Not required'?'No account':item.account==='Optional'?'Optional account':'Account varies'}</span></div><div className="card-footer"><button className="text-button" onClick={()=>setSelected(item)}>Review details <ChevronRight size={15}/></button><button className={`compare-add ${compare.has(item.id)?'added':''}`} onClick={()=>toggleSet(setCompare,'jass-privacy-compare-v1',item.id)} title={compare.has(item.id)?'Remove from comparison':'Add to comparison'}>{compare.has(item.id)?<Check size={15}/>:<GitCompareArrows size={15}/>} {compare.has(item.id)?'Added':'Compare'}</button></div></article>)}</div>
          {filtered.length===0&&<div className="empty-state compact"><div className="empty-icon"><Search size={23}/></div><h3>No tools found</h3><p>Try another search or relax your filters.</p><button className="secondary-button" onClick={()=>{setQuery('');setCategory('All software');setOpenSource(false);setSelfHost(false);setLocalFirst(false)}}>Clear search and filters</button></div>}
        </>}
        <footer className="app-footer"><div className="footer-mark"><Compass size={17}/> JASS DIGITAL LAB</div><span>Independent discovery. Informed decisions.</span><button onClick={()=>setNotice('Privacy model: no analytics, no account, no remote preference sync. Favourites and comparisons are stored in this browser profile on this device.') }><ShieldCheck size={14}/> Privacy model</button></footer>
      </div>
    </main>

    {selected&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title"><div className="modal-head"><div className="tool-monogram modal-monogram">{selected.name.split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase()}</div><button className="icon-button" onClick={()=>setSelected(null)} aria-label="Close details"><X size={18}/></button></div><div className="tool-category">{selected.category.toUpperCase()}</div><h2 id="detail-title">{selected.name}</h2><p className="detail-summary">{selected.summary}</p><div className="evidence-note"><Info size={16}/><span>This is a starter review, not a security audit. Confirm current documentation and assess suitability for your own threat model.</span></div><div className="detail-fields"><div><span>Software model</span><strong>{selected.kind}</strong></div><div><span>Hosting</span><strong>{selected.hosting}</strong></div><div><span>Account</span><strong>{selected.account}</strong></div><div><span>Encryption</span><strong>{selected.encryption}</strong></div><div><span>Platforms</span><strong>{selected.platforms.join(', ')}</strong></div><div><span>Self-hostable</span><strong>{selected.selfHost?'Yes':'No / not applicable'}</strong></div></div><div className="caveat-box"><strong>Things to consider</strong><p>{selected.caveats}</p></div><div className="review-line">Catalogue status: {selected.reviewStatus} <span>•</span> Record date: {selected.reviewed}</div><div className="source-list"><strong>Review starting points</strong>{selected.evidence.map(url=><a key={url} href={url} target="_blank" rel="noreferrer">{new URL(url).hostname}<ExternalLink size={13}/></a>)}</div><div className="modal-actions"><button className="secondary-button" onClick={()=>toggleSet(setCompare,'jass-privacy-compare-v1',selected.id)}>{compare.has(selected.id)?<Check size={15}/>:<GitCompareArrows size={15}/>} {compare.has(selected.id)?'In comparison':'Add to compare'}</button><button className="primary-button" onClick={()=>window.open(selected.url,'_blank','noopener,noreferrer')}>Visit official site <ExternalLink size={15}/></button></div></section></div>}
    {notice&&<div className="toast"><ShieldCheck size={17}/><span>{notice}</span><button onClick={()=>setNotice('')}><X size={15}/></button></div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
