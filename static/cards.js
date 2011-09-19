

window.onload = function () {
    var translucence = .9;
    var cardh = 231;
    var cardw = 165;
    var nowX, nowY, w = 1000, h=800, r=30, R = Raphael(document.getElementById("holder"), w, h),
        c1 = R.image( "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.18-filtered.jpg", cardw, 20, cardw, cardh ).attr({
        //c = R.circle( 100, 100, 50 ).attr({
        //fill: "hsb(.8,1,1)",
        opacity: 1,
        cursor: "move"
    }),
        c2 = R.image( "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.23-filtered.jpg", cardw*2, 20, cardw, cardh ).attr({
        //c = R.circle( 100, 100, 50 ).attr({
        //fill: "hsb(.8,1,1)",
        opacity: 1,
        cursor: "move"
    }),
        c3 = R.image( "http://www.laeh500.com/LAEH/Mafia_Blue_files/small.21-filtered.jpg", cardw*3, 20, cardw, cardh ).attr({
        //c = R.circle( 100, 100, 50 ).attr({
        //fill: "hsb(.8,1,1)",
        opacity: 1,
        cursor: "move"
    });
    
    var start = function () {
        this.ox = this.attr( "cx" );
        this.oy = this.attr( "cy" );
        this.attr({opacity: translucence});
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
    c1.drag( movePath, start, up );
    c2.drag( movePath, start, up );
    c3.drag( movePath, start, up );
};
