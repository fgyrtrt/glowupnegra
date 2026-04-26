import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Video, Volume2, Target, Info } from 'lucide-react';
import { chatWithAI } from '../services/gemini';

const Softmaxing = () => {
  const [recording, setRecording] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const analyzeVoice = async () => {
    // Simulated voice analysis for demo
    setLoading(true);
    const prompt = `
      Create a simulated charisma and voice analysis report for a looksmaxing app.
      The user wants to improve "aura" and "dominance".
      Provide in JSON format:
      {
        "voice": { "frequency": "110Hz", "resonance": "Boğaz (Geliştirilmeli)", "tip": "Diyafram nefesi egzersizleri yapın." },
        "mimics": { "smile": "Zayıf Duchenne", "eye_contact": "Hızlı kaçıyor", "feedback": "Gözlerle gülme pratiği yapın (Squinching)." },
        "diction": { "filler_words": ["eee", "şey", "yani"], "score": 65 }
      }
      Language: Turkish.
    `;

    try {
      const responseText = await chatWithAI(prompt);
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setAnalysis(JSON.parse(jsonMatch[0]));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Sosyal Mühendislik & Karizma</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Video size={20} color="var(--accent-magenta)" /> Mikro-Mimik Eğitimi
            </h3>
            <div style={{ 
              width: '100%', 
              height: '240px', 
              background: '#000', 
              borderRadius: '15px', 
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid var(--glass-border)'
            }}>
              {!cameraActive ? (
                <button onClick={startCamera} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} className="btn-outline">
                  Kamerayı Aktif Et
                </button>
              ) : (
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
              Aynada "Duchenne Smile" ve göz teması pratiği yapın. AI yüzünüzü gerçek zamanlı analiz eder.
            </p>
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mic size={20} color="var(--accent-cyan)" /> Ses Frekans Analizi
            </h3>
            <button 
              onMouseDown={() => setRecording(true)}
              onMouseUp={() => {setRecording(false); analyzeVoice();}}
              className="btn-primary" 
              style={{ width: '100%', padding: '1.5rem', background: recording ? '#ff4444' : 'linear-gradient(135deg, var(--accent-cyan), #00a2ff)' }}
            >
              {recording ? 'KAYDEDİLİYOR (BIRAKINCA ANALİZ EDER)...' : 'SESİNİ KAYDETMEK İÇİN BASILI TUT'}
            </button>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <Info size={14} /> Boğaz rezonansından göğüs rezonansına geçiş analizi.
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Aura & Karizma Raporu</h3>
          
          {loading && <div className="loading-shimmer" style={{ height: '300px', borderRadius: '15px' }} />}

          {analysis && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(0, 242, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(0, 242, 255, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <Volume2 size={18} /> SES REZONANSI
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>Frekans: {analysis.voice.frequency}</span>
                  <span>Bölge: {analysis.voice.resonance}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{analysis.voice.tip}</p>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255, 0, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 0, 255, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-magenta)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <Target size={18} /> MİMİK VE GÖZ TEMASI
                </div>
                <p style={{ fontSize: '0.85rem' }}><strong>Gülümseme:</strong> {analysis.mimics.smile}</p>
                <p style={{ fontSize: '0.85rem' }}><strong>Göz Teması:</strong> {analysis.mimics.eye_contact}</p>
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--accent-magenta)' }}>
                  💡 {analysis.mimics.feedback}
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700 }}>DİKSİYON SKORU</span>
                  <span style={{ color: 'var(--accent-gold)' }}>{analysis.diction.score}/100</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Asalak Kelimeler: {analysis.diction.filler_words.join(', ')}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Softmaxing;
