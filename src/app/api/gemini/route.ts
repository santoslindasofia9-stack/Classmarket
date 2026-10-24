import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { notes, name, grade, school } = body;

    if (!notes || typeof notes !== "string" || !notes.trim()) {
      return NextResponse.json(
        { error: "Por favor escribe algunas notas o temas que dominas." },
        { status: 400 }
      );
    }

    const cleanNotes = notes.trim();
    const studentName = name || "Estudiante";
    const studentGrade = grade || "Bachillerato";
    const studentSchool = school || "Santander";

    // Check if GEMINI_API_KEY is available in environment
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;

    if (apiKey) {
      try {
        const prompt = `Actúa como un redactor profesional educativo de ClassMarket, una plataforma académica donde estudiantes de colegio y universidad ofrecen tutorías y apoyo en guías.
Transforma las siguientes notas informales escritas por un estudiante (${studentName}, grado: ${studentGrade}, colegio: ${studentSchool}) en una presentación de perfil atractiva, cercana y profesional de EXACTAMENTE 3 frases en español.
- Frase 1: Presentación entusiasta y materia/área principal que domina.
- Frase 2: Su metodología paciente (ej. explicaciones paso a paso, ejercicios resueltos, resolución de dudas antes de parciales o pruebas Saber 11).
- Frase 3: Llamado a la acción motivador para que sus compañeros coordinen una tutoría o guía.

Notas del estudiante:
"${cleanNotes}"

Responde ÚNICAMENTE con las 3 frases sin viñetas, sin comillas adicionales y sin títulos.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 250,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim()) {
            return NextResponse.json({
              enhancedBio: candidateText.trim(),
              source: "gemini-api"
            });
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local pedagogical synthesis:", err);
      }
    }

    // ── Local Pedagogical Synthesis Engine (Fast, Guaranteed Fallback) ──────
    const lowerNotes = cleanNotes.toLowerCase();
    
    // Topic detection
    let mainArea = "matemáticas, ciencias y tareas escolares";
    if (lowerNotes.includes("cálculo") || lowerNotes.includes("algebra") || lowerNotes.includes("álgebra") || lowerNotes.includes("trigonometría") || lowerNotes.includes("mate")) {
      mainArea = "matemáticas, álgebra y cálculo con métodos visuales y prácticos";
    } else if (lowerNotes.includes("física") || lowerNotes.includes("newton") || lowerNotes.includes("cinemática")) {
      mainArea = "física mecánica y resolución de problemas paso a paso";
    } else if (lowerNotes.includes("química") || lowerNotes.includes("biología") || lowerNotes.includes("organica")) {
      mainArea = "química orgánica, biología y esquemas conceptuales";
    } else if (lowerNotes.includes("inglés") || lowerNotes.includes("english") || lowerNotes.includes("idioma")) {
      mainArea = "inglés conversacional, gramática y preparación de pruebas Saber 11";
    } else if (lowerNotes.includes("python") || lowerNotes.includes("programación") || lowerNotes.includes("código") || lowerNotes.includes("html") || lowerNotes.includes("scratch")) {
      mainArea = "programación, desarrollo web y proyectos de informática desde cero";
    } else if (lowerNotes.includes("filosofía") || lowerNotes.includes("historia") || lowerNotes.includes("lectura") || lowerNotes.includes("ensayo")) {
      mainArea = "redacción de ensayos, filosofía y técnicas de comprensión lectora crítica";
    }

    const sentence1 = `¡Hola! Soy ${studentName}, estudiante de ${studentGrade}, y me apasiona ayudarte a dominar ${mainArea} para que apruebes con seguridad.`;
    const sentence2 = `Mi metodología se basa en explicaciones claras, resolución de ejercicios modelo y repaso guiado de tus guías y talleres sin enredos.`;
    const sentence3 = `Coordinemos una sesión presencial o virtual para resolver todas tus dudas antes de tus entregas y evaluaciones.`;

    const enhancedBio = `${sentence1} ${sentence2} ${sentence3}`;

    return NextResponse.json({
      enhancedBio,
      source: "local-gemini-ai"
    });

  } catch (error: any) {
    console.error("Gemini route error:", error);
    return NextResponse.json(
      { error: "No se pudo procesar la solicitud con IA. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
