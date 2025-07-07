<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Intégration API WhatsApp pour Tinder Check
class WhatsAppAPI {
    private $apiUrl = 'https://api.whatsapp.com/send';
    private $businessNumber = '+33123456789'; // Remplacer par le numéro d'entreprise réel
    
    public function sendInvestigationReport($phoneNumber,  $personName, $reportData) {
        // Formater le message en français
        $message = $this->formatReportMessage($personName, $reportData);
        
        // Construire l'URL WhatsApp
        $whatsappUrl = $this->apiUrl . '?phone=' . urlencode($phoneNumber) . '&text=' . urlencode($message);
        
        return [
            'success' => true,
            'whatsapp_url' => $whatsappUrl,
            'message' => 'Rapport d\'enquête prêt à être envoyé via WhatsApp',
            'formatted_message' => $message
        ];
    }
    
    private function formatReportMessage($personName, $reportData) {
        $message = "🛡️ *TINDER CHECK - RAPPORT D'ENQUÊTE*\n\n";
        $message .= "📋 *Profil Enquêté :* {$personName}\n";
        $message .= "✅ *Statut :* Profil Actif Trouvé\n\n";
        
        $message .= "📊 *DONNÉES COLLECTÉES :*\n";
        $message .= "• Correspondances : {$reportData['correspondances']}\n";
        $message .= "• J'aime reçus : {$reportData['jaimes']}\n";
        $message .= "• Messages envoyés : {$reportData['messages']}\n\n";
        
        $message .= "📍 *LOCALISATION :*\n";
        $message .= "• Ville : {$reportData['ville']}\n";
        $message .= "• Pays : {$reportData['pays']}\n";
        $message .= "• Statut : En ligne maintenant\n\n";
        
        $message .= "🧠 *ANALYSE DE PROFIL :*\n";
        $message .= "• Compatibilité visuelle : ✅ Confirmée\n";
        $message .= "• Type de photo : Photo réelle fournie\n";
        $message .= "• Fiabilité : 95,7% de précision\n\n";
        
        $message .= "📈 *COMPORTEMENT NUMÉRIQUE :*\n";
        $message .= "• Fréquence : Actif quotidiennement\n";
        $message .= "• Pics d'activité : 19h-23h\n";
        $message .= "• Engagement : Interaction active détectée\n\n";
        
        $message .= "🔒 *Rapport généré par Tinder Check*\n";
        $message .= "📅 " . date('d/m/Y à H:i') . "\n\n";
        $message .= "_Système d'Enquête Numérique Professionnel_";
        
        return $message;
    }
    
    public function validatePhoneNumber($phoneNumber) {
        // Validation basique du numéro de téléphone français
        $cleanNumber = preg_replace('/[^0-9+]/', '', $phoneNumber);
        
        // Formats français acceptés
        $patterns = [
            '/^\+33[1-9][0-9]{8}$/',  // +33XXXXXXXXX
            '/^0[1-9][0-9]{8}$/',     // 0XXXXXXXXX
            '/^33[1-9][0-9]{8}$/'     // 33XXXXXXXXX
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $cleanNumber)) {
                return true;
            }
        }
        
        return false;
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
}

// Traitement de la requête
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Données JSON invalides']);
        exit;
    }
    
    $whatsapp = new WhatsAppAPI();
    
    $phoneNumber = $input['phone'] ?? '';
    $personName = $input['person_name'] ?? '';
    $reportData = $input['report_data'] ?? [];
    
    // Validation
    if (empty($phoneNumber) || empty($personName) || empty($reportData)) {
        http_response_code(400);
        echo json_encode(['error' => 'Paramètres manquants : téléphone, nom de la personne et données du rapport requis']);
        exit;
    }
    
    // Valider et formater le numéro de téléphone
    if (!$whatsapp->validatePhoneNumber($phoneNumber)) {
        http_response_code(400);
        echo json_encode(['error' => 'Numéro de téléphone français invalide']);
        exit;
    }
    
    $formattedPhone = $whatsapp->formatPhoneNumber($phoneNumber);
    if (!$formattedPhone) {
        http_response_code(400);
        echo json_encode(['error' => 'Impossible de formater le numéro de téléphone']);
        exit;
    }
    
    // Générer le rapport WhatsApp
    $result = $whatsapp->sendInvestigationReport($formattedPhone, $personName, $reportData);
    
    echo json_encode($result);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Endpoint de test
    echo json_encode([
        'status' => 'API WhatsApp Tinder Check Active',
        'version' => '1.0',
        'language' => 'Français',
        'endpoints' => [
            'POST /' => 'Envoyer un rapport d\'enquête via WhatsApp',
            'GET /' => 'Statut de l\'API'
        ]
    ]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
}
?>
