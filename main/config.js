const SUPABASE_URL = 'https://adycwduqmsiisvsaidha.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5YEiDpjh530pymNIw2j63g_zMHgIczk';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log('✅ DOTGROUP Supabase Connected');

// ===== DOTGROUP AUTO SHORTENER =====
// Full: peter.myshop.dotgroup.top -> Short: peter.myshop
// Full: david.dobot.dotgroup.top -> Short: david.dobot

function getShortLink(fullUrl) {
  try {
    let url = fullUrl || window.location.href;
    let host = new URL(url).hostname; // e.g peter.myshop.dotgroup.top
    // Comot .dotgroup.top
    let short = host.replace('.dotgroup.top', '').replace('dotgroup.top', '');
    return short; // peter.myshop
  } catch(e) {
    return window.location.hostname.replace('.dotgroup.top','');
  }
}

function getFullLinkFromShort(short) {
  // peter.myshop -> peter.myshop.dotgroup.top
  if (!short) return window.location.href;
  if (short.includes('dotgroup.top')) return 'https://' + short;
  return 'https://' + short + '.dotgroup.top';
}

// This na the automatic Share function - use am for all pages
// myshop, dobot, dobiz, dohealth, dotravel
async function dotShare(title, text) {
  const short = getShortLink();
  const full = getFullLinkFromShort(short);
  
  const shareData = {
    title: title || document.title || 'DOTGROUP',
    text: (text || '') + ' - ' + short,
    url: full
  };

  // Try native share first
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch(e) {}
  }
  // Fallback: copy short link
  try {
    await navigator.clipboard.writeText(short);
    alert('Link copied: ' + short);
  } catch(e) {
    prompt('Copy your short link:', short);
  }
}

// Make am available for all pages
window.getShortLink = getShortLink;
window.getFullLinkFromShort = getFullLinkFromShort;
window.dotShare = dotShare;