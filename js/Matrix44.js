function Matrix44(){
	this._mat = new Float32Array(	1,0,0,0,
									0,1,0,0,
									0,0,1,0,
									0,0,0,1);
}

/*
	Function to apply a matrix transformation to a Vec3 array.

	Given a Float32 array, an offset to start in the array, the stride in indices
	between consecutive vec3s, and the number of vec3s to transform.

	Given the normal model layout of [Px,Py,Pz,Nx,Ny,Nz,Tu,TV], we
*/
Matrix44.prototype.transformVec3ArrayInPlace = function( array, offset, stride, count ){
	var vecBaseX = offset;
	var vecBaseY = offset+1;
	var vecBaseZ = offset+2;
	var arrayLength = array.length;

	var m00 = this._mat[0];
	var m01 = this._mat[1];
	var m02 = this._mat[2];
	var m03 = this._mat[3];

	var m10 = this._mat[4];
	var m11 = this._mat[5];
	var m12 = this._mat[6];
	var m13 = this._mat[7];

	var m20 = this._mat[8];
	var m21 = this._mat[9];
	var m22 = this._mat[10];
	var m23 = this._mat[11];

	var m30 = this._mat[12];
	var m31 = this._mat[13];
	var m32 = this._mat[14];
	var m33 = this._mat[15];

	while( count > 0) {
		var x = array[vecBaseX];
		var y = array[vecBaseY];
		var z = array[vecBaseZ];
		var w = 1.0;

		array[vecBaseX] = (x*m00)+(y*m10)+(z*m20)+m30;
		array[vecBaseY] = (x*m01)+(y*m11)+(z*m21)+m31;
		array[vecBaseZ] = (x*m02)+(y*m12)+(z*m22)+m32;

		vecBaseX += stride;
		vecBaseY += stride;
		vecBaseZ += stride;
		count--;
	}

}