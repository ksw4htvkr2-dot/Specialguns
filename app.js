const filters=document.querySelectorAll('[data-filter]');function filter(value){filters.forEach(b=>{const active=b.dataset.filter===value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});document.querySelectorAll('[data-category]').forEach(c=>{c.hidden=value!=='all'&&c.dataset.category!==value});}filters.forEach(b=>b.addEventListener('click',()=>filter(b.dataset.filter)));if(filters.length&&[...filters].some(b=>b.dataset.filter===location.hash.slice(1)))filter(location.hash.slice(1));const topic=document.getElementById('topic');if(topic){const value=new URLSearchParams(location.search).get('thema');if([...topic.options].some(o=>o.value===value))topic.value=value;}document.getElementById('contact-form')?.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('name').value.trim(),message=document.getElementById('message').value.trim();if(!name||!message)return;const subject='Kontakt · '+topic.options[topic.selectedIndex].text;location.href='mailto:office@kk-specialguns.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent('Guten Tag Herr Kargl,\n\n'+message+'\n\nMit freundlichen Grüßen\n'+name);document.getElementById('form-status').textContent='Ihre E-Mail wurde vorbereitet. Falls kein Programm geöffnet wird, schreiben Sie direkt an office@kk-specialguns.com.';});
(() => {
 const carousel=document.querySelector('.hero-carousel');if(!carousel)return;
 const slides=[...carousel.querySelectorAll('.hero-slide')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,timer=null,changing=false;
 slides.forEach(slide=>{
  slide.style.transition='opacity 500ms cubic-bezier(.4,0,.2,1)';
  slide.style.filter='none';
  slide.style.transform='none';
 });
 function advance(){
  if(changing||slides.length<2)return;
  changing=true;
  const previous=slides[index];
  let finished=false,fallback;
  function revealNext(event){
   if(event&&event.propertyName!=='opacity')return;
   if(finished)return;
   finished=true;clearTimeout(fallback);
   previous.removeEventListener('transitionend',revealNext);
   previous.classList.remove('is-leaving');
   index=(index+1)%slides.length;
   const next=slides[index];
   next.classList.remove('is-leaving');
   next.classList.add('is-active');
   next.setAttribute('aria-hidden','false');
   changing=false;
  }
  previous.addEventListener('transitionend',revealNext);
  previous.classList.remove('is-active');
  previous.classList.add('is-leaving');
  previous.setAttribute('aria-hidden','true');
  fallback=setTimeout(()=>revealNext(),560);
 }
 function sync(){clearInterval(timer);if(!reduced.matches&&!document.hidden)timer=setInterval(advance,5000);}
 document.addEventListener('visibilitychange',sync);
 reduced.addEventListener('change',sync);sync();
})();

// Reveal each element once; scrolling back never hides it again.
(() => {
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 if(motion.matches||!('IntersectionObserver' in window))return;
 const home=location.pathname==='/'||location.pathname==='/index.html';
 const selector='.product-card, .catalog-heading, .location-section .section-head'+(home?', .hero>div:first-child>* , .hero-carousel, .section-head, .card, .intro>div, .contact-banner':'');
 const elements=[...document.querySelectorAll(selector)];
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.classList.add('scroll-visible');
   observer.unobserve(entry.target);
  });
 },{threshold:0.08,rootMargin:'0px 0px -24px 0px'});
 elements.forEach(element=>{
  if(element.matches('.product-card,.card')){
   const siblings=[...element.parentElement.children];
   element.style.setProperty('--reveal-delay',`${(siblings.indexOf(element)%3)*75}ms`);
  }
  element.classList.add('scroll-reveal');observer.observe(element);
 });
 const showAll=()=>{if(motion.matches){elements.forEach(e=>e.classList.add('scroll-visible'));observer.disconnect();}};
 motion.addEventListener('change',showAll);
})();

// Gentle scroll depth and pointer response; the page always scrolls normally.
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const hero=document.querySelector('.hero');
 let frame=0;
 const update=()=>{
  frame=0;
  if(!hero||reduced.matches)return;
  const rect=hero.getBoundingClientRect();
  if(rect.bottom<0||rect.top>innerHeight)return;
  const progress=Math.max(0,Math.min(1,-rect.top/rect.height));
  hero.style.setProperty('--hero-depth',`${progress*38}px`);
 };
 const scroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
 addEventListener('scroll',scroll,{passive:true});
 addEventListener('resize',scroll,{passive:true});
 update();
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 document.querySelectorAll('.product-card,.card').forEach(card=>{
  let pointerFrame=0;
  const reset=()=>{
   cancelAnimationFrame(pointerFrame);pointerFrame=0;
   card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');
   card.style.removeProperty('--light-x');card.style.removeProperty('--light-y');
  };
  card.addEventListener('pointermove',event=>{
   if(reduced.matches||!fine.matches)return;
   cancelAnimationFrame(pointerFrame);
   pointerFrame=requestAnimationFrame(()=>{
    const rect=card.getBoundingClientRect();
    const x=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));
    const y=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));
    card.style.setProperty('--tilt-x',`${(0.5-y)*2.4}deg`);
    card.style.setProperty('--tilt-y',`${(x-0.5)*2.4}deg`);
    card.style.setProperty('--light-x',`${x*100}%`);
    card.style.setProperty('--light-y',`${y*100}%`);
   });
  });
  card.addEventListener('pointerleave',reset);
  reduced.addEventListener('change',reset);
 });
 reduced.addEventListener('change',()=>{if(reduced.matches)hero?.style.removeProperty('--hero-depth');else update();});
})();

// Small pointer repulsion for hero motifs, independent of the slide animation.
(() => {
 const hero=document.querySelector('.hero-carousel');if(!hero)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 let pending=0;
 const reset=()=>{cancelAnimationFrame(pending);pending=0;hero.style.setProperty('--pointer-x','0px');hero.style.setProperty('--pointer-y','0px');};
 hero.addEventListener('pointermove',event=>{
  if(reduced.matches||!fine.matches)return;
  cancelAnimationFrame(pending);
  pending=requestAnimationFrame(()=>{
   const rect=hero.getBoundingClientRect();
   const x=Math.max(-1,Math.min(1,(event.clientX-rect.left-rect.width/2)/(rect.width/2)));
   const y=Math.max(-1,Math.min(1,(event.clientY-rect.top-rect.height/2)/(rect.height/2)));
   hero.style.setProperty('--pointer-x',`${-x*9}px`);
   hero.style.setProperty('--pointer-y',`${-y*7}px`);
  });
 });
 hero.addEventListener('pointerleave',reset);
 hero.addEventListener('pointercancel',reset);
 reduced.addEventListener('change',reset);fine.addEventListener('change',reset);
})();

// Maps stays disconnected until the visitor explicitly loads it.
(() => {
 const frame=document.getElementById('location-map');
 const load=document.getElementById('load-map');
 const disable=document.getElementById('disable-map');
 const status=document.getElementById('map-status');
 const placeholder=frame?.querySelector('.map-consent');
 if(!frame||!load||!disable||!placeholder)return;
 let iframe=null;
 load.addEventListener('click',()=>{
  if(iframe)return;
  iframe=document.createElement('iframe');
  iframe.title='Google Maps: KK Specialguns, Laxenburgerstraße 152, Vösendorf';
  iframe.width='1200';iframe.height='460';
  iframe.referrerPolicy='no-referrer';
  iframe.allowFullscreen=true;
  iframe.src='https://maps.google.com/maps?q=Laxenburgerstra%C3%9Fe%20152%2C%202331%20V%C3%B6sendorf&z=15&output=embed';
  placeholder.hidden=true;
  frame.append(iframe);
  disable.hidden=false;
  status.textContent='Google Maps ist für diesen Seitenaufruf aktiviert.';
  disable.focus({preventScroll:true});
 });
 disable.addEventListener('click',()=>{
  iframe?.remove();iframe=null;
  placeholder.hidden=false;disable.hidden=true;
  status.textContent='Die Karte ist deaktiviert. Bereits an Google übermittelte Daten oder dort gesetzte Cookies werden dadurch nicht gelöscht.';
  load.focus({preventScroll:true});
 });
})();
