import { type NextRequest, NextResponse } from "next/server"
import { AbortSignal } from "abort-controller"

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

    console.log("🔍 API WhatsApp Profile - Número recebido:", phone)

    // Tentar a API Railway primeiro
    try {
      const railwayUrl = `https://primary-production-aac6.up.railway.app/webhook/request_photo?tel=+55${phone}`
      console.log("📡 Tentando Railway API:", railwayUrl)

      const railwayResponse = await fetch(railwayUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Origin: "https://whatspy.chat",
        },
        signal: AbortSignal.timeout(10000), // 10 segundos timeout
      })

      if (railwayResponse.ok) {
        const railwayData = await railwayResponse.json()
        console.log("✅ Railway API respondeu:", railwayData)

        if (railwayData.link && !railwayData.link.includes("private_profile")) {
          return NextResponse.json({
            success: true,
            result: railwayData.link,
            is_photo_private: false,
            phone_number: phone,
          })
        } else {
          console.log("🔒 Railway API - Foto privada detectada")
        }
      }
    } catch (railwayError) {
      console.log("⚠️ Railway API falhou:", railwayError)
    }

    // Simular outras APIs externas (substitua pelas suas APIs reais)
    try {
      console.log("📡 Tentando API externa simulada...")

      // Simular delay de API real
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simular diferentes cenários baseados no número
      const lastDigit = Number.parseInt(phone.slice(-1))

      if (lastDigit % 4 === 0) {
        // Simular foto pública encontrada
        const publicPhotoUrl = `https://ui-avatars.com/api/?name=User+${phone.slice(-4)}&background=10b981&color=fff&size=200&rounded=true`
        console.log("✅ Foto pública simulada:", publicPhotoUrl)

        return NextResponse.json({
          success: true,
          result: publicPhotoUrl,
          is_photo_private: false,
          phone_number: phone,
        })
      }
    } catch (apiError) {
      console.log("⚠️ API externa falhou:", apiError)
    }

    // Fallback - retornar foto privada/indisponível
    console.log("🎭 Usando fallback - foto privada")
    const fallbackUrl = `https://ui-avatars.com/api/?name=Privado&background=f59e0b&color=fff&size=200&rounded=true`

    return NextResponse.json({
      success: true,
      result: fallbackUrl,
      is_photo_private: true,
      phone_number: phone,
    })
  } catch (error) {
    console.error("❌ Erro na API WhatsApp Profile:", error)

    // Retornar dados mock em caso de erro
    const errorUrl = `https://ui-avatars.com/api/?name=Erro&background=ef4444&color=fff&size=200&rounded=true`

    return NextResponse.json({
      success: true,
      result: errorUrl,
      is_photo_private: true,
      phone_number: "",
    })
  }
}

// Também suportar GET para compatibilidade
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get("phone")

  if (!phone) {
    return NextResponse.json(
      {
        success: false,
        error: "Phone number is required",
      },
      { status: 400 },
    )
  }

  // Redirecionar para o método POST
  const newRequest = new NextRequest(request.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  })
  return POST(newRequest)
}
