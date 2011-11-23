
// Globals defined initially.
cardnames = [
	"images/STIM00.GIF",
	"images/STIM01.GIF",
	"images/STIM02.GIF",
	"images/STIM03.GIF",
	"images/STIM04.GIF",
	"images/STIM05.GIF",
	"images/STIM06.GIF",
	"images/STIM07.GIF",
];
var sampleunits = 8;

// Globals whose values will be filled in on window.onload.
var cards = new Array();
var timerects;

// Mutable Globals
var lock = false;


// Helper functions
shuffle = function(o){ //v1.0
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

// Interface functions
cardclick = function (cardid) {
	return function() {
		if ( timerects.length == 0 ) { return false };
		if ( lock == true ) {  return false };
		lock = true;
		cards[cardid][2].show()
		setTimeout(
			function(){
				cards[cardid][2].hide();
				timerects.pop().hide();
				if (timerects.length == 0) {
					alert("You have finished! Click OK to go on to the test phase.");
					window.location = "testphase.html";
				};
				lock = false;
			},
			2000
		);
	}
}

// Task-specific functions
catfun = function ( num ) {
	return num % 2;
}

window.onload = function () {
	var cardh = 180;
	var cardw = 150;
	var imgh = 100;
	var imgw = 100;
	var ncardswide = 4
	var ncardstall = 2
	var upper = 0;
	var left = 0;
	// Canvas for the cards.
	var nowX, nowY, w = ncardswide*cardw, h = ncardstall*cardh, r=30;
	var cardpaper = Raphael(document.getElementById("cardcanvas"), w, h)
	// Canvas for the timer.
	var timertotalw = w/2;
	var timertotalh = 50
	var w2 = timertotalw, h2= timertotalh, r=30;
	var timerpaper = Raphael(document.getElementById("timercanvas"), w2, h2)
	
	// Category labels are just the letters.
	var categorynames= [ "A", "B" ]
	
	var randomcardplace = new Array();
	for ( i=0; i < cardnames.length; i ++ ){ randomcardplace.push( i ) };
	randomcardplace = shuffle( randomcardplace );
	
	for ( i=0; i < cardnames.length; i ++){
		var cardloci = randomcardplace[i];
		cards[i] = cardpaper.set();
		var thisleft = cardw * (cardloci % 4) + left;
		var thistop = cardh*Math.floor(cardloci/4) + upper;
		var imgoffset = (cardw-imgw)/2;
		
		cards[i].catnum = catfun( i );
		cards[i].push( cardpaper.rect( thisleft + (imgoffset/2), thistop+(imgoffset/2), imgw+(imgoffset), cardh-imgoffset).attr({fill:"black" })
		 );
		cards[i].push( cardpaper.image( cardnames[i], thisleft + imgoffset, thistop+imgoffset, imgw, imgh) );
		cards[i].push( cardpaper.text( thisleft + cardw/2, (thistop+imgoffset + thistop+(imgoffset/2) + cardh-imgoffset + imgh)/2, categorynames[cards[i].catnum] ).attr({ fill: "white", "font-size":36 }).hide() );
		
		cards[i].click( cardclick(i) );
	};
	
	timerects = timerpaper.set();
	timerectw = timertotalw / (sampleunits*2-1);
	for ( i=0; i < sampleunits; i ++){
		timerects.push( timerpaper.rect( 
					timerectw * i * 2, 
					0, 
					timerectw, timertotalh, [5] 
					).attr({fill:"red" })
		);
	};
};

