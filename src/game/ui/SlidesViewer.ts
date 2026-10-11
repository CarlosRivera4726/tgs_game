export interface SlideData {
  number: number;
  title: string;
  subtitle: string;
  bullets: string[];
  systemicHighlight: string;
  speakerNotes: string;
}

export const PRESENTATION_SLIDES: SlideData[] = [
  {
    number: 1,
    title: 'CYBER-SYN: Protocolo Homeostasis',
    subtitle: 'Definición del Macro-Sistema, Propósito y Entorno',
    bullets: [
      '<strong>Sistema Representado:</strong> Biópolis Orbital Sintrópica Kepler-42 (Sistema abierto, complejo y dinámico).',
      '<strong>Propósito Teleológico:</strong> Garantizar la supervivencia humana y viabilidad estructural manteniendo la homeostasis frente a perturbaciones cósmicas.',
      '<strong>Frontera e Intercambio:</strong> Casco permeable que intercambia flujos continuos de energía, materia e información.',
      '<strong>4 Subsistemas Acoplados:</strong> Energético (Termodinámica), Comunicación (Shannon), Control (Cibernética de Wiener) y Social (Viabilidad de Stafford Beer).'
    ],
    systemicHighlight: 'Inspirado en el Proyecto Cybersyn de Stafford Beer y la Teoría General de Sistemas de Ludwig von Bertalanffy.',
    speakerNotes: 'Iniciar saludando al jurado. Resaltar que el sistema no es estático ni cerrado: es un sistema abierto en constante intercambio. Explicar los cuatro subsistemas acoplados y el propósito central: sostener la homeostasis frente al cosmos.'
  },
  {
    number: 2,
    title: 'Fundamentación Teórica del Segundo Corte',
    subtitle: 'Cibernética Obligatoria, Entropía de Shannon y Teoría de la Decisión',
    bullets: [
      '<strong>Cibernética (Obligatorio Central):</strong> Servomecanismos con ciclo cerrado (Sensor → Comparador → Actuador). Bucles equilibradores (Balancing) y reforzadores (Reinforcing).',
      '<strong>Ley de Variedad Requerida de Ashby:</strong> <em>"Solo la variedad puede absorber variedad"</em>. Si Vc < Ve, la estación sufre daño estructural.',
      '<strong>Entropía en la Información (Shannon):</strong> Pérdida de certidumbre en las señales por ruido blanco electromagnético (H = -∑ p log₂ p).',
      '<strong>Negentropía Activa:</strong> Consumo de energía computacional para restaurar el orden informacional y disipar la ceguera diagnóstica.',
      '<strong>Teoría de la Decisión (Herbert Simon):</strong> Racionalidad acotada bajo incertidumbre con efectos secundarios no lineales.'
    ],
    systemicHighlight: 'La teoría no es trivia decorativa: las ecuaciones del simulador implementan directamente estos conceptos.',
    speakerNotes: 'Enfatizar cómo se cumple el requisito obligatorio de Cibernética: servomecanismos reales y Ley de Ashby. Explicar que la entropía de Shannon genera ruido en los instrumentos y que la negentropía es la única forma de restaurar la certidumbre.'
  },
  {
    number: 3,
    title: 'Arquitectura Dinámica y Bucles Causales (CLD)',
    subtitle: 'La Interconexión No-Lineal y el Desafío de los Retardos (Delays)',
    bullets: [
      '<strong>Bucle B1 [Homeostasis]:</strong> El servomecanismo compara el estado con el setpoint (85%) y amortigua las desviaciones térmicas y energéticas.',
      '<strong>Bucle B2 [Negentropía]:</strong> Inyección de orden para depurar canales y devolver fidelidad a las señales de los sensores.',
      '<strong>Bucle R1 [Runaway Entrópico]:</strong> Exceso térmico → Genera ruido informacional → Descalibra los actuadores → Provoca mayor sobrecalentamiento.',
      '<strong>El Factor Decisivo: Retardos Temporales (//):</strong> Las políticas tardan 1 o 2 ciclos en materializarse. La impaciencia genera sobre-oscilación destructiva.'
    ],
    systemicHighlight: 'El pensamiento lineal sobre-corrige ante el delay y destruye el sistema; el pensamiento sistémico anticipa la inercia.',
    speakerNotes: 'Mostrar el Diagrama de Bucles Causales en vivo. Explicar cómo el bucle reforzador R1 puede destruir la estación si la temperatura supera los 30°C. Resaltar los retardos (delays) como la mayor trampa para la intuición lineal.'
  },
  {
    number: 4,
    title: 'Reglas, Modalidad y Dinámica del Torneo',
    subtitle: 'Partidas de 15 Minutos, 1 a 4 Jugadores y Sistema de Puntuación',
    bullets: [
      '<strong>Modalidad:</strong> Simulación Estratégica Digital (Vite + TypeScript), accesible en navegador web y lista para Netlify.',
      '<strong>Duración Torneo:</strong> Calibrado exactamente a 15 minutos (15 ciclos operativos de toma de decisiones).',
      '<strong>Jugadores (1 a 4):</strong> Modo Solitario (Misiones Didácticas) y Modo Torneo con pase de mando entre roles (Director de Variedad, Operador de Entropía, Ingeniero de Feedback).',
      '<strong>Puntaje de Eficiencia Cibernética (PEC [0-1000 pts]):</strong> Evalúa estabilidad homeostática, viabilidad estructural y penaliza fuertemente la varianza de oscilación.'
    ],
    systemicHighlight: 'Condición de Victoria: Viabilidad ≥ 50%, Entropía ≤ 70% y PEC ≥ 650 pts sin colapsar por Runaway Loop.',
    speakerNotes: 'Explicar que el juego cumple todos los requisitos del torneo: partida de 15 minutos, apto para varios jugadores con rotación de roles, y una fórmula de puntuación matemática que premia la estabilidad y castiga el descontrol oscilatorio.'
  },
  {
    number: 5,
    title: 'La Regla de Oro y Pensamiento Sistémico',
    subtitle: 'El objetivo no es diseñar un juego sobre TGS, sino uno que haga pensar sistémicamente',
    bullets: [
      '<strong>Pensamiento Lineal (Fracaso Seguro):</strong> Intentar resolver la crisis empujando al máximo el síntoma evidente (genera rebote térmico y colapso por retardo).',
      '<strong>Pensamiento Sistémico (Éxito en CYBER-SYN):</strong> Identificar la estructura causal profunda, intervenir los puntos de apalancamiento (Donella Meadows), moderar la ganancia y absorber la variedad de Ashby.',
      '<strong>Auditoría Post-Partida:</strong> El simulador analiza las decisiones del equipo y formula preguntas de reflexión académica para debatir con el docente.',
      '<strong>Demostración Interactiva en Vivo:</strong> Procederemos a correr un ciclo de prueba en el simulador web.'
    ],
    systemicHighlight: 'Demostrado: Quien juega de manera lineal pierde en el ciclo 6; quien piensa en bucles y variedad alcanza la Homeostasis.',
    speakerNotes: 'Cerrar con broche de oro citando la Regla de Oro del PDF. Demostrar cómo el juego entrena el pensamiento sistémico real. Dar paso inmediato a la demostración en vivo del simulador.'
  }
];

export class SlidesViewer {
  private currentSlideIndex: number = 0;
  private container: HTMLElement;
  private showNotes: boolean = false;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) {
      throw new Error(`Element #${containerId} not found`);
    }
    this.container = el;
    this.render();
  }

  public nextSlide() {
    if (this.currentSlideIndex < PRESENTATION_SLIDES.length - 1) {
      this.currentSlideIndex++;
      this.render();
    }
  }

  public prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.render();
    }
  }

  public goToSlide(index: number) {
    if (index >= 0 && index < PRESENTATION_SLIDES.length) {
      this.currentSlideIndex = index;
      this.render();
    }
  }

  public toggleSpeakerNotes() {
    this.showNotes = !this.showNotes;
    this.render();
  }

  public render() {
    const slide = PRESENTATION_SLIDES[this.currentSlideIndex];
    const total = PRESENTATION_SLIDES.length;

    this.container.innerHTML = `
      <div class="slides-deck">
        <div class="slides-controls-bar">
          <div class="slides-meta">
            <span class="badge-slide">DIAPOSITIVA ${slide.number} DE ${total}</span>
            <span class="slides-timer">Sustentación Oficial Torneo TGS</span>
          </div>
          <div class="slides-nav-buttons">
            <button id="btn-prev-slide" class="btn-slide-nav" ${this.currentSlideIndex === 0 ? 'disabled' : ''}>
              ◀ Anterior
            </button>
            <span class="slide-dots">
              ${PRESENTATION_SLIDES.map(
                (s, idx) => `
                <button class="dot-btn ${idx === this.currentSlideIndex ? 'active' : ''}" data-index="${idx}">
                  ${s.number}
                </button>
              `
              ).join('')}
            </span>
            <button id="btn-next-slide" class="btn-slide-nav" ${this.currentSlideIndex === total - 1 ? 'disabled' : ''}>
              Siguiente ▶
            </button>
            <button id="btn-toggle-notes" class="btn-slide-notes ${this.showNotes ? 'active' : ''}">
              🎙️ ${this.showNotes ? 'Ocultar Guion' : 'Ver Guion del Expositor'}
            </button>
          </div>
        </div>

        <div class="slide-canvas">
          <div class="slide-header">
            <div class="slide-topic-badge">TEORÍA GENERAL DE SISTEMAS | PARCIAL SEGUNDO CORTE</div>
            <h2 class="slide-main-title">${slide.title}</h2>
            <div class="slide-subtitle">${slide.subtitle}</div>
          </div>

          <div class="slide-body">
            <ul class="slide-bullets-list">
              ${slide.bullets.map(b => `<li class="slide-bullet">${b}</li>`).join('')}
            </ul>

            <div class="slide-highlight-card">
              <span class="highlight-icon">⚡</span>
              <div class="highlight-text">${slide.systemicHighlight}</div>
            </div>
          </div>

          ${
            this.showNotes
              ? `
            <div class="speaker-notes-drawer">
              <div class="notes-header">
                <strong>🎙️ GUION DEL EXPOSITOR (SPEECH SUGERIDO - 2 MINUTOS):</strong>
              </div>
              <div class="notes-body">
                "${slide.speakerNotes}"
              </div>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;

    // Bind event listeners
    this.container.querySelector('#btn-prev-slide')?.addEventListener('click', () => this.prevSlide());
    this.container.querySelector('#btn-next-slide')?.addEventListener('click', () => this.nextSlide());
    this.container.querySelector('#btn-toggle-notes')?.addEventListener('click', () => this.toggleSpeakerNotes());

    this.container.querySelectorAll('.dot-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0', 10);
        this.goToSlide(idx);
      });
    });
  }
}
