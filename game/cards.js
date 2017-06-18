var CARDS = [];
var blankCard;
function initCards() {
	// name, ctd, cth, color, effectCond, effect, text, coinVal, bustCond, vp
	CARDS.push(new Card("Basic 1", 1, 4, 0, function() {return false}, function() {return false}, "A starting card", 1, [0, 1, 1, 0], 1));
	CARDS.push(new Card("Basic 2", 1, 2, 1, function() {return false}, function() {return false}, "A starting card", 1, [0, 0, 2, 0], 1));
	CARDS.push(new Card("Basic 3", 1, 3, 2, function() {return false}, function() {return false}, "A starting card", 1, [0, 2, 0, 0], 1));
	CARDS.push(new Card("idk1", 3, 6, 1, function() {return false}, function() {return false}, "Farm", 3, [0, 2, 2, 0], 3));
	CARDS.push(new Card("idk2", 4, 4, 0, function() {return false}, function() {return false}, "A starting card", 1, [2, 0, 0, 0], 5));
	CARDS.push(new Card("idk3", 6, 1, 2, function() {return false}, function() {return false}, "More money!", 4, [2, 2, 0, 0], 1));
	CARDS.push(new Card("idk4", 8, 2, 1, function() {return false}, function() {return false}, "Lotta money", 6, [2, 0, 2, 0], 3));
	CARDS.push(new Card("idk5", 6, 6, 1, function() {return false}, function() {return false}, "Points!", 2, [0, 2, 2, 0], 8));
	CARDS.push(new Card("idk6", 8, 8, 2, function() {return false}, function() {return false}, "max points", 2, [0, 0, 1, 0], 12));
	CARDS.push(new Card("idk7", 4, 2, 0, function() {return false}, function() {return false}, "all around card", 2, [2, 0, 0, 0], 5));
	
	
	blankCard = new Card("", 0, 0, 3, function() {return false}, function() {return false}, "DECK", 0, [0, 0, 0, 0], 0);
}

