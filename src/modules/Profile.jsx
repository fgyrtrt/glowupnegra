import React from 'react';
import { motion } from 'framer-motion';
import { User, Target, Calendar, Award, Zap, ChevronRight, Settings, BarChart3, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = ({ userData }) => {
  const { archetype, goals, scanResult } = userData;

  const stats = [
    { label: 'GlowUp Skoru', value: `${scanResult?.initial_score || 45}%`, icon: Award, color: 'var(--accent-gold)' },
    { label: 'Analiz Sayısı', value: '12', icon: BarChart3, color: 'var(--accent-cyan)' },
    { label: 'Aktif Hedef', value: archetype?.name || 'Actor', icon: Target, color: 'var(--accent-magenta)' },
  ];

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '120px' }}>
      <header style={{ marginBottom: '2.5rem', textAlign: 'center', paddingTop: '1rem' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1.5rem' }}>
           <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2px solid var(--accent-cyan)', padding: '4px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(0,242,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={40} color="var(--accent-cyan)" />
              </div>
           </div>
           <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent-cyan)', padding: '4px', borderRadius: '50%' }}>
              <Zap size={14} color="black" fill="black" />
           </div>
        </div>
        <h1 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Kişisel Profil</h1>
        <div className="badge" style={{ color: 'var(--text-secondary)' }}>Üyelik Durumu: ALPHA_USER</div>
      </header>

      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '2rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <s.icon size={18} color={s.color} style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>{s.value}</div>
            <div style={{ fontSize: '0.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '0.3rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ARCHETYPE CARD */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
          <Target size={120} color="var(--accent-cyan)" />
        </div>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.2rem', color: 'var(--accent-cyan)', letterSpacing: '1px' }}>SEÇİLEN ARKETİP</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img 
            src={archetype?.image} 
            alt={archetype?.name} 
            style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--glass-border)' }} 
          />
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{archetype?.model}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hedeflenen Estetik: {archetype?.name}</div>
          </div>
        </div>
      </div>

      {/* GOALS & INFO */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--accent-magenta)', letterSpacing: '1px' }}>BİYOMETRİK ÖZET</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Kayıtlı Yaş:</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{goals?.age || '24'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cilt Tipi:</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{goals?.skinType || 'Karma'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Son Güncelleme:</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>26.04.2026</span>
          </div>
        </div>
      </div>

      {/* PROGRESS LOGS */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem', opacity: 0.7 }}>SON AKTİVİTELER</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {[
            { label: 'Yüz Analizi', date: 'Bugün', score: '+2.4%' },
            { label: 'Cilt Analizi', date: 'Dün', score: '+1.8%' },
            { label: 'Öğün Kaydı', date: 'Dün', score: 'P: 140g' }
          ].map((log, i) => (
            <div key={i} className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Clock size={16} color="var(--text-secondary)" />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{log.label}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{log.date}</div>
                  </div>
               </div>
               <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>{log.score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
