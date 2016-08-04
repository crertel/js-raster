// https://github.com/ssloy/tinyrenderer/wiki/Lesson-2:-Triangle-rasterization-and-back-face-culling
// http://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/rasterization-stage

function smallest( a, b) {
  return (b < a) ? b : a;
}

function biggest( a, b) {
  return (b > a) ? b : a;
}

function calcBB(  minx, miny, minz,
                  maxx, maxy, maxz,
                  ax, ay, az,
                  bx, by, bz,
                  cx, cy, cz ) {
  return {
      minx: [ax,bx,cx].reduce( smallest, maxx),
      miny: [ay,by,cy].reduce( smallest, maxy),
      minz: [az,bz,cz].reduce( smallest, maxz),
      maxx: [ax,bx,cx].reduce( biggest, minx),
      maxy: [ay,by,cy].reduce( biggest, miny),
      maxz: [az,bz,cz].reduce( biggest, minz)
  };
}

function edgeFunction( ax, ay, bx, by, cx, cy ) {
  return ((cx-ax)*(by-ay)) - ((cy-ay)*(bx-ax));
}

function caluclateDepth( ax, ay, az, bx, by, bz, cx, cy, cz, x, y) {
  // TODO

  return 0;
}

function rasterFlatTriangleBarycentric( bitmap, ax, ay, az, bx, by, bz, cx, cy, cz, color ) {
  // find bounding box for triangle
  var bb = calcBB( 0, 0, 0, bitmap._width, bitmap._height, 0, ax,ay,az,bx,by,bz,cx,cy,cz);

  // clip bounding box to screen (thanks ryg!)
  bb.minx = (bb.minx < 0) ? 0 : bb.minx;
  bb.miny = (bb.miny < 0) ? 0 : bb.miny;
  bb.maxx = (bb.maxx >= bitmap._width) ? bitmap._width : bb.maxx;
  bb.maxy = (bb.maxy >= bitmap._height) ? bitmap._height : bb.maxy;

  // shade every pixel that exists in the bounding box, if in triangle
  for (var x = Math.floor(bb.minx); x <= Math.ceil(bb.maxx); x++ ) {
    for (var y = Math.floor(bb.miny); y <= Math.ceil(bb.maxy); y++ ) {

      var w0 =    edgeFunction( bx, by, cx, cy, x, y );
      var w1 =    edgeFunction( cx, cy, ax, ay, x, y );
      var w2 =    edgeFunction( ax, ay, bx, by, x, y );
  
      if ( w0 > 0 && w1 > 0 && w2 > 0) {
        var z = caluclateDepth( ax, ay, az, bx, by, bz, cx, cy, cz, x, y);
        //bitmap.putPixel(x,y, color[0], color[1], color[2], color[3], z);
        bitmap.putPixel(x,y, z,0,0, color[3], z);
      }
    }
  }
}
