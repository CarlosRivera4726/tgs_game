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

export class CausalDiagram {
  private container: HTMLElement;
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
  }

  public render() {
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

          <!-- Identificadores Centrales de Bucles -->
          <!-- Bucle B1: Homeostasis (Equilibrador) -->
          <g id="loop-b1" class="loop-badge" transform="translate(320, 260)">
            <circle cx="0" cy="0" r="32" fill="#0b1120" stroke="#00f2fe" stroke-width="2" stroke-dasharray="4 2" />
            <circle cx="0" cy="0" r="28" fill="#0d182e" opacity="0.8" />
            <text x="0" y="-4" text-anchor="middle" fill="#00f2fe" font-size="14" font-weight="800" font-family="'Orbitron', sans-serif">B1</text>
            <text x="0" y="14" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="'JetBrains Mono', monospace">Equilibrio</text>
          </g>

          <!-- Bucle R1: Runaway Entrópico (Reforzador Destructivo) -->
          <g id="loop-r1" class="loop-badge" transform="translate(680, 250)">
            <circle cx="0" cy="0" r="32" fill="#0b1120" stroke="#475569" stroke-width="2" stroke-dasharray="4 2" />
            <circle cx="0" cy="0" r="28" fill="#1f1422" opacity="0.8" />
            <text x="0" y="-4" text-anchor="middle" fill="#ef4444" font-size="14" font-weight="800" font-family="'Orbitron', sans-serif">R1</text>
            <text x="0" y="14" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="'JetBrains Mono', monospace">Cascada</text>
          </g>

          <!-- Nodos / Subsistemas con bolitas ampliadas -->
          <g class="cld-nodes">
            ${this.renderNodes()}
          </g>
        </svg>

        <div class="cld-hint">
          <div class="hint-icon">⚖️</div>
          <div class="hint-content">
            <strong>Lectura Cibernética:</strong> Las flechas <strong>(+)</strong> representan relación directa (aumenta X → aumenta Y). Las flechas <strong>(-)</strong> representan relación inversa. Las marcas <strong>// DELAY</strong> indican <strong>retardos temporales</strong> de respuesta del servomecanismo. Quien actúa con impaciencia lineal acelera la cascada entrópica <strong>R1</strong>.
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
          <g class="link-group">
            <path d="M ${fromNode.x} ${fromNode.y} Q ${midX} ${midY} ${toNode.x} ${toNode.y}" 
                  fill="none" 
                  stroke="${strokeColor}" 
                  stroke-width="2.4" 
                  stroke-dasharray="${link.hasDelay ? '6 3' : 'none'}"
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
        <g class="node-group" transform="translate(${node.x}, ${node.y})" style="cursor: pointer;">
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
