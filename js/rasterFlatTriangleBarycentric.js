
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

function edgeFunc( ax, ay, bx, by, cx, cy ) {
  return ((cx-ax)*(by-ay)) - ((cy-ay)*(bx-ax));
}

function rasterFlatTriangleBarycentric( bitmap, ax, ay, az, bx, by, bz, cx, cy, cz, color ) {
    // find bounding box for triangle
    var bb = calcBB( 0, 0, 0, bitmap._width, bitmap._height, 0, ax,ay,az,bx,by,bz,cx,cy,cz);

    // shade every pixel that exists in the bounding box, if in triangle
    for (var x = Math.floor(bb.minx); x <= Math.ceil(bb.maxx); x++ ) {
      for (var y = Math.floor(bb.miny); y <= Math.ceil(bb.maxy); y++ ) {
        var area =  edgeFunc( ax, ay, bx, by, cx, cy );
        var w0 =    edgeFunc( bx, by, cx, cy, x, y );
        var w1 =    edgeFunc( cx, cy, ax, ay, x, y );
        var w2 =    edgeFunc( ax, ay, bx, by, x, y );

        ///console.log(area);

        //bitmap.putPixel(x,y, 255 * w0/area, 255 *w1/area,0,255);

        if (  (1 - (w0 + w1))/w2> 0 &&
              w1/w2 > 0 &&
              w0/w2 > 0) {
            bitmap.putPixel(x,y, color[0], color[1], color[2], color[3]);
        }
      }
    }

    bitmap.putPixel(ax,ay,0,0,255,255);
    bitmap.putPixel(bx,by,0,0,255,255);
    bitmap.putPixel(cx,cy,0,0,255,255);
}
