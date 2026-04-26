import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, RefreshCcw, Search, ShieldAlert, ChevronLeft, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeImage } from '../services/gemini';
import CameraCapture from '../components/CameraCapture';

const Dermatology = ({ archetype }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeSkin = async () => {
    if (!image) return;
    setLoading(true);
    
    const prompt = `
      Analyze this face for skin health and dermatology. 
      TARGET: Clear, radiant skin like ${archetype.model}.
      
      Provide in JSON format:
      1. skin_metrics: { clarity: number, hydration: number, texture_score: number, sensitivity: number, total_score: number }
      2. roadmap: [{ step: "string", products: ["string"], reason: "string" }]
      3. advice: "string"
      Language: Turkish.
    `;

    try {
      const responseText = await analyzeImage(image, prompt);
      const jsonStr = responseText.substring(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1);
      const json = JSON.parse(jsonStr);
      setResult(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '100px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--accent-magenta)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> DASHBOARD
        </Link>
        <h1 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Cilt Analizi</h1>
        <div className="badge" style={{ color: 'var(--accent-magenta)' }}>HEDEF: {archetype.name}</div>
      </header>
      
      {!result ? (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1rem', marginBottom: '0.5rem' }}>
              <Droplets size={20} color="var(--accent-magenta)" /> DERMAL TARAMA
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Gözenek ve doku analizi için yakın çekim yapın.</p>
          </div>
          
          <CameraCapture onImageCapture={setImage} label="Deri Taraması" />

          <button 
            disabled={!image || loading}
            onClick={analyzeSkin}
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem', height: '55px', background: 'var(--accent-magenta)', color: '#fff' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RefreshCcw className="floating" size={18} /> ANALİZ EDİLİYOR...
              </span>
            ) : 'CİLT YOL HARİTASINI OLUŞTUR'}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--accent-magenta)', letterSpacing: '2px', marginBottom: '1.5rem' }}>DERMATOLOJİK SKORLAMA</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Netlik', val: result.skin_metrics?.clarity },
                { label: 'Nem Dengesi', val: result.skin_metrics?.hydration },
                { label: 'Doku Puanı', val: result.skin_metrics?.texture_score },
                { label: 'Hassasiyet', val: result.skin_metrics?.sensitivity },
                { label: 'Genel Puan', val: result.skin_metrics?.total_score }
              ].map((m, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--glass-border)', gridColumn: i === 4 ? '1 / span 2' : 'auto' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{m.label.toUpperCase()}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: i === 4 ? 'var(--accent-magenta)' : 'white' }}>{m.val || 0}%</div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${m.val || 0}%` }} 
                      style={{ height: '100%', background: i === 4 ? 'var(--accent-magenta)' : 'rgba(255,255,255,0.2)' }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--accent-magenta)', marginBottom: '1rem' }}>DERMATOLOJİK REÇETE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {result.roadmap.map((step, i) => (
                <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Zap size={14} color="var(--accent-magenta)" />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{step.step}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{step.reason}</div>
                  <div style={{ marginTop: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {step.products.map(p => (
                      <span key={p} style={{ fontSize: '0.65rem', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', color: '#fff', border: '1px solid var(--glass-border)' }}>{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>DOKU ANALİZİ</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{result.advice}</p>
          </div>

          <button onClick={() => setResult(null)} className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}>
            YENİ ANALİZ BAŞLAT
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Dermatology;
