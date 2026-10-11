import type { SystemVariables } from '../core/Types';

interface NodePosition {
  id: string;
  title1: string;
  title2: string;
  sublabel: string;
  icon: string;
  x: number;
  y: number;
  color: string;
}

interface EdgeLink {
  from: string;
  to: string;
  polarity: '+' | '-';
  loop: 'B1' | 'B2' | 'R1' | 'R2';
  hasDelay: boolean;
  curvature: number;
  polarityOffset?: { x: number; y: number };
  delayOffset?: { x: number; y: number };
}

interface CldParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobblePhase: number;
  el: SVGGElement;
}

/**
 * Motor de micro-partículas cuánticas para el Mapa Dinámico CLD.
 * Genera partículas diminutas (1.0px - 2.2px) que emergen estrictamente desde el perímetro
 * exterior del círculo (subsistema o bucle) sobre el que se hace hover, proyectándose hacia afuera.
 */
export class CldBubbleEngine {
  private svg: SVGSVGElement;
  private layer: SVGGElement;
  private nodes: NodePosition[];
  private particles: CldParticle[] = [];
  private rafId: number | null = null;
  private hoverInterval: number | null = null;

  constructor(svg: SVGSVGElement, layer: SVGGElement, nodes: NodePosition[]) {
    this.svg = svg;
    this.layer = layer;
    this.nodes = nodes;
    this.bindEvents();
  }

  private bindEvents() {
    // 1. Hover sobre Nodos individuales (Burbujas de Subsistemas, radio = 56px)
    const nodeGroups = this.svg.querySelectorAll('.node-group');
    nodeGroups.forEach(group => {
      const g = group as SVGGElement;
      const color = g.getAttribute('data-color') || '#00f2fe';
      const nx = parseFloat(g.getAttribute('data-x') || '0');
      const ny = parseFloat(g.getAttribute('data-y') || '0');
      const circleRadius = 56; // Radio del círculo del subsistema

      g.addEventListener('mouseenter', () => {
        // Estallido inicial de micro-partículas estrictamente en el perímetro exterior
        this.spawnPerimeterBurst(nx, ny, circleRadius, color, 18);

        // Flujo continuo de partículas saliendo del perímetro mientras esté en hover
        this.clearHoverInterval();
        this.hoverInterval = window.setInterval(() => {
          // Generar de 2 a 3 partículas saliendo desde el borde exterior
          for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            this.spawnPerimeterParticle(nx, ny, circleRadius, angle, color);
          }
        }, 70);
      });

      g.addEventListener('mousemove', (e: MouseEvent) => {
        // Al mover el mouse sobre el círculo, las partículas salen del borde exterior
        // en la dirección hacia donde apunta el cursor, NUNCA dentro del círculo
        const pt = this.clientToSvg(e.clientX, e.clientY);
        const cursorAngle = Math.atan2(pt.y - ny, pt.x - nx);
        for (let i = 0; i < 2; i++) {
          const spreadAngle = cursorAngle + (Math.random() - 0.5) * 1.4;
          this.spawnPerimeterParticle(nx, ny, circleRadius, spreadAngle, color);
        }
      });

      g.addEventListener('mouseleave', () => {
        this.clearHoverInterval();
      });

      g.addEventListener('click', () => {
        // Anillo de partículas en el clic
        this.spawnPerimeterBurst(nx, ny, circleRadius, color, 24);
      });
    });

    // 2. Hover sobre Identificadores Centrales de Bucles (Loop Badges B1 y R1, radio = 32px)
    const loopB1 = this.svg.querySelector<SVGElement>('#loop-b1');
    const loopR1 = this.svg.querySelector<SVGElement>('#loop-r1');

    const setupLoopHover = (badge: SVGElement | null, color: string, cx: number, cy: number, circleRadius: number = 32) => {
      if (!badge) return;
      badge.addEventListener('mouseenter', () => {
        this.spawnPerimeterBurst(cx, cy, circleRadius, color, 16);
        this.clearHoverInterval();
        this.hoverInterval = window.setInterval(() => {
          for (let i = 0; i < 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            this.spawnPerimeterParticle(cx, cy, circleRadius, angle, color);
          }
        }, 70);
      });

      badge.addEventListener('mousemove', (e: MouseEvent) => {
        const pt = this.clientToSvg(e.clientX, e.clientY);
        const cursorAngle = Math.atan2(pt.y - cy, pt.x - cx);
        for (let i = 0; i < 2; i++) {
          const spreadAngle = cursorAngle + (Math.random() - 0.5) * 1.4;
          this.spawnPerimeterParticle(cx, cy, circleRadius, spreadAngle, color);
        }
      });

      badge.addEventListener('mouseleave', () => {
        this.clearHoverInterval();
      });

      badge.addEventListener('click', () => {
        this.spawnPerimeterBurst(cx, cy, circleRadius, color, 20);
      });
    };

    setupLoopHover(loopB1, '#00f2fe', 320, 260, 32); // Bucle B1: Homeostasis (Cyan)
    setupLoopHover(loopR1, '#ef4444', 680, 250, 32); // Bucle R1: Runaway Entrópico (Rojo)

    this.svg.addEventListener('mouseleave', () => {
      this.clearHoverInterval();
    });
  }

  private clearHoverInterval() {
    if (this.hoverInterval !== null) {
      clearInterval(this.hoverInterval);
      this.hoverInterval = null;
    }
  }

  private clientToSvg(clientX: number, clientY: number): { x: number; y: number } {
    const pt = this.svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = this.svg.getScreenCTM();
    if (ctm) {
      const p = pt.matrixTransform(ctm.inverse());
      return { x: p.x, y: p.y };
    }
    return { x: 500, y: 270 };
  }

  /**
   * Genera un estallido inicial de micro-partículas a lo largo de todo el perímetro exterior del círculo
   */
  public spawnPerimeterBurst(centerX: number, centerY: number, radius: number, color: string, count: number = 18) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      this.spawnPerimeterParticle(centerX, centerY, radius, angle, color);
    }
  }

  /**
   * Genera una micro-partícula que nace en el borde exterior del círculo y viaja hacia afuera
   */
  public spawnPerimeterParticle(centerX: number, centerY: number, radius: number, angle: number, color: string) {
    if (this.particles.length > 90) {
      const oldest = this.particles.shift();
      oldest?.el.remove();
    }

    // Nace exactamente en el borde exterior del círculo (entre radius + 1px y radius + 4px)
    const dist = radius + 1.2 + Math.random() * 3.2;
    const spawnX = centerX + Math.cos(angle) * dist;
    const spawnY = centerY + Math.sin(angle) * dist;

    // Velocidad radial hacia afuera + ligera deriva ascendente
    const radialSpeed = 0.5 + Math.random() * 1.2;
    const vx = Math.cos(angle) * radialSpeed + (Math.random() - 0.5) * 0.3;
    const vy = Math.sin(angle) * radialSpeed - (0.4 + Math.random() * 0.8);

    // Tamaño diminuto tipo partícula (1.0px a 2.2px)
    const r = 1.0 + Math.random() * 1.2;
    const maxLife = 26 + Math.floor(Math.random() * 22);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'cld-bubble-particle');
    g.setAttribute('transform', `translate(${spawnX.toFixed(1)}, ${spawnY.toFixed(1)})`);
    g.setAttribute('opacity', '0');

    // Estructura de micro-partícula brillante: halo exterior, cuerpo y micro-destello
    g.innerHTML = `
      <circle cx="0" cy="0" r="${(r + 1.4).toFixed(1)}" fill="${color}" fill-opacity="0.35" filter="url(#glow-particle)"/>
      <circle cx="0" cy="0" r="${r.toFixed(1)}" fill="${color}" stroke="#ffffff" stroke-width="0.4" stroke-opacity="0.9" fill-opacity="0.88"/>
      <circle cx="${(-r * 0.25).toFixed(1)}" cy="${(-r * 0.25).toFixed(1)}" r="${(r * 0.35).toFixed(1)}" fill="#ffffff" fill-opacity="0.98"/>
    `;

    this.layer.appendChild(g);

    this.particles.push({
      x: spawnX,
      y: spawnY,
      vx,
      vy,
      radius: r,
      color,
      life: 0,
      maxLife,
      wobbleSpeed: 0.12 + Math.random() * 0.12,
      wobbleAmp: 0.3 + Math.random() * 0.4,
      wobblePhase: Math.random() * Math.PI * 2,
      el: g
    });

    this.startLoop();
  }

  private startLoop() {
    if (this.rafId !== null) return;

    const tick = () => {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life++;
        const progress = p.life / p.maxLife;

        if (progress >= 1) {
          p.el.remove();
          this.particles.splice(i, 1);
          continue;
        }

        p.x += p.vx + Math.sin(p.life * p.wobbleSpeed + p.wobblePhase) * p.wobbleAmp;
        p.y += p.vy;

        // Curva de opacidad: entrada rápida (primeros 15%) y desvanecimiento suave hacia el final
        let opacity = 0.95;
        if (progress < 0.15) {
          opacity = (progress / 0.15) * 0.95;
        } else if (progress > 0.5) {
          opacity = (1 - (progress - 0.5) / 0.5) * 0.95;
        }

        p.el.setAttribute('transform', `translate(${p.x.toFixed(1)}, ${p.y.toFixed(1)})`);
        p.el.setAttribute('opacity', opacity.toFixed(2));
      }

      if (this.particles.length > 0) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.rafId = null;
      }
    };

    this.rafId = requestAnimationFrame(tick);
  }

  public destroy() {
    this.clearHoverInterval();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.particles.forEach(p => p.el.remove());
    this.particles = [];
  }
}

export class CausalDiagram {
  private container: HTMLElement;
  private bubbleEngine: CldBubbleEngine | null = null;
  private nodes: NodePosition[] = [
    {
      id: 'energy',
      title1: 'Energía',
      title2: 'Potencia',
      sublabel: 'Flujo Térmico',
      icon: '⚡',
      x: 160,
      y: 130,
      color: '#00f2fe'
    },
    {
      id: 'temperature',
      title1: 'Temperatura',
      title2: 'Biosférica',
      sublabel: 'Calor Residual',
      icon: '🌡️',
      x: 500,
      y: 80,
      color: '#f59e0b'
    },
    {
      id: 'entropy',
      title1: 'Entropía (H)',
      title2: 'Shannon',
      sublabel: 'Ruido Canal',
      icon: '📉',
      x: 840,
      y: 140,
      color: '#ef4444'
    },
    {
      id: 'sensors',
      title1: 'Red Sensores',
      title2: 'Diagnóstico',
      sublabel: 'Telemetría',
      icon: '📡',
      x: 830,
      y: 400,
      color: '#a855f7'
    },
    {
      id: 'servomecanism',
      title1: 'Servocontrol',
      title2: 'Homeostático',
      sublabel: 'Comparador',
      icon: '🎯',
      x: 500,
      y: 450,
      color: '#38bdf8'
    },
    {
      id: 'viability',
      title1: 'Viabilidad',
      title2: 'Social',
      sublabel: 'Salud Colonia',
      icon: '🏙️',
      x: 170,
      y: 390,
      color: '#10b981'
    }
  ];

  private links: EdgeLink[] = [
    // Bucle B1: Homeostasis (Equilibrador) - Bajada y subida con amplia separación en el centro
    {
      from: 'temperature',
      to: 'servomecanism',
      polarity: '+',
      loop: 'B1',
      hasDelay: true,
      curvature: 0.22,
      polarityOffset: { x: -14, y: -8 },
      delayOffset: { x: -26, y: 24 }
    },
    {
      from: 'servomecanism',
      to: 'temperature',
      polarity: '-',
      loop: 'B1',
      hasDelay: true,
      curvature: -0.22,
      polarityOffset: { x: 14, y: 8 },
      delayOffset: { x: 26, y: -24 }
    },

    // Bucle R1: Runaway Entrópico (Reforzador Destructivo)
    {
      from: 'temperature',
      to: 'entropy',
      polarity: '+',
      loop: 'R1',
      hasDelay: false,
      curvature: 0.1,
      polarityOffset: { x: 0, y: -16 }
    },
    {
      from: 'entropy',
      to: 'sensors',
      polarity: '-',
      loop: 'R1',
      hasDelay: false,
      curvature: 0.08,
      polarityOffset: { x: 20, y: 0 }
    },
    {
      from: 'sensors',
      to: 'servomecanism',
      polarity: '+',
      loop: 'R1',
      hasDelay: true,
      curvature: -0.12,
      polarityOffset: { x: 0, y: 18 },
      delayOffset: { x: -44, y: 18 }
    },
    {
      from: 'servomecanism',
      to: 'energy',
      polarity: '+',
      loop: 'R1',
      hasDelay: false,
      curvature: -0.14,
      polarityOffset: { x: -16, y: 12 }
    },
    {
      from: 'energy',
      to: 'temperature',
      polarity: '+',
      loop: 'R1',
      hasDelay: false,
      curvature: 0.12,
      polarityOffset: { x: 0, y: -16 }
    },

    // Bucle R2: Sinergia de Viabilidad
    {
      from: 'servomecanism',
      to: 'viability',
      polarity: '+',
      loop: 'R2',
      hasDelay: false,
      curvature: 0.08,
      polarityOffset: { x: 0, y: 18 }
    },
    {
      from: 'viability',
      to: 'energy',
      polarity: '+',
      loop: 'R2',
      hasDelay: false,
      curvature: 0.1,
      polarityOffset: { x: -18, y: 0 }
    }
  ];

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) {
      throw new Error(`Element with id ${containerId} not found`);
    }
    this.container = el;
    this.render();
  }

  public update(variables: SystemVariables, feedback: { balancingActive: boolean; reinforcingActive: boolean }) {
    const svg = this.container.querySelector('svg');
    if (!svg) return;

    // Actualizar brillo y animación de bucles activos
    const b1Group = svg.querySelector('#loop-b1');
    const r1Group = svg.querySelector('#loop-r1');

    if (b1Group) {
      const circle = b1Group.querySelector('circle');
      if (circle) {
        if (feedback.balancingActive) {
          circle.setAttribute('stroke', '#00f2fe');
          circle.setAttribute('stroke-width', '3.5');
          circle.setAttribute('filter', 'url(#glow-cyan)');
        } else {
          circle.setAttribute('stroke', '#38bdf8');
          circle.setAttribute('stroke-width', '2');
          circle.removeAttribute('filter');
        }
      }
    }

    if (r1Group) {
      const circle = r1Group.querySelector('circle');
      if (circle) {
        if (feedback.reinforcingActive || variables.entropy > 60) {
          circle.setAttribute('stroke', '#ef4444');
          circle.setAttribute('stroke-width', '4');
          circle.setAttribute('filter', 'url(#glow-red)');
        } else {
          circle.setAttribute('stroke', '#475569');
          circle.setAttribute('stroke-width', '2');
          circle.removeAttribute('filter');
        }
      }
    }

    // Actualizar flujo dinámico de las líneas causales
    const r1Edges = svg.querySelectorAll('.cld-edge.r1');
    r1Edges.forEach(el => {
      if (feedback.reinforcingActive || variables.entropy > 60) {
        el.classList.add('active-runaway');
      } else {
        el.classList.remove('active-runaway');
      }
    });

    const b1Edges = svg.querySelectorAll('.cld-edge.b1');
    b1Edges.forEach(el => {
      if (feedback.balancingActive) {
        el.classList.add('active-homeostasis');
      } else {
        el.classList.remove('active-homeostasis');
      }
    });
  }

  public render() {
    // Destruir motor previo si existía
    this.bubbleEngine?.destroy();

    this.container.innerHTML = `
      <div class="cld-wrapper">
        <div class="cld-header">
          <div class="cld-title">
            <span class="cld-indicator-led"></span>
            <span>MAPA DINÁMICO DE BUCLES CAUSALES (CLD)</span>
            <span class="cld-ver-tag">ESTÁNDAR TGS // DINÁMICA DE SISTEMAS</span>
          </div>
          <div class="cld-legend">
            <span class="badge loop-b"><span class="dot"></span> B1: Homeostasis</span>
            <span class="badge loop-r"><span class="dot"></span> R1: Runaway Entrópico</span>
            <span class="badge loop-delay"><span class="delay-icon">//</span> Retardo Temporal</span>
            <button id="btn-toggle-cld-focus" class="btn-cld-focus" title="Expandir/Ajustar área de mapa">
              ⛶ ENFOQUE TOTAL
            </button>
          </div>
        </div>
        
        <svg viewBox="0 0 1000 540" preserveAspectRatio="xMidYMid meet" class="cld-svg">
          <defs>
            <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-red" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-particle" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-bubble" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <!-- Gradientes para los fondos de los nodos -->
            <radialGradient id="grad-node-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#162238" />
              <stop offset="85%" stop-color="#0c1424" />
              <stop offset="100%" stop-color="#070b13" />
            </radialGradient>

            <marker id="arrow-cyan" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 1.5 L 11 6 L 0 10.5 z" fill="#00f2fe" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 1.5 L 11 6 L 0 10.5 z" fill="#ef4444" />
            </marker>
            <marker id="arrow-green" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 1.5 L 11 6 L 0 10.5 z" fill="#10b981" />
            </marker>
          </defs>

          <!-- Cuadrícula sutil de referencia técnica -->
          <g class="cld-grid-lines" opacity="0.15">
            <line x1="500" y1="20" x2="500" y2="520" stroke="#334155" stroke-dasharray="3 3"/>
            <line x1="40" y1="270" x2="960" y2="270" stroke="#334155" stroke-dasharray="3 3"/>
            <circle cx="500" cy="270" r="220" fill="none" stroke="#334155" stroke-dasharray="2 4" opacity="0.4"/>
          </g>

          <!-- Enlaces / Flechas Causales -->
          <g class="cld-links">
            ${this.renderLinks()}
          </g>

          <!-- Identificadores Centrales de Bucles con soporte interactivo -->
          <!-- Bucle B1: Homeostasis (Equilibrador) -->
          <g id="loop-b1" class="loop-badge" data-loop-id="b1" data-color="#00f2fe" data-title="B1: Homeostasis" transform="translate(320, 260)" style="cursor: pointer;">
            <circle cx="0" cy="0" r="32" fill="#0b1120" stroke="#00f2fe" stroke-width="2" stroke-dasharray="4 2" />
            <circle cx="0" cy="0" r="28" fill="#0d182e" opacity="0.8" />
            <text x="0" y="-4" text-anchor="middle" fill="#00f2fe" font-size="14" font-weight="800" font-family="'Orbitron', sans-serif">B1</text>
            <text x="0" y="14" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="'JetBrains Mono', monospace">Equilibrio</text>
          </g>

          <!-- Bucle R1: Runaway Entrópico (Reforzador Destructivo) -->
          <g id="loop-r1" class="loop-badge" data-loop-id="r1" data-color="#ef4444" data-title="R1: Runaway Entrópico" transform="translate(680, 250)" style="cursor: pointer;">
            <circle cx="0" cy="0" r="32" fill="#0b1120" stroke="#475569" stroke-width="2" stroke-dasharray="4 2" />
            <circle cx="0" cy="0" r="28" fill="#1f1422" opacity="0.8" />
            <text x="0" y="-4" text-anchor="middle" fill="#ef4444" font-size="14" font-weight="800" font-family="'Orbitron', sans-serif">R1</text>
            <text x="0" y="14" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="'JetBrains Mono', monospace">Cascada</text>
          </g>

          <!-- Nodos / Subsistemas con bolitas ampliadas -->
          <g class="cld-nodes">
            ${this.renderNodes()}
          </g>

          <!-- Capa de Micro-Partículas Cuánticas (Emanan estrictamente del perímetro de los círculos) -->
          <g id="cld-bubbles-layer" class="cld-bubbles-layer" pointer-events="none"></g>
        </svg>

        <div class="cld-hint">
          <div class="hint-icon">⚖️</div>
          <div class="hint-content">
            <strong>Lectura Cibernética:</strong> Pasa el cursor sobre cualquiera de las <strong>burbujas de subsistema</strong> o <strong>bucles causales (B1, R1)</strong> para inspeccionar la resonancia cuántica. Las flechas <strong>(+)</strong> representan relación directa y <strong>(-)</strong> inversa. Las marcas <strong>// DELAY</strong> indican retardos temporales de respuesta homeostática.
          </div>
        </div>
      </div>
    `;

    // Bind focus toggle button
    this.container.querySelector('#btn-toggle-cld-focus')?.addEventListener('click', () => {
      const grid = document.querySelector('.dashboard-grid');
      if (grid) {
        const isFocused = grid.classList.toggle('focus-mode');
        const btn = this.container.querySelector('#btn-toggle-cld-focus');
        if (btn) {
          btn.textContent = isFocused ? '⛶ MODO NORMAL' : '⛶ ENFOQUE TOTAL';
        }
      }
    });

    // Inicializar el motor de burbujas en el SVG recién renderizado
    const svgEl = this.container.querySelector('svg');
    const bubblesLayer = this.container.querySelector('#cld-bubbles-layer') as SVGGElement | null;
    if (svgEl && bubblesLayer) {
      this.bubbleEngine = new CldBubbleEngine(svgEl, bubblesLayer, this.nodes);
    }
  }

  private renderLinks(): string {
    return this.links
      .map(link => {
        const fromNode = this.nodes.find(n => n.id === link.from);
        const toNode = this.nodes.find(n => n.id === link.to);
        if (!fromNode || !toNode) return '';

        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const midX = (fromNode.x + toNode.x) / 2 + dy * link.curvature;
        const midY = (fromNode.y + toNode.y) / 2 - dx * link.curvature;

        const isRed = link.loop === 'R1';
        const strokeColor = isRed ? '#ef4444' : link.loop === 'R2' ? '#10b981' : '#00f2fe';
        const marker = isRed ? 'url(#arrow-red)' : link.loop === 'R2' ? 'url(#arrow-green)' : 'url(#arrow-cyan)';

        // Offset customizado para que no colisionen los badges
        const pX = midX + (link.polarityOffset?.x || 0);
        const pY = midY + (link.polarityOffset?.y || 0);

        const dX = midX + (link.delayOffset?.x || 18);
        const dY = midY + (link.delayOffset?.y || -14);

        return `
          <g class="link-group" data-loop="${link.loop.toLowerCase()}" data-color="${strokeColor}" style="cursor: pointer;">
            <path class="cld-edge ${link.loop.toLowerCase()} ${link.hasDelay ? 'has-delay' : ''}"
                  d="M ${fromNode.x} ${fromNode.y} Q ${midX} ${midY} ${toNode.x} ${toNode.y}" 
                  fill="none" 
                  stroke="${strokeColor}" 
                  stroke-width="2.4" 
                  stroke-dasharray="${link.hasDelay ? '6 3' : '8 4'}"
                  opacity="0.9"
                  marker-end="${marker}" />
            
            <!-- Polarity indicator badge (+) o (-) -->
            <circle cx="${pX}" cy="${pY}" r="12" fill="#070b13" stroke="${strokeColor}" stroke-width="1.8" />
            <text x="${pX}" y="${pY + 4.5}" text-anchor="middle" fill="${strokeColor}" font-size="13" font-weight="900" font-family="'JetBrains Mono', monospace">
              ${link.polarity}
            </text>

            ${
              link.hasDelay
                ? `
              <g transform="translate(${dX}, ${dY})">
                <rect x="-4" y="-10" width="54" height="18" rx="4" fill="#070b13" stroke="#f59e0b" stroke-width="1.2"/>
                <text x="23" y="3" text-anchor="middle" fill="#f59e0b" font-size="9" font-family="'JetBrains Mono', monospace" font-weight="700">// DELAY</text>
              </g>
            `
                : ''
            }
          </g>
        `;
      })
      .join('');
  }

  private renderNodes(): string {
    const radius = 56; // Diámetro = 112px, espacio amplio garantizado para que el texto NO desborde

    return this.nodes
      .map(node => {
        return `
        <g class="node-group" 
           data-node-id="${node.id}" 
           data-color="${node.color}" 
           data-x="${node.x}" 
           data-y="${node.y}" 
           data-title="${node.title1} ${node.title2}"
           transform="translate(${node.x}, ${node.y})" 
           style="cursor: pointer;">
          <!-- Anillo de escala / calibre exterior -->
          <circle cx="0" cy="0" r="${radius + 6}" fill="none" stroke="${node.color}" stroke-width="1" stroke-dasharray="3 3" opacity="0.4" />
          
          <!-- Borde principal con color de subsistema -->
          <circle cx="0" cy="0" r="${radius}" fill="url(#grad-node-bg)" stroke="${node.color}" stroke-width="2.5" />
          
          <!-- Anillo interior biselado -->
          <circle cx="0" cy="0" r="${radius - 4}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" />

          <!-- Icono superior -->
          <text x="0" y="-19" text-anchor="middle" font-size="18">${node.icon}</text>
          
          <!-- Título línea 1 (Negrita principal) -->
          <text x="0" y="2" text-anchor="middle" fill="#f8fafc" font-size="12.5" font-weight="800" font-family="'Inter', sans-serif">
            ${node.title1}
          </text>
          
          <!-- Título línea 2 (Complemento) -->
          <text x="0" y="16" text-anchor="middle" fill="#e2e8f0" font-size="11" font-weight="600" font-family="'Inter', sans-serif">
            ${node.title2}
          </text>
          
          <!-- Subtítulo / Métrica en monospace -->
          <text x="0" y="31" text-anchor="middle" fill="${node.color}" font-size="8.5" font-weight="600" font-family="'JetBrains Mono', monospace" letter-spacing="0.3">
            ${node.sublabel}
          </text>
        </g>
      `;
      })
      .join('');
  }
}
