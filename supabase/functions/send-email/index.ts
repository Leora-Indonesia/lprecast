import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

interface EmailPayload {
  to: string | string[]
  subject: string
  html: string
  from?: string
  fromName?: string
  replyTo?: string
}

async function sendEmail(
  payload: EmailPayload
): Promise<{ success: boolean; error?: string }> {
  const {
    to,
    subject,
    html,
    from = Deno.env.get("SMTP_FROM") || "noreply@lprecast.com",
    fromName = Deno.env.get("SMTP_FROM_NAME") || "LPrecast",
    replyTo = Deno.env.get("SMTP_REPLY_TO") || "support@lprecast.com",
  } = payload

  const smtpHost = Deno.env.get("SMTP_HOST")
  const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587")
  const smtpUser = Deno.env.get("SMTP_USER")
  const smtpPass = Deno.env.get("SMTP_PASS")

  if (!smtpHost || !smtpUser || !smtpPass) {
    return { success: false, error: "SMTP configuration is missing" }
  }

  const client = new SmtpClient()

  try {
    await client.connect({
      hostname: smtpHost,
      port: smtpPort,
      username: smtpUser,
      password: smtpPass,
    })

    const recipients = Array.isArray(to) ? to : [to]

    await client.send({
      from: `${fromName} <${from}>`,
      to: recipients.join(", "),
      replyTo: replyTo,
      subject: subject,
      html: html,
    })

    await client.close()

    return { success: true }
  } catch (error) {
    await client.close()
    console.error("SMTP Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const payload: EmailPayload = await req.json()

    if (!payload.to || !payload.subject || !payload.html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, html" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const result = await sendEmail(payload)

    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
