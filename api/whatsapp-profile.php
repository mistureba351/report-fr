<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// API de Profil WhatsApp pour Tinder Check
class WhatsAppProfileAPI {
    
    public function getProfileInfo($phoneNumber) {
        // Simuler la récupération d'informations de profil WhatsApp
        $formattedNumber = $this->formatPhoneNumber($phoneNumber);
        
        if (!$formattedNumber) {
            return [
                'success' => false,
                'error' => 'Numéro de téléphone invalide'
            ];
        }
        
        // Simulation de données de profil (dans un système réel, cela viendrait de l'API WhatsApp Business)
        $profileData = $this->generateMockProfileData($formattedNumber);
        
        return [
            'success' => true,
            'phone_number' => $formattedNumber,
            'profile_data' => $profileData,
            'last_updated' => date('Y-m-d H:i:s')
        ];
    }
    
    private function generateMockProfileData($phoneNumber) {
        // Générer des données de profil simulées basées sur le numéro
        $hash = crc32($phoneNumber);
        
        $names = [
            'Marie Dubois', 'Pierre Martin', 'Sophie Leroy', 'Antoine Bernard',
            'Camille Moreau', 'Lucas Petit', 'Emma Durand', 'Hugo Roux',
            'Léa Fournier', 'Nathan Girard', 'Chloé Bonnet', 'Maxime Lambert'
        ];
        
        $cities = [
            'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes',
            'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims'
        ];
        
        $statuses = [
            'Disponible', 'Occupé(e)', 'En ligne', 'Absent(e)', 'Ne pas déranger'
        ];
        
        return [
            'display_name' => $names[abs($hash) % count($names)],
            'status' => $statuses[abs($hash) % count($statuses)],
            'location' => $cities[abs($hash) % count($cities)] . ', France',
            'profile_photo' => $this->hasProfilePhoto($hash),
            'last_seen' => $this->generateLastSeen($hash),
            'account_type' => $this->getAccountType($hash),
            'verification_status' => $this->getVerificationStatus($hash)
        ];
    }
    
    private function hasProfilePhoto($hash) {
        return (abs($hash) % 10) > 3; // 70% de chance d'avoir une photo de profil
    }
    
    private function generateLastSeen($hash) {
        $hours = abs($hash) % 72; // Dernière vue dans les 72 dernières heures
        $timestamp = time() - ($hours * 3600);
        
        if ($hours < 1) {
            return 'En ligne maintenant';
        } elseif ($hours < 24) {
            return 'Vu(e) il y a ' . $hours . ' heure(s)';
        } else {
            $days = floor($hours / 24);
            return 'Vu(e) il y a ' . $days . ' jour(s)';
        }
    }
    
    private function getAccountType($hash) {
        $types = ['Personnel', 'Professionnel', 'Entreprise'];
        return $types[abs($hash) % count($types)];
    }
    
    private function getVerificationStatus($hash) {
        return (abs($hash) % 10) > 6; // 30% de chance d'être vérifié
    }
    
    public function formatPhoneNumber($phoneNumber) {
        $cleanNumber = preg_replace('/[^0-9+]/', '', $phoneNumber);
        
        // Convertir au format international français
        if (preg_match('/^0([1-9][0-9]{8})$/', $cleanNumber, $matches)) {
            return '+33' . $matches[1];
        } elseif (preg_match('/^33([1-9][0-9]{8})$/', $cleanNumber, $matches)) {
            return '+33' . $matches[1];
        } elseif (preg_match('/^\+33[1-9][0-9]{8}$/', $cleanNumber)) {
            return $cleanNumber;
        }
        
        return false;
    }
    
    public function validatePhoneNumber($phoneNumber) {
        return $this->formatPhoneNumber($phoneNumber) !== false;
    }
    
    public function searchByName($name, $location = null) {
        // Simuler une recherche par nom
        $results = [];
        
        // Générer quelques résultats simulés
        for ($i = 0; $i < rand(1, 5); $i++) {
            $mockPhone = '+33' . rand(100000000, 999999999);
            $profileData = $this->generateMockProfileData($mockPhone);
            
            // Filtrer par nom similaire
            if (stripos($profileData['display_name'], $name) !== false) {
                $results[] = [
                    'phone_number' => $mockPhone,
                    'profile_data' => $profileData,
                    'match_score' => rand(70, 95) // Score de correspondance en %
                ];
            }
        }
        
        return [
            'success' => true,
            'search_query' => $name,
            'location_filter' => $location,
            'results_count' => count($results),
            'results' => $results
        ];
    }
}

// Traitement des requêtes
$profileAPI = new WhatsAppProfileAPI();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['phone'])) {
        // Récupérer les informations de profil par numéro
        $phoneNumber = $_GET['phone'];
        
        if (!$profileAPI->validatePhoneNumber($phoneNumber)) {
            http_response_code(400);
            echo json_encode(['error' => 'Numéro de téléphone français invalide']);
            exit;
        }
        
        $result = $profileAPI->getProfileInfo($phoneNumber);
        echo json_encode($result);
        
    } elseif (isset($_GET['search_name'])) {
        // Rechercher par nom
        $name = $_GET['search_name'];
        $location = $_GET['location'] ?? null;
        
        if (empty($name) || strlen($name) < 2) {
            http_response_code(400);
            echo json_encode(['error' => 'Le nom de recherche doit contenir au moins 2 caractères']);
            exit;
        }
        
        $result = $profileAPI->searchByName($name, $location);
        echo json_encode($result);
        
    } else {
        // Statut de l'API
        echo json_encode([
            'status' => 'API Profil WhatsApp Tinder Check Active',
            'version' => '1.0',
            'language' => 'Français',
            'endpoints' => [
                'GET /?phone=NUMERO' => 'Récupérer les informations de profil',
                'GET /?search_name=NOM' => 'Rechercher par nom',
                'GET /?search_name=NOM&location=VILLE' => 'Rechercher par nom et localisation'
            ],
            'phone_format' => 'Formats acceptés : +33XXXXXXXXX, 0XXXXXXXXX, 33XXXXXXXXX'
        ]);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Données JSON invalides']);
        exit;
    }
    
    if (isset($input['phone'])) {
        $result = $profileAPI->getProfileInfo($input['phone']);
        echo json_encode($result);
    } elseif (isset($input['search_name'])) {
        $result = $profileAPI->searchByName($input['search_name'], $input['location'] ?? null);
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Paramètres requis : phone ou search_name']);
    }
    
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
}
?>
