export interface Env {
  RESEND_API_KEY: string;
  TO_EMAIL: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 1. Configuration des Headers pour le CORS (Sécurité)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // En production, tu pourras mettre 'https://fvauchotsoft.com'
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Gestion de la requête "Preflight" OPTIONS faite par le navigateur
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Sécurité : On rejette tout ce qui n'est pas du POST
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Méthode non autorisée" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      // 2. Récupération des données JSON envoyées par le formulaire contact.tsx
      const body = await request.json() as any;
      const { prenomNom, phone, courriel, project, message } = body;

      // Validation rapide des champs obligatoires
      if (!prenomNom || !courriel || !message) {
        return new Response(JSON.stringify({ error: "Champs obligatoires manquants" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 3. Envoi du courriel via l'API HTTP de Resend
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Site Web <onboarding@resend.dev>", // Laisse onboarding au début, tu changeras après validation DNS
          to: [env.TO_EMAIL], // Ton adresse e-mail de réception
          subject: `✨ Nouvelle demande de projet : ${project}`,
          html: `
            <h3>Nouvelle demande de contact</h3>
            <p><strong>Nom / Prénom :</strong> ${prenomNom}</p>
            <p><strong>E-mail :</strong> ${courriel}</p>
            <p><strong>Téléphone :</strong> ${phone || "Non renseigné"}</p>
            <p><strong>Type de projet :</strong> ${project}</p>
            <p><strong>Message :</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          `,
        }),
      });

      const resendResult = await resendResponse.json() as any;

      if (!resendResponse.ok) {
        throw new Error(resendResult.message || "Erreur provenant de Resend");
      }

      // Tout s'est bien passé
      return new Response(JSON.stringify({ success: true, id: resendResult.id }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message || "Erreur interne au serveur" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};