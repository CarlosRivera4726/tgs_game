/**
 * CYBER-SYN: Protocolo Homeostasis
 * Tipos e interfaces del núcleo cibernético y teoría general de sistemas
 */

export interface SystemVariables {
  /** Porcentaje de equilibrio homeostático [0 - 100%] */
  homeostasis: number;
  /** Entropía Informacional de Shannon [0 - 100%] */
  entropy: number;
  /** Reserva energética / capacidad de flujo termodinámico [0 - 100%] */
  energy: number;
  /** Viabilidad estructural y salud de la colonia [0 - 100%] */
  viability: number;
  /** Temperatura interna de la biosfera [°C normal = 21, peligro > 35] */
  temperature: number;
  /** Ruido en canales de sensores [0 - 100%] */
  sensorNoise: number;
  /** Variedad interna del sistema de control (Ley de Ashby) */
  controlVariety: number;
  /** Variedad de las perturbaciones del entorno exterior */
  environmentVariety: number;
  /** Negentropía acumulada inyectada en el sistema */
  accumulatedNegentropy: number;
  /** Ganancia del servomecanismo de retroalimentación negativa [0.5 - 2.5] */
  servomechanismGain: number;
}

export interface DelayedAction {
  id: string;
  policyId: string;
  policyName: string;
  remainingCycles: number;
  totalCycles: number;
  apply: (variables: SystemVariables) => void;
  description: string;
}

export interface CyberneticPolicy {
  id: string;
  title: string;
  subsystem: 'cibernetica' | 'entropia' | 'energia' | 'ashby' | 'estructura';
  energyCost: number;
  delayCycles: number;
  description: string;
  systemicExplanation: string;
  icon: string;
  canExecute: (vars: SystemVariables) => boolean;
  execute: (vars: SystemVariables) => {
    immediateMessage: string;
    delayedAction?: DelayedAction;
  };
}

export interface EnvironmentPerturbation {
  id: string;
  title: string;
  variety: number;
  description: string;
  systemicArchetype: string;
  impact: (vars: SystemVariables) => string;
}

export type GameMode = 'mission' | 'tournament' | 'sandbox';

export interface Player {
  id: string;
  name: string;
  role: 'Director de Variedad' | 'Operador de Entropía' | 'Ingeniero de Feedback';
  score: number;
  cyclesPlayed: number;
}

export interface TournamentConfig {
  playerCount: number;
  players: Player[];
  activePlayerIndex: number;
  totalDurationSeconds: number;
  remainingSeconds: number;
  cycleTimeSeconds: number;
}

export interface MissionScenario {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  description: string;
  focusTopic: string;
  targetCycles: number;
  initialVars: Partial<SystemVariables>;
  allowedPolicies: string[];
  victoryCriteria: {
    minHomeostasis: number;
    maxEntropy: number;
    minViability: number;
  };
  learningObjective: string;
}

export interface CycleHistoryEntry {
  cycle: number;
  variables: SystemVariables;
  perturbation: EnvironmentPerturbation | null;
  executedPolicies: string[];
  feedbackState: {
    balancingActive: boolean;
    reinforcingActive: boolean;
    oscillationSeverity: number;
  };
}

export interface GameAuditReport {
  score: number;
  rankTitle: string;
  rankBadge: string;
  averageHomeostasis: number;
  finalViability: number;
  totalNegentropy: number;
  oscillationPenalty: number;
  ashbyRatio: number;
  systemicThinkingScore: number; // 0 - 100%
  diagnostics: string[];
  teacherAnalysisQuestions: {
    question: string;
    concept: string;
    suggestedAnswer: string;
  }[];
}
