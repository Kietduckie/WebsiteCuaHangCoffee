(function(){
  document.addEventListener('DOMContentLoaded',()=>{
    const searchBox = document.querySelector('.search-box');
    if(!searchBox) return;
    const input = searchBox.querySelector('input');
    const btn = searchBox.querySelector('button');
    if(!input) return;



    const boxes = document.querySelectorAll('.search-box');
    if(!boxes || boxes.length === 0) return;

    function positionContainer(input, suggestions) {
      const rect = input.getBoundingClientRect();
      suggestions.style.left = rect.left + 'px';
      suggestions.style.top = (rect.bottom + window.scrollY + 6) + 'px';
      suggestions.style.width = rect.width + 'px';
    }

    window.addEventListener('resize', ()=>{
      boxes.forEach(box=>{ const inp = box.querySelector('input'); const s = box._suggestions; if(inp && s) positionContainer(inp,s); });
    });
    window.addEventListener('scroll', ()=>{
      boxes.forEach(box=>{ const inp = box.querySelector('input'); const s = box._suggestions; if(inp && s) positionContainer(inp,s); });
    });

    const ABS_MENU = 'file:///C:/BaoCaoCacMon/ThietKeWeb/QuanLyCuaHangCafe/QuanLyCuaHangCafe/Main/menu.html';

    function getLocalProducts(){
      const isMenu = location.pathname.endsWith('menu.html');
      if(isMenu){
        const elems = Array.from(document.querySelectorAll('.drink-card-wrap'));
        return elems.map(el=>({
          nameRaw: (el.querySelector('.card-title')||{textContent:el.dataset.name}).textContent.trim(),
          name: (el.dataset.name||'').toLowerCase(),
          id: el.dataset.id,
          category: el.dataset.cat || '',
          el
        }));
      }
      try{
        const stored = JSON.parse(localStorage.getItem('cafe_menu')) || [];
        if(stored.length) return stored.map(p=>({nameRaw: p.name, name: p.name.toLowerCase(), id: p.id, category: p.category || ''}));
      }catch(e){}
      return [];
    }

    let products = getLocalProducts();

    function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    boxes.forEach(box=>{
      const input = box.querySelector('input');
      const btn = box.querySelector('button');
      if(!input) return;

      const suggestions = document.createElement('div');
      suggestions.className = 'search-suggestions';
      suggestions.style.display = 'none';
      suggestions.style.position = 'absolute';
      suggestions.style.zIndex = 2000;
      document.body.appendChild(suggestions);
      box._suggestions = suggestions; 

      function showSuggestions(term){
        if(!term){ suggestions.style.display='none'; return; }
        products = getLocalProducts();
        if(products.length===0){ suggestions.style.display='none'; return; }
        const q = term.toLowerCase();
        const matches = products.filter(p=> (p.name && p.name.includes(q)) || (p.id && p.id.toLowerCase().includes(q)) );
        matches.sort((a,b)=> (a.name.startsWith(q)?-1: (b.name.startsWith(q)?1:0)));
        if(matches.length===0){ suggestions.innerHTML = '<div class="s-empty small text-muted p-2">Không tìm thấy</div>'; suggestions.style.display='block'; positionContainer(input,suggestions); return; }
        suggestions.innerHTML = matches.slice(0,8).map(m=>`<div class="s-item" data-id="${m.id}" data-cat="${m.category||''}">${escapeHtml(m.nameRaw)}</div>`).join('');
        suggestions.style.display='block';
        positionContainer(input,suggestions);

        suggestions.querySelectorAll('.s-item').forEach(item=>{
          item.addEventListener('click', ()=>{
            const name = item.textContent.trim();
            const found = products.find(p=>p.id === item.dataset.id || p.nameRaw === name || p.name === name.toLowerCase());
            const cat = (found && found.category) || item.dataset.cat || '';
            if(cat){
              window.location.href = ABS_MENU + '#' + encodeURIComponent(cat);
            } else if(found && found.id){
              window.location.href = ABS_MENU + '#' + encodeURIComponent(found.id);
            } else {
              window.location.href = ABS_MENU + '?q=' + encodeURIComponent(term);
            }
          });
        });
      }

      input.addEventListener('input', (e)=>{ showSuggestions(e.target.value); });
      input.addEventListener('focus', ()=>{ if(input.value) showSuggestions(input.value); });

      document.addEventListener('click', (e)=>{ if(!suggestions.contains(e.target) && e.target !== input) suggestions.style.display='none'; });

      if(btn){ btn.addEventListener('click', (e)=>{
        e.preventDefault();
        const q = input.value.trim();
        if(!q) return;
        products = getLocalProducts();
        const matches = products.filter(p=>p.name && p.name.includes(q.toLowerCase()));
        if(matches.length){
          const first = matches[0];
          const cat = first.category || '';
          if(cat){
            window.location.href = ABS_MENU + '#' + encodeURIComponent(cat);
            return;
          }
          if(location.pathname.endsWith('menu.html') && first.el){
            first.el.scrollIntoView({behavior:'smooth', block:'center'});
            first.el.classList.add('search-highlight');
            setTimeout(()=>first.el.classList.remove('search-highlight'),3500);
            return;
          }
          if(first.id){
            window.location.href = ABS_MENU + '#' + encodeURIComponent(first.id);
            return;
          }
        }
        window.location.href = ABS_MENU + '?q=' + encodeURIComponent(q);
      }); }
    });


    if(location.pathname.endsWith('menu.html')){
      const params = new URLSearchParams(location.search);
      const q = params.get('q');
      if(q){
        setTimeout(()=>{
          products = getLocalProducts();
          const matches = products.filter(p=>p.name && p.name.includes(q.toLowerCase()));
          if(matches.length && matches[0].el){
            const first = matches[0];
            first.el.scrollIntoView({behavior:'smooth', block:'center'});
            first.el.classList.add('search-highlight');
            setTimeout(()=>first.el.classList.remove('search-highlight'),3500);
          }
        },250);
      }
    }


    const style = document.createElement('style');
    style.textContent = `
.search-suggestions{font-family:inherit;border:1px solid rgba(0,0,0,0.08);background:#fff;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.12);overflow:auto;max-height:300px;padding:4px;}
.search-suggestions .s-item{padding:8px 10px;cursor:pointer;border-radius:6px}
.search-suggestions .s-item:hover{background:rgba(111,78,55,0.06)}
.search-suggestions .s-empty{padding:8px}
.search-highlight{outline:4px solid rgba(210,180,140,0.35);transition:outline 0.2s;}
`;
    document.head.appendChild(style);


    position();
  });
})();
