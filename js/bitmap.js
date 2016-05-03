function Bitmap( width, height, $container ) {
  this._width = width;
  this._height = height;
  this._$canvas = document.createElement( 'canvas' );
  this._$canvas.width = width;
  this._$canvas.height = height;
  $container.appendChild( this._$canvas );
  this._ctx = this._$canvas.getContext('2d');
  this._imageInfo = this._ctx.createImageData( this._$canvas.width, this._$canvas.height );
  this._frameBufferData = new Uint8ClampedArray( this._width * this._height * 4 );
  this._frameBuffer = new ImageData(  this._frameBufferData, this._width, this._height );
  this._tempPixelData = new Uint8ClampedArray(4);
  this._tempPixel = new ImageData(this._tempPixelData,1,1);
}

Bitmap.prototype.clear = function() {
  this._ctx.putImageData(this._frameBuffer,0,0);
}

Bitmap.prototype.putPixel = function( val, x, y ){  
  this._tempPixelData[0] = val[0];
  this._tempPixelData[1] = val[1];
  this._tempPixelData[2] = val[2];
  this._tempPixelData[3] = val[3];
  this._ctx.putImageData(this._tempPixel, x, y);
}

console.log("Loaded bitmap shim.");
