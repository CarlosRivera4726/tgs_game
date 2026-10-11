import type { SystemVariables } from '../core/Types';

interface NodePosition {
  id: string;
  label: string;
  sublabel: string;
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
    { id: 'energy', label: 'Energía / Potencia', sublabel: 'Flujo Termodinámico', x: 120, y: 80, color: '#00f2fe' },
    { id: 'temperature', label: 'Temperatura', sublabel: 'Calor Residual', x: 340, y: 60, color: '#f5a623' },
    { id: 'entropy', label: 'Entropía (H)', sublabel: 'Shannon / Ruido', x: 560, y: 120, color: '#ff4d4d' },
    { id: 'sensors', label: 'Red de Sensores', sublabel: 'Canal de Diagnóstico', x: 540, y: 280, color: '#a855f7' },
    { id: 'servomechanism', label: 'Servomecanismo', sublabel: 'Comparador Homeostático', x: 300, y: 320, color: '#38bdf8' },
    { id: 'viability', label: 'Viabilidad Social', sublabel: 'Salud de la Estación', x: 100, y: 240, color: '#10b981' }
  ];

  private links: EdgeLink[] = [
    // Bucle B1: Homeostasis (Equilibrador)
    { from: 'temperature', to: 'servomechanism', polarity: '+', loop: 'B1', hasDelay: true, curvature: 0.1 },
    { from: 'servomechanism', to: 'temperature', polarity: '-', loop: 'B1', hasDelay: true, curvature: -0.2 },

    // Bucle R1: Runaway Entrópico (Reforzador Destructivo)
    { from: 'temperature', to: 'entropy', polarity: '+', loop: 'R1', hasDelay: false, curvature: 0.15 },
    { from: 'entropy', to: 'sensors', polarity: '-', loop: 'R1', hasDelay: false, curvature: 0.1 },
    { from: 'sensors', to: 'servomechanism', polarity: '+', loop: 'R1', hasDelay: true, curvature: -0.1 },
    { from: 'servomechanism', to: 'energy', polarity: '+', loop: 'R1', hasDelay: false, curvature: -0.15 },
    { from: 'energy', to: 'temperature', polarity: '+', loop: 'R1', hasDelay: false, curvature: 0.2 },

    // Bucle R2: Sinergia de Viabilidad
    { from: 'servomechanism', to: 'viability', polarity: '+', loop: 'R2', hasDelay: false, curvature: 0.1 },
    { from: 'viability', to: 'energy', polarity: '+', loop: 'R2', hasDelay: false, curvature: 0.15 }
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
    const b1Circle = svg.querySelector('#loop-b1');
    const r1Circle = svg.querySelector('#loop-r1');

    if (b1Circle) {
      if (feedback.balancingActive) {
        b1Circle.setAttribute('stroke', '#00f2fe');
        b1Circle.setAttribute('stroke-width', '3');
        b1Circle.setAttribute('filter', 'url(#glow-cyan)');
      } else {
        b1Circle.setAttribute('stroke', '#38bdf8');
        b1Circle.setAttribute('stroke-width', '1.5');
        b1Circle.removeAttribute('filter');
      }
    }

    if (r1Circle) {
      if (feedback.reinforcingActive || variables.entropy > 60) {
        r1Circle.setAttribute('stroke', '#ff4d4d');
        r1Circle.setAttribute('stroke-width', '3.5');
        r1Circle.setAttribute('filter', 'url(#glow-red)');
      } else {
        r1Circle.setAttribute('stroke', '#64748b');
        r1Circle.setAttribute('stroke-width', '1.5');
        r1Circle.removeAttribute('filter');
      }
    }
  }

  public render() {
    this.container.innerHTML = `
      <div class="cld-wrapper">
        <div class="cld-header">
          <div class="cld-title">
            <span class="icon">🕸️</span> DIAGRAMA DE BUCLES CAUSALES (CLD EN VIVO)
          </div>
          <div class="cld-legend">
            <span class="badge loop-b"><span class="dot"></span> B1: Homeostasis (Equilibrador)</span>
            <span class="badge loop-r"><span class="dot"></span> R1: Runaway Entrópico (Reforzador)</span>
            <span class="badge loop-delay"><span class="delay-icon">//</span> Retardo Temporal (Delay)</span>
          </div>
        </div>
        
        <svg viewBox="0 0 700 400" preserveAspectRatio="xMidYMid meet" class="cld-svg">
          <defs>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <marker id="arrow-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#00f2fe" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#ff4d4d" />
            </marker>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981" />
            </marker>
          </defs>

          <!-- Arc links between nodes -->
          <g class="cld-links">
            ${this.renderLinks()}
          </g>

          <!-- Central loop identifiers -->
          <!-- Bucle B1: Homeostasis -->
          <g id="loop-b1" class="loop-badge" transform="translate(250, 190)">
            <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#00f2fe" stroke-width="2" stroke-dasharray="3 2" />
            <text x="0" y="-2" text-anchor="middle" fill="#00f2fe" font-size="11" font-weight="bold">B1</text>
            <text x="0" y="11" text-anchor="middle" fill="#94a3b8" font-size="8">Equilibrio</text>
          </g>

          <!-- Bucle R1: Runaway Entrópico -->
          <g id="loop-r1" class="loop-badge" transform="translate(430, 180)">
            <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#64748b" stroke-width="2" stroke-dasharray="3 2" />
            <text x="0" y="-2" text-anchor="middle" fill="#ff4d4d" font-size="11" font-weight="bold">R1</text>
            <text x="0" y="11" text-anchor="middle" fill="#94a3b8" font-size="8">Cascada</text>
          </g>

          <!-- Nodes -->
          <g class="cld-nodes">
            ${this.renderNodes()}
          </g>
        </svg>

        <div class="cld-hint">
          💡 <strong>Pensamiento Sistémico:</strong> No ataques el síntoma aislado. Observa los retardos (<strong>//</strong>) y mantén activo el bucle equilibrador <strong>B1</strong> para neutralizar la cascada entrópica <strong>R1</strong>.
        </div>
      </div>
    `;
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
                  stroke-width="1.8" 
                  stroke-dasharray="${link.hasDelay ? '4 2' : 'none'}"
                  opacity="0.85"
                  marker-end="${marker}" />
            
            <!-- Polarity indicator -->
            <circle cx="${midX}" cy="${midY}" r="9" fill="#0b1120" stroke="${strokeColor}" stroke-width="1" />
            <text x="${midX}" y="${midY + 3.5}" text-anchor="middle" fill="${strokeColor}" font-size="10" font-weight="bold">
              ${link.polarity}
            </text>

            ${
              link.hasDelay
                ? `
              <text x="${midX + 12}" y="${midY - 4}" fill="#f59e0b" font-size="10" font-weight="bold">//</text>
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
        <g class="node-group" transform="translate(${node.x}, ${node.y})">
          <circle cx="0" cy="0" r="32" fill="#0f172a" stroke="${node.color}" stroke-width="2.2" />
          <circle cx="0" cy="0" r="28" fill="#1e293b" opacity="0.6" />
          <text x="0" y="-4" text-anchor="middle" fill="#ffffff" font-size="9.5" font-weight="bold">${node.label}</text>
          <text x="0" y="10" text-anchor="middle" fill="${node.color}" font-size="7.5">${node.sublabel}</text>
        </g>
      `;
      })
      .join('');
  }
}
