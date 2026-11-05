/* Case-study deck ported from erin-marie.com */
(function(){
  var cs=document.getElementById('cs'), stage=document.getElementById('cs-stage'), steps=document.getElementById('cs-steps');
  var nameEl=document.getElementById('cs-name'), kindEl=document.getElementById('cs-kind'), nEl=document.getElementById('cs-n'), prog=document.getElementById('cs-prog');
  var prevB=document.getElementById('cs-prev'), nextB=document.getElementById('cs-next');
  var slides=[], i=0, cur=null, opener=null, nextDeck=null;

  function open(id, fromHash){
    var t=document.getElementById('deck-'+id); if(!t) return false;
    cur=id; nextDeck=t.getAttribute('data-next');
    nameEl.textContent=t.getAttribute('data-name'); kindEl.innerHTML=t.getAttribute('data-kind');
    stage.innerHTML=''; steps.innerHTML='';
    stage.appendChild(t.content.cloneNode(true));
    slides=[].slice.call(stage.querySelectorAll('.slide'));
    slides.forEach(function(sl,idx){
      var b=document.createElement('button'); b.textContent=sl.getAttribute('data-step'); b.addEventListener('click',function(){go(idx);}); steps.appendChild(b);
    });
    var np=stage.querySelector('[data-next]'); if(np) np.addEventListener('click',function(){ if(nextDeck&&document.getElementById('deck-'+nextDeck)){open(nextDeck);} else {close();} });
    cs.classList.add('on'); document.body.classList.add('cs-open');
    go(0,true);
    if(!fromHash && location.hash!=='#'+id) history.pushState({cs:id},'','#'+id);
    cs.querySelector('.x').focus();
    return true;
  }
  function close(){
    cs.classList.remove('on'); document.body.classList.remove('cs-open'); cur=null;
    if(location.hash){ history.pushState(null,'',location.pathname+location.search); }
    if(opener){opener.focus();}
  }
  function go(n,instant){
    if(n<0||n>=slides.length) return;
    slides.forEach(function(sl,idx){ sl.classList.toggle('cur',idx===n); sl.classList.toggle('prev',idx<n); });
    [].forEach.call(steps.children,function(b,idx){ b.classList.toggle('cur',idx===n); if(idx===n&&b.scrollIntoView) b.scrollIntoView({inline:'center',block:'nearest',behavior:instant?'auto':'smooth'}); });
    i=n; nEl.textContent=(n+1)+' / '+slides.length; prog.style.width=((n+1)/slides.length*100)+'%';
    prevB.disabled=(n===0); nextB.disabled=(n===slides.length-1);
  }
  prevB.addEventListener('click',function(){go(i-1);});
  nextB.addEventListener('click',function(){go(i+1);});
  cs.querySelectorAll('[data-close]').forEach(function(el){el.addEventListener('click',close);});
  document.addEventListener('keydown',function(e){
    if(!cs.classList.contains('on')) return;
    if(e.key==='Escape') close();
    else if(e.key==='ArrowRight') go(i+1);
    else if(e.key==='ArrowLeft') go(i-1);
  });
  // swipe
  var sx=null; stage.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
  stage.addEventListener('touchend',function(e){ if(sx===null) return; var dx=e.changedTouches[0].clientX-sx; sx=null; if(Math.abs(dx)>50){ go(dx<0?i+1:i-1); } });
  // tiles
  document.querySelectorAll('[data-deck]').forEach(function(a){
    function trigger(e){ if(e.target.closest&&e.target.closest('.site')) return; var id=a.getAttribute('data-deck'); if(document.getElementById('deck-'+id)){ e.preventDefault(); opener=a; open(id); } }
    a.addEventListener('click',trigger);
    a.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ trigger(e); } });
  });
  // deep links + back button
  function fromHash(){ var id=location.hash.replace('#',''); if(id&&document.getElementById('deck-'+id)){ open(id,true); } else if(cs.classList.contains('on')){ cs.classList.remove('on'); document.body.classList.remove('cs-open'); cur=null; } }
  window.addEventListener('popstate',fromHash);
  if(location.hash) fromHash();
})();
;
window.rfScroll=function(b){var pad=b.closest('.pad'),strip=pad.querySelector('.rfstrip'),lab=b.querySelector('span'),n=strip.children.length,st=b._st||(b._st={i:0,t:null});function show(i){strip.style.transform='translateY(-'+(i*100)+'%)';}function stop(txt){clearInterval(st.t);st.t=null;lab.textContent=txt;}if(st.t){stop('Click to scroll');return;}if(st.i>=n-1){st.i=0;show(0);}lab.textContent='Pause';st.t=setInterval(function(){st.i++;show(st.i);if(st.i>=n-1){stop('Replay');}},2400);};
;
(function(){function upd(t){var im=t.children,L=t.getBoundingClientRect(),ds=t.parentNode.querySelectorAll('.ls-dots button');for(var k=0;k<im.length;k++){var r=im[k].getBoundingClientRect(),vis=r.left>=L.left-4&&r.right<=L.right+4;if(ds[k])ds[k].classList.toggle('on',vis);}}
document.addEventListener('scroll',function(e){if(e.target.classList&&e.target.classList.contains('ls-track'))upd(e.target);},true);
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.ls-dots button');if(b){var c=b.parentNode.parentNode,t=c.querySelector('.ls-track'),n=[].indexOf.call(b.parentNode.children,b);t.scrollTo({left:t.children[n].offsetLeft-t.children[0].offsetLeft,behavior:'smooth'});return;}setTimeout(function(){document.querySelectorAll('.ls-track').forEach(upd);},120);});
window.addEventListener('resize',function(){document.querySelectorAll('.ls-track').forEach(upd);});})();
;
(function(){
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-vtoggle],[data-vbtn],[data-rfscroll]');
    if(!t) return;
    if(t.hasAttribute('data-rfscroll')){ rfScroll(t); return; }
    var v=t.hasAttribute('data-vtoggle')?t.querySelector('video'):(t.closest('.pad')&&t.closest('.pad').querySelector('video'));
    if(!v) return;
    if(v.paused){ v.play(); } else { v.pause(); }
  });
  ['play','pause','ended'].forEach(function(type){
    document.addEventListener(type,function(e){
      var v=e.target; if(!v||v.tagName!=='VIDEO') return;
      var pad=v.closest('.pad'); var s=pad&&pad.querySelector('.vcap span'); if(!s) return;
      s.textContent=type==='play'?'Pause':(type==='pause'?'Click to scroll':'Replay');
    },true);
  });
  document.querySelectorAll('img[data-fallback]').forEach(function(img){
    function fb(){ img.style.display='none'; if(img.nextElementSibling) img.nextElementSibling.style.display='inline'; }
    if(img.complete && !img.naturalWidth) fb(); else img.addEventListener('error',fb);
  });
})();
