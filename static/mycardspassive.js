var lock = false;

var timerrects;


var sampleunits = 10;



shuffle = function(o){ //v1.1
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

catfun = function ( num ) {
    return num % 2;
}

fuckjavascript = function ( categorylabel, randomNum) {
	return function () {
    			if ( lock == true ) {  return false };
    			lock = true;
    			categorylabel.show()
    			setTimeout(
    				function(){
     					categorylabel.hide();
    					lock = false;
    					timerrects.pop().hide();
    					if (timerrects.length == 0) {alert("You have finished! Click OK to go to the next screen.")}; 
    				},
    				2000
    		);
    	
	}
}

window.onload = function () {
	var cardh = 180;
	var cardw = 140;
	var imgh = 100;
	var imgw = 100;
	var ncardswide = 4
	var ncardstall = 2
	var upper = 0;
	var left = 0;
	var timertotalw = 500
	var timertotalh = 50
	var nowX, nowY, w = ncardswide*cardw, h = ncardstall*cardh, r=30, cardpaper = Raphael(document.getElementById("cardcanvas"), w, h)
	var nowx2, nowY2, w2 = timertotalw, h2= timertotalh, r=30, timerpaper = Raphael(document.getElementById("timercanvas"), w2, h2)
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

 	var randomNum = Math.floor((Math.random() * cardnames.length));
    var cards = new Array();
    var randomcardplace = new Array();
    var categorynames = new Array ("A", "B");

    for ( i=0; i < cardnames.length; i ++ ){ randomcardplace.push( i ) };
    randomcardplace = shuffle( randomcardplace );

    for ( i=0; i < cardnames.length; i ++){
    	var cardloci = randomcardplace[i];
    	cards[i] = cardpaper.set();
    	var thisleft = cardw * (cardloci % 4) + left;
    	var thistop = cardh*Math.floor(cardloci/4) + upper;
    	var imgoffset = (cardw-imgw)/2;
 	   	cards[i].catname = categorynames[catfun(i)];
     	cards[i].push( cardpaper.rect( thisleft + (imgoffset/2), thistop+(imgoffset/2), imgw+(imgoffset), cardh-imgoffset).attr({fill:"black" })
     	);
    	cards[i].push( cardpaper.image( cardnames[i], thisleft + imgoffset, thistop+imgoffset, imgw, imgh) );
     	cards[i].push( cardpaper.text( thisleft + cardw/2, (thistop+imgoffset + thistop+(imgoffset/2) + cardh-imgoffset + imgh)/2, cards[i].catname ).attr({ fill: "white", "font-size":36 }).hide()  );
		var categorylabel = cards[i].splice(2,1)
    	cards[i].click(fuckjavascript ( categorylabel ) );
    };
    	   
    timerrects = timerpaper.set();

    for ( i=0; i < sampleunits; i ++){
    	timerrects.push( timerpaper.rect( (((timertotalw / sampleunits)/2) % 10) * ([i] + 1), 0, (timertotalw / sampleunits) - 10, timertotalh, [5] ).attr({fill:"red" })
    	);
    	};
};

    	
	