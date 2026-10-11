import { CyberneticEngine } from './game/core/CyberneticEngine';
import { CausalDiagram } from './game/ui/CausalDiagram';
import { Oscilloscope } from './game/ui/Oscilloscope';
import { DashboardRenderer } from './game/ui/DashboardRenderer';
import { SlidesViewer } from './game/ui/SlidesViewer';
import { sound } from './game/audio/SoundEffects';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar motor cibernético
  const engine = new CyberneticEngine();
  engine.startScenario('scenario_1_pendulum');

  // 2. Inicializar visualizadores interactivos
  const causalDiagram = new CausalDiagram('cld-canvas-container');
  const oscilloscope = new Oscilloscope('oscilloscope-canvas');

  // Muestra inicial en osciloscopio
  oscilloscope.addSample(engine.variables.homeostasis, engine.variables.entropy);

  // 3. Inicializar Dashboard
  new DashboardRenderer(engine, causalDiagram, oscilloscope);

  // 4. Inicializar visor de 5 diapositivas
  new SlidesViewer('slides-viewer-mount');

  // 5. Configurar cambio de pestañas de navegación
  const navButtons = document.querySelectorAll('.nav-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      const targetId = btn.getAttribute('data-tab');

      navButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      if (targetId) {
        const targetPanel = document.getElementById(targetId);
        targetPanel?.classList.add('active');
      }
    });
  });

  // 6. Botón de Audio
  const btnSound = document.getElementById('btn-toggle-sound');
  btnSound?.addEventListener('click', () => {
    const isMuted = sound.toggleMute();
    if (btnSound) {
      btnSound.textContent = isMuted ? '🔇 SILENCIO' : '🔊 AUDIO';
    }
  });

  console.log('CYBER-SYN: Protocolo Homeostasis inicializado exitosamente.');
});
