function rasterFlatTriangleBarycentric( bitmap, ax, ay, az, bx, by, bz, cx, cy, cz, color ) {
  function calcBB(  minx, miny, minz,
                    maxx, maxy, maxz,
                    ax, ay, az,
                    bx, by, bz,
                    cx, cy, cz ) {
    return {
      min: {
        minx: [ax,bx,cx].reduce( function( acc, el) { return (el < acc)? el : acc; }, minx),
        miny: [ay,by,cy].reduce( function( acc, el) { return (el < acc)? el : acc; }, miny),
        minz: [az,bz,cz].reduce( function( acc, el) { return (el < acc)? el : acc; }, minz)
      },
      max: {
        maxx: [ax,bx,cx].reduce( function( acc, el) { return (el > acc)? el : acc; }, maxx),
        maxy: [ay,by,cy].reduce( function( acc, el) { return (el > acc)? el : acc; }, maxy),
        maxz: [az,bz,cz].reduce( function( acc, el) { return (el > acc)? el : acc; }, maxz)
      }
    };
  }

    // find bounding box for triangle
    var bb = calcBB( 0, 0, 0, bitmap._width, bitmap._height, 0, ax,ay,az,bx,by,bz,cx,cy,cz);

    // shade every pixel that exists in the bounding box, if in triangle
    for (var x = Math.floor(bb.minx); x <= Math.ceil(bb.maxx); x++ ) {
      for (var y = Math.floor(bb.miny); y <= Math.ceil(bb.maxy); y++ ) {
        //bitmap.putPixel([0,255,0,255],x,y);
      }
    }

    bitmap.putPixel([0,255,0,255],ax,ay);
    bitmap.putPixel([0,255,0,255],bx,by);
    bitmap.putPixel([0,255,0,255],cx,cy);
}
