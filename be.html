<?php
//*****************************************************
// Cortesía de: "@M3uKodi Telegram Group"
// Web: https://www.m3ukodi.com
//*****************************************************

// Configuración de errores
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set("log_errors", 1);
ini_set("error_log", __DIR__ . "/errores.log");
ini_set("display_errors", 1);

// Configuración de límites
@ini_set("memory_limit", "1024M");
@ini_set('max_execution_time', 0);
@ini_set('output_buffering', 'Off');

// Headers HTTP
header("Content-Type: text/plain; charset=UTF-8");
header("Cache-Control: no-cache, must-revalidate");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST");
header('Content-Type: text/plain; charset=utf-8');

// Obtener video_id
$videoId = $_GET['video_id'] ?? '';

if (empty($videoId)) {
    http_response_code(400);
    exit("Error: video_id requerido");
}

// Configuración de la petición
$headers = [
    'Content-Type: application/json',
    'User-Agent: com.google.android.youtube/19.32.35 (Linux; U; Android 13)',
    'x-youtube-client-name: 3',
    'x-youtube-client-version: 19.32.35'
];

$payload = json_encode([
    "context" => [
        "client" => [
            "clientName" => "ANDROID",
            "clientVersion" => "19.32.35",
            "hl" => "en",
            "gl" => "US"
        ]
    ],
    "videoId" => $videoId,
    "contentCheckOk" => true,
    "racyCheckOk" => true
]);

// Hacer petición a YouTube
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => "https://www.youtube.com/youtubei/v1/player?prettyPrint=false",
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_POST => 1,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_TIMEOUT => 30
]);

$response = curl_exec($ch);
curl_close($ch);

if (!$response) {
    http_response_code(500);
    exit("Error: No se pudo conectar a YouTube");
}

$data = json_decode($response, true);

// Verificar si hay HLS manifest
if (!isset($data["streamingData"]["hlsManifestUrl"])) {
    http_response_code(404);
    exit("Error: HLS manifest no disponible");
}

$hlsUrl = $data["streamingData"]["hlsManifestUrl"];

// Descargar el manifest
$m3u8 = @file_get_contents($hlsUrl);

if (!$m3u8) {
    http_response_code(500);
    exit("Error: No se pudo descargar el manifest");
}

// Limpiar y devolver el manifest
$lines = explode("\n", $m3u8);
$output = "#EXTM3U\n";

foreach ($lines as $line) {
    $line = trim($line);
    
    if ($line === "") continue;
    
    // Mantener tags EXT
    if (strpos($line, "#EXT") === 0) {
        $output .= $line . "\n";
        continue;
    }
    
    // Limpiar URLs de googlevideo
    if (strpos($line, "manifest.googlevideo.com") !== false) {
        $cleanUrl = preg_replace('/&sig=.*$/', '', $line);
        $output .= $cleanUrl . "\n";
        continue;
    }
    
    $output .= $line . "\n";
}

echo $output;
?>
