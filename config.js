const SUPABASE_URL = 'https://adycwduqmsiisvsaidha.supabase.co';
const API_BASE = "https://adycwduqmsiisvsaidha.supabase.co/functions/v1";
window.API_BASE = API_BASE;
const SUPABASE_KEY = 'sb_publishable_5YEiDpjh530pymNIw2j63g_zMHgIczk';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabaseClient = supabaseClient;
// Keep old name for builder.html so e no break
window.supabase = supabaseClient;
console.log('✅ DOTGROUP Supabase Connected');

// ===== GET CURRENT USER - NO DELETION =====
function getDotUsername(){
  try{
    const profile = JSON.parse(localStorage.getItem('dobuilder_member_profile') || '{}');
    return profile.username || localStorage.getItem('dot_username') || 'guest';
  }catch(e){ return localStorage.getItem('dot_username') || 'guest'; }
}

// ===== SAVE FULL WEBSITE TO SUPABASE =====
// This one saves EVERYTHING: products, colours, logo, cover, pages
async function saveWebsiteToDB(d, status){
  if(!d || !d.name) return {ok:false, msg:'No name'};
  const username = getDotUsername();
  const row = {
    username: username,
    site_name: d.name,
    headline: d.tagline || '',
    description: d.description || '',
    category: d.category || '',
    template_id: d.templateId || null,
    template_name: d.templateName || d.design || '',
    design: d.design || '',
    colour: d.colour || '#0756b5',
    colour2: d.colour2 || '#e32636',
    colour3: d.colour3 || '#FCD116',
    whatsapp: d.whatsapp || '',
    email: d.email || '',
    social: d.social || '',
    pages: d.pages || [],
    products: d.products || [],
    logo: d.logo || '',
    logo_text: d.logoText || 'D',
    logo_bg: d.logoBg || '#0756b5',
    cover: d.cover || '',
    special_code: d.specialCode || '',
    is_special: !!d.isSpecial,
    status: status || 'draft',
    updated_at: new Date().toISOString()
  };
  // IMPORTANT: onConflict is username + site_name, NOT username alone
  // So one person fit get many websites, one no go delete another
  const {data, error} = await supabaseClient.from('websites').upsert(row, {onConflict:'username,site_name'}).select().single();
  if(error){ console.log('Supabase save error:', error.message); return {ok:false, msg:error.message}; }
  return {ok:true, data:data};
}

async function loadWebsiteFromDB(site_name){
  const username = getDotUsername();
  let q = supabaseClient.from('websites').select('*').eq('username', username);
  if(site_name) q = q.eq('site_name', site_name);
  const {data, error} = await q.order('updated_at', {ascending:false}).limit(1).maybeSingle();
  if(error) return null;
  return data;
}

window.getDotUsername = getDotUsername;
window.saveWebsiteToDB = saveWebsiteToDB;
window.loadWebsiteFromDB = loadWebsiteFromDB;

// ===== YOUR OLD SHORTENER - I KEEP AM =====
function getShortLink(fullUrl) {
  try {
    let url = fullUrl || window.location.href;
    let host = new URL(url).hostname;
    let short = host.replace('.dotgroup.top', '').replace('dotgroup.top', '');
    return short;
  } catch(e) {
    return window.location.hostname.replace('.dotgroup.top','');
  }
}
function getFullLinkFromShort(short) {
  if (!short) return window.location.href;
  if (short.includes('dotgroup.top')) return 'https://' + short;
  return 'https://' + short + '.dotgroup.top';
}
async function dotShare(title, text) {
  const short = getShortLink();
  const full = getFullLinkFromShort(short);
  const shareData = { title: title || document.title || 'DOTGROUP', text: (text || '') + ' - ' + short, url: full };
  if (navigator.share) {
    try { await navigator.share(shareData); return; } catch(e) {}
  }
  try { await navigator.clipboard.writeText(short); alert('Link copied: ' + short); } catch(e) { prompt('Copy your short link:', short); }
}
window.getShortLink = getShortLink;
window.getFullLinkFromShort = getFullLinkFromShort;
window.dotShare = dotShare;
