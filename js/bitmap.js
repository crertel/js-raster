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
  this._frameBufferData = new Uint32Array( this._width * this._height);
  this._frameBuffer = new ImageData(  new Uint8ClampedArray(this._frameBufferData.buffer), this._width, this._height );
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

    var pixelIndex = (x + (y*this._width));

    if ( this._depthFunc( this._depthBuffer[pixelIndex], z ) ) {
      this._frameBufferData[ pixelIndex ] = r | (g << 8) | (b << 16) | (a<<24);

      if (this._depthMask) {
        this._depthBuffer[ pixelIndex ] = z;
      }
    }
  }
}

Bitmap.prototype.getDebugInfoForPixel = function( x, y ) {
  x = Math.floor(x);
  y = Math.floor(y);

  var pixelIndex = (x + (y*this._width));

  return {
    x: x,
    y: y,
    r: this._frameBufferData[ pixelIndex ] & 0x000000ff,
    g: this._frameBufferData[ pixelIndex ] & 0x0000ff00 >> 8,
    b: this._frameBufferData[ pixelIndex ] & 0x00ff0000 >> 16,
    a: this._frameBufferData[ pixelIndex ] & 0xff000000 >> 24,
    z: this._depthBuffer[ pixelIndex ]
  }  
}

Bitmap.prototype.addPicker = function( cb ) {
  this._$canvas.addEventListener( 'mousemove', function _handlePick(evt){
    cb(evt.clientX, evt.clientY);
  });
}