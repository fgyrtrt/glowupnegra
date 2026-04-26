import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Zap, Droplets, Flame, Camera, Plus, Trash2, ChevronLeft, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeImage } from '../services/gemini';
import CameraCapture from '../components/CameraCapture';

const Nutrition = ({ archetype }) => {
  const [mealLogs, setMealLogs] = useState(() => {
    const saved = localStorage.getItem('glowup_meals');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    localStorage.setItem('glowup_meals', JSON.stringify(mealLogs));
  }, [mealLogs]);

  const handleScan = async (image) => {
    if (!image) return;
    setLoading(true);
    
    const prompt = `
      Sen profesyonel bir beslenme uzmanı ve görüntü analiz motorusun. 
      Bu yemek fotoğrafını en ince ayrıntısına kadar analiz et. 
      
      ANALİZ KRİTERLERİ:
      1. Porsiyon büyüklüğünü tahmin et (gram cinsinden).
      2. İçerikteki gizli yağları ve sosları hesaba kat.
      3. Pişirme yöntemini (kızartma, haşlama vb.) belirle.
      4. Mikro besinleri (tuz oranı, şeker riski) göz önünde bulundur.
      
      HEDEF ARCHETYPE: ${archetype.name} (Bu hedefe göre protein gereksinimini yorumla).
      
      AŞAĞIDAKİ FORMATTA SADECE JSON DÖNDÜR:
      {
        "name": "Yemeğin tam adı",
        "calories": 0, 
        "protein": 0, 
        "carbs": 0, 
        "fat": 0, 
        "health_score": 0,
        "portion_weight": "string (örn: 350g)",
        "expert_note": "Beslenme uzmanı yorumu (max 15 kelime)"
      }
      Dil: Türkçe.
    `;

    try {
      const responseText = await analyzeImage(image, prompt);
      const jsonStr = responseText.substring(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1);
      const data = JSON.parse(jsonStr);
      
      const newMeal = {
        ...data,
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString()
      };

      setMealLogs([newMeal, ...mealLogs]);
      setShowScanner(false);
    } catch (err) {
      alert("Analiz daha hassas yapıldığı için bazen zaman alabilir. Lütfen net bir fotoğraf ile tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const removeMeal = (id) => {
    setMealLogs(mealLogs.filter(m => m.id !== id));
  };

  const totals = mealLogs.reduce((acc, curr) => ({
    cal: acc.cal + curr.calories,
    pro: acc.pro + curr.protein,
    fat: acc.fat + curr.fat,
    carb: acc.carb + curr.carbs
  }), { cal: 0, pro: 0, fat: 0, carb: 0 });

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '120px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--accent-green)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> DASHBOARD
        </Link>
        <h1 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Metabolik Takip</h1>
        <div className="badge" style={{ color: 'var(--accent-green)' }}>GÜNLÜK HEDEF: {archetype.name.toUpperCase()}</div>
      </header>

      {/* STATS OVERVIEW */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        <div style={{ background: 'rgba(0, 255, 170, 0.05)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(0, 255, 170, 0.1)' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>KALORİ</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{totals.cal} <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>kcal</span></div>
        </div>
        <div style={{ background: 'rgba(0, 242, 255, 0.05)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(0, 242, 255, 0.1)' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>PROTEİN</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{totals.pro} <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>gr</span></div>
        </div>
        <div style={{ background: 'rgba(255, 0, 255, 0.05)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255, 0, 255, 0.1)' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>KARBONHİDRAT</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{totals.carb} <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>gr</span></div>
        </div>
        <div style={{ background: 'rgba(255, 196, 0, 0.05)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255, 196, 0, 0.1)' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>YAĞ</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{totals.fat} <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>gr</span></div>
        </div>
      </div>

      {/* SCAN BUTTON */}
      <button 
        onClick={() => setShowScanner(true)}
        className="btn-primary" 
        style={{ width: '100%', marginBottom: '2rem', height: '65px', background: 'var(--accent-green)', color: 'black' }}
      >
        <Camera size={20} /> ÖĞÜNÜ ANALİZ ET & KAYDET
      </button>

      {/* SCANNER MODAL */}
      <AnimatePresence>
        {showScanner && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, padding: '2rem', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 800 }}>YEMEK TARAMASI</h3>
              <button onClick={() => setShowScanner(false)} style={{ background: 'none', border: 'none', color: 'white' }}><Trash2 size={24} /></button>
            </div>
            
            <CameraCapture onImageCapture={handleScan} label="Yemek Analizi" />
            
            {loading && (
              <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--accent-green)' }}>
                <Zap size={32} className="floating" style={{ marginBottom: '1rem' }} />
                <div style={{ fontWeight: 800, letterSpacing: '2px' }}>YAPAY ZEKA ANALİZ EDİYOR...</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MEAL LIST */}
      <div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', opacity: 0.7 }}>BUGÜNKÜ ÖĞÜNLER</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mealLogs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--glass-border)', borderRadius: '24px' }}>
              <Utensils size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.8rem' }}>Henüz öğün kaydedilmedi.</p>
            </div>
          ) : (
            mealLogs.map(meal => (
              <motion.div 
                key={meal.id} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="glass-card" 
                style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.2rem' }}>{meal.name} <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>({meal.portion_weight})</span></div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    {meal.time} • {meal.calories} kcal • {meal.protein}g P • {meal.carb}g C • {meal.fat}g F
                  </div>
                  {meal.expert_note && (
                    <div style={{ fontSize: '0.6rem', color: 'var(--accent-green)', fontStyle: 'italic', background: 'rgba(0,255,170,0.05)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                      " {meal.expert_note} "
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ fontSize: '0.8rem', fontWeight: 900, color: meal.health_score > 70 ? 'var(--accent-green)' : 'var(--accent-magenta)' }}>
                     %{meal.health_score}
                   </div>
                   <button onClick={() => removeMeal(meal.id)} style={{ background: 'none', border: 'none', color: '#ff4444', opacity: 0.5 }}>
                     <Trash2 size={16} />
                   </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
