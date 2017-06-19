var CARDS = [];
var blankCard;
function initCards() {
	// color, number, coinVal, comboColors, comboNumbers
	CARDS.push(new Card(2, 1, [0, 0, 1, 1, 0], [0, 0, 1, 1, 0]));
}

function generateCardSet(size, minVal, maxVal) {
	var c = [];
	for (var i = 0; i < size; ++i) {
		do {var value = minVal + Math.floor(Math.random() * maxVal);} while (value === 14);
		var doubleSpec = Math.floor(value / 3);
		var singleSpec = value % 3;
		var specs = [0, 0, 0, 0, 0];
		for (var s = 0; s < doubleSpec; ++s) {
			specs[s] = 2;
		}
		for (var t = 0; t < singleSpec; ++t) {  // don't ask
			specs[s + t] = 1;
		}
		shuffle(specs);
		var colors = [undefined, undefined, undefined, undefined, undefined];
		var numbers = [undefined, undefined, undefined, undefined, undefined];
		for (var s = 0; s < 5; ++s) {
			if (specs[s] === 2) {
				colors[s] = Math.floor(Math.random() * 3);
				numbers[s] = Math.floor(Math.random() * 3);
			}
			if (specs[s] === 1) {
				if (Math.random() < .5)
					colors[s] = Math.floor(Math.random() * 3);	
				else
					numbers[s] = Math.floor(Math.random() * 3);
			}
		}
		c.push(new Card(Math.floor((i / size) * 3), i % 3, value * 2, colors, numbers));
	}
	return c;
}