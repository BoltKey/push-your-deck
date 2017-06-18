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
var coins = 5;
var bustCount = 0;
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

function Card(name, ctd, cth, color, abilityTrig, ability, abilityText, coinValue, bustCondition, vp) {
	this.ctd = ctd;
	this.cth = cth;
	this.color = color;
	this.name = name;
	this.abilityTrig = abilityTrig;
	this.ability = ability;
	this.abilityText = abilityText;
	this.coinValue = coinValue;
	this.bust = bustCondition;
	this.vp = vp;
	
	this.drawFromDeck = function() {
		
		var busted = true;
		for (var i = 0; i < COLORAMT; ++i) {
			if (table.filter(function(a){return a.color === i}).length < this.bust[i]) {
				busted = false;
			}
		}
		table.push(this);
		if (busted) {
			bust();
		}
	}
	
	this.draw = function(x, y, w, h) {
		ctx.save();
		
		// card overlay
		ctx.translate(x, y);
		ctx.fillStyle = "#cccccc";
		roundedRect(0, 0, w, h, w/8);
		ctx.fillStyle = getGradient(colors[this.color], 1);
		var marg = w/20;
		roundedRect(marg, marg, w - marg * 2, h - marg * 2, w/9);
		
		// bust conditions
		for (var i = 0; i < COLORAMT; ++i) {
			if (this.bust[i] > 0) {
				ctx.fillStyle = "#cccccc";
				var sx = w * (.275 + .2 * (i % 2));
				var sy = h * (.3 + .2 * Math.floor(i/2));
				var sw = w*.18;
				var sh = h*.18;
				
				roundedRect(sx, sy, sw, sh, w/40);
				ctx.fillStyle = colors[i];
				var marg = w / 100;
				roundedRect(marg + sx, marg + sy, sw - 2*marg, sh - 2*marg, w/40);
				ctx.fillStyle = "white";
				ctx.font =  Math.floor(sh * .5) + "px Arial";
				ctx.textAlign = "center";
				ctx.fillText(this.bust[i], sx + sw*.5, sy + sw);
			}
		}
		
		// coin value
		if (this.coinValue > 0) {
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
			ctx.fillText(this.coinValue, r * 2, r * 2.5);
		}
		// cost to hand
		if (this.cth > 0) {
			ctx.translate(w*.2, h * .74);
			ctx.beginPath();
			var r = w*.05;
			ctx.moveTo(-r, 0);
			ctx.lineTo(r, 0);
			ctx.lineTo(r, r);
			ctx.lineTo(r, r*2);
			ctx.lineTo(r*1.5, r*2);
			ctx.lineTo(0, r * 3.5);
			ctx.lineTo(-r*1.5, r*2);
			ctx.lineTo(-r, r*2);
			ctx.lineTo(-r, r);
			ctx.lineTo(-r, 0);
			ctx.stroke();
			ctx.fillStyle = getGradient("yellow", 0.1);
			ctx.fill();
			ctx.fillStyle = "#dd9900";
			ctx.font = Math.floor(r * 1.6) + "px Arial";
			ctx.fillText(this.cth, 0, 12);
		}
		// cost to deck
		if (this.ctd > 0) {
			ctx.translate(w*.2, - h * .67);
			ctx.fillStyle = getGradient("yellow", 0.1);
			roundedRect(0, 0, w * .15, h * .15, w*.02);
			ctx.stroke();
			ctx.fillStyle = "#dd9900";
			ctx.fillText(this.ctd, w*.07, 12);
		}
		// vp 
		if (this.vp > 0) {
			ctx.translate(w*.31, h * .78);
			ctx.font = Math.floor(w * .2) + "px Arial";
			ctx.fillStyle = "#dddddd";
			ctx.fillText(this.vp, 0, 0);
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
	for (var i = 0;  i < 3; ++i) {
		for (var c = 0; c < COLORAMT - 1; ++c) {
			deck.push(CARDS[c]);
		}
	}
	for (var i = 0; i < 4; ++i) {
		for (var c = 3; c < CARDS.length; ++c) {
			supply.push(CARDS[c]);
		}
	}
	shuffle(supply);
	shuffle(deck);
	offer = supply.splice(supply.length - 4);
	coins = 5;
	bustCount = 0;
	turnCount = 0;
	
	draw();
}
function drawCard() {
	if (phase === DRAWING && deck.length > 0) {
		deck[0].drawFromDeck();		
		deck.splice(0, 1);
		cardEffects()
	}
	if (table.length === 0) {
		setTimeout(draw, 1000);
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
}
function keepTable() {
	if (phase === DRAWING) {
		coins += table.reduce(function(s, a) {return s + a.coinValue}, 0);
		draw();
		phase = BUYING;
		
		cardEffects();
	}
}
function tth(index) {
	// table to hand
	if (phase === BUYING && coins >= table[index].cth) {
		hand.push(table[index]);
		coins -= table[index].cth;
		table.splice(index, 1);
		
	}
	draw();
}
function otd(index) {
	// offer to deck
	if (phase === BUYING && coins >= offer[index].ctd) {
		coins -= offer[index].ctd;
		bustPile.push(offer[index]);
		offer[index] = supply[0];
		supply.splice(0, 1);
		
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


function cardEffects() {
	
}

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
		offer[i].draw(120 + i*110, 100, 100, 155);
	}
	
	// draw deck + table + bustpile
	var y = 320;
	blankCard.draw(20, y, 100, 155);
	ctx.fillStyle = "white";
	ctx.font = "40px Arial";
	ctx.textAlign = "center";
	ctx.fillText(deck.length, 60, y + 100);
	for (var i = 0; i < table.length; ++i) {
		if (table[i]) {
			table[i].draw(120 + i*30, y, 100, 155);
		}
	}
	
	// draw hand
	for (var i = hand.length - 1; i >= 0; --i) {
		hand[i].draw(120 + i * 22, y + 175, 75, 116);
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