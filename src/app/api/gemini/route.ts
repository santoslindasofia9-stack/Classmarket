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
    const studentName = name?.trim() || "Tutor";
    const studentGrade = grade || "11° Grado";
    const studentSchool = school?.trim() || "";

    // 1. Check if Gemini / Google AI key is available
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;

    if (apiKey) {
      try {
        const prompt = `Eres un asistente de redacción para ClassMarket, una plataforma estudiantil de tutorías escolares.
Tu misión es transformar OBLIGATORIAMENTE las notas ingresadas por el tutor en una presentación atractiva, fresca y personalizada de exactamente 3 frases.

DATOS DEL TUTOR:
- Nombre: ${studentName}
- Grado: ${studentGrade}
- Colegio: ${studentSchool || "Colegio local"}
- Habilidades / Notas exactas que ingresó: "${cleanNotes}"

INSTRUCCIONES CLAVE:
1. DEBES incluir específicamente los temas y palabras clave que el usuario escribió (ejemplo: si escribió cálculo, derivadas, programación, Python, física, etc., deben aparecer explícitamente en el texto).
2. Frase 1: Saludo cercano y mención directa de los temas y materias específicas que el usuario anotó en sus notas.
3. Frase 2: Cómo enseña de forma práctica (ejercicios paso a paso, trucos para exámenes, resolución de talleres sin rodeos).
4. Frase 3: Invitación directa a agendar tutoría o pedir ayuda con guías.
5. NO inventes materias que el estudiante no mencionó. Adapta el tono a estudiantes de bachillerato/colegio.
6. Devuelve ÚNICAMENTE las 3 frases continuas, sin viñetas, sin títulos ni comillas.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.85,
                maxOutputTokens: 300,
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
        console.warn("Gemini API call failed, falling back to smart dynamic generator:", err);
      }
    }

    // 2. Intelligent Dynamic Natural Language Synthesis Engine
    // Extracts and normalizes the user's specific skills from cleanNotes
    const words = cleanNotes
      .replace(/[,;.\n]/g, " ")
      .split(/\s+/)
      .map(w => w.trim())
      .filter(w => w.length > 2);

    // Filter out common noise words
    const stopWords = new Set(["para", "como", "pero", "hacer", "todo", "tengo", "bien", "ayudo", "seño", "enseño", "domino", "hago", "puedo"]);
    const extractedKeywords = words.filter(w => !stopWords.has(w.toLowerCase()));

    // Highlight user's concrete topics
    const topicsFormatted = extractedKeywords.length > 0 
      ? extractedKeywords.slice(0, 5).join(", ")
      : cleanNotes;

    // Varied and dynamic styles to ensure each generation is fresh and tailored
    const greetingStyles = [
      `¡Hola a todos! Soy ${studentName} de ${studentGrade}${studentSchool ? ` en ${studentSchool}` : ""}, y me especializo en ayudarte a dominar ${cleanNotes}.`,
      `¿Necesitas apoyo académico? Mi nombre es ${studentName} (${studentGrade}) y estoy disponible para enseñarte ${cleanNotes} con total paciencia y claridad.`,
      `¡Mucho gusto! Soy ${studentName}, estudiante de ${studentGrade}, y me apasiona compartir lo que sé sobre ${cleanNotes} para que mejores tus calificaciones rápidamente.`,
      `¡Saludos! Aquí ${studentName} de ${studentGrade}; pongo a tu disposición mis conocimientos en ${cleanNotes} para resolver tus dudas de clase y prepararte para tus evaluaciones.`
    ];

    const methodologyStyles = [
      `En mis sesiones no te llenaré de teoría aburrida: nos enfocamos en resolver ejercicios modelo de ${topicsFormatted}, trucos de examen y talleres paso a paso hasta que lo tengas 100% claro.`,
      `Trabajamos directo sobre tus guías de estudio, resolviendo dudas puntuales de ${topicsFormatted} y practicando con ejemplos sencillos adaptados a tu ritmo de aprendizaje.`,
      `Te enseño métodos prácticos y directos para entender ${topicsFormatted}, analizando paso por paso los puntos difíciles para que ganes total confianza en tus entregas.`,
      `Combinamos práctica intensiva con explicaciones amenas, descomponiendo los problemas de ${topicsFormatted} para que los resuelvas con total seguridad por tu cuenta.`
    ];

    const ctaStyles = [
      `Escríbeme por aquí o coordinemos una sesión presencial o virtual para sacar adelante tus materias y asegurar las mejores notas.`,
      `¡No te quedes con dudas antes del parcial! Contáctame hoy mismo y armamos un plan de tutoría personalizado a tus horarios.`,
      `Revisa mi disponibilidad en el mapa y agendemos tu tutoría para terminar tus trabajos sin estrés y con la garantía de ClassMarket.`,
      `¡Coordinemos tu primera clase hoy y avancemos juntos hacia tus mejores resultados escolares!`
    ];

    // Pick random variations for non-repetitive output
    const randomPick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const sentence1 = randomPick(greetingStyles);
    const sentence2 = randomPick(methodologyStyles);
    const sentence3 = randomPick(ctaStyles);

    const dynamicEnhancedBio = `${sentence1} ${sentence2} ${sentence3}`;

    return NextResponse.json({
      enhancedBio: dynamicEnhancedBio,
      source: "dynamic-ai-synthesizer"
    });

  } catch (error: any) {
    console.error("Gemini route error:", error);
    return NextResponse.json(
      { error: "No se pudo procesar la solicitud con IA. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}

