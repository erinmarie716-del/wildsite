/* Floating stars in the background, plus stars that pop out of links, buttons and cards on hover,
   and burst out of "click targets" on click. Add <script src="stars.js" defer></script> before </body>
   and <link rel="stylesheet" href="stars.css"> in <head>. */
(function(){
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // CHANGE THESE: star colors, and which elements react.
  var COLORS=['#6a8c5a','#f2afb0','#6a8c5a','#f2afb0','#6a8c5a'];
  var HOVER_SELECTOR='a,button,.btn,.card,.wmini,.work__item,.plan,.feature,.faq__item,.flower-gallery figure,.consult';   // stars pop out of the edges on hover
  var CLICK_SELECTOR='.star-click';           // stars burst on click (add this class to any word)
  var NAV_SELECTOR='.nav > a, .nav .nav__top'; // main menu items: stars pop on every hover and linger longer

  var box=document.createElement('div'); box.id='stars'; box.setAttribute('aria-hidden','true'); document.body.appendChild(box);
  function rnd(a,b){ return a+Math.random()*(b-a); }
  function star(size,color){
    var d=document.createElement('span'); d.className='st'; d.style.width=d.style.height=size+'px';
    d.innerHTML='<svg viewBox="0 0 24 24"><path fill="'+color+'" d="M12 1.5c.6 4.9 2.6 8.5 10.5 10.5C14.6 14 12.6 17.6 12 22.5 11.4 17.6 9.4 14 1.5 12 9.4 10 11.4 6.4 12 1.5z"/></svg>';
    return d;
  }
  function size(){ box.style.height=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight)+'px'; }
  function floaters(){
    box.querySelectorAll('.fl').forEach(function(n){ n.remove(); });
    var h=parseFloat(box.style.height)||innerHeight, n=Math.max(8,Math.round(h/260));
    for(var i=0;i<n;i++){
      var s=star(rnd(7,13),COLORS[i%COLORS.length]); s.className+=' fl';
      s.style.left=rnd(1,97)+'%'; s.style.top=((i+rnd(.1,.9))/n*h)+'px';
      var st=s.style;
      st.setProperty('--dur',rnd(11,22).toFixed(1)+'s'); st.setProperty('--del','-'+rnd(0,12).toFixed(1)+'s');
      st.setProperty('--dx',rnd(-70,70).toFixed(0)+'px'); st.setProperty('--dy',rnd(-60,60).toFixed(0)+'px'); st.setProperty('--rot',rnd(-40,40).toFixed(0)+'deg');
      var o=rnd(.18,.4); st.setProperty('--o1',(o*.4).toFixed(2)); st.setProperty('--o2',o.toFixed(2));
      box.appendChild(s);
    }
  }
  function build(){ size(); floaters(); }
  window.addEventListener('load',function(){ build(); setTimeout(build,1500); });
  var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(build,300); });

  // click: stars burst out from the click point
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest(CLICK_SELECTOR); if(!t) return;
    var r=t.getBoundingClientRect(), sx=window.scrollX, sy=window.scrollY, n=5+Math.floor(Math.random()*3);
    var cx=(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)?e.clientX:r.left+r.width/2, cy=(e.clientY>=r.top&&e.clientY<=r.bottom)?e.clientY:r.top+r.height/2;
    for(var i=0;i<n;i++){
      var sz=rnd(8,15), s=star(sz,COLORS[Math.floor(rnd(0,COLORS.length))]); s.className+=' pop';
      s.style.left=(cx+sx-sz/2)+'px'; s.style.top=(cy+sy-sz/2)+'px';
      var ang=rnd(0,Math.PI*2), dist=rnd(34,78);
      s.style.setProperty('--dx',(Math.cos(ang)*dist).toFixed(0)+'px'); s.style.setProperty('--dy',(Math.sin(ang)*dist-8).toFixed(0)+'px');
      box.appendChild(s); (function(el){ setTimeout(function(){ el.remove(); },1400); })(s);
    }
  });

  // hover: a few stars pop out of the element's edges (throttled, and not every time)
  var last=0;
  document.addEventListener('mouseover',function(e){
    var t=e.target.closest&&e.target.closest(HOVER_SELECTOR);
    if(!t||t.contains(e.relatedTarget)) return;
    var isNav=!!(t.closest&&t.closest(NAV_SELECTOR));
    var now=Date.now(); if(!isNav&&(now-last<500||Math.random()>.85)) return; if(isNav&&now-last<250) return; last=now;
    var r=t.getBoundingClientRect(), sx=window.scrollX, sy=window.scrollY, n=isNav?3+Math.floor(Math.random()*3):2+Math.floor(Math.random()*3);
    for(var i=0;i<n;i++){
      var edge=Math.floor(rnd(0,4)), x, y;
      if(edge===0){ x=rnd(r.left,r.right); y=r.top; } else if(edge===1){ x=r.right; y=rnd(r.top,r.bottom); }
      else if(edge===2){ x=rnd(r.left,r.right); y=r.bottom; } else { x=r.left; y=rnd(r.top,r.bottom); }
      var sz=rnd(8,15), s=star(sz,COLORS[Math.floor(rnd(0,COLORS.length))]); s.className+=isNav?' pop pop--linger':' pop';
      s.style.left=(x+sx-sz/2)+'px'; s.style.top=(y+sy-sz/2)+'px';
      var ang=Math.atan2(y-(r.top+r.height/2),x-(r.left+r.width/2)), dist=rnd(26,60);
      s.style.setProperty('--dx',(Math.cos(ang)*dist).toFixed(0)+'px'); s.style.setProperty('--dy',(Math.sin(ang)*dist-10).toFixed(0)+'px');
      box.appendChild(s); (function(el,ms){ setTimeout(function(){ el.remove(); },ms); })(s,isNav?2700:1400);
    }
  });
})();
