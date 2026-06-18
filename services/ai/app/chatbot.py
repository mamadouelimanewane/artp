"""
Chatbot bilingue français/wolof pour l'assistance ARTP.
Logique de règles avec détection d'intention.
Si ANTHROPIC_API_KEY est défini, utilise Claude pour des réponses génératives.
"""
from typing import Optional
import os

# ---------------------------------------------------------------------------
# Intentions et mots-clés
# ---------------------------------------------------------------------------
INTENTS: dict[str, dict[str, list[str]]] = {
    "plainte": {
        "fr": ["plainte", "problème", "réclamation", "déposer", "saisir", "signaler",
               "insatisfait", "arnaque", "fraude", "mauvais service"],
        "wo": ["plainte", "problème", "trouble", "deficit", "diggël"],
    },
    "qos": {
        "fr": ["qualité", "réseau", "mesure", "vitesse", "débit", "latence", "lent",
               "4g", "5g", "signal", "couverture", "test", "mbps", "internet"],
        "wo": ["qualité", "réseau", "vitesse", "signal", "test", "internet"],
    },
    "blind_spot": {
        "fr": ["zone blanche", "pas de réseau", "aucun signal", "pas de couverture",
               "réseau absent", "sans réseau"],
        "wo": ["réseau amul", "signal amul", "zone blanche"],
    },
    "operateur": {
        "fr": ["orange", "free", "expresso", "opérateur", "saga africa", "sonatel"],
        "wo": ["orange", "free", "expresso", "operateur"],
    },
    "contact": {
        "fr": ["contacter", "contact", "joindre", "artp", "adresse", "téléphone",
               "email", "mail", "siège"],
        "wo": ["contact", "artp", "téléphone", "adresse"],
    },
    "delai": {
        "fr": ["délai", "combien de temps", "quand", "durée", "traitement",
               "résolution", "réponse"],
        "wo": ["délai", "temps", "bañu", "quand"],
    },
    "reglementation": {
        "fr": ["réglementation", "loi", "décret", "obligation", "seuil", "norme",
               "conformité", "droit", "article"],
        "wo": ["loi", "norme", "seuil", "droit"],
    },
    "tarif": {
        "fr": ["tarif", "prix", "coût", "abonnement", "forfait", "facture",
               "surfacturation", "facturation"],
        "wo": ["tarif", "prix", "forfait", "facture"],
    },
}

# ---------------------------------------------------------------------------
# Réponses structurées: (texte, intent_label, suggestions)
# ---------------------------------------------------------------------------
RESPONSES: dict[str, dict[str, tuple]] = {
    "plainte": {
        "fr": (
            "Pour déposer une plainte auprès de l'ARTP :\n\n"
            "1. Ouvrez le portail Mon Réseau SN\n"
            "2. Allez dans 'Plaintes' → 'Nouvelle plainte'\n"
            "3. Sélectionnez votre opérateur et décrivez le problème\n"
            "4. Joignez des preuves (captures d'écran, factures)\n\n"
            "Votre dossier reçoit un numéro de suivi unique (ARTP-2026-XXXXX).\n"
            "Vous serez notifié par SMS à chaque étape.",
            "depot_plainte",
            ["Quel délai de traitement ?", "Quelles preuves joindre ?", "Suivre ma plainte"]
        ),
        "wo": (
            "Boo bëgg dëgg sa plainte ci ARTP :\n\n"
            "1. Jëfandikoo portail Mon Réseau SN\n"
            "2. Dem ci 'Plaintes' → 'Nouvelle plainte'\n"
            "3. Tann sa opérateur, def description problème bi\n"
            "4. Yónneel preuves (captures d'écran, factures)\n\n"
            "Sa dossier dafa am numéro suivi (ARTP-2026-XXXXX).\n"
            "Dañuy yónneel SMS ci kër ga bi étape.",
            "depot_plainte",
            ["Lan la délai traitement ?", "Naka lañu suivi plainte ?"]
        ),
    },
    "qos": {
        "fr": (
            "Pour mesurer la qualité de votre réseau :\n\n"
            "1. Restez dans la zone à tester\n"
            "2. Appuyez sur 'Tester mon réseau' dans l'application\n"
            "3. Le test mesure : débit descendant/montant, latence, jitter\n"
            "4. Vos résultats s'ajoutent à la carte nationale\n\n"
            "Seuils ARTP : débit ≥ 5 Mbps, latence ≤ 100 ms\n"
            "Vos mesures aident l'ARTP à améliorer la couverture nationale !",
            "mesure_qos",
            ["Signaler une zone blanche", "Voir le classement opérateurs", "Qu'est-ce que la latence ?"]
        ),
        "wo": (
            "Boo bëgg xool sa réseau quality :\n\n"
            "1. Dem ci zone boo bëgg test\n"
            "2. Topp 'Tester mon réseau' ci application bi\n"
            "3. Test bi xoolaat : vitesse, latence, signal\n"
            "4. Sa résultats dañuy xam carte nationale bi\n\n"
            "Seuils ARTP : débit ≥ 5 Mbps, latence ≤ 100 ms",
            "mesure_qos",
            ["Lan mooy zone blanche ?", "Naka lañu classement opérateurs ?"]
        ),
    },
    "blind_spot": {
        "fr": (
            "Une zone blanche est une zone sans couverture réseau.\n\n"
            "Pour la signaler :\n"
            "1. Lancez un test de mesure dans la zone concernée\n"
            "2. L'application détecte automatiquement l'absence de signal\n"
            "3. La zone est marquée sur la carte nationale\n\n"
            "L'ARTP utilise ces données pour exiger des opérateurs\n"
            "qu'ils améliorent la couverture dans les zones non desservies.",
            "zone_blanche",
            ["Déposer une plainte pour absence réseau", "Voir la carte de couverture"]
        ),
        "wo": (
            "Zone blanche mooy dëkk bu réseau amul.\n\n"
            "Boo bëgg signaler :\n"
            "1. Dëgg test ci zone jooni\n"
            "2. Application bi dafa xam bu réseau amul\n"
            "3. Zone bi dafa jot ci carte nationale\n\n"
            "ARTP jëfandikoo données yi ngir exiger opérateurs yi.",
            "zone_blanche",
            ["Dëgg plainte pour réseau amul"]
        ),
    },
    "contact": {
        "fr": (
            "Contacts ARTP Sénégal :\n\n"
            "Téléphone : (+221) 33 849 08 08\n"
            "Email : contact@artp.sn\n"
            "Site web : www.artp.sn\n"
            "Adresse : Immeuble Fayçal, km 5 Boulevard du Centenaire, Dakar\n\n"
            "Horaires : Lundi-Vendredi, 8h-17h",
            "contact_artp",
            ["Déposer une plainte en ligne", "Horaires d'ouverture ?"]
        ),
        "wo": (
            "Contacts ARTP Sénégal :\n\n"
            "Téléphone : (+221) 33 849 08 08\n"
            "Email : contact@artp.sn\n"
            "Site : www.artp.sn\n"
            "Adresse : Immeuble Fayçal, km 5, Dakar\n\n"
            "Horaires : Lundi-Vendredi, 8h-17h",
            "contact_artp",
            ["Dëgg plainte ci internet"]
        ),
    },
    "delai": {
        "fr": (
            "Délais de traitement des plaintes ARTP :\n\n"
            "- Accusé de réception : immédiat\n"
            "- Examen initial : 48h ouvrables\n"
            "- Transmission à l'opérateur : sous 5 jours\n"
            "- Résolution : 15 jours ouvrables maximum\n\n"
            "Vous êtes notifié par SMS à chaque étape.\n"
            "En cas de non-réponse de l'opérateur, l'ARTP peut prononcer des sanctions.",
            "delai_traitement",
            ["Suivre ma plainte", "Contacter l'ARTP"]
        ),
        "wo": (
            "Délais traitement plaintes ARTP :\n\n"
            "- Accusé réception : kanam\n"
            "- Examen : 48h ouvrables\n"
            "- Transmission opérateur : 5 fan\n"
            "- Résolution : 15 fan ouvrables\n\n"
            "Dañuy yónneel SMS ci kër ga bi étape.",
            "delai_traitement",
            ["Suivi plainte am", "Contact ARTP"]
        ),
    },
    "reglementation": {
        "fr": (
            "Réglementation télécom au Sénégal :\n\n"
            "L'ARTP veille au respect des obligations réglementaires :\n\n"
            "- Débit descendant minimum : 5 Mbps\n"
            "- Débit montant minimum : 1 Mbps\n"
            "- Latence maximale : 100 ms\n"
            "- Disponibilité réseau : 99% minimum\n"
            "- Couverture nationale : 95% de la population\n\n"
            "Texte de référence : Loi 2011-01 du 24 févr. 2011 portant Code des télécommunications.",
            "reglementation",
            ["Déposer une plainte non-conformité", "Contacter l'ARTP"]
        ),
        "wo": (
            "Réglementation télécom Sénégal :\n\n"
            "ARTP xoolaat obligations réglementaires yi :\n\n"
            "- Débit minimum : 5 Mbps\n"
            "- Latence maximum : 100 ms\n"
            "- Disponibilité réseau : 99% minimum",
            "reglementation",
            ["Dëgg plainte", "Contact ARTP"]
        ),
    },
    "tarif": {
        "fr": (
            "Problème de tarification ?\n\n"
            "Si vous constatez une surfacturation ou des frais non autorisés :\n\n"
            "1. Contactez d'abord votre opérateur (service client)\n"
            "2. Conservez votre facture détaillée\n"
            "3. Si non résolu sous 72h, déposez une plainte ARTP\n\n"
            "Catégorie : 'Facturation abusive' dans le formulaire de plainte.\n"
            "L'ARTP peut imposer des remboursements et sanctions.",
            "tarif_litige",
            ["Déposer une plainte facturation", "Contacter mon opérateur", "Contacts ARTP"]
        ),
        "wo": (
            "Problème tarification ?\n\n"
            "Boo xam surfacturation :\n"
            "1. Jooni jooni, contact sa opérateur\n"
            "2. Dëkkal sa facture\n"
            "3. Boo amul réponse ci 72h, dëgg plainte ARTP\n\n"
            "Catégorie : 'Facturation abusive' ci formulaire.",
            "tarif_litige",
            ["Dëgg plainte facturation", "Contacts ARTP"]
        ),
    },
    "operateur": {
        "fr": (
            "Opérateurs télécom agréés au Sénégal :\n\n"
            "- Orange Sénégal (Sonatel) — leader du marché\n"
            "- Free Sénégal (Saga Africa Holdings)\n"
            "- Expresso Télécom (Sudatel)\n\n"
            "Tous sont soumis aux obligations de l'ARTP.\n"
            "En cas de manquement, vous pouvez saisir l'ARTP.",
            "operateurs",
            ["Comparer les opérateurs", "Déposer une plainte", "Voir la carte QoS"]
        ),
        "wo": (
            "Opérateurs télécom Sénégal :\n\n"
            "- Orange Sénégal (Sonatel)\n"
            "- Free Sénégal (Saga Africa)\n"
            "- Expresso Télécom (Sudatel)\n\n"
            "Yëp dañuy topp obligations ARTP yi.",
            "operateurs",
            ["Dëgg plainte", "Xool carte QoS"]
        ),
    },
}

GREETING: dict[str, tuple] = {
    "fr": (
        "Bonjour ! Je suis l'assistant virtuel de l'ARTP.\n\n"
        "Je peux vous aider avec :\n"
        "- Déposer ou suivre une plainte télécom\n"
        "- Mesurer la qualité de votre réseau\n"
        "- Signaler une zone sans couverture\n"
        "- Vos droits et la réglementation\n"
        "- Contacter l'ARTP\n\n"
        "Comment puis-je vous aider ?",
        "greeting",
        ["Déposer une plainte", "Tester mon réseau", "Contacter l'ARTP", "Signaler une zone blanche"]
    ),
    "wo": (
        "Bonjour ! Maa ngi dem ARTP assistant.\n\n"
        "Mangi dem jël ak :\n"
        "- Dëgg walla suivi plainte télécom\n"
        "- Xool qualité sa réseau\n"
        "- Signaler zone bu réseau amul\n"
        "- Contact ARTP\n\n"
        "Ana lañoo mën jël ?",
        "greeting",
        ["Dëgg plainte", "Test réseau", "Contact ARTP", "Signaler zone blanche"]
    ),
}

DEFAULT: dict[str, tuple] = {
    "fr": (
        "Je n'ai pas bien compris votre demande. Voici ce que je peux faire :\n\n"
        "- Déposer ou suivre une plainte\n"
        "- Mesurer la qualité réseau\n"
        "- Signaler une zone blanche\n"
        "- Contacts ARTP\n"
        "- Réglementation et droits\n\n"
        "Reformulez votre question ou choisissez une option.",
        "unknown",
        ["Déposer une plainte", "Tester mon réseau", "Contacter l'ARTP", "Réglementation"]
    ),
    "wo": (
        "Dama sëgël comprendre sa demande. Ana lañoo mën def :\n\n"
        "- Dëgg walla suivi plainte\n"
        "- Test qualité réseau\n"
        "- Signaler zone blanche\n"
        "- Contacts ARTP\n\n"
        "Reformule sa question.",
        "unknown",
        ["Dëgg plainte", "Test réseau", "Contact ARTP"]
    ),
}


# ---------------------------------------------------------------------------
# Détection d'intention
# ---------------------------------------------------------------------------
def detect_intent(message: str, lang: str) -> Optional[str]:
    msg = message.lower()

    greetings = ["bonjour", "bonsoir", "salut", "hello", "hi", "assalamu",
                 "ana", "nanga def", "coucou", "salam"]
    if any(g in msg for g in greetings):
        return "greeting"

    for intent, keywords in INTENTS.items():
        kws = keywords.get(lang, keywords.get("fr", []))
        if any(kw in msg for kw in kws):
            return intent

    return None


# ---------------------------------------------------------------------------
# Intégration Claude API (optionnelle)
# ---------------------------------------------------------------------------
async def get_claude_response(message: str, lang: str) -> Optional[str]:
    """Appelle Claude claude-haiku-4-5-20251001 si ANTHROPIC_API_KEY est configuré."""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return None

    try:
        import httpx
        lang_label = "français" if lang == "fr" else "wolof ou français"
        system_prompt = (
            "Tu es l'assistant virtuel officiel de l'ARTP (Autorité de Régulation des "
            "Télécommunications et des Postes du Sénégal). Tu aides les citoyens et agents "
            "avec les plaintes télécom, la qualité de service, et la réglementation. "
            f"Réponds toujours en {lang_label}. "
            "Sois concis, professionnel et empathique. "
            "Contacts ARTP: téléphone (+221) 33 849 08 08, email contact@artp.sn. "
            "Seuils QoS ARTP: débit ≥ 5 Mbps, latence ≤ 100 ms, disponibilité ≥ 99%."
        )

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 500,
                    "system": system_prompt,
                    "messages": [{"role": "user", "content": message}],
                },
            )
            if response.status_code == 200:
                data = response.json()
                return data["content"][0]["text"]
    except Exception:
        pass

    return None


# ---------------------------------------------------------------------------
# Point d'entrée principal (async pour supporter l'appel Claude API)
# ---------------------------------------------------------------------------
async def get_response(
    message: str,
    lang: str,
    context: str
) -> tuple[str, Optional[str], list[str]]:
    """
    Retourne (réponse, intent, suggestions).
    1. Essaie Claude API si ANTHROPIC_API_KEY configuré
    2. Sinon: logique de règles basée sur les intentions
    """
    # 1. Tentative avec Claude API
    claude_reply = await get_claude_response(message, lang)
    if claude_reply:
        intent = detect_intent(message, lang) or "claude_ai"
        return claude_reply, intent, ["Déposer une plainte", "Contacter l'ARTP"]

    # 2. Logique de règles
    intent = detect_intent(message, lang)

    if intent == "greeting":
        return GREETING.get(lang, GREETING["fr"])

    if intent and intent in RESPONSES:
        r = RESPONSES[intent].get(lang, RESPONSES[intent].get("fr"))
        if r:
            return r

    return DEFAULT.get(lang, DEFAULT["fr"])
