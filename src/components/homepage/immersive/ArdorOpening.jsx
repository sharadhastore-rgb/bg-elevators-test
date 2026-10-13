import React, {useLayoutEffect, useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import images from './images.json';
import {POSITIONS} from './positions';
import './styles.css';
gsap.registerPlugin(ScrollTrigger);

function CameraFrame(){
 return <div className="camera-frame tw:pointer-events-none tw:absolute tw:inset-4 tw:md:inset-7" aria-hidden="true">
  {['tl','tr','bl','br'].map(c=><i key={c} className={`viewfinder corner-${c} tw:absolute tw:h-[30px] tw:w-[30px] tw:border-[#3396D6]`}/>)}
  <div className="readout tw:absolute tw:left-6 tw:top-3">ELEVATOR COLLECTION</div>
  <div className="readout tw:absolute tw:right-6 tw:top-3">DESIGN / 01</div>
  <div className="readout tw:absolute tw:bottom-3 tw:left-6">RESIDENTIAL · COMMERCIAL</div>
  <div className="readout tw:absolute tw:bottom-3 tw:right-6">BUILT AROUND YOU</div>
  <div className="readout tw:absolute tw:left-4 tw:top-1/2 tw:-translate-x-1/2 tw:-rotate-90 tw:whitespace-nowrap tw:md:left-8">DESIGN · DETAIL · MOVEMENT</div>
  <div className="readout tw:absolute tw:right-4 tw:top-1/2 tw:translate-x-1/2 tw:rotate-90 tw:whitespace-nowrap tw:md:right-8">A NEW PERSPECTIVE</div>
  <div className="focus-frame tw:absolute tw:left-1/2 tw:top-[6.5%] tw:h-32 tw:w-32 tw:-translate-x-1/2 tw:max-md:top-[12.5%] tw:max-md:h-28 tw:max-md:w-28">
   {['tl','tr','bl','br'].map(c=><i key={c} className={`focus-corner corner-${c} tw:absolute tw:h-[18px] tw:w-[18px] tw:border-[#3396D6]`}/>)}
  </div>
 </div>;
}

export function ArdorOpening(){
 const root=useRef(null);
 useLayoutEffect(()=>{
  const media=gsap.matchMedia();
  let alive=true;
  const start=()=>{
   if(!alive)return;
   media.add({motion:'(prefers-reduced-motion: no-preference)',reduce:'(prefers-reduced-motion: reduce)'},context=>{
    const section=root.current, cards=gsap.utils.toArray('.portrait',section),field=section.querySelector('.image-field'),title=section.querySelector('h1'),kicker=section.querySelector('.kicker'),reveal=section.querySelector('.reveal'),frame=section.querySelector('.camera-frame'),slot=section.querySelector('.title-slot');
    const position=i=>{const b=POSITIONS[i],w=innerWidth;return {...b,...(w<=479?b.mp:w<=767?b.ml:w<=991?b.t:{})}};
    const layout=()=>{
     const w=innerWidth,h=section.clientHeight,scale=w<=479?2.3:w<=767?1.8:w<=991?1.45:1;
     cards.forEach((card,i)=>{const p=position(i);gsap.set(card,{width:p.w*scale+'vw',aspectRatio:p.ar,xPercent:-50,yPercent:-50,x:p.x/100*w,y:p.y/100*h,z:p.z});});
     const r=slot.getBoundingClientRect(),bounds=section.getBoundingClientRect();gsap.set(reveal,{transformOrigin:`${r.left-bounds.left}px ${r.top-bounds.top+r.height/2}px`});
    };
    layout();
    if(context.conditions.reduce){gsap.set(reveal,{display:'none'});return;}
    gsap.set(frame,{autoAlpha:0});gsap.set(reveal,{scale:0});
    const intro=gsap.timeline({paused:true});
    cards.forEach((card,i)=>intro.fromTo(card,{autoAlpha:0,z:position(i).z-1600},{autoAlpha:1,z:position(i).z,duration:.8,ease:'power2.out'},.1+i*.14));
    intro.fromTo(kicker,{autoAlpha:0},{autoAlpha:1,duration:.8},.9).fromTo(title,{autoAlpha:0},{autoAlpha:1,duration:.8},1.05);
    const scroll=gsap.timeline({paused:true});
    cards.forEach((card,i)=>scroll.fromTo(card,{autoAlpha:1,z:position(i).z},{autoAlpha:0,z:()=>position(i).z-1600,duration:.75,ease:'power2.in',immediateRender:false},0));
    scroll.fromTo(reveal,{scale:0},{scale:1,duration:.8,ease:'power2.inOut',immediateRender:false},0)
     .fromTo(kicker,{autoAlpha:1},{autoAlpha:0,duration:.18,immediateRender:false},.08)
     .fromTo(title,{autoAlpha:1},{autoAlpha:0,duration:.25,immediateRender:false},.3)
     .to(frame,{autoAlpha:1,duration:.28,ease:'power2.out'},.64)
     .fromTo('.focus-corner',{x:i=>i%2?90:-90,y:i=>i<2?-90:90},{x:0,y:0,duration:.18,ease:'power3.out'},.72);
    const trigger=ScrollTrigger.create({trigger:section,start:'top top',end:'+=220%',pin:true,scrub:.8,animation:scroll,invalidateOnRefresh:true,onUpdate:self=>{if(self.progress>.01&&intro.isActive())intro.progress(1).pause();}});
    let visible=false;
    const observer=new IntersectionObserver(([entry])=>{
     const nextVisible=entry.isIntersecting&&entry.intersectionRatio>=.12;
     if(nextVisible&&!visible&&trigger.progress<=.01)intro.restart();
     if(!nextVisible&&visible&&trigger.progress<=.01)intro.pause(0);
     visible=nextVisible;
    },{threshold:[0,.12],rootMargin:'0px 0px -8% 0px'});
    observer.observe(section);
    const rx=gsap.quickTo(field,'rotationX',{duration:.8,ease:'power2.out'}),ry=gsap.quickTo(field,'rotationY',{duration:.8,ease:'power2.out'});
    const move=e=>{if(matchMedia('(pointer: fine)').matches){ry((e.clientX/innerWidth-.5)*6);rx(-(e.clientY/innerHeight-.5)*4);}};
    const resize=()=>{layout();trigger.refresh();};
    window.addEventListener('pointermove',move);window.addEventListener('resize',resize);
    return ()=>{observer.disconnect();intro.kill();window.removeEventListener('pointermove',move);window.removeEventListener('resize',resize);};
   },root);
  };
  document.fonts.ready.then(start);
  return ()=>{alive=false;media.revert();};
 },[]);
 return <div className="ardor-opening-root">
  <section ref={root} className="opening tw:relative tw:h-svh tw:overflow-hidden tw:bg-[#012034]" aria-label="Elevator design collection and immersive lobby reveal">
   <div className="tw:absolute tw:inset-0 tw:[perspective:1200px]" aria-hidden="true"><div className="image-field tw:absolute tw:inset-0 tw:[transform-style:preserve-3d]">
    {images.map((img,i)=><div key={img.src} className="portrait tw:absolute tw:left-[42%] tw:top-1/2" style={{aspectRatio:POSITIONS[i].ar}}><img {...img} className="tw:h-full tw:w-full tw:object-cover" fetchPriority={i<3?'high':'auto'}/></div>)}
   </div></div>
   <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:z-10 tw:flex tw:flex-col tw:items-center tw:justify-center">
    <p className="kicker tw:flex tw:items-center tw:gap-3 tw:text-[14px] tw:tracking-[.16em] tw:font-medium tw:text-[#3396D6]"><span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-[#F19000]"/>ELEVATORS / REDEFINED</p>
    <h1 className="hero-title tw:mt-5 tw:mb-2.5 tw:text-center tw:font-bold tw:text-[#FFFFFF]">Elevating spaces.<span className="title-slot tw:inline-block tw:h-[1em] tw:w-0 tw:align-middle"/><br/>Connecting lives.</h1>
   </div>
   <div className="reveal tw:pointer-events-none tw:absolute tw:inset-0 tw:z-20 tw:origin-center" role="img" aria-label="Modern elevator in a navy and stone lobby, revealed as you scroll">
    <img src="/assets/elevators/lobby-reveal.webp" alt="" className="tw:h-full tw:w-full tw:object-cover"/><CameraFrame/>
   </div>
  </section>
 </div>;
}
