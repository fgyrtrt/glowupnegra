import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, Palette, Ruler, Zap, Camera, Plus, Trash2, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeImage } from '../services/gemini';
import CameraCapture from '../components/CameraCapture';

const Wardrobe = ({ archetype }) => {
  const [closet, setCloset] = useState(() => {
    const saved = localStorage.getItem('glowup_closet');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [colorAnalysis, setColorAnalysis] = useState(() => {
    const saved = localStorage.getItem('glowup_colors');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('glowup_closet', JSON.stringify(closet));
  }, [closet]);

  useEffect(() => {
    localStorage.setItem('glowup_colors', JSON.stringify(colorAnalysis));
  }, [colorAnalysis]);

  const handleStyleScan = async (image) => {
    if (!image) return;
    setLoading(true);
    
    const prompt = `
      Sen bir lüks moda danışmanı ve stilistsin. 
      Bu kıyafeti veya kişiyi analiz et. 
      
      Eğer bir kıyafetse: Türünü, rengini ve hangi ortamlara uygun olduğunu belirle.
      Eğer bir kişiyse: Cilt alt tonunu ve mevsimsel renk paletini belirle.
      
      HEDEF STİL: ${archetype.model} (${archetype.name}).
      
      JSON FORMATINDA DÖNDÜR:
      {
        "type": "item|person",
        "item_details": { "name": "örn: Siyah Blazer", "style": "Casual|Formal", "color": "#hex" },
        "color_science": { "undertone": "Sıcak|Soğuk|Nötr", "season": "Yaz|Kış|Bahar|Güz", "palette": ["#hex"] },
        "match_score": 0,
        "styling_tip": "Bu parçayı ${archetype.model} gibi görünmek için nasıl kombinlemeli?"
      }
      Dil: Türkçe.
    `;

    try {
      const responseText = await analyzeImage(image, prompt);
      const jsonStr = responseText.substring(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1);
      const data = JSON.parse(jsonStr);
      
      if (data.type === 'item') {
        const newItem = {
          ...data.item_details,
          id: Date.now(),
          tip: data.styling_tip,
          score: data.match_score
        };
        setCloset([newItem, ...closet]);
      } else {
        setColorAnalysis(data.color_science);
      }
      
      setShowScanner(false);
    } catch (err) {
      alert("Stil analizi yapılamadı. Lütfen net bir fotoğraf yükleyin.");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (id) => setCloset(closet.filter(i => i.id !== id));

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '120px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> DASHBOARD
        </Link>
        <h1 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Dijital Gardırop</h1>
        <div className="badge" style={{ color: 'var(--accent-magenta)' }}>STİL DANIŞMANI: AKTİF</div>
      </header>

      {/* COLOR ANALYSIS SECTION */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(170, 0, 255, 0.05), rgba(0, 242, 255, 0.05))' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem', color: '#aa00ff', letterSpacing: '1px' }}>RENK BİLİMİ & ALT TON</h3>
        {colorAnalysis ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{colorAnalysis.season} / {colorAnalysis.undertone}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>Sizin için en ideal renk paleti tanımlandı.</div>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {colorAnalysis.palette.map((c, i) => (
                <div key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', background: c, border: '1px solid rgba(255,255,255,0.2)' }} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Alt tonunuzu belirlemek için bir portre fotoğrafınızı taratın.</div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setShowScanner(true)}
          className="glass-card" 
          style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', border: '1px solid var(--accent-cyan)' }}
        >
          <Camera size={24} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>KIYAFET EKLE</span>
        </button>
        <button 
          onClick={() => setShowScanner(true)}
          className="glass-card" 
          style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', border: '1px solid var(--accent-magenta)' }}
        >
          <Palette size={24} color="var(--accent-magenta)" />
          <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>RENK ANALİZİ</span>
        </button>
      </div>

      {/* CLOSET LIST */}
      <div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.2rem', opacity: 0.7 }}>DİJİTAL DOLABIM ({closet.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {closet.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', border: '1px dashed var(--glass-border)', borderRadius: '24px' }}>
              <Shirt size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Henüz kıyafet eklenmedi.</p>
            </div>
          ) : (
            closet.map(item => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card" 
                style={{ padding: '1.2rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: item.color, border: '1px solid rgba(255,255,255,0.1)' }} />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{item.name}</div>
                      <div className="badge" style={{ fontSize: '0.6rem', padding: '2px 8px', marginTop: '4px' }}>{item.style}</div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#ff4444', opacity: 0.5 }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '12px', fontSize: '0.75rem', lineHeight: '1.4', color: 'var(--text-secondary)' }}>
                  <Sparkles size={14} color="var(--accent-gold)" style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  {item.tip}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* SCANNER MODAL */}
      <AnimatePresence>
        {showScanner && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 3000, padding: '2rem', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 800 }}>STİL TARAMASI</h3>
              <button onClick={() => setShowScanner(false)} style={{ background: 'none', border: 'none', color: 'white' }}><Trash2 size={24} /></button>
            </div>
            <CameraCapture onImageCapture={handleStyleScan} label="Stil Analizi" />
            {loading && (
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <Zap size={32} className="floating" color="var(--accent-cyan)" />
                <div style={{ fontWeight: 800, marginTop: '1rem', color: 'var(--accent-cyan)' }}>STİL DANIŞMANI ANALİZ EDİYOR...</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wardrobe;
