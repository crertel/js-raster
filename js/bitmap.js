console.log("Loaded bitmap shim.");

function Bitmap( width, height, $container ) {
  this._width = width;
  this._height = height;
  this._$canvas = document.createElement( 'canvas' );
  this._$canvas.width = width;
  this._$canvas.height = height;
  $container.appendChild( this._$canvas );
  this._ctx = this._$canvas.getContext('2d');
  this._imageInfo = this._ctx.createImageData( this._$canvas.width, this._$canvas.height );
}

Bitmap.prototype.clear = function() {
  var imgData = new ImageData(  new Uint8ClampedArray( this._width * this._height * 4 ),
                                this._width,
                                this._height );
  this._ctx.putImageData(imgData,0,0);
}

Bitmap.prototype.putPixel = function( val, x, y ){
  var col = new Uint8ClampedArray(4);
  col[0] = val[0];
  col[1] = val[1];
  col[2] = val[2];
  col[3] = val[3];
  var imgData = new ImageData(col,1,1);

  this._ctx.putImageData(imgData, x, y);
}
