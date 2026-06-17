import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth";
import { ok, badRequest } from "../utils/response";
import { logger } from "../utils/logger";

const router = Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL ?? "http://localhost:8001";

// POST /api/chatbot/chat — Proxy vers le service Python IA
router.post("/chat", authenticate, async (req, res) => {
  const schema = z.object({
    message: z.string().min(1).max(2000),
    lang: z.enum(["fr", "wo"]).default("fr"), // français ou wolof
    context: z.enum(["qos","complaint","general"]).default("general"),
    conversationId: z.string().uuid().optional(),
  });

  const body = schema.parse(req.body);

  try {
    const aiResponse = await fetch(`${AI_SERVICE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: body.message,
        lang: body.lang,
        context: body.context,
        conversation_id: body.conversationId,
        user_id: req.user!.userId,
      }),
      signal: AbortSignal.timeout(15000), // 15s timeout
    });

    if (!aiResponse.ok) {
      throw new Error(`AI service responded with ${aiResponse.status}`);
    }

    const data = await aiResponse.json();
    ok(res, data);
  } catch (err: any) {
    logger.warn("AI service unavailable, using fallback", { error: err.message });

    // Réponse de secours si le service Python est indisponible
    const fallback = getFallbackResponse(body.message, body.lang);
    ok(res, {
      reply: fallback,
      conversationId: body.conversationId,
      lang: body.lang,
      fallback: true,
    });
  }
});

// GET /api/chatbot/faq — Questions fréquentes
router.get("/faq", async (_req, res) => {
  const faq = [
    {
      q: "Comment déposer une plainte ?",
      a: "Rendez-vous dans la section 'Mes Plaintes' et cliquez sur 'Nouvelle plainte'. Décrivez votre problème, sélectionnez l'opérateur concerné et joignez des preuves si nécessaire.",
    },
    {
      q: "Quel est le délai de traitement d'une plainte ?",
      a: "L'ARTP s'engage à traiter votre plainte dans un délai de 15 jours ouvrables. Vous recevrez des notifications à chaque étape.",
    },
    {
      q: "Comment mesurer la qualité de mon réseau ?",
      a: "Utilisez la fonction 'Test de qualité' dans l'application. Assurez-vous d'être dans la zone à tester et appuyez sur 'Lancer le test'.",
    },
    {
      q: "Qu'est-ce qu'une zone blanche ?",
      a: "Une zone blanche est une zone sans couverture réseau. Si vous signalez une mesure avec une connexion très faible ou nulle, elle est automatiquement comptabilisée comme zone blanche.",
    },
    {
      q: "Comment contacter l'ARTP directement ?",
      a: "Vous pouvez contacter l'ARTP par téléphone au (+221) 33 849 08 08 ou par email à contact@artp.sn, ou via notre formulaire de plainte en ligne.",
    },
  ];
  ok(res, faq);
});

function getFallbackResponse(message: string, lang: "fr" | "wo"): string {
  const msg = message.toLowerCase();

  if (msg.includes("plainte") || msg.includes("problème") || msg.includes("complaint")) {
    return lang === "fr"
      ? "Pour déposer une plainte, accédez à la section 'Mes Plaintes' dans l'application. L'ARTP traitera votre dossier sous 15 jours ouvrables."
      : "Boo bëgg dëgg say liggéey, dem ci 'Say Plaintes' ci application bi.";
  }

  if (msg.includes("mesure") || msg.includes("qualité") || msg.includes("réseau") || msg.includes("test")) {
    return lang === "fr"
      ? "Pour mesurer la qualité de votre réseau, utilisez la fonction 'Test QoS' dans l'application. Vos résultats contribuent à améliorer la couverture au Sénégal."
      : "Boo bëgg xool sa réseau quality, jëfandikoo 'Test QoS' ci application bi.";
  }

  return lang === "fr"
    ? "Bonjour ! Je suis l'assistant ARTP. Je peux vous aider avec vos plaintes télécom ou mesures de qualité réseau. Comment puis-je vous aider ?"
    : "Bonjour ! Maa ngi dem ARTP assistant. Mangi dem jël ak sa plaintes télécom walla qualité réseau.";
}

export default router;
