// dot-header.js - 3-line dropdown - hamburger menu
(function(){
  const hamburger = document.getElementById('dotHamburger');
  const dropdown = document.getElementById('dotDropdown');
  const overlay = document.getElementById('dotOverlay');
  const closeBtn = document.getElementById('ddClose');

  function openMenu(){
    if(!dropdown) return;
    dropdown.classList.add('show');
    if(overlay) overlay.classList.add('show');
    if(hamburger) hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    if(!dropdown) return;
    dropdown.classList.remove('show');
    if(overlay) overlay.classList.remove('show');
    if(hamburger) hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }
  function toggleMenu(){
    if(dropdown && dropdown.classList.contains('show')) closeMenu();
    else openMenu();
  }

  if(hamburger) hamburger.addEventListener('click', function(e){
    e.stopPropagation(); toggleMenu();
  });
  if(closeBtn) closeBtn.addEventListener('click', closeMenu);
  if(overlay) overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeMenu();
  });

  window.closeDotMenu = closeMenu;

  // auto close when clicking any menu item
  const originalGoTab = window.goTab;
  window.goTab = function(id){
    closeMenu();
    if(typeof originalGoTab === 'function') return originalGoTab(id);
    document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
    const t = document.getElementById(id);
    if(t) t.classList.add('active');
  };

  const originalOpenSection = window.openSection;
  window.openSection = function(section){
    closeMenu();
    if(typeof originalOpenSection === 'function') return originalOpenSection(section);
  };
})();