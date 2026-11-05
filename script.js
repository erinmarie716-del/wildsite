/* Infinite, draggable portfolio rail (ported from erin-marie.com). The cards are cloned on both
   sides; when you scroll into a clone set the position jumps back by one set, so there is never an empty edge. */
(function(){
  var rail=document.getElementById('work-rail'); if(!rail) return;
  var prev=document.querySelector('[data-rail-prev]'), next=document.querySelector('[data-rail-next]'), hint=document.querySelector('[data-rail-hint]');
  var originals=[].slice.call(rail.children);
  function clone(o){ var c=o.cloneNode(true); c.setAttribute('data-clone','1'); c.removeAttribute('id'); return c; }
  originals.slice().reverse().forEach(function(o){ rail.insertBefore(clone(o),rail.firstChild); });
  originals.forEach(function(o){ rail.appendChild(clone(o)); });
  var setW=0;
  function measure(){ var f=originals[0], l=originals[originals.length-1]; setW=l.offsetLeft+l.offsetWidth+18-f.offsetLeft; }
  function init(){ measure(); rail.style.scrollBehavior='auto'; rail.scrollLeft=originals[0].offsetLeft-parseFloat(getComputedStyle(rail).paddingLeft); rail.style.scrollBehavior=''; }
  var raf=null;
  rail.addEventListener('scroll',function(){
    if(raf) return; raf=requestAnimationFrame(function(){ raf=null;
      var pad=parseFloat(getComputedStyle(rail).paddingLeft), start=originals[0].offsetLeft-pad;
      if(rail.scrollLeft<start-setW*0.6){ rail.style.scrollBehavior='auto'; rail.scrollLeft+=setW; rail.style.scrollBehavior=''; }
      else if(rail.scrollLeft>start+setW*1.4){ rail.style.scrollBehavior='auto'; rail.scrollLeft-=setW; rail.style.scrollBehavior=''; }
    });
  },{passive:true});
  function step(){ return originals[0].getBoundingClientRect().width+18; }
  if(prev) prev.addEventListener('click',function(){ rail.scrollBy({left:-step()*2,behavior:'smooth'}); });
  if(next) next.addEventListener('click',function(){ rail.scrollBy({left:step()*2,behavior:'smooth'}); });
  if(hint) hint.addEventListener('click',function(){ rail.scrollBy({left:step(),behavior:'smooth'}); });
  var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(init,150); });
  // mouse drag
  var down=false,sx=0,sl=0,moved=false;
  rail.addEventListener('mousedown',function(e){ down=true;moved=false;sx=e.pageX;sl=rail.scrollLeft; });
  window.addEventListener('mousemove',function(e){ if(!down)return; var dx=e.pageX-sx; if(Math.abs(dx)>6){moved=true;rail.classList.add('dragging');} rail.scrollLeft=sl-dx; });
  window.addEventListener('mouseup',function(){ if(!down)return; down=false; setTimeout(function(){rail.classList.remove('dragging');},50); });
  rail.addEventListener('click',function(e){ if(moved){ e.stopPropagation(); e.preventDefault(); moved=false; } },true);
  if(document.fonts&&document.fonts.ready){ document.fonts.ready.then(init); } else { init(); }
})();

// 2026-11-04: portfolio flowers glide in when the section comes into view
(function () {
  var sec = document.querySelector('.portfolio');
  if (!sec) return;
  if (!('IntersectionObserver' in window)) { sec.classList.add('is-in'); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { sec.classList.add('is-in'); io.disconnect(); } });
  }, { threshold: 0.25 });
  io.observe(sec);
})();
