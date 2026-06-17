"""
Chatbot bilingue français/wolof pour l'assistance ARTP.
Basé sur une logique de règles avec intention détectée.
En production: intégrer l'API Claude (anthropic) pour des réponses génératives.
"""
from typing import Optional

# Mots clés par intention et langue
INTENTS = {
    "plainte": {
        "fr": ["plainte","problème","réclamation","déposer","saisir","signaler","insatisfait","arnaque"],
        "wo": ["plainte","problème","trouble","deficit"],
    },
    "qos": {
        "fr": ["qualité","réseau","mesure","vitesse","débit","latence","lent","4g","signal","couverture","test"],
        "wo": ["qualité","réseau","vitesse","signal","test"],
    },
    "blind_spot": {
        "fr": ["zone blanche","pas de réseau","aucun signal","pas de couverture","réseau absent"],
        "wo": ["réseau amul","signal amul"],
    },
    "operateur": {
        "fr": ["orange","free","expresso","opérateur"],
        "wo": ["orange","free","expresso"],
    },
    "contact": {
        "fr": ["contacter","contact","joindre","artp","adresse","téléphone","email"],
        "wo": ["contact","artp"],
    },
    "delai": {
        "fr": ["délai","combien de temps","quand","durée","traitement"],
        "wo": ["délai","temps","bañu"],
    },
}

RESPONSES = {
    "plainte": {
        "fr": (
            "Pour déposer une plainte auprès de l'ARTP :\n"
            "1. Ouvrez l'application Mon Réseau SN\n"
            "2. Allez dans 'Mes Plaintes' → 'Nouvelle plainte'\n"
            "3. Sélectionnez votre opérateur et décrivez le problème\n"
            "4. Joignez des preuves (captures d'écran, factures)\n\n"
            "Votre dossier reçoit un numéro de suivi unique (ex: ARTP-2026-XXXXX).",
            "depot_plainte",
            ["Comment suivre ma plainte ?", "Quel délai de traitement ?", "Quelles preuves joindre ?"]
        ),
        "wo": (
            "Boo bëgg dëgg sa plainte ci ARTP :\n"
            "1. Jëfandikoo application Mon Réseau SN\n"
            "2. Dem ci 'Mes Plaintes' → 'Nouvelle plainte'\n"
            "3. Tann sa opérateur, def description problème bi\n"
            "4. Yónneel preuves (captures d'écran, factures)\n\n"
            "Sa dossier dafa am numéro (ARTP-2026-XXXXX).",
            "depot_plainte",
            ["Lan la délai traitement ?", "Naka lañu suivi plainte ?"]
        ),
    },
    "qos": {
        "fr": (
            "Pour mesurer la qualité de votre réseau :\n"
            "1. Restez dans la zone à tester\n"
            "2. Appuyez sur 'Tester mon réseau' dans l'application\n"
            "3. Le test mesure : débit, latence, signal et jitter\n"
            "4. Vos résultats s'ajoutent à la carte nationale\n\n"
            "Vos mesures aident l'ARTP à améliorer la couverture au Sénégal !",
            "mesure_qos",
            ["Qu'est-ce que la latence ?", "Comment signaler une zone blanche ?", "Voir le classement des opérateurs"]
        ),
        "wo": (
            "Boo bëgg xool sa réseau quality :\n"
            "1. Dem ci zone boo bëgg test\n"
            "2. Topp 'Tester mon réseau' ci application bi\n"
            "3. Test bi xoolaat : vitesse, latence, signal\n"
            "4. Sa résultats dañuy xam carte nationale bi\n\n"
            "Say mesures dañuy jàpp ARTP amna coverage bu baax Sénégal!",
            "mesure_qos",
            ["Lan mooy zone blanche ?", "Naka lañu classement opérateurs ?"]
        ),
    },
    "blind_spot": {
        "fr": (
            "Une zone blanche est une zone sans couverture réseau.\n"
            "Pour la signaler :\n"
            "1. Lancez un test de mesure dans la zone concernée\n"
            "2. L'application détecte automatiquement l'absence de signal\n"
            "3. La zone est marquée sur la carte nationale\n\n"
            "L'ARTP utilise ces données pour exiger des opérateurs qu'ils améliorent la couverture.",
            "zone_blanche",
            ["Déposer une plainte pour absence de réseau", "Voir la carte de couverture"]
        ),
        "wo": (
            "Zone blanche mooy dëkk bu réseau amul.\n"
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
            "Contacts ARTP Sénégal :\n"
            "📞 Téléphone : (+221) 33 849 08 08\n"
            "📧 Email : contact@artp.sn\n"
            "🌐 Site web : www.artp.sn\n"
            "📍 Adresse : Immeuble Fayçal, km 5 Boulevard du Centenaire, Dakar",
            "contact_artp",
            ["Déposer une plainte en ligne", "Horaires d'ouverture ?"]
        ),
        "wo": (
            "Contacts ARTP Sénégal :\n"
            "📞 Téléphone : (+221) 33 849 08 08\n"
            "📧 Email : contact@artp.sn\n"
            "🌐 Site : www.artp.sn\n"
            "📍 Adresse : Immeuble Fayçal, km 5 Boulevard du Centenaire, Dakar",
            "contact_artp",
            ["Dëgg plainte ci internet"]
        ),
    },
    "delai": {
        "fr": (
            "Délais de traitement des plaintes ARTP :\n"
            "• Accusé de réception : immédiat\n"
            "• Examen initial : 48h ouvrables\n"
            "• Transmission à l'opérateur : sous 5 jours\n"
            "• Résolution : 15 jours ouvrables maximum\n\n"
            "Vous êtes notifié par SMS à chaque étape.",
            "delai_traitement",
            ["Suivre ma plainte", "Contacter l'ARTP"]
        ),
        "wo": (
            "Délais traitement plaintes ARTP :\n"
            "• Accusé réception : kanam\n"
            "• Examen : 48h ouvrables\n"
            "• Transmission opérateur : 5 fan\n"
            "• Résolution : 15 fan ouvrables\n\n"
            "Dañuy yónneel SMS ci kër ga bi étape.",
            "delai_traitement",
            ["Suivi plainte am", "Contact ARTP"]
        ),
    },
}

GREETING = {
    "fr": (
        "Bonjour ! Je suis l'assistant virtuel de l'ARTP — l'Autorité de Régulation des Télécommunications du Sénégal.\n\n"
        "Je peux vous aider à :\n"
        "• Déposer une plainte télécom\n"
        "• Mesurer la qualité de votre réseau\n"
        "• Signaler une zone sans couverture\n"
        "• Obtenir des informations sur vos droits\n\n"
        "Comment puis-je vous aider ?",
        "greeting",
        ["Déposer une plainte", "Tester mon réseau", "Contacter l'ARTP", "Signaler une zone blanche"]
    ),
    "wo": (
        "Bonjour ! Maa ngi dem ARTP assistant — Autorité de Régulation des Télécommunications du Sénégal.\n\n"
        "Mangi dem jëlal ak :\n"
        "• Dëgg plainte télécom\n"
        "• Xool qualité sa réseau\n"
        "• Signaler zone bu réseau amul\n"
        "• Xam sa droits\n\n"
        "Ana lañoo mën jëlal ?",
        "greeting",
        ["Dëgg plainte", "Test réseau", "Contact ARTP", "Signaler zone blanche"]
    ),
}

DEFAULT = {
    "fr": (
        "Je n'ai pas bien compris votre demande. Voici ce que je peux faire pour vous :\n"
        "• 📋 Déposer ou suivre une plainte\n"
        "• 📶 Mesurer la qualité de votre réseau\n"
        "• 🗺️ Signaler une zone blanche\n"
        "• 📞 Vous donner les contacts ARTP\n\n"
        "Reformulez votre question ou choisissez une option ci-dessus.",
        "unknown",
        ["Déposer une plainte", "Tester mon réseau", "Contacter l'ARTP"]
    ),
    "wo": (
        "Dama sëgël comprendeel sa demande. Ana lañoo mën def :\n"
        "• 📋 Dëgg walla suivi plainte\n"
        "• 📶 Test qualité sa réseau\n"
        "• 🗺️ Signaler zone blanche\n"
        "• 📞 Contacts ARTP\n\n"
        "Reformule sa question.",
        "unknown",
        ["Dëgg plainte", "Test réseau", "Contact ARTP"]
    ),
}


def detect_intent(message: str, lang: str) -> Optional[str]:
    msg = message.lower()
    for intent, keywords in INTENTS.items():
        kws = keywords.get(lang, keywords.get("fr", []))
        if any(kw in msg for kw in kws):
            return intent
    greetings = ["bonjour","bonsoir","salut","hello","hi","assalamu","ana","nanga def"]
    if any(g in msg for g in greetings):
        return "greeting"
    return None


def get_response(message: str, lang: str, context: str) -> tuple[str, Optional[str], list[str]]:
    intent = detect_intent(message, lang)

    if intent == "greeting":
        r = GREETING.get(lang, GREETING["fr"])
        return r

    if intent and intent in RESPONSES:
        r = RESPONSES[intent].get(lang, RESPONSES[intent].get("fr"))
        if r:
            return r

    return DEFAULT.get(lang, DEFAULT["fr"])
