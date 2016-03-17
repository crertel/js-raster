function bresenhamLine( canvas, p0, p1, color ) {

  var dx = p1[0] - p0[0];
  var dy = p1[1] - p0[1];
  var dydx = dy / dx;
  var dxdy = dx / dy;

  // this check causes us to draw alo9ng the least-degenerate case
  if ( Math.abs(dx) >= Math.abs(dy) ) {
    for ( var i = 0; i < Math.abs(dx); i++ ) {
      // this handles case where points are in inconvenient order
      if ( dx > 0 ) {
        var tx = i  + p0[0];
        var ty = i*dydx + p0[1];
      } else {
        var tx = -i  + p0[0];
        var ty = -i*dydx + p0[1];
      }
      canvas.putPixel( color, tx, ty );
    }
  } else {
    for ( var i = 0; i < Math.abs(dy); i++ ) {
      // inconvenient check as in above
      if ( dy > 0 ) {
        var tx = i*dxdy  + p0[0];
        var ty = i + p0[1];
      } else {
        var tx = -i*dxdy  + p0[0];
        var ty = -i + p0[1];
      }
      canvas.putPixel( color, tx, ty );
    }
  }
}

console.log("Loaded bresenham line drawing.");
