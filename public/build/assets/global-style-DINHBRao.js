import{t as e}from"./app-LAzeghrL.js";var t=e(),n=()=>(0,t.jsx)(`style`,{children:`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    :root{
      --pitch: #2E1065; 
      --pitch-2: #3B0764; 
      --pitch-3: #4C1D95;
      --chalk: #FAF5FF; 
      --chalk-2: #FFFFFF;
      --ink: #1E1B4B; 
      --ink-dim: #6B7280;
      --amber: #8B5CF6; 
      --amber-ink: #FFFFFF;
      --line: rgba(139, 92, 246, 0.15); 
      --line-strong: rgba(139, 92, 246, 0.30);
      --line-dark: rgba(46, 16, 101, 0.10); 
      --line-dark-strong: rgba(46, 16, 101, 0.25);
    }
    
    .mp-root{ font-family:'Plus Jakarta Sans', sans-serif; background:var(--chalk); color:var(--ink); }
    .mp-display{ font-family:'Outfit', sans-serif; font-weight:700; letter-spacing:-0.02em; }
    .mp-root ::selection{ background:var(--amber); color:var(--amber-ink); }
    
    .mp-root button:focus-visible, .mp-root input:focus-visible, .mp-root select:focus-visible{
      outline:3px solid rgba(139, 92, 246, 0.5); outline-offset:2px;
    }
    
    .mp-root button{ transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
    .mp-root button:active:not(:disabled){ transform:scale(0.95); }

    @keyframes screenIn{ 
      from{opacity:0; transform:translateY(12px) scale(0.99);} 
      to{opacity:1; transform:translateY(0) scale(1);} 
    }
    .screen-anim{ animation:screenIn .35s cubic-bezier(0.16, 1, 0.3, 1) both; }

    @keyframes popIn{ 
      0%{transform:scale(1);} 
      40%{transform:scale(1.08) rotate(1deg);} 
      100%{transform:scale(1) rotate(0);} 
    }
    .pop-anim{ animation:popIn .3s cubic-bezier(0.34, 1.56, 0.64, 1); }

    @keyframes toastIn{ 
      from{opacity:0; transform:translate(-50%, 20px) scale(0.9);} 
      to{opacity:1; transform:translate(-50%, 0) scale(1);} 
    }
    .toast-anim{ animation:toastIn .4s cubic-bezier(0.16, 1, 0.3, 1) both; }

    .venue-card-hover{ 
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); 
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
    }
    .venue-card-hover:hover{ 
      transform:translateY(-6px); 
      box-shadow: 0 20px 25px -5px rgba(139, 92, 246, 0.15);
      border-color: var(--amber);
    }
    
    .lift-hover{ transition: all 0.2s ease; }
    .lift-hover:hover:not(:disabled){ transform:translateY(-2px); }

    dialog.mp-dialog{ 
      border:none; border-radius:24px; padding:0; width:400px; max-width:92vw; 
      box-shadow:0 25px 50px -12px rgba(46, 16, 101, 0.45); 
      background: rgba(255,255,255,0.98); backdrop-filter: blur(12px);
    }
    dialog.mp-dialog::backdrop{ background:rgba(15, 2, 38, 0.65); backdrop-filter: blur(4px); }

    .glass-nav {
      background: rgba(250, 245, 255, 0.88);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }
  `});export{n as GlobalStyle};