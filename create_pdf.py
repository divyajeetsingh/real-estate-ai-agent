import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_elements(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_elements(self, page_count):
        self.saveState()
        # Suppress headers and footers on the cover page
        if self._pageNumber == 1:
            self.restoreState()
            return
            
        # Draw header
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#ff5e36"))
        self.drawString(54, 750, "REAL NEW YORK  |  AI AGENT CONSOLE & DASHBOARD DOCUMENTATION")
        self.setStrokeColor(colors.HexColor("#e5e7eb"))
        self.setLineWidth(0.5)
        self.line(54, 742, 558, 742)
        
        # Draw footer
        self.line(54, 55, 558, 55)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#6b7280"))
        self.drawString(54, 40, "Confidential - Internal Real Estate AI Agent Console Spec")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 40, page_str)
        self.restoreState()

def build_pdf(filename="REAL_NY_AI_Agent_Documentation.pdf"):
    # Target 8.5" x 11" (Letter size)
    # Margins: 0.75" (54 pt)
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=72,
        bottomMargin=72
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    primary_color = colors.HexColor("#ff5e36") # REAL Orange
    secondary_color = colors.HexColor("#111827") # Dark grey
    accent_blue = colors.HexColor("#00b0ff")
    accent_purple = colors.HexColor("#d500f9")
    text_dark = colors.HexColor("#1f2937")
    bg_light = colors.HexColor("#f9fafb")
    border_color = colors.HexColor("#e5e7eb")
    
    # Custom Paragraph Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=32,
        leading=38,
        textColor=primary_color,
        spaceAfter=12
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#4b5563"),
        spaceAfter=30
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=secondary_color,
        spaceBefore=18,
        spaceAfter=10,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=text_dark,
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'BulletPoint',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=text_dark,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=5
    )
    
    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#1e1b4b"),
        spaceAfter=6
    )

    story = []

    # ================= PAGE 1: COVER PAGE =================
    story.append(Spacer(1, 1.5 * inch))
    
    # Accent Color Bar (Decorative)
    bar_data = [['']]
    bar_table = Table(bar_data, colWidths=[504], rowHeights=[6])
    bar_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), primary_color),
        ('PADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(bar_table)
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("REAL NEW YORK", title_style))
    story.append(Paragraph("AI Chatbot & Administrative Dashboard Console", subtitle_style))
    
    # Metadata Block
    metadata_text = """
    <b>Author:</b> Product Engineering Team<br/>
    <b>Status:</b> Release Documentation<br/>
    <b>API Target:</b> Google Gemini API (gemini-3.5-flash)<br/>
    <b>Deployment:</b> Client-Side SPA (Static Web Hosting)<br/>
    <b>Date:</b> July 2026<br/>
    """
    story.append(Paragraph(metadata_text, body_style))
    story.append(Spacer(1, 2.5 * inch))
    
    story.append(Paragraph("CONFIDENTIAL  |  INTERNAL USE ONLY", ParagraphStyle('Conf', fontName='Helvetica-Bold', fontSize=9, textColor=colors.HexColor("#9ca3af"), letterSpacing=1)))
    story.append(PageBreak())

    # ================= PAGE 2: EXECUTIVE SUMMARY & ARCHITECTURE =================
    story.append(Paragraph("1. Executive Summary", h1_style))
    story.append(Paragraph(
        "This document describes the design, implementation, and capabilities of the <b>REAL New York AI Chatbot Console & Dashboard Application</b>. "
        "The application provides a premium, interactive simulation of virtual real estate advisory services for rentals, sales, and commercial leasing, "
        "enabling agents to test client interactions and personalize chatbot personas in real time.",
        body_style
    ))
    story.append(Paragraph(
        "Built on a client-side stack to ensure rapid responsiveness, the platform leverages the <b>Google Gemini API</b> (model: <code>gemini-3.5-flash</code>) "
        "to deliver context-aware replies grounded in standard NYC rental rules and an in-memory listings catalog database.",
        body_style
    ))
    
    story.append(Spacer(1, 10))
    story.append(Paragraph("2. System Architecture", h1_style))
    story.append(Paragraph(
        "The application is engineered as a zero-dependency, single-page application (SPA) to maximize efficiency, loading speeds, and styling flexibility.",
        body_style
    ))
    
    # File structure table
    file_info = [
        ["File", "Role", "Key Modules / Contents"],
        ["index.html", "Structure & Layout", "HTML5 structure, admin tab layouts, chatbot dialog panels, and inline modals."],
        ["styles.css", "Aesthetics & Themes", "Design tokens, CSS variables, glassmorphism card modules, light/dark modes, and custom micro-animations."],
        ["app.js", "Logic & API Bridge", "State management, mock listings and leads databases, REST calls to Gemini model API, and event listeners."]
    ]
    t = Table(file_info, colWidths=[1.2*inch, 1.5*inch, 4.3*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), secondary_color),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9.5),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
        ('TOPPADDING', (0,0), (-1,0), 6),
        ('BACKGROUND', (0,1), (-1,-1), bg_light),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 9),
        ('TOPPADDING', (0,1), (-1,-1), 8),
        ('BOTTOMPADDING', (0,1), (-1,-1), 8),
    ]))
    story.append(t)
    
    story.append(PageBreak())

    # ================= PAGE 3: CHATBOT PERSONAS & API INTEGRATION =================
    story.append(Paragraph("3. Chatbot Personas", h1_style))
    story.append(Paragraph(
        "To address different divisions of a full-service brokerage, the console supports three distinct agent personas. Selecting a persona updates the interface's color accent, welcome greeting, and suggestion chips instantly:",
        body_style
    ))
    
    personas_info = [
        ["Persona", "Specialty Division", "UI Accent Color", "Greeting Theme"],
        ["Emma", "Residential Rentals", "#ff5e36 (REAL Orange)", "Rentals focus: 40x rule, neighborhood searches, LIC, Williamsburg."],
        ["Alex", "Commercial Advisor", "#00b0ff (Electric Blue)", "Business spaces: storefronts, office suites, lease terms."],
        ["Sophia", "VIP Concierge", "#d500f9 (Purple Spark)", "Luxury developments: purchase condos, penthouses, private tours."]
    ]
    pt = Table(personas_info, colWidths=[1.0*inch, 1.6*inch, 1.8*inch, 2.6*inch])
    pt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), secondary_color),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9.5),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('BACKGROUND', (0,1), (-1,-1), bg_light),
        ('FONTSIZE', (0,1), (-1,-1), 9),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,1), (-1,-1), 8),
        ('BOTTOMPADDING', (0,1), (-1,-1), 8),
    ]))
    story.append(pt)
    
    story.append(Spacer(1, 15))
    story.append(Paragraph("4. Gemini API Integration Spec", h1_style))
    story.append(Paragraph(
        "The live agent replies are served by querying the <code>gemini-3.5-flash</code> endpoint via HTTP POST. "
        "The model is supplied with a custom system instruction prompt and listing context to simulate real-estate advice.",
        body_style
    ))
    
    story.append(Paragraph("<b>Gemini Multi-Turn Role Alternation Rule</b>", h2_style))
    story.append(Paragraph(
        "The Gemini REST API requires a strict alternating sequence in the conversation history (i.e. <code>user</code>, "
        "<code>model</code>, <code>user</code>, <code>model</code>...) and mandates that the history list <b>must begin with a <code>user</code> turn</b>. "
        "Because the bot starts with a greeting (a model turn), this was causing validation failures (status 400).",
        body_style
    ))
    
    # Code box for alternation logic
    code_text = """
    const recentHistory = conversationHistory.slice(-10);
    const contents = [];
    let expectedRole = "user";
    for (const msg of recentHistory) {
        const role = msg.role === "user" ? "user" : "model";
        if (role === expectedRole) {
            contents.push({
                role: role,
                parts: [{ text: msg.text }]
            });
            expectedRole = expectedRole === "user" ? "model" : "user";
        }
    }
    """
    ct = Table([[Paragraph(code_text.replace(" ", "&nbsp;").replace("\n", "<br/>"), code_style)]], colWidths=[7.0*inch])
    ct.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(ct)
    
    story.append(Paragraph(
        "<i>Implementation Note:</i> The code snippet above scans the history array and selectively builds a compliant "
        "alternating payload, stripping out initial model greetings or double-sent messages dynamically before dispatching.",
        ParagraphStyle('NoteStyle', parent=body_style, fontName='Helvetica-Oblique', fontSize=9, textColor=colors.HexColor("#4b5563"))
    ))
    
    story.append(PageBreak())

    # ================= PAGE 4: DASHBOARD DETAILS & FUNCTIONALITY =================
    story.append(Paragraph("5. Console Panels & Features", h1_style))
    
    story.append(Paragraph("<b>A. Bot Customizer Tab</b>", h2_style))
    story.append(Paragraph(
        "This panel serves as the controls module. Agents can adjust greetings and suggestions on-the-fly:<br/>"
        "• <b>Custom Greeting</b>: A textarea that updates the live chat preview immediately.<br/>"
        "• <b>Suggestions Chips Editor</b>: Input fields that allow setting dynamic quick-select chips under the chat box.<br/>"
        "• <b>API Key Integration</b>: An input block with a status display indicator ('Active' vs 'Offline Rules Fallback'). "
        "Input keys are written to the browser's <code>localStorage</code>, bypassing the remote repository to ensure zero security leaks.",
        body_style
    ))
    
    story.append(Paragraph("<b>B. Leads Captured Database</b>", h2_style))
    story.append(Paragraph(
        "Logs client details gathered by the chatbot's dynamic forms:<br/>"
        "• <b>Fields Recorded</b>: Timestamp, client name, contact details (email/phone), requirements/dates, and status badge.<br/>"
        "• <b>Lead Types</b>: Displays <code>Tour Scheduled</code> (in green) or <code>Info Only</code> (in blue).<br/>"
        "• <b>Analytics Cards</b>: Aggregates total captured leads count, tour requests, and tracks the top requested neighborhood.",
        body_style
    ))
    
    story.append(Paragraph("<b>C. Mock Listings Database</b>", h2_style))
    story.append(Paragraph(
        "Provides the chatbot with its catalog of properties. Agents can query, add, or remove options in real time. "
        "When the user asks for listings matching specific locations or budgets, the local matcher filters these entries to return cards.",
        body_style
    ))
    
    story.append(Spacer(1, 10))
    story.append(Paragraph("6. Interactive Chatbot UI Widgets", h1_style))
    story.append(Paragraph(
        "The model response parsing script checks for special markers to insert dynamic visual components directly in the stream:",
        body_style
    ))
    
    # Widgets table
    widget_info = [
        ["Widget Tag", "Render Output", "Action & Lead Capture Flow"],
        ["[CAROUSEL: id1, id2]", "Horizontal Card Carousel", "Generates visual property cards containing rents, spec icons (beds/baths), photos, and a 'Schedule Tour' CTA."],
        ["[SCHEDULER]", "Inline Tour Calendar Widget", "Generates a viewing request form. Upon submission, it registers the client lead as 'Tour Scheduled' in the leads database."],
        ["[LEAD_FORM]", "Client Profile Registration Card", "Generates a contact capture card. Upon submission, it creates an 'Info Only' entry in the database."]
    ]
    wt = Table(widget_info, colWidths=[1.8*inch, 2.0*inch, 3.2*inch])
    wt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), secondary_color),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9.5),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('BACKGROUND', (0,1), (-1,-1), bg_light),
        ('FONTSIZE', (0,1), (-1,-1), 9),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,1), (-1,-1), 8),
        ('BOTTOMPADDING', (0,1), (-1,-1), 8),
    ]))
    story.append(wt)
    
    story.append(Spacer(1, 20))
    story.append(Paragraph("7. Local Rules Engine (Offline Fallback)", h1_style))
    story.append(Paragraph(
        "If no API Key is entered or if the API request fails due to network conditions, the console seamlessly falls back to a "
        "<b>Local Keyword Rules Engine</b>. This fallback parses basic expressions (e.g. 'schedule', '40x rule', 'guarantors', 'documents', "
        "or specific numbers/neighborhoods) to return pre-formatted FAQs or query the mock listing array directly, providing an uninterrupted user experience.",
        body_style
    ))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)

if __name__ == "__main__":
    build_pdf()
    print("PDF generated successfully.")
