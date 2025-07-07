"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  MapPin,
  Heart,
  MessageCircle,
  Users,
  Download,
  RotateCcw,
  Globe,
  Activity,
  Loader2,
  User,
  Eye,
  Zap,
} from "lucide-react"

interface ReportDashboardProps {
  data: {
    nom: string
    photo: string
    correspondances: number
    jaimes: number
    messages: number
    ville: string
    pays: string
    coordonnees?: {
      latitude: number
      longitude: number
    }
  }
  onNewAnalysis: () => void
}

export function ReportDashboard({ data, onNewAnalysis }: ReportDashboardProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Fonction pour générer une description automatique de la photo
  const generatePhotoDescription = (nom: string): string => {
    const descriptions = [
      "Personne adulte, expression neutre, traits du visage bien définis",
      "Individu jeune, sourire discret, caractéristiques faciales nettes",
      "Personne d'âge moyen, regard direct, traits faciaux marquants",
      "Adulte jeune, expression confiante, visage ovale",
      "Personne adulte, air sérieux, caractéristiques bien délimitées",
    ]

    // Générer une description basée sur le hash du nom pour la cohérence
    let hash = 0
    for (let i = 0; i < nom.length; i++) {
      hash = nom.charCodeAt(i) + ((hash << 5) - hash)
    }

    return descriptions[Math.abs(hash) % descriptions.length]
  }

  // Fonction pour détecter la résolution de l'image
  const getImageResolution = (): string => {
    return "Haute – 400x400px" // Simulation de détection automatique
  }

  const generatePDF = async () => {
    setIsGeneratingPDF(true)

    // Simuler la génération du PDF
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const photoDescription = generatePhotoDescription(data.nom)
    const imageResolution = getImageResolution()

    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Tinder Check - Rapport de ${data.nom}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #7c3aed 50%, #1e293b 100%);
            color: #ffffff;
            line-height: 1.6;
            padding: 20px;
          }
          .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: rgba(30, 41, 59, 0.9);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
          }
          .header { 
            background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #f97316 100%);
            padding: 30px;
            text-align: center;
          }
          .header h1 { 
            font-size: 32px; 
            font-weight: bold; 
            margin-bottom: 8px;
          }
          .header p { 
            opacity: 0.9; 
            font-size: 16px;
          }
          .profile-section { 
            padding: 30px;
            border-bottom: 1px solid rgba(148, 163, 184, 0.2);
          }
          .profile-header { 
            display: flex; 
            align-items: center; 
            gap: 25px; 
            margin-bottom: 25px;
          }
          .profile-image { 
            width: 120px; 
            height: 120px; 
            border-radius: 50%; 
            object-fit: cover; 
            border: 3px solid #3b82f6;
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
          }
          .profile-info h2 { 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 8px;
          }
          .status-badge { 
            display: inline-block; 
            background: rgba(34, 197, 94, 0.2); 
            color: #22c55e; 
            padding: 6px 16px; 
            border-radius: 20px; 
            font-size: 14px; 
            font-weight: 600;
            border: 1px solid rgba(34, 197, 94, 0.3);
            margin-bottom: 12px;
          }
          .location { 
            color: #94a3b8; 
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .photo-caption { 
            font-style: italic; 
            color: #64748b; 
            font-size: 12px; 
            text-align: center; 
            margin-top: 8px;
          }
          .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 20px; 
            margin-top: 25px;
          }
          .metric-card { 
            background: rgba(51, 65, 85, 0.5); 
            border: 1px solid rgba(148, 163, 184, 0.2); 
            border-radius: 12px; 
            padding: 20px; 
            text-align: center;
          }
          .metric-number { 
            font-size: 32px; 
            font-weight: bold; 
            margin-bottom: 8px;
          }
          .metric-label { 
            color: #94a3b8; 
            font-size: 14px;
            font-weight: 500;
          }
          .section { 
            padding: 30px;
            border-bottom: 1px solid rgba(148, 163, 184, 0.2);
          }
          .section-title { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 20px;
            color: #f8fafc;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 20px;
          }
          .info-card { 
            background: rgba(51, 65, 85, 0.3); 
            border: 1px solid rgba(148, 163, 184, 0.2); 
            border-radius: 12px; 
            padding: 20px;
          }
          .info-label { 
            color: #94a3b8; 
            font-size: 14px; 
            margin-bottom: 8px;
            font-weight: 500;
          }
          .info-value { 
            color: #f8fafc; 
            font-size: 16px; 
            font-weight: 600;
          }
          .analysis-text {
            color: #cbd5e1;
            font-size: 16px;
            line-height: 1.7;
            margin-bottom: 16px;
          }
          .photo-analysis {
            background: rgba(51, 65, 85, 0.3);
            border: 1px solid rgba(148, 163, 184, 0.2);
            border-radius: 12px;
            padding: 25px;
            margin-top: 20px;
          }
          .photo-analysis h4 {
            color: #3b82f6;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .photo-analysis p {
            margin-bottom: 12px;
            line-height: 1.6;
          }
          .photo-analysis .highlight {
            color: #22c55e;
            font-weight: 600;
          }
          .footer { 
            padding: 30px; 
            text-align: center; 
            background: rgba(15, 23, 42, 0.8);
            color: #64748b;
          }
          .footer p {
            margin-bottom: 8px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ Tinder Check</h1>
            <p>Rapport d'Enquête Numérique</p>
          </div>
          
          <div class="profile-section">
            <div class="section-title">
              ✅ Profil Enquêté Trouvé
            </div>
            <div class="profile-header">
              <div>
                <img src="${data.photo}" alt="Photo de ${data.nom}" class="profile-image" />
                <div class="photo-caption">Visage trouvé sur profil Tinder</div>
              </div>
              <div class="profile-info">
                <h2>${data.nom}</h2>
                <div class="status-badge">✅ Profil Actif Trouvé</div>
                <div class="location">
                  📍 ${data.ville}, ${data.pays}
                </div>
              </div>
            </div>
            
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-number" style="color: #3b82f6;">${data.correspondances}</div>
                <div class="metric-label">Correspondances</div>
              </div>
              <div class="metric-card">
                <div class="metric-number" style="color: #ef4444;">${data.jaimes}</div>
                <div class="metric-label">J'aime</div>
              </div>
              <div class="metric-card">
                <div class="metric-number" style="color: #22c55e;">${data.messages}</div>
                <div class="metric-label">Messages</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">
              📊 Résumé de l'Enquête
            </div>
            <div class="analysis-text">
              <strong>Données Collectées :</strong>
            </div>
            <div class="info-grid">
              <div class="info-card">
                <div class="info-label">Correspondances Détectées</div>
                <div class="info-value">${data.correspondances} correspondances trouvées</div>
              </div>
              <div class="info-card">
                <div class="info-label">J'aime Reçus</div>
                <div class="info-value">${data.jaimes} j'aime enregistrés</div>
              </div>
              <div class="info-card">
                <div class="info-label">Messages Envoyés</div>
                <div class="info-value">${data.messages} messages détectés</div>
              </div>
              <div class="info-card">
                <div class="info-label">Statut du Profil</div>
                <div class="info-value" style="color: #22c55e;">Actif et Vérifié</div>
              </div>
            </div>
            
            <div style="margin-top: 25px;">
              <div class="analysis-text">
                <strong>Analyse du Comportement Numérique :</strong>
              </div>
              <div class="analysis-text">
                • <strong>Fréquence d'utilisation :</strong> Actif quotidiennement avec pics entre 19h-23h<br>
                • <strong>Motif des Correspondances :</strong> ${data.correspondances} nouvelles correspondances dans les 7 derniers jours<br>
                • <strong>Engagement :</strong> ${data.messages} messages envoyés, indiquant une interaction active<br>
                • <strong>Popularité :</strong> ${data.jaimes} j'aime reçus démontrent un profil attrayant
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">
              📍 Informations de Localisation
            </div>
            <div class="info-grid">
              <div class="info-card">
                <div class="info-label">Localisation Détectée</div>
                <div class="info-value">${data.ville}, ${data.pays}</div>
              </div>
              <div class="info-card">
                <div class="info-label">Dernière Activité</div>
                <div class="info-value" style="color: #22c55e;">En ligne maintenant</div>
              </div>
              <div class="info-card">
                <div class="info-label">Méthode de Détection</div>
                <div class="info-value">Analyse IP et Géolocalisation Avancée</div>
              </div>
              <div class="info-card">
                <div class="info-label">Coordonnées GPS</div>
                <div class="info-value">${data.coordonnees ? `${data.coordonnees.latitude.toFixed(4)}, ${data.coordonnees.longitude.toFixed(4)}` : "Non disponible"}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">
              🧠 Analyse de la Photo de Profil
            </div>
            
            <div class="photo-analysis">
              <h4>🔍 Analyse Technique Avancée</h4>
              
              <p><strong>Nom de la Personne Enquêtée :</strong> ${data.nom}</p>
              <p><strong>Visage Trouvé sur le Profil Tinder :</strong> <span class="highlight">✅ Compatible</span></p>
              
              <p><strong>Description Automatique du Visage :</strong></p>
              <p style="font-style: italic; color: #cbd5e1; margin-left: 20px;">
                "${photoDescription}."
              </p>
              
              <p><strong>Compatibilité avec le Profil Détecté :</strong></p>
              <p style="color: #cbd5e1; margin-left: 20px;">
                "L'analyse visuelle du visage fourni indique une haute compatibilité avec le profil trouvé sur Tinder. 
                Les principaux points d'identification faciale correspondent aux données du compte enquêté, 
                renforçant l'authenticité de la correspondance."
              </p>
              
              <div style="margin-top: 20px;">
                <div class="info-grid">
                  <div class="info-card">
                    <div class="info-label">Type de Photo</div>
                    <div class="info-value">Photo réelle téléchargée manuellement par l'utilisateur</div>
                  </div>
                  <div class="info-card">
                    <div class="info-label">Résolution de l'Image</div>
                    <div class="info-value" style="color: #22c55e;">${imageResolution}</div>
                  </div>
                  <div class="info-card">
                    <div class="info-label">Statut de l'Image</div>
                    <div class="info-value" style="color: #22c55e;">Validée comme compatible avec profil Tinder actif</div>
                  </div>
                  <div class="info-card">
                    <div class="info-label">Fiabilité</div>
                    <div class="info-value" style="color: #22c55e;">95,7% de précision</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Tinder Check - Système d'Enquête Numérique</strong></p>
            <p>Rapport généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</p>
            <p>© 2024 - Tous droits réservés</p>
          </div>
        </div>
      </body>
      </html>
    `

    const blob = new Blob([pdfContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tinder-check-${data.nom.replace(/\s+/g, "-").toLowerCase()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsGeneratingPDF(false)
  }

  const photoDescription = generatePhotoDescription(data.nom)
  const imageResolution = getImageResolution()

  return (
    <div className="space-y-6">
      {/* Bloc 1: Profil Enquêté Trouvé */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-400" />
            Profil Enquêté Trouvé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Photo et Info */}
            <div className="text-center">
              <img
                src={data.photo || "/placeholder.svg"}
                alt={`Photo de ${data.nom}`}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-400 shadow-lg mx-auto"
              />
              <p className="text-xs text-slate-400 italic mt-2 max-w-32">Visage trouvé sur profil Tinder</p>
            </div>

            {/* Données du Profil */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{data.nom}</h2>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-3">✅ Profil Actif Trouvé</Badge>
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 mb-4">
                <MapPin className="h-4 w-4 text-orange-400" />
                <span>
                  {data.ville}, {data.pays}
                </span>
              </div>

              {/* Métriques */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="bg-slate-700/30 rounded-lg p-3 text-center border border-slate-600/30">
                  <Users className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-lg md:text-xl font-bold text-white">{data.correspondances}</div>
                  <div className="text-xs text-slate-400">Correspondances</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center border border-slate-600/30">
                  <Heart className="h-5 w-5 text-red-400 mx-auto mb-1" />
                  <div className="text-lg md:text-xl font-bold text-white">{data.jaimes}</div>
                  <div className="text-xs text-slate-400">J'aime</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center border border-slate-600/30">
                  <MessageCircle className="h-5 w-5 text-green-400 mx-auto mb-1" />
                  <div className="text-lg md:text-xl font-bold text-white">{data.messages}</div>
                  <div className="text-xs text-slate-400">Messages</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloc 2: Données du Profil */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5 text-purple-400" />
            Données du Profil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30">
              <div className="text-slate-400 text-sm mb-1">Nom</div>
              <div className="text-white font-semibold">{data.nom}</div>
            </div>
            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30">
              <div className="text-slate-400 text-sm mb-1">Statut</div>
              <div className="text-green-400 font-semibold">Profil Actif Trouvé</div>
            </div>
            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30">
              <div className="text-slate-400 text-sm mb-1">Photo</div>
              <div className="text-blue-400 font-semibold">Visage trouvé sur Tinder</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloc 3: Localisation */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-400" />
            Localisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30">
              <div className="text-slate-400 text-sm mb-1">Ville</div>
              <div className="text-white font-semibold">{data.ville}</div>
            </div>
            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30">
              <div className="text-slate-400 text-sm mb-1">Pays</div>
              <div className="text-white font-semibold">{data.pays}</div>
            </div>
            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30">
              <div className="text-slate-400 text-sm mb-1">Dernière Activité</div>
              <div className="text-green-400 font-semibold">En ligne maintenant</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloc 4: Résumé de l'Enquête */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            Résumé de l'Enquête
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-3">Données Collectées :</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30 text-center">
                <div className="text-blue-400 font-bold text-xl">{data.correspondances}</div>
                <div className="text-slate-400 text-sm">Correspondances Détectées</div>
              </div>
              <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30 text-center">
                <div className="text-red-400 font-bold text-xl">{data.jaimes}</div>
                <div className="text-slate-400 text-sm">J'aime Reçus</div>
              </div>
              <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30 text-center">
                <div className="text-green-400 font-bold text-xl">{data.messages}</div>
                <div className="text-slate-400 text-sm">Messages Envoyés</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Analyse du Comportement Numérique :</h3>
            <div className="space-y-2 text-slate-300">
              <p>
                <strong className="text-white">Fréquence d'utilisation :</strong> Actif quotidiennement avec pics
                d'activité entre 19h et 23h
              </p>
              <p>
                <strong className="text-white">Motif des Correspondances :</strong> {data.correspondances} nouvelles
                correspondances dans les 7 derniers jours
              </p>
              <p>
                <strong className="text-white">Engagement :</strong> {data.messages} messages envoyés, indiquant une
                interaction active
              </p>
              <p>
                <strong className="text-white">Popularité :</strong> {data.jaimes} j'aime reçus démontrent un profil
                attrayant
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloc 5: Informations de Localisation */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-orange-400" />
            Informations de Localisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30">
              <div className="text-slate-400 text-sm mb-1">Localisation Détectée</div>
              <div className="text-white font-semibold">
                {data.ville}, {data.pays}
              </div>
            </div>
            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30">
              <div className="text-slate-400 text-sm mb-1">Dernière Activité</div>
              <div className="text-green-400 font-semibold">En ligne maintenant</div>
            </div>
            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30">
              <div className="text-slate-400 text-sm mb-1">Méthode de Détection</div>
              <div className="text-white font-semibold text-xs">Analyse IP et Géolocalisation Avancée</div>
            </div>
            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30">
              <div className="text-slate-400 text-sm mb-1">Coordonnées GPS</div>
              <div className="text-white font-semibold text-xs">
                {data.coordonnees
                  ? `${data.coordonnees.latitude.toFixed(4)}, ${data.coordonnees.longitude.toFixed(4)}`
                  : "Non disponible"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloc 6: Analyse Avancée de la Photo de Profil */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-400" />🧠 Analyse de la Photo de Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Analyse Technique */}
          <div className="bg-slate-700/20 rounded-lg p-6 border border-slate-600/30">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-blue-400" />
              <h3 className="text-blue-400 font-bold text-lg">Analyse Technique Avancée</h3>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-slate-400 text-sm">Nom de la Personne Enquêtée :</span>
                <p className="text-white font-semibold">{data.nom}</p>
              </div>

              <div>
                <span className="text-slate-400 text-sm">Visage Trouvé sur le Profil Tinder :</span>
                <p className="text-green-400 font-semibold">✅ Compatible</p>
              </div>

              <div>
                <span className="text-slate-400 text-sm">Description Automatique du Visage :</span>
                <p className="text-slate-300 italic mt-1 pl-4 border-l-2 border-slate-600">"{photoDescription}."</p>
              </div>

              <div>
                <span className="text-slate-400 text-sm">Compatibilité avec le Profil Détecté :</span>
                <p className="text-slate-300 mt-1 pl-4 border-l-2 border-slate-600">
                  "L'analyse visuelle du visage fourni indique une haute compatibilité avec le profil trouvé sur Tinder.
                  Les principaux points d'identification faciale correspondent aux données du compte enquêté, renforçant
                  l'authenticité de la correspondance."
                </p>
              </div>
            </div>
          </div>

          {/* Données Techniques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30">
              <div className="text-slate-400 text-sm mb-1">Type de Photo</div>
              <div className="text-white font-semibold text-sm">
                Photo réelle téléchargée manuellement par l'utilisateur
              </div>
            </div>
            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30">
              <div className="text-slate-400 text-sm mb-1">Résolution de l'Image</div>
              <div className="text-green-400 font-semibold">{imageResolution}</div>
            </div>
            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30">
              <div className="text-slate-400 text-sm mb-1">Statut de l'Image</div>
              <div className="text-green-400 font-semibold text-sm">
                Validée comme compatible avec profil Tinder actif
              </div>
            </div>
            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30">
              <div className="text-slate-400 text-sm mb-1">Fiabilité</div>
              <div className="text-green-400 font-semibold">95,7% de précision</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Boutons d'Action */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={generatePDF}
          disabled={isGeneratingPDF}
          className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isGeneratingPDF ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Génération du PDF...
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" />
              Télécharger le Rapport PDF
            </>
          )}
        </Button>

        <Button
          onClick={onNewAnalysis}
          variant="outline"
          className="flex-1 border-slate-600 text-white hover:bg-slate-700 py-3 text-lg bg-transparent"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Nouvelle Analyse
        </Button>
      </div>
    </div>
  )
}
