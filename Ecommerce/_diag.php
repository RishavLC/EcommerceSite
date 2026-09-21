<?php
$dirs = [
    'bootstrap/cache',
    'storage/framework/views',
    'storage/framework/cache/data',
    'storage/logs',
    'vendor',
];
foreach ($dirs as $d) {
    $real = realpath($d);
    echo str_pad($d, 32)
        . ' is_dir=' . (is_dir($d) ? '1' : '0')
        . ' is_writable=' . (is_writable($d) ? '1' : '0')
        . ' realpath=' . ($real ?: 'NULL')
        . PHP_EOL;
}

$target = 'bootstrap/cache/_write_test.txt';
$ok = @file_put_contents($target, 'hello');
echo 'file_put_contents result=' . var_export($ok, true) . PHP_EOL;
if ($ok) {
    @unlink($target);
}
echo 'PHP_OS=' . PHP_OS . ' PHP_VERSION=' . PHP_VERSION . PHP_EOL;
echo 'open_basedir=' . var_export(ini_get('open_basedir'), true) . PHP_EOL;