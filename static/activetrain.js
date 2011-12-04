

/********************
// CODE FOR TRAINING
********************/

// Globals defined initially.
cardnames = [
	"images/STIM00.GIF",
	"images/STIM01.GIF",
	"images/STIM02.GIF",
	"images/STIM03.GIF",
	"images/STIM04.GIF",
	"images/STIM05.GIF",
	"images/STIM06.GIF",
	"images/STIM07.GIF"];
var sampleunits = 16;
var cardh = 180, cardw = 140, upper = 0, left = 0;
var subjid = 0;

// Globals whose values will be filled in on window.onload.
var cards = new Array();
var timerects;


// Mutable Globals
var lock = false;

// Dict storing all the stuff we'll return
var ret = {
	subjid: subjid,
	queries: [],
	hits: []
};


// Helper functions

// Fisher-Yates shuffle algorithm 
// modified from http://sedition.com/perl/javascript-fy.html
function shuffle ( myArray ) {
  if ( ! myArray.length ) { return false; }
  for ( var i=myArray.length; i>0; i-- ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = myArray[i];
     var tempj = myArray[j];
     myArray[i] = tempj;
     myArray[j] = tempi;
   }
  return myArray;
}

boolmean = function(arr) {
	count = 0;
	for (i=0; i<arr.length; i++) {
		if (arr[i]) { count++; } 
	}
	return 100* count / arr.length;
};

// Interface functions
cardclick = function (cardid) {
	return function() {
		if ( ! timerects.length ) { return false; }
		if ( lock ) {  return false; }
		lock = true;
		cards[cardid][2].show();
		setTimeout(
			function(){
				cards[cardid][2].hide();
				timerects.pop().hide();
				if ( ! timerects.length ) {
					alert("You have finished! Click OK to go on to the test phase.");
					initializeTest();
				}
				lock = false;
			},
			500);
		return true;
	};
};

// Task-specific functions
catfun = function ( num ) {
	return num % 2;
};

initializeTraining = function () {
	var cardh = 180, cardw = 150;
	var imgh = 100, imgw = 100;
	var ncardswide = 4;
	var ncardstall = 2;
	var upper = 0;
	var left = 0;
	// Canvas for the cards.
	var nowX, nowY, w = ncardswide*cardw, h = ncardstall*cardh, r=30;
	var cardpaper = Raphael(document.getElementById("cardcanvas"), w, h);
	// Canvas for the timer.
	var timertotalw = w/2;
	var timertotalh = 50;
	var w2 = timertotalw, h2 = timertotalh;
	var timerpaper = Raphael(document.getElementById("timercanvas"), w2, h2);
	
	// Category labels are just the letters.
	var categorynames= [ "A", "B" ];
	
	var randomcardplace = new Array();
	for ( i=0; i < cardnames.length; i ++ ){ randomcardplace.push( i ); }
	randomcardplace = shuffle( randomcardplace );
	
	for ( i=0; i < cardnames.length; i ++){
		var cardloci = randomcardplace[i];
		cards[i] = cardpaper.set();
		var thisleft = cardw * (cardloci % 4) + left;
		var thistop = cardh*Math.floor(cardloci/4) + upper;
		var imgoffset = (cardw-imgw)/2;
		
		cards[i].catnum = catfun( i );
		cards[i].push( cardpaper.rect( thisleft + (imgoffset/2), thistop+(imgoffset/2), imgw+(imgoffset), cardh-imgoffset).attr({fill:"black" }));
		cards[i].push( cardpaper.image( cardnames[i], thisleft + imgoffset, thistop+imgoffset, imgw, imgh) );
		cards[i].push( cardpaper.text( thisleft + cardw/2, (thistop+imgoffset + thistop+(imgoffset/2) + cardh-imgoffset + imgh)/2, categorynames[cards[i].catnum] ).attr({ fill: "white", "font-size":36 }).hide() );
		
		cards[i].click( cardclick(i) );
	}
	
	timerects = timerpaper.set();
	timerectw = timertotalw / (sampleunits*2-1);
	for ( i=0; i < sampleunits; i ++){
		timerects.push( 
			timerpaper.rect( 
				timerectw * i * 2, 
				0,
				timerectw, timertotalh, [5]).attr({fill:"red" }));
	}
};


/********************
// CODE FOR TEST
********************/

// Globals defined initially.
var imgh = 100;
var imgw = 100;

// Globals whose values will be filled in on window.onload.
var testcardpaper, testcardsleft;
var hits = [];

// Funcitons
function catresponse(buttonid){
	if ( buttonid=="A" ) selectedcard = 0;
	else selectedcard = 1;
	if (selectedcard == catfun(prescard) ) ret.hits.push(true);
	else ret.hits.push(false);
	nextcard();
}

function nextcard() {
	if (! testcardsleft.length) {
		alert( "You got " + boolmean(ret.hits) + "% correct." );
		postback();
		return false;
	}
	prescard = testcardsleft.pop();
	testcardpaper.image( cardnames[prescard], 0, 0, imgw, imgh);
	return true;
}

appendtobody = function( tag, id, contents ) {
	el = document.createElement( tag );
	el.id = id;
	el.innerHTML = contents;
	return el;
};

showtest = function() {
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
};


initializeTest = function () {
	showtest();
	
	var nowX, nowY, w = imgw, h = imgh, r=30;
	testcardpaper = Raphael(document.getElementById("testcanvas"), w, h);
	testcardsleft = shuffle( [0,1,2,3,4,5,6,7] );
	nextcard();
};

/********************
// Postback
********************/

postback = function() {
	$.ajax("submit.py", {
		type: "POST",
		data: ret,
		error: function(jqXHR,textStatus,errorThrown) { setTimeout( $.ajax(this), 1000 ); }
	});
};



