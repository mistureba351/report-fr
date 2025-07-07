"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { InitialForm } from "@/components/initial-form"
import { ReportDashboard } from "@/components/report-dashboard"
import { LoadingOverlay } from "@/components/loading-overlay"

interface LocationData {
  ville: string
  pays: string
  coordonnees?: {
    latitude: number
    longitude: number
  }
}

export default function TinderCheck() {
  const [currentStep, setCurrentStep] = useState<"form" | "loading" | "report">("form")
  const [locationData, setLocationData] = useState<LocationData>({
    ville: "Paris",
    pays: "France",
  })
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false)
  const [investigationData, setInvestigationData] = useState({
    nom: "",
    photo: "",
    correspondances: 0,
    jaimes: 0,
    messages: 0,
    ville: "",
    pays: "",
    coordonnees: undefined as { latitude: number; longitude: number } | undefined,
  })

  // Fonction pour obtenir le nom de la ville à partir des coordonnées (simulation)
  const getCityFromCoordinates = async (lat: number, lng: number): Promise<LocationData> => {
    // Dans un système réel, utiliserait une API de géocodage inverse
    // Ici nous simulons basé sur les coordonnées
    const cities = [
      { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
      { name: "Marseille", country: "France", lat: 43.2965, lng: 5.3698 },
      { name: "Lyon", country: "France", lat: 45.764, lng: 4.8357 },
      { name: "Toulouse", country: "France", lat: 43.6047, lng: 1.4442 },
      { name: "Nice", country: "France", lat: 43.7102, lng: 7.262 },
      { name: "Nantes", country: "France", lat: 47.2184, lng: -1.5536 },
      { name: "Strasbourg", country: "France", lat: 48.5734, lng: 7.7521 },
      { name: "Montpellier", country: "France", lat: 43.6108, lng: 3.8767 },
      { name: "Bordeaux", country: "France", lat: 44.8378, lng: -0.5792 },
      { name: "Lille", country: "France", lat: 50.6292, lng: 3.0573 },
    ]

    // Trouver la ville la plus proche
    let closestCity = cities[0]
    let minDistance = Math.abs(lat - cities[0].lat) + Math.abs(lng - cities[0].lng)

    cities.forEach((city) => {
      const distance = Math.abs(lat - city.lat) + Math.abs(lng - city.lng)
      if (distance < minDistance) {
        minDistance = distance
        closestCity = city
      }
    })

    return {
      ville: closestCity.name,
      pays: closestCity.country,
      coordonnees: { latitude: lat, longitude: lng },
    }
  }

  // Détecter la géolocalisation automatiquement
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const locationInfo = await getCityFromCoordinates(latitude, longitude)
          setLocationData(locationInfo)
          setLocationPermissionDenied(false)
        },
        (error) => {
          console.log("Géolocalisation refusée ou erreur:", error)
          setLocationPermissionDenied(true)
          // Garder la localisation par défaut
          setLocationData({
            ville: "Paris",
            pays: "France",
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    } else {
      setLocationPermissionDenied(true)
    }
  }, [])

  const handleStartAnalysis = (nom: string, photo: string) => {
    // Générer des données aléatoires comme spécifié
    const correspondances = Math.floor(Math.random() * 10) + 3 // 3-12
    const jaimes = Math.floor(Math.random() * 26) + 15 // 15-40
    const messages = Math.floor(Math.random() * 9) + 2 // 2-10

    setInvestigationData({
      nom,
      photo,
      correspondances,
      jaimes,
      messages,
      ville: locationData.ville,
      pays: locationData.pays,
      coordonnees: locationData.coordonnees,
    })

    setCurrentStep("loading")

    // Simuler le temps d'analyse
    setTimeout(() => {
      setCurrentStep("report")
    }, 4000)
  }

  const handleNewAnalysis = () => {
    setCurrentStep("form")
    setInvestigationData({
      nom: "",
      photo: "",
      correspondances: 0,
      jaimes: 0,
      messages: 0,
      ville: "",
      pays: "",
      coordonnees: undefined,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {currentStep === "form" && (
          <InitialForm
            onStartAnalysis={handleStartAnalysis}
            locationData={locationData}
            locationPermissionDenied={locationPermissionDenied}
          />
        )}

        {currentStep === "report" && <ReportDashboard data={investigationData} onNewAnalysis={handleNewAnalysis} />}
      </main>

      {currentStep === "loading" && (
        <LoadingOverlay
          isVisible={true}
          message="Analyse du profil Tinder en cours... Veuillez patienter quelques instants..."
        />
      )}
    </div>
  )
}
