const filters=document.querySelectorAll('[data-filter]');function filter(value){filters.forEach(b=>{const active=b.dataset.filter===value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});document.querySelectorAll('[data-category]').forEach(c=>{c.hidden=value!=='all'&&c.dataset.category!==value});}filters.forEach(b=>b.addEventListener('click',()=>filter(b.dataset.filter)));if(filters.length&&[...filters].some(b=>b.dataset.filter===location.hash.slice(1)))filter(location.hash.slice(1));const topic=document.getElementById('topic');if(topic){const value=new URLSearchParams(location.search).get('thema');if([...topic.options].some(o=>o.value===value))topic.value=value;}document.getElementById('contact-form')?.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('name').value.trim(),message=document.getElementById('message').value.trim();if(!name||!message)return;const subject='Kontakt · '+topic.options[topic.selectedIndex].text;location.href='mailto:office@kk-specialguns.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent('Guten Tag Herr Kargl,\n\n'+message+'\n\nMit freundlichen Grüßen\n'+name);document.getElementById('form-status').textContent='Ihre E-Mail wurde vorbereitet. Falls kein Programm geöffnet wird, schreiben Sie direkt an office@kk-specialguns.com.';});
(() => {
 const carousel=document.querySelector('.hero-carousel');if(!carousel)return;
 const slides=[...carousel.querySelectorAll('.hero-slide')],toggle=carousel.querySelector('.carousel-toggle');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let index=0,timer=null,paused=reduced.matches;
 function advance(){const previous=slides[index];previous.classList.remove('is-active');previous.classList.add('is-leaving');previous.setAttribute('aria-hidden','true');index=(index+1)%slides.length;const next=slides[index];next.classList.remove('is-leaving');next.classList.add('is-active');next.setAttribute('aria-hidden','false');}
 function sync(){clearInterval(timer);if(!paused&&!document.hidden)timer=setInterval(advance,5000);}
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',()=>{paused=reduced.matches;sync()});sync();
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
