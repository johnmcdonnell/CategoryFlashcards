

shuffle = function(o){ //v1.0
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

catfun = function ( num ) {
    return num % 2;
}
var cardnames = [
	"images/STIM00.GIF",
    "images/STIM01.GIF",
    "images/STIM02.GIF",
    "images/STIM03.GIF",
    "images/STIM04.GIF",
    "images/STIM05.GIF",
    "images/STIM06.GIF",
    "images/STIM07.GIF",
     ];


var cardpaper;
var selectedcard;
var subjectscore;
var blocktally;
var cardsleft;
var prescard;
var hits = new Array();

function on_submit() {
	alert( "Congratulations! You have finished the test phase." );
}

function catresponse(buttonid){
	if ( buttonid=="A" ) selectedcard = 0;
	else selectedcard = 1;
	if (selectedcard == catfun(prescard) ) hits.push(true);
	else hits.push(false);
	nextcard();
};

var imgh = 100;
var imgw = 100;

function nextcard() {
	if (cardsleft.length==0) {
		on_submit();
		return;
	}
	prescard = cardsleft.pop();
	cardpaper.image( cardnames[prescard], 0, 0, imgw, imgh);
}

window.onload = function () {
	var cardh = 180;
	var cardw = 140;
	var upper = 0;
	var left = 0;
	var nowX, nowY, w = imgw, h = imgh, r=30;
	cardpaper = Raphael(document.getElementById("testcanvas"), w, h)
            
	cardsleft = shuffle( [0,1,2,3,4,5,6,7] );
	nextcard()
	
	//wait for subject response before popping the element out of the array. probably want to put this part into an event handler on mouse click
	//randomcardplace.pop();



};


    
