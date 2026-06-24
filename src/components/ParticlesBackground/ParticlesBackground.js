import { useCallback } from 'react';
import { ParticlesProvider, Particles } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import './ParticlesBackground.scss';

const options = {
  fullScreen: { enable: true, zIndex: -1 },
  background: { color: { value: '#0d0d1a' } },
  particles: {
    number: { value: 500 },
    color: { value: ['#ffffff', '#a78bfa', '#60a5fa'] },
    opacity: { value: { min: 0.1, max: 0.7 } },
    size: { value: { min: 1, max: 2.5 } },
    move: { enable: true, speed: 0.3, direction: 'none', random: true },
    links: { enable: false },
  },
  detectRetina: true,
};

export default function ParticlesBackground() {
  const init = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <ParticlesProvider init={init}>
      <Particles className="particles-bg" options={options} />
    </ParticlesProvider>
  );
}
