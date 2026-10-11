import { CyberneticEngine } from '../core/CyberneticEngine';
import { CausalDiagram } from './CausalDiagram';
import { Oscilloscope } from './Oscilloscope';
import { CYBERNETIC_POLICIES } from '../core/Policies';
import { sound } from '../audio/SoundEffects';
import confetti from 'canvas-confetti';

export class DashboardRenderer {
  private engine: CyberneticEngine;
  private causalDiagram: CausalDiagram;
  private oscilloscope: Oscilloscope;
  private selectedPoliciesThisCycle: string[] = [];
  private tournamentTimerInterval: number | null = null;

  constructor(engine: CyberneticEngine, causalDiagram: CausalDiagram, oscilloscope: Oscilloscope) {
    this.engine = engine;
    this.causalDiagram = causalDiagram;
    this.oscilloscope = oscilloscope;
    this.bindEvents();
    this.render();
  }

  private bindEvents() {
    // Botón avanzar ciclo
    const btnAdvance = document.getElementById('btn-advance-cycle');
    btnAdvance?.addEventListener('click', () => this.handleAdvanceCycle());

    // Botón reiniciar partida
    const btnRestart = document.getElementById('btn-restart-game');
    btnRestart?.addEventListener('click', () => this.restartGame());

    // Selector de modo
    const modeSelect = document.getElementById('mode-selector') as HTMLSelectElement;
    modeSelect?.addEventListener('change', (e) => {
      const mode = (e.target as HTMLSelectElement).value;
      if (mode.startsWith('scenario_')) {
        this.engine.startScenario(mode);
      } else if (mode === 'tournament') {
        this.engine.startTournament(2);
      } else {
        this.engine.startSandbox();
      }
      this.selectedPoliciesThisCycle = [];
      this.oscilloscope.reset();
      this.render();
    });

    // Botón cerrar modal
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      });
    });
  }

  public handleAdvanceCycle() {
    sound.playClick();
    const result = this.engine.advanceCycle(this.selectedPoliciesThisCycle);
    this.selectedPoliciesThisCycle = [];

    // Sonidos reactivos
    if (result.resolvedDelays.length > 0) {
      sound.playDelayResolved();
    }
    if (this.engine.variables.entropy > 65) {
      sound.playEntropyAlert();
    } else {
      sound.playBalancingLoop();
    }

    // Actualizar osciloscopio
    this.oscilloscope.addSample(this.engine.variables.homeostasis, this.engine.variables.entropy);

    // Actualizar diagrama causal
    const lastFeedback = this.engine.history.length > 0
      ? this.engine.history[this.engine.history.length - 1].feedbackState
      : { balancingActive: true, reinforcingActive: false };

    this.causalDiagram.update(this.engine.variables, lastFeedback);

    // Verificar Victoria o Derrota
    if (result.isWin) {
      sound.playVictory();
      this.triggerConfetti();
      this.showAuditModal(true);
    } else if (result.isOver) {
      sound.playCollapse();
      this.showAuditModal(false);
    }

    this.render();
  }

  public handlePolicyClick(policyId: string) {
    sound.playClick();
    const success = this.engine.executePolicy(policyId);
    if (success) {
      sound.playPolicyActivated();
      this.selectedPoliciesThisCycle.push(policyId);
      this.render();
    }
  }

  public render() {
    const vars = this.engine.getTelemetryReadings();

    // 1. Telemetría Principal
    this.updateGauge('homeostasis', vars.homeostasis, '%');
    this.updateGauge('entropy', vars.entropy, '%');
    this.updateGauge('energy', vars.energy, ' u');
    this.updateGauge('viability', vars.viability, '%');

    // Temperatura
    const tempEl = document.getElementById('val-temp');
    if (tempEl) {
      tempEl.textContent = `${vars.temperature.toFixed(1)}°C`;
      tempEl.style.color = vars.temperature > 30 ? '#ff4d4d' : vars.temperature < 19 ? '#38bdf8' : '#cbd5e1';
    }

    // Ruido de sensores (Shannon)
    const noiseEl = document.getElementById('val-noise');
    if (noiseEl) {
      noiseEl.textContent = `${vars.sensorNoise}%`;
      noiseEl.style.color = vars.sensorNoise > 30 ? '#ff4d4d' : '#10b981';
    }

    // Ashby Box
    const ashbyVc = document.getElementById('ashby-vc');
    const ashbyVe = document.getElementById('ashby-ve');
    const ashbyPill = document.getElementById('ashby-pill');

    if (ashbyVc) ashbyVc.textContent = `${vars.controlVariety}`;
    if (ashbyVe) ashbyVe.textContent = `${vars.environmentVariety}`;
    if (ashbyPill) {
      if (vars.controlVariety >= vars.environmentVariety) {
        ashbyPill.className = 'ashby-law-pill ok';
        ashbyPill.textContent = 'LEY DE ASHBY SATISFECHA (Vc ≥ Ve)';
      } else {
        const def = vars.environmentVariety - vars.controlVariety;
        ashbyPill.className = 'ashby-law-pill alert';
        ashbyPill.textContent = `¡DÉFICIT DE VARIEDAD (-${def})!`;
      }
    }

    // 2. Banner de Ciclo
    const cycleNum = document.getElementById('current-cycle-num');
    const cycleMax = document.getElementById('max-cycle-num');
    if (cycleNum) cycleNum.textContent = `${this.engine.currentCycle}`;
    if (cycleMax) cycleMax.textContent = `${this.engine.maxCycles}`;

    // 3. Cola de Retardos (Delays)
    const delayContainer = document.getElementById('delay-queue-list');
    if (delayContainer) {
      if (this.engine.delayedQueue.length === 0) {
        delayContainer.innerHTML = '<div style="color: #64748b; font-size: 11px;">Sin acciones pendientes de retardo.</div>';
      } else {
        delayContainer.innerHTML = this.engine.delayedQueue.map(d => `
          <div class="delay-item">
            <span><strong>${d.policyName}</strong></span>
            <span style="color: #f59e0b; font-family: monospace;">⏳ ${d.remainingCycles} ciclo(s) restantes</span>
          </div>
        `).join('');
      }
    }

    // 4. Catálogo de Políticas
    const policiesList = document.getElementById('policies-grid');
    if (policiesList) {
      policiesList.innerHTML = CYBERNETIC_POLICIES.map(p => {
        const canAfford = p.canExecute(this.engine.variables);
        return `
          <div class="policy-card-item ${canAfford ? '' : 'disabled'}" data-policy-id="${p.id}">
            <div class="policy-card-header">
              <div class="policy-title">
                <span>${p.icon}</span> <span>${p.title}</span>
              </div>
              <div class="policy-badges">
                <span class="badge-cost">-${p.energyCost} E</span>
                <span class="badge-delay">${p.delayCycles === 0 ? 'Inmediato' : `Delay: ${p.delayCycles}`}</span>
              </div>
            </div>
            <div class="policy-desc">${p.description}</div>
          </div>
        `;
      }).join('');

      // Add click handlers
      policiesList.querySelectorAll('.policy-card-item').forEach(card => {
        card.addEventListener('click', (e) => {
          const id = (e.currentTarget as HTMLElement).getAttribute('data-policy-id');
          if (id) this.handlePolicyClick(id);
        });
      });
    }

    // 5. Evento Activo
    const eventBox = document.getElementById('active-event-box');
    if (eventBox) {
      if (this.engine.activeEvent) {
        eventBox.innerHTML = `
          <div class="event-title">
            <span>⚡</span> ${this.engine.activeEvent.title} (Variedad: ${this.engine.activeEvent.variety})
          </div>
          <div class="event-desc">${this.engine.activeEvent.description}</div>
          <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">
            <em>Arquetipo TGS: ${this.engine.activeEvent.systemicArchetype}</em>
          </div>
        `;
      } else {
        eventBox.innerHTML = `
          <div class="event-title" style="color: #00f2fe;">
            <span>🛡️</span> Estado Inicial: Sin Perturbación Exterior
          </div>
          <div class="event-desc">Presiona "AVANZAR CICLO" para procesar el impacto del entorno espacial.</div>
        `;
      }
    }

    // 6. Terminal Log
    const logBox = document.getElementById('terminal-log-stream');
    if (logBox) {
      logBox.innerHTML = this.engine.logMessages.map(m => `
        <div class="log-line ${m.type}">
          [C${m.cycle}] ${m.text}
        </div>
      `).join('');
    }
  }

  private updateGauge(id: string, value: number, unit: string) {
    const valEl = document.getElementById(`val-${id}`);
    const fillEl = document.getElementById(`gauge-${id}`);

    if (valEl) valEl.textContent = `${value}${unit}`;
    if (fillEl) fillEl.style.width = `${Math.min(100, Math.max(0, value))}%`;
  }

  public showAuditModal(isWin: boolean) {
    const report = this.engine.generateAuditReport();
    const modal = document.getElementById('audit-report-modal');
    if (!modal) return;

    const modalTitle = document.getElementById('audit-modal-title');
    const badgeEl = document.getElementById('audit-badge');
    const scoreEl = document.getElementById('audit-score');
    const rankEl = document.getElementById('audit-rank');
    const diagList = document.getElementById('audit-diagnostics-list');
    const qaList = document.getElementById('audit-qa-list');

    if (modalTitle) {
      modalTitle.textContent = isWin ? '🎉 REPORTE DE AUDITORÍA: HOMEOSTASIS ALCANZADA' : '⚠️ REPORTE DE AUDITORÍA: COLAPSO SISTÉMICO';
      modalTitle.style.color = isWin ? '#00f2fe' : '#ff4d4d';
    }

    if (badgeEl) badgeEl.textContent = report.rankBadge;
    if (scoreEl) scoreEl.textContent = `${report.score} / 1000`;
    if (rankEl) rankEl.textContent = report.rankTitle;

    const avgEl = document.getElementById('audit-avg-homeo');
    const viabEl = document.getElementById('audit-final-viab');
    const negEl = document.getElementById('audit-negentropy');

    if (avgEl) avgEl.textContent = `${report.averageHomeostasis}%`;
    if (viabEl) viabEl.textContent = `${report.finalViability}%`;
    if (negEl) negEl.textContent = `${report.totalNegentropy}`;

    if (diagList) {
      diagList.innerHTML = report.diagnostics.map(d => `<li style="margin-bottom: 6px;">${d}</li>`).join('');
    }

    if (qaList) {
      qaList.innerHTML = report.teacherAnalysisQuestions.map(qa => `
        <div class="qa-card">
          <div class="qa-concept">[CONCEPTO TGS: ${qa.concept}]</div>
          <div class="qa-q">❓ ${qa.question}</div>
          <div class="qa-a"><strong>Respuesta sugerida:</strong> ${qa.suggestedAnswer}</div>
        </div>
      `).join('');
    }

    modal.classList.add('active');
  }

  public restartGame() {
    this.engine.startScenario('scenario_1_pendulum');
    this.selectedPoliciesThisCycle = [];
    this.oscilloscope.reset();
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    this.render();
  }

  private triggerConfetti() {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored if confetti fails
    }
  }
}
