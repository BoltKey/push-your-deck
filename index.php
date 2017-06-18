<head>
<meta charset='UTF-8'/>
<script type='text/javascript' src='main.js'></script>
<link href="style.css" rel="stylesheet">
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<?php 
foreach (glob("game/*.js") as $filename)
{
    echo '<script type="text/javascript" src='.$filename.'></script>
';
} 
?>

<title>Push your deck</title>
</head>
<body>
<canvas id='game' width=640 height=640>Your browser does not support canvas, use chrome instead.</canvas>
</body>