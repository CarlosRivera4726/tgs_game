/**
 * Sistema de micro-interacciones y efectos de clic futuristas (Cybernetic Click FX)
 * Genera una onda de pulso cuántico / retícula de energía táctil en cada interacción.
 */

export class CyberClickEffects {
  private container: HTMLDivElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'cyber-click-fx-container';
    document.body.appendChild(this.container);
    this.init();
  }

  private init() {
    document.addEventListener('pointerdown', (e: PointerEvent) => {
      // Ignorar eventos secundarios
      if (e.button !== 0) return;

      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, .policy-card-item, .node-group, .nav-tab-btn, a, input, select');

      this.spawnShockwave(e.clientX, e.clientY, isInteractive ? 'high' : 'ambient');

      if (isInteractive) {
        const btn = target.closest('button, .policy-card-item, .nav-tab-btn, a') as HTMLElement;
        if (btn) {
          btn.classList.remove('cyber-pressed');
          void btn.offsetWidth; // Force reflow
          btn.classList.add('cyber-pressed');
        }
      }
    });
  }

  public spawnShockwave(x: number, y: number, intensity: 'high' | 'ambient' = 'high') {
    const ring = document.createElement('div');
    ring.className = `cyber-shockwave ${intensity}`;
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;

    // Crosshair brackets inside the shockwave
    ring.innerHTML = `
      <div class="shockwave-ring"></div>
      <div class="shockwave-crosshair-h"></div>
      <div class="shockwave-crosshair-v"></div>
      <div class="shockwave-sparks"></div>
    `;

    this.container.appendChild(ring);

    setTimeout(() => {
      ring.remove();
    }, 450);
  }
}

export const clickEffects = new CyberClickEffects();
