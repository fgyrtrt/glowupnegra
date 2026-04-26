import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, AlertCircle, Scan, Target, ShieldCheck, ChevronLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeImage } from '../services/gemini';
import CameraCapture from '../components/CameraCapture';

const Craniofacial = ({ archetype }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const startAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    
    const userGender = archetype.gender === 'female' ? 'KADIN' : 'ERKEK';
    
    const prompt = `
      Sen profesyonel bir kraniyofasiyal antropolog ve estetik cerrah uzmanısın. 
      Bu ${userGender} yüzünü, genel estetik standartlar ve ${userGender === 'KADIN' ? 'feminen' : 'maskülen'} ideal oranlara göre analiz et.
      
      ROLE MODEL: ${archetype.model} (Bu model sadece stil ve gelişim yönü için bir referanstır, skor benzerliğe göre verilmemelidir).
      
      ANALİZ KRİTERLERİ (${userGender}):
      - Genel Yüz Çekiciliği (Attractiveness)
      - Fasiyal Simetri ve Altın Oran Uyumu
      ${archetype.gender === 'female' ? `
      - Canthal Tilt ve Ocular Appeal
      - Mandibular Yumuşaklık ve Elmacık Çıkıklığı
      ` : `
      - Jawline Keskinliği ve Maskülen Gelişim
      - Brow Ridge ve Göz Derinliği
      `}
      
      JSON FORMATINDA DÖNDÜR:
      {
        "facial_index": { "value": float, "type": "Mesofacial|Brachyfacial|Dolichofacial", "hair_recommendation": "string" },
        "detailed_scores": { "attractiveness": number, "harmony": number, "gender_dimorphism": number, "ocular_appeal": number, "potential": number },
        "roadmap": [{ "step": "string", "duration": "string", "technique": "string" }],
        "score_match": number (1-100 arası genel tip puanı / Attractive Score),
        "expert_insight": "string (Skorun nedenini açıklayan, tipe odaklı profesyonel yorum)"
      }
      
      ÖNEMLİ: Skoru belirlerken "Modele ne kadar benziyor?" diye değil, "Kullanıcının kendi yüzü genel standartlarda ne kadar iyi?" diye düşün.
      Dil: Türkçe.
    `;

    try {
      const responseText = await analyzeImage(image, prompt);
      const jsonStr = responseText.substring(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1);
      const json = JSON.parse(jsonStr);
      setResult(json);
    } catch (err) {
      setResult({ error: "Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '100px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ color: archetype.color, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> DASHBOARD
        </Link>
        <h1 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Yüz Haritalama</h1>
        <div className="badge" style={{ color: archetype.color }}>HEDEF: {archetype.name}</div>
      </header>
      
      {!result ? (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1rem', marginBottom: '0.5rem' }}>
              <Scan size={20} color={archetype.color} /> FASİYAL TARAMA
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Yüzünüzü {archetype.model} geometrisiyle karşılaştıracağız.</p>
          </div>
          
          <CameraCapture onImageCapture={setImage} label="Geometrik Tarama" />

          <button 
            disabled={!image || loading}
            onClick={startAnalysis}
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem', height: '55px', background: archetype.color, color: '#000' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RefreshCcw className="floating" size={18} /> HESAPLANIYOR...
              </span>
            ) : 'YOL HARİTASINI OLUŞTUR'}
          </button>
        </div>
      ) : result.error ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <AlertCircle size={40} color="#ff4444" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Analiz Başarısız</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{result.error}</p>
          <button onClick={() => setResult(null)} className="btn-primary" style={{ width: '100%' }}>TEKRAR DENE</button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.75rem', color: archetype.color, letterSpacing: '2px', marginBottom: '1.5rem' }}>BİYOMETRİK PUANLAMA</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Genel Çekicilik', val: result.detailed_scores?.attractiveness },
                { label: 'Uyum & Oran', val: result.detailed_scores?.harmony },
                { label: 'Cinsiyet Uyumu', val: result.detailed_scores?.gender_dimorphism },
                { label: 'Göz Estetiği', val: result.detailed_scores?.ocular_appeal },
                { label: 'Gelişim Potansiyeli', val: result.detailed_scores?.potential },
                { label: 'Genel Tip Puanı', val: result.score_match }
              ].map((m, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{m.label.toUpperCase()}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: i === 5 ? archetype.color : 'white' }}>{m.val || 0}%</div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${m.val || 0}%` }} 
                      style={{ height: '100%', background: i === 5 ? archetype.color : 'rgba(255,255,255,0.2)' }} 
                    />
                  </div>
                </div>
              ))}
            </div>
            {result.expert_insight && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: `1px solid ${archetype.color}44`, fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                " {result.expert_insight} "
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.8rem', color: archetype.color, marginBottom: '1rem' }}>GELİŞİM YOL HARİTASI</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {result.roadmap?.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: archetype.color, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, flexShrink: 0 }}>{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{step.step}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{step.technique} • {step.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--accent-magenta)', marginBottom: '0.5rem' }}>GÖZ & BAKIŞ ANALİZİ</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{result.ocular_esthetics?.comparison_to_target}</p>
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', fontSize: '0.8rem', borderLeft: `3px solid var(--accent-magenta)` }}>
              {result.ocular_esthetics?.optical_fix}
            </div>
          </div>

          <button onClick={() => setResult(null)} className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}>
            YENİ TARAMA BAŞLAT
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Craniofacial;

