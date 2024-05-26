<?php
header("HTTP/1.1 200 OK");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);

function isAllowed($query)
{
    $allowed = [
        "http://example.com"
    ];
    foreach ($allowed as $allow) {
        $len = strlen($allow);
        $query_len = substr($query, 0, $len);
        if ($query_len === $allow) {
            return true;
        }
    }
    return false;
}
$start = substr($_GET["url"], 0, 19);
if (isAllowed($_GET["url"])) {
    $data = file_get_contents(
        $_GET["url"],
        false,
        stream_context_create([
            'http' => [
                'ignore_errors' => true,
            ],
        ])
    );
    echo $data;
} else {
    echo json_encode(array("error" => true), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}
