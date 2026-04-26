import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCw, CheckCircle2, Scan, ChevronLeft, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeImage } from '../services/gemini';
import CameraCapture from '../components/CameraCapture';

const Posture = ({ archetype }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzePosture = async () => {
    if (!image) return;
    setLoading(true);
    
    const prompt = `
      Analyze this lateral (side) profile photo for posture and biomechanics. 
      TARGET PHYSIQUE: ${archetype.name} (Inspired by ${archetype.model}).
      Goal: Reach the structural alignment of the archetype.
      
      Provide in JSON format:
      1. alignment: { ear_shoulder_hip: "string", score: number 1-100 }
      2. roadmap: [{ step: "string", muscles_to_strengthen: ["string"], duration: "string" }]
      3. structural_match: number 1-100
      4. advice: "string"
      Language: Turkish.
    `;

    try {
      const responseText = await analyzeImage(image, prompt);
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setResult(JSON.parse(jsonMatch[0]));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '100px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--accent-green)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> DASHBOARD
        </Link>
        <h1 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Biyomekanik</h1>
        <div className="badge" style={{ color: 'var(--accent-green)' }}>HEDEF: {archetype.name}</div>
      </header>
      
      {!result ? (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1rem', marginBottom: '0.5rem' }}>
              <Scan size={20} color="var(--accent-green)" /> LATERAL ANALİZ
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Yan profilden bir fotoğraf çekin.</p>
          </div>
          
          <CameraCapture onImageCapture={setImage} label="Postür Taraması" />

          <button 
            disabled={!image || loading}
            onClick={analyzePosture}
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem', height: '55px', background: 'var(--accent-green)', color: '#000' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RefreshCw className="floating" size={18} /> TARANIYOR...
              </span>
            ) : 'POSTÜR YOL HARİTASINI OLUŞTUR'}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ 
            padding: '2rem', 
            background: 'rgba(0, 255, 170, 0.08)', 
            borderRadius: '24px',
            border: '1px solid rgba(0, 255, 170, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.7, letterSpacing: '2px', marginBottom: '0.5rem' }}>STRUCTURAL MATCH</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent-green)' }}>{result.structural_match}%</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--accent-green)', marginBottom: '1rem' }}>FİZİKSEL DÜZELTME PROGRAMI</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {result.roadmap.map((step, i) => (
                <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>{step.step}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {step.muscles_to_strengthen.map(m => (
                      <span key={m} style={{ fontSize: '0.6rem', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', color: 'var(--accent-cyan)' }}>{m}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>UZMAN TAVSİYESİ</div>
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

export default Posture;

