import { type NextRequest, NextResponse } from "next/server"

interface WhatsAppProfileResponse {
  success: boolean
  result?: string
  is_photo_private?: boolean
  phone_number?: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone number is required",
        },
        { status: 400 },
      )
    }

    // Simular chamada para API externa (substitua pela sua API real)
    const response = await fetch("https://api.whatsapp-profile.com/get-photo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_API_KEY", // Substitua pela sua chave
      },
      body: JSON.stringify({ phone }),
    })

    if (!response.ok) {
      // Em caso de erro da API, retornar dados mock
      return NextResponse.json({
        success: true,
        result: https://ui-avatars.com/api/?name=User&background=1e40af&color=fff&size=200,
        is_photo_private: true,
        phone_number: phone,
      })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      result: data.photo_url || https://ui-avatars.com/api/?name=User&background=1e40af&color=fff&size=200,
      is_photo_private: data.is_private || false,
      phone_number: phone,
    })
  } catch (error) {
    console.error("Error fetching WhatsApp profile:", error)

    // Retornar dados mock em caso de erro
    return NextResponse.json({
      success: true,
      result: https://ui-avatars.com/api/?name=User&background=1e40af&color=fff&size=200,
      is_photo_private: true,
      phone_number: request.body?.phone || "",
    })
  }
}
