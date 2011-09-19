

window.onload = function () {
    var translucence = .9;
    var cardh = 231;
    var cardw = 165;
    var nowX, nowY, w = 1000, h=800, r=30, R = Raphael(document.getElementById("holder"), w, h)
    var cardnames =  [
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.18-filtered.jpg",
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.21-filtered.jpg",
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.24-filtered.jpg",
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.25-filtered.jpg",
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.08-filtered.jpg",
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.10-filtered.jpg",
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.12-filtered.jpg",
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.13-filtered.jpg",
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.14-filtered.jpg",
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.15-filtered.jpg",
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.05-filtered.jpg",
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.02-filtered.jpg",
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.01-filtered.jpg",
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.27-filtered.jpg",
        "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.23-filtered.jpg",
        ];
    
    var start = function () {
        this.ox = this.attr( "cx" );
        this.oy = this.attr( "cy" );
        this.attr({opacity: translucence});
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
        this.attr({opacity: 1});
    };
    
    var cards = new Array();
    for ( i=0; i < cardnames.length; i ++ ){
        cards[i] = R.image( cardnames[i], cardw * (i % 5), cardh*Math.floor(i/5), cardw, cardh ).attr({
            opacity: 1,
            cursor: "move"
        });
        cards[i].drag( movePath, start, up );
    }
    
};
