import type { SystemVariables } from '../core/Types';

interface NodePosition {
  id: string;
  label: string;
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
}

export class CausalDiagram {
  private container: HTMLElement;
  private nodes: NodePosition[] = [
    { id: 'energy', label: 'Energía / Potencia', sublabel: 'Flujo Termodinámico', icon: '⚡', x: 160, y: 110, color: '#00f2fe' },
    { id: 'temperature', label: 'Temperatura', sublabel: 'Calor Residual Biosférico', icon: '🌡️', x: 470, y: 70, color: '#f5a623' },
    { id: 'entropy', label: 'Entropía (H)', sublabel: 'Shannon / Ruido del Canal', icon: '📉', x: 780, y: 130, color: '#ff4d4d' },
    { id: 'sensors', label: 'Red de Sensores', sublabel: 'Diagnóstico & Telemetría', icon: '📡', x: 770, y: 350, color: '#a855f7' },
    { id: 'servomechanism', label: 'Servomecanismo', sublabel: 'Comparador Homeostático', icon: '🎯', x: 470, y: 410, color: '#38bdf8' },
    { id: 'viability', label: 'Viabilidad Social', sublabel: 'Salud de la Estación', icon: '🏙️', x: 160, y: 340, color: '#10b981' }
  ];

  private links: EdgeLink[] = [
    // Bucle B1: Homeostasis (Equilibrador)
    { from: 'temperature', to: 'servomechanism', polarity: '+', loop: 'B1', hasDelay: true, curvature: 0.12 },
    { from: 'servomechanism', to: 'temperature', polarity: '-', loop: 'B1', hasDelay: true, curvature: -0.18 },

    // Bucle R1: Runaway Entrópico (Reforzador Destructivo)
    { from: 'temperature', to: 'entropy', polarity: '+', loop: 'R1', hasDelay: false, curvature: 0.14 },
    { from: 'entropy', to: 'sensors', polarity: '-', loop: 'R1', hasDelay: false, curvature: 0.08 },
    { from: 'sensors', to: 'servomechanism', polarity: '+', loop: 'R1', hasDelay: true, curvature: -0.1 },
    { from: 'servomechanism', to: 'energy', polarity: '+', loop: 'R1', hasDelay: false, curvature: -0.14 },
    { from: 'energy', to: 'temperature', polarity: '+', loop: 'R1', hasDelay: false, curvature: 0.16 },

    // Bucle R2: Sinergia de Viabilidad
    { from: 'servomechanism', to: 'viability', polarity: '+', loop: 'R2', hasDelay: false, curvature: 0.1 },
    { from: 'viability', to: 'energy', polarity: '+', loop: 'R2', hasDelay: false, curvature: 0.14 }
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
    const b1Circle = svg.querySelector('#loop-b1 circle');
    const r1Circle = svg.querySelector('#loop-r1 circle');

    if (b1Circle) {
      if (feedback.balancingActive) {
        b1Circle.setAttribute('stroke', '#00f2fe');
        b1Circle.setAttribute('stroke-width', '3.5');
        b1Circle.setAttribute('filter', 'url(#glow-cyan)');
      } else {
        b1Circle.setAttribute('stroke', '#38bdf8');
        b1Circle.setAttribute('stroke-width', '2');
        b1Circle.removeAttribute('filter');
      }
    }

    if (r1Circle) {
      if (feedback.reinforcingActive || variables.entropy > 60) {
        r1Circle.setAttribute('stroke', '#ff4d4d');
        r1Circle.setAttribute('stroke-width', '4');
        r1Circle.setAttribute('filter', 'url(#glow-red)');
      } else {
        r1Circle.setAttribute('stroke', '#64748b');
        r1Circle.setAttribute('stroke-width', '2');
        r1Circle.removeAttribute('filter');
      }
    }
  }

  public render() {
    this.container.innerHTML = `
      <div class="cld-wrapper">
        <div class="cld-header">
          <div class="cld-title">
            <span class="icon">🕸️</span> MAPA DINÁMICO DE BUCLES CAUSALES (CLD EN VIVO)
          </div>
          <div class="cld-legend">
            <span class="badge loop-b"><span class="dot"></span> B1: Homeostasis (Equilibrador)</span>
            <span class="badge loop-r"><span class="dot"></span> R1: Runaway Entrópico (Reforzador)</span>
            <span class="badge loop-delay"><span class="delay-icon">//</span> Retardo Temporal (Delay)</span>
            <button id="btn-toggle-cld-focus" class="btn-cld-focus" title="Expandir/Ajustar área de mapa">
              ⛶ ENFOQUE TOTAL
            </button>
          </div>
        </div>
        
        <svg viewBox="0 0 940 480" preserveAspectRatio="xMidYMid meet" class="cld-svg">
          <defs>
            <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-red" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-node" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <marker id="arrow-cyan" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 1.5 L 11 6 L 0 10.5 z" fill="#00f2fe" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 1.5 L 11 6 L 0 10.5 z" fill="#ff4d4d" />
            </marker>
            <marker id="arrow-green" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 1.5 L 11 6 L 0 10.5 z" fill="#10b981" />
            </marker>
          </defs>

          <!-- Arc links between nodes -->
          <g class="cld-links">
            ${this.renderLinks()}
          </g>

          <!-- Central loop identifiers -->
          <!-- Bucle B1: Homeostasis -->
          <g id="loop-b1" class="loop-badge" transform="translate(350, 240)">
            <circle cx="0" cy="0" r="28" fill="#0b1120" stroke="#00f2fe" stroke-width="2" stroke-dasharray="4 2" />
            <text x="0" y="-3" text-anchor="middle" fill="#00f2fe" font-size="13" font-weight="bold">B1</text>
            <text x="0" y="13" text-anchor="middle" fill="#94a3b8" font-size="9">Equilibrio</text>
          </g>

          <!-- Bucle R1: Runaway Entrópico -->
          <g id="loop-r1" class="loop-badge" transform="translate(590, 230)">
            <circle cx="0" cy="0" r="28" fill="#0b1120" stroke="#64748b" stroke-width="2" stroke-dasharray="4 2" />
            <text x="0" y="-3" text-anchor="middle" fill="#ff4d4d" font-size="13" font-weight="bold">R1</text>
            <text x="0" y="13" text-anchor="middle" fill="#94a3b8" font-size="9">Cascada</text>
          </g>

          <!-- Nodes -->
          <g class="cld-nodes">
            ${this.renderNodes()}
          </g>
        </svg>

        <div class="cld-hint">
          💡 <strong>Pensamiento Sistémico:</strong> Las flechas <strong>(+)</strong> representan relación directa (aumenta A → aumenta B). Las flechas <strong>(-)</strong> representan relación inversa. Las marcas <strong>//</strong> indican <strong>retardos temporales</strong>. Si atacas los síntomas sin respetar el retardo, alimentarás el bucle de cascada destructivo <strong>R1</strong>.
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
        const strokeColor = isRed ? '#ff4d4d' : link.loop === 'R2' ? '#10b981' : '#00f2fe';
        const marker = isRed ? 'url(#arrow-red)' : link.loop === 'R2' ? 'url(#arrow-green)' : 'url(#arrow-cyan)';

        return `
          <g class="link-group">
            <path d="M ${fromNode.x} ${fromNode.y} Q ${midX} ${midY} ${toNode.x} ${toNode.y}" 
                  fill="none" 
                  stroke="${strokeColor}" 
                  stroke-width="2.2" 
                  stroke-dasharray="${link.hasDelay ? '5 3' : 'none'}"
                  opacity="0.88"
                  marker-end="${marker}" />
            
            <!-- Polarity indicator badge -->
            <circle cx="${midX}" cy="${midY}" r="11" fill="#070b13" stroke="${strokeColor}" stroke-width="1.4" />
            <text x="${midX}" y="${midY + 4}" text-anchor="middle" fill="${strokeColor}" font-size="12" font-weight="bold">
              ${link.polarity}
            </text>

            ${
              link.hasDelay
                ? `
              <g transform="translate(${midX + 15}, ${midY - 8})">
                <rect x="-3" y="-9" width="38" height="15" rx="3" fill="#0f172a" stroke="#f59e0b" stroke-width="1"/>
                <text x="16" y="2" text-anchor="middle" fill="#f59e0b" font-size="9" font-family="monospace" font-weight="bold">// DELAY</text>
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
    return this.nodes
      .map(node => {
        return `
        <g class="node-group" transform="translate(${node.x}, ${node.y})" style="cursor: pointer;">
          <circle cx="0" cy="0" r="38" fill="#0f172a" stroke="${node.color}" stroke-width="2.5" filter="url(#glow-node)" />
          <circle cx="0" cy="0" r="34" fill="#131e32" />
          <text x="0" y="-12" text-anchor="middle" font-size="16">${node.icon}</text>
          <text x="0" y="4" text-anchor="middle" fill="#ffffff" font-size="10.5" font-weight="bold" font-family="'Inter', sans-serif">${node.label}</text>
          <text x="0" y="17" text-anchor="middle" fill="${node.color}" font-size="8.5" font-family="'JetBrains Mono', monospace">${node.sublabel}</text>
        </g>
      `;
      })
      .join('');
  }
}
