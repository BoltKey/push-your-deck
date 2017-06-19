var ctx;
var canvas;
var COLORAMT = 4;
var colors = ["red", "green", "blue", "black"];
var supply = [];
var offer = [];
var deck = [];
var bustPile = [];
var table = [];
var hand = [];
var discardPile = [];
var coins = 5;
var turnCount = 0;
var lastTurn = 20;

var DRAWING = "DRAWING";
var BUYING = "BUYING";
var phase = DRAWING;


function main() {
	canvas = $("#game")[0];
	ctx = canvas.getContext("2d");
	initCards();
	newGame();
	
}

function Card(color, number, coinVal, comboColors, comboNumbers) {
	this.color = color;
	this.number = number;
	this.coinVal = coinVal;
	this.comboColors = comboColors;
	this.comboNumbers = comboNumbers;
	
	this.drawFromDeck = function(position) {
		if (!table.position)
			table[position] = this;
	}
	
	this.draw = function(x, y, w, h) {
		ctx.save();
		
		// card overlay
		ctx.translate(x, y);
		ctx.fillStyle = "#cccccc";
		roundedRect(0, 0, w, h, w/8);
		if (this.color < 3) {
			ctx.fillStyle = getGradient(colors[this.color], 1);
			var marg = w/20;
			roundedRect(marg, marg, w - marg * 2, h - marg * 2, w/9);
		}
		ctx.fillStyle = "rgba(255, 255, 255, 1)";
		ctx.font = Math.floor(w * .3) + "px Arial";
		ctx.textAlign = "center";
		ctx.fillText(this.number, w*.43, h * .45);
		// combo
		for (var i = 0; i < 5; ++i) {
			ctx.fillStyle = "#cccccc";
			var sx = w * (.025 + .17 * i);
			var sy = h * .5;
			var sw = w*.15;
			var sh = h*.3;
			
			roundedRect(sx, sy, sw, sh, w/40);
			ctx.fillStyle = colors[this.comboColors[i]];
			var marg = w / 100;
			roundedRect(marg + sx, marg + sy, sw - 2*marg, sh - 2*marg, w/40);
			ctx.fillStyle = "white";
			ctx.font =  Math.floor(sh * .6) + "px Arial";
			ctx.textAlign = "center";
			if (this.comboNumbers[i] >= 0)
				ctx.fillText(this.comboNumbers[i], sx + sw*.5, sy + sw);

		}
		
		// coin value
		if (this.coinVal > 0) {
			var r = w * .08;
			ctx.beginPath();
			ctx.arc(r * 2, r * 2, r, 0, Math.PI * 2);
			ctx.fillStyle = getGradient("yellow", 0.1);
			ctx.fill();
			ctx.strokeStyle = "#dd9900";
			ctx.lineWidth = 3;
			ctx.stroke();
			ctx.fillStyle = "#dd9900";
			ctx.font = Math.floor(r * 1.3) + "px Arial";
			ctx.fillText(this.coinVal, r * 2, r * 2.5);
		}
		
		
		
		
		ctx.restore();
	}
}

function getGradient(color, ratio) {
	var gradient = ctx.createLinearGradient(-100 * ratio, -50 * ratio, 400 * ratio, 200 * ratio);
	gradient.addColorStop(0, color);
	
	gradient.addColorStop(1, 'white');
	return gradient;
}

function bust() {
	draw();
	++bustCount;
	++turnCount;
	if (turnCount >= lastTurn) {
		endGame();
	}
	bustPile = bustPile.concat(table);
	table = [];
	console.log("bust");
}

/* *********** Interface functions *************** */

function newGame() {
	supply = [];
	offer = [];
	deck = [];
	bustPile = [];
	table = [];
	hand = [];
	discardPile = [];
	
	
	supply = generateCardSet(54, 2, 10);
	shuffle(supply);
	deck = supply.splice(0, 9);
	hand = supply.splice(0, 5);
	
	offer = supply.splice(supply.length - 4);
	coins = 10;
	turnCount = 0;
	
	draw();
}
function drawCard(pos) {
	if (phase === DRAWING && deck.length > 0 && (!table[pos])) {
		deck[0].drawFromDeck(pos);		
		deck.splice(0, 1);
	}
	else {
		draw();
	}
	if (deck.length <= 0) {
		shuffle(bustPile);
		var t = bustPile;
		bustPile = deck;
		deck = t;
	}
	draw();
}
function tth(index) {
	// table to hand
	var price = Math.floor(table[index].coinVal);
	if (phase === BUYING && coins >= price) {
		hand.push(table[index]);
		coins -= price;
		table[index] = undefined;
	}
	draw();
}
function skipCard(index) {
	if (coins > 0) {
		coins--;
		if (index || index === 0) {
			bustPile.push(table[index]);
			table[index] = undefined;
		}
		else {
			bustPile = bustPile.concat(deck.splice(0, 1));
		}
	}
	if (deck.length <= 0) {
		shuffle(bustPile);
		var t = bustPile;
		bustPile = deck;
		deck = t;
	}
	draw();
}
function complete(index) {
	var c = hand[index];
	var correct = true;
	if (table.filter(function(a) {return a}).length === 5) {
		for (var i = 0; i < 5; ++i) {
			if (c.comboColors[i] && (c.comboColors[i] !== table[i].color))
				correct = false;
			if (c.comboNumbers[i] && (c.comboNumbers[i] !== table[i].number))
				correct = false;
		}
		if (correct) {
			coins += c.coinVal;
			discardPile.push(hand.splice(index, 1));
			bustPile.push(table.splice(0));
			phase = BUYING;
		}
	}
	draw();
	
}
function endTurn() {
	++turnCount;
	if (turnCount >= lastTurn) {
		endGame();
	}
	bustPile = bustPile.concat(table);
	table = [];
	phase = DRAWING;
	draw();
}

// *********** end interface functions ************


function endGame() {
	console.log("Game end, final score is " + table.reduce(function(a, s) {return a.vp + s}, 0));
}

function loop() {
	requestAnimationFrame(loop);
	
	// logic
	
	
	
	draw();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// draw supply + offer
	for (var i = 0; i < offer.length; ++i) {
		offer[i].draw(120 + i*110, 100, 100, 70);
	}
	
	// draw deck + table + bustpile
	var y = 320;
	ctx.fillStyle = "white";
	ctx.font = "40px Arial";
	ctx.textAlign = "center";
	ctx.fillText(deck.length, 60, y + 100);
	deck[0].draw(20, y, 100, 70);
	for (var i = 0; i < 5; ++i) {
		if (table[i]) {
			table[i].draw(130 + i*100, y, 100, 70);
		}
		else {
			ctx.fillStyle = "#cccccc";
			roundedRect(130 + i*100, y, 100, 70, 10);
		}
	}
	
	// draw hand
	for (var i = hand.length - 1; i >= 0; --i) {
		hand[i].draw(120 + i * 90, y + 175, 100, 70);
	}
	
	// draw GUI - coins, turns, busts...
	ctx.fillStyle = "#777700";
	ctx.fillText(coins, 30, canvas.height - 40);
	ctx.fillStyle = "black";
	ctx.fillText(turnCount + "/" + lastTurn, 40, 40);

}


function shuffle(array) {
// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

function roundedRect(x, y, w, h, radius) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arc(x + w - radius * 2, y + radius, radius, Math.PI * 1.5, 0);
	ctx.arc(x + w - radius * 2, y + h - radius * 2, radius, 0, Math.PI * 0.5);
	ctx.arc(x + radius, y + h - radius * 2, radius, Math.PI * 0.5, Math.PI);
	ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
	ctx.fill();
}



onload = main;