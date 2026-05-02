import React, { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const ParticlesBg: React.FC = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Particles
      id="tsparticles"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      options={{
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        particles: {
          number: {
            value: 55,
            density: { enable: true },
          },
          color: { value: ['#a78bfa', '#818cf8', '#f472b6', '#38bdf8'] },
          shape: { type: 'circle' },
          opacity: {
            value: { min: 0.05, max: 0.35 },
            animation: { enable: true, speed: 0.6, sync: false },
          },
          size: {
            value: { min: 1, max: 4 },
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            random: true,
            outModes: { default: 'out' },
          },
          links: {
            enable: true,
            color: '#a78bfa',
            opacity: 0.08,
            distance: 130,
            width: 1,
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBg;