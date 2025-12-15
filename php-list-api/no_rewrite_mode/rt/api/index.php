<?php
$GLOBALS['path'] ="rt/api";
$GLOBALS['path2'] ="rt/raws";
$GLOBALS['pathToFile'] = str_replace(
    "/".$GLOBALS['path'],
    "",
    getcwd()
);
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
http_response_code(200);
header("HTTP/1.1 200 OK");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
function createEntity($oneName, $filePath) {
    $isDir = is_dir($filePath);
    $prePath = str_replace(
        $GLOBALS['path'],
        "",
        $GLOBALS['pathToFile']
    );
    $prePath = $prePath."/".$GLOBALS['path2']."/";
    $realPath = str_replace(
        $GLOBALS['pathToFile'],
        "",
        $filePath
    );
    $url = str_replace(
        $GLOBALS['path2'],
        $GLOBALS['path'],
        $realPath
    );
    $realPath = "http://".$_SERVER['SERVER_NAME'].$realPath;
    $url = "http://".$_SERVER['SERVER_NAME'].$url;
    $path = str_replace($prePath, "", $filePath);
    if($isDir){
        $path = $path."/";
        $realPath = $realPath."/";
        $url = $url."/";
    }
    return array(
        "name" => $oneName,
        "path" => $path,
        "sha"  => $isDir ? "0" : hash_file("sha256", $filePath),
        "size" => filesize($filePath),
        "url" => $url,
        "html_url" => $realPath,
        "git_url" => "-",
        "download_url" => $realPath,
        "type" => $isDir ? "dir": "file"
    );
}
try{
    $data = [];
    $request = $_SERVER["REQUEST_URI"];
    if(substr($request, -1) == "/"){
        $request = substr($request, 0, -1);
    }
    $correctFilePath = str_replace(
        $GLOBALS['path'],
        $GLOBALS['path2'],
        $request
    );
    $dirPath = $GLOBALS['pathToFile'].$correctFilePath;
    if(is_dir($dirPath) ) {
        $all_dir = scandir($dirPath);
        foreach ($all_dir as $oneName) {
            $filePath = $dirPath.'/'.$oneName;
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
    http_response_code(404);
    echo json_encode(array(
        'message' => "Not Found",
        "documentation_url" => "no"
    ), JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
}
?>