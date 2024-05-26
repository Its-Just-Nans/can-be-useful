<?php

$DEFAULT_WEBHOOK_URL = "https://discord.com/api/webhooks/...";

$CUSTOM_WEBHOOK_URL = [
    "example.com" => "https://discord.com/api/webhooks/...",
];

function getRequestHeaders()
{
    $headers = array();
    foreach ($_SERVER as $key => $value) {
        if (substr($key, 0, 5) != 'HTTP_') {
            continue;
        }
        $headers[$key] = $value;
    }
    return $headers;
}

$headers = getRequestHeaders();

$my_str = "";
$username = "test";

$URL = $DEFAULT_WEBHOOK_URL;

if (isset($_SERVER["HTTP_HOST"])) {
    $my_str .= $_SERVER["HTTP_HOST"];
    if (isset($CUSTOM_WEBHOOK_URL) && isset($CUSTOM_WEBHOOK_URL[$_SERVER["HTTP_HOST"]])) {
        $URL = $CUSTOM_WEBHOOK_URL[$_SERVER["HTTP_HOST"]];
    }
    $username = $_SERVER["HTTP_HOST"];
}

if (isset($_GET) && !empty($_GET) && isset($_GET["from"])) {
    $my_str .= "Trapped : " . substr($_GET["from"], 0, 10) . "\n";
}

$my_str .= "```";
foreach ($headers as $header => $value) {
    $my_str .= $header . ": " . $value . "\n";
}
$my_str .= "```";

$my_str .= "-----------------------------------\n";
// set post fields
$post = [
    'content' => $my_str,
    'username' => $username,
];

$ch = curl_init($URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
$response = curl_exec($ch);
curl_close($ch);
