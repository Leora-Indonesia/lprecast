import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

interface DocumentUpload {
  url: string
  fileName: string
  fileSize: number
  mimeType: string
}

interface DocumentsPayload {
  ktp: DocumentUpload | null
  npwp: DocumentUpload | null
  npwp_nomor: string | null
  nib: DocumentUpload | null
  nib_nomor: string | null
  siup_sbu: DocumentUpload | null
  company_profile: DocumentUpload | null
}

interface RegistrationPayload {
  registrationId: string
  company_info: {
    nama_perusahaan: string
    email: string
    nama_pic: string
    kontak_pic: string
    website?: string
    instagram?: string
    facebook?: string
    linkedin?: string
    contact_1: { no_hp: string; nama: string; jabatan: string }
    contact_2: { no_hp: string; nama: string; jabatan: string }
    contact_3?: { no_hp: string; nama: string; jabatan: string }
  }
  legal_documents: DocumentsPayload
  operational: {
    bank?: { bank_nama: string; bank_nomor: string; bank_atas_nama: string }
    factory_address?: {
      alamat_detail: string
      provinsi_name?: string
      kabupaten_name?: string
      kecamatan?: string
      kode_pos?: string
    }
    products?: Array<{
      name: string
      satuan: string
      price: number
      dimensions?: string
      material?: string
      finishing?: string
      berat?: number
      lead_time_days?: number
      moq?: number
      description?: string
    }>
    delivery_areas?: Array<{ province_id: string; city_id: string }>
    cost_inclusions?: Record<string, boolean>
    additional_costs?: Array<{
      description: string
      amount: number
      unit: string
    }>
  }
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
  supabaseAdmin: ReturnType<typeof createClient>,
  payload: EmailPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin.functions.invoke("send-email", {
      body: {
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        from: payload.from,
        fromName: payload.fromName,
        replyTo: payload.replyTo,
      },
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

async function sendVendorInviteEmail(
  supabaseAdmin: ReturnType<typeof createClient>,
  email: string,
  inviteUrl: string,
  companyName: string,
  picName: string
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Undangan Vendor LPrecast</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #16a34a; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">LPrecast</h1>
        <p style="color: white; margin: 5px 0 0;">Vendor Portal</p>
      </div>
      
      <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        <h2 style="color: #16a34a;">Selamat Datang di LPrecast Vendor Portal!</h2>
        
        <p>Halo <strong>${picName}</strong>,</p>
        
        <p>Pendaftaran vendor <strong>${companyName}</strong> telah kami terima. Untuk mengaktifkan akun vendor Anda, silakan klik tombol di bawah ini:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Aktifkan Akun
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280;">atau salin link berikut ke browser Anda:</p>
        <p style="font-size: 12px; word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
          ${inviteUrl}
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <h3 style="color: #374151;">Informasi Akun:</h3>
        <ul style="color: #6b7280;">
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Perusahaan:</strong> ${companyName}</li>
        </ul>
        
        <h3 style="color: #374151;">Langkah Selanjutnya:</h3>
        <ol style="color: #6b7280;">
          <li>Aktifkan akun Anda dengan mengklik tombol di atas</li>
          <li>Setel password untuk login</li>
          <li>Login ke portal vendor LPrecast</li>
          <li>Tunggu review dari tim kami untuk aktivasi penuh</li>
        </ol>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          Setelah akun aktif, Anda dapat:
        </p>
        <ul style="color: #6b7280; font-size: 14px;">
          <li>Melihat dan mengikuti tender</li>
          <li>Mengelola profil perusahaan</li>
          <li>Mengunggah dokumen legal</li>
          <li>Melacak status proyek</li>
        </ul>
        
        <p style="margin-top: 30px;">
          Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi tim kami.
        </p>
        
        <p>Salam,<br><strong>Tim LPrecast</strong></p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
        <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
        <p>&copy; ${new Date().getFullYear()} LPrecast. Hak cipta dilindungi.</p>
      </div>
    </body>
    </html>
  `

  return sendEmail(supabaseAdmin, {
    to: email,
    subject: `Aktifkan Akun Vendor Anda - ${companyName}`,
    html,
  })
}

async function sendAdminNewVendorEmail(
  supabaseAdmin: ReturnType<typeof createClient>,
  adminEmail: string,
  companyName: string,
  picName: string,
  registrationId: string
): Promise<{ success: boolean; error?: string }> {
  const adminDashboardUrl = `https://lprecast.com/admin/vendors/${registrationId}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pendaftaran Vendor Baru</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1f2937; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">LPrecast Admin</h1>
        <p style="color: #9ca3af; margin: 5px 0 0;">Notifikasi Sistem</p>
      </div>
      
      <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        <h2 style="color: #dc2626;">Pendaftaran Vendor Baru</h2>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Vendor baru telah mendaftar dan menunggu review Anda.</strong></p>
        </div>
        
        <h3 style="color: #374151;">Detail Vendor:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Nama Perusahaan:</strong></td>
            <td style="padding: 8px 0;">${companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>PIC:</strong></td>
            <td style="padding: 8px 0;">${picName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>ID Registrasi:</strong></td>
            <td style="padding: 8px 0; font-family: monospace;">${registrationId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Waktu:</strong></td>
            <td style="padding: 8px 0;">${new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })}</td>
          </tr>
        </table>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${adminDashboardUrl}" style="background-color: #1f2937; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Review Vendor
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #6b7280;">
          Mohon review dan verifikasi data vendor dalam waktu 1x24 jam.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
        <p>Email notifikasi otomatis dari sistem LPrecast.</p>
        <p>&copy; ${new Date().getFullYear()} LPrecast. Hak cipta dilindungi.</p>
      </div>
    </body>
    </html>
  `

  return sendEmail(supabaseAdmin, {
    to: adminEmail,
    subject: `[LPrecast] Vendor Baru: ${companyName} - Pending Review`,
    html,
  })
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const payload: RegistrationPayload = await req.json()

    if (!payload.registrationId || !payload.company_info) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    const { registrationId, company_info, legal_documents, operational } =
      payload

    console.log(`Processing vendor registration: ${registrationId}`)

    const {
      data: { user: authUser },
      error: authError,
    } = await supabaseAdmin.auth.admin.createUser({
      email: company_info.email,
      email_confirm: true,
      user_metadata: {
        nama: company_info.nama_pic,
        no_hp: company_info.kontak_pic,
        company_name: company_info.nama_perusahaan,
      },
      app_metadata: {
        stakeholder_type: "vendor",
      },
    })

    if (authError) {
      console.error("Error creating vendor user:", authError)
    } else if (authUser) {
      console.log(`Created vendor user: ${authUser.id}`)

      await supabaseAdmin
        .from("vendor_registrations")
        .update({ vendor_id: authUser.id })
        .eq("id", registrationId)

      await supabaseAdmin.from("vendor_profiles").insert({
        user_id: authUser.id,
        registration_id: registrationId,
        status: "suspended",
      })

      const inviteUrl = `https://lprecast.com/vendor/accept-invite?token=${registrationId}`
      const emailResult = await sendVendorInviteEmail(
        supabaseAdmin,
        company_info.email,
        inviteUrl,
        company_info.nama_perusahaan,
        company_info.nama_pic
      )
      console.log("Vendor invite email result:", emailResult)
    }

    const { data: adminUsers } = await supabaseAdmin
      .from("users")
      .select("id, email, nama")
      .eq("stakeholder_type", "internal")

    if (adminUsers && adminUsers.length > 0) {
      for (const admin of adminUsers) {
        try {
          await sendAdminNewVendorEmail(
            supabaseAdmin,
            admin.email,
            company_info.nama_perusahaan,
            company_info.nama_pic,
            registrationId
          )
        } catch (err) {
          console.error(`Error sending admin email to ${admin.email}:`, err)
        }
      }
    }

    console.log(`Completed processing for registration: ${registrationId}`)

    return new Response(
      JSON.stringify({ success: true, message: "Processing completed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error processing vendor registration:", error)
    return new Response(
      JSON.stringify({
        success: true,
        message: "Processing completed with errors",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
