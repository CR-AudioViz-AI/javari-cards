"use client";
// app/page.tsx — Javari Cards · CR AudioViz AI · EIN 39-3646201 · May 2026
import { useState } from "react";
const T=[{"i": "\ud83d\udcb0", "l": "Price Guide", "d": "AI card valuations", "h": "/price"}, {"i": "\ud83d\udccb", "l": "Inventory", "d": "Collection management", "h": "/inv"}, {"i": "\u270d\ufe0f", "l": "Listing Writer", "d": "eBay/COMC listings", "h": "/list"}, {"i": "\ud83d\udd0d", "l": "Identifier", "d": "Identify unknown cards", "h": "/id"}];
export default function P() {
  const [i,setI]=useState(""); const [o,setO]=useState(""); const [l,setL]=useState(false);
  async function go() { if(!i.trim())return; setL(true);setO("");
    try { const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:i}],stream:false,systemOverride:"You are a trading card expert. Provide accurate valuations."})});
      const d=await r.json(); setO(d?.choices?.[0]?.message?.content||d?.content||"Error.");
    } catch {setO("Error.");} setL(false); }
  return (<div style={{minHeight:"100vh",background:"#040912",color:"#e2e8f0",fontFamily:"system-ui"}}>
    <nav style={{background:"#1E3A5F",padding:"0 20px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>🃏</span><span style={{fontWeight:800,color:"#FF0800",fontSize:15}}>Javari Cards</span></div>
      <a href="https://craudiovizai.com/auth/signup" style={{background:"#FF0800",color:"#fff",borderRadius:7,padding:"5px 14px",fontSize:12,fontWeight:700,textDecoration:"none"}}>Sign Up Free</a>
    </nav>
    <section style={{background:"linear-gradient(135deg,#1E3A5F,#040912)",padding:"48px 24px 40px",textAlign:"center"}}>
      <h1 style={{fontSize:"clamp(22px,4vw,42px)",fontWeight:900,color:"#fff",margin:"0 0 10px",lineHeight:1.05}}>Collect & Track<br/><span style={{color:"#FF0800"}}>Trading Cards</span></h1>
      <p style={{color:"rgba(255,255,255,0.7)",fontSize:15,margin:0}}>Collection management, price guides, and listing writer.</p>
    </section>
    <section style={{maxWidth:700,margin:"0 auto",padding:"24px 20px 0"}}>
      <div style={{background:"#0F1F32",border:"1px solid rgba(0,180,216,0.12)",borderRadius:14,padding:"18px 22px"}}>
        <div style={{display:"flex",gap:8}}><input value={i} onChange={e=>setI(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Value this card: 1952 Topps Mickey Mantle PSA 3" style={{flex:1,background:"#172D48",border:"1px solid rgba(0,180,216,0.15)",borderRadius:8,padding:"10px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"system-ui"}}/>
        <button onClick={go} disabled={l||!i.trim()} style={{background:l||!i.trim()?"#0F1F32":"#1E3A5F",color:l||!i.trim()?"#374151":"#FF0800",border:"1px solid rgba(0,180,216,0.2)",borderRadius:8,padding:"10px 18px",fontSize:13,fontWeight:700,cursor:l||!i.trim()?"not-allowed":"pointer",fontFamily:"system-ui"}}>{l?"...":"Go"}</button></div>
        {o&&<pre style={{marginTop:12,padding:"12px",background:"rgba(0,180,216,0.05)",border:"1px solid rgba(0,180,216,0.1)",borderRadius:8,fontSize:13,color:"#e2e8f0",lineHeight:1.65,whiteSpace:"pre-wrap",fontFamily:"system-ui",maxHeight:300,overflowY:"auto",margin:"12px 0 0"}}>{o}</pre>}
      </div>
    </section>
    <section style={{maxWidth:960,margin:"0 auto",padding:"28px 20px 64px"}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:10}}>
      {T.map((t:any)=>(<a key={t.h} href={t.h} style={{background:"#0F1F32",border:"1px solid rgba(0,180,216,0.08)",borderRadius:12,padding:"16px",textDecoration:"none",display:"block"}}><span style={{fontSize:24,display:"block",marginBottom:7}}>{t.i}</span><div style={{fontWeight:700,fontSize:13,color:"#e2e8f0",marginBottom:3}}>{t.l}</div><div style={{fontSize:11,color:"#6B7280",lineHeight:1.4}}>{t.d}</div></a>))}
    </div></section>
    <footer style={{borderTop:"1px solid rgba(0,180,216,0.08)",padding:"12px 24px",textAlign:"center"}}><p style={{color:"#374151",fontSize:11,margin:0}}>© 2026 CR AudioViz AI, LLC — EIN: 39-3646201</p></footer>
  </div>);
}