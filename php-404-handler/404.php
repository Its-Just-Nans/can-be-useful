<?php

$url = "https://example.com";

if (isset($_GET['id'])) {
    // check if starts with /
    $id = $_GET['id'];
    if (substr($id, 0, 1) !== '/') {
        $id = "/$id";
    }
    header("Location: " . $url . $id);
    exit();
}
// crash 404
header("HTTP/1.0 404 Not Found");
echo "404 Not Found :(";
exit();
