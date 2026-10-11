/**
 * CyberCursor.ts
 * Sistema de cursor táctico futurista (Cyber-Syn HUD Reticle).
 * Proporciona un puntero cuántico con retícula de fijación de objetivo (target lock-on),
 * física de inercia suave (lerp) y sincronización cromática dinámica con los subsistemas.
 */

export class CyberCursor {
  private root: HTMLDivElement | null = null;
  private dot: HTMLDivElement | null = null;
  private reticle: HTMLDivElement | null = null;
  private coordsTag: HTMLDivElement | null = null;
  private xVal: HTMLSpanElement | null = null;
  private yVal: HTMLSpanElement | null = null;

  private targetX: number = window.innerWidth / 2;
  private targetY: number = window.innerHeight / 2;
  private currentX: number = window.innerWidth / 2;
  private currentY: number = window.innerHeight / 2;

  private isHovering: boolean = false;
  private isClicking: boolean = false;
  private isVisible: boolean = false;
  private customColor: string | null = null;

  private rafId: number | null = null;
  private isFinePointer: boolean = false;

  constructor() {
    this.isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!this.isFinePointer) {
      // En pantallas táctiles sin puntero fino, no sobreescribir el cursor nativo
      return;
    }
    this.createElements();
    this.bindEvents();
    this.startPhysicsLoop();
  }

  private createElements() {
    this.root = document.createElement('div');
    this.root.className = 'cyber-cursor-root cursor-hidden';
    this.root.setAttribute('aria-hidden', 'true');

    this.root.innerHTML = `
      <!-- Punto central de precisión cuántica (0 latencia) -->
      <div class="cyber-cursor-dot"></div>

      <!-- Retícula HUD exterior con amortiguación suave (lerp) -->
      <div class="cyber-cursor-reticle">
        <svg class="cyber-reticle-svg" viewBox="0 0 52 52">
          <!-- Anillo exterior segmentado -->
          <circle class="reticle-outer-ring" cx="26" cy="26" r="22" />
          <!-- Anillo interior de referencia -->
          <circle class="reticle-inner-ring" cx="26" cy="26" r="14" />
          <!-- Brackets tácticos de fijación de objetivo -->
          <path class="reticle-bracket tl" d="M 13 19 L 13 13 L 19 13" />
          <path class="reticle-bracket tr" d="M 33 13 L 39 13 L 39 19" />
          <path class="reticle-bracket bl" d="M 13 33 L 13 39 L 19 39" />
          <path class="reticle-bracket br" d="M 33 39 L 39 39 L 39 33" />
          <!-- Ticks cardinales de mira -->
          <line class="reticle-crosshair" x1="26" y1="4" x2="26" y2="8" />
          <line class="reticle-crosshair" x1="26" y1="44" x2="26" y2="48" />
          <line class="reticle-crosshair" x1="4" y1="26" x2="8" y2="26" />
          <line class="reticle-crosshair" x1="44" y1="26" x2="48" y2="26" />
        </svg>
        <div class="reticle-pulse-glow"></div>
      </div>

      <!-- Telemetría HUD: Coordenadas discretas en vivo -->
      <div class="cyber-cursor-coords">
        <span class="coord-item coord-x">X:<span class="val-x">000</span></span>
        <span class="coord-item coord-y">Y:<span class="val-y">000</span></span>
      </div>
    `;

    document.body.appendChild(this.root);
    document.body.classList.add('cyber-cursor-enabled');

    this.dot = this.root.querySelector('.cyber-cursor-dot');
    this.reticle = this.root.querySelector('.cyber-cursor-reticle');
    this.coordsTag = this.root.querySelector('.cyber-cursor-coords');
    this.xVal = this.root.querySelector('.val-x');
    this.yVal = this.root.querySelector('.val-y');
  }

  private bindEvents() {
    window.addEventListener('pointermove', (e: PointerEvent) => {
      // Ignorar eventos espurios (0, 0) que algunos navegadores emiten en drag/focus
      if (e.clientX === 0 && e.clientY === 0) return;

      this.targetX = e.clientX;
      this.targetY = e.clientY;

      if (!this.isVisible) {
        this.isVisible = true;
        this.root?.classList.remove('cursor-hidden');
        this.currentX = this.targetX;
        this.currentY = this.targetY;
      }

      // Mover punto central inmediatamente con cero latencia
      if (this.dot) {
        this.dot.style.transform = `translate3d(${this.targetX}px, ${this.targetY}px, 0)`;
      }

      // Actualizar telemetría de coordenadas
      if (this.xVal && this.yVal) {
        this.xVal.textContent = Math.round(this.targetX).toString().padStart(3, '0');
        this.yVal.textContent = Math.round(this.targetY).toString().padStart(3, '0');
      }

      // Detección de elementos interactivos y colores contextuales
      this.checkTargetContext(e.target as Element | null);
    }, { passive: true });

    window.addEventListener('pointerdown', (e: PointerEvent) => {
      if (e.button !== 0) return;
      this.isClicking = true;
      this.root?.classList.add('cursor-click');
    });

    const endClick = () => {
      this.isClicking = false;
      this.root?.classList.remove('cursor-click');
    };

    window.addEventListener('pointerup', endClick);
    window.addEventListener('pointercancel', endClick);
    window.addEventListener('blur', endClick);

    document.documentElement.addEventListener('mouseleave', () => {
      this.isVisible = false;
      endClick();
      this.root?.classList.add('cursor-hidden');
    });

    document.documentElement.addEventListener('mouseenter', () => {
      this.isVisible = true;
      this.root?.classList.remove('cursor-hidden');
    });
  }

  private checkTargetContext(target: Element | null) {
    if (!target) return;

    // Detectar si el objetivo o sus ancestros son interactivos
    const interactiveEl = target.closest(
      'button, a, select, input, [role="button"], .nav-tab-btn, .policy-card-item, ' +
      '.node-group, .loop-badge, .link-group, .instructions-trigger, .btn-side-toggle, ' +
      '.btn-cld-focus, .btn-advance-cycle, .btn-audio-toggle, .btn-inst-collapse, .cld-svg'
    );

    const isInteractive = interactiveEl !== null && !interactiveEl.classList.contains('cld-svg');

    if (isInteractive !== this.isHovering) {
      this.isHovering = isInteractive;
      this.root?.classList.toggle('cursor-hover', isInteractive);
    }

    // Detectar si el elemento provee un color contextual personalizado (nodos, bucles, etc.)
    const colorEl = target.closest('[data-color], [data-cursor-color]') as HTMLElement | null;
    const detectedColor = colorEl ? (colorEl.getAttribute('data-color') || colorEl.getAttribute('data-cursor-color')) : null;

    if (detectedColor !== this.customColor) {
      this.customColor = detectedColor;
      if (this.root) {
        if (this.customColor) {
          this.root.style.setProperty('--cursor-accent', this.customColor);
          this.root.classList.add('cursor-custom-color');
        } else {
          this.root.style.removeProperty('--cursor-accent');
          this.root.classList.remove('cursor-custom-color');
        }
      }
    }
  }

  private startPhysicsLoop() {
    const loop = () => {
      if (this.isVisible && this.reticle && this.coordsTag) {
        // Amortiguación suave para el retículo exterior (lerp)
        const lerpFactor = this.isHovering ? 0.28 : 0.18;
        this.currentX += (this.targetX - this.currentX) * lerpFactor;
        this.currentY += (this.targetY - this.currentY) * lerpFactor;

        this.reticle.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
        this.coordsTag.style.transform = `translate3d(${this.currentX + 22}px, ${this.currentY + 14}px, 0)`;
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  public destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.root?.remove();
    document.body.classList.remove('cyber-cursor-enabled');
  }
}

export const cyberCursor = new CyberCursor();
