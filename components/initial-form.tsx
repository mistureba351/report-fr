"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, User, AlertCircle, CheckCircle, X, Camera, Search, MapPin, AlertTriangle } from "lucide-react"

interface LocationData {
  ville: string
  pays: string
  coordonnees?: {
    latitude: number
    longitude: number
  }
}

interface InitialFormProps {
  onStartAnalysis: (nom: string, photo: string) => void
  locationData: LocationData
  locationPermissionDenied: boolean
}

export function InitialForm({ onStartAnalysis, locationData, locationPermissionDenied }: InitialFormProps) {
  const [nom, setNom] = useState("")
  const [photo, setPhoto] = useState("")
  const [error, setError] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      return "Format non supporté. Utilisez JPEG, PNG ou WebP."
    }

    if (file.size > maxSize) {
      return "Fichier trop volumineux. Maximum 10 Mo."
    }

    return null
  }

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPhoto(result)
      setError("")
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleSubmit = () => {
    if (!nom.trim()) {
      setError("Veuillez saisir le nom de la personne.")
      return
    }

    if (nom.trim().length < 2) {
      setError("Le nom doit contenir au moins 2 caractères.")
      return
    }

    if (!photo) {
      setError("Veuillez télécharger une photo de la personne.")
      return
    }

    setError("")
    onStartAnalysis(nom.trim(), photo)
  }

  const removePhoto = () => {
    setPhoto("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Titre Principal */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Enquête de Profil</h2>
        <p className="text-lg text-slate-300">Découvrez si quelqu'un possède un profil actif sur Tinder</p>
      </div>

      {/* Avertissement Géolocalisation */}
      {locationPermissionDenied && (
        <Card className="mb-6 bg-orange-900/20 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-orange-300 font-semibold mb-1">Géolocalisation Désactivée</h3>
                <p className="text-orange-200/80 text-sm">
                  Pour obtenir un rapport plus précis et complet, nous recommandons d'activer l'autorisation de
                  localisation dans votre navigateur. Cela nous permet de détecter automatiquement votre position pour
                  des analyses plus détaillées.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statut de Localisation */}
      <Card className="mb-6 bg-slate-800/30 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-green-400" />
            <div>
              <h3 className="text-white font-semibold">Localisation Détectée</h3>
              <p className="text-slate-300 text-sm">
                {locationData.ville}, {locationData.pays}
                {locationData.coordonnees && <span className="text-slate-400 ml-2">(Précision : Élevée)</span>}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5 text-purple-400" />
            Données d'Enquête
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Champ Nom */}
          <div className="space-y-2">
            <Label htmlFor="nom" className="text-white font-medium">
              Nom de la personne enquêtée *
            </Label>
            <Input
              id="nom"
              type="text"
              placeholder="Saisissez le nom complet..."
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20"
            />
          </div>

          {/* Téléchargement de Photo */}
          <div className="space-y-3">
            <Label className="text-white font-medium">Photo de la personne *</Label>

            {!photo ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  isDragOver
                    ? "border-purple-400 bg-purple-900/20"
                    : "border-slate-600 hover:border-slate-500 hover:bg-slate-800/30"
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
              >
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">Glissez une photo ici ou cliquez pour sélectionner</h3>
                <p className="text-slate-400 text-sm mb-4">JPEG, PNG, WebP • Maximum 10 Mo</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Sélectionner Photo
                </Button>
              </div>
            ) : (
              <div className="relative">
                <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt="Photo sélectionnée"
                    className="w-20 h-20 rounded-full object-cover border-2 border-purple-400 shadow-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">Photo téléchargée</span>
                    </div>
                    <p className="text-slate-400 text-sm">Prête pour l'analyse</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removePhoto}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Message d'Erreur */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Bouton d'Analyse */}
          <Button
            onClick={handleSubmit}
            disabled={!nom.trim() || !photo}
            className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-orange-500 hover:from-purple-700 hover:via-blue-700 hover:to-orange-600 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Search className="h-5 w-5 mr-2" />
            Commencer l'Analyse
          </Button>

          {/* Informations de Sécurité */}
          <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600/30">
            <p className="text-slate-300 text-sm text-center">
              🔒 <strong>100% Sécurisé et Confidentiel</strong>
              <br />
              Vos données sont traitées en toute confidentialité
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
