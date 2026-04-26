import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Zap, Camera, ShieldCheck, ChevronLeft, Sparkles, Droplets, Info, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeImage } from '../services/gemini';
import CameraCapture from '../components/CameraCapture';

const HAIR_STYLE_DB = {
  "Buzz Cut": "https://upload.wikimedia.org/wikipedia/commons/2/2b/Buzz_cut.jpg",
  "Crew Cut": "https://upload.wikimedia.org/wikipedia/commons/9/90/Crew_cut.jpg",
  "Pompadour": "https://upload.wikimedia.org/wikipedia/commons/0/05/Elvis_Presley_promotional_photo_1956.jpg",
  "Undercut": "https://upload.wikimedia.org/wikipedia/commons/d/db/Undercut_haircut.jpg",
  "Mohawk": "https://upload.wikimedia.org/wikipedia/commons/7/76/Mohawk_Hairstyle.jpg",
  "Mullet": "https://upload.wikimedia.org/wikipedia/commons/2/23/Mullet_hairstyle.jpg",
  "Afro": "https://upload.wikimedia.org/wikipedia/commons/2/20/Afro_guy.jpg",
  "Dreadlocks": "https://upload.wikimedia.org/wikipedia/commons/d/da/Dreadlocks_man.jpg",
  "Bob Cut": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Bob_cut_with_bangs.jpg",
  "Pixie Cut": "https://upload.wikimedia.org/wikipedia/commons/0/09/Pixie_cut.jpg",
  "Slicked Back": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Slicked_back_hair.jpg",
  "Curtains": "https://upload.wikimedia.org/wikipedia/commons/5/53/Curtain_haircut.jpg",
  "Side Part": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Side_part_haircut.jpg",
  "Quiff": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Quiff_hairstyle.jpg",
  "Man Bun": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Man_bun_profile.jpg",
  "Bowl Cut": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Bowl_cut.jpg",
  "Caesar Cut": "https://upload.wikimedia.org/wikipedia/commons/2/23/Caesar_cut_model.jpg",
  "Ivy League": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Ivy_League_haircut.jpg",
  "Flat Top": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Flat_top_haircut.jpg",
  "Top Knot": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Top_knot_hairstyle.jpg",
  "Fade": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Fade_haircut_example.jpg",
  "Faux Hawk": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Faux_hawk.jpg",
  "High and Tight": "https://upload.wikimedia.org/wikipedia/commons/0/0e/High_and_tight_haircut.jpg",
  "Butch Cut": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Butch_cut.jpg",
  "Induction Cut": "https://upload.wikimedia.org/wikipedia/commons/8/87/Induction_cut.jpg",
  "Burr Cut": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Burr_cut.jpg",
  "Cornrows": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Cornrows_style.jpg",
  "French Braid": "https://upload.wikimedia.org/wikipedia/commons/a/af/French_braid.jpg",
  "Ponytail": "https://upload.wikimedia.org/wikipedia/commons/9/91/Ponytail_style.jpg",
  "Pigtails": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Pigtails_hair.jpg",
  "Beehive": "https://upload.wikimedia.org/wikipedia/commons/d/da/Beehive_hairstyle.jpg",
  "Bouffant": "https://upload.wikimedia.org/wikipedia/commons/3/30/Bouffant_hair.jpg",
  "Hime Cut": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Hime_cut_model.jpg",
  "Shag": "https://upload.wikimedia.org/wikipedia/commons/b/be/Shag_hairstyle.jpg",
  "Mullet (Modern)": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Modern_mullet.jpg",
  "Ducktail": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Ducktail_style.jpg",
  "Emo Hair": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Emo_hairstyle.jpg",
  "Spiky Hair": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Spiky_hair.jpg",
  "Curly Hair": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Curly_hair_man.jpg",
  "Wavy Hair": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Wavy_hair_style.jpg",
  "Shoulder Length": "https://upload.wikimedia.org/wikipedia/commons/8/82/Shoulder_length_hair.jpg",
  "Bangs": "https://upload.wikimedia.org/wikipedia/commons/f/f2/Bangs_hairstyle.jpg",
  "Tonsure": "https://upload.wikimedia.org/wikipedia/commons/1/16/Tonsure_monk.jpg",
  "Chonmage": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Chonmage_style.jpg",
  "Queue": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Queue_hair.jpg",
  "Pompadour (Modern)": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Modern_pompadour.jpg",
  "Side Swept": "https://upload.wikimedia.org/wikipedia/commons/9/9c/Side_swept_bangs.jpg",
  "Layered Bob": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Layered_bob.jpg",
  "Long Layers": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Long_layered_hair.jpg",
  "Comb Over": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Comb_over.jpg"
};

const Hair = ({ archetype }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [library, setLibrary] = useState([]);

  // Fetch from Wikimedia API Category:Hairstyles
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=categorymembers&gcmtitle=Category:Hairstyles&iiprop=url&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        const pages = data.query.pages;
        const images = Object.values(pages).map(p => p.imageinfo[0].url).filter(url => url.endsWith('.jpg') || url.endsWith('.png'));
        setLibrary(images.slice(0, 12));
      } catch (err) {
        console.error("Wiki API error:", err);
      }
    };
    fetchLibrary();
  }, []);

  const handleHairScan = async (image) => {
    if (!image) return;
    setLoading(true);
    
    const prompt = `
      Analyze this hair and hairline photo. 
      Target Archetype: ${archetype.model}.
      
      JSON FORMAT ONLY:
      {
        "hairline": { "score": 0, "status": "string", "recession_risk": "low|medium|high" },
        "suggested_styles": ["Buzz Cut", "Slicked Back", "Crew Cut"], 
        "routine": { "shampoo": "string", "actives": "string", "massage": "string" }
      }
      Use these style names if they match: ${Object.keys(HAIR_STYLE_DB).join(', ')}.
      Language: Turkish.
    `;

    try {
      const responseText = await analyzeImage(image, prompt);
      const jsonStr = responseText.substring(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1);
      setAnalysis(JSON.parse(jsonStr));
      setShowScanner(false);
    } catch (err) {
      alert("Analiz başarısız. Lütfen net bir fotoğraf çekin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '120px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> DASHBOARD
        </Link>
        <h1 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Saç & Saç Çizgisi</h1>
        <div className="badge" style={{ color: 'var(--accent-gold)' }}>FOLLICLE_ENGINE: V5</div>
      </header>

      {/* ACTION SECTION */}
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem', border: '1px solid var(--accent-cyan)' }}>
        <Scissors size={40} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>FOTORAFİK ANALİZ</h3>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Saç çizgisini ve gürlüğünü analiz etmek için fotoğraf çekin.
        </p>
        <button onClick={() => setShowScanner(true)} className="btn-primary" style={{ width: '100%', height: '55px' }}>
          TARAMAYI BAŞLAT
        </button>
      </div>

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* HAIRLINE SCORE */}
          <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(0, 242, 255, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
               <h4 style={{ fontSize: '0.8rem', fontWeight: 800 }}>DURUM ÖZETİ</h4>
               <span className="badge" style={{ color: analysis.hairline.recession_risk === 'low' ? 'var(--accent-green)' : 'var(--accent-magenta)' }}>
                 RİSK: {analysis.hairline.recession_risk.toUpperCase()}
               </span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{analysis.hairline.status}</div>
          </div>

          {/* STYLE SUGGESTIONS WITH IMAGES */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.2rem', color: 'var(--accent-gold)' }}>SİZE ÖZEL STİLLER</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               {analysis.suggested_styles.map((style, i) => (
                 <div key={i} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                      <img 
                        src={`https://images.weserv.nl/?url=${encodeURIComponent(HAIR_STYLE_DB[style] || library[i % library.length])}&w=300&h=300&fit=cover`} 
                        alt={style} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/300x300/111/00f2ff?text=${style}`;
                        }}
                      />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white' }}>{style.toUpperCase()}</div>
                        <a 
                          href={`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(style + " men hairstyle aesthetic")}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: 'white', opacity: 0.7 }}
                        >
                          <Search size={14} />
                        </a>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* ROUTINE */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.2rem', color: 'var(--accent-magenta)' }}>BAKIM PROTOKOLÜ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ fontSize: '0.85rem' }}>
                 <div style={{ color: 'var(--accent-cyan)', fontSize: '0.65rem', fontWeight: 800, marginBottom: '0.2rem' }}>TEMİZLİK</div>
                 {analysis.routine.shampoo}
               </div>
               <div style={{ fontSize: '0.85rem' }}>
                 <div style={{ color: 'var(--accent-cyan)', fontSize: '0.65rem', fontWeight: 800, marginBottom: '0.2rem' }}>AKTİF BESLEME</div>
                 {analysis.routine.actives}
               </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* EXPLORE WIKI LIBRARY */}
      <div style={{ marginTop: '3rem' }}>
        <h4 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={14} /> WIKIMEDIA SAÇ KÜTÜPHANESİ
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
           {library.map((img, i) => (
             <div key={i} style={{ height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
               <img 
                 src={`https://images.weserv.nl/?url=${encodeURIComponent(img)}&w=150&h=150&fit=cover`} 
                 alt="Hair Style" 
                 style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
               />
             </div>
           ))}
        </div>
      </div>

      {/* SCANNER MODAL */}
      <AnimatePresence>
        {showScanner && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 4000, padding: '2rem', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 800 }}>SAÇ TARAMASI</h3>
              <button onClick={() => setShowScanner(false)} style={{ background: 'none', border: 'none', color: 'white' }}>İPTAL</button>
            </div>
            <CameraCapture onImageCapture={handleHairScan} label="Saç Analizi" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hair;
