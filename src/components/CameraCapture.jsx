import React, { useState } from 'react';
import { Camera, Upload, RotateCcw, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * NATIVE CAPTURE SYSTEM
 * Bypasses browser stream issues by using the device's native camera app.
 * This is the most reliable method for both mobile and desktop.
 */
const CameraCapture = ({ onImageCapture, label = "Görüntü Analizi" }) => {
  const [mode, setMode] = useState('select'); // 'select', 'preview'
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target.result);
      setMode('preview');
      onImageCapture(file);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setPreview(null);
    setMode('select');
    onImageCapture(null);
  };

  return (
    <div className="camera-capture-container" style={{ width: '100%' }}>
      <AnimatePresence mode="wait">
        {mode === 'select' && (
          <motion.div 
            key="select" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', height: '220px' }}
          >
            {/* NATIVE CAMERA BUTTON */}
            <label className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '1rem', background: 'rgba(0, 242, 255, 0.05)', border: '1px solid var(--accent-cyan)' }}>
              <div style={{ position: 'relative' }}>
                <Camera size={38} color="var(--accent-cyan)" />
                <div style={{ position: 'absolute', top: -10, right: -10, background: 'var(--accent-cyan)', borderRadius: '50%', padding: '2px' }}>
                  <ShieldCheck size={14} color="black" />
                </div>
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--accent-cyan)', letterSpacing: '1px' }}>FOTOĞRAF ÇEK</span>
              <input 
                type="file" 
                accept="image/*" 
                capture="user" 
                hidden 
                onChange={handleCapture} 
              />
            </label>

            {/* GALLERY UPLOAD BUTTON */}
            <label className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '1rem', background: 'rgba(255, 0, 255, 0.05)', border: '1px solid var(--accent-magenta)' }}>
              <Upload size={38} color="var(--accent-magenta)" />
              <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--accent-magenta)', letterSpacing: '1px' }}>GALERİDEN SEÇ</span>
              <input 
                type="file" 
                accept="image/*" 
                hidden 
                onChange={handleCapture} 
              />
            </label>
            
            <div style={{ gridColumn: '1 / span 2', textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              <Zap size={10} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              CİHAZINIZIN YEREL KAMERA SİSTEMİ KULLANILACAKTIR
            </div>
          </motion.div>
        )}

        {mode === 'preview' && (
          <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'relative' }}>
            <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: '24px', display: 'block', border: '1px solid var(--accent-cyan)', boxShadow: '0 0 30px rgba(0,242,255,0.2)' }} />
            
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <button onClick={reset} style={{ background: 'rgba(0,0,0,0.7)', padding: '12px', borderRadius: '50%', color: 'white', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                <RotateCcw size={20} />
              </button>
            </div>

            <div style={{ 
              position: 'absolute', 
              bottom: '1rem', 
              left: '1rem', 
              right: '1rem', 
              background: 'rgba(0, 242, 255, 0.2)', 
              padding: '12px', 
              borderRadius: '16px', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              color: 'var(--accent-cyan)', 
              backdropFilter: 'blur(15px)', 
              border: '1px solid var(--accent-cyan)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              justifyContent: 'center' 
            }}>
              <CheckCircle2 size={18} /> GÖRÜNTÜ ANALİZE HAZIR
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>İŞLENİYOR...</div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
