import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_footer(num_pages)
            super().showPage()
        super().save()

    def draw_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#718096"))
        
        # Header line & text
        self.setStrokeColor(colors.HexColor("#CBD5E0"))
        self.setLineWidth(0.5)
        self.line(40, 755, 572, 755)
        self.drawString(40, 760, "TORNEO DE SISTEMAS - TGS | FICHA TÉCNICA OFICIAL")
        self.drawRightString(572, 760, "CYBER-SYN: PROTOCOLO HOMEOSTASIS")

        # Footer line & text
        self.line(40, 42, 572, 42)
        self.drawString(40, 30, "Parcial Segundo Corte | Teoría General de Sistemas | Ingeniería de Sistemas")
        self.drawRightString(572, 30, f"Página {self._pageNumber} de {page_count}")
        self.restoreState()

def build_pdf(filename="ficha_tecnica.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=55,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0F172A'),
        alignment=1, # Center
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#0284C7'),
        alignment=1,
        spaceAfter=12
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#1E293B')
    )

    header_cell_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#FFFFFF')
    )

    col1_style = ParagraphStyle(
        'Col1Style',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#0F172A')
    )

    golden_rule_style = ParagraphStyle(
        'GoldenRule',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#B45309')
    )

    story = []

    # Title Banner
    story.append(Paragraph("FICHA TÉCNICA DEL JUEGO", title_style))
    story.append(Paragraph("TORNEO DE SISTEMAS | TEORÍA GENERAL DE SISTEMAS (TGS) - SEGUNDO CORTE", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284C7"), spaceBefore=0, spaceAfter=10))

    # Data items matching section 6 of PDF
    data_items = [
        ("Nombre del juego", "<b>CYBER-SYN: Protocolo Homeostasis</b> <i>(The Cybernetic Regulator)</i>"),
        ("Integrantes", "Carlos y Equipo de Teoría General de Sistemas (Ingeniería de Sistemas)"),
        ("Sistema representado", 
         "<b>Macro-Sistema Socio-Ecológico y Tecnológico Complejo ('Biópolis Orbital Sintrópica Kepler-42')</b>.<br/>"
         "Sistema abierto y dinámico que interactúa con un entorno hostil a través de 4 subsistemas:<br/>"
         "• <i>Subsistema Energético/Termodinámico:</i> Flujos de energía y disipación térmica.<br/>"
         "• <i>Subsistema de Información:</i> Relación señal/ruido, transmisión y Entropía de Shannon.<br/>"
         "• <i>Subsistema de Control Cibernético:</i> Sensores, comparadores y servomecanismos homeostáticos.<br/>"
         "• <i>Subsistema Social/Viabilidad:</i> Cohesión humana, productividad y estabilidad de la colonia."
        ),
        ("Tipo de juego", "<b>Simulación Estratégica Digital Sistémica</b> (Digital Systems Dynamics Strategy Simulator) en plataforma Web moderna con arquitectura de estados reactivos."),
        ("Número de jugadores", 
         "<b>1 a 4 jugadores</b>.<br/>"
         "• <i>Modo Solitario:</i> Campaña de 3 niveles con complejidad didáctica progresiva.<br/>"
         "• <i>Modo Torneo Multijugador (Pase y Juegue / Turnos por Equipos):</i> Control rotativo de ciclos de 15 minutos o competencia sobre idéntica semilla de perturbaciones del entorno."
        ),
        ("Duración aproximada", "<b>10 a 15 minutos</b> (Calibrado exactamente para el estándar del torneo: 15 ciclos por partida con temporizador de torneo en tiempo real)."),
        ("Objetivo", 
         "Gobernar la colonia biosférica aplicando principios de TGS para mantener la <b>Homeostasis dinámica</b> "
         "frente a perturbaciones estocásticas, administrando bucles de retroalimentación negativa y positiva, "
         "reduciendo la entropía informacional mediante inyección de negentropía y satisfaciendo la Ley de Variedad de Ashby."
        ),
        ("Contexto / historia", 
         "Año 2145. La estación orbital <i>Sintropía-I</i> depende de un delicado equilibrio termodinámico e informacional. "
         "Los jugadores asumen el mando de la Unidad de Regulación Cibernética (inspirada en Stafford Beer y Norbert Wiener). "
         "Una serie de tormentas de radiación y fluctuaciones entrópicas amenazan la estación. El jugador debe pensar sistémicamente: "
         "cada acción desencadena retardos temporales y bucles causales no lineales."
        ),
        ("Componentes", 
         "1. <b>Consola Web Digital:</b> Dashboard cyberpunk en tiempo real con monitoreo de variables.<br/>"
         "2. <b>Diagrama Causal de Bucles (Causal Loop Diagram - CLD):</b> Grafo reactivo interactivo con polaridades (+ / -) y flujo de retardo.<br/>"
         "3. <b>Métricas de Estado:</b> Homeostasis (%), Entropía de Shannon (bits), Flujo Energético, Variedad de Ashby y Salud/Viabilidad.<br/>"
         "4. <b>Osciloscopio Cibernético:</b> Visualizador dinámico de curvas de estabilidad y amortiguamiento.<br/>"
         "5. <b>Catálogo de Políticas Cibernéticas:</b> Matriz de decisiones estratégicas con costos y retardos (delays).<br/>"
         "6. <b>Generador Estocástico del Entorno:</b> Perturbaciones externas aleatorias.<br/>"
         "7. <b>Auditoría Sistémica y Banco de Preguntas del Docente:</b> Evaluación post-partida que certifica pensamiento sistémico."
        ),
        ("Temas TGS integrados", 
         "<b>1. Cibernética (OBLIGATORIO):</b><br/>"
         "• <i>Retroalimentación Negativa (Balancing Loops):</i> Servomecanismos que amortiguan desviaciones y restauran el setpoint.<br/>"
         "• <i>Retroalimentación Positiva (Reinforcing Loops):</i> Bucles acumulativos de crecimiento o colapso vicioso.<br/>"
         "• <i>Ley de Variedad Requerida de Ashby:</i> Solo la variedad del regulador puede absorber la variedad del entorno (Vc ≥ Ve).<br/>"
         "• <i>Retardos Temporales (Delays) y Homeorhesis.</i><br/>"
         "<b>2. Entropía en la Información (Claude Shannon):</b> Degradación del canal por ruido (H = -∑ p log₂ p); inyección de Negentropía para restaurar la certidumbre diagnóstica.<br/>"
         "<b>3. Teoría de la Decisión (Herbert Simon):</b> Racionalidad acotada bajo ruido informacional y análisis de trade-offs multiobjetivo.<br/>"
         "<b>4. TGS en Sistemas Complejos y Organizacionales:</b> Modelo de Sistema Viable (VSM) y arquetipos sistémicos."
        ),
        ("Situaciones problemáticas", 
         "• <b>Desincronización por Retardo (Delay Dilemma):</b> Acciones que tardan ciclos en impactar. Si el jugador sobre-corrige, induce resonancia y oscilación destructiva.<br/>"
         "• <b>Ceguera Entrópica (Ruido de Shannon):</b> A alta entropía, los sensores falsean datos; actuar sobre lecturas erróneas acelera el colapso.<br/>"
         "• <b>Déficit de Variedad de Ashby:</b> Crisis complejas del entorno superan los recursos de control disponibles, desgastando la viabilidad.<br/>"
         "• <b>Runaway Loop (Efecto Bola de Nieve):</b> Exceso de calor → genera entropía → ruido en sensores → fallo de refrigeración → más calor."
        ),
        ("Decisiones", 
         "1. <b>Inyección de Negentropía Informacional:</b> Consume energía para depurar el ruido del canal y clarificar los sensores.<br/>"
         "2. <b>Calibración de la Ganancia Homeostática:</b> Ajusta la intensidad de corrección del servomecanismo de control.<br/>"
         "3. <b>Expansión de Variedad de Ashby:</b> Habilita subsistemas de contingencia para absorber crisis complejas del entorno.<br/>"
         "4. <b>Filtro Predictivo de Inercia:</b> Modula los retardos de feedback para evitar sobre-oscilaciones.<br/>"
         "5. <b>Desacoplamiento de Emergencia:</b> Aísla subsistemas en fallo para evitar el colapso en cadena."
        ),
        ("Retroalimentación", 
         "• <b>Retroalimentación Negativa (Bucles B):</b> Corrige desviaciones para retornar la colonia a su rango homeostático óptimo.<br/>"
         "• <b>Retroalimentación Positiva (Bucles R):</b> Refuerza el desgaste si la entropía supera el 70%, o acelera la productividad si la estabilidad supera el 80%.<br/>"
         "• <b>Telemetría en Vivo:</b> El diagrama causal resalta arcos azules (B) y rojos (R) según la dinámica en tiempo real."
        ),
        ("Sistema de puntuación", 
         "<b>Puntaje de Eficiencia Cibernética (PEC) [0 a 1000 pts]:</b><br/>"
         "PEC = (Homeostasis Promedio × 4.0) + (Viabilidad Final × 3.5) + (Negentropía Acumulada × 2.5) - (Penalización por Oscilaciones)<br/>"
         "• 900 - 1000 pts: <i>Maestro Cibernético (Rango W. Ross Ashby)</i><br/>"
         "• 750 - 899 pts: <i>Regulador Homeostático (Rango Norbert Wiener)</i><br/>"
         "• 600 - 749 pts: <i>Gestor Sistémico (Rango Ludwig von Bertalanffy)</i><br/>"
         "• < 600 pts: <i>Régimen Entrópico Inestable</i>"
        ),
        ("Condición de victoria", 
         "• <b>Victoria Individual/Cooperativa:</b> Sobrevivir 15 ciclos (15 minutos) con Viabilidad ≥ 50%, Entropía ≤ 70% y PEC ≥ 650 pts.<br/>"
         "• <b>Victoria en Modo Torneo:</b> El equipo con mayor Puntaje de Eficiencia Cibernética y menor varianza oscilatoria.<br/>"
         "• <b>Derrota (Game Over):</b> Colapso si la Viabilidad llega a 0% o la Entropía permanece en 100% durante 2 ciclos consecutivos."
        )
    ]

    table_data = [
        [
            Paragraph("<b>Elemento</b>", header_cell_style),
            Paragraph("<b>Respuesta del equipo</b>", header_cell_style)
        ]
    ]

    for elem, resp in data_items:
        table_data.append([
            Paragraph(elem, col1_style),
            Paragraph(resp, body_style)
        ])

    table = Table(table_data, colWidths=[130, 402], repeatRows=1)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (1, 0), colors.HexColor('#0F172A')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#0284C7')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))

    story.append(table)
    story.append(Spacer(1, 10))

    # Box for Golden Rule
    golden_box_data = [
        [
            Paragraph(
                "<b>REGLA DE ORO DEL TORNEO:</b><br/>"
                "<i>'El objetivo no es diseñar simplemente un juego sobre TGS; el objetivo es diseñar un juego que haga pensar sistémicamente.'</i><br/>"
                "<b>Cumplimiento en CYBER-SYN:</b> El jugador se enfrenta a relaciones no lineales, retardos de retroalimentación (delays) y acoplamiento estructural. Quien actúa de manera lineal (apagando síntomas aislados) desata bucles de refuerzo destructivos. Para ganar, el jugador debe intervenir los puntos de apalancamiento, regular la ganancia del servomecanismo y equilibrar la variedad de control frente a la variedad del entorno.",
                golden_rule_style
            )
        ]
    ]
    golden_box = Table(golden_box_data, colWidths=[532])
    golden_box.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FEF3C7')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#F59E0B')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(golden_box)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    out = "ficha_tecnica.pdf"
    if len(sys.argv) > 1:
        out = sys.argv[1]
    build_pdf(out)
