import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Droplets, Activity, Utensils, Mic, Shirt, Scissors,
  Home, Layout as LayoutIcon, User, Star, Target, Zap, ChevronRight, CheckCircle2
} from 'lucide-react';

// Modules
import Craniofacial from './modules/Craniofacial';
import Dermatology from './modules/Dermatology';
import Posture from './modules/Posture';
import Nutrition from './modules/Nutrition';
import Softmaxing from './modules/Softmaxing';
import Wardrobe from './modules/Wardrobe';
import Profile from './modules/Profile';
import Hair from './modules/Hair';
import CameraCapture from './components/CameraCapture';
import { analyzeImage } from './services/gemini';

const ARCHETYPES = [
  // MALE
  { id: 'actor', gender: 'male', name: 'Elite Actor', model: 'Henry Cavill', trait: 'Symmetry & Jawline', color: '#00f2ff', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Henry_Cavill_%2848417938121%29_%28cropped%29.jpg' },
  { id: 'model', gender: 'male', name: 'Runway Model', model: 'Jordan Barrett', trait: 'Hollow Cheeks & Tilt', color: '#ff00ff', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Jordan_Barrett.jpg' },
  { id: 'athlete', gender: 'male', name: 'Athletic Peak', model: 'C. Ronaldo', trait: 'Definition & Lean', color: '#00ffaa', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg' },
  { id: 'icon', gender: 'male', name: 'Modern Icon', model: 'Jacob Elordi', trait: 'Harmony & Appeal', color: '#ffc400', image: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Jacob_Elordi_at_the_2023_Venice_Film_Festival_%281%29.jpg' },
  // FEMALE
  { id: 'vogue', gender: 'female', name: 'Vogue Face', model: 'Bella Hadid', trait: 'Cat Eye & Definition', color: '#ff00ff', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Bella_Hadid_at_the_2018_Cannes_Film_Festival_02.jpg' },
  { id: 'angel', gender: 'female', name: 'Victoria Angel', model: 'Adriana Lima', trait: 'Symmetry & Contrast', color: '#00f2ff', image: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Adriana_Lima_at_the_2018_Cannes_Film_Festival_03.jpg' },
  { id: 'star', gender: 'female', name: 'Hollywood Star', model: 'Margot Robbie', trait: 'Harmony & Radiance', color: '#ffc400', image: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Margot_Robbie_at_the_2018_Cannes_Film_Festival.jpg' },
  { id: 'itgirl', gender: 'female', name: 'It Girl', model: 'Kendall Jenner', trait: 'Elegance & Ratio', color: '#00ffaa', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Kendall_Jenner_at_the_2018_Cannes_Film_Festival_04.jpg' },
];

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0: Gender, 1: Welcome, 2: Role Model, 3: Scan, 4: Goals
  const [data, setData] = useState({
    gender: '',
    archetype: null,
    baseScan: null,
    scanResult: null,
    goals: { age: '', skinType: '', priority: '' }
  });
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep(step + 1);

  const filteredArchetypes = ARCHETYPES.filter(a => a.gender === data.gender);

  const startInitialScan = async (image) => {
    if (!image) return;
    setLoading(true);
    setData({ ...data, baseScan: image });
    
    const prompt = "Analyze this initial photo for a GlowUp profile. Provide a 1-sentence summary of the user's starting point (face shape, skin clarity, and vibe). Language: Turkish. Provide JSON: { 'summary': 'string', 'initial_score': number 1-100 }";
    
    try {
      const response = await analyzeImage(image, prompt);
      // More robust JSON extraction
      const jsonStr = response.substring(response.indexOf('{'), response.lastIndexOf('}') + 1);
      const json = JSON.parse(jsonStr);
      setData(prev => ({ ...prev, scanResult: json }));
      setStep(4);
    } catch (e) {
      console.error("Analysis Failed:", e);
      alert("Yapay zeka analizi sırasında bir sorun oluştu. Lütfen tekrar deneyin veya internet bağlantınızı kontrol edin.");
      // Don't auto-proceed on error, let user try again
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--primary-bg)' }}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '2.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Cinsiyetinizi Seçin</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Size özel analizler ve modeller için cinsiyetinizi belirleyin.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <button 
                onClick={() => { setData({...data, gender: 'male'}); setStep(1); }}
                className="glass-card" 
                style={{ padding: '2.5rem 1rem', border: '1px solid var(--accent-cyan)', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♂️</div>
                <div style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>ERKEK</div>
              </button>
              <button 
                onClick={() => { setData({...data, gender: 'female'}); setStep(1); }}
                className="glass-card" 
                style={{ padding: '2.5rem 1rem', border: '1px solid var(--accent-magenta)', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♀️</div>
                <div style={{ fontWeight: 800, color: 'var(--accent-magenta)' }}>KADIN</div>
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '2.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="badge" style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>SYSTEM: ONBOARDING_V1.0</div>
            <h1 className="gradient-text" style={{ fontSize: '3.5rem', lineHeight: '1', marginBottom: '1.5rem' }}>BÜYÜK DÖNÜŞÜM BAŞLIYOR</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>
              Yapay zeka motorumuz, biyometrik verilerini analiz ederek seni ideal versiyonuna ulaştıracak bir yol haritası hazırlayacak.
            </p>
            <button onClick={handleNext} className="btn-primary" style={{ height: '65px', fontSize: '1.1rem' }}>
              ANALİZE BAŞLA <ChevronRight size={24} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ padding: '2rem' }}>
            <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '2rem' }}>HEDEF MODELİNİ SEÇ</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {filteredArchetypes.map(a => (
                <div 
                  key={a.id} 
                  onClick={() => { setData({ ...data, archetype: a }); setStep(3); }}
                  className="glass-card" 
                  style={{ 
                    padding: '0', 
                    cursor: 'pointer', 
                    border: data.archetype?.id === a.id ? `2px solid ${a.color}` : '1px solid var(--glass-border)',
                    height: '240px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#000'
                  }}
                >
                  <img 
                    src={a.image} 
                    alt={a.model} 
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      // Fallback to a secondary source if primary fails
                      if (!e.target.dataset.triedFallback) {
                        e.target.dataset.triedFallback = 'true';
                        e.target.src = `https://images.weserv.nl/?url=${encodeURIComponent(a.image)}`;
                      } else {
                        e.target.src = `https://via.placeholder.com/400x600/111/fff?text=${a.model}`;
                      }
                    }}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      opacity: 0.9,
                      transition: 'opacity 0.3s'
                    }} 
                  />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: 0, left: 0, right: 0, 
                    padding: '1.5rem 1rem',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                    zIndex: 2 
                  }}>
                    <div style={{ fontWeight: 900, fontSize: '0.85rem', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{a.name.toUpperCase()}</div>
                    <div style={{ fontSize: '0.7rem', color: a.color, fontWeight: 700 }}>{a.model}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem' }}>
            <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>BİYOMETRİK TARAMA</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Yüz hatlarını ve cilt dokusunu analiz etmek için bir selfie çek.
            </p>
            {loading ? (
              <div style={{ height: '450px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                <div className="floating" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid var(--accent-cyan)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                <div style={{ fontWeight: 800, letterSpacing: '2px', color: 'var(--accent-cyan)' }}>GÖRÜNTÜ İŞLENİYOR...</div>
              </div>
            ) : (
              <CameraCapture onImageCapture={startInitialScan} label="İlk Tarama" />
            )}
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem' }}>
            <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '2rem' }}>KİŞİSEL VERİLER</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-card">
                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>YAŞINIZ</label>
                <input 
                  type="number" 
                  className="btn-outline" 
                  style={{ width: '100%', background: 'transparent', color: 'white', padding: '12px' }}
                  onChange={(e) => setData({ ...data, goals: { ...data.goals, age: e.target.value } })}
                />
              </div>
              <div className="glass-card">
                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>CİLT TİPİ</label>
                <select 
                  className="btn-outline" 
                  style={{ width: '100%', background: 'transparent', color: 'white', padding: '12px' }}
                  onChange={(e) => setData({ ...data, goals: { ...data.goals, skinType: e.target.value } })}
                >
                  <option value="">Seçiniz</option>
                  <option value="Yağlı">Yağlı</option>
                  <option value="Kuru">Kuru</option>
                  <option value="Karma">Karma</option>
                </select>
              </div>
              <button 
                onClick={() => onComplete(data)} 
                className="btn-primary" 
                style={{ marginTop: '2rem', height: '60px' }}
                disabled={!data.goals.age || !data.goals.skinType}
              >
                PROFILI OLUŞTUR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Dashboard = ({ userData, onReset }) => {
  const modules = [
    { id: 'cranio', title: 'Yüz Haritası', icon: Camera, color: '#00f2ff', path: '/cranio', metric: 'GEOMETRIC' },
    { id: 'derma', title: 'Cilt Analizi', icon: Droplets, color: '#ff00ff', path: '/derma', metric: 'TEXTURE' },
    { id: 'posture', title: 'Biyomekanik', icon: Activity, color: '#00ffaa', path: '/posture', metric: 'POSTURE' },
    { id: 'style', title: 'Stil Kimliği', icon: Shirt, color: '#aa00ff', path: '/style', metric: 'COLOR' },
    { id: 'hair', title: 'Saç & Çizgi', icon: Scissors, color: '#ffc400', path: '/hair', metric: 'FOLLICLE' },
  ];

  return (
    <div style={{ padding: '1.5rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="badge" style={{ color: userData.archetype.color, marginBottom: '0.8rem' }}>TARGET: {userData.archetype.name}</div>
          <h1 className="gradient-text" style={{ fontSize: '2.2rem', lineHeight: '1.1' }}>GLOWUP PRO</h1>
          <button 
            onClick={onReset}
            style={{ background: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.2)', padding: '6px 12px', borderRadius: '8px', color: '#ff4444', cursor: 'pointer', fontSize: '0.6rem', marginTop: '1rem', fontWeight: 800 }}
          >
            VERİLERİ SIFIRLA
          </button>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{userData.scanResult?.initial_score || 45}%</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>START SCORE</div>
        </div>
      </header>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: `4px solid ${userData.archetype.color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
          <Star size={20} color={userData.archetype.color} />
          <span style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px' }}>İLK ANALİZ ÖZETİ</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          {userData.scanResult?.summary || "Analiz verileri işleniyor..."}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {modules.map(m => (
          <Link key={m.id} to={m.path} style={{ textDecoration: 'none' }}>
            <motion.div whileTap={{ scale: 0.95 }} className="glass-card" style={{ padding: '1.5rem', background: `linear-gradient(135deg, ${m.color}05, transparent)` }}>
              <m.icon size={28} color={m.color} style={{ marginBottom: '1rem' }} />
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'white' }}>{m.title}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{m.metric}</div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="glass-card" style={{ marginTop: '1.5rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ 
          width: '60px', height: '60px', borderRadius: '50%', 
          background: `url(${userData.archetype.image}) center/cover`,
          border: `2px solid ${userData.archetype.color}`,
          flexShrink: 0
        }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Günün Tavsiyesi</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {userData.archetype.model} gibi keskin hatlar için Sodium/Potassium dengeni optimize et.
          </div>
        </div>
      </div>
    </div>
  );
};

const BottomNav = () => {
  const location = useLocation();
  const navs = [
    { icon: Home, label: 'PANEL', path: '/' },
    { icon: Camera, label: 'TARAMA', path: '/cranio' },
    { icon: Utensils, label: 'BESLENME', path: '/nutri' },
    { icon: Shirt, label: 'STİL', path: '/style' },
    { icon: User, label: 'PROFİL', path: '/profile' },
  ];

  return (
    <nav className="bottom-nav">
      {navs.map((n) => (
        <Link key={n.path} to={n.path} className={`nav-item ${location.pathname === n.path ? 'active' : ''}`}>
          <n.icon className="nav-icon" size={24} />
          <span>{n.label}</span>
        </Link>
      ))}
    </nav>
  );
};

const App = () => {
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('glowup_userdata');
    return saved ? JSON.parse(saved) : null;
  });

  const handleCompleteOnboarding = (data) => {
    setUserData(data);
    localStorage.setItem('glowup_userdata', JSON.stringify(data));
  };

  const handleReset = () => {
    if (window.confirm("Tüm verileriniz silinecek ve baştan başlayacaksınız. Emin misiniz?")) {
      localStorage.removeItem('glowup_user');
      setUserData(null);
      window.location.reload();
    }
  };

  return (
    <Router>
      <div className="app-viewport">
        <div className="cyber-grid" />
        <div className="mobile-container">
          <AnimatePresence mode="wait">
            {!userData ? (
              <Onboarding onComplete={handleCompleteOnboarding} />
            ) : (
              <Routes>
                <Route path="/" element={<Dashboard userData={userData} onReset={handleReset} />} />
                <Route path="/cranio" element={<Craniofacial archetype={userData.archetype} />} />
                <Route path="/derma" element={<Dermatology archetype={userData.archetype} />} />
                <Route path="/posture" element={<Posture archetype={userData.archetype} />} />
                <Route path="/nutri" element={<Nutrition archetype={userData.archetype} />} />
                <Route path="/social" element={<Softmaxing archetype={userData.archetype} />} />
                <Route path="/style" element={<Wardrobe archetype={userData.archetype} />} />
                <Route path="/hair" element={<Hair archetype={userData.archetype} />} />
                <Route path="/profile" element={<Profile userData={userData} />} />
              </Routes>
            )}
          </AnimatePresence>
        </div>
        {userData && <BottomNav />}
      </div>
    </Router>
  );
};

export default App;
