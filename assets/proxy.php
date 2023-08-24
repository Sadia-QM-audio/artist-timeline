<?php
$url = "http://example.com/movies.json";
// $url = "https://openaccess-api.clevelandart.org/api/creators/24407";
$response = file_get_contents($url);
header("Content-Type: application/json");
echo $response;
?>