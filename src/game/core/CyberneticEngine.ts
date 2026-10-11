import type {
  SystemVariables,
  DelayedAction,
  EnvironmentPerturbation,
  CycleHistoryEntry,
  GameAuditReport,
  MissionScenario,
  TournamentConfig
} from './Types';
import { CYBERNETIC_POLICIES } from './Policies';
import { ENVIRONMENT_EVENTS } from './Events';
import { DIDACTIC_SCENARIOS } from './Scenarios';

export class CyberneticEngine {
  public variables: SystemVariables;
  public delayedQueue: DelayedAction[] = [];
  public currentCycle: number = 1;
  public maxCycles: number = 15;
  public history: CycleHistoryEntry[] = [];
  public currentScenario: MissionScenario | null = null;
  public tournamentConfig: TournamentConfig | null = null;
  public activeEvent: EnvironmentPerturbation | null = null;
  public isGameOver: boolean = false;
  public isVictory: boolean = false;
  public logMessages: { cycle: number; text: string; type: 'info' | 'warn' | 'danger' | 'success' }[] = [];

  constructor() {
    this.variables = this.getDefaultVariables();
  }

  public getDefaultVariables(): SystemVariables {
    return {
      homeostasis: 65,
      entropy: 30,
      energy: 70,
      viability: 85,
      temperature: 22,
      sensorNoise: 5,
      controlVariety: 2,
      environmentVariety: 2,
      accumulatedNegentropy: 0,
      servomechanismGain: 1.0
    };
  }

  public startScenario(scenarioId: string) {
    const scenario = DIDACTIC_SCENARIOS.find(s => s.id === scenarioId) || DIDACTIC_SCENARIOS[0];
    this.currentScenario = scenario;
    this.tournamentConfig = null;
    this.currentCycle = 1;
    this.maxCycles = scenario.targetCycles;
    this.delayedQueue = [];
    this.history = [];
    this.isGameOver = false;
    this.isVictory = false;
    this.logMessages = [];

    this.variables = {
      ...this.getDefaultVariables(),
      ...scenario.initialVars
    };

    this.addLog(
      `Iniciando ${scenario.title}. Objetivo: Mantener la estabilidad durante ${scenario.targetCycles} ciclos.`,
      'info'
    );
  }

  public startTournament(playerCount: number = 2) {
    this.currentScenario = null;
    this.currentCycle = 1;
    this.maxCycles = 15;
    this.delayedQueue = [];
    this.history = [];
    this.isGameOver = false;
    this.isVictory = false;
    this.logMessages = [];
    this.variables = this.getDefaultVariables();

    const roles: ('Director de Variedad' | 'Operador de Entropía' | 'Ingeniero de Feedback')[] = [
      'Director de Variedad',
      'Operador de Entropía',
      'Ingeniero de Feedback'
    ];

    const players = Array.from({ length: playerCount }, (_, idx) => ({
      id: `p_${idx + 1}`,
      name: `Equipo ${idx + 1}`,
      role: roles[idx % roles.length],
      score: 0,
      cyclesPlayed: 0
    }));

    this.tournamentConfig = {
      playerCount,
      players,
      activePlayerIndex: 0,
      totalDurationSeconds: 15 * 60, // 15 minutes
      remainingSeconds: 15 * 60,
      cycleTimeSeconds: 60
    };

    this.addLog(
      `Modo Torneo TGS iniciado para ${playerCount} equipos. Temporizador de 15 minutos en marcha.`,
      'info'
    );
  }

  public startSandbox() {
    this.currentScenario = null;
    this.tournamentConfig = null;
    this.currentCycle = 1;
    this.maxCycles = 999;
    this.delayedQueue = [];
    this.history = [];
    this.isGameOver = false;
    this.isVictory = false;
    this.logMessages = [];
    this.variables = this.getDefaultVariables();
    this.addLog('Modo Simulador Libre (Sandbox) activado. Parámetros desbloqueados.', 'info');
  }

  public addLog(text: string, type: 'info' | 'warn' | 'danger' | 'success' = 'info') {
    this.logMessages.unshift({ cycle: this.currentCycle, text, type });
    if (this.logMessages.length > 50) {
      this.logMessages.pop();
    }
  }

  /**
   * Ejecuta una política cibernética
   */
  public executePolicy(policyId: string): boolean {
    if (this.isGameOver || this.isVictory) return false;

    const policy = CYBERNETIC_POLICIES.find(p => p.id === policyId);
    if (!policy) return false;

    if (!policy.canExecute(this.variables)) {
      this.addLog(`Energía insuficiente para ejecutar: ${policy.title}`, 'warn');
      return false;
    }

    const result = policy.execute(this.variables);
    this.addLog(`[Decisión] ${policy.title}: ${result.immediateMessage}`, 'info');

    if (result.delayedAction) {
      this.delayedQueue.push(result.delayedAction);
      this.addLog(
        `[Inercia] Acción encolada en servomecanismo (${result.delayedAction.remainingCycles} ciclos de retardo).`,
        'info'
      );
    }

    return true;
  }

  /**
   * Procesa el avance de un ciclo operativo completo
   */
  public advanceCycle(executedPolicyIds: string[] = []): {
    event: EnvironmentPerturbation;
    eventMessage: string;
    resolvedDelays: string[];
    isOver: boolean;
    isWin: boolean;
  } {
    if (this.isGameOver || this.isVictory) {
      return {
        event: ENVIRONMENT_EVENTS[0],
        eventMessage: 'Partida finalizada.',
        resolvedDelays: [],
        isOver: this.isGameOver,
        isWin: this.isVictory
      };
    }

    // 1. Resolver retardos pendientes (Delays)
    const resolvedDelays: string[] = [];
    const remainingQueue: DelayedAction[] = [];

    for (const action of this.delayedQueue) {
      action.remainingCycles -= 1;
      if (action.remainingCycles <= 0) {
        action.apply(this.variables);
        resolvedDelays.push(action.description);
        this.addLog(`[Retardo Resuelto] ${action.policyName}: ${action.description}`, 'success');
      } else {
        remainingQueue.push(action);
      }
    }
    this.delayedQueue = remainingQueue;

    // 2. Generar perturbación del entorno exterior
    const eventIndex = Math.floor(Math.random() * ENVIRONMENT_EVENTS.length);
    const event = ENVIRONMENT_EVENTS[eventIndex];
    this.activeEvent = event;
    const eventMessage = event.impact(this.variables);
    this.addLog(`[Entorno] ${event.title}: ${eventMessage}`, 'warn');

    // 3. Evaluar Bucles de Retroalimentación Cibernética (System Dynamics Engine)
    const feedback = this.evaluateSystemDynamicsFeedback();

    // 4. Actualizar variables de estado acopladas
    this.clampVariables();

    // 5. Registrar historial
    this.history.push({
      cycle: this.currentCycle,
      variables: { ...this.variables },
      perturbation: event,
      executedPolicies: [...executedPolicyIds],
      feedbackState: feedback
    });

    // 6. Verificar condiciones de fin de partida (Victoria / Derrota)
    this.checkEndConditions();

    // 7. Si está en modo torneo, rotar el jugador activo
    if (this.tournamentConfig) {
      const pIndex = this.tournamentConfig.activePlayerIndex;
      const player = this.tournamentConfig.players[pIndex];
      player.cyclesPlayed += 1;
      player.score += Math.round(this.variables.homeostasis * 0.4 + this.variables.viability * 0.3);
      this.tournamentConfig.activePlayerIndex =
        (pIndex + 1) % this.tournamentConfig.players.length;
    }

    // 8. Incrementar ciclo si no ha terminado
    if (!this.isGameOver && !this.isVictory) {
      this.currentCycle += 1;
    }

    return {
      event,
      eventMessage,
      resolvedDelays,
      isOver: this.isGameOver,
      isWin: this.isVictory
    };
  }

  /**
   * Motor de ecuaciones diferenciales discretas de dinámica de sistemas
   */
  private evaluateSystemDynamicsFeedback(): {
    balancingActive: boolean;
    reinforcingActive: boolean;
    oscillationSeverity: number;
  } {
    let balancingActive = false;
    let reinforcingActive = false;
    let oscillationSeverity = 0;

    // Bucle B1: Servomecanismo de Homeostasis (Balancing Loop)
    // El servomecanismo intenta devolver homeostasis al setpoint (85%)
    const setpoint = 85;
    const error = setpoint - this.variables.homeostasis;
    const gain = this.variables.servomechanismGain;

    if (gain > 1.4) {
      // Sobre-amortiguamiento u oscilación armónica por ganancia excesiva
      oscillationSeverity = (gain - 1.2) * 15;
      this.variables.homeostasis += error * 0.25 - oscillationSeverity;
      this.addLog(
        `[Oscilación Cibernética] Ganancia excesiva del actuador (${gain.toFixed(1)}x) induce resonancia.`,
        'warn'
      );
    } else {
      // Amortiguamiento suave
      this.variables.homeostasis += error * 0.18 * gain;
      balancingActive = true;
    }

    // Bucle R1 (Destructivo): Runaway térmico y entrópico
    // Si la temperatura supera 30°C o la entropía supera 65%, se desata una bola de nieve
    if (this.variables.temperature > 30 || this.variables.entropy > 65) {
      reinforcingActive = true;
      const entropySpike = (this.variables.temperature - 28) * 0.8 + (this.variables.entropy - 60) * 0.15;
      this.variables.entropy += Math.max(2, entropySpike);
      this.variables.sensorNoise += 6;
      this.variables.viability -= 4;
      this.addLog(
        `[Bucle Reforzador Destructivo R1] Efecto bola de nieve térmico-entrópico en progreso (+${entropySpike.toFixed(1)}% Entropía).`,
        'danger'
      );
    }

    // Bucle R2 (Virtuoso): Sinergia de Alta Viabilidad
    if (this.variables.homeostasis > 75 && this.variables.entropy < 30) {
      this.variables.viability = Math.min(100, this.variables.viability + 3);
      this.variables.energy = Math.min(100, this.variables.energy + 4);
    }

    // Pérdida natural de energía por consumo de soporte vital
    this.variables.energy = Math.max(0, this.variables.energy - 6);

    // Desgaste por ruido de sensores si no se limpia
    if (this.variables.entropy > 50) {
      this.variables.sensorNoise = Math.min(80, this.variables.sensorNoise + (this.variables.entropy - 45) * 0.3);
    }

    return {
      balancingActive,
      reinforcingActive,
      oscillationSeverity
    };
  }

  private clampVariables() {
    this.variables.homeostasis = Math.max(0, Math.min(100, Math.round(this.variables.homeostasis)));
    this.variables.entropy = Math.max(0, Math.min(100, Math.round(this.variables.entropy)));
    this.variables.energy = Math.max(0, Math.min(100, Math.round(this.variables.energy)));
    this.variables.viability = Math.max(0, Math.min(100, Math.round(this.variables.viability)));
    this.variables.sensorNoise = Math.max(0, Math.min(100, Math.round(this.variables.sensorNoise)));
    this.variables.temperature = Math.max(15, Math.min(50, Math.round(this.variables.temperature * 10) / 10));
    this.variables.controlVariety = Math.max(1, Math.min(10, this.variables.controlVariety));
  }

  private checkEndConditions() {
    // Derrota: Viabilidad 0 o Entropía 100
    if (this.variables.viability <= 0) {
      this.isGameOver = true;
      this.isVictory = false;
      this.addLog('¡COLAPSO SISTÉMICO TOTAL! La viabilidad estructural ha descendido a 0%.', 'danger');
      return;
    }

    if (this.variables.entropy >= 98) {
      this.isGameOver = true;
      this.isVictory = false;
      this.addLog('¡MUERTE TÉRMICA E INFORMACIONAL! Entropía desbordada al 100%.', 'danger');
      return;
    }

    // Victoria en escenario individual
    if (this.currentScenario && this.currentCycle >= this.maxCycles) {
      const crit = this.currentScenario.victoryCriteria;
      if (
        this.variables.homeostasis >= crit.minHomeostasis &&
        this.variables.entropy <= crit.maxEntropy &&
        this.variables.viability >= crit.minViability
      ) {
        this.isVictory = true;
        this.isGameOver = false;
        this.addLog(`¡CERTIFICACIÓN EXITOSA! Has completado ${this.currentScenario.title}.`, 'success');
      } else {
        this.isGameOver = true;
        this.isVictory = false;
        this.addLog(
          `Criterios no alcanzados al final del ciclo ${this.maxCycles}. El sistema no logró la estabilidad exigida.`,
          'warn'
        );
      }
      return;
    }

    // Victoria en Torneo (15 ciclos completados con vida)
    if (this.tournamentConfig && this.currentCycle >= this.maxCycles) {
      if (this.variables.viability >= 45 && this.variables.entropy <= 75) {
        this.isVictory = true;
        this.isGameOver = false;
        this.addLog('¡PARTIDA DE TORNEO CONCLUIDA! La Biópolis ha sobrevivido en equilibrio dinámico.', 'success');
      } else {
        this.isGameOver = true;
        this.isVictory = false;
        this.addLog('Torneo finalizado con degradación irreversible del sistema.', 'warn');
      }
    }
  }

  /**
   * Retorna las variables leídas por los sensores con el ruido de Shannon aplicado
   */
  public getTelemetryReadings(): SystemVariables {
    const noiseFactor = this.variables.sensorNoise / 100;
    if (noiseFactor < 0.1) {
      return { ...this.variables };
    }

    // Simula imprecisión y jitter por ruido informacional
    const jitter = () => (Math.random() - 0.5) * noiseFactor * 30;

    return {
      ...this.variables,
      homeostasis: Math.max(0, Math.min(100, Math.round(this.variables.homeostasis + jitter()))),
      entropy: Math.max(0, Math.min(100, Math.round(this.variables.entropy + jitter()))),
      energy: Math.max(0, Math.min(100, Math.round(this.variables.energy + jitter() * 0.5))),
      viability: Math.max(0, Math.min(100, Math.round(this.variables.viability + jitter() * 0.4)))
    };
  }

  /**
   * Genera el Reporte de Auditoría Sistémica y preguntas del docente
   */
  public generateAuditReport(): GameAuditReport {
    const avgHomeo =
      this.history.length > 0
        ? Math.round(this.history.reduce((acc, h) => acc + h.variables.homeostasis, 0) / this.history.length)
        : this.variables.homeostasis;

    // Calcular varianza de oscilación
    let variance = 0;
    if (this.history.length > 1) {
      const mean = avgHomeo;
      const sumSquares = this.history.reduce(
        (acc, h) => acc + Math.pow(h.variables.homeostasis - mean, 2),
        0
      );
      variance = Math.round(sumSquares / this.history.length);
    }
    const oscillationPenalty = Math.min(250, Math.round(Math.sqrt(variance) * 6));

    const negentropyBonus = Math.min(250, Math.round(this.variables.accumulatedNegentropy * 2.2));
    const viabilityPoints = Math.round(this.variables.viability * 3.5);
    const homeoPoints = Math.round(avgHomeo * 4.0);

    const rawScore = Math.max(0, Math.min(1000, homeoPoints + viabilityPoints + negentropyBonus - oscillationPenalty));

    // Determinar Rango Cibernético
    let rankTitle = 'Régimen Entrópico Inestable';
    let rankBadge = '⚠️';
    let systemicThinkingScore = Math.round((rawScore / 1000) * 100);

    if (rawScore >= 880) {
      rankTitle = 'Maestro Cibernético (Rango W. Ross Ashby)';
      rankBadge = '🏆';
    } else if (rawScore >= 740) {
      rankTitle = 'Regulador Homeostático (Rango Norbert Wiener)';
      rankBadge = '🥇';
    } else if (rawScore >= 580) {
      rankTitle = 'Gestor Sistémico Adaptativo (Rango Ludwig von Bertalanffy)';
      rankBadge = '🥈';
    }

    const diagnostics: string[] = [];
    if (oscillationPenalty > 120) {
      diagnostics.push(
        'Patrón de sobre-reacción detectado: Aplicaste políticas consecutivas sin esperar a que concluyeran los retardos temporales (Delays), induciendo resonancia armónica.'
      );
    } else {
      diagnostics.push(
        'Excelente manejo de inercia temporal: Permitiste que los servomecanismos amortiguaran las oscilaciones de forma gradual.'
      );
    }

    if (this.variables.controlVariety >= this.variables.environmentVariety) {
      diagnostics.push(
        `Cumplimiento pleno de la Ley de Ashby: Mantuviste una variedad de control (${this.variables.controlVariety} Vc) adecuada para absorber la variedad del entorno (${this.variables.environmentVariety} Ve).`
      );
    } else {
      diagnostics.push(
        'Vulnerabilidad por déficit de variedad de Ashby: El entorno presentó perturbaciones con mayor variedad que tus subsistemas de respuesta disponibles.'
      );
    }

    if (this.variables.accumulatedNegentropy > 40) {
      diagnostics.push(
        'Dominio de la negentropía de Shannon: Inyectaste orden informacional a tiempo para disipar el ruido en los sensores antes de que contaminara las decisiones.'
      );
    }

    const teacherAnalysisQuestions = [
      {
        question:
          '¿Cómo demostró su partida que las relaciones de causa y efecto en este sistema NO son proporcionales ni inmediatas?',
        concept: 'Retardos temporales (Delays) y No-Linealidad',
        suggestedAnswer:
          'Debido a los retardos de 1 ciclo en la calibración y disipación, un incremento abrupto de energía no estabilizó la estación inmediatamente; por el contrario, acumuló calor residual que tardó en enfriarse, evidenciando desfases entre causa y efecto.'
      },
      {
        question:
          '¿En qué momento de la partida se presentó o estuvo en riesgo de desatarse un Bucle de Retroalimentación Positiva (Runaway Loop)?',
        concept: 'Bucles Reforzadores Desestabilizadores (R1)',
        suggestedAnswer:
          'Cuando la temperatura superó los 30°C o la entropía el 65%, el calor generó ruido en sensores, lo que impidió diagnosticar la falla y elevó aún más la temperatura, activando una espiral de deterioro acumulativo.'
      },
      {
        question:
          '¿Cómo se verificó empíricamente la Ley de Variedad Requerida de Ross Ashby durante las perturbaciones del entorno?',
        concept: 'Ley de Variedad Requerida (Vc ≥ Ve)',
        suggestedAnswer:
          'Frente a tormentas electromagnéticas de variedad 3 o 4, si el controlador no había expandido su variedad mediante módulos de contingencia, la diferencia provocó daño estructural directo e inevitable en la viabilidad.'
      }
    ];

    return {
      score: rawScore,
      rankTitle,
      rankBadge,
      averageHomeostasis: avgHomeo,
      finalViability: this.variables.viability,
      totalNegentropy: this.variables.accumulatedNegentropy,
      oscillationPenalty,
      ashbyRatio: parseFloat((this.variables.controlVariety / Math.max(1, this.variables.environmentVariety)).toFixed(2)),
      systemicThinkingScore,
      diagnostics,
      teacherAnalysisQuestions
    };
  }
}
