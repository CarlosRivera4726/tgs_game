export class Oscilloscope {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dataPoints: { homeostasis: number; entropy: number }[] = [];
  private maxPoints: number = 30;
  private animFrameId: number | null = null;

  constructor(canvasId: string) {
    const el = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!el) {
      throw new Error(`Canvas with id ${canvasId} not found`);
    }
    this.canvas = el;
    const context = el.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = context;
    this.initCanvasSize();
    this.renderStaticGrid();
  }

  private initCanvasSize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = rect.height * (window.devicePixelRatio || 1);
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  public addSample(homeostasis: number, entropy: number) {
    this.dataPoints.push({ homeostasis, entropy });
    if (this.dataPoints.length > this.maxPoints) {
      this.dataPoints.shift();
    }
    this.draw();
  }

  public reset() {
    this.dataPoints = [];
    this.draw();
  }

  private draw() {
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    this.ctx.clearRect(0, 0, w, h);

    // Fondo Cyberpunk Grid
    this.ctx.fillStyle = '#0b1120';
    this.ctx.fillRect(0, 0, w, h);

    // Líneas de grilla
    this.ctx.strokeStyle = '#1e293b';
    this.ctx.lineWidth = 1;

    for (let x = 0; x < w; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }

    for (let y = 0; y < h; y += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // Línea de Setpoint Homeostático (85%)
    const setpointY = h - (85 / 100) * (h - 20) - 10;
    this.ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
    this.ctx.setLineDash([4, 4]);
    this.ctx.beginPath();
    this.ctx.moveTo(0, setpointY);
    this.ctx.lineTo(w, setpointY);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Etiqueta de Setpoint
    this.ctx.fillStyle = 'rgba(0, 242, 254, 0.6)';
    this.ctx.font = '9px JetBrains Mono, monospace';
    this.ctx.fillText('Setpoint: 85%', 8, setpointY - 4);

    if (this.dataPoints.length < 2) return;

    const stepX = w / (this.maxPoints - 1);

    // Trazo de Homeostasis (Cyan)
    this.ctx.strokeStyle = '#00f2fe';
    this.ctx.lineWidth = 2.2;
    this.ctx.shadowColor = '#00f2fe';
    this.ctx.shadowBlur = 6;
    this.ctx.beginPath();

    this.dataPoints.forEach((pt, i) => {
      const x = i * stepX;
      const y = h - (pt.homeostasis / 100) * (h - 24) - 12;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    // Trazo de Entropía (Rojo/Naranja)
    this.ctx.strokeStyle = '#ff4d4d';
    this.ctx.lineWidth = 1.8;
    this.ctx.shadowColor = '#ff4d4d';
    this.ctx.shadowBlur = 4;
    this.ctx.beginPath();

    this.dataPoints.forEach((pt, i) => {
      const x = i * stepX;
      const y = h - (pt.entropy / 100) * (h - 24) - 12;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  private renderStaticGrid() {
    this.draw();
  }
}
