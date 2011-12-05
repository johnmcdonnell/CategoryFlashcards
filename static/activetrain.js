
/********************
// Domain general code
********************/
// Helper functions

// Fisher-Yates shuffle algorithm.
// modified from http://sedition.com/perl/javascript-fy.html
// TODO: make sure this works okay.
function shuffle ( myArray ) {
	if ( ! myArray.length ) { return false; }
	for ( var i=myArray.length-1; i>=0; --i ) {
		var j = Math.floor( Math.random() * ( i + 1 ) );
		var tempi = myArray[i];
		var tempj = myArray[j];
		myArray[i] = tempj;
		myArray[j] = tempi;
	}
	return true;
}

var appendtobody = function( tag, id, contents ) {
	el = document.createElement( tag );
	el.id = id;
	el.innerHTML = contents;
	return el;
};

// AJAX post function.
var postback = function(destination, tosend) {
	$.ajax("submit.py", {
		type: "POST",
		data: tosend
		// error: function(jqXHR,textStatus,errorThrown) { setTimeout( $.ajax(this), 1000 ); }
	});
};

// Mean of booleans (true==1; false==0)
boolmean = function(arr) {
	count = 0;
	for (i=0; i<arr.length; i++) {
		if (arr[i]) { count++; } 
	}
	return 100* count / arr.length;
};

/********************
// Task code
********************/

// Globals defined initially.
ncards = 8;
var cardnames = [
	"images/STIM00.GIF",
	"images/STIM01.GIF",
	"images/STIM02.GIF",
	"images/STIM03.GIF",
	"images/STIM04.GIF",
	"images/STIM05.GIF",
	"images/STIM06.GIF",
	"images/STIM07.GIF",
	"images/STIM08.GIF",
	"images/STIM09.GIF",
	"images/STIM10.GIF",
	"images/STIM11.GIF",
	"images/STIM12.GIF",
	"images/STIM13.GIF",
	"images/STIM14.GIF",
	"images/STIM15.GIF"];

var categorynames= [ "A", "B" ];

var cardh = 180, cardw = 140, upper = 0, left = 0;
var imgh = 100, imgw = 100;
var subjid = 0;
var trainobject;
var testobject;

// Condition and counterbalance code.
condition = {
	traintype: 1, // 0=active, 1=passive
	rule: 0, // type I-VI -> 0-5.
	whichdims: 0, // 0-3; which dimension not to use.
	dimorder: 0 // 0-5; which order to order the dimensions
};

// Task functions
catfuns = [
	function ( num ) {
		// Shepard type I
		return num % 2;
	},
	function (num) {
		// Shepard type II
		return (num&2/2)^(num&1);
	},
	function (num) {
		// Shepard type III
		if (num & 1) { return ((num%8)==1) ? 0 : 1; }
		else { return (num % 8)==2 ? 1 : 0; }
	},
	function (num) {
		// Shepard type IV
		score = 0; // prototypicality score
		if ( num & 1 ) { score++; }
		if ( num & 2 ) { score++; }
		if ( num & 4 ) { score++; }
		return (score>=2) ? 0 : 1;
	},
	function (num) {
		// Shepard type V
		if (num & 1) { return (num%8 == 7) ? 1 : 0; }
		else { return (num%8 == 6) ? 0 : 1; }
	},
	function (num) {
		// Shepard type VI
		if (num & 1) { return (num&2)^((num&4)/2) ? 1:0; }
		else { return (num&2)^((num&4)/2) ? 0:1; }
	}
];
var catfun = catfuns[condition.rule];

getstim = function(theorystim) {
	bits = [theorystim&1 ? 1 : 0,
	        theorystim&2 ? 1 : 0,
	        theorystim&4 ? 1 : 0];
	var multiples = [1, 2, 4, 8];
	multiples.splice(condition.whichdims, 1);
	
	newmultiples = [];
	newmultiples.push( multiples.splice(Math.floor( condition.dimorder/2 ), 1) );
	newmultiples.push( multiples.splice(condition.dimorder%2, 1));
	newmultiples.push( multiples[0] );
	
	var ret = 0;
	for (var i=0; i<=2; i++) {
		ret += newmultiples[i] * bits[i];
	}
	return ret;
};


/********************
// CODE FOR TRAINING
********************/


// Interface object

var TrainingPhase = function() {
	var i; // just initializing the iterator dummy
	var that = this; // make 'this' accessble by privileged methods
	
	var sampleunits = 16;
	
	// Mutables
	var lock = false;
	var cards = new Array();
	
	this.ret = {
		searchchoices: []
	};
	
	// View variables
	var ncardswide = 4, ncardstall = 2;
	
	// Canvas for the cards.
	var nowX, nowY, w = ncardswide*cardw, h = ncardstall*cardh, r=30;
	var cardpaper = Raphael(document.getElementById("cardcanvas"), w, h);
	
	// Canvas for the timer.
	var timertotalw = w/2;
	var timertotalh = 50;
	var w2 = timertotalw, h2 = timertotalh;
	var timerpaper = Raphael(document.getElementById("timercanvas"), w2, h2);
	
	var timerects = timerpaper.set();
	timerectw = timertotalw / (sampleunits*2-1);
	for ( i=0; i < sampleunits; i ++) {
		timerects.push(
			timerpaper.rect(
				timerectw * i * 2,
				0,
				timerectw, timertotalh, [5]).attr({fill:"red" }));
	}
	
	// Category labels are just the letters.
	
	// Card locations are randomized.
	var randomcardplace = new Array();
	for ( i=0; i < ncards; i ++ ){ 
		randomcardplace.push( i ); 
	}
	shuffle( randomcardplace );
	
	this.cardclickActive = function (cardid) {
		return function() {
			if ( ! timerects.length ) { return false; }
			if ( lock ) {  return false; }
			lock = true;
			cards[cardid][2].show();
			timestamp = new Date().getTime();
			that.ret.searchchoices.push( { card:cardid, time: timestamp } );
			setTimeout(
				function(){
					cards[cardid][2].hide();
					timerects.pop().hide();
					if ( ! timerects.length ) {
						// alert( this.ret.searchchoices );
						alert("You have finished! Click OK to go on to the test phase.");
						initializeTest();
					}
					lock = false;
				},
				500);
			return true;
		};
	};
	
	var presentations = [0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7];
	shuffle(presentations);
	this.next = presentations.pop();
	this.indicateCard = function(cardid) {
		that.lock = true;
		cards[cardid][0].attr({fill:"0A0" });
		setTimeout(
				function(){
					cards[cardid][0].attr({fill:"black"});
				},
				100);
		setTimeout(
				function(){
					cards[cardid][0].attr({fill:"orange"});
				},
				200);
		setTimeout(
				function(){
					cards[cardid][0].attr({fill:"black"});
				},
				300);
		setTimeout(
				function(){
					cards[cardid][0].attr({fill:"orange"});
					that.lock = false;
				},
				400);
	};
	this.cardclickPassive = function (cardid) {
		return function() {
			if ( that.next != cardid ) { return false; }
			if ( ! timerects.length ) { return false; }
			if ( lock ) {  return false; }
			lock = true;
			cards[cardid][0].attr({fill:"black"});
			cards[cardid][2].show();
			timestamp = new Date().getTime();
			that.ret.searchchoices.push( { card:cardid, time: timestamp } );
			that.next = presentations.pop();
			setTimeout(
				function(){
					cards[cardid][2].hide();
					timerects.pop().hide();
					if ( ! timerects.length ) {
						// alert( this.ret.searchchoices );
						alert("You have finished! Click OK to go on to the test phase.");
						testobject = new TestPhase();
					}
					that.indicateCard(that.next);
					lock = false;
				},
				500);
			return true;
		};
	};
	
	for ( i=0; i < ncards; i ++){
		var cardloci = randomcardplace[i];
		cards[i] = cardpaper.set();
		var thisleft = cardw * (cardloci % 4) + left;
		var thistop = cardh*Math.floor(cardloci/4) + upper;
		var imgoffset = (cardw-imgw)/2;
		
		cards[i].catnum = catfun( i );
		cards[i].push( cardpaper.rect( thisleft + (imgoffset/2), thistop+(imgoffset/2), imgw+(imgoffset), cardh-imgoffset).attr({fill:"black" }));
		cards[i].push( cardpaper.image( cardnames[getstim(i)], thisleft + imgoffset, thistop+imgoffset, imgw, imgh) );
		cards[i].push( cardpaper.text( thisleft + cardw/2, (thistop+imgoffset + thistop+(imgoffset/2) + cardh-imgoffset + imgh)/2, categorynames[cards[i].catnum] ).attr({ fill: "white", "font-size":36 }).hide() );
		
		if (condition.traintype) {
			cards[i].click( this.cardclickPassive(i) );
		}
		else {
			cards[i].click( this.cardclickActive(i) );
		}
	}
	
	this.indicateCard(this.next);
	
	// Now for the public methods
	return {
		getresps: function() {
			return that.ret;
		}
	};
};

$(document).ready( function(){
	trainobject = new TrainingPhase();
});

/********************
// CODE FOR TEST
********************/

// Globals defined initially.

// Globals whose values will be filled in on window.onload.

// Functions






var TestPhase = function() {
	var i; // just initializing the iterator dummy
	var that = this; // make 'this' accessble by privileged methods
	var testcardpaper; 
	var testcardsleft = new Array();
	var ret = {
		hits: new Array()
	};
	
	// Remove old elements.
	$('body').empty();
	
	// Now add in the new elements.
	$('body').append(
			'<hl>Test Demo v1</hl>\
			<p id="Instructions">Choose a membership for the following object.</p>\
			<div id="testcanvas"> </div>\
			<p id="querytext">Which category does the object belong to?\
			<div id="inputs">\
				<input type="button" id="CategoryA" value="A" onclick="catresponse(\'A\')">\
				<input type="button" id="CategoryB" value="B" onclick="catresponse(\'B\')">\
			</div>');
	
	catresponse = function (buttonid){
		if ( buttonid=="A" ) selectedcard = 0;
		else selectedcard = 1;
		if (selectedcard == catfun(prescard) ) ret.hits.push(true);
		else ret.hits.push(false);
		nextcard();
	};
	
	var nextcard = function () {
		if (! testcardsleft.length) {
			alert( "You got " + boolmean(ret.hits) + "% correct." );
			postback();
			return false;
		}
		prescard = testcardsleft.pop();
		testcardpaper.image( cardnames[getstim(prescard)], 0, 0, imgw, imgh);
		return true;
	};
	
	var nowX, nowY, w = imgw, h = imgh, r=30;
	testcardpaper = Raphael(document.getElementById("testcanvas"), w, h);
	testcardsleft = [0,1,2,3,4,5,6,7];
	shuffle(testcardsleft);
	nextcard();
	
	return {
		getresps: function() {
			return that.ret;
		}
	};
};




