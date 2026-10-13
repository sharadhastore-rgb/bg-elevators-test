import React,{useLayoutEffect,useRef,useState,useId} from 'react';
import gsap from 'gsap';
import {FiArrowLeft,FiArrowRight,FiX} from 'react-icons/fi';
import {slides as defaultSlides} from './slides';
import {cardPosition,wrapIndex} from './carousel';

export default function ElevatorStackedGallery({items=defaultSlides,assetBase='/assets/elevators',highlight='Elevators',heading='for Every Space',buttonLabel='View elevator',onSelect}){
 const [active,setActive]=useState(0);
 const [selected,setSelected]=useState(null);
 const root=useRef(null),track=useRef(null),dialog=useRef(null),cards=useRef([]);
 const controller=useRef(null),drag=useRef(null),suppressClick=useRef(false);
 const headingId=useId(),dialogId=useId();
 const current=wrapIndex(active,items.length);
 const move=delta=>setActive(index=>wrapIndex(index+delta,items.length));
 useLayoutEffect(()=>{
  const ctx=gsap.context(()=>{},root);
  const mq=window.matchMedia('(prefers-reduced-motion: reduce)');
  let selectedIndex=current;
  const draw=(index,animate)=>ctx.add(()=>{
   selectedIndex=index;
   const width=cards.current[0]?.offsetWidth||606;
   cards.current.forEach((card,i)=>{
    if(!card)return;
    const props=cardPosition(i,index,items.length,width,innerWidth<=991);
    gsap.set(card,{zIndex:props.zIndex});
    if(animate&&!mq.matches)gsap.to(card,{x:props.x,scale:props.scale,opacity:props.opacity,duration:.4,ease:'power2.out',overwrite:true});
    else {gsap.killTweensOf(card);gsap.set(card,props);}
   });
  });
  controller.current=index=>draw(index,true);
  draw(current,false);
  const resize=()=>draw(selectedIndex,false);
  const observer=new ResizeObserver(resize);observer.observe(track.current);
  mq.addEventListener('change',resize);
  return()=>{observer.disconnect();mq.removeEventListener('change',resize);controller.current=null;ctx.revert();};
 },[items.length]);
 useLayoutEffect(()=>{controller.current?.(current);},[current]);
 useLayoutEffect(()=>{
  if(selected&&!dialog.current.open)dialog.current.showModal();
 },[selected]);
 const open=()=>{if(onSelect)onSelect(items[current]);else setSelected(items[current]);};
 const pointerDown=e=>{
  if(e.button!==0||e.target.closest('button,a'))return;
  drag.current={id:e.pointerId,x:e.clientX,y:e.clientY};
  suppressClick.current=false;

 };
 const pointerUp=e=>{
  if(!drag.current||drag.current.id!==e.pointerId)return;
  const dx=e.clientX-drag.current.x,dy=e.clientY-drag.current.y;
  const threshold=(cards.current[0]?.offsetWidth||326)*.25;
  if(Math.abs(dx)>threshold&&Math.abs(dx)>Math.abs(dy)){
   move(dx<0?1:-1);suppressClick.current=true;
  }
  drag.current=null;
  if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
 };
 const selectCard=index=>{if(suppressClick.current){suppressClick.current=false;return;}if(index!==current)setActive(index);};
 return <section ref={root} className="elevator-stack w-full overflow-hidden bg-white px-5 pb-12 pt-4 text-[#012034] md:pb-16" aria-labelledby={headingId}>
  <h1 id={headingId} className="stack-heading mx-auto text-center font-medium"><span className="text-[#006699]">{highlight}</span> {heading}</h1>
  <div className="stack-wrapper relative mx-auto w-full max-w-[1056px]" role="region" aria-roledescription="carousel" aria-label="Elevator designs" tabIndex={0} onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}}}>
   <div className="stack-viewport relative mx-auto max-w-[960px] overflow-hidden">
    <div ref={track} className="stack-track relative flex select-none items-center justify-center [touch-action:pan-y]" onPointerDown={pointerDown} onPointerMove={e=>{if(drag.current&&Math.abs(e.clientX-drag.current.x)>8)e.currentTarget.setPointerCapture(e.pointerId);}} onClickCapture={e=>{if(suppressClick.current){suppressClick.current=false;e.preventDefault();e.stopPropagation();}}} onPointerUp={pointerUp} onPointerCancel={()=>{drag.current=null;}}>
     {items.map((item,index)=><article key={item.id} ref={el=>{cards.current[index]=el;}} className={`stack-card absolute flex flex-col justify-end overflow-hidden rounded-xl p-6 ${index===current?'cursor-grab active:cursor-grabbing':'cursor-pointer'}`} onClick={()=>selectCard(index)} aria-roledescription="slide" aria-label={`${index+1} of ${items.length}: ${item.name}`}>
      <img src={`${assetBase}/${item.image}`} alt={item.alt} draggable="false" fetchPriority={index===0?'high':'auto'} className="pointer-events-none absolute inset-0 h-full w-full object-cover"/>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#012034]/30 via-transparent to-transparent"/>
      {index===current&&<div className="relative text-center"><button type="button" onClick={e=>{e.stopPropagation();open();}} className="rounded-full bg-white px-[30px] py-[14px] text-base leading-5 text-[#123A4F] transition-colors hover:bg-[#E5F2F8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3396D6]">{buttonLabel}</button></div>}
     </article>)}
    </div>
    <div className="stack-fade pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent"/>
    <div className="stack-fade pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent"/>
   </div>
   <div className="stack-controls mx-auto mt-6 flex max-w-[960px] justify-between px-1">
    <button type="button" onClick={()=>move(-1)} className="stack-prev stack-arrow" aria-label="Previous elevator"><FiArrowLeft size={16}/></button>
    <button type="button" onClick={()=>move(1)} className="stack-next stack-arrow" aria-label="Next elevator"><FiArrowRight size={16}/></button>
   </div>
   <p className="sr-only" aria-live="polite" aria-atomic="true">{items[current].name}, {current+1} of {items.length}</p>
  </div>
  <dialog ref={dialog} aria-labelledby={dialogId} onClose={()=>setSelected(null)} onClick={e=>{if(e.target===dialog.current)dialog.current.close();}} className="m-auto max-h-[90svh] w-[calc(100%_-_2rem)] max-w-[760px] overflow-auto rounded-2xl border border-[#D6E2E6] bg-white p-5 text-[#123A4F] shadow-2xl backdrop:bg-[#012034]/70 md:p-7">
   {selected&&<><div className="mb-5 flex items-center justify-between gap-4"><h2 id={dialogId} className="text-2xl font-medium text-[#012034]">{selected.name}</h2><button type="button" autoFocus onClick={()=>dialog.current.close()} aria-label="Close elevator details" className="rounded-full bg-[#E5F2F8] p-3 text-[#006699]"><FiX size={20}/></button></div><img src={`${assetBase}/${selected.image}`} alt={selected.alt} className="max-h-[55svh] w-full rounded-xl object-contain"/><p className="mt-5 leading-relaxed text-[#647985]">{selected.description}</p></>}
  </dialog>
 </section>;
}
