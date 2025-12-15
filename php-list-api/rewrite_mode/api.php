<?php
$GLOBALS['path'] ="expose/";

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
function createEntity($oneName, $filePath) {
    $isDir = is_dir($filePath);
    if($isDir){
        $path = str_replace("./".$GLOBALS['path'], "", $filePath)."/";
    }else{
        $path = str_replace("./".$GLOBALS['path'], "", $filePath);
    }
    return array(
        "name" => $oneName,
        "path" => $path,
        "sha"  => $isDir ? "0" : hash_file("sha256", $filePath),
        "size" => filesize($filePath),
        "url" => "",
        "html_url" => "-",
        "git_url" => "-",
        "download_url" => "-",
        "type" => $isDir ? "dir": "file"
    );
}
try{
    $data = [];
    $PATH = str_replace("index.php", "", $_SERVER["REQUEST_URI"]);
    $dirPath = ".".$PATH;
    if(is_dir($dirPath) ) {
        $all_dir = scandir($dirPath);
        foreach ($all_dir as $oneName) {
            $filePath = "${dirPath}${oneName}";
            if($oneName == "." || $oneName == ".."){
                continue;
            }
            array_push($data, createEntity($oneName, $filePath));
        }
    }else if(is_file($dirPath)){
        $data = createEntity(basename($dirPath), $dirPath);
    }else{
        throw new Exception("Error Processing Request", 1);
    }
    echo json_encode($data, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
}catch(Exception $e){
    echo json_encode(array(
        'message' => "Not Found",
        "documentation_url" => "no"
    ), JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
}
?>