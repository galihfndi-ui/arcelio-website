const btn=document.getElementById('menuBtn');
const nav=document.getElementById('mobileNav');
if(btn&&nav){
  btn.addEventListener('click',()=>{
    nav.classList.toggle('open');
    btn.textContent=nav.classList.contains('open')?'✕':'☰';
  });
  document.addEventListener('click',e=>{
    if(!btn.contains(e.target)&&!nav.contains(e.target)){
      nav.classList.remove('open');
      btn.textContent='☰';
    }
  });
}
