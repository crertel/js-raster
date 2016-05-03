function Model() {
  this._verts = new Float32Array();
  this._normals = new Float32Array();
  this._uvs = new Float32Array();
  this._faces = new Int32Array();
}

Model.prototype.toTriArray() {
  // this assumes face indices are trilists and not strips
  return this._faces.reduce( function( acc, el, idx) {
    // unpack the face indexes into an array of 3-tuples
    if (idx % 3) {
      acc.push([]);
    }
    acc[acc.length-1][idx % 3] = el;
    return acc;
  }, [])
  .reduce( function( acc, el, idx ) {
    acc.set( this._verts.subarray( 3 * el[0], 3 * el[0] + 1 ), (idx * 9) );
    acc.set( this._verts.subarray( 3 * el[1], 3 * el[1] + 2 ), (idx * 9) + 3 );
    acc.set( this._verts.subarray( 3 * el[2], 3 * el[2] + 3 ), (idx * 9) + 6);
    return acc;
  }, new Float32Array( this.faces.length * 3 * 3));
}

Model.prototype.loadFromOBJString( src ) {
  // split source into trimmed lines with comments removed
  var processedLines = src.split('\n')
                          .map( function(s) { return s.replace(/#.*/,'').trim(); })
                          .filter( function(s) { return s.length !== 0; });


  

  return processedLines;
}
