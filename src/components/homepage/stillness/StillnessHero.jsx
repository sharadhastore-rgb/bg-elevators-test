import React, {useLayoutEffect, useRef} from 'react';
import gsap from 'gsap';
import {FiArrowRight, FiX} from 'react-icons/fi';
import './styles.css';

const cards = [
 {src:'navy-steel-doors.webp',alt:'Stainless elevator doors framed in deep navy stone',x:-232,y:63,rotation:-30},
 {src:'panoramic-glass-lift.webp',alt:'Panoramic glass elevator in a modern home',x:-120,y:16,rotation:-15},
 {src:'champagne-lift.webp',alt:'Champagne elevator with warm stone finishes',x:120,y:16,rotation:15},
 {src:'call-panel.webp',alt:'Precision elevator call panel with blue illumination',x:232,y:63,rotation:30},
 {src:'navy-cabin.webp',alt:'Refined navy and stainless-steel elevator cabin',x:0,y:0,rotation:0},
];

/** Standalone, navbar-free hero. Pass your own workHref when integrating. */
export default function StillnessHero({
 title='Elevate Every Day',
 description='Thoughtfully designed elevators for homes and modern buildings. Refined finishes, considered details, and a better way to move between floors.',
 workHref=null,
 assetBase='/assets/elevators',
}){
 const root=useRef(null);
 const dialog=useRef(null);
 const openCollection=e=>{if(!workHref){e.preventDefault();dialog.current.showModal();}};
 useLayoutEffect(()=>{
  const mm=gsap.matchMedia();
  let mounted=true;
  const initial=gsap.context(()=>{
   if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    gsap.set('.stillness-card',{scale:0});
    gsap.set(['.title-char','.stillness-description'],{opacity:0});
   }
  },root);
  const ready=async()=>{
   const images=[...root.current.querySelectorAll('img')];
   await Promise.all([document.fonts.ready,...images.map(img=>img.decode().catch(()=>{}))]);
   if(!mounted)return;
   mm.add('(prefers-reduced-motion: no-preference)',()=>{
    const pictures=gsap.utils.toArray('.stillness-card',root.current);
    const chars=root.current.querySelectorAll('.title-char');
    const heading=root.current.querySelector('h1');
    const description=root.current.querySelector('.stillness-description');
    const tl=gsap.timeline({paused:true,defaults:{ease:'power1.out'}});
    tl.set(pictures,{x:0,y:0,xPercent:0,yPercent:0,rotation:0,scale:0})
      .set(chars,{opacity:0}).set(description,{opacity:0})
      .to(pictures,{scale:1,duration:.8,stagger:.15},0);
    pictures.forEach((picture,i)=>{
     const card=cards[i];
     if(card.x)tl.to(picture,{xPercent:card.x,yPercent:card.y,rotation:card.rotation,duration:.8},Math.abs(card.x)===120?1.39:1.49);
    });
    tl.set(heading,{filter:'blur(6px)'},2.2)
      .set(heading,{filter:'blur(0px)'},2.5)
      .to(chars,{opacity:1,duration:.8,stagger:.05,ease:'power2.out'},2.19)
      .to(description,{opacity:1,duration:.5,ease:'power2.out'},2.99);
    tl.pause(0);
    let visible=false;
    const observer=new IntersectionObserver(([entry])=>{
     const nextVisible=entry.isIntersecting&&entry.intersectionRatio>=.12;
     if(nextVisible&&!visible)tl.restart();
     if(!nextVisible&&visible)tl.pause(0);
     visible=nextVisible;
    },{threshold:[0,.12],rootMargin:'0px 0px -8% 0px'});
    observer.observe(root.current);
    return()=>{observer.disconnect();tl.kill();};
   },root);
  };
  ready();
  return()=>{mounted=false;mm.revert();initial.revert();};
 },[]);
 return <><section ref={root} className="stillness-hero tw:relative tw:isolate tw:min-h-svh tw:w-full tw:overflow-hidden tw:px-4 tw:pb-12 tw:pt-20 tw:text-[#012034] tw:max-[479px]:min-h-0 tw:max-[479px]:py-10" aria-labelledby="stillness-title">
  <div className="tw:mx-auto tw:max-w-[1600px]">
   <div className="stillness-gallery tw:relative tw:h-[400px] tw:max-[991px]:h-[300px]" aria-label="Elevator designs and finishes">
    {cards.map(card=><div key={card.src} className="card-anchor tw:absolute tw:left-1/2 tw:top-1/2 tw:aspect-square tw:h-[300px] tw:-translate-x-1/2 tw:-translate-y-1/2 tw:max-[991px]:h-[200px] tw:max-[479px]:h-[150px]">
     <div className="stillness-card tw:h-full tw:w-full" style={{transform:`translate(${card.x}%, ${card.y}%) rotate(${card.rotation}deg)`}}>
      <img src={`${assetBase}/${card.src}`} alt={card.alt} className="tw:block tw:h-full tw:w-full tw:object-cover" fetchPriority="high" width="600" height="600"/>
     </div>
    </div>)}
   </div>
   <div className="tw:relative tw:z-10 tw:mx-auto tw:mt-10 tw:flex tw:w-[70%] tw:flex-col tw:items-center tw:text-center tw:max-[991px]:w-full">
    <h1 id="stillness-title" className="tw:mb-4 tw:text-[100px] tw:leading-none tw:font-medium tw:max-[767px]:text-[80px] tw:max-[479px]:text-[52px]" aria-label={title}>
     <span aria-hidden="true">{title.split(' ').map((word,wordIndex)=><span key={wordIndex} className="tw:inline-block tw:whitespace-nowrap">{wordIndex>0&&'\u00a0'}{[...word].map((char,i)=><span key={i} className="title-char tw:inline-block">{char}</span>)}</span>)}</span>
    </h1>
    <div className="stillness-description tw:flex tw:w-[70%] tw:flex-col tw:items-center tw:max-[767px]:w-full">
     <p className="tw:mb-4 tw:text-base tw:leading-[1.4] tw:text-[#647985]">{description}</p>
     <a href={workHref || "#elevator-collection"} onClick={openCollection} className="tw:group tw:inline-flex tw:items-center tw:text-base tw:font-medium tw:text-white tw:outline-offset-4 tw:focus-visible:outline-2 tw:focus-visible:outline-[#006699]" aria-label="Explore elevators">
      <span className="tw:rounded-[6px] tw:bg-[#006699] tw:px-4 tw:py-3 tw:transition-colors tw:group-hover:bg-[#3396D6]"><span className="tw:relative tw:block tw:overflow-hidden"><span className="tw:block tw:transition-transform tw:duration-300 tw:group-hover:-translate-y-full tw:group-focus-visible:-translate-y-full">Explore Elevators</span><span aria-hidden="true" className="tw:absolute tw:inset-0 tw:translate-y-full tw:transition-transform tw:duration-300 tw:group-hover:translate-y-0 tw:group-focus-visible:translate-y-0">Explore Elevators</span></span></span>
      <span className="tw:relative tw:flex tw:h-12 tw:w-12 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#E5F2F8] tw:text-[#006699] tw:transition-transform tw:duration-300 tw:group-hover:translate-x-1 tw:group-focus-visible:translate-x-1"><FiArrowRight size={18} aria-hidden="true"/></span>
     </a>
    </div>
   </div>
  </div>
 </section>
 <dialog ref={dialog} id="elevator-collection" aria-labelledby="collection-title" onClick={e=>{if(e.target===dialog.current)dialog.current.close();}} className="stillness-dialog tw:m-auto tw:max-h-[90svh] tw:w-[calc(100%_-_2rem)] tw:max-w-[960px] tw:overflow-y-auto tw:rounded-2xl tw:border tw:border-[#D6E2E6] tw:bg-white tw:p-6 tw:text-[#123A4F] tw:shadow-2xl tw:backdrop:bg-[#012034]/70 tw:md:p-8">
  <div className="tw:mb-6 tw:flex tw:items-center tw:justify-between tw:gap-4"><h2 id="collection-title" className="tw:text-2xl tw:font-medium tw:text-[#012034]">Explore the collection</h2><button autoFocus type="button" onClick={()=>dialog.current.close()} aria-label="Close elevator collection" className="tw:rounded-full tw:bg-[#E5F2F8] tw:p-3 tw:text-[#006699] tw:hover:bg-[#D6E2E6]"><FiX size={20}/></button></div>
  <div className="tw:grid tw:gap-5 tw:sm:grid-cols-3">{[
   {image:'panoramic-glass-lift.webp',name:'Panoramic lifts',copy:'Open views. Architectural presence.'},
   {image:'champagne-lift.webp',name:'Residential lifts',copy:'Thoughtful details for everyday living.'},
   {image:'navy-cabin.webp',name:'Passenger elevators',copy:'Refined interiors for modern buildings.'}
  ].map(item=><article key={item.name} className="tw:overflow-hidden tw:rounded-xl tw:border tw:border-[#D6E2E6] tw:bg-[#F5F8F9]"><img src={`${assetBase}/${item.image}`} alt={item.name} className="tw:aspect-square tw:w-full tw:object-cover"/><div className="tw:p-4"><h3 className="tw:mb-2 tw:font-medium tw:text-[#012034]">{item.name}</h3><p className="tw:text-sm tw:text-[#647985]">{item.copy}</p></div></article>)}</div>
 </dialog></>;
}
