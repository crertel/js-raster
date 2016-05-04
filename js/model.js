function Model() {
  this._verts = new Float32Array();
  this._normals = new Float32Array();
  this._uvs = new Float32Array();
  this._faces = new Int32Array();
}

Model.prototype.toTriArray = function() {
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

Model.prototype.loadFromOBJString = function( src ) {
  // split source into trimmed lines with comments removed
  var processedLines = src.split('\n')
                          .map( function(s) { return s.replace(/#.*/,'').trim(); })
                          .filter( function(s) { return s.length !== 0; });

  var parseState = {
    verts: [],
    uvs: [],
    norms: [],
    faces: []
  };

  function decodeVertex( toks ) {
    if (toks.length < 3 || toks.length > 4) {
      throw new Error("Malformed vertex");
    }
    return toks.slice(1).map(Number.parseFloat);
  };

  function decodeNormal( toks ) {
    if (toks.length !== 4) {
      throw new Error("Malformed normal");
    }
    
    return toks.slice(1).map(Number.parseFloat);
  };

  function decodeUV( toks ) {
    if (toks.length < 3 || toks.length > 4) {
      throw new Error("Malformed UV");
    }

    return toks.slice(1).map(Number.parseFloat);
  };

  function decodeFaceToken(tok){

    var indices = {
      vert: 0,
      uv: 0,
      normal: 0
    };

    var kVertIndexOnly = /\d*/;
    var kVertAndUVOnly = /^(\d*)\/(\d*)$/;
    var kVertAndNormalOnly = /^(\d*)\/\/(\d*)$/;
    var kVertUVNormal = /^(\d*)\/(\d*)\/(\d*)$/;

    var match;    
    switch( true ) {
      case (kVertIndexOnly.test(tok)):      indices.vert = Number.parseInt(tok,10);
                                            break;
      case (kVertAndUVOnly.test(tok)):      match = tok.match(kVertAndUVOnly);
                                            indices.vert = Number.parseInt(match[1],10);
                                            indices.uv = Number.parseInt(match[2],10);
                                            break;
      case (kVertAndNormalOnly.test(tok)):  match = tok.match(kVertAndNormalOnly);
                                            indices.vert = Number.parseInt(match[1],10);
                                            indices.normal = Number.parseInt(match[2],10);
                                            break;
      case (kVertUVNormal.test(tok)):       match = tok.match(kVertUVNormal);
                                            indices.vert = Number.parseInt(match[1],10);
                                            indices.uv = Number.parseInt(match[2],10);
                                            indices.normal = Number.parseInt(match[3],10);
                                            break;
      default: break;
    }

    return indices;
  }

  function decodeFace( toks ) {
    if (toks.length < 4) {
      throw new Error("Malformed face");
    }

    if (toks.length > 4) {
      throw new Error("Nontriangulated face (unsupported)");
    }

    return toks.slice(1)
            .map(decodeFaceToken)
            .reduce( function globIndices( out, indices ){
              out.verts.push( indices.vert );
              out.uvs.push( indices.uv );
              out.norms.push( indices.normal );
              return out;
          },{
            verts: [],
            uvs: [],
            norms: []
          });
  }

  var parsedState = processedLines.reduce( function (state, line) {
    var toks = line.split(/\s+/);
    try {
      switch(true) {
        case ('v' === toks[0]) :  state.verts = state.verts.concat(decodeVertex(toks)); break;
        case ('vn' === toks[0]) : state.norms = state.verts.concat(decodeNormal(toks)); break;
        case ('vt' === toks[0]) : state.uvs = state.uvs.concat(decodeUV(toks)); break;
        case ('f' === toks[0]) :  state.faces = state.faces.concat(decodeFace(toks).verts); break;
        default: throw new Error("Unrecognized line"); break;
      }      
    } catch( e ) {
      console.log("ERROR ", e.toString(), '\n>>>\t ', line);
    }
    return state;
  }, parseState);

  this._verts = Float32Array.from( parsedState.verts );
  this._uvs = Float32Array.from( parsedState.uvs );
  this._normals = Float32Array.from( parsedState.norms );
  this._faces = Int32Array.from(parsedState.faces);
  
  console.log('Model has\n',
    '\t', this._verts.length/3, ' vertices\n',
    '\t', this._uvs.length/3, ' UVs\n',
    '\t', this._normals.length/3, ' normals\n',
    '\t', this._faces.length/3, ' faces');

  return processedLines;
}
