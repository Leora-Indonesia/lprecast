import { createAdminClient } from "@/lib/supabase/admin"

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
  fromName?: string
}

export async function sendEmail(
  params: SendEmailParams
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    const { error } = await supabase.functions.invoke("send-email", {
      body: {
        to: params.to,
        subject: params.subject,
        html: params.html,
        from: params.from,
        fromName: params.fromName,
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

export async function sendVendorInviteEmail(
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

  return sendEmail({
    to: email,
    subject: `Aktifkan Akun Vendor Anda - ${companyName}`,
    html,
  })
}

export async function sendAdminNewVendorEmail(
  adminEmail: string,
  companyName: string,
  picName: string,
  registrationId: string
): Promise<{ success: boolean; error?: string }> {
  const adminDashboardUrl = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/admin/vendors/${registrationId}`

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

  return sendEmail({
    to: adminEmail,
    subject: `[LPrecast] Vendor Baru: ${companyName} - Pending Review`,
    html,
  })
}

export async function sendVendorStatusEmail(
  email: string,
  companyName: string,
  status: "approved" | "rejected" | "revision_requested",
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const statusConfig = {
    approved: {
      subject: `Pendaftaran Vendor Disetujui - ${companyName}`,
      title: "Selamat! Pendaftaran Vendor Disetujui",
      color: "#16a34a",
      bgColor: "#f0fdf4",
      borderColor: "#16a34a",
      message:
        "Pendaftaran vendor Anda telah disetujui. Akun Anda sekarang aktif dan dapat digunakan.",
    },
    rejected: {
      subject: `Pendaftaran Vendor Ditolak - ${companyName}`,
      title: "Pendaftaran Vendor Ditolak",
      color: "#dc2626",
      bgColor: "#fef2f2",
      borderColor: "#dc2626",
      message: "Mohon maaf, pendaftaran vendor Anda telah ditolak.",
    },
    revision_requested: {
      subject: `Revisi Diperlukan - ${companyName}`,
      title: "Revisi Diperlukan",
      color: "#d97706",
      bgColor: "#fffbeb",
      borderColor: "#d97706",
      message:
        "Pendaftaran vendor Anda memerlukan revisi. Silakan perbarui data Anda.",
    },
  }

  const config = statusConfig[status]
  const loginUrl = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/vendor/login`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${config.subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: ${config.color}; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">LPrecast</h1>
        <p style="color: white; margin: 5px 0 0;">Vendor Portal</p>
      </div>
      
      <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        <h2 style="color: ${config.color};">${config.title}</h2>
        
        <div style="background-color: ${config.bgColor}; border-left: 4px solid ${config.borderColor}; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;"><strong>${companyName}</strong></p>
          <p style="margin: 5px 0 0;">${config.message}</p>
        </div>
        
        ${
          notes
            ? `
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>Catatan dari Admin:</strong></p>
          <p style="margin: 5px 0 0;">${notes}</p>
        </div>
        `
            : ""
        }
        
        ${
          status === "approved"
            ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Login ke Portal Vendor
          </a>
        </div>
        `
            : ""
        }
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #6b7280;">
          ${
            status === "approved"
              ? "Anda sekarang dapat login dan mulai menggunakan portal vendor LPrecast."
              : "Silakan hubungi tim kami jika Anda memiliki pertanyaan."
          }
        </p>
        
        <p>Salam,<br><strong>Tim LPrecast</strong></p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
        <p>&copy; ${new Date().getFullYear()} LPrecast. Hak cipta dilindungi.</p>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: config.subject,
    html,
  })
}
