
shuffle = function(o){ //v1.0
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};


catfun = function ( num ) {
    return num % 2;
}

window.onload = function () {
    var translucence = .9;
    var cardh = 100;
    var cardw = 100;
    var upper = 100;
    var left = 300;
    var nowX, nowY, w = 1000, h=800, r=30, R = Raphael(document.getElementById("holder"), w, h)
    var cardnames =  [
        "images/STIM00.GIF",
        "images/STIM01.GIF",
        "images/STIM02.GIF",
        "images/STIM03.GIF",
        "images/STIM04.GIF",
        "images/STIM05.GIF",
        "images/STIM06.GIF",
        "images/STIM07.GIF",
        ];
    var catnames = [
        "http://www.craftjr.com/wp-content/uploads/2009/04/a.gif",
        "http://www.craftjr.com/wp-content/uploads/2009/04/b.gif"
        ]
    
    var start = function () {
        this.ox = this.attr( "cx" );
        this.oy = this.attr( "cy" );
        this.attr({opacity: translucence,
        });
        this.toFront();
    },
    movePath = function (dx, dy) {
       // move is called with dx and dy, which we convert
       // into translate values, which are reset at the end
       // of the function
       var trans_x = dx-this.ox;
       var trans_y = dy-this.oy;
       this.translate(trans_x,trans_y);
       this.ox = dx;
       this.oy = dy;
    },
    up = function() {
        this.attr({opacity: 1 });
    };
    
    var cards = new Array();
    var randomis = new Array();
    for ( i=0; i < cardnames.length; i ++ ){ randomis.push( i ) };
    randomis = shuffle( randomis );
    
    for ( i=0; i < cardnames.length; i ++ ){
        var loci = randomis[i]
        cards[i] = R.image( cardnames[i], cardw * (loci % 4) + left, cardh*Math.floor(loci/4) + upper, cardw, cardh ).attr({
            opacity: 1,
            cursor: "move"
        });
        cards[i].catname = catnames[ catfun( i ) ];
        cards[i].original = cardnames[i];
        cards[i].drag( movePath, start, up );
        cards[i].dblclick( function( event ) {
            this.attr({
                src: this.catname
            });
            var image = this;
            setTimeout( 
                function(){ 
                    image.attr({src: image.original });
                    image=null; }, 
                2000
            );
        });
    };
    
};
