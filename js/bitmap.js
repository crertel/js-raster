function Bitmap( width, height, $canvas ) {
  this._$canvas = $canvas;
  this._ctx = this._$canvas.getContext('2d');  
  this._depthFunc = Bitmap.kDepthFunc.ALWAYS;
  this._depthMask = true;
  this.resize( width, height );  
}

Bitmap.kDepthFunc = {
  NEVER:  ( oldZ, currZ ) => false,
  LESS:   ( oldZ, currZ ) => (currZ < oldZ),
  EQUAL:  ( oldZ, currZ ) => (currZ == oldZ),
  LEQUAL: ( oldZ, currZ ) => (currZ <= oldZ),
  GREATER:( oldZ, currZ ) => (currZ == oldZ),
  NEQUAL: ( oldZ, currZ ) => (currZ != oldZ),
  GEQUAL: ( oldZ, currZ ) => (currZ >= oldZ),
  ALWAYS: ( oldZ, currZ ) => true
}

Bitmap.prototype.resize = function( newWidth, newHeight) {  
  this._$canvas.width = this._width =  newWidth;
  this._$canvas.height = this._height = newHeight;
  this._frameBufferData = new Uint8ClampedArray( this._width * this._height * 4 );
  this._frameBuffer = new ImageData(  this._frameBufferData, this._width, this._height );
  this._depthBuffer = new Float32Array( this._width * this._height );
}


Bitmap.prototype.clear = function() {
  this._depthBuffer.fill(0);
  this._frameBufferData.fill(0);
}

Bitmap.prototype.flush = function() {
  this._ctx.putImageData(this._frameBuffer,0,0);
}

Bitmap.prototype.setDepthFunc = function( depthFunc ) {
  this._depthFunc = depthFunc;
}

Bitmap.prototype.setDepthMask = function( depthMask ) {
  this._depthMask = depthMask;
}

Bitmap.prototype.putPixel = function(x, y, r, g, b, a, z ){
  if (x >= 0 && x < this._width && y >= 0 && y < this._height) {
    x = Math.floor(x);
    y = Math.floor(y);

    var depthBaseIndex = (x + (y*this._width)); /* indexing a pile of floats */
    var pixelBaseIndex = 4 * (x + (y*this._width)); /* RGBA, 4 bytes per pixel */

    if ( this._depthFunc( this._depthBuffer[depthBaseIndex], z ) ) {
      this._frameBufferData[ pixelBaseIndex + 0] = r;
      this._frameBufferData[ pixelBaseIndex + 1] = g;
      this._frameBufferData[ pixelBaseIndex + 2] = b;
      this._frameBufferData[ pixelBaseIndex + 3] = a;

      if (this._depthMask) {
        this._depthBuffer[ depthBaseIndex ] = z;
      }
    }
  }
}

Bitmap.prototype.getDebugInfoForPixel = function( x, y ) {
  x = Math.floor(x);
  y = Math.floor(y);

  var depthBaseIndex = (x + (y*this._width)); /* indexing a pile of floats */
  var pixelBaseIndex = 4 * (x + (y*this._width)); /* RGBA, 4 bytes per pixel */

  return {
    x: x,
    y: y,
    r: this._frameBufferData[ pixelBaseIndex + 0],
    g: this._frameBufferData[ pixelBaseIndex + 1],
    b: this._frameBufferData[ pixelBaseIndex + 2],
    a: this._frameBufferData[ pixelBaseIndex + 3],
    z: this._depthBuffer[ depthBaseIndex ]
  }  
}

Bitmap.prototype.addPicker = function( cb ) {
  this._$canvas.addEventListener( 'mousemove', function _handlePick(evt){
    cb(evt.clientX, evt.clientY);
  });
}