'use strict';

/**
 * 하늘에 구름을 관리하는 매니저
 *
 * @class Atmosphere
 */
var Atmosphere = function() 
{
	if (!(this instanceof Atmosphere)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.cloudsManager = new CloudsManager();
	this.shadowBlendingCube = new ShadowBlendingCube();
};

/**
 * 구름이 땅에 그림자를 그릴때 사용함
 *
 * @class ShadowBlendingCube
 */
var ShadowBlendingCube = function() 
{
	if (!(this instanceof ShadowBlendingCube)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.vertexMatrix = new VertexMatrix();
	this.tTrianglesMatrix = new TTrianglesMatrix();
	this.init(this.vertexMatrix, this.tTrianglesMatrix);

	this.vboVertexCacheKey;
	this.vboIndexCacheKey;
	this.indicesCount = 0;
};

/**
 * 구름이 땅에 그림자를 그릴때 초기화
 *
 * @param vtxMat 변수
 * @param tTriMat 변수
 */
ShadowBlendingCube.prototype.init = function(vtxMat, tTriMat) 
{
	// create a blending cube, with faces inverted.***
	var cubeSideSemiLength = 150.5;

	var r = 0.1;
	var g = 0.1;
	var b = 0.1;
	var alpha = 0.6;

	// Center Bottom of the cube.***
	var vertexList = vtxMat.newVertexList();
	var vertex = vertexList.newVertex();
	vertex.setPosition(0.0, 0.0, -cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	vertex = vertexList.newVertex();
	vertex.setPosition(0.0, 0.0, -cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	vertex = vertexList.newVertex();
	vertex.setPosition(0.0, 0.0, -cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	vertex = vertexList.newVertex();
	vertex.setPosition(0.0, 0.0, -cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	// Bottom of the cube.***
	vertexList = vtxMat.newVertexList();
	vertex = vertexList.newVertex();
	vertex.setPosition(-cubeSideSemiLength, -cubeSideSemiLength,
		-cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	vertex = vertexList.newVertex();
	vertex.setPosition(cubeSideSemiLength, -cubeSideSemiLength,
		-cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	vertex = vertexList.newVertex();
	vertex.setPosition(cubeSideSemiLength, cubeSideSemiLength,
		-cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	vertex = vertexList.newVertex();
	vertex.setPosition(-cubeSideSemiLength, cubeSideSemiLength,
		-cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	// Top of the cube.***
	vertexList = vtxMat.newVertexList();
	vertex = vertexList.newVertex();
	vertex.setPosition(-cubeSideSemiLength, -cubeSideSemiLength,
		cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	vertex = vertexList.newVertex();
	vertex.setPosition(cubeSideSemiLength, -cubeSideSemiLength,
		cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	vertex = vertexList.newVertex();
	vertex.setPosition(cubeSideSemiLength, cubeSideSemiLength,
		cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	vertex = vertexList.newVertex();
	vertex.setPosition(-cubeSideSemiLength, cubeSideSemiLength,
		cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	// Center Top of the cube.***
	vertexList = vtxMat.newVertexList();
	vertex = vertexList.newVertex();
	vertex.setPosition(0.0, 0.0, cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	vertex = vertexList.newVertex();
	vertex.setPosition(0.0, 0.0, cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	vertex = vertexList.newVertex();
	vertex.setPosition(0.0, 0.0, cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	vertex = vertexList.newVertex();
	vertex.setPosition(0.0, 0.0, cubeSideSemiLength);
	vertex.setColorRGBA(r, g, b, alpha);

	// Now, make the tTrianglesMatrix.***
	vtxMat.makeTTrianglesLateralSidesLOOP(tTriMat);
	// tTriMat.invert_trianglesSense();
};

/**
 * 그래픽 카드에 데이터를 올릴때 요청
 *
 * @returns floatArray
 */
ShadowBlendingCube.prototype.getVBOVertexColorRGBAFloatArray = function() 
{
	var floatArray = this.vertexMatrix.getVBOVertexColorRGBAFloatArray();
	return floatArray;
};

/**
 * 그래픽 카드에 데이터를 올릴때 사용(삼각형을 이루어 주는 순서)
 *
 * @returns shortArray
 */
ShadowBlendingCube.prototype.getVBOIndicesShortArray = function() 
{
	this.vertexMatrix.setVertexIdxInList();
	var shortArray = this.tTrianglesMatrix.getVBOIndicesShortArray();
	this.indicesCount = shortArray.length;

	return shortArray;
};

/**
 * 구름 매니저
 *
 * @class CloudsManager
 */
var CloudsManager = function() 
{
	if (!(this instanceof CloudsManager)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.circularCloudsArray = [];
};

/**
 * 원형 구름 생성
 *
 * @returns circularCloud
 */
CloudsManager.prototype.newCircularCloud = function() 
{
	var circularCloud = new CircularCloud();
	this.circularCloudsArray.push(circularCloud);
	return circularCloud;
};

/**
 * 원형 구름
 *
 * @class CircularCloud
 */
var CircularCloud = function() 
{
	if (!(this instanceof CircularCloud)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.radius = 200.0;
	this.depth = 150.0;
	this.numPointsForCicle = 8;

	this.vertexMatrix = new VertexMatrix();
	this.tTrianglesMatrix = new TTrianglesMatrix();
	this.shadowVertexMatrix = new VertexMatrix();
	this.shadowTTrianglesMatrix = new TTrianglesMatrix();

	this.sunLightDirection = new Point3D();
	this.sunLightDirection.set(1, 1, -5);
	this.sunLightDirection.unitary();

	this.longitude;
	this.latitude;
	this.altitude;
	this.position;
	this.positionHIGH;
	this.positionLOW;

	this.bbox = new BoundingBox();
	this.cullingPosition;
	this.cullingRadius;

	this.vboVertexCacheKey;
	this.vboIndexCacheKey;
	this.vboShadowVertexCacheKey;
	this.vboShadowIndexCacheKey;
	this.indicesCount = 0;

	this.rendered = false; // Test.***

	// SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.***
	// SCRATCH.*** SCRATCH.***
	this.point3dSC = new Point3D();
	this.vertexSC = new Vertex();
};

/**
 * 그래픽 카드에 올릴 데이터를 요청
 *
 * @returns floatArray
 */
CircularCloud.prototype.getVBOVertexColorFloatArray = function() 
{
	var floatArray = this.vertexMatrix.getVBOVertexColorFloatArray(floatArray);
	return floatArray;
};

/**
 * 그래픽 카드에 올릴 데이터를 요청(삼각형)
 *
 * @returns floatArray
 */
CircularCloud.prototype.getVBOIndicesShortArray = function() 
{
	this.vertexMatrix.setVertexIdxInList();
	var shortArray = this.tTrianglesMatrix.getVBOIndicesShortArray();
	this.indicesCount = shortArray.length;

	return shortArray;
};

/**
 * 그래픽 카드에 올릴 데이터를 요청(Vertex)
 *
 * @returns floatArray
 */
CircularCloud.prototype.getVBOShadowVertexFloatArray = function() 
{
	var floatArray = this.shadowVertexMatrix.getVBOVertexFloatArray(floatArray);
	return floatArray;
};

/**
 * 그래픽 카드에 올릴 데이터를 요청(삼삭형 순서)
 *
 * @returns shortArray
 */
CircularCloud.prototype.getVBOShadowIndicesShortArray = function() 
{
	this.shadowVertexMatrix.setVertexIdxInList();
	var shortArray = this.shadowTTrianglesMatrix.getVBOIndicesShortArray();
	this.indicesCount = shortArray.length;

	return shortArray;
};

/**
 * 로케이션을 따라서 회전
 *
 * @param vtxMat
 *            변수
 */
CircularCloud.prototype.rotateMeshByLocation = function(vtxMat) 
{
	// we rotate the cloud mesh by longitude, latitude.***
	var matrix = new Matrix4();

	// 1) Rotation Z. Longitude.***
	matrix.rotationAxisAngDeg(-this.longitude, 0.0, 0.0, 1.0);
	vtxMat.transformPointsByMatrix4(matrix);

	// 2) Rotation X'. Latitude.***
	var longitudeRad = this.longitude * Math.PI / 180.0;

	var cloudEquatorialPos = new Point3D();
	var zAxis = new Point3D();
	var pitchAxis;
	cloudEquatorialPos.set(Math.cos(longitudeRad), Math.sin(longitudeRad), 0.0);
	zAxis.set(0.0, 0.0, 1.0);
	pitchAxis = cloudEquatorialPos.crossProduct(zAxis, pitchAxis);
	pitchAxis.unitary();

	// matrix.rotationAxisAngDeg(90.0-this.latitude, Math.cos(longitudeRad-90),
	// -Math.sin(longitudeRad-90), 0.0);
	matrix.rotationAxisAngDeg(90.0 - this.latitude, pitchAxis.x, pitchAxis.y,
		0.0);
	vtxMat.transformPointsByMatrix4(matrix);
};

/**
 * 햇빛 방향으로 시작
 */
CircularCloud.prototype.doShadowMeshWithSunDirection = function() 
{
	var distance = 3000.0;
	var vertexList = this.shadowVertexMatrix.getVertexList(5); // Bottom radius
	// zero ring.***
	vertexList.translateVertices(this.sunLightDirection.x,
		this.sunLightDirection.y, this.sunLightDirection.z, distance);

	vertexList = this.shadowVertexMatrix.getVertexList(4); // Bottom minor
	// ring.***
	vertexList.translateVertices(this.sunLightDirection.x,
		this.sunLightDirection.y, this.sunLightDirection.z, distance);

	vertexList = this.shadowVertexMatrix.getVertexList(3); // Bottom major
	// ring.***
	vertexList.translateVertices(this.sunLightDirection.x,
		this.sunLightDirection.y, this.sunLightDirection.z, distance);
};

/**
 * 구름 생성
 *
 * @param logitude
 *            경도
 * @param latitude
 *            위도
 * @param radius
 *            반지름
 * @param depth
 *            깊이
 * @param numPointsForCircle
 *            동그라미 하나당 점의 갯수
 */
CircularCloud.prototype.createCloud = function(longitude, latitude, altitude,
	radius, depth, numPointsForCircle) 
{
	this.longitude = longitude;
	this.latitude = latitude;
	this.altitude = altitude;
	this.radius = radius;
	this.depth = depth;
	this.numPointsForCicle = numPointsForCircle;

	this.makeMesh(this.vertexMatrix, this.tTrianglesMatrix,
		this.shadowVertexMatrix, this.shadowTTrianglesMatrix);
	// this.makeMesh(this.shadowVertexMatrix, this.shadowTTrianglesMatrix,
	// true);
	// this.shadowTTrianglesMatrix.invertTrianglesSense();// TEST!!!!!!
	this.doShadowMeshWithSunDirection();

	this.rotateMeshByLocation(this.vertexMatrix);
	this.rotateMeshByLocation(this.shadowVertexMatrix);

	var position = Cesium.Cartesian3.fromDegrees(this.longitude, this.latitude,
		this.altitude);
	this.position = position;

	// var splitValue = Cesium.EncodedCartesian3.encode(position);
	var splitVelueX = Cesium.EncodedCartesian3.encode(position.x);
	var splitVelueY = Cesium.EncodedCartesian3.encode(position.y);
	var splitVelueZ = Cesium.EncodedCartesian3.encode(position.z);

	this.positionHIGH = new Float32Array([ splitVelueX.high, splitVelueY.high,
		splitVelueZ.high ]);
	this.positionLOW = new Float32Array([ splitVelueX.low, splitVelueY.low,
		splitVelueZ.low ]);

	this.bbox = this.shadowVertexMatrix.getBoundingBox(this.bbox);
	var cloudPoint3d = this.bbox.getCenterPoint(cloudPoint3d);
	this.cullingPosition = new Cesium.Cartesian3(cloudPoint3d.x
			+ this.position.x, cloudPoint3d.y + this.position.y, cloudPoint3d.z
			+ this.position.z);
	this.cullingRadius = this.bbox.getMaxLength() / 2;
};

/**
 * mesh 생성
 *
 * @param vtxMat
 *            변수
 * @param tTriMat
 *            변수
 * @param shadowVtxMat
 *            변수
 * @param shadowTTriMat
 *            변수
 */
CircularCloud.prototype.makeMesh = function(vtxMat, tTriMat, shadowVtxMat,
	shadowTTriMat) 
{
	// use vertex_matrix.***
	// our cloud has 6 rings. Top ring and the bottom ring has radius zero.***
	var numPointsForRing = 16;
	var increAngRad = (2.0 * Math.PI) / numPointsForRing;
	var angRad = 0.0;
	var vertex;
	var shadowVertex;
	var semiDepth = this.depth / 2.0;
	var x = 0.0;
	var y = 0.0;
	var randomValue = 0;
	// var cloudWhite = 0.98;

	// 1) Top ring. radius zero.***
	var vertexList = vtxMat.newVertexList();
	var shadowVertexList = shadowVtxMat.newVertexList();
	randomValue = 0.9 + 0.3 * Math.random();
	for (var i = 0; i < numPointsForRing; i++) 
	{
		vertex = vertexList.newVertex();
		vertex.setPosition(x, y, semiDepth);
		shadowVertex = shadowVertexList.newVertex();
		shadowVertex.setPosition(x, y, -semiDepth * 1.2);
		vertex.setColorRGB(randomValue, randomValue, randomValue);
	}

	// 2) Top menor_ring.***
	angRad = 0.0;
	var menorRingRadius = this.radius * 0.7;
	vertexList = vtxMat.newVertexList();
	shadowVertexList = shadowVtxMat.newVertexList();
	for (var i = 0; i < numPointsForRing; i++) 
	{
		// Math.random(); // returns from 0.0 to 1.0.***
		randomValue = (2 + Math.random()) / 2;
		vertex = vertexList.newVertex();
		shadowVertex = shadowVertexList.newVertex();
		x = menorRingRadius * Math.cos(angRad) * randomValue;
		y = menorRingRadius * Math.sin(angRad) * randomValue;
		shadowVertex.setPosition(x, y, -semiDepth * 2);
		vertex.setPosition(x, y, semiDepth * 0.8);
		randomValue = 0.9 + 0.3 * Math.random();
		vertex.setColorRGB(randomValue, randomValue, randomValue);
		angRad += increAngRad;
	}

	// 3) Top major_ring.***
	angRad = 0.0;
	vertexList = vtxMat.newVertexList();
	shadowVertexList = shadowVtxMat.newVertexList();
	for (var i = 0; i < numPointsForRing; i++) 
	{
		randomValue = (2 + Math.random()) / 2;
		vertex = vertexList.newVertex();
		shadowVertex = shadowVertexList.newVertex();
		x = this.radius * Math.cos(angRad) * randomValue;
		y = this.radius * Math.sin(angRad) * randomValue;
		shadowVertex.setPosition(x, y, -semiDepth * 2);
		vertex.setPosition(x, y, semiDepth * 0.4);

		randomValue = 0.9 + 0.3 * Math.random();
		vertex.setColorRGB(randomValue, randomValue, randomValue);
		angRad += increAngRad;
	}

	// 4) Bottom major_ring.***
	angRad = 0.0;
	vertexList = vtxMat.newVertexList();
	shadowVertexList = shadowVtxMat.newVertexList();
	for ( var i = 0; i < numPointsForRing; i++ ) 
	{
		randomValue = (2 + Math.random()) / 2;
		vertex = vertexList.newVertex();
		shadowVertex = shadowVertexList.newVertex();
		x = this.radius * Math.cos(angRad) * randomValue;
		y = this.radius * Math.sin(angRad) * randomValue;
		shadowVertex.setPosition(x, y, -semiDepth * 2);
		vertex.setPosition(x, y, -semiDepth * 0.4);
		randomValue = 0.8 + 0.3 * Math.random();
		vertex.setColorRGB(randomValue, randomValue, randomValue);
		angRad += increAngRad;
	}

	// 5) Bottom menor_ring.***
	angRad = 0.0;
	menorRingRadius = this.radius * 0.7;
	vertexList = vtxMat.newVertexList();
	shadowVertexList = shadowVtxMat.newVertexList();
	for (var i = 0; i < numPointsForRing; i++ ) 
	{
		randomValue = (2 + Math.random()) / 2;
		vertex = vertexList.newVertex();
		shadowVertex = shadowVertexList.newVertex();
		x = menorRingRadius * Math.cos(angRad) * randomValue;
		y = menorRingRadius * Math.sin(angRad) * randomValue;
		vertex.setPosition(x, y, -semiDepth * 0.8);
		shadowVertex.setPosition(x, y, -semiDepth * 1.2);

		randomValue = 0.6 + 0.3 * Math.random();
		vertex.setColorRGB(randomValue, randomValue, randomValue);
		// vertex.setColorRGB(0.58, 0.58, 0.58);
		angRad += increAngRad;
	}

	// 6) Bottom ring. radius zero.***
	vertexList = vtxMat.newVertexList();
	shadowVertexList = shadowVtxMat.newVertexList();
	randomValue = 0.6 + 0.3 * Math.random();
	for ( var i = 0; i < numPointsForRing; i++ ) 
	{
		// randomValue = (2+Math.random())/2;
		vertex = vertexList.newVertex();
		shadowVertex = shadowVertexList.newVertex();
		vertex.setPosition(0.0, 0.0, -semiDepth);
		shadowVertex.setPosition(0.0, 0.0, -semiDepth);

		vertex.setColorRGB(randomValue, randomValue, randomValue);
		// vertex.setColorRGB(0.58, 0.58, 0.58);
	}

	// Now, make the tTrianglesMatrix.***
	vtxMat.makeTTrianglesLateralSidesLOOP(tTriMat);
	shadowVtxMat.makeTTrianglesLateralSidesLOOP(shadowTTriMat);
	// tTriMat.invertTrianglesSense(); // No.***

	// Now, calculate the culling bbox.***
};

'use strict';

/**
 * 영역 박스
 * @class AuxiliarSegment
 */
var AuxiliarSegment = function() 
{
	if (!(this instanceof AuxiliarSegment)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.point1; //auxSegment.point1 = new WorldWind.Vec3();
	this.point2; //auxSegment.point2 = new WorldWind.Vec3();
};

AuxiliarSegment.prototype.setPoints = function(point1X, point1Y, point1Z,   point2X, point2Y, point2Z)
{
	this.point1[0] = point1X;
	this.point1[1] = point1Y;
	this.point1[2] = point1Z;
	
	this.point2[0] = point2X;
	this.point2[1] = point2Y;
	this.point2[2] = point2Z;
};
'use strict';

/**
 * 영역박스
 * 
 * @alias BoundingBox
 * @class BoundingBox
 */
var BoundingBox = function() 
{
	if (!(this instanceof BoundingBox)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.minX = 1000000.0;
	this.minY = 1000000.0;
	this.minZ = 1000000.0;

	this.maxX = -1000000.0;
	this.maxY = -1000000.0;
	this.maxZ = -1000000.0;
};

/**
 * 영역박스 초기화
 * 
 * @param {Point3D} point 3차원 점
 */
BoundingBox.prototype.init = function(point) 
{
	point = point || new Point3D();

	this.minX = point.x;
	this.minY = point.y;
	this.minZ = point.z;

	this.maxX = point.x;
	this.maxY = point.y;
	this.maxZ = point.z;
};

/**
 * 영역박스 삭제
 * 
 */
BoundingBox.prototype.deleteObjects = function() 
{
	this.minX = undefined;
	this.minY = undefined;
	this.minZ = undefined;

	this.maxX = undefined;
	this.maxY = undefined;
	this.maxZ = undefined;
};

/**
 * 영역박스 확대
 * 
 * @param {Number} distance
 */
BoundingBox.prototype.copyFrom = function(bbox) 
{
	this.minX = bbox.minX;
	this.minY = bbox.minY;
	this.minZ = bbox.minZ;

	this.maxX = bbox.maxX;
	this.maxY = bbox.maxY;
	this.maxZ = bbox.maxZ;
};

/**
 * 영역박스 확대
 * 
 * @param {Number} distance
 */
BoundingBox.prototype.expand = function(distance) 
{
	distance = distance || 0.0;
	distance = Math.abs(distance);

	this.minX -= distance;
	this.minY -= distance;
	this.minZ -= distance;

	this.maxX += distance;
	this.maxY += distance;
	this.maxZ += distance;
};

/**
 * 주어진 3차원 점을 포함하는 영역으로 영역박스 크기를 변경
 * 
 * @param {Point3D} point 3차원 점
 */
BoundingBox.prototype.addPoint = function(point) 
{
	if (point !== undefined)	{ return; }

	if (point.x < this.minX) { this.minX = point.x; }
	else if (point.x > this.maxX) { this.maxX = point.x; }

	if (point.y < this.minY) { this.minY = point.y; }
	else if (point.y > this.maxY) { this.maxY = point.y; }

	if (point.z < this.minZ) { this.minZ = point.z; }
	else if (point.z > this.maxZ) { this.maxZ = point.z; }
};

/**
 * 주어진 영역박스를 포함하는 영역으로 영역박스 크기를 변경
 * 
 * @param {BoundingBox} box 영역박스
 */
BoundingBox.prototype.addBox = function(box) 
{
	if (box !== undefined)	{ return; }

	if (box.minX < this.minX) { this.minX = box.minX; }
	if (box.maxX > this.maxX) { this.maxX = box.maxX; }

	if (box.minY < this.minY) { this.minY = box.minY; }
	if (box.maxY > this.maxY) { this.maxY = box.maxY; }

	if (box.minZ < this.minZ) { this.minZ = box.minZ; }
	if (box.maxZ > this.maxZ) { this.maxZ = box.maxZ; }
};

/**
 * 영역박스의 가로, 세로, 높이 중에서 최소값
 * 
 * @returns {Number} 최소값
 */
BoundingBox.prototype.getMinLength = function() 
{
	return Math.min(this.maxX - this.minX, this.maxY - this.minY, this.maxZ - this.minZ);
};

/**
 * 영역박스의 가로, 세로, 높이 중에서 최대값
 * 
 * @returns {Number} 최대값
 */
BoundingBox.prototype.getMaxLength = function() 
{
	return Math.max(this.maxX - this.minX, this.maxY - this.minY, this.maxZ - this.minZ);
};

/**
 * 영역박스의 X축 방향의 길이
 * 
 * @returns {Number} 길이값
 */
BoundingBox.prototype.getXLength = function() 
{
	return this.maxX - this.minX;
};

/**
 * 영역박스의 Y축 방향의 길이
 * 
 * @returns {Number} 길이값
 */
BoundingBox.prototype.getYLength = function() 
{
	return this.maxY - this.minY;
};

/**
 * 영역박스의 Z축 방향의 길이
 * 
 * @returns {Number} 길이값
 */
BoundingBox.prototype.getZLength = function() 
{
	return this.maxZ - this.minZ;
};

/**
 * 영역박스의 중심점을 구한다.
 * 
 * @param {Point3D} result 영역박스의 중심점
 * 
 * @returns {Point3D} 영역박스의 중심점
 */
BoundingBox.prototype.getCenterPoint = function(result) 
{
	if ( result === undefined ) { result = new Point3D(); }

	result.set((this.maxX + this.minX)/2, (this.maxY + this.minY)/2, (this.maxZ + this.minZ)/2);

	return result;
};


/**
 * 영역박스와 점과의 교차 여부를 판단
 * 
 * @param {Point3D} point 3차원 점
 * @returns {Boolean} 교차 여부
 */
BoundingBox.prototype.intersectWithPoint = function(point) 
{
	if (point === undefined)	{ return false; }

	if (point.x < this.minX || point.x > this.maxX || 
		point.y < this.minY || point.y > this.maxY ||
		point.z < this.minZ || point.z > this.maxZ) 
	{
		return false;
	}

	//return this.isPoint3dInside(point.x, point.y, point.z);
	return true;
};

/**
 * 영역박스와 점과의 교차 여부를 판단
 * 
 * @param {Number} x x성분
 * @param {Number} y y성분
 * @param {Number} z z성분
 * @returns {Boolean} 교차 여부
 */
BoundingBox.prototype.isPoint3dInside = function(x, y, z) 
{
	if (x < this.minX || x > this.maxX) 
	{
		return false;
	}
	else if (y < this.minY || y > this.maxY) 
	{
		return false;
	}
	else if (z < this.minZ || z > this.maxZ) 
	{
		return false;
	}

	return true;
};

/**
 * 영역박스와 주어진 영역박스와의 교차 여부를 판단
 * 
 * @param {BoundingBox} box 영역박스
 * @returns {Boolean} 교차 여부
 */
BoundingBox.prototype.intersectWithBox = function(box)
{
	if (box === undefined)	{ return false; }

	if (box.minX > this.maxX || box.maxX < this.minX ||
		box.minY > this.maxY || box.maxY < this.minY ||
		box.minZ > this.maxZ || box.maxZ < this.minZ)
	{
		return false;
	}

	return true;
};

/**
 * 영역박스와 주어진 영역박스와의 교차 여부를 판단
 * 
 * @param {BoundingBox} box 영역박스
 * @returns {Boolean} 교차 여부
 */
BoundingBox.prototype.intersectsWithBBox = function(box) 
{
	var intersection = true;

	if (this.maxX < box.minX)
	{
		intersection = false;
	}
	else if (this.minX > box.maxX)
	{
		intersection = false;
	}
	else if (this.maxY < box.minY)
	{
		intersection = false;
	}
	else if (this.minY > box.maxY)
	{
		intersection = false;
	}
	else if (this.maxZ < box.minZ)
	{
		intersection = false;
	}
	else if (this.minZ > box.maxZ)
	{
		intersection = false;
	}

	return intersection;
};

'use strict';

/**
 * 영역 박스
 * @class BoundingSphere
 */
var BoundingSphere = function() 
{
	if (!(this instanceof BoundingSphere)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.center = new Point3D();
	this.radius = 0.0;
};
'use strict';

/**
 * 영역 박스
 * @class Box
 */
var Box = function() 
{
	if (!(this instanceof Box)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	// vertex indices of the box.***
	//    3----------2        7----------6      
	//    |          |        |          |
	//    |  bottom  |        |   top    |
	//    |          |        |          |
	//    0----------1        4----------5
	
	this.triPolyhedron = new TriPolyhedron();
	this.vbo_vicks_container = new VBOVertexIdxCacheKeysContainer();
	this.vBOVertexIdxCacheKey = this.vbo_vicks_container.newVBOVertexIdxCacheKey();
};

/**
 * axis aligned bounding box
 * @param xLength
 * @param yLength
 * @param zLength
 */
Box.prototype.makeAABB = function(xLength, yLength, zLength)
{
	// this makes a box centered on the center of the box.***
	var minX = -xLength/2.0;
	var minY = -yLength/2.0;
	var minZ = -zLength/2.0;
	
	var maxX = xLength/2.0;
	var maxY = yLength/2.0;
	var maxZ = zLength/2.0;
	
	// make 8 vertices and 6 triSurfaces.***
	var vertexList = this.triPolyhedron.vertexList;
	
	// Bottom.****
	var vertex = vertexList.newVertex(); // 0.***
	vertex.setPosition(minX, minY, minZ);
	
	vertex = vertexList.newVertex(); // 1.***
	vertex.setPosition(maxX, minY, minZ);
	
	vertex = vertexList.newVertex(); // 2.***
	vertex.setPosition(maxX, maxY, minZ);
	
	vertex = vertexList.newVertex(); // 3.***
	vertex.setPosition(minX, maxY, minZ);
	
	// Top.***
	vertex = vertexList.newVertex(); // 4.***
	vertex.setPosition(minX, minY, maxZ);
	
	vertex = vertexList.newVertex(); // 5.***
	vertex.setPosition(maxX, minY, maxZ);
	
	vertex = vertexList.newVertex(); // 6.***
	vertex.setPosition(maxX, maxY, maxZ);
	
	vertex = vertexList.newVertex(); // 7.***
	vertex.setPosition(minX, maxY, maxZ);
	
	
	// now, create triSurfaces and triangles.***
	var triSurface;
	var triangle;
	// Bottom surface.***
	triSurface = this.triPolyhedron.newTriSurface();
	triangle = triSurface.newTriangle();
	triangle.setVertices(vertexList.getVertex(0), vertexList.getVertex(2), vertexList.getVertex(1));
	
	triangle = triSurface.newTriangle();
	triangle.setVertices(vertexList.getVertex(0), vertexList.getVertex(3), vertexList.getVertex(2));
	
	// Top surface.***
	triSurface = this.triPolyhedron.newTriSurface();
	triangle = triSurface.newTriangle();
	triangle.setVertices(vertexList.getVertex(4), vertexList.getVertex(5), vertexList.getVertex(6));
	
	triangle = triSurface.newTriangle();
	triangle.setVertices(vertexList.getVertex(4), vertexList.getVertex(6), vertexList.getVertex(7));
	
	// Front surface.***
	triSurface = this.triPolyhedron.newTriSurface();
	triangle = triSurface.newTriangle();
	triangle.setVertices(vertexList.getVertex(0), vertexList.getVertex(1), vertexList.getVertex(5));
	
	triangle = triSurface.newTriangle();
	triangle.setVertices(vertexList.getVertex(0), vertexList.getVertex(5), vertexList.getVertex(4));
	
	// Right surface.***
	triSurface = this.triPolyhedron.newTriSurface();
	triangle = triSurface.newTriangle();
	triangle.setVertices(vertexList.getVertex(1), vertexList.getVertex(2), vertexList.getVertex(6));
	
	triangle = triSurface.newTriangle();
	triangle.setVertices(vertexList.getVertex(1), vertexList.getVertex(6), vertexList.getVertex(5));
	
	// Rear surface.***
	triSurface = this.triPolyhedron.newTriSurface();
	triangle = triSurface.newTriangle();
	triangle.setVertices(vertexList.getVertex(2), vertexList.getVertex(3), vertexList.getVertex(7));
	
	triangle = triSurface.newTriangle();
	triangle.setVertices(vertexList.getVertex(2), vertexList.getVertex(7), vertexList.getVertex(6));
	
	// Left surface.***
	triSurface = this.triPolyhedron.newTriSurface();
	triangle = triSurface.newTriangle();
	triangle.setVertices(vertexList.getVertex(3), vertexList.getVertex(0), vertexList.getVertex(4));
	
	triangle = triSurface.newTriangle();
	triangle.setVertices(vertexList.getVertex(3), vertexList.getVertex(4), vertexList.getVertex(7));
	
};
'use strict';

/**
 * buildings seed
 * @class BuildingSeed
 */
var BuildingSeed = function() 
{
	if (!(this instanceof BuildingSeed)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.fisrtName;
	this.name = "";
	this.buildingId;
	this.buildingFileName;
	this.geographicCoord; // class : GeographicCoord.
	this.rotationsDegree; // class : Point3D. (heading, pitch, roll).
	this.bBox;
	//this.created = false;
};

/**
 * buildings seed list
 * @class BuildingSeedList
 */
var BuildingSeedList = function() 
{
	if (!(this instanceof BuildingSeedList)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.buildingSeedArray = [];
	this.minGeographicCoord; // longitude, latitude, altitude.
	this.maxGeographicCoord; // longitude, latitude, altitude.
	
	this.dataArrayBuffer;
};

/**
 * 어떤 일을 하고 있습니까?
 */
BuildingSeedList.prototype.newBuildingSeed = function() 
{
	var buildingSeed = new BuildingSeed();
	this.buildingSeedArray.push(buildingSeed);
	return buildingSeed;
};

/**
 * 어떤 일을 하고 있습니까?
 */
BuildingSeedList.prototype.parseBuildingSeedArrayBuffer = function() 
{
	if (this.dataArrayBuffer == undefined)
	{ return false; }
	
	var arrayBuffer = this.dataArrayBuffer;
	var bytesReaded = 0;
	var buildingNameLength;
	var longitude;
	var latitude;
	var altitude;

	var buildingsCount = new Int32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4))[0];
	bytesReaded += 4;
	for (var i =0; i<buildingsCount; i++) 
	{
		var buildingSeed = this.newBuildingSeed();

		if (buildingSeed.geographicCoord === undefined)
		{ buildingSeed.geographicCoord = new GeographicCoord(); }

		if (buildingSeed.bBox === undefined) 
		{ buildingSeed.bBox = new BoundingBox(); }

		buildingNameLength = new Int32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4))[0];
		bytesReaded += 4;
		var buildingName = String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(bytesReaded, bytesReaded+ buildingNameLength)));
		bytesReaded += buildingNameLength;

		// now the geographic coords, but this is provisional coords.
		longitude = new Float64Array(arrayBuffer.slice(bytesReaded, bytesReaded+8))[0]; bytesReaded += 8;
		latitude = new Float64Array(arrayBuffer.slice(bytesReaded, bytesReaded+8))[0]; bytesReaded += 8;
		altitude = new Float32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4))[0]; bytesReaded += 4;

		buildingSeed.bBox.minX = new Float32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4))[0]; bytesReaded += 4;
		buildingSeed.bBox.minY = new Float32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4))[0]; bytesReaded += 4;
		buildingSeed.bBox.minZ = new Float32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4))[0]; bytesReaded += 4;
		buildingSeed.bBox.maxX = new Float32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4))[0]; bytesReaded += 4;
		buildingSeed.bBox.maxY = new Float32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4))[0]; bytesReaded += 4;
		buildingSeed.bBox.maxZ = new Float32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4))[0]; bytesReaded += 4;

		// create a building and set the location.***
		buildingSeed.buildingId = buildingName.substr(4, buildingNameLength-4);
		buildingSeed.buildingFileName = buildingName;
		buildingSeed.geographicCoord.setLonLatAlt(longitude, latitude, altitude);
		
	}
	
	return true;
};




























'use strict';

/**
 * 카메라
 * @class Camera
 */
var Camera = function() 
{
	if (!(this instanceof Camera)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.position = new Point3D();
	this.direction = new Point3D();
	this.up = new Point3D();
	this.frustum = new Frustum();

};

"use strict";

var CODE = {};

//0 = no started to load. 1 = started loading. 2 = finished loading. 3 = parse started. 4 = parse finished.***
CODE.fileLoadState = {
	"READY"            : 0,
	"LOADING_STARTED"  : 1,
	"LOADING_FINISHED" : 2,
	"PARSE_STARTED"    : 3,
	"PARSE_FINISHED"   : 4
};

CODE.moveMode = {
	"ALL"    : "0",
	"OBJECT" : "1",
	"NONE"   : "2"
};

'use strict';



/**
 * 어떤 일을 하고 있습니까?
 * @class Color
 */
var Color = function() 
{
	if (!(this instanceof Color)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	//this[0] = 0.0;
	//this[1] = 0.0;
	//this[2] = 0.0;
	//this[3] = 1.0;

	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 1;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param red 변수
 * @param green 변수
 * @param blue 변수
 * @param alpha 변수
 */
Color.prototype.deleteObjects = function() 
{
	this.r = undefined;
	this.g = undefined;
	this.b = undefined;
	this.a = undefined;
};
  
/**
 * 어떤 일을 하고 있습니까?
 * @param red 변수
 * @param green 변수
 * @param blue 변수
 * @param alpha 변수
 */
Color.prototype.set = function(red, green, blue, alpha) 
{
	//this[0] = red;
	//this[1] = green;
	//this[2] = blue;
	//this[3] = alpha;
	this.r = red; this.g = green; this.b = blue; this.a = alpha;
};
  
/**
 * 어떤 일을 하고 있습니까?
 * @param red 변수
 * @param green 변수
 * @param blue 변수
 */
Color.prototype.setRGB = function(red, green, blue) 
{
	//this[0] = red;
	//this[1] = green;
	//this[2] = blue;
	this.r = red; this.g = green; this.b = blue;
};
  
/**
 * 어떤 일을 하고 있습니까?
 * @param red 변수
 * @param green 변수
 * @param blue 변수
 * @param alpha 변수
 */
Color.prototype.setRGBA = function(red, green, blue, alpha) 
{
	//this[0] = red;
	//this[1] = green;
	//this[2] = blue;
	//this[3] = alpha;
	this.r = red; this.g = green; this.b = blue; this.a = alpha;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class SelectionColor
 */
var SelectionColor = function() 
{
	if (!(this instanceof SelectionColor)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.color = new Color();
};

/**
 * 어떤 일을 하고 있습니까?
 */
SelectionColor.prototype.init = function() 
{
	this.color.r = 0;
	this.color.g = 0;
	this.color.b = 0;
	this.cycle = 0;
};

/**
 * 어떤 일을 하고 있습니까?
 */
SelectionColor.prototype.getAvailableColor = function(resultColor) 
{
	if (resultColor === undefined)
	{ resultColor = new Color(); }
	
	resultColor.setRGB(this.color.r, this.color.g, this.color.b);
	
	this.color.b += 1;
	if (this.color.b >= 254)
	{
		this.color.b = 0;
		this.color.g += 1;
		if (this.color.g >= 254)
		{
			this.color.g = 0;
			this.color.r += 1;
			if (this.color.r >= 254)
			{
				this.color.r = 0;
				this.cycle += 1;
			}
		}
	}
	
	return resultColor;
};







'use strict';

/**
 * 상수 설정
 * @class Constant
 */
var Constant = {};

Constant.CESIUM = "cesium";
Constant.WORLDWIND = "worldwind";
Constant.OBJECT_INDEX_FILE = "/objectIndexFile.ihe";
Constant.SIMPLE_BUILDING_TEXTURE3x3_BMP = "/SimpleBuildingTexture3x3.bmp";
Constant.RESULT_XDO2F4D = "/Result_xdo2f4d/Images/";
Constant.RESULT_XDO2F4D_TERRAINTILES = "/Result_xdo2f4d/F4D_TerrainTiles/";
Constant.RESULT_XDO2F4D_TERRAINTILEFILE_TXT = "/Result_xdo2f4d/f4dTerranTileFile.txt";

Constant.INTERSECTION_OUTSIDE = 0;
Constant.INTERSECTION_INTERSECT= 1;
Constant.INTERSECTION_INSIDE = 2;

'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class FBO
 * @param gl 변수
 * @param width 변수
 * @param height 변수
 */
var FBO = function(gl, width, height) 
{
	if (!(this instanceof FBO)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.gl = gl;
	this.width = width;
	this.height = height;
	this.fbo = gl.createFramebuffer();
	this.depthBuffer = gl.createRenderbuffer();
	this.colorBuffer = gl.createTexture();
  
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.colorBuffer);  
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //LINEAR_MIPMAP_LINEAR
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	//gl.generateMipmap(gl.TEXTURE_2D)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); // original.***
	//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_INT, null); // test.***
  
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
	gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorBuffer, 0);
	if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) 
	{
		throw "Incomplete frame buffer object.";
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};    

/**
 * 어떤 일을 하고 있습니까?
 */
FBO.prototype.bind = function() 
{
	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
};

/**
 * 어떤 일을 하고 있습니까?
 */
FBO.prototype.unbind = function() 
{
	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
};

/*
function FullScreenQuad(gl) {
  this.plane = SimpleMesh.buildPlaneXY(gl, 1, 1);
}     

FullScreenQuad.prototype.draw = function(shader, gl) {    
  var projectionMatrix = new PreGL.Mat4();
	projectionMatrix.ortho(-0.5,0.5,-0.5,0.5,-1,10);
	var modelViewMatrix = new PreGL.Mat4();
  //shader.set("projectionMatrix", projectionMatrix); // Original.***
	//shader.set("modelViewMatrix", modelViewMatrix); // Original.***
	gl.uniformMatrix4fv(shader.projectionMatrix4_loc, false, projectionMatrix.toFloat32Array());
	gl.uniformMatrix4fv(shader.modelViewMatrix4_loc, false, modelViewMatrix.toFloat32Array());
	
  this.plane.draw(shader);
}

function SimpleMesh(gl) {   
  this.gl = gl;
	this.attribs = [];
}

SimpleMesh.prototype.addAttrib = function(name, data, size) {
  size = size || 3  
	var attrib = {};
	attrib.name = name;
	attrib.data = data;
	attrib.buffer = this.gl.createBuffer();  
	attrib.size = size;
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attrib.buffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
	this.attribs.push(attrib);
}

SimpleMesh.prototype.updateAttrib = function(name, data) {
  var attrib = null;
  for(var i=0; i<this.attribs.length; i++) {
    if (this.attribs[i].name == name) {
      attrib = this.attribs[i];
      break;
    }
  }
  if (!attrib) {
    return;
  }
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attrib.buffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 0);
}

SimpleMesh.prototype.setIndices = function(data) {  
  this.indices = {};
  this.indices.data = data;
  this.indices.buffer =this. gl.createBuffer();
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer);
  this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, 
    new Uint16Array(data), this.gl.STATIC_DRAW
  ); 
  //this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, 0);
}

SimpleMesh.prototype.draw = function(program, primitive) {
  primitive = primitive || this.gl.TRIANGLES;  
  program = program.program ? program.program : program;
  
  for(var i in this.attribs) {         
    var attrib = this.attribs[i];
    if (attrib.location === undefined) {
      attrib.location = this.gl.getAttribLocation(program, attrib.name);      
    }
    if (attrib.location >= 0) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attrib.buffer);
      this.gl.vertexAttribPointer(attrib.location, attrib.size, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(attrib.location);
    }                      
  }  
  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer);
  this.gl.drawElements(primitive, this.indices.data.length, this.gl.UNSIGNED_SHORT, 0);   
                       
  //for(var i in this.attribs) {         
  //  var attrib = this.attribs[i];
  //  this.gl.disableVertexAttribArray(attrib.location);   
  //}
  // bind with 0, so, switch back to normal pointer operation
  //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 0);
  //glBindBufferARB(GL_ELEMENT_ARRAY_BUFFER_ARB, 0);
}

SimpleMesh.prototype.destroy = function() {
  this.gl.deleteBuffer(this.indices.buffer);
  for(var i in this.attribs) {
    this.gl.deleteBuffer(this.attribs[i].buffer);
  }
}        
 
SimpleMesh.buildPlaneXY = function(gl, sx, sy, nx, ny) {
  sx = sx || 1;
  sy = sy || 1;
  nx = nx || 10;
  ny = ny || 10;
  
  var vertices = [];
  var normals = [];
  var texCoords = [];
  var indices = [];
  
  for(var y=0; y < ny; y++ ) {
    for(var x=0; x < nx; x++ ) {
      vertices.push(x/(nx-1) * sx - sx/2, y/(ny-1) * sy - sy/2, 0);
      normals.push(0, 0, 1);
      texCoords.push(x/(nx-1), y/(ny-1));
      if (x < nx-1 && y < ny-1) {
        indices.push(y*nx + x, (y+1)*nx + x + 1, y*nx + x + 1);
        indices.push(y*nx + x, (y+1)*nx + x, (y+1)*nx + x + 1);
      }
    }    
  }
  
  var plane = new SimpleMesh(gl);
  plane.addAttrib("position", vertices);        
  plane.addAttrib("normal", normals);          
  plane.addAttrib("texCoord", texCoords, 2);    
  plane.setIndices(indices);
  plane.type = "PlaneXY";
  return plane;
}

SimpleMesh.buildPlaneXZ = function(gl, sx, sz, nx, nz) {
  sx = sx || 1;
  sz = sz || 1;
  nx = nx || 10;
  nz = nz || 10;
  
  var vertices = [];
  var texCoords = [];
  var indices = [];
  
  for(var z=0; z < nz; z++ ) {
    for(var x=0; x < nx; x++ ) {
      vertices.push(x/nx * sx - sx/2, 0, z/nz * sz - sz/2);
      texCoords.push(x/nx, z/nz);
      if (x < nx-1 && z < nz-1) {
        indices.push(z*nx + x, (z+1)*nx + x + 1, z*nx + x + 1);
        indices.push(z*nx + x, (z+1)*nx + x, (z+1)*nx + x + 1);
      }
    }    
  }
  
  var plane = new SimpleMesh(gl);
  plane.addAttrib("position", vertices);
  plane.addAttrib("texCoord", texCoords, 2);    
  plane.setIndices(indices); 
  plane.type = "PlaneXZ";
  return plane;
}

SimpleMesh.buildSphere = function(gl, r, nsides, nsegments) {  
  r = r || 1;
  nsides = nsides || 30;
  nsegments = nsegments || 30;
	function degToRad(d) {
		return d/180 * Math.PI;
	}
	var mesh = {
		vertices : [],
		normals : [],
		texCoords : [],
		indices: []
	};
	
 	var dtheta = 180.0/nsegments;
 	var dphi   = 360.0/nsides;
	
	var estimatedNumPoints = (Math.floor(360/dtheta) + 1) * (Math.floor(180/dphi) + 1);
	
	//vertexStream.setNumVertices(estimatedNumPoints);
	//vertexStream.setNumIndices(estimatedNumPoints * 6);
	function evalPos(theta, phi) {
	  var R = r;
		var pos = new PreGL.Vec3();
		pos.x = R * Math.sin(degToRad(theta)) * Math.sin(degToRad(phi));
		pos.y = R * Math.cos(degToRad(theta));
		pos.z = R * Math.sin(degToRad(theta)) * Math.cos(degToRad(phi));
		return pos;
	}
	for (var theta=0, segment=0; theta<=180; theta+=dtheta, ++segment) {
		for (var phi=0, side=0; phi<=360; phi+=dphi, ++side) { 
		  var pos = evalPos(theta, phi);           
		  //var pos2 = evalPos(theta+0.01, phi);           
		  //var pos3 = evalPos(theta, phi+0.01); 
		  //var n = pos2.sub(pos).cross(pos3.sub(pos));
		  //n = n.normalize();    
		  var n = pos.normalized();
		  
			mesh.vertices.push(pos.x, pos.y, pos.z); 			
			mesh.normals.push(n.x, n.y, n.z);
			mesh.texCoords.push(phi/360.0, theta/180.0);

			//no faces on the last segment
			if (segment == nsegments) continue;
			if (side == nsides) continue;

			mesh.indices.push((segment  )*(nsides+1) + side); 			
			mesh.indices.push((segment+1)*(nsides+1) + side);	
			mesh.indices.push((segment+1)*(nsides+1) + side + 1);
			
			mesh.indices.push((segment  )*(nsides+1) + side); 			
			mesh.indices.push((segment+1)*(nsides+1) + side + 1);
			mesh.indices.push((segment  )*(nsides+1) + side + 1);
			
					
			/*
			mesh.indices.push((segment  )*(nsides+1) + side); 
			mesh.indices.push((segment+1)*(nsides+1) + side);			
			mesh.indices.push((segment+1)*(nsides+1) + side + 1);
			mesh.indices.push((segment  )*(nsides+1) + side); 
			mesh.indices.push((segment+1)*(nsides+1) + side + 1);
			mesh.indices.push((segment  )*(nsides+1) + side + 1);
			*/
			
/*
		}
	}
	
	var sphere = new SimpleMesh(gl);
  sphere.addAttrib("position", mesh.vertices);
  sphere.addAttrib("normal", mesh.normals);  
  sphere.addAttrib("texCoord", mesh.texCoords, 2); 
  sphere.type = "Sphere";   
  sphere.setIndices(mesh.indices); 
  
  return sphere;
  
}
*/
'use strict';

/**
 * xmlhttprequest 요청 개수를 저장하기 위한 객체
 * @class FileRequestControler
 */
var FileRequestControler = function() 
{
	if (!(this instanceof FileRequestControler)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.maxFilesRequestedCount = 6;
	this.filesRequestedCount = 0;
};

FileRequestControler.prototype.isFull = function ()
{
	return this.filesRequestedCount >= this.maxFilesRequestedCount; 
};

FileRequestControler.prototype.isFullPlus = function (extraCount)
{
	return this.filesRequestedCount >= (this.maxFilesRequestedCount + extraCount); 
};

'use strict';

/**
 * 카메라
 * @class Frustum
 */
var Frustum = function() 
{
	if (!(this instanceof Frustum)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.near = new Float32Array([0.1]);
	this.far = new Float32Array([1000.0]);
	this.fovyRad = new Float32Array([0.8037]);
	this.fovRad = new Float32Array([1.047]);
	this.aspectRatio = new Float32Array([1.3584]);
	this.planesArray = [];
	this.dirty = true;
	
	for (var i=0; i<6; i++)
	{
		var plane = new Plane();
		this.planesArray.push(plane);
	}
};

/**
 * 포인트값 삭제
 * 어떤 일을 하고 있습니까?
 */
Frustum.prototype.intersectionSphere = function(sphere) 
{
	var intersects = false;
	for (var i=0; i<6; i++)
	{
		var intersectionType = this.planesArray[i].intersectionSphere(sphere);
		if (intersectionType === Constant.INTERSECTION_OUTSIDE)
		{ return Constant.INTERSECTION_OUTSIDE; }
		else if (intersectionType === Constant.INTERSECTION_INTERSECT)
		{ intersects = true; }
	}
	
	if (intersects)
	{ return Constant.INTERSECTION_INTERSECT; }
	else
	{ return Constant.INTERSECTION_INSIDE; }
};

/**
 * 포인트값 삭제
 * 어떤 일을 하고 있습니까?
 */
Frustum.prototype.calculateFrustumPlanes = function(sphere) 
{
	// 1rst, calculate the center points of near and far.
	// todo:
};





























'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class GeographicCoord
 */
var GeographicCoord = function() 
{
	if (!(this instanceof GeographicCoord)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.longitude;
	this.latitude;
	this.altitude;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param longitude 경도
 * @param latitude 위도
 * @param altitude 고도
 */
GeographicCoord.prototype.deleteObjects = function() 
{
	this.longitude = undefined;
	this.latitude = undefined;
	this.altitude = undefined;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param longitude 경도
 * @param latitude 위도
 * @param altitude 고도
 */
GeographicCoord.prototype.copyFrom = function(geographicCoord) 
{
	this.longitude = geographicCoord.longitude;
	this.latitude = geographicCoord.latitude;
	this.altitude = geographicCoord.altitude;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param longitude 경도
 * @param latitude 위도
 * @param altitude 고도
 */
GeographicCoord.prototype.setLonLatAlt = function(longitude, latitude, altitude) 
{
	this.longitude = longitude;
	this.latitude = latitude;
	this.altitude = altitude;
};
'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class GeoLocationData
 * @param geoLocationDataName 변수
 */
var GeoLocationData = function(geoLocationDataName) 
{
	if (!(this instanceof GeoLocationData)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.name;
	
	if (geoLocationDataName === undefined) { this.name = "noName"; }
	else { this.name = geoLocationDataName; }
	
	this.geographicCoord; // longitude, latitude, altitude.***
	
	this.heading;
	this.pitch;
	this.roll;
	
	this.date; // year - month - day - hour - min - seg - miliseg.***
	
	this.position;
	this.positionHIGH;
	this.positionLOW;

	this.pivotPoint; // Point3D().***
	
	// F4D Matrix4.****
	this.geoLocMatrix; // this is just the cartographic transformation matrix determined by (lon, lat, elev).***
	this.geoLocMatrixInv; // this is just the cartographic transformation matrixInv determined by (lon, lat, elev).***
	this.tMatrix;      // this contains translation & rotations.***
	this.tMatrixInv;   // this contains translation & rotations.***
	this.rotMatrix;    // this contains only rotation.***
	this.rotMatrixInv; // this contains only rotation.***
	
	// Aditional.***
	this.aditionalTraslation; // no used yet.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @class GeoLocationData
 * @param geoLocData 변수
 */
GeoLocationData.prototype.copyFrom = function(geoLocData) 
{
	if (geoLocData === undefined)
	{ return; }
	
	this.name = geoLocData.name;
	if (geoLocData.geographicCoord)
	{
		if (this.geographicCoord === undefined)
		{ this.geographicCoord = new GeographicCoord(); }
		
		this.geographicCoord.copyFrom(geoLocData.geographicCoord); // longitude, latitude, altitude.***
	}
	
	this.heading = geoLocData.heading;
	this.pitch = geoLocData.pitch;
	this.roll = geoLocData.roll;
	
	this.date = geoLocData.date; // year - month - day - hour - min - seg - miliseg.***
	
	if (geoLocData.position)
	{
		if (this.position === undefined)
		{ this.position = new Point3D(); }
		this.position.copyFrom(geoLocData.position);
	}
	if (geoLocData.positionHIGH)
	{
		if (this.positionHIGH === undefined)
		{ this.positionHIGH = new Float32Array(3); }
		
		this.positionHIGH[0]= geoLocData.positionHIGH[0];
		this.positionHIGH[1]= geoLocData.positionHIGH[1];
		this.positionHIGH[2]= geoLocData.positionHIGH[2];
	}
	if (geoLocData.positionLOW)
	{
		if (this.positionLOW === undefined)
		{ this.positionLOW = new Float32Array(3); }
		
		this.positionLOW[0]= geoLocData.positionLOW[0];
		this.positionLOW[1]= geoLocData.positionLOW[1];
		this.positionLOW[2]= geoLocData.positionLOW[2];
	}
	if (geoLocData.pivotPoint)
	{
		if (this.pivotPoint === undefined)
		{ this.pivotPoint = new Point3D(); }
		
		this.pivotPoint.copyFrom(geoLocData.pivotPoint);
	}
	
	// F4D Matrix4.****
	if (geoLocData.geoLocMatrix)
	{
		if (this.geoLocMatrix === undefined)
		{ this.geoLocMatrix = new Matrix4(); }
		
		this.geoLocMatrix.copyFromMatrix4(geoLocData.geoLocMatrix);
	}
	if (geoLocData.geoLocMatrixInv)
	{
		if (this.geoLocMatrixInv === undefined)
		{ this.geoLocMatrixInv = new Matrix4(); }
		
		this.geoLocMatrixInv.copyFromMatrix4(geoLocData.geoLocMatrixInv);
	}
	if (geoLocData.tMatrix)
	{
		if (this.tMatrix === undefined)
		{ this.tMatrix = new Matrix4(); }
		
		this.tMatrix.copyFromMatrix4(geoLocData.tMatrix);
	}
	if (geoLocData.tMatrixInv)
	{
		if (this.tMatrixInv === undefined)
		{ this.tMatrixInv = new Matrix4(); }
		
		this.tMatrixInv.copyFromMatrix4(geoLocData.tMatrixInv);
	}
	if (geoLocData.rotMatrix)
	{
		if (this.rotMatrix === undefined)
		{ this.rotMatrix = new Matrix4(); }
		
		this.rotMatrix.copyFromMatrix4(geoLocData.rotMatrix);
	}
	if (geoLocData.rotMatrixInv)
	{
		if (this.rotMatrixInv === undefined)
		{ this.rotMatrixInv = new Matrix4(); }
		
		this.rotMatrixInv.copyFromMatrix4(geoLocData.rotMatrixInv);
	}
	
	if (geoLocData.aditionalTraslation)
	{
		if (this.aditionalTraslation === undefined)
		{ this.aditionalTraslation = new Point3D(); }
		
		this.aditionalTraslation.copyFrom(geoLocData.aditionalTraslation);
	}
	
};

/**
 * 어떤 일을 하고 있습니까?
 * @class GeoLocationData
 * @param absoluteCamera 변수
 * @param resultCamera 변수
 * @returns resultCamera
 */
GeoLocationData.prototype.getTransformedRelativeCamera = function(absoluteCamera, resultCamera) 
{
	var pointAux = new Point3D();
	
	pointAux.set(absoluteCamera.position.x - this.position.x, 
		absoluteCamera.position.y - this.position.y, 
		absoluteCamera.position.z - this.position.z);
	
	//pointAux.set(absoluteCamera.position.x - this.position.x - this.aditionalTraslation.x, 
	//		absoluteCamera.position.y - this.position.y - this.aditionalTraslation.y, 
	//		absoluteCamera.position.z - this.position.z - this.aditionalTraslation.z);
	
	resultCamera.position = this.rotMatrixInv.transformPoint3D(pointAux, resultCamera.position);
	
	pointAux.set(absoluteCamera.direction.x, absoluteCamera.direction.y, absoluteCamera.direction.z);
	resultCamera.direction = this.rotMatrixInv.transformPoint3D(pointAux, resultCamera.direction);
	
	pointAux.set(absoluteCamera.up.x, absoluteCamera.up.y, absoluteCamera.up.z);
	resultCamera.up = this.rotMatrixInv.transformPoint3D(pointAux, resultCamera.up);
  
	pointAux.x = undefined;
	pointAux.y = undefined;
	pointAux.z = undefined;
	pointAux = undefined;
	
	return resultCamera;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class GeoLocationDataManager
 */
var GeoLocationDataManager = function() 
{
	if (!(this instanceof GeoLocationDataManager)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.geoLocationDataArray = [];
	this.geoLocationDataCache = {}; // use this.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @class GeoLocationData
 * @param geoLocationName 변수
 * @returns geoLocationData
 */
GeoLocationDataManager.prototype.newGeoLocationData = function(geoLocationName) 
{
	if (geoLocationName === undefined)
	{ geoLocationName = "noName" + this.geoLocationDataArray.length.toString(); }
	var geoLocationData = new GeoLocationData(geoLocationName);
	this.geoLocationDataArray.push(geoLocationData);
	this.geoLocationDataCache[geoLocationName] = geoLocationData;
	return geoLocationData;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class GeoLocationData
 * @param idx
 * @returns this.geoLoactionDataArray[idx]
 */
GeoLocationDataManager.prototype.getGeoLocationData = function(idx) 
{
	return this.geoLocationDataArray[idx];
};






























'use strict';


// F4D ReferenceObject.************************************************************************************************************************* //

/**
 * 어떤 일을 하고 있습니까?
 * @class NeoSimpleBuilding
 */
var NeoSimpleBuilding = function() 
{
	if (!(this instanceof NeoSimpleBuilding)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.accesorsArray = [];
	this.vbo_vicks_container = new VBOVertexIdxCacheKeysContainer();
	this.texturesArray = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns accesor
 */
NeoSimpleBuilding.prototype.newAccesor = function() 
{
	var accesor = new Accessor();
	this.accesorsArray.push(accesor);
	return accesor;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns texture
 */
NeoSimpleBuilding.prototype.newTexture = function() 
{
	var texture = new NeoTexture();
	this.texturesArray.push(texture);
	return texture;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class LodBuilding
 */
var LodBuilding = function() 
{
	if (!(this instanceof LodBuilding)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	// this class is for use for LOD2 and LOD3 buildings.***
	// provisionally use this class, but in the future use "NeoSimpleBuilding".***
	this.dataArraybuffer; // binary data.***
	this.vbo_vicks_container = new VBOVertexIdxCacheKeysContainer();
	this.fileLoadState = CODE.fileLoadState.READY;
};

LodBuilding.prototype.parseArrayBuffer = function(gl, readWriter) 
{
	if (this.fileLoadState === CODE.fileLoadState.LOADING_FINISHED)// file loaded.***
	{
		this.fileLoadState = CODE.fileLoadState.PARSE_STARTED;
		var bytesReaded = 0;

		// 1rst, read bbox.***
		var bbox = new BoundingBox();
		bbox.minX = new Float32Array(this.dataArraybuffer.slice(bytesReaded, bytesReaded+4)); bytesReaded += 4;
		bbox.minY = new Float32Array(this.dataArraybuffer.slice(bytesReaded, bytesReaded+4)); bytesReaded += 4;
		bbox.minZ = new Float32Array(this.dataArraybuffer.slice(bytesReaded, bytesReaded+4)); bytesReaded += 4;

		bbox.maxX = new Float32Array(this.dataArraybuffer.slice(bytesReaded, bytesReaded+4)); bytesReaded += 4;
		bbox.maxY = new Float32Array(this.dataArraybuffer.slice(bytesReaded, bytesReaded+4)); bytesReaded += 4;
		bbox.maxZ = new Float32Array(this.dataArraybuffer.slice(bytesReaded, bytesReaded+4)); bytesReaded += 4;

		var vboViCacheKey = this.vbo_vicks_container.newVBOVertexIdxCacheKey();

		// 1) Positions.************************************************************************************************
		var vertexCount = readWriter.readUInt32(this.dataArraybuffer, bytesReaded, bytesReaded + 4); bytesReaded += 4;
		var verticesFloatValuesCount = vertexCount * 3;
		var startBuff = bytesReaded;
		var endBuff = bytesReaded + 4 * verticesFloatValuesCount;
		vboViCacheKey.posVboDataArray = new Float32Array(this.dataArraybuffer.slice(startBuff, endBuff));
		bytesReaded = bytesReaded + 4 * verticesFloatValuesCount; // updating data.***

		vboViCacheKey.vertexCount = vertexCount;

		// 2) Normals.*****************************************************************************************************
		var hasNormals = readWriter.readUInt8(this.dataArraybuffer, bytesReaded, bytesReaded + 1); bytesReaded += 1;
		if (hasNormals) 
		{
			vertexCount = readWriter.readUInt32(this.dataArraybuffer, bytesReaded, bytesReaded + 4); bytesReaded += 4;
			var normalsByteValuesCount = vertexCount * 3;
			var startBuff = bytesReaded;
			var endBuff = bytesReaded + 1 * normalsByteValuesCount;
			vboViCacheKey.norVboDataArray = new Int8Array(this.dataArraybuffer.slice(startBuff, endBuff));
			bytesReaded = bytesReaded + 1 * normalsByteValuesCount; // updating data.***
		}

		// 3) Colors.*******************************************************************************************************
		var hasColors = readWriter.readUInt8(this.dataArraybuffer, bytesReaded, bytesReaded+1); bytesReaded += 1;
		if (hasColors) 
		{
			vertexCount = readWriter.readUInt32(this.dataArraybuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
			var colorsByteValuesCount = vertexCount * 4;
			var startBuff = bytesReaded;
			var endBuff = bytesReaded + 1 * colorsByteValuesCount;
			vboViCacheKey.colVboDataArray = new Uint8Array(this.dataArraybuffer.slice(startBuff, endBuff));
			bytesReaded = bytesReaded + 1 * colorsByteValuesCount; // updating data.***
		}

		// 4) TexCoord.****************************************************************************************************
		var hasTexCoord = readWriter.readUInt8(this.dataArraybuffer, bytesReaded, bytesReaded+1); bytesReaded += 1;
		if (hasTexCoord) 
		{
			;// TODO:
		}

		this.fileLoadState = CODE.fileLoadState.PARSE_FINISHED;
	}	
};

/**
 * 어떤 일을 하고 있습니까?
 * @class NeoBuilding
 */
var NeoBuilding = function() 
{
	if (!(this instanceof NeoBuilding)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.metaData;
	this.buildingId;
	this.buildingType; // use this for classify a building.***
	this.buildingFileName = "";
	this.bbox;
	this.bboxAbsoluteCenterPos;
	this.frustumCulled = false;

	// a building can have 1 or more geoLocations (and rotations), throght the time for example.***
	this.geoLocDataManager = new GeoLocationDataManager();
	this.geoLocationDataAux; // old. created for HeavyIndustries.***
	this.isDemoBlock = false; // test.***
	//this.isHighLighted;

	// create the references lists.*********************************
	//this._neoRefLists_Container = new NeoReferencesListsContainer(); // Exterior and bone objects.***
	this.currentRenderablesNeoRefLists = []; // test. no used. waiting for background process.***
	this.preExtractedLowestOctreesArray = []; // test. no used. waiting for background process.***
	
	// References and Models.*********************************************
	this.motherNeoReferencesArray = []; // asimetric mode.***
	this.motherBlocksArray = []; // asimetric mode.***
	
	// Current visible objects.*******************************************
	this.currentVisibleOctreesControler; //  = new VisibleObjectsControler();
	
	// Aditional Color.***************************************************
	this.aditionalColor; // use for colorChanged.***

	// Textures loaded.***************************************************
	this.texturesLoaded = []; // material textures.***
	this.texturesLoadedCache = {};

	// The octree.********************************************************
	this.octree; // f4d_octree. ***
	this.octreeLoadedAllFiles = false;

	this.allFilesLoaded = false; // no used yet...
	this.isReadyToRender = false; // no used yet...

	this.moveVector; 
	this.squaredDistToCam;

	// The simple building.***********************************************
	this.simpleBuilding3x3Texture;
	//this.neoSimpleBuilding; // no used. this is a simpleBuilding for Buildings with texture.***

	// The lodBuildings.***
	//this.lod2Building;
	//this.lod3Building;

	// SCRATCH.*********************************
	this.point3dScratch = new Point3D();
	this.point3dScratch2 = new Point3D();
};

/**
 * 어떤 일을 하고 있습니까?
 * @param texture 변수
 * @returns texId
 */
NeoBuilding.prototype.getTextureId = function(texture) 
{
	var texId;
	var texturesLoadedCount = this.texturesLoaded.length;
	var find = false;
	var i=0;
	while (!find && i < texturesLoadedCount ) 
	{
		if (this.texturesLoaded[i].textureImageFileName === texture.textureImageFileName) 
		{
			find = true;
			texId = this.texturesLoaded[i].texId;
		}
		i++;
	}

	return texId;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param texture 변수
 * @returns texId
 */
NeoBuilding.prototype.getSameTexture = function(texture) 
{
	var sameTexture;
	var texturesLoadedCount = this.texturesLoaded.length;
	var find = false;
	var i=0;
	while (!find && i < texturesLoadedCount ) 
	{
		if (this.texturesLoaded[i].textureImageFileName === texture.textureImageFileName) 
		{
			find = true;
			sameTexture = this.texturesLoaded[i];
		}
		i++;
	}

	return sameTexture;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param eyeX 변수
 * @param eyeY 변수
 * @param eyeZ 변수
 */
NeoBuilding.prototype.updateCurrentVisibleIndicesExterior = function(eyeX, eyeY, eyeZ) 
{
	this._neoRefLists_Container.updateCurrentVisibleIndicesOfLists(eyeX, eyeY, eyeZ);
};

/**
 * 어떤 일을 하고 있습니까?
 */
NeoBuilding.prototype.updateCurrentAllIndicesExterior = function() 
{
	this._neoRefLists_Container.updateCurrentAllIndicesOfLists();
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns metaData.bbox.isPoint3dInside(eyeX, eyeY, eyeZ);
 */
NeoBuilding.prototype.isCameraInsideOfBuilding = function(eyeX, eyeY, eyeZ) 
{
	return this.metaData.bbox.isPoint3dInside(eyeX, eyeY, eyeZ);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param absoluteEyeX 변수
 * @param absoluteEyeY 변수
 * @param absoluteEyeZ 변수
 * @returns point3dScrath2
 */
NeoBuilding.prototype.getTransformedRelativeEyePositionToBuilding = function(absoluteEyeX, absoluteEyeY, absoluteEyeZ) 
{
	// 1rst, calculate the relative eye position.***
	var buildingPosition = this.buildingPosition;
	var relativeEyePosX = absoluteEyeX - buildingPosition.x;
	var relativeEyePosY = absoluteEyeY - buildingPosition.y;
	var relativeEyePosZ = absoluteEyeZ - buildingPosition.z;

	if (this.buildingPosMatInv === undefined) 
	{
		this.buildingPosMatInv = new Matrix4();
		this.buildingPosMatInv.setByFloat32Array(this.moveMatrixInv);
	}

	this.point3dScratch.set(relativeEyePosX, relativeEyePosY, relativeEyePosZ);
	this.point3dScratch2 = this.buildingPosMatInv.transformPoint3D(this.point3dScratch, this.point3dScratch2);

	return this.point3dScratch2;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param neoReference 변수
 */
NeoBuilding.prototype.manageNeoReferenceTexture = function(neoReference, magoManager) 
{
	//neoReference.texture.fileLoadState != CODE.fileLoadState.LOADING_FINISHED
	
	if (neoReference.texture.texId === undefined && neoReference.texture.textureImageFileName !== "") 
	{
		// 1rst, check if the texture is loaded.
		var sameTexture = this.getSameTexture(neoReference.texture);
		if (sameTexture === undefined)
		{
			if (magoManager.backGround_fileReadings_count > 10) 
			{ return; }
		
			if (neoReference.texture.fileLoadState === CODE.fileLoadState.READY) 
			{
				var gl = magoManager.sceneState.gl;
				neoReference.texture.texId = gl.createTexture();
				// Load the texture.***
				var geometryDataPath = magoManager.readerWriter.geometryDataPath;
				var filePath_inServer = geometryDataPath + "/" + this.buildingFileName + "/Images_Resized/" + neoReference.texture.textureImageFileName;

				this.texturesLoaded.push(neoReference.texture);
				magoManager.readerWriter.readNeoReferenceTexture(gl, filePath_inServer, neoReference.texture, this, magoManager);
				magoManager.backGround_fileReadings_count ++;
			}
		}
		else 
		{
			if (sameTexture.fileLoadState === CODE.fileLoadState.LOADING_FINISHED)
			{
				neoReference.texture = sameTexture;
			}
		}
	}
	
	return neoReference.texture.fileLoadState;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class NeoBuildingsList
 */
var NeoBuildingsList = function() 
{
	if (!(this instanceof NeoBuildingsList)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	//Array.apply(this, arguments);

	this.neoBuildingsArray = [];
};
//NeoBuildingsList.prototype = Object.create(Array.prototype);

/**
 * 어떤 일을 하고 있습니까?
 * @returns neoBuilding
 */
NeoBuildingsList.prototype.newNeoBuilding = function() 
{
	var neoBuilding = new NeoBuilding();
	this.neoBuildingsArray.push(neoBuilding);
	return neoBuilding;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns neoBuilding
 */
NeoBuildingsList.prototype.getNeoBuildingByTypeId = function(buildingType, buildingId) 
{
	var resultBuilding;
	var buildingsCount = this.neoBuildingsArray.length;
	var found = false;
	var i=0;
	while (!found && i < buildingsCount)
	{
		if (this.neoBuildingsArray[i].buildingType === buildingType && this.neoBuildingsArray[i].buildingId === buildingId)
		{
			found = true;
			resultBuilding = this.neoBuildingsArray[i];
		}
		i++;
	}

	return resultBuilding;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns neoBuilding
 */
NeoBuildingsList.prototype.setNeoBuildingsFrustumCulled = function(bFrustumCulled) 
{
	var buildingsCount = this.neoBuildingsArray.length;

	for (var i = 0; i < buildingsCount; i++)
	{
		this.neoBuildingsArray[i].frustumCulled = bFrustumCulled;
	}

};

NeoBuildingsList.prototype.get = function (index)
{
	return this.neoBuildingsArray[index];
};

NeoBuildingsList.prototype.add = function (item)
{
	if (item !== undefined)	{ this.neoBuildingsArray.push(item); }
};
'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class GeometryModifier
 */
var GeometryModifier = function() 
{
	if (!(this instanceof GeometryModifier)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param f4dPoint3d 변수
 * @param px 변수
 * @param py 변수
 * @param pz 변수
 */
GeometryModifier.prototype.setPoint3d = function(f4dPoint3d, px, py, pz) 
{
	f4dPoint3d.x = px;
	f4dPoint3d.y = py;
	f4dPoint3d.z = pz;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 * @param f4dPoint3d 변수
 * @param px 변수
 * @param py 변수
 * @param pz 변수
 * @retuns dx*dx + dy*dy + dz*dz
 */
GeometryModifier.prototype.point3dSquareDistTo = function(f4dPoint3d, px, py, pz) 
{
	var dx = f4dPoint3d.x - px;
	var dy = f4dPoint3d.y - py;
	var dz = f4dPoint3d.z - pz;

	return dx*dx + dy*dy + dz*dz;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param matrix4 변수
 * @param float32array 변수
 */
GeometryModifier.prototype.Matrix4SetByFloat32Array = function(matrix4, float32array) 
{
	for (var i = 0; i < 16; i++) 
	{
		matrix4._floatArrays[i] = float32array[i];
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param matrix4 변수
 * @param point3d 변수
 * @returns transformedPoint3d
 */
GeometryModifier.prototype.Matrix4TransformPoint3D = function(matrix4, point3d) 
{
	var transformedPoint3d = new Point3D();
	//		t.x= q.x*m[0][0] + q.y*m[1][0] + q.z*m[2][0] + m[3][0];
	//		t.y= q.x*m[0][1] + q.y*m[1][1] + q.z*m[2][1] + m[3][1];
	//		t.z= q.x*m[0][2] + q.y*m[1][2] + q.z*m[2][2] + m[3][2];

	// Note: idx = 4*col+row;.***
	//_floatArrays

	// Old version.*************************************************************************************************************************
	//transformedPoint3d.x = point3d.x*matrix4.get(0,0) + point3d.y*matrix4.get(1,0) + point3d.z*matrix4.get(2,0) + matrix4.get(3,0);
	//transformedPoint3d.y = point3d.x*matrix4.get(0,1) + point3d.y*matrix4.get(1,1) + point3d.z*matrix4.get(2,1) + matrix4.get(3,1);
	//transformedPoint3d.z = point3d.x*matrix4.get(0,2) + point3d.y*matrix4.get(1,2) + point3d.z*matrix4.get(2,2) + matrix4.get(3,2);
	//--------------------------------------------------------------------------------------------------------------------------------------

	// New version. Acces directly to the array.**********************************************************************************************************************
	transformedPoint3d.x = point3d.x*matrix4._floatArrays[0] + point3d.y*matrix4._floatArrays[4] + point3d.z*matrix4._floatArrays[8] + matrix4._floatArrays[12];
	transformedPoint3d.y = point3d.x*matrix4._floatArrays[1] + point3d.y*matrix4._floatArrays[5] + point3d.z*matrix4._floatArrays[9] + matrix4._floatArrays[13];
	transformedPoint3d.z = point3d.x*matrix4._floatArrays[2] + point3d.y*matrix4._floatArrays[6] + point3d.z*matrix4._floatArrays[10] + matrix4._floatArrays[14];
	//----------------------------------------------------------------------------------------------------------------------------------------------------------------

	return transformedPoint3d;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param matrixA 변수
 * @param matrixB 변수
 * @retuns resultMat
 */
GeometryModifier.prototype.Matrix4GetMultipliedByMatrix = function(matrixA, matrixB) 
{
	//CKK_Matrix4 operator*(const CKK_Matrix4 &A)
	//{
	//	// Copied From Carve.***
	//	CKK_Matrix4 c;
	//	for (int i = 0; i < 4; i++) {
	//		for (int j = 0; j < 4; j++) {
	//			c.m[i][j] = 0.0;
	//			for (int k = 0; k < 4; k++) {
	//				c.m[i][j] += A.m[k][j] * m[i][k];
	//			}
	//		}
	//	}
	//	return c;
	//}

	var resultMat = new Matrix4();
	for (var i = 0; i < 4; i++)
	{
		for (var j = 0; j < 4; j++)
		{
			// Note: idx = 4*col+row;.***
			//var idx = matrixA.getIndexOfArray(i, j); // Old.***
			var idx = 4*i + j;
			resultMat._floatArrays[idx] = 0.0;
			for (var k = 0; k < 4; k++)
			{
				resultMat._floatArrays[idx] += matrixB._floatArrays[4*k + j] * matrixA._floatArrays[4*i + k];
			}
		}
	}
	return resultMat;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param reference 변수
 * @param matrix 변수
 */
GeometryModifier.prototype.referenceMultiplyTransformMatrix = function(reference, matrix) 
{
	//var multipliedMat = reference._matrix4.getMultipliedByMatrix(matrix); // Original.***
	var multipliedMat = this.Matrix4GetMultipliedByMatrix(reference._matrix4, matrix); // Original.***
	reference._matrix4 = multipliedMat;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param compRefList 변수
 * @param matrix 변수
 */
GeometryModifier.prototype.compoundReferencesListMultiplyReferencesMatrices = function(compRefList, matrix) 
{
	var compRefsCount = compRefList._compoundRefsArray.length;
	for (var i = 0; i < compRefsCount; i++)
	{
		var compRef = compRefList._compoundRefsArray[i];
		var refsCount = compRef._referencesList.length;
		for (var j = 0; j < refsCount; j++)
		{
			var reference = compRef._referencesList[j];
			//reference.multiplyTransformMatrix(matrix);// Old.***
			this.referenceMultiplyTransformMatrix(reference, matrix);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param compRefList 변수
 * @param eyeX 변수
 * @param eyeY 변수
 * @param eyeZ 변수
 * @returns visibleCompRefObjectsArray
 */
GeometryModifier.prototype.compoundReferencesListGetVisibleCompRefObjectsList = function(compRefList, eyeX, eyeY, eyeZ) 
{
	/*
	// https://gist.github.com/72lions/4528834
	var _appendBuffer = function(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
};
*/

	var visibleCompRefObjectsArray = new CompoundReferencesList();
	visibleCompRefObjectsArray._myBlocksList = compRefList._myBlocksList;

	var ocCullingBox = compRefList._ocCulling._ocCulling_box;
	var indicesVisiblesArrayInterior = this.occlusionCullingOctreeCellGetIndicesVisiblesForEye(ocCullingBox, eyeX, eyeY, eyeZ);
	if (indicesVisiblesArrayInterior)
	{
		var indicesCount = indicesVisiblesArrayInterior.length;
		for (var i = 0; i < indicesCount; i++)
		{
			visibleCompRefObjectsArray._compoundRefsArray.push(compRefList._compoundRefsArray[indicesVisiblesArrayInterior[i]]);
		}

	}

	var infiniteOcCullingBox = compRefList._ocCulling._infinite_ocCulling_box;
	var indicesVisiblesArrayExterior = this.occlusionCullingOctreeCellGetIndicesVisiblesForEye(infiniteOcCullingBox, eye_x, eye_y, eye_z);
	if (indicesVisiblesArrayExterior)
	{
		var indicesCount = indicesVisiblesArrayExterior.length;
		for (var i = 0; i < indicesCount; i++)
		{
			visibleCompRefObjectsArray._compoundRefsArray.push(compRefList._compoundRefsArray[indicesVisiblesArrayExterior[i]]);
		}
	}

	if (visibleCompRefObjectsArray && visibleCompRefObjectsArray.length === 0) { return null; }

	return visibleCompRefObjectsArray;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param compRefListContainer 변수
 * @param eyeX 변수
 * @param eyeY 변수
 * @param eyeZ 변수
 * @returns visibleCompRefObjectsArrayTotal
 */
GeometryModifier.prototype.compoundReferencesListContainerGetVisibleCompRefObjectsList = function(compRefListContainer, eyeX, eyeY, eyeZ) 
{
	var visibleCompRefObjectsArrayTotal = [];
	var compRefList = undefined;
	var compRefListsCount = compRefListContainer.compRefsListArray.length;
	for (var i = 0; i < compRefListsCount; i++)
	{
		compRefList = compRefListContainer.compRefsListArray[i];
		var visibleCompRefObjectsArray = this.compoundReferencesListGetVisibleCompRefObjectsList(compRefList, eyeX, eyeY, eyeZ);
		if (visibleCompRefObjectsArray !== null)
		{ visibleCompRefObjectsArrayTotal.push(visibleCompRefObjectsArray); }
	}
	return visibleCompRefObjectsArrayTotal;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param buildingProject 변수
 * @param eyeX 변수
 * @param eyeY 변수
 * @param eyeZ 변수
 * @returns totalVisibleCompRefLists
 */
GeometryModifier.prototype.bRbuildingProjectGetVisibleCompRefLists = function(buildingProject, eyeX, eyeY, eyeZ) 
{
	// 1rst, check if the eye is in the building.***
	var InteriorCompRefListContainer = buildingProject._interiorCompRefList_Container;
	var interior_visibleCompRefLists = this.compoundReferencesListContainerGetVisibleCompRefObjectsList(InteriorCompRefListContainer, eye_x, eye_y, eye_z);

	var compRefListContainer = buildingProject._compRefList_Container;
	var visibleCompRefLists = this.compoundReferencesListContainerGetVisibleCompRefObjectsList(compRefListContainer, eyeX, eyeY, eyeZ);

	var totalVisibleCompRefLists = visibleCompRefLists.concat(interior_visibleCompRefLists);

	return totalVisibleCompRefLists;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param ocCullOctreeCell 변수
 * @param minX 변수
 * @param maxX 변수
 * @param minY 변수
 * @param maxY 변수
 * @param minZ 변수
 * @param maxZ 변수
 */
GeometryModifier.prototype.occlusionCullingOctreeCellSetDimensions = function(ocCullOctreeCell, minX, maxX, minY, maxY, minZ, maxZ) 
{
	ocCullOctreeCell.minX = minX;
	ocCullOctreeCell.maxX = maxX;
	ocCullOctreeCell.minY = minY;
	ocCullOctreeCell.maxY = maxY;
	ocCullOctreeCell.minZ = minZ;
	ocCullOctreeCell.maxZ = maxZ;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param ocCullOctreeCell 변수
 */
GeometryModifier.prototype.occlusionCullingOctreeCellSetSizesSubBoxes = function(ocCullOctreeCell) 
{
	// Bottom                      Top
	// |----------|----------|     |----------|----------|
	// |          |          |     |          |          |       Y
	// |    3     |    2     |	   |    7     |    6     |       ^
	// |          |          |     |          |          |       |
	// |----------|----------|     |----------|----------|       |
	// |          |          |     |          |          |       |
	// |     0    |     1    |     |    4     |    5     |       |
	// |          |          |     |          |          |       -----------------> X
	// |----------|----------|     |----------|----------|

	if (ocCullOctreeCell._subBoxesArray.length > 0)
	{
		var halfX = (ocCullOctreeCell.maxX + ocCullOctreeCell.minX)/2.0;
		var halfY = (ocCullOctreeCell.maxY + ocCullOctreeCell.minY)/2.0;
		var halfZ = (ocCullOctreeCell.maxZ + ocCullOctreeCell.minZ)/2.0;

		// Old.***************************************************************************************************************************************************
		//ocCullOctreeCell._subBoxesArray[0].setDimensions(ocCullOctreeCell.minX, halfX,   ocCullOctreeCell.minY, halfY,   ocCullOctreeCell.minZ, halfZ);
		//ocCullOctreeCell._subBoxesArray[1].setDimensions(halfX, ocCullOctreeCell.maxX,   ocCullOctreeCell.minY, halfY,   ocCullOctreeCell.minZ, halfZ);
		//ocCullOctreeCell._subBoxesArray[2].setDimensions(halfX, ocCullOctreeCell.maxX,   halfY, ocCullOctreeCell.maxY,   ocCullOctreeCell.minZ, halfZ);
		//ocCullOctreeCell._subBoxesArray[3].setDimensions(ocCullOctreeCell.minX, halfX,   halfY, ocCullOctreeCell.maxY,   ocCullOctreeCell.minZ, halfZ);

		//ocCullOctreeCell._subBoxesArray[4].setDimensions(ocCullOctreeCell.minX, halfX,   ocCullOctreeCell.minY, halfY,   halfZ, ocCullOctreeCell.maxZ);
		//ocCullOctreeCell._subBoxesArray[5].setDimensions(halfX, ocCullOctreeCell.maxX,   ocCullOctreeCell.minY, halfY,   halfZ, ocCullOctreeCell.maxZ);
		//ocCullOctreeCell._subBoxesArray[6].setDimensions(halfX, ocCullOctreeCell.maxX,   halfY, ocCullOctreeCell.maxY,   halfZ, ocCullOctreeCell.maxZ);
		//ocCullOctreeCell._subBoxesArray[7].setDimensions(ocCullOctreeCell.minX, halfX,   halfY, ocCullOctreeCell.maxY,   halfZ, ocCullOctreeCell.maxZ);

		// New version.*********************************************************************************************************************************************
		this.occlusionCullingOctreeCellSetDimensions(ocCullOctreeCell._subBoxesArray[0], ocCullOctreeCell.minX, halfX,   ocCullOctreeCell.minY, halfY,   ocCullOctreeCell.minZ, halfZ);
		this.occlusionCullingOctreeCellSetDimensions(ocCullOctreeCell._subBoxesArray[1], halfX, ocCullOctreeCell.maxX,   ocCullOctreeCell.minY, halfY,   ocCullOctreeCell.minZ, halfZ);
		this.occlusionCullingOctreeCellSetDimensions(ocCullOctreeCell._subBoxesArray[2], halfX, ocCullOctreeCell.maxX,   halfY, ocCullOctreeCell.maxY,   ocCullOctreeCell.minZ, halfZ);
		this.occlusionCullingOctreeCellSetDimensions(ocCullOctreeCell._subBoxesArray[3], ocCullOctreeCell.minX, halfX,   halfY, ocCullOctreeCell.maxY,   ocCullOctreeCell.minZ, half_z);

		this.occlusionCullingOctreeCellSetDimensions(ocCullOctreeCell._subBoxesArray[4], ocCullOctreeCell.minX, halfX,   ocCullOctreeCell.minY, halfY,   halfZ, ocCullOctreeCell.maxZ);
		this.occlusionCullingOctreeCellSetDimensions(ocCullOctreeCell._subBoxesArray[5], halfX, ocCullOctreeCell.maxX,   ocCullOctreeCell.minY, halfY,   halfZ, ocCullOctreeCell.maxZ);
		this.occlusionCullingOctreeCellSetDimensions(ocCullOctreeCell._subBoxesArray[6], halfX, ocCullOctreeCell.maxX,   halfY, ocCullOctreeCell.maxY,   halfZ, ocCullOctreeCell.maxZ);
		this.occlusionCullingOctreeCellSetDimensions(ocCullOctreeCell._subBoxesArray[7], ocCullOctreeCell.minX, halfX,   halfY, ocCullOctreeCell.maxY,   halfZ, ocCullOctreeCell.maxZ);
		//-------------------------------------------------------------------------------------------------------------------------------------------------------------

		for (var i = 0; i < ocCullOctreeCell._subBoxesArray.length; i++)
		{
			//ocCullOctreeCell._subBoxesArray[i].setSizesSubBoxes(); // Old.***
			this.occlusionCullingOctreeCellSetSizesSubBoxes(ocCullOctreeCell._subBoxesArray[i]);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param ocCullOctreeCell 변수
 * @param x 변수
 * @param y 변수
 * @param z 변수
 * @returns intersects
 */
GeometryModifier.prototype.occlusionCullingOctreeCellIntersectsWithPoint3D = function(ocCullOctreeCell, x, y, z) 
{
	var intersects = false;

	if (x > ocCullOctreeCell.minX && x < ocCullOctreeCell.maxX) 
	{
		if (y > ocCullOctreeCell.minY && y < ocCullOctreeCell.maxY) 
		{
			if (z > ocCullOctreeCell.minZ && z < ocCullOctreeCell.maxZ) 
			{
				intersects = true;
			}
		}
	}

	return intersects;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param ocCullOctreeCell 변수
 * @param x 변수
 * @param y 변수
 * @param z 변수
 * @returns intersectedSubBox
 */
GeometryModifier.prototype.occlusionCullingOctreeCellGetIntersectedSubBoxByPoint3D = function(ocCullOctreeCell, x, y, z) 
{
	var intersectedSubBox = null;

	if (ocCullOctreeCell._ocCulling_Cell_owner === null)
	{
		// This is the mother_cell.***
		if (!this.occlusionCullingOctreeCellIntersectsWithPoint3D(ocCullOctreeCell, x, y, z))
		{
			return null;
		}
	}

	var subBoxesCount = ocCullOctreeCell._subBoxesArray.length;
	if (subBoxesCount > 0)
	{
		var centerX = (ocCullOctreeCell.minX + ocCullOctreeCell.maxX)/2.0;
		var centerY = (ocCullOctreeCell.minY + ocCullOctreeCell.maxY)/2.0;
		var centerZ = (ocCullOctreeCell.minZ + ocCullOctreeCell.maxZ)/2.0;

		var intersectedSubBoxAux = null;
		var intersectedSubBoxIdx = undefined;

		if (x < centerX)
		{
			// Here are the boxes number 0, 3, 4, 7.***
			if (y < centerY)
			{
				// Here are 0, 4.***
				if (z < centerZ) { intersectedSubBoxIdx = 0; }
				else { intersectedSubBoxIdx = 4; }
			}
			else
			{
				// Here are 3, 7.***
				if (z < centerZ) { intersectedSubBoxIdx = 3; }
				else { intersectedSubBoxIdx = 7; }
			}
		}
		else
		{
			// Here are the boxes number 1, 2, 5, 6.***
			if (y<center_y)
			{
				// Here are 1, 5.***
				if (z<center_z) { intersectedSubBoxIdx = 1; }
				else { intersectedSubBoxIdx = 5; }
			}
			else
			{
				// Here are 2, 6.***
				if (z<center_z) { intersectedSubBoxIdx = 2; }
				else { intersectedSubBoxIdx = 6; }
			}
		}

		intersectedSubBoxAux = ocCullOctreeCell._subBoxesArray[intersectedSubBoxIdx];
		intersectedSubBox = this.occlusionCullingOctreeCellGetIntersectedSubBoxByPoint3D(intersectedSubBoxAux, x, y, z);

	}
	else
	{
		intersectedSubBox = ocCullOctreeCell;
	}

	return intersectedSubBox;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param ocCullOctreeCell 변수
 * @param eyeX 변수
 * @param eyeY 변수
 * @param eyeZ 변수
 * @returns indicesVisiblesArray
 */
GeometryModifier.prototype.occlusionCullingOctreeCellGetIndicesVisiblesForEye = function(ocCullOctreeCell, eyeX, eyeY, eyeZ) 
{
	var indicesVisiblesArray = null;
	var intersectedSubBox = this.occlusionCullingOctreeCellGetIntersectedSubBoxByPoint3D(ocCullOctreeCell, eyeX, eyeY, eyeZ);

	if (intersectedSubBox !== null && intersectedSubBox._indicesArray.length > 0)
	{
		indicesVisiblesArray = intersectedSubBox._indicesArray;
	}

	return indicesVisiblesArray;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param ocCullOctreeCell 변수
 * @param expansionDist 변수
 */
GeometryModifier.prototype.occlusionCullingOctreeCellExpandBox = function(ocCullOctreeCell, expansionDist) 
{
	ocCullOctreeCell.minX -= expansionDist;
	ocCullOctreeCell.maxX += expansionDist;
	ocCullOctreeCell.minY -= expansionDist;
	ocCullOctreeCell.maxY += expansionDist;
	ocCullOctreeCell.minZ -= expansionDist;
	ocCullOctreeCell.maxZ += expansionDist;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param vtArraysCacheKeys_container 변수
 * @returns vtCacheKey
 */
GeometryModifier.prototype.vertexTexcoordsArraysCacheKeysContainerNewVertexTexcoordsArraysCacheKey = function(vtArraysCacheKeys_container) 
{
	var vtCacheKey = new VertexTexcoordsArraysCacheKeys();
	vtArraysCacheKeys_container._vtArrays_cacheKeys_array.push(vtCacheKey);
	return vtCacheKey;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param blockList 변수
 * @param idx 변수
 * @returns block
 */
GeometryModifier.prototype.blocksListGetBlock = function(blockList, idx) 
{
	var block = null;

	if (idx >= 0 && idx < blockList.blocksArray.length) 
	{
		block = blockList.blocksArray[idx];
	}
	return block;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param blockListContainer 변수
 * @param blocksListName 변수
 * @returns blocksList
 */
GeometryModifier.prototype.blocksListsContainerNewBlocksList = function(blockListContainer, blocksListName) 
{
	var blocksList = new BlocksList();
	blocksList.name = blocksListName;
	blockListContainer.blocksListsArray.push(blocksList);
	return blocksList;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param blockListContainer 변수
 * @param blocksListName 변수
 * @returns blocksList
 */
GeometryModifier.prototype.blocksListsContainerGetBlockList = function(blockListContainer, blocksListName) 
{
	var blocksListsCount = blockListContainer.blocksListsArray.length;
	var found = false;
	var i = 0;
	var blocksList = null;
	while (!found && i < blocksListsCount)
	{
		var currentBlocksList = blockListContainer.blocksListsArray[i];
		if (currentBlocksList.name === blocksListName)
		{
			found = true;
			blocksList = currentBlocksList;
		}
		i++;
	}
	return blocksList;
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param buildingProject 변수
 */
GeometryModifier.prototype.bRbuildingProjectCreateDefaultBlockReferencesLists = function(buildingProject) 
{
	// Create 5 BlocksLists: "Blocks1", "Blocks2", "Blocks3", Blocks4" and "BlocksBone".***

	// Old.*********************************************************
	//this._blocksList_Container.newBlocksList("Blocks1");
	//this._blocksList_Container.newBlocksList("Blocks2");
	//this._blocksList_Container.newBlocksList("Blocks3");
	//this._blocksList_Container.newBlocksList("Blocks4");
	//this._blocksList_Container.newBlocksList("BlocksBone");
	//----------------------------------------------------------------

	this.f4dBlocksListsContainerNewBlocksList(buildingProject._blocksList_Container, "Blocks1");
	this.f4dBlocksListsContainerNewBlocksList(buildingProject._blocksList_Container, "Blocks2");
	this.f4dBlocksListsContainerNewBlocksList(buildingProject._blocksList_Container, "Blocks3");
	this.f4dBlocksListsContainerNewBlocksList(buildingProject._blocksList_Container, "Blocks4");
	this.f4dBlocksListsContainerNewBlocksList(buildingProject._blocksList_Container, "BlocksBone");
};

/**
 * 어떤 일을 하고 있습니까?
 * @memberof GeometryModifier
 *
 * @param buildingProjectsList 변수
 * @returns brBuildingProject
 */
GeometryModifier.prototype.bRbuildingProjectsListNewBRProject = function(buildingProjectsList) 
{
	//var titol = "holes a tothom"
	//var brBuildingProject = new BRBuildingProject({Titol : titol});
	var brBuildingProject = new BRBuildingProject();

	// Create the blocks lists default.***
	this.bRbuildingProjectCreateDefaultBlockReferencesLists(brBuildingProject);

	buildingProjectsList._BR_buildingsArray.push(brBuildingProject);
	return brBuildingProject;
};

'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class GlobeTile
 */
var GlobeTile = function() 
{
	if (!(this instanceof GlobeTile)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	var globeTileOwner;
	var depth;
	var numberName;
	var minGeographicCoord;
	var maxGeographicCoord;
	var subTilesArray;
	
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns subTile
 */
GlobeTile.prototype.newSubTile = function() 
{
	var subTilesCount = this.subTilesArray.length;
	var subTile = new GlobeTile();
	subTile.depth = this.depth + 1;
	subTile.numberName = this.numberName*10 + subTilesCount + 1;
	this.subTilesArray.push(subTile);
	return subTile;
};


'use strict';

/**
 * 선
 * @class Line
 */
var Line = function() 
{
	if (!(this instanceof Line)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	// (x,y,z) = (x0,y0,z0) + lambda * (u, v, w);
	this.point = new Point3D();
	this.direction = new Point3D();
};

/**
 * 어떤 일을 하고 있습니까?
 * @param px 변수
 * @param py 변수
 * @param pz 변수
 * @param dx 변수
 * @param dy 변수
 * @param dz 변수
 */
Line.prototype.setPointAndDir = function(px, py, pz, dx, dy, dz) 
{
	this.point.set(px, py, pz);
	this.direction.set(dx, dy, dz);
	this.direction.unitary();
};
'use strict';

/**
 * cesium을 관리
 * @class MagoManager
 */
var MagoManager = function() 
{
	if (!(this instanceof MagoManager)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	// F4D Data structure & objects.*****************************************
	this.bRBuildingProjectsList = new BRBuildingProjectsList(); // Old. Provisionally for old f4d projects.*** !!!
	this.terranTile = new TerranTile();// use this.***
	this.neoBuildingsList = new NeoBuildingsList();
	this.renderer = new Renderer();
	this.selection = new Selection();
	this.shadersManager = new ShadersManager();
	this.postFxShadersManager = new PostFxShadersManager();
	this.vBOManager = new VBOManager();
	this.readerWriter = new ReaderWriter();
	this.magoPolicy = new Policy();
	this.smartTileManager = new SmartTileManager();
	this.processQueue = new ProcessQueue();
	this.parseQueue = new ParseQueue();

	// SSAO.***************************************************
	this.noiseTexture;
	this.depthFbo;
	this.normalFbo; // Only for test disply normals. No use this in release.***
	this.ssaoFbo;

	this.pixels = new Uint8Array(4*4*4); // really this is no necessary.***

	this.depthFboNeo;
	this.ssaoFboNeo;
	this.selectionFbo; // framebuffer for selection.***

	// Mouse handler.***********************************************************************
	this.handler; // mouse handlers. mouse_DOWN, mouse_MOVE, mouse_UP.***
	this.mouse_x = 0;
	this.mouse_y = 0;
	this.mouseLeftDown = false;
	this.mouseMiddleDown = false;
	this.mouseDragging = false;
	this.selObjMovePlane;

	this.selectionCandidateObjectsArray = [];
	this.selectionCandidateLowestOctreesArray = [];
	this.selectionCandidateBuildingsArray = [];
	this.objectSelected;
	this.buildingSelected;
	this.octreeSelected;
	this.objMovState = 0; // 0 = no started. 1 = mov started.
	this.mustCheckIfDragging = true;
	this.thereAreStartMovePoint = false;
	this.startMovPoint = new Point3D();
	
	this.configInformation;

	this.kernel = [ 0.33, 0.0, 0.85,
		0.25, 0.3, 0.5,
		0.1, 0.3, 0.85,
		-0.15, 0.2, 0.85,
		-0.33, 0.05, 0.6,
		-0.1, -0.15, 0.85,
		-0.05, -0.32, 0.25,
		0.2, -0.15, 0.85,
		0.6, 0.0, 0.55,
		0.5, 0.6, 0.45,
		-0.01, 0.7, 0.35,
		-0.33, 0.5, 0.45,
		-0.45, 0.0, 0.55,
		-0.65, -0.5, 0.7,
		0.0, -0.5, 0.55,
		0.33, 0.3, 0.35];

	// Original for hemisphere.***
	/*
	for(var i=0; i<kernelSize; i++) {
		var x = 2.0 * (Math.random() - 0.5);
		var y = 2.0 * (Math.random() - 0.5);
		var z = Math.random();
		if(z<0.15)z = 0.15;
		this.kernel.push(x);
		this.kernel.push(y);
		this.kernel.push(z);
	}
	*/

	/* Test for sphere.***
	for(var i=0; i<kernelSize; i++) {
		this.kernel.push(2.0 * (Math.random() - 0.5));
		this.kernel.push(2.0 * (Math.random() - 0.5));
		this.kernel.push(2.0 * (Math.random() - 0.5));
	}
	*/
	// End ssao.------------------------------------------------

	this.atmosphere = new Atmosphere();

	// Vars.****************************************************************
	this.sceneState = new SceneState(); // this contains all scene mtrices and camera position.***
	this.selectionColor = new SelectionColor();
	this.vboMemoryManager = new VBOMemoryManager();

	this.fileRequestControler = new FileRequestControler();
	this.visibleObjControlerBuildings = new VisibleObjectsController();
	this.visibleObjControlerOctrees = new VisibleObjectsController(); // delete this.***
	this.visibleObjControlerOctreesAux = new VisibleObjectsController(); // delete this.***
	
	this.currentVisibleNeoBuildings_array = []; 
	this.boundingSphere_Aux; 
	this.radiusAprox_aux;

	this.lastCamPos = new Point3D();
	this.squareDistUmbral = 22.0;

	this.lowestOctreeArray = [];

	this.backGround_fileReadings_count = 0; // this can be as max = 9.***
	this.backGround_imageReadings_count = 0;
	this.isCameraMoving = false;
	this.isCameraInsideBuilding = false;
	this.isCameraInsideNeoBuilding = false;
	this.renderingFase = 0;

	this.renders_counter = 0;
	this.render_time = 0;
	this.bPicking = false;
	this.bObjectMarker = true;
	this.framesCounter = 0;

	this.scene;

	this.renderingModeTemp = 0; // 0 = assembled mode. 1 = dispersed mode.***

	this.frustumIdx;
	this.numFrustums;
	this.isLastFrustum = false;
	this.highLightColor4 = new Float32Array([0.2, 1.0, 0.2, 1.0]);

	// CURRENTS.********************************************************************
	this.currentSelectedObj_idx = -1;
	this.currentByteColorPicked = new Uint8Array(4);
	this.currentShader;

	// SPEED TEST.******************************************************************
	this.renderingTime = 0;
	this.xdo_rendering_time = 0;
	this.xdo_rendering_time_arrays = 0;

	this.amountRenderTime = 0;
	this.xdo_amountRenderTime = 0;
	this.xdo_amountRenderTime_arrays = 0;

	this.averageRenderTime = 0;
	this.xdo_averageRenderTime = 0;
	this.xdo_averageRenderTime_arrays = 0;

	this.allBuildingsLoaded = false;
	this.renderingCounter = 0;
	this.averageRenderingCounter = 0;

	this.testFilesLoaded = false;

	// SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.***
	this.pointSC= new Point3D();
	this.pointSC_2= new Point3D();
	this.arrayAuxSC = [];

	this.currentTimeSC;
	this.dateSC;
	this.startTimeSC;
	this.maxMilisecondsForRender = 10;

	this.terranTileSC;

	this.textureAux_1x1;
	this.resultRaySC = new Float32Array(3);
	this.matrix4SC = new Matrix4();

	this.unitaryBoxSC = new Box();
	this.unitaryBoxSC.makeAABB(1.0, 1.0, 1.0); // make a unitary box.***
	this.unitaryBoxSC.vBOVertexIdxCacheKey = this.unitaryBoxSC.triPolyhedron.getVBOArrayModePosNorCol(this.unitaryBoxSC.vBOVertexIdxCacheKey);

	this.demoBlocksLoaded = false;

	this.objMarkerManager = new ObjectMarkerManager();
	this.pin = new Pin();
	
	

	// Workers.****************************************************************************
	/*
	this.worker_sonGeometry = new Worker('../Build/CesiumUnminified/SonWebWorker.js');
	//this.worker_sonGeometry.setTest(77.77);
	this.worker_sonGeometry.onmessage = function (event)
	{
		//document.getElementById('result').textContent = event.data;
		this.compRefList_array = event.data[0];
	};
	*/

	/*
	this.worker_sonGeometry = new Worker('SonWebWorker.js');
	this.worker_sonGeometry.addEventListener('message', function(e) {
		document.getElementById('result').innerHTML  = e.data;
	  }, false);
	*/
	// End workers.------------------------------------------------------------------------

//	this.createCloudsTEST();
//	this.loadObjectIndexFile = false;
};

/**
 * noise texture를 생성
 * @param gl 변수
 * @param w 변수
 * @param h 변수
 * @param pixels 변수
 * @returns texture
 */
function genNoiseTextureRGBA(gl, w, h, pixels) 
{
	var texture = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	//	var b = new ArrayBuffer(w*h*4);
	//var pixels = new Uint8Array(b);

	if (w === 4 && h === 4) 
	{
		/*
	  	pixels[0] = 149; pixels[1] = 16; pixels[2] = 2; pixels[3] = 197;
	  	pixels[4] = 79; pixels[5] = 76; pixels[6] = 11; pixels[7] = 53;
	  	pixels[8] = 83; pixels[9] = 74; pixels[10] = 155; pixels[11] = 159;
	  	pixels[12] = 19; pixels[13] = 232; pixels[14] = 183; pixels[15] = 27;

	  	pixels[16] = 200; pixels[17] = 248; pixels[18] = 98; pixels[19] = 10;
	  	pixels[20] = 63; pixels[21] = 75; pixels[22] = 229; pixels[23] = 231;
	  	pixels[24] = 162; pixels[25] = 85; pixels[26] = 114; pixels[27] = 243;
	  	pixels[28] = 149; pixels[29] = 136; pixels[30] = 210; pixels[31] = 59;

	  	pixels[32] = 210; pixels[33] = 233; pixels[34] = 117; pixels[35] = 103;
	  	pixels[36] = 83; pixels[37] = 214; pixels[38] = 42; pixels[39] = 175;
	  	pixels[40] = 117; pixels[41] = 223; pixels[42] = 87; pixels[43] = 197;
	  	pixels[44] = 99; pixels[45] = 254; pixels[46] = 128; pixels[47] = 9;

	  	pixels[48] = 137; pixels[49] = 99; pixels[50] = 146; pixels[51] = 38;
	  	pixels[52] = 145; pixels[53] = 76; pixels[54] = 178; pixels[55] = 133;
	  	pixels[56] = 202; pixels[57] = 11; pixels[58] = 220; pixels[59] = 34;
	  	pixels[60] = 61; pixels[61] = 216; pixels[62] = 95; pixels[63] = 249;
		 */
		var i = 0;
		pixels[i] = 50; i++;
		pixels[i] = 58; i++;
		pixels[i] = 229; i++;
		pixels[i] = 120; i++;
		pixels[i] = 212; i++;
		pixels[i] = 236; i++;
		pixels[i] = 251; i++;
		pixels[i] = 148; i++;
		pixels[i] = 75; i++;
		pixels[i] = 92; i++;
		pixels[i] = 246; i++;
		pixels[i] = 59; i++;
		pixels[i] = 197; i++;
		pixels[i] = 95; i++;
		pixels[i] = 235; i++;
		pixels[i] = 216; i++;
		pixels[i] = 130; i++;
		pixels[i] = 124; i++;
		pixels[i] = 215; i++;
		pixels[i] = 154; i++;
		pixels[i] = 25; i++;
		pixels[i] = 41; i++;
		pixels[i] = 221; i++;
		pixels[i] = 146; i++;
		pixels[i] = 187; i++;
		pixels[i] = 217; i++;
		pixels[i] = 130; i++;
		pixels[i] = 199; i++;
		pixels[i] = 142; i++;
		pixels[i] = 112; i++;
		pixels[i] = 61; i++;
		pixels[i] = 135; i++;
		pixels[i] = 67; i++;
		pixels[i] = 125; i++;
		pixels[i] = 159; i++;
		pixels[i] = 153; i++;
		pixels[i] = 215; i++;
		pixels[i] = 49; i++;
		pixels[i] = 49; i++;
		pixels[i] = 69; i++;
		pixels[i] = 126; i++;
		pixels[i] = 168; i++;
		pixels[i] = 61; i++;
		pixels[i] = 215; i++;
		pixels[i] = 21; i++;
		pixels[i] = 93; i++;
		pixels[i] = 183; i++;
		pixels[i] = 1; i++;
		pixels[i] = 125; i++;
		pixels[i] = 44; i++;
		pixels[i] = 22; i++;
		pixels[i] = 130; i++;
		pixels[i] = 197; i++;
		pixels[i] = 118; i++;
		pixels[i] = 109; i++;
		pixels[i] = 23; i++;
		pixels[i] = 195; i++;
		pixels[i] = 4; i++;
		pixels[i] = 148; i++;
		pixels[i] = 245; i++;
		pixels[i] = 124; i++;
		pixels[i] = 125; i++;
		pixels[i] = 185; i++;
		pixels[i] = 28; i++;
	}
	else 
	{
		for (var y=0; y<h; y++) 
		{
			for (var x=0; x<w; x++) 
			{
				pixels[(y*w + x)*4+0] = Math.floor(255 * Math.random());
				pixels[(y*w + x)*4+1] = Math.floor(255 * Math.random());
				pixels[(y*w + x)*4+2] = Math.floor(255 * Math.random());
				pixels[(y*w + x)*4+3] = Math.floor(255 * Math.random());
			}
		}
	}

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.bindTexture(gl.TEXTURE_2D, null);

	texture.width = w;
	texture.height = h;
	return texture;
}

/**
 * object 를 그리는 두가지 종류의 function을 호출
 * @param scene 변수
 * @param pass 변수
 * @param frustumIdx 변수
 * @param numFrustums 변수
 */
MagoManager.prototype.start = function(scene, pass, frustumIdx, numFrustums) 
{
	// Calculate FPS.
	//var start = new Date().getTime();
	
	// this is cesium version.***
	// mago3d 활성화가 아니면 화면을 그리지 않음
	if (!this.magoPolicy.getMagoEnable()) { return; }

	var isLastFrustum = false;
	this.frustumIdx = frustumIdx;
	this.numFrustums = numFrustums;
	if (frustumIdx === numFrustums-1) 
	{
		isLastFrustum = true;
		this.isLastFrustum = true;
	}

	// cesium 새 버전에서 지원하지 않음
	var picking = pass.pick;
	if (picking) 
	{
		//this.renderNeoBuildings(scene, isLastFrustum);
	}
	else 
	{
		if (this.configInformation === undefined)
		{
			this.configInformation = MagoConfig.getPolicy();
		}
		this.sceneState.gl = scene.context._gl;
		this.renderNeoBuildingsAsimectricVersion(scene, isLastFrustum, frustumIdx, numFrustums);
	}
	/*
	if(isLastFrustum)
	{
		// print FPS to console.
		var end = new Date().getTime();
		var fps = 1000/(end - start);
		console.log('FPS :  ' + fps);
	}
	*/
};

MagoManager.prototype.render = function(dc)
{
	// Function for WebWorldWind.*********************************************************************************************************
	// Function for WebWorldWind.*********************************************************************************************************

	// Now, we add to orderedRenderable the buildings that wants to render. PENDENT.***
	dc.addOrderedRenderable(this, 1000.0); // 1000 = distance to eye.*** Provisionally, we render all.***
	
};

/**
 * object 를 그리는 두가지 종류의 function을 호출
 * @param scene 변수
 * @param pass 변수
 * @param frustumIdx 변수
 * @param numFrustums 변수
 */
MagoManager.prototype.renderOrdered = function(dc)
{
	// Function for WebWorldWind.*********************************************************************************************************
	// Function for WebWorldWind.*********************************************************************************************************
	// Provisional function.***
	//this.render_F4D_compRefListWWW(dc, this._compRefList_Container._compRefsList_Array, this, this.f4d_shadersManager);
	/*
	var projectionMatrix = WorldWind.Matrix.fromIdentity();
	var viewport = this.wwd.viewport;
	projectionMatrix.setToPerspectiveProjection(viewport.width, viewport.height, 0.1, this.wwd.navigator.farDistance);
    dc.navigatorState = new WorldWind.NavigatorState(dc.navigatorState.modelview, projectionMatrix, viewport, dc.navigatorState.heading, dc.navigatorState.tilt);
	*/
	//this.render_Tiles(dc);
	if (this.configInformation === undefined)
	{
		this.configInformation = MagoConfig.getPolicy();
	}
		
	var isLastFrustum = true;
	var frustumIdx = 0;
	var numFrustums = 1;
	this.sceneState.dc = dc;
	this.sceneState.gl = dc.currentGlContext;
	var scene;
	
	this.renderNeoBuildingsAsimectricVersion(scene, isLastFrustum, frustumIdx, numFrustums);
};

///**
// * 어떤 일을 하고 있습니까?
// */
//MagoManager.prototype.createCloudsTEST = function() {
////	var increLong = 0.004;
////	var increLat = 0.004;
//
//	var randomLongitude = 0;
//	var randomLatitude = 0;
//	var randomAltitude = 0;
//	var randomRadius = 0;
//	var randomDepth = 0;
//
//	var cloud;
//	for(var i =0; i<10; i++) {
//		randomLongitude = 126.91+(0.05*Math.random());
//		randomLatitude = 37.51+(0.05*Math.random());
//		randomAltitude = 350+Math.random()*50;
//		randomRadius = 10+Math.random()*150;
//		randomDepth = 10+Math.random()*50;
//		cloud = this.atmosphere.cloudsManager.newCircularCloud();
//		cloud.createCloud(randomLongitude, randomLatitude, randomAltitude, randomRadius, randomDepth, 16);
//	}
//
//	for(var i =0; i<10; i++) {
//		randomLongitude = 127.0+(0.05*Math.random());
//		randomLatitude = 37.45+(0.05*Math.random());
//		randomAltitude = 350+Math.random()*50;
//		randomRadius = 10+Math.random()*150;
//		randomDepth = 10+Math.random()*50;
//		cloud = this.atmosphere.cloudsManager.newCircularCloud();
//		cloud.createCloud(randomLongitude, randomLatitude, randomAltitude, randomRadius, randomDepth, 16);
//	}
//	/*
//	cloud = this.atmosphere.cloudsManager.newCircularCloud();
//	cloud.createCloud(126.929, 37.5172076, 300.0, 100.0, 40.0, 16);
//
//	cloud = this.atmosphere.cloudsManager.newCircularCloud();
//	cloud.createCloud(126.929+increLong, 37.5172076, 340.0, 50.0, 40.0, 16);
//
//	cloud = this.atmosphere.cloudsManager.newCircularCloud();
//	cloud.createCloud(126.929+increLong, 37.5172076+increLat, 340.0, 80.0, 90.0, 16);
//	*/
//};

/**
 * 카메라가 이동중인지를 확인
 * @param cameraPosition 변수
 * @param squareDistUmbral 변수
 * @returns camera_was_moved
 */
MagoManager.prototype.isCameraMoved = function(cameraPosition, squareDistUmbral) 
{
	// if camera is interior of building -> this.squareDistUmbral = 22.0;
	// if camera is exterior of building -> this.squareDistUmbral = 200.0;
	/*
	if(this.detailed_building)
	{
		this.squareDistUmbral = 4.5*4.5;
	}
	else{
		this.squareDistUmbral = 50*50;
	}
	*/

	var camera_was_moved = false;
	var squareDistFromLastPos = this.lastCamPos.squareDistTo(cameraPosition.x, cameraPosition.y, cameraPosition.z);
	if (squareDistFromLastPos > squareDistUmbral) 
	{
		camera_was_moved = true;
		this.lastCamPos.x = cameraPosition.x;
		this.lastCamPos.y = cameraPosition.y;
		this.lastCamPos.z = cameraPosition.z;
	}

	return camera_was_moved;
};

/**
 * 카메라 이동 정보를 갱신
 * @param cameraPosition 변수
 */
MagoManager.prototype.updateCameraMoved = function(cameraPosition) 
{
	// This function must run in a background process.****
	// call this function if camera was moved.****
	//----------------------------------------------------------------

	// 1rst, do frustum culling and find a detailed building.***
};

/**
 * 기상 데이터를 그림
 * @param gl 변수
 * @param cameraPosition 변수
 * @param cullingVolume 변수
 * @param _modelViewProjectionRelativeToEye 변수
 * @param scene 변수
 * @param isLastFrustum 변수
 */
MagoManager.prototype.renderAtmosphere = function(gl, cameraPosition, cullingVolume, _modelViewProjectionRelativeToEye, scene, isLastFrustum) 
{
	var clouds_count = this.atmosphere.cloudsManager.circularCloudsArray.length;
	if (clouds_count === 0) { return; }

	var camSplitVelue_X  = Cesium.EncodedCartesian3.encode(cameraPosition.x);
	var camSplitVelue_Y  = Cesium.EncodedCartesian3.encode(cameraPosition.y);
	var camSplitVelue_Z  = Cesium.EncodedCartesian3.encode(cameraPosition.z);

	this.encodedCamPosMC_High[0] = camSplitVelue_X.high;
	this.encodedCamPosMC_High[1] = camSplitVelue_Y.high;
	this.encodedCamPosMC_High[2] = camSplitVelue_Z.high;

	this.encodedCamPosMC_Low[0] = camSplitVelue_X.low;
	this.encodedCamPosMC_Low[1] = camSplitVelue_Y.low;
	this.encodedCamPosMC_Low[2] = camSplitVelue_Z.low;
	// Test using f4d_shaderManager.************************
	var shadersManager = this.shadersManager;
	var standardShader = shadersManager.getMagoShader(4); // 4 = cloud-shader.***
	var shaderProgram = standardShader.SHADER_PROGRAM;

	gl.useProgram(shaderProgram);
	gl.enableVertexAttribArray(standardShader._color);
	gl.enableVertexAttribArray(standardShader._position);

	// Calculate "modelViewProjectionRelativeToEye".*********************************************************
	Cesium.Matrix4.toArray(_modelViewProjectionRelativeToEye, this.modelViewProjRelToEye_matrix);
	//End Calculate "modelViewProjectionRelativeToEye".------------------------------------------------------

	gl.uniformMatrix4fv(standardShader._ModelViewProjectionMatrixRelToEye, false, this.modelViewProjRelToEye_matrix);
	gl.uniform3fv(standardShader._encodedCamPosHIGH, this.encodedCamPosMC_High);
	gl.uniform3fv(standardShader._encodedCamPosLOW, this.encodedCamPosMC_Low);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.depthRange(0, 1);

	// Clouds.***************************************************
	var cloud;
	for (var i=0; i<clouds_count; i++) 
	{
		cloud = this.atmosphere.cloudsManager.circularCloudsArray[i];

		gl.uniform3fv(standardShader._cloudPosHIGH, cloud.positionHIGH);
		gl.uniform3fv(standardShader._cloudPosLOW, cloud.positionLOW);

		if (cloud.vbo_vertexCacheKey === undefined) 
		{
			cloud.vbo_vertexCacheKey = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, cloud.vbo_vertexCacheKey);
			gl.bufferData(gl.ARRAY_BUFFER, cloud.getVBOVertexColorFloatArray(), gl.STATIC_DRAW);
		}
		if (cloud.vbo_indexCacheKey === undefined) 
		{
			cloud.vbo_indexCacheKey = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cloud.vbo_indexCacheKey);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cloud.getVBOIndicesShortArray(), gl.STATIC_DRAW);
		}

		// Interleaved mode.***
		gl.bindBuffer(gl.ARRAY_BUFFER, cloud.vbo_vertexCacheKey);
		gl.vertexAttribPointer(standardShader._position, 3, gl.FLOAT, false, 24, 0);
		gl.vertexAttribPointer(standardShader._color, 3, gl.FLOAT, false, 24, 12);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cloud.vbo_indexCacheKey);
		gl.drawElements(gl.TRIANGLES, cloud.indicesCount, gl.UNSIGNED_SHORT, 0); // Fill.***
		//gl.drawElements(gl.LINE_LOOP, cloud.indicesCount, gl.UNSIGNED_SHORT, 0); // Wireframe.***
	}

	gl.disableVertexAttribArray(standardShader._color);
	gl.disableVertexAttribArray(standardShader._position);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

/**
 * 구름 그림자를 그림
 * @param gl 변수
 * @param cameraPosition 변수
 * @param cullingVolume 변수
 * @param _modelViewProjectionRelativeToEye 변수
 * @param scene 변수
 * @param isLastFrustum 변수
 */
MagoManager.prototype.renderCloudShadows = function(gl, cameraPosition, cullingVolume, _modelViewProjectionRelativeToEye, scene, isLastFrustum) 
{
	//if(!isLastFrustum)
	//	return;
	//this.doFrustumCullingClouds(cullingVolume, this.atmosphere.cloudsManager.circularCloudsArray, cameraPosition);

	var clouds_count = this.atmosphere.cloudsManager.circularCloudsArray.length;
	if (clouds_count === 0) { return; }

	var camSplitVelue_X  = Cesium.EncodedCartesian3.encode(cameraPosition.x);
	var camSplitVelue_Y  = Cesium.EncodedCartesian3.encode(cameraPosition.y);
	var camSplitVelue_Z  = Cesium.EncodedCartesian3.encode(cameraPosition.z);

	this.encodedCamPosMC_High[0] = camSplitVelue_X.high;
	this.encodedCamPosMC_High[1] = camSplitVelue_Y.high;
	this.encodedCamPosMC_High[2] = camSplitVelue_Z.high;

	this.encodedCamPosMC_Low[0] = camSplitVelue_X.low;
	this.encodedCamPosMC_Low[1] = camSplitVelue_Y.low;
	this.encodedCamPosMC_Low[2] = camSplitVelue_Z.low;
	// Test using f4d_shaderManager.************************
	var shadersManager = this.shadersManager;
	var standardShader = shadersManager.getMagoShader(4); // 4 = cloud-shader.***
	var shaderProgram = standardShader.SHADER_PROGRAM;

	gl.useProgram(shaderProgram);
	//gl.enableVertexAttribArray(standardShader._color);
	//gl.disableVertexAttribArray(standardShader._color);
	gl.enableVertexAttribArray(standardShader._position);

	// Calculate "modelViewProjectionRelativeToEye".*********************************************************
	Cesium.Matrix4.toArray(_modelViewProjectionRelativeToEye, this.modelViewProjRelToEye_matrix);
	//End Calculate "modelViewProjectionRelativeToEye".------------------------------------------------------

	gl.uniformMatrix4fv(standardShader._ModelViewProjectionMatrixRelToEye, false, this.modelViewProjRelToEye_matrix);
	gl.uniform3fv(standardShader._encodedCamPosHIGH, this.encodedCamPosMC_High);
	gl.uniform3fv(standardShader._encodedCamPosLOW, this.encodedCamPosMC_Low);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.depthRange(0, 1);

	// SHADOW SETTINGS.**********************************************************************************
	gl.colorMask(false, false, false, false);
	gl.depthMask(false);
	gl.enable(gl.CULL_FACE);
	gl.enable(gl.STENCIL_TEST);
	gl.enable(gl.POLYGON_OFFSET_FILL);
	gl.polygonOffset(1.0, 2.0); // Original.***
	//gl.polygonOffset(1.0, 1.0);

	// First pas.****************************************************************************************************
	gl.cullFace(gl.FRONT);
	gl.stencilFunc(gl.ALWAYS, 0x0, 0xff);
	gl.stencilOp(gl.KEEP, gl.INCR, gl.KEEP);
	gl.clearStencil(0);
	//gl.clear(gl.STENCIL_BUFFER_BIT);

	// Clouds.***
	//clouds_count = this.currentVisibleClouds_array.length;
	var cloud;
	for (var i=0; i<clouds_count; i++) 
	{
		cloud = this.atmosphere.cloudsManager.circularCloudsArray[i]; // Original.***
		//cloud = this.currentVisibleClouds_array[i];

		gl.uniform3fv(standardShader._cloudPosHIGH, cloud.positionHIGH);
		gl.uniform3fv(standardShader._cloudPosLOW, cloud.positionLOW);

		// Provisionally render sadow.***
		if (cloud.vbo_shadowVertexCacheKey === undefined) 
		{
			cloud.vbo_shadowVertexCacheKey = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, cloud.vbo_shadowVertexCacheKey);
			gl.bufferData(gl.ARRAY_BUFFER, cloud.getVBOShadowVertexFloatArray(), gl.STATIC_DRAW);
		}
		if (cloud.vbo_shadowIndexCacheKey === undefined) 
		{
			cloud.vbo_shadowIndexCacheKey = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cloud.vbo_shadowIndexCacheKey);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cloud.getVBOShadowIndicesShortArray(), gl.STATIC_DRAW);
		}

		// Interleaved mode.***
		gl.bindBuffer(gl.ARRAY_BUFFER, cloud.vbo_shadowVertexCacheKey);
		gl.vertexAttribPointer(standardShader._position, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cloud.vbo_shadowIndexCacheKey);
		gl.drawElements(gl.TRIANGLES, cloud.indicesCount, gl.UNSIGNED_SHORT, 0); // Fill.***
		//gl.drawElements(gl.LINE_LOOP, cloud.indicesCount, gl.UNSIGNED_SHORT, 0); // Wireframe.***
	}

	// Second pass.****************************************************************************************************
	gl.cullFace(gl.BACK);
	gl.stencilFunc(gl.ALWAYS, 0x0, 0xff);
	gl.stencilOp(gl.KEEP, gl.DECR, gl.KEEP);

	// Clouds.***
	for (var i=0; i<clouds_count; i++) 
	{
		cloud = this.atmosphere.cloudsManager.circularCloudsArray[i];

		gl.uniform3fv(standardShader._cloudPosHIGH, cloud.positionHIGH);
		gl.uniform3fv(standardShader._cloudPosLOW, cloud.positionLOW);

		// Provisionally render sadow.***
		if (cloud.vbo_shadowVertexCacheKey === undefined) 
		{
			cloud.vbo_shadowVertexCacheKey = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, cloud.vbo_shadowVertexCacheKey);
			gl.bufferData(gl.ARRAY_BUFFER, cloud.getVBOShadowVertexFloatArray(), gl.STATIC_DRAW);
		}
		if (cloud.vbo_shadowIndexCacheKey === undefined) 
		{
			cloud.vbo_shadowIndexCacheKey = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cloud.vbo_shadowIndexCacheKey);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cloud.getVBOShadowIndicesShortArray(), gl.STATIC_DRAW);
		}

		// Interleaved mode.***
		gl.bindBuffer(gl.ARRAY_BUFFER, cloud.vbo_shadowVertexCacheKey);
		gl.vertexAttribPointer(standardShader._position, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cloud.vbo_shadowIndexCacheKey);
		gl.drawElements(gl.TRIANGLES, cloud.indicesCount, gl.UNSIGNED_SHORT, 0); // Fill.***
		//gl.drawElements(gl.LINE_LOOP, cloud.indicesCount, gl.UNSIGNED_SHORT, 0); // Wireframe.***
	}
	//gl.disableVertexAttribArray(standardShader._color);
	gl.disableVertexAttribArray(standardShader._position);

	// Render the shadow.*********************************************************************************************
	gl.disable(gl.POLYGON_OFFSET_FILL);
	gl.disable(gl.CULL_FACE);
	gl.colorMask(true, true, true, true);
	gl.depthMask(false);
	gl.stencilMask(0x00);

	gl.stencilFunc(gl.NOTEQUAL, 1, 0xff);
	gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);

	gl.disable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // Original.***
	//gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	// must draw a rectangle for blending.***
	gl.cullFace(gl.FRONT);

	// render the shadowBlendingCube.***
	standardShader = shadersManager.getMagoShader(5); // 5 = blendingCube-shader.***
	gl.useProgram(standardShader.SHADER_PROGRAM);

	gl.enableVertexAttribArray(standardShader._color);
	gl.enableVertexAttribArray(standardShader._position);

	gl.uniformMatrix4fv(standardShader._ModelViewProjectionMatrixRelToEye, false, this.modelViewProjRelToEye_matrix);
	gl.uniform3fv(standardShader._encodedCamPosHIGH, this.encodedCamPosMC_High);
	gl.uniform3fv(standardShader._encodedCamPosLOW, this.encodedCamPosMC_Low);

	var shadowBC = this.atmosphere.shadowBlendingCube;
	if (shadowBC.vbo_vertexCacheKey === undefined) 
	{
		shadowBC.vbo_vertexCacheKey = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, shadowBC.vbo_vertexCacheKey);
		gl.bufferData(gl.ARRAY_BUFFER, shadowBC.getVBOVertexColorRGBAFloatArray(), gl.STATIC_DRAW);
	}
	if (shadowBC.vbo_indexCacheKey === undefined) 
	{
		shadowBC.vbo_indexCacheKey = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shadowBC.vbo_indexCacheKey);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, shadowBC.getVBOIndicesShortArray(), gl.STATIC_DRAW);
	}

	// Interleaved mode.***
	gl.bindBuffer(gl.ARRAY_BUFFER, shadowBC.vbo_vertexCacheKey);
	gl.vertexAttribPointer(standardShader._position, 3, gl.FLOAT, false, 28, 0);
	gl.vertexAttribPointer(standardShader._color, 4, gl.FLOAT, false, 28, 12);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shadowBC.vbo_indexCacheKey);
	gl.drawElements(gl.TRIANGLES, shadowBC.indicesCount, gl.UNSIGNED_SHORT, 0); // Fill.***

	gl.disableVertexAttribArray(standardShader._position);
	gl.disableVertexAttribArray(standardShader._color);

	gl.enable(gl.DEPTH_TEST);
	gl.disable(gl.BLEND);
	gl.disable(gl.STENCIL_TEST);
};

/**
 * 텍스처를 읽어서 그래픽 카드에 올림
 * @param gl 변수
 * @param image 변수
 * @param texture
 */
function handleTextureLoaded(gl, image, texture) 
{
	// https://developer.mozilla.org/en-US/docs/Web/API/Webgl_API/Tutorial/Using_textures_in_Webgl
	//var gl = viewer.scene.context._gl;
	gl.bindTexture(gl.TEXTURE_2D, texture);
	//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBgl,true); // if need vertical mirror of the image.***
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); // Original.***
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * 빌딩을 준비(새버전)
 * @param gl 변수
 */
MagoManager.prototype.prepareNeoBuildingsAsimetricVersion = function(gl) 
{
	// for all renderables, prepare data.***
	var neoBuilding;
	var geometryDataPath = this.readerWriter.geometryDataPath;

	var currentVisibleBlocks = [].concat(this.visibleObjControlerBuildings.currentVisibles0, this.visibleObjControlerBuildings.currentVisibles2);
	for (var i=0, length = currentVisibleBlocks.length; i<length; i++) 
	{
		neoBuilding = currentVisibleBlocks[i];
		
		if (neoBuilding.buildingId == "U310T")
		{ var hola = 0; }

		// check if this building is ready to render.***
		if (!neoBuilding.allFilesLoaded) 
		{
			// 1) MetaData
			var metaData = neoBuilding.metaData;
			if (metaData.fileLoadState === CODE.fileLoadState.READY) 
			{
				if (this.fileRequestControler.isFull())	{ return; }
				
				var neoBuildingHeaderPath = geometryDataPath + "/" + neoBuilding.buildingFileName + "/HeaderAsimetric.hed";
				this.readerWriter.getNeoHeaderAsimetricVersion(gl, neoBuildingHeaderPath, neoBuilding, this.readerWriter, this); // Here makes the tree of octree.***
			}
		}
	}
	currentVisibleBlocks.length = 0;
};

/**
 * Here updates the modelView matrices.
 * @param {SceneState} sceneState
 */
MagoManager.prototype.upDateSceneStateMatrices = function(sceneState) 
{
	// here updates the modelView and modelViewProjection matrices of the scene.***
	if (this.configInformation.geo_view_library === Constant.WORLDWIND)
	{
		// * else if this is in WebWorldWind:
		// www dependency.****
		var dc = sceneState.dc;
		
		var columnMajorArray = WorldWind.Matrix.fromIdentity();
		var columnMajorArrayAux = WorldWind.Matrix.fromIdentity();
		
		var modelViewRelToEye = WorldWind.Matrix.fromIdentity();
		modelViewRelToEye.copy(dc.navigatorState.modelview);
		modelViewRelToEye[3] = 0.0;
		modelViewRelToEye[7] = 0.0;
		modelViewRelToEye[11] = 0.0;
		
		// ModelViewMatrix.***
		var modelView = WorldWind.Matrix.fromIdentity();
		modelView.copy(dc.navigatorState.modelview);
		columnMajorArray = modelView.columnMajorComponents(columnMajorArrayAux);
		sceneState.modelViewMatrix.copyFromFloatArray(columnMajorArray);
		
		// ModelViewMatrix Inverse.***
		var matrixInv = WorldWind.Matrix.fromIdentity();
		//matrixInv.invertMatrix(modelView);
		matrixInv.invertOrthonormalMatrix(modelView);
		columnMajorArray = matrixInv.columnMajorComponents(columnMajorArrayAux);
		sceneState.modelViewMatrixInv.copyFromFloatArray(columnMajorArray);
		
		// NormalMatrix.***
		sceneState.normalMatrix4.copyFromFloatArray(matrixInv);
	  
		// Projection Matrix.***
		var projection = WorldWind.Matrix.fromIdentity();
		projection.copy(dc.navigatorState.projection);
		columnMajorArray = projection.columnMajorComponents(columnMajorArrayAux);
		sceneState.projectionMatrix.copyFromFloatArray(columnMajorArray);
		
		// ModelViewRelToEyeMatrix.***
		modelView = WorldWind.Matrix.fromIdentity();
		modelView.copy(dc.navigatorState.modelview);
		columnMajorArray = modelViewRelToEye.columnMajorComponents(columnMajorArray);
		sceneState.modelViewRelToEyeMatrix.copyFromFloatArray(columnMajorArray);
		
		// ModelViewRelToEyeMatrixInv.***
		var mvRelToEyeInv = WorldWind.Matrix.fromIdentity();
		mvRelToEyeInv.invertOrthonormalMatrix(modelViewRelToEye);
		columnMajorArray = mvRelToEyeInv.columnMajorComponents(columnMajorArrayAux);
		sceneState.modelViewRelToEyeMatrixInv.copyFromFloatArray(columnMajorArray);
		
		// ModelViewProjectionRelToEyeMatrix.***
		var modelViewProjectionRelToEye_aux = WorldWind.Matrix.fromIdentity();
		modelViewProjectionRelToEye_aux.copy(projection);
		modelViewProjectionRelToEye_aux.multiplyMatrix(modelViewRelToEye);
		var columnMajorArrayAux = WorldWind.Matrix.fromIdentity();
		var columnMajorArray = modelViewProjectionRelToEye_aux.columnMajorComponents(columnMajorArrayAux); // Original.***
		sceneState.modelViewProjRelToEyeMatrix.copyFromFloatArray(columnMajorArray);
		
		/*
		// ModelViewProjectionRelToEyeMatrix.***
		columnMajorArray = WorldWind.Matrix.fromIdentity();
		var modelViewProjection = WorldWind.Matrix.fromIdentity();
		modelViewProjection.copy(dc.navigatorState.modelviewProjection);
		columnMajorArray = modelViewProjection.columnMajorComponents(columnMajorArrayAux);
		columnMajorArray[12] = 0.0;
		columnMajorArray[13] = 0.0;
		columnMajorArray[14] = 0.0;
		sceneState.modelViewProjRelToEyeMatrix.copyFromFloatArray(columnMajorArray);
		*/
		
		var cameraPosition = dc.navigatorState.eyePoint;
		sceneState.camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
		//sceneState.camera.direction.set(scene._camera.direction.x, scene._camera.direction.y, scene._camera.direction.z);
		//sceneState.camera.up.set(scene._camera.up.x, scene._camera.up.y, scene._camera.up.z);
		ManagerUtils.calculateSplited3fv([cameraPosition[0], cameraPosition[1], cameraPosition[2]], sceneState.encodedCamPosHigh, sceneState.encodedCamPosLow);
		
		var viewport = this.wwd.viewport;
		sceneState.camera.frustum.aspectRatio = viewport.width/viewport.height;
		//sceneState.camera.frustum.near[0] = this.wwd.navigator.nearDistance;
		sceneState.camera.frustum.near[0] = 0.1;
		sceneState.camera.frustum.far = 1000.0;
		//sceneState.camera.frustum.far[0] = this.wwd.navigator.farDistance;
		
		// Calculate FOV & FOVY.***
		if (sceneState.camera.frustum.dirty)
		{
			var projectionMatrix = dc.navigatorState.projection;
			var aspectRat = sceneState.camera.frustum.aspectRatio;
			var angleAlfa = 2*Math.atan(1/(aspectRat*projectionMatrix[0]));
			sceneState.camera.frustum.fovyRad = angleAlfa; // pendent to know the real fov in webwroldwind.***
			sceneState.camera.frustum.fovRad = sceneState.camera.frustum.fovyRad*sceneState.camera.frustum.aspectRatio;
			sceneState.camera.frustum.dirty = false;
		}

		// screen size.***
		sceneState.drawingBufferWidth = viewport.width;
		sceneState.drawingBufferHeight = viewport.height;
	}
	else if (this.configInformation.geo_view_library === Constant.CESIUM)
	{
		// * if this is in Cesium:
		var scene = this.scene;
		var uniformState = scene._context.uniformState;
		//var uniformState = scene._context._us;
		Cesium.Matrix4.toArray(uniformState._modelViewProjectionRelativeToEye, sceneState.modelViewProjRelToEyeMatrix._floatArrays);
		Cesium.Matrix4.toArray(uniformState._modelViewRelativeToEye, sceneState.modelViewRelToEyeMatrix._floatArrays);
		
		sceneState.modelViewRelToEyeMatrixInv._floatArrays = Cesium.Matrix4.inverseTransformation(sceneState.modelViewRelToEyeMatrix._floatArrays, sceneState.modelViewRelToEyeMatrixInv._floatArrays);// original.***
		
		//Cesium.Matrix4.toArray(uniformState._modelView, sceneState.modelViewMatrix._floatArrays);// original.***
		//sceneState.modelViewMatrix._floatArrays = Cesium.Matrix4.multiply(uniformState.model, uniformState.view, sceneState.modelViewMatrix._floatArrays);
		sceneState.modelViewMatrix._floatArrays = Cesium.Matrix4.clone(uniformState.view, sceneState.modelViewMatrix._floatArrays);
		Cesium.Matrix4.toArray(uniformState._projection, sceneState.projectionMatrix._floatArrays);

		var cameraPosition = scene.context._us._cameraPosition;
		ManagerUtils.calculateSplited3fv([cameraPosition.x, cameraPosition.y, cameraPosition.z], sceneState.encodedCamPosHigh, sceneState.encodedCamPosLow);

		sceneState.modelViewMatrixInv._floatArrays = Cesium.Matrix4.inverseTransformation(sceneState.modelViewMatrix._floatArrays, sceneState.modelViewMatrixInv._floatArrays);// original.***
		sceneState.normalMatrix4._floatArrays = Cesium.Matrix4.transpose(sceneState.modelViewMatrixInv._floatArrays, sceneState.normalMatrix4._floatArrays);// original.***

		sceneState.camera.frustum.far[0] = scene._frustumCommandsList[0].far; // original.***
		//sceneState.camera.frustum.far[0] = 5000000.0;
		sceneState.camera.frustum.near[0] = scene._frustumCommandsList[0].near;
		sceneState.camera.frustum.fovRad = scene._camera.frustum._fov;
		sceneState.camera.frustum.fovyRad = scene._camera.frustum._fovy;
		sceneState.camera.frustum.aspectRatio = scene._camera.frustum._aspectRatio;

		sceneState.camera.position.set(scene.context._us._cameraPosition.x, scene.context._us._cameraPosition.y, scene.context._us._cameraPosition.z);
		sceneState.camera.direction.set(scene._camera.direction.x, scene._camera.direction.y, scene._camera.direction.z);
		sceneState.camera.up.set(scene._camera.up.x, scene._camera.up.y, scene._camera.up.z);
		
		sceneState.drawingBufferWidth = scene.drawingBufferWidth;
		sceneState.drawingBufferHeight = scene.drawingBufferHeight;
	}

};

/**
 * Here updates the camera's parameters and frustum planes.
 * @param {Camera} camera
 */
MagoManager.prototype.upDateCamera = function(resultCamera) 
{
	if (this.configInformation.geo_view_library === Constant.WORLDWIND)
	{
		var wwwFrustumVolume = this.sceneState.dc.navigatorState.frustumInModelCoordinates;
		for (var i=0; i<6; i++)
		{
			var plane = wwwFrustumVolume._planes[i];
			resultCamera.frustum.planesArray[i].setNormalAndDistance(plane.normal[0], plane.normal[1], plane.normal[2], plane.distance);
		}
	}
	else if (this.configInformation.geo_view_library === Constant.CESIUM)
	{
		var camera = this.scene.frameState.camera;
		var cesiumFrustum = camera.frustum.computeCullingVolume(camera.position, camera.direction, camera.up);

		for (var i=0; i<6; i++)
		{
			var plane = cesiumFrustum.planes[i];
			resultCamera.frustum.planesArray[i].setNormalAndDistance(plane.x, plane.y, plane.z, plane.w);
		}
	}
};


/**
 * object index 파일을 읽어서 Frustum Culling으로 화면에 rendering
 * @param scene 변수
 * @param isLastFrustum 변수
 */
MagoManager.prototype.renderNeoBuildingsAsimectricVersion = function(scene, isLastFrustum, frustumIdx, numFrustums) 
{
	if (this.renderingModeTemp === 0) 
	{
		if (!isLastFrustum) { return; }
	}

	//if(!isLastFrustum) return;

	this.frustumIdx = frustumIdx;
	this.numFrustums = numFrustums;
	this.isLastFrustum = isLastFrustum;
	
	this.upDateSceneStateMatrices(this.sceneState);

	var gl = this.sceneState.gl;

	if (this.textureAux_1x1 === undefined) 
	{
		this.textureAux_1x1 = gl.createTexture();
		// Test wait for texture to load.********************************************
		gl.bindTexture(gl.TEXTURE_2D, this.textureAux_1x1);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([200, 200, 200, 255])); // clear grey
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	
	if (this.pin.texture === undefined)
	{
		this.pin.texture = new Texture();
		var filePath_inServer = this.magoPolicy.imagePath + "/bugger.png";
		this.pin.texture.texId = gl.createTexture();
		this.readerWriter.readNeoReferenceTexture(gl, filePath_inServer, this.pin.texture, undefined, this);
		this.pin.texturesArray.push(this.pin.texture);
		
		var cabreadoTex = new Texture();
		filePath_inServer = this.magoPolicy.imagePath + "/improve.png";
		cabreadoTex.texId = gl.createTexture();
		this.readerWriter.readNeoReferenceTexture(gl, filePath_inServer, cabreadoTex, undefined, this);
		this.pin.texturesArray.push(cabreadoTex);
		
		var cabreadoTex = new Texture();
		filePath_inServer = this.magoPolicy.imagePath + "/etc.png";
		cabreadoTex.texId = gl.createTexture();
		this.readerWriter.readNeoReferenceTexture(gl, filePath_inServer, cabreadoTex, undefined, this);
		this.pin.texturesArray.push(cabreadoTex);
		
		var cabreadoTex = new Texture();
		filePath_inServer = this.magoPolicy.imagePath + "/new.png";
		cabreadoTex.texId = gl.createTexture();
		this.readerWriter.readNeoReferenceTexture(gl, filePath_inServer, cabreadoTex, undefined, this);
		this.pin.texturesArray.push(cabreadoTex);
	
	}
	
	//scene
	if (this.depthFboNeo === undefined) { this.depthFboNeo = new FBO(gl, this.sceneState.drawingBufferWidth, this.sceneState.drawingBufferHeight); }
	if (this.sceneState.drawingBufferWidth !== this.depthFboNeo.width || this.sceneState.drawingBufferHeight !== this.depthFboNeo.height)
	{
		this.depthFboNeo = new FBO(gl, this.sceneState.drawingBufferWidth, this.sceneState.drawingBufferHeight);
		this.sceneState.camera.frustum.dirty = true;
	}

	var cameraPosition = this.sceneState.camera.position;

	if (!this.isCameraMoving && !this.mouseLeftDown && !this.mouseMiddleDown)
	{
		if (this.isLastFrustum)
		{
			//if(this.sceneState.bMust)
			{
				if (this.myCameraSCX === undefined) 
				{ this.myCameraSCX = new Camera(); }

				this.upDateCamera(this.myCameraSCX);
				this.currentVisibleNeoBuildings_array.length = 0;
				//this.doFrustumCullingNeoBuildings(this.myCameraSCX.frustum, cameraPosition); // old.
				this.doFrustumCullingSmartTiles(this.myCameraSCX.frustum, cameraPosition);
				this.prepareNeoBuildingsAsimetricVersion(gl);
			}
		}
	}
	
	var currentShader = undefined;

	// prepare data if camera is no moving.***
	// 1) LOD 0.*********************************************************************************************************************
	if (!this.isCameraMoving && !this.mouseLeftDown && !this.mouseMiddleDown && this.isLastFrustum) 
	{
		this.visibleObjControlerOctrees.initArrays(); // init.******
		this.visibleObjControlerOctreesAux.initArrays(); // init.******

		// lod 0 & lod 1.
		var buildingsCount = this.visibleObjControlerBuildings.currentVisibles0.length;
		for (var i=0; i<buildingsCount; i++) 
		{
			var neoBuilding = this.visibleObjControlerBuildings.currentVisibles0[i];
			if (neoBuilding.buildingId == "U310T")
			{ var hola = 0; }
			
			this.getRenderablesDetailedNeoBuildingAsimetricVersion(gl, scene, neoBuilding, this.visibleObjControlerOctrees, this.visibleObjControlerOctreesAux, 0);
		}
		var fileRequestExtraCount = 2;
		this.prepareVisibleOctreesSortedByDistanceLOD2(gl, scene, this.visibleObjControlerOctrees, fileRequestExtraCount);
		fileRequestExtraCount = 5;
		this.prepareVisibleOctreesSortedByDistance(gl, scene, this.visibleObjControlerOctrees, fileRequestExtraCount); 
		
		// lod 2.
		buildingsCount = this.visibleObjControlerBuildings.currentVisibles2.length;
		for (var i=0; i<buildingsCount; i++) 
		{
			var neoBuilding = this.visibleObjControlerBuildings.currentVisibles2[i];
			this.getRenderablesDetailedNeoBuildingAsimetricVersion(gl, scene, neoBuilding, this.visibleObjControlerOctrees, this.visibleObjControlerOctreesAux, 2);
		}
		fileRequestExtraCount = 2;
		this.prepareVisibleOctreesSortedByDistanceLOD2(gl, scene, this.visibleObjControlerOctrees, fileRequestExtraCount);
		
		// if a LOD0 building has a NO ready lowestOctree, then push this building to the LOD2BuildingsArray.***
		buildingsCount = this.visibleObjControlerBuildings.currentVisibles0.length;
		for (var i=0; i<buildingsCount; i++) 
		{
			var neoBuilding = this.visibleObjControlerBuildings.currentVisibles0[i];
			if (neoBuilding.currentVisibleOctreesControler === undefined)
			{ continue; }
			if (neoBuilding.currentVisibleOctreesControler.currentVisibles2.length > 0)
			{
				// then push this neoBuilding to the LOD2BuildingsArray.***
				this.visibleObjControlerBuildings.currentVisibles2.push(neoBuilding);
			}
		}
		
		this.manageQueue();
	}
	
	if (this.bPicking === true && isLastFrustum)
	{
		var pixelPos;
		
		if (this.magoPolicy.issueInsertEnable === true)
		{
			if (this.objMarkerSC === undefined)
			{ this.objMarkerSC = new ObjectMarker(); }
			
			pixelPos = new Point3D();
			pixelPos = this.calculatePixelPositionWorldCoord(gl, this.mouse_x, this.mouse_y, pixelPos);
			//var objMarker = this.objMarkerManager.newObjectMarker();
			
			ManagerUtils.calculateGeoLocationDataByAbsolutePoint(pixelPos.x, pixelPos.y, pixelPos.z, this.objMarkerSC.geoLocationData, this);
			this.renderingFase = !this.renderingFase;
		}
		
		if (this.magoPolicy.objectInfoViewEnable === true)
		{
			if (this.objMarkerSC === undefined)
			{ this.objMarkerSC = new ObjectMarker(); }
			
			if (pixelPos === undefined)
			{
				pixelPos = new Point3D();
				pixelPos = this.calculatePixelPositionWorldCoord(gl, this.mouse_x, this.mouse_y, pixelPos);
			}
			//var objMarker = this.objMarkerManager.newObjectMarker();
			
			ManagerUtils.calculateGeoLocationDataByAbsolutePoint(pixelPos.x, pixelPos.y, pixelPos.z, this.objMarkerSC.geoLocationData, this);
			this.renderingFase = !this.renderingFase;
		}
	}
	
	
	if (this.bPicking === true && isLastFrustum)
	{
		this.arrayAuxSC.length = 0;
		this.objectSelected = this.getSelectedObjects(gl, this.mouse_x, this.mouse_y, this.visibleObjControlerBuildings, this.arrayAuxSC);
		this.buildingSelected = this.arrayAuxSC[0];
		this.octreeSelected = this.arrayAuxSC[1];
		this.arrayAuxSC.length = 0;
		if (this.buildingSelected !== undefined) 
		{
			this.displayLocationAndRotation(this.buildingSelected);
			this.selectedObjectNotice(this.buildingSelected);
		}
		if (this.objectSelected !== undefined) 
		{
			//this.displayLocationAndRotation(currentSelectedBuilding);
			//this.selectedObjectNotice(currentSelectedBuilding);
			//console.log("objectId = " + selectedObject.objectId);
		}
	}
	
	// 1) The depth render.**********************************************************************************************************************
	//if(this.currentFramebuffer === null)
	//	this.currentFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
	this.depthFboNeo.bind(); // DEPTH START.*****************************************************************************************************
	var ssao_idx = 0; // 0= depth. 1= ssao.***
	var renderTexture = false;
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0, this.sceneState.drawingBufferWidth, this.sceneState.drawingBufferHeight);
	this.renderLowestOctreeAsimetricVersion(gl, cameraPosition, currentShader, renderTexture, ssao_idx, this.visibleObjControlerBuildings);
	this.depthFboNeo.unbind();
	
	this.renderingFase = !this.renderingFase;

	
	// 2) ssao render.************************************************************************************************************
	//if(this.currentFramebuffer !== null)
	//this.sceneState.gl.bindFramebuffer(this.sceneState.gl.FRAMEBUFFER, this.currentFramebuffer);
	
	if (this.configInformation.geo_view_library === Constant.WORLDWIND)
	{
		;//
	}
	else if (this.configInformation.geo_view_library === Constant.CESIUM)
	{
		scene._context._currentFramebuffer._bind();
	}
	
	var wwwCurrentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
	var wwwCurrentTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
	
	if (this.noiseTexture === undefined) 
	{ this.noiseTexture = genNoiseTextureRGBA(gl, 4, 4, this.pixels); }

	ssao_idx = 1;
	this.renderLowestOctreeAsimetricVersion(gl, cameraPosition, currentShader, renderTexture, ssao_idx, this.visibleObjControlerBuildings);
	
	this.renderingFase = !this.renderingFase;
	
	if (this.configInformation.geo_view_library === Constant.WORLDWIND)
	{
		//this.wwd.drawContext.bindFramebuffer(null);
		//this.wwd.drawContext.bindProgram(wwwCurrentProgram);
		gl.activeTexture(gl.TEXTURE0);
		//gl.bindTexture(gl.TEXTURE_2D, wwwCurrentTexture);
		this.wwd.drawContext.redrawRequested = true;
	}
	
};

/**
 * Selects an object of the current visible objects that's under mouse.
 * @param {GL} gl.
 * @param {int} mouseX Screen x position of the mouse.
 * @param {int} mouseY Screen y position of the mouse.
 * @param {VisibleObjectsControler} visibleObjControlerBuildings Contains the current visible objects clasified by LOD.
 * @returns {Array} resultSelectedArray 
 */
MagoManager.prototype.getSelectedObjects = function(gl, mouseX, mouseY, visibleObjControlerBuildings, resultSelectedArray) 
{
	// Picking render.***
	this.bPicking = false;
	var cameraPosition = this.sceneState.camera.position;

	if (this.selectionFbo === undefined) 
	{ this.selectionFbo = new FBO(gl, this.sceneState.drawingBufferWidth, this.sceneState.drawingBufferHeight); }

	// selection render.
	this.selectionColor.init(); // selection colors manager.***
	
	// picking mode.
	this.selectionCandidateObjectsArray.length = 0; // init.***
	this.selectionCandidateLowestOctreesArray.length = 0; // init.***
	this.selectionCandidateBuildingsArray.length = 0; // init.***
	
	// set byteColor codes for references objects.***
	var alfa = 255;
	var neoBuilding;
	var currentVisibleOctreesControler;
	var currentVisibleLowestOctCount;
	var lowestOctree;
	var availableColor;
	var refsCount;
	var neoRef;
	
	var isInterior = false;
	var renderTexture = false;
	var ssao_idx = -1;
	var minSize = 0.0;
	var refTMatrixIdxKey = 0;
	var glPrimitive = gl.TRIANGLES;
	
	// LOD0 & LOD1 & LOD2.***
	var neoBuildingsCount = visibleObjControlerBuildings.currentVisibles0.length;
	for (var i=0; i<neoBuildingsCount; i++)
	{
		neoBuilding = visibleObjControlerBuildings.currentVisibles0[i];
		currentVisibleOctreesControler = neoBuilding.currentVisibleOctreesControler;
		
		if (currentVisibleOctreesControler === undefined)
		{ continue; }
		
		// LOD0.***
		currentVisibleLowestOctCount = currentVisibleOctreesControler.currentVisibles0.length;
		for (var j=0; j<currentVisibleLowestOctCount; j++)
		{
			lowestOctree = currentVisibleOctreesControler.currentVisibles0[j];
			if (lowestOctree.neoReferencesMotherAndIndices === undefined)
			{ continue; }
			refsCount = lowestOctree.neoReferencesMotherAndIndices.currentVisibleIndices.length;
			for (var k=0; k<refsCount; k++)
			{
				neoRef = neoBuilding.motherNeoReferencesArray[lowestOctree.neoReferencesMotherAndIndices.currentVisibleIndices[k]];
				if (neoRef.selColor4 === undefined)
				{ neoRef.selColor4 = new Color(); }
				
				availableColor = this.selectionColor.getAvailableColor(availableColor);

				neoRef.selColor4.set(availableColor.r, availableColor.g, availableColor.b, alfa);
				this.selectionCandidateObjectsArray.push(neoRef);
				this.selectionCandidateLowestOctreesArray.push(lowestOctree);
				this.selectionCandidateBuildingsArray.push(neoBuilding);
			}
		}
		
		// LOD1.***
		currentVisibleLowestOctCount = currentVisibleOctreesControler.currentVisibles1.length;
		for (var j=0; j<currentVisibleLowestOctCount; j++)
		{
			lowestOctree = currentVisibleOctreesControler.currentVisibles1[j];
			if (lowestOctree.neoReferencesMotherAndIndices === undefined)
			{ continue; }
			refsCount = lowestOctree.neoReferencesMotherAndIndices.currentVisibleIndices.length;
			for (var k=0; k<refsCount; k++)
			{
				neoRef = neoBuilding.motherNeoReferencesArray[lowestOctree.neoReferencesMotherAndIndices.currentVisibleIndices[k]];
				if (neoRef.selColor4 === undefined)
				{ neoRef.selColor4 = new Color(); }
				
				availableColor = this.selectionColor.getAvailableColor(availableColor);

				neoRef.selColor4.set(availableColor.r, availableColor.g, availableColor.b, alfa);
				this.selectionCandidateObjectsArray.push(neoRef);
				this.selectionCandidateLowestOctreesArray.push(lowestOctree);
				this.selectionCandidateBuildingsArray.push(neoBuilding);
			}
		}
		
		// LOD2.***
		currentVisibleLowestOctCount = currentVisibleOctreesControler.currentVisibles2.length;
		for (var j=0; j<currentVisibleLowestOctCount; j++)
		{
			lowestOctree = currentVisibleOctreesControler.currentVisibles2[j];

			if (lowestOctree.lego === undefined)
			{ continue; }

			if (lowestOctree.lego.selColor4 === undefined)
			{ lowestOctree.lego.selColor4 = new Color(); }
			
			availableColor = this.selectionColor.getAvailableColor(availableColor);

			lowestOctree.lego.selColor4.set(availableColor.r, availableColor.g, availableColor.b, alfa);
			this.selectionCandidateObjectsArray.push(undefined);
			this.selectionCandidateLowestOctreesArray.push(lowestOctree);
			this.selectionCandidateBuildingsArray.push(neoBuilding);
		}
	}
	
	neoBuildingsCount = visibleObjControlerBuildings.currentVisibles2.length;
	for (var i=0; i<neoBuildingsCount; i++)
	{
		neoBuilding = visibleObjControlerBuildings.currentVisibles2[i];
		currentVisibleOctreesControler = neoBuilding.currentVisibleOctreesControler;
		if (currentVisibleOctreesControler)
		{
			// LOD2.***
			currentVisibleLowestOctCount = currentVisibleOctreesControler.currentVisibles2.length;
			for (var j=0; j<currentVisibleLowestOctCount; j++)
			{
				lowestOctree = currentVisibleOctreesControler.currentVisibles2[j];

				if (lowestOctree.lego === undefined)
				{ continue; }

				if (lowestOctree.lego.selColor4 === undefined)
				{ lowestOctree.lego.selColor4 = new Color(); }
				
				availableColor = this.selectionColor.getAvailableColor(availableColor);

				lowestOctree.lego.selColor4.set(availableColor.r, availableColor.g, availableColor.b, alfa);
				this.selectionCandidateObjectsArray.push(undefined);
				this.selectionCandidateLowestOctreesArray.push(lowestOctree);
				this.selectionCandidateBuildingsArray.push(neoBuilding);
			}
		}
	}

	// colorSelection render.
	this.selectionFbo.bind(); // framebuffer for color selection.***

	// Set uniforms.***************
	var currentShader = this.postFxShadersManager.pFx_shaders_array[5]; // color selection shader.***
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.depthRange(0, 1);
	gl.clearColor(1, 1, 1, 1); // white background.***
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear buffer.***
	
	gl.disable(gl.CULL_FACE);

	var shaderProgram = currentShader.program;
	gl.useProgram(shaderProgram);
	gl.enableVertexAttribArray(currentShader.position3_loc);

	gl.uniformMatrix4fv(currentShader.modelViewProjectionMatrix4RelToEye_loc, false, this.sceneState.modelViewProjRelToEyeMatrix._floatArrays);
	gl.uniform3fv(currentShader.cameraPosHIGH_loc, this.sceneState.encodedCamPosHigh);
	gl.uniform3fv(currentShader.cameraPosLOW_loc, this.sceneState.encodedCamPosLow);
	
	// do the colorCoding render.***
	var neoBuildingsCount = visibleObjControlerBuildings.currentVisibles0.length;
	for (var i=0; i<neoBuildingsCount; i++)
	{
		neoBuilding = visibleObjControlerBuildings.currentVisibles0[i];
		
		var buildingGeoLocation = neoBuilding.geoLocDataManager.getGeoLocationData(0);
		gl.uniformMatrix4fv(currentShader.buildingRotMatrix_loc, false, buildingGeoLocation.rotMatrix._floatArrays);
		gl.uniform3fv(currentShader.buildingPosHIGH_loc, buildingGeoLocation.positionHIGH);
		gl.uniform3fv(currentShader.buildingPosLOW_loc, buildingGeoLocation.positionLOW);
		
		currentVisibleOctreesControler = neoBuilding.currentVisibleOctreesControler;
		if (currentVisibleOctreesControler === undefined)
		{ continue; }
		
		// LOD0.***
		currentVisibleLowestOctCount = currentVisibleOctreesControler.currentVisibles0.length;
		for (var j=0; j<currentVisibleLowestOctCount; j++)
		{
			lowestOctree = currentVisibleOctreesControler.currentVisibles0[j];
			minSize = 0.0;
			this.renderer.renderNeoRefListsAsimetricVersionColorSelection(gl, lowestOctree.neoReferencesMotherAndIndices, neoBuilding, this, isInterior, currentShader, minSize, refTMatrixIdxKey, glPrimitive);
		}
		
		// LOD1.***
		currentVisibleLowestOctCount = currentVisibleOctreesControler.currentVisibles1.length;
		for (var j=0; j<currentVisibleLowestOctCount; j++)
		{
			lowestOctree = currentVisibleOctreesControler.currentVisibles1[j];
			minSize = 0.0;
			this.renderer.renderNeoRefListsAsimetricVersionColorSelection(gl, lowestOctree.neoReferencesMotherAndIndices, neoBuilding, this, isInterior, currentShader, minSize, refTMatrixIdxKey, glPrimitive);
		}
		
		// LOD2.***
		gl.uniformMatrix4fv(currentShader.RefTransfMatrix, false, buildingGeoLocation.rotMatrix._floatArrays);
		currentVisibleLowestOctCount = currentVisibleOctreesControler.currentVisibles2.length;
		for (var j=0; j<currentVisibleLowestOctCount; j++)
		{
			lowestOctree = currentVisibleOctreesControler.currentVisibles2[j];

			if (lowestOctree.lego === undefined) 
			{
				continue;
			}

			if (lowestOctree.lego.fileLoadState === CODE.fileLoadState.READY) 
			{
				continue;
			}

			if (lowestOctree.lego.fileLoadState === 2) 
			{
				continue;
			}

			gl.uniform1i(currentShader.hasTexture_loc, false); //.***
			gl.uniform4fv(currentShader.color4Aux_loc, [lowestOctree.lego.selColor4.r/255.0, lowestOctree.lego.selColor4.g/255.0, lowestOctree.lego.selColor4.b/255.0, 1.0]);

			gl.uniform1i(currentShader.hasAditionalMov_loc, false);
			gl.uniform3fv(currentShader.aditionalMov_loc, [0.0, 0.0, 0.0]); //.***

			this.renderer.renderLodBuildingColorSelection(gl, lowestOctree.lego, this, currentShader, ssao_idx);
		}
		
	}
	
	var neoBuildingsCount = visibleObjControlerBuildings.currentVisibles2.length;
	for (var i=0; i<neoBuildingsCount; i++)
	{
		neoBuilding = visibleObjControlerBuildings.currentVisibles2[i];
		
		var buildingGeoLocation = neoBuilding.geoLocDataManager.getGeoLocationData(0);
		gl.uniform3fv(currentShader.buildingPosHIGH_loc, buildingGeoLocation.positionHIGH);
		gl.uniform3fv(currentShader.buildingPosLOW_loc, buildingGeoLocation.positionLOW);
		
		currentVisibleOctreesControler = neoBuilding.currentVisibleOctreesControler;
		if (currentVisibleOctreesControler)
		{

			// LOD2.***
			gl.uniformMatrix4fv(currentShader.RefTransfMatrix, false, buildingGeoLocation.rotMatrix._floatArrays);
			currentVisibleLowestOctCount = currentVisibleOctreesControler.currentVisibles2.length;
			for (var j=0; j<currentVisibleLowestOctCount; j++)
			{
				lowestOctree = currentVisibleOctreesControler.currentVisibles2[j];

				if (lowestOctree.lego === undefined) 
				{
					continue;
				}

				if (lowestOctree.lego.fileLoadState === CODE.fileLoadState.READY) 
				{
					continue;
				}

				if (lowestOctree.lego.fileLoadState === 2) 
				{
					continue;
				}

				gl.uniform1i(currentShader.hasTexture_loc, false); //.***
				gl.uniform4fv(currentShader.color4Aux_loc, [lowestOctree.lego.selColor4.r/255.0, lowestOctree.lego.selColor4.g/255.0, lowestOctree.lego.selColor4.b/255.0, 1.0]);

				gl.uniform1i(currentShader.hasAditionalMov_loc, false);
				gl.uniform3fv(currentShader.aditionalMov_loc, [0.0, 0.0, 0.0]); //.***

				this.renderer.renderLodBuildingColorSelection(gl, lowestOctree.lego, this, currentShader, ssao_idx);
			}
		}
	}

	if (currentShader.position3_loc !== -1){ gl.disableVertexAttribArray(currentShader.position3_loc); }
	gl.disableVertexAttribArray(currentShader.position3_loc);

	// Now, read the picked pixel and find the object.*********************************************************
	var pixels = new Uint8Array(4 * 1 * 1); // 4 x 1x1 pixel.***
	gl.readPixels(mouseX, this.sceneState.drawingBufferHeight - mouseY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null); // unbind framebuffer.***

	// now, select the object.***
	var idx = 64516*pixels[0] + 254*pixels[1] + pixels[2];

	var selectedObject = this.selectionCandidateObjectsArray[idx];
	this.selectionCandidateObjectsArray.length = 0;

	var currentOctreeSelected = this.selectionCandidateLowestOctreesArray[idx];
	var currentSelectedBuilding = this.selectionCandidateBuildingsArray[idx];
	this.selectionCandidateLowestOctreesArray.length = 0;
	this.selectionCandidateBuildingsArray.length = 0;

	resultSelectedArray[0] = currentSelectedBuilding;
	resultSelectedArray[1] = currentOctreeSelected;
	resultSelectedArray[2] = selectedObject;
	
	return selectedObject;
};

/**
 * Calculates the direction vector of a ray that starts in the camera position and
 * continues to the pixel position in world space.
 * @param {GL} gl 변수
 * @param {int} pixelX Screen x position of the pixel.
 * @param {int} pixelY Screen y position of the pixel.
 * @returns {Line} resultRay
 */
MagoManager.prototype.getRayWorldSpace = function(gl, pixelX, pixelY, resultRay) 
{
	// in this function the "ray" is a line.***
	if (resultRay === undefined) 
	{ resultRay = new Line(); }
	
	// world ray = camPos + lambda*camDir.
	var camPos = this.sceneState.camera.position;
	var rayCamSpace = new Float32Array(3);
	rayCamSpace = this.getRayCamSpace(gl, pixelX, pixelY, rayCamSpace);
	
	if (this.pointSC === undefined)
	{ this.pointSC = new Point3D(); }
	
	this.pointSC.set(rayCamSpace[0], rayCamSpace[1], rayCamSpace[2]);

	// now, must transform this posCamCoord to world coord.***
	this.pointSC2 = this.sceneState.modelViewMatrixInv.rotatePoint3D(this.pointSC, this.pointSC2); // rayWorldSpace.***
	this.pointSC2.unitary(); // rayWorldSpace.***
	resultRay.setPointAndDir(camPos.x, camPos.y, camPos.z,       this.pointSC2.x, this.pointSC2.y, this.pointSC2.z);// original.***

	return resultRay;
};

/**
 * Calculates the direction vector of a ray that starts in the camera position and
 * continues to the pixel position in camera space.
 * @param {GL} gl 변수
 * @param {int} pixelX Screen x position of the pixel.
 * @param {int} pixelY Screen y position of the pixel.
 * @returns {Float32Array(3)} resultRay Result of the calculation.
 */
MagoManager.prototype.getRayCamSpace = function(gl, pixelX, pixelY, resultRay) 
{
	// in this function "ray" is a vector.***
	var frustum_far = 1.0; // unitary frustum far.***
	var fov = this.sceneState.camera.frustum.fovyRad;
	var aspectRatio = this.sceneState.camera.frustum.aspectRatio;

	var hfar = 2.0 * Math.tan(fov/2.0) * frustum_far;
	var wfar = hfar * aspectRatio;
	var mouseX = pixelX;
	var mouseY = this.sceneState.drawingBufferHeight - pixelY;
	if (resultRay === undefined) 
	{ resultRay = new Float32Array(3); }
	resultRay[0] = wfar*((mouseX/this.sceneState.drawingBufferWidth) - 0.5);
	resultRay[1] = hfar*((mouseY/this.sceneState.drawingBufferHeight) - 0.5);
	resultRay[2] = - frustum_far;
	return resultRay;
};

/**
 * Calculates the plane on move an object.
 * @param {GL} gl 변수
 * @param {int} pixelX Screen x position of the pixel.
 * @param {int} pixelY Screen y position of the pixel.
 * @return {Plane} resultSelObjMovePlane Calculated plane.
 */
MagoManager.prototype.calculateSelObjMovePlaneAsimetricMode = function(gl, pixelX, pixelY, resultSelObjMovePlane) 
{
	if (this.pointSC === undefined)
	{ this.pointSC = new Point3D(); }
	
	if (this.pointSC2 === undefined)
	{ this.pointSC2 = new Point3D(); }
	
	this.calculatePixelPositionWorldCoord(gl, this.mouse_x, this.mouse_y, this.pointSC2);
	var buildingGeoLocation = this.buildingSelected.geoLocDataManager.getGeoLocationData(0);
	this.pointSC = buildingGeoLocation.tMatrixInv.transformPoint3D(this.pointSC2, this.pointSC); // buildingSpacePoint.***

	if (resultSelObjMovePlane === undefined)
	{ resultSelObjMovePlane = new Plane(); }
	// the plane is in world coord.***
	resultSelObjMovePlane.setPointAndNormal(this.pointSC.x, this.pointSC.y, this.pointSC.z, 0.0, 0.0, 1.0);
	return resultSelObjMovePlane;
};

/**
 * Calculates the pixel position in camera coordinates.
 * @param {GL} gl 변수
 * @param {int} pixelX Screen x position of the pixel.
 * @param {int} pixelY Screen y position of the pixel.
 * @param {Point3D} resultPixelPos The result of the calculation.
 * @return {Point3D} resultPixelPos The result of the calculation.
 */
MagoManager.prototype.calculatePixelPositionCamCoord = function(gl, pixelX, pixelY, resultPixelPos) 
{
	// depth render.
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.depthRange(0, 1);
	gl.frontFace(gl.CCW);

	var current_frustum_near = this.sceneState.camera.frustum.near;
	var current_frustum_far = this.sceneState.camera.frustum.far;

	// framebuffer for color selection.
	if (this.selectionFbo === undefined) 
	{ this.selectionFbo = new FBO(gl, this.sceneState.drawingBufferWidth, this.sceneState.drawingBufferHeight); }
	this.selectionFbo.bind(); 

	gl.clearColor(1, 1, 1, 1); // white background.***
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear buffer.***
	gl.disable(gl.BLEND);
	var ssao_idx = 0;
	this.depthRenderLowestOctreeAsimetricVersion(gl, ssao_idx, this.visibleObjControlerBuildings);

	// Now, read the pixel and find the pixel position.
	var depthPixels = new Uint8Array(4 * 1 * 1); // 4 x 1x1 pixel.***
	gl.readPixels(pixelX, this.sceneState.drawingBufferHeight - pixelY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, depthPixels);
	var zDepth = depthPixels[0]/(256.0*256.0*256.0) + depthPixels[1]/(256.0*256.0) + depthPixels[2]/256.0 + depthPixels[3]; // 0 to 256 range depth.***
	zDepth /= 256.0; // convert to 0 to 1.0 range depth.***
	var realZDepth = zDepth*current_frustum_far;

	// now, find the 3d position of the pixel in camCoord.****
	this.resultRaySC = this.getRayCamSpace(gl, pixelX, pixelY, this.resultRaySC);
	if (resultPixelPos === undefined)
	{ resultPixelPos = new Point3D(); }
	
	resultPixelPos.set(this.resultRaySC[0] * realZDepth, this.resultRaySC[1] * realZDepth, this.resultRaySC[2] * realZDepth);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	return resultPixelPos;
};

/**
 * Calculates the pixel position in world coordinates.
 * @param {GL} gl 변수
 * @param {int} pixelX Screen x position of the pixel.
 * @param {int} pixelY Screen y position of the pixel.
 * @param {Point3D} resultPixelPos The result of the calculation.
 * @return {Point3D} resultPixelPos The result of the calculation.
 */
MagoManager.prototype.calculatePixelPositionWorldCoord = function(gl, pixelX, pixelY, resultPixelPos) 
{
	var pixelPosCamCoord = new Point3D();
	pixelPosCamCoord = this.calculatePixelPositionCamCoord(gl, pixelX, pixelY, pixelPosCamCoord);

	// now, must transform this pixelCamCoord to world coord.***
	var mv_inv = this.sceneState.modelViewMatrixInv;
	if (resultPixelPos === undefined)
	{ var resultPixelPos = new Point3D(); }
	resultPixelPos = mv_inv.transformPoint3D(pixelPosCamCoord, resultPixelPos);
	return resultPixelPos;
};

/**
 * 드래그 여부 판단
 * 
 * @returns {Boolean} 드래그 여부
 */
MagoManager.prototype.isDragging = function() 
{
	// test function.***
	var gl = this.sceneState.gl;

	if (this.magoPolicy.mouseMoveMode === CODE.moveMode.ALL)	// Moving all
	{
		this.arrayAuxSC.length = 0;
		var current_objectSelected = this.getSelectedObjects(gl, this.mouse_x, this.mouse_y, this.visibleObjControlerBuildings, this.arrayAuxSC);
		var currentBuildingSelected = this.arrayAuxSC[0];
		this.arrayAuxSC.length = 0;

		if (currentBuildingSelected === this.buildingSelected) 
		{
			return true;
		}
		else 
		{
			return false;
		}
	}
	else if (this.magoPolicy.mouseMoveMode === CODE.moveMode.OBJECT) // Moving object
	{
		this.arrayAuxSC.length = 0;
		var current_objectSelected = this.getSelectedObjects(gl, this.mouse_x, this.mouse_y, this.visibleObjControlerBuildings, this.arrayAuxSC);
		this.arrayAuxSC.length = 0;

		if (current_objectSelected === this.objectSelected) 
		{
			return true;
		}
		else 
		{
			return false;
		}
	}
	else
	{
		return false;
	}

};

/**
 * 카메라 motion 활성 또는 비활성
 * 
 * @param {Boolean} state 카메라 모션 활성화 여부
 */
MagoManager.prototype.setCameraMotion = function(state)
{
	if (this.configInformation.geo_view_library === Constant.WORLDWIND)
	{
		this.wwd.navigator.panRecognizer.enable = state;
	}
	else if (this.configInformation.geo_view_library === Constant.CESIUM)
	{
		this.scene.screenSpaceCameraController.enableRotate = state;
		this.scene.screenSpaceCameraController.enableZoom = state;
		this.scene.screenSpaceCameraController.enableLook = state;
		this.scene.screenSpaceCameraController.enableTilt = state;
		this.scene.screenSpaceCameraController.enableTranslate = state;
	}
};

/**
 * 선택 객체를 asimetric mode 로 이동
 * @param gl 변수
 * @param scene 변수
 * @param renderables_neoRefLists_array 변수
 */
MagoManager.prototype.manageMouseMove = function(mouseX, mouseY) 
{

	if (this.configInformation.geo_view_library === Constant.CESIUM)
	{
		// distinguish 2 modes.******************************************************
		if (this.magoPolicy.mouseMoveMode === CODE.moveMode.ALL) // blocks move.***
		{
			if (this.buildingSelected !== undefined) 
			{
				// move the selected object.***
				this.mouse_x = mouseX;
				this.mouse_y = mouseY;

				// 1rst, check if there are objects to move.***
				if (this.mustCheckIfDragging) 
				{
					if (this.isDragging()) 
					{
						this.mouseDragging = true;
						this.setCameraMotion(false);
					}
					this.mustCheckIfDragging = false;
				}
			}
			else 
			{
				this.isCameraMoving = true; // if no object is selected.***
			}
		}
		else if (this.magoPolicy.mouseMoveMode === CODE.moveMode.OBJECT) // objects move.***
		{
			if (this.objectSelected !== undefined) 
			{
				// move the selected object.***
				this.mouse_x = mouseX;
				this.mouse_y = mouseY;

				// 1rst, check if there are objects to move.***
				if (this.mustCheckIfDragging) 
				{
					if (this.isDragging()) 
					{
						this.mouseDragging = true;
						this.setCameraMotion(false);
					}
					this.mustCheckIfDragging = false;
				}
			}
			else 
			{
				this.isCameraMoving = true; // if no object is selected.***
			}
		}
		//---------------------------------------------------------------------------------
		this.isCameraMoving = true; // test.***
		if (this.mouseDragging) 
		{
			this.moveSelectedObjectAsimetricMode(this.sceneState.gl);
		}

	}
	else if (this.configInformation.geo_view_library === Constant.WORLDWIND)
	{
		;//
	}
};


/**
 * Moves an object.
 * @param {GL} gl 변수
 */
MagoManager.prototype.moveSelectedObjectAsimetricMode = function(gl) 
{
	var cameraPosition = this.sceneState.camera.position;
	if (this.magoPolicy.mouseMoveMode === CODE.moveMode.ALL) // buildings move.***
	{
		if (this.buildingSelected === undefined)
		{ return; }

		// create a XY_plane in the selected_pixel_position.***
		if (this.selObjMovePlane === undefined) 
		{
			var currentRenderingFase = this.renderingFase;
			this.renderingFase = -1;
			this.selObjMovePlane = new Plane();
			// create a local XY plane.
			this.selObjMovePlane.setPointAndNormal(0.0, 0.0, 0.0,    0.0, 0.0, 1.0); 
			// selObjMovePlane is a tangent plane to globe in the selected point.
			this.renderingFase = currentRenderingFase;
		}

		if (this.lineSC === undefined)
		{ this.lineSC = new Line(); }
		
		this.lineSC = this.getRayWorldSpace(gl, this.mouse_x, this.mouse_y, this.lineSC); // rayWorldSpace.***

		// transform world_ray to building_ray.***
		var camPosBuilding = new Point3D();
		var camDirBuilding = new Point3D();
		
		var buildingGeoLocation = this.buildingSelected.geoLocDataManager.getGeoLocationData(0);
		camPosBuilding = buildingGeoLocation.geoLocMatrixInv.transformPoint3D(this.lineSC.point, camPosBuilding);
		this.pointSC = buildingGeoLocation.geoLocMatrixInv.rotatePoint3D(this.lineSC.direction, this.pointSC);
		camDirBuilding.x = this.pointSC.x;
		camDirBuilding.y = this.pointSC.y;
		camDirBuilding.z = this.pointSC.z;

		// now, intersect building_ray with the selObjMovePlane.***
		var line = new Line();
		line.setPointAndDir(camPosBuilding.x, camPosBuilding.y, camPosBuilding.z,       camDirBuilding.x, camDirBuilding.y, camDirBuilding.z);

		var intersectionPoint = new Point3D();
		intersectionPoint = this.selObjMovePlane.intersectionLine(line, intersectionPoint);
		intersectionPoint.set(-intersectionPoint.x, -intersectionPoint.y, -intersectionPoint.z);
		
		if (this.pointSC === undefined)
		{ this.pointSC = new Point3D(); }
		this.pointSC = buildingGeoLocation.geoLocMatrix.transformPoint3D(intersectionPoint, this.pointSC);
		intersectionPoint.set(this.pointSC.x, this.pointSC.y, this.pointSC.z);

		// register the movement.***
		if (this.buildingSelected.moveVector === undefined)
		{ this.buildingSelected.moveVector = new Point3D(); }

		if (!this.thereAreStartMovePoint) 
		{
			var cartographic = ManagerUtils.pointToGeographicCoord(intersectionPoint, cartographic, this);
			this.startMovPoint.x = cartographic.longitude;
			this.startMovPoint.y = cartographic.latitude;
			this.thereAreStartMovePoint = true;
		}
		else 
		{
			var cartographic = ManagerUtils.pointToGeographicCoord(intersectionPoint, cartographic, this);
			this.pointSC.x = cartographic.longitude;
			this.pointSC.y = cartographic.latitude;
			var difX = this.pointSC.x - this.startMovPoint.x;
			var difY = this.pointSC.y - this.startMovPoint.y;

			var geoLocationData;
			geoLocationData = this.buildingSelected.geoLocDataManager.geoLocationDataArray[0];
			var newLongitude = geoLocationData.geographicCoord.longitude - difX;
			var newlatitude = geoLocationData.geographicCoord.latitude - difY;
			var newHeight = cartographic.height;

			this.changeLocationAndRotation(this.buildingSelected.buildingId, newlatitude, newLongitude, undefined, undefined, undefined, undefined);
			this.displayLocationAndRotation(this.buildingSelected);
			
			this.startMovPoint.x -= difX;
			this.startMovPoint.y -= difY;
		}
	}
	else if (this.magoPolicy.mouseMoveMode === CODE.moveMode.OBJECT) // objects move.***
	{
		if (this.objectSelected === undefined)
		{ return; }

		// create a XY_plane in the selected_pixel_position.***
		if (this.selObjMovePlane === undefined) 
		{
			var currentRenderingFase = this.renderingFase;
			this.renderingFase = -1;
			this.selObjMovePlane = this.calculateSelObjMovePlaneAsimetricMode(gl, this.mouse_x, this.mouse_y, this.selObjMovePlane);
			this.renderingFase = currentRenderingFase;
		}

		// world ray = camPos + lambda*camDir.***
		if (this.lineSC === undefined)
		{ this.lineSC = new Line(); }
		
		this.getRayWorldSpace(gl, this.mouse_x, this.mouse_y, this.lineSC); // rayWorldSpace.***
		var buildingGeoLocation = this.buildingSelected.geoLocDataManager.getGeoLocationData(0);
		var camPosBuilding = new Point3D();
		var camDirBuilding = new Point3D();
		camPosBuilding = buildingGeoLocation.tMatrixInv.transformPoint3D(this.lineSC.point, camPosBuilding);
		camDirBuilding = buildingGeoLocation.tMatrixInv.rotatePoint3D(this.lineSC.direction, camDirBuilding);
	
		// now, intersect building_ray with the selObjMovePlane.***
		var line = new Line();
		line.setPointAndDir(camPosBuilding.x, camPosBuilding.y, camPosBuilding.z,       camDirBuilding.x, camDirBuilding.y, camDirBuilding.z);// original.***

		var intersectionPoint = new Point3D();
		intersectionPoint = this.selObjMovePlane.intersectionLine(line, intersectionPoint);

		//the movement of an object must multiply by buildingRotMatrix.***
		var transformedIntersectPoint = new Point3D();
		transformedIntersectPoint = buildingGeoLocation.tMatrix.rotatePoint3D(intersectionPoint, transformedIntersectPoint); 
		intersectionPoint.x = transformedIntersectPoint.x;
		intersectionPoint.y = transformedIntersectPoint.y;
		intersectionPoint.z = transformedIntersectPoint.z;

		// register the movement.***
		if (this.objectSelected.moveVector === undefined)
		{ this.objectSelected.moveVector = new Point3D(); }

		if (!this.thereAreStartMovePoint) 
		{

			this.startMovPoint = intersectionPoint;
			this.startMovPoint.add(-this.objectSelected.moveVector.x, -this.objectSelected.moveVector.y, -this.objectSelected.moveVector.z);
			this.thereAreStartMovePoint = true;
		}
		else 
		{
			var difX = intersectionPoint.x - this.startMovPoint.x;
			var difY = intersectionPoint.y - this.startMovPoint.y;
			var difZ = intersectionPoint.z - this.startMovPoint.z;

			this.objectSelected.moveVector.set(difX, difY, difZ);
		}
	}
};

/**
 * Moves an object.
 * @param {GL} gl 변수
 */
MagoManager.prototype.moveSelectedObjectAsimetricMode_current = function(gl) 
{
	var cameraPosition = this.sceneState.camera.position;
	if (this.magoPolicy.mouseMoveMode === CODE.moveMode.ALL) // buildings move.***
	{
		if (this.buildingSelected === undefined)
		{ return; }

		// create a XY_plane in the selected_pixel_position.***
		if (this.selObjMovePlane === undefined) 
		{
			var currentRenderingFase = this.renderingFase;
			this.renderingFase = -1;
			this.selObjMovePlane = this.calculateSelObjMovePlaneAsimetricMode(gl, this.mouse_x, this.mouse_y, this.selObjMovePlane);
			this.renderingFase = currentRenderingFase;
		}

		if (this.lineSC === undefined)
		{ this.lineSC = new Line(); }
		
		this.lineSC = this.getRayWorldSpace(gl, this.mouse_x, this.mouse_y, this.lineSC); // rayWorldSpace.***

		// transform world_ray to building_ray.***
		var camPosBuilding = new Point3D();
		var camDirBuilding = new Point3D();
		
		var buildingGeoLocation = this.buildingSelected.geoLocDataManager.getGeoLocationData(0);
		camPosBuilding = buildingGeoLocation.geoLocMatrixInv.transformPoint3D(this.lineSC.point, camPosBuilding);
		this.pointSC = buildingGeoLocation.geoLocMatrixInv.rotatePoint3D(this.lineSC.direction, this.pointSC);
		camDirBuilding.x = this.pointSC.x;
		camDirBuilding.y = this.pointSC.y;
		camDirBuilding.z = this.pointSC.z;

		// now, intersect building_ray with the selObjMovePlane.***
		var line = new Line();
		line.setPointAndDir(camPosBuilding.x, camPosBuilding.y, camPosBuilding.z,       camDirBuilding.x, camDirBuilding.y, camDirBuilding.z);

		var intersectionPoint = new Point3D();
		intersectionPoint = this.selObjMovePlane.intersectionLine(line, intersectionPoint);
		intersectionPoint.set(-intersectionPoint.x, -intersectionPoint.y, -intersectionPoint.z);

		// register the movement.***
		if (this.buildingSelected.moveVector === undefined)
		{ this.buildingSelected.moveVector = new Point3D(); }

		if (!this.thereAreStartMovePoint) 
		{
			this.startMovPoint = intersectionPoint;
			this.thereAreStartMovePoint = true;
		}
		else 
		{
			var difX = intersectionPoint.x - this.startMovPoint.x;
			var difY = intersectionPoint.y - this.startMovPoint.y;
			var difZ = intersectionPoint.z - this.startMovPoint.z;

			this.buildingSelected.moveVector.set(difX, difY, difZ);
			
			var geoLocationData;
			geoLocationData = this.buildingSelected.geoLocDataManager.geoLocationDataArray[0];

			// test.*** see the cartographic values of the intersected point.***
			var newPosition = new Point3D();

			newPosition.add(difX, difY, difZ);
			newPosition.add(geoLocationData.pivotPoint.x, geoLocationData.pivotPoint.y, geoLocationData.pivotPoint.z);

			//var cartographic = Cesium.Ellipsoid.cartesianToCartographic(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z);
			var cartographic = Cesium.Cartographic.fromCartesian(new Cesium.Cartesian3(newPosition.x, newPosition.y, newPosition.z));
			var newLongitude = cartographic.longitude * (180.0/Math.PI);
			var newlatitude = cartographic.latitude * (180.0/Math.PI);
			var newHeight = cartographic.height;

			this.changeLocationAndRotation(this.buildingSelected.buildingId, newlatitude, newLongitude, undefined, undefined, undefined, undefined);
			this.displayLocationAndRotation(this.buildingSelected);
			//this.selectedObjectNotice(this.buildingSelected);
		}
	}
	else if (this.magoPolicy.mouseMoveMode === CODE.moveMode.OBJECT) // objects move.***
	{
		if (this.objectSelected === undefined)
		{ return; }

		// create a XY_plane in the selected_pixel_position.***
		if (this.selObjMovePlane === undefined) 
		{
			var currentRenderingFase = this.renderingFase;
			this.renderingFase = -1;
			this.selObjMovePlane = this.calculateSelObjMovePlaneAsimetricMode(gl, this.mouse_x, this.mouse_y, this.selObjMovePlane);
			this.renderingFase = currentRenderingFase;
		}

		// world ray = camPos + lambda*camDir.***
		if (this.lineSC === undefined)
		{ this.lineSC = new Line(); }
		
		this.getRayWorldSpace(gl, this.mouse_x, this.mouse_y, this.lineSC); // rayWorldSpace.***
		var buildingGeoLocation = this.buildingSelected.geoLocDataManager.getGeoLocationData(0);
		var camPosBuilding = new Point3D();
		var camDirBuilding = new Point3D();
		camPosBuilding = buildingGeoLocation.tMatrixInv.transformPoint3D(this.lineSC.point, camPosBuilding);
		camDirBuilding = buildingGeoLocation.rotMatrixInv.transformPoint3D(this.lineSC.direction, camDirBuilding);
	
		// now, intersect building_ray with the selObjMovePlane.***
		var line = new Line();
		line.setPointAndDir(camPosBuilding.x, camPosBuilding.y, camPosBuilding.z,       camDirBuilding.x, camDirBuilding.y, camDirBuilding.z);// original.***

		var intersectionPoint = new Point3D();
		intersectionPoint = this.selObjMovePlane.intersectionLine(line, intersectionPoint);

		//the movement of an object must multiply by buildingRotMatrix.***
		var transformedIntersectPoint = new Point3D();
		transformedIntersectPoint = buildingGeoLocation.rotMatrix.transformPoint3D(intersectionPoint, transformedIntersectPoint); 
		intersectionPoint.x = transformedIntersectPoint.x;
		intersectionPoint.y = transformedIntersectPoint.y;
		intersectionPoint.z = transformedIntersectPoint.z;

		// register the movement.***
		if (this.objectSelected.moveVector === undefined)
		{ this.objectSelected.moveVector = new Point3D(); }

		if (!this.thereAreStartMovePoint) 
		{
			this.startMovPoint = intersectionPoint;
			this.startMovPoint.add(-this.objectSelected.moveVector.x, -this.objectSelected.moveVector.y, -this.objectSelected.moveVector.z);
			this.thereAreStartMovePoint = true;
		}
		else 
		{
			var difX = intersectionPoint.x - this.startMovPoint.x;
			var difY = intersectionPoint.y - this.startMovPoint.y;
			var difZ = intersectionPoint.z - this.startMovPoint.z;

			this.objectSelected.moveVector.set(difX, difY, difZ);
		}
	}
};

/**
 * Frustum 안의 VisibleOctree 를 검색하여 currentVisibleOctreesControler 를 준비
 * 
 * @param {any} gl 
 * @param {any} scene 
 * @param {any} neoBuilding 
 * @param {VisibleObjectsController} visibleObjControlerOctrees 
 * @param {any} visibleObjControlerOctreesAux 
 * @param {any} lod 
 */
MagoManager.prototype.getRenderablesDetailedNeoBuildingAsimetricVersion = function(gl, scene, neoBuilding, visibleObjControlerOctrees, visibleObjControlerOctreesAux, lod) 
{
	if (neoBuilding === undefined || neoBuilding.octree === undefined) { return; }
	
	if (neoBuilding.buildingId == "U310T")
	{ var hola = 0; }

	neoBuilding.currentRenderablesNeoRefLists.length = 0;

	var buildingGeoLocation = neoBuilding.geoLocDataManager.getGeoLocationData(0);

	if (neoBuilding.currentVisibleOctreesControler === undefined)
	{
		neoBuilding.currentVisibleOctreesControler = new VisibleObjectsController();
	}	

	if (this.myFrustumSC === undefined) 
	{
		this.myFrustumSC = new Frustum();
	}

	if (lod === 0 || lod === 1 || lod === 2)
	{
		var squaredDistLod0 = 500;
		var squaredDistLod1 = 12000;
		var squaredDistLod2 = 500000*1000;
		
		//squaredDistLod0 = 300;
		//squaredDistLod1 = 1000;
		//squaredDistLod2 = 500000*1000;
		
		if (neoBuilding.buildingId === "Sea_Port" || neoBuilding.buildingId === "ctships")
		{
			squaredDistLod0 = 120000;
			squaredDistLod1 = 285000;
			squaredDistLod2 = 500000*1000;
		}

		var frustumVolume;
		var find = false;
			
		if (this.configInformation.geo_view_library === Constant.WORLDWIND)
		{
			if (this.myCameraSC === undefined) 
			{ this.myCameraSC = new Camera(); }
			
			if (this.myCameraSC2 === undefined) 
			{ this.myCameraSC2 = new Camera(); }
			
			var cameraPosition = this.sceneState.dc.navigatorState.eyePoint;
			this.myCameraSC2.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
			buildingGeoLocation = neoBuilding.geoLocDataManager.getGeoLocationData(0);
			this.myCameraSC = buildingGeoLocation.getTransformedRelativeCamera(this.myCameraSC2, this.myCameraSC);
			var isCameraInsideOfBuilding = neoBuilding.isCameraInsideOfBuilding(this.myCameraSC.position.x, this.myCameraSC.position.y, this.myCameraSC.position.z);

			if (this.myBboxSC === undefined)
			{ this.myBboxSC = new BoundingBox(); }
			
			if (this.myCullingVolumeBBoxSC === undefined)
			{ this.myCullingVolumeBBoxSC = new BoundingBox(); }
			
			// Provisionally use a bbox to frustumCulling.***
			var radiusAprox = 4000.0;
			this.myCullingVolumeBBoxSC.minX = this.myCameraSC.position.x - radiusAprox;
			this.myCullingVolumeBBoxSC.maxX = this.myCameraSC.position.x + radiusAprox;
			this.myCullingVolumeBBoxSC.minY = this.myCameraSC.position.y - radiusAprox;
			this.myCullingVolumeBBoxSC.maxY = this.myCameraSC.position.y + radiusAprox;
			this.myCullingVolumeBBoxSC.minZ = this.myCameraSC.position.z - radiusAprox;
			this.myCullingVolumeBBoxSC.maxZ = this.myCameraSC.position.z + radiusAprox;
			
			
			// get frustumCulled lowestOctrees classified by distances.************************************************************************************
			neoBuilding.currentVisibleOctreesControler.currentVisibles0.length = 0;
			neoBuilding.currentVisibleOctreesControler.currentVisibles1.length = 0;
			neoBuilding.currentVisibleOctreesControler.currentVisibles2.length = 0;
			neoBuilding.currentVisibleOctreesControler.currentVisibles3.length = 0;
			find = neoBuilding.octree.getBBoxIntersectedLowestOctreesByLOD(	this.myCullingVolumeBBoxSC, neoBuilding.currentVisibleOctreesControler, visibleObjControlerOctrees, this.myBboxSC,
				this.myCameraSC.position.x, this.myCameraSC.position.y, this.myCameraSC.position.z,
				squaredDistLod0, squaredDistLod1, squaredDistLod2);
			// End provisional.----------------------------------------------------------------																		
		}
		else if (this.configInformation.geo_view_library === Constant.CESIUM)
		{
			if (this.myCameraSC === undefined) 
			{ this.myCameraSC = new Cesium.Camera(scene); }
			
			var camera = scene.frameState.camera;
			var near = scene._frustumCommandsList[this.frustumIdx].near;
			var far = scene._frustumCommandsList[this.frustumIdx].far;
			var fov = scene.frameState.camera.frustum.fov;
			this.myCameraSC.frustum.fov = fov; // fov = fovx.***
			this.myCameraSC = buildingGeoLocation.getTransformedRelativeCamera(camera, this.myCameraSC);
			
			var isCameraInsideOfBuilding = neoBuilding.isCameraInsideOfBuilding(this.myCameraSC.position.x, this.myCameraSC.position.y, this.myCameraSC.position.z);

			//this.myCameraSC.frustum.fovy = 0.3;
			//camera.frustum.far = 2.0;
			this.myCameraSC.near = near;
			this.myCameraSC.far = far;
			var frustumVolume = this.myCameraSC.frustum.computeCullingVolume(this.myCameraSC.position, this.myCameraSC.direction, this.myCameraSC.up);

			for (var i=0, length = frustumVolume.planes.length; i<length; i++)
			{
				var plane = frustumVolume.planes[i];
				this.myFrustumSC.planesArray[i].setNormalAndDistance(plane.x, plane.y, plane.z, plane.w);
			}
			
			neoBuilding.currentVisibleOctreesControler.currentVisibles0 = [];
			neoBuilding.currentVisibleOctreesControler.currentVisibles1 = [];
			neoBuilding.currentVisibleOctreesControler.currentVisibles2 = [];
			neoBuilding.currentVisibleOctreesControler.currentVisibles3 = [];
			
			if (lod === 2)
			{
				neoBuilding.octree.extractLowestOctreesByLOD(neoBuilding.currentVisibleOctreesControler, visibleObjControlerOctrees, this.boundingSphere_Aux,
					this.myCameraSC.position.x, this.myCameraSC.position.y, this.myCameraSC.position.z,
					squaredDistLod0, squaredDistLod1, squaredDistLod2);
				find = true;
			}
			else 
			{
				find = neoBuilding.octree.getFrustumVisibleLowestOctreesByLOD(	this.myFrustumSC, neoBuilding.currentVisibleOctreesControler, visibleObjControlerOctrees, this.boundingSphere_Aux,
					this.myCameraSC.position.x, this.myCameraSC.position.y, this.myCameraSC.position.z,
					squaredDistLod0, squaredDistLod1, squaredDistLod2);
			}
		}

		if (!find) 
		{
			//this.deleteNeoBuilding(this.sceneState.gl, neoBuilding);
			this.processQueue.buildingsToDelete.push(neoBuilding);
			return;
		}
	}
	else
	{
		// no enter here...
		neoBuilding.currentVisibleOctreesControler.currentVisibles2.length = 0;
		neoBuilding.octree.extractLowestOctreesIfHasTriPolyhedrons(neoBuilding.currentVisibleOctreesControler.currentVisibles2); // old.
	}
	
	// LOD0 & LOD1
	// Check if the lod0lowestOctrees, lod1lowestOctrees must load and parse data
	var lowestOctree;
	var currentVisibleOctrees = [].concat(neoBuilding.currentVisibleOctreesControler.currentVisibles0, neoBuilding.currentVisibleOctreesControler.currentVisibles1);

	for (var i=0, length = currentVisibleOctrees.length; i<length; i++) 
	{
		lowestOctree = currentVisibleOctrees[i];
		if (lowestOctree.triPolyhedronsCount === 0) 
		{ continue; }

		if (lowestOctree.neoReferencesMotherAndIndices === undefined)
		{
			lowestOctree.neoReferencesMotherAndIndices = new NeoReferencesMotherAndIndices();
			lowestOctree.neoReferencesMotherAndIndices.motherNeoRefsList = neoBuilding.motherNeoReferencesArray;
		}
		else
		{
			var isExterior = !isCameraInsideOfBuilding;
			lowestOctree.neoReferencesMotherAndIndices.updateCurrentVisibleIndices(isExterior, this.myCameraSC.position.x, this.myCameraSC.position.y, this.myCameraSC.position.z);
		}
		
		// if the octree has no blocks list ready, then render the lego
		var myBlocksList = lowestOctree.neoReferencesMotherAndIndices.blocksList;
		if (myBlocksList === undefined || myBlocksList.fileLoadState !== CODE.fileLoadState.PARSE_FINISHED)
		{
			neoBuilding.currentVisibleOctreesControler.currentVisibles2.push(lowestOctree);
		}
	}
	currentVisibleOctrees.length = 0;
};

/**
 * LOD0, LOD1 에 대한 F4D ModelData, ReferenceData 를 요청
 * 
 * @param {any} gl 
 * @param {any} scene 
 * @param {any} neoBuilding 
 */
MagoManager.prototype.manageQueue = function() 
{
	// first, delete buildings.
	var maxDeleteBuildingsCount = 20;
	var buildingsToDeleteCount = this.processQueue.buildingsToDelete.length;
	if (buildingsToDeleteCount < maxDeleteBuildingsCount)
	{ maxDeleteBuildingsCount = buildingsToDeleteCount; }
	
	var neoBuilding;
	
	for (var i=0; i<maxDeleteBuildingsCount; i++)
	{
		neoBuilding = this.processQueue.buildingsToDelete.shift();
		this.deleteNeoBuilding(this.sceneState.gl, neoBuilding);
	}
	
	// parse pendent data.
	var maxParsesCount = 10;
	
	// references lod0 & lod 1.
	toParseCount = this.parseQueue.octreesLod0ReferencesToParseArray.length;
	if (toParseCount < maxParsesCount)
	{ maxParsesCount = toParseCount; }
	
	var lowestOctree;
	var neoBuilding;
	var gl = this.sceneState.gl;
	if (this.matrix4SC == undefined)
	{ this.matrix4SC = new Matrix4(); }
	
	for (var i=0; i<maxParsesCount; i++)
	{
		lowestOctree = this.parseQueue.octreesLod0ReferencesToParseArray.shift();
		
		if (lowestOctree.neoReferencesMotherAndIndices == undefined)
		{ continue; }
		
		if (lowestOctree.neoReferencesMotherAndIndices.dataArraybuffer == undefined)
		{ continue; }
		
		neoBuilding = lowestOctree.neoBuildingOwner;
		var buildingGeoLocation = neoBuilding.geoLocDataManager.getGeoLocationData(0);
		this.matrix4SC.setByFloat32Array(buildingGeoLocation.rotMatrix._floatArrays);
		lowestOctree.neoReferencesMotherAndIndices.parseArrayBufferReferences(gl, lowestOctree.neoReferencesMotherAndIndices.dataArraybuffer, this.readerWriter, neoBuilding.motherNeoReferencesArray, this.matrix4SC, this);
		lowestOctree.neoReferencesMotherAndIndices.multiplyKeyTransformMatrix(0, buildingGeoLocation.rotMatrix);
		lowestOctree.neoReferencesMotherAndIndices.dataArraybuffer = undefined;
	}
	
	// models lod0 & lod1.
	maxParsesCount = 10;
	var toParseCount = this.parseQueue.octreesLod0ModelsToParseArray.length;
	if (toParseCount < maxParsesCount)
	{ maxParsesCount = toParseCount; }
	
	for (var i=0; i<maxParsesCount; i++)
	{
		lowestOctree = this.parseQueue.octreesLod0ModelsToParseArray.shift();
		
		if (lowestOctree.neoReferencesMotherAndIndices == undefined)
		{ continue; }
		
		var blocksList = lowestOctree.neoReferencesMotherAndIndices.blocksList;
		if (blocksList.dataArraybuffer == undefined)
		{ continue; }
		
		neoBuilding = lowestOctree.neoBuildingOwner;
		blocksList.parseBlocksList(blocksList.dataArraybuffer, this.readerWriter, neoBuilding.motherBlocksArray, this);
		blocksList.dataArraybuffer = undefined;
	}
	
	// lego lod2.
	maxParsesCount = 10;
	var toParseCount = this.parseQueue.octreesLod2LegosToParseArray.length;
	if (toParseCount < maxParsesCount)
	{ maxParsesCount = toParseCount; }
	
	for (var i=0; i<maxParsesCount; i++)
	{
		lowestOctree = this.parseQueue.octreesLod2LegosToParseArray.shift();
		if (lowestOctree.lego == undefined)
		{ continue; }
		
		lowestOctree.lego.parseArrayBuffer(gl, lowestOctree.lego.dataArrayBuffer, this);
		lowestOctree.lego.dataArrayBuffer = undefined;
	}
};

/**
 * LOD0, LOD1 에 대한 F4D ModelData, ReferenceData 를 요청
 * 
 * @param {any} gl 
 * @param {any} scene 
 * @param {any} neoBuilding 
 */
MagoManager.prototype.prepareVisibleOctreesSortedByDistance = function(gl, scene, globalVisibleObjControlerOctrees, fileRequestExtraCount) 
{
	if (this.fileRequestControler.isFullPlus(fileRequestExtraCount))	{ return; }

	var refListsParsingCount = 0;
	var maxRefListParsingCount = 20;
	var geometryDataPath = this.readerWriter.geometryDataPath;
	var buildingFolderName;
	var neoBuilding;
	// LOD0 & LOD1
	// Check if the lod0lowestOctrees, lod1lowestOctrees must load and parse data
	var currentVisibleOctrees = [].concat(globalVisibleObjControlerOctrees.currentVisibles0, globalVisibleObjControlerOctrees.currentVisibles1);
	var lowestOctree;
	for (var i=0, length = currentVisibleOctrees.length; i<length; i++) 
	{
		//if (this.vboMemoryManager.isGpuMemFull())
		//{ return; }
		
		//if (refListsParsingCount > maxRefListParsingCount && this.fileRequestControler.isFullPlus(fileRequestExtraCount)) 
		//{ return; }
	
		//if (this.fileRequestControler.isFullPlus(fileRequestExtraCount)) 
		//{ return; }
			
		lowestOctree = currentVisibleOctrees[i];
		neoBuilding = lowestOctree.neoBuildingOwner;
		
		if (neoBuilding == undefined)
		{ continue; }
		
		if (lowestOctree.triPolyhedronsCount === 0) 
		{ continue; }
		
		if (lowestOctree.octree_number_name === undefined)
		{ continue; }
	
		buildingFolderName = neoBuilding.buildingFileName;
		
		if (lowestOctree.neoReferencesMotherAndIndices === undefined)
		{
			lowestOctree.neoReferencesMotherAndIndices = new NeoReferencesMotherAndIndices();
			lowestOctree.neoReferencesMotherAndIndices.motherNeoRefsList = neoBuilding.motherNeoReferencesArray;
		}

		if (lowestOctree.neoReferencesMotherAndIndices.fileLoadState === CODE.fileLoadState.READY)
		{
			if (this.fileRequestControler.isFullPlus(fileRequestExtraCount))	{ return; }

			if (lowestOctree.neoReferencesMotherAndIndices.blocksList === undefined)
			{ lowestOctree.neoReferencesMotherAndIndices.blocksList = new BlocksList(); }

			var subOctreeNumberName = lowestOctree.octree_number_name.toString();
			var references_folderPath = geometryDataPath + "/" + buildingFolderName + "/References";
			var intRef_filePath = references_folderPath + "/" + subOctreeNumberName + "_Ref";
			this.readerWriter.getNeoReferencesArraybuffer(intRef_filePath, lowestOctree, this);
			continue;
		}

		// 2 = file loading finished.***
		/*
		if (lowestOctree.neoReferencesMotherAndIndices.fileLoadState === CODE.fileLoadState.LOADING_FINISHED) 
		{
			//if (refListsParsingCount < maxRefListParsingCount) 
			{
				// must parse the arraybuffer data.***
				var buildingGeoLocation = neoBuilding.geoLocDataManager.getGeoLocationData(0);
				this.matrix4SC.setByFloat32Array(buildingGeoLocation.rotMatrix._floatArrays);
				if (lowestOctree.neoReferencesMotherAndIndices.parseArrayBufferReferences(gl, lowestOctree.neoReferencesMotherAndIndices.dataArraybuffer, this.readerWriter, neoBuilding.motherNeoReferencesArray, this.matrix4SC, this))
				{
					
				}
				else 
				{
					//lowestOctree.neoReferencesMotherAndIndices.deleteObjects(gl, this.vboMemManager);
					//lowestOctree.neoReferencesMotherAndIndices.fileLoadState = CODE.fileLoadState.READY;
				}
				lowestOctree.neoReferencesMotherAndIndices.multiplyKeyTransformMatrix(0, buildingGeoLocation.rotMatrix);
				lowestOctree.neoReferencesMotherAndIndices.dataArraybuffer = undefined;
				refListsParsingCount += 1;
			}
		}
		*/
		if (lowestOctree.neoReferencesMotherAndIndices.fileLoadState === CODE.fileLoadState.PARSE_FINISHED ) 
		{
			// 4 = parsed.***
			// now, check if the blocksList is loaded & parsed.***
			var blocksList = lowestOctree.neoReferencesMotherAndIndices.blocksList;
			// 0 = file loading NO started.***
			if (blocksList.fileLoadState === CODE.fileLoadState.READY) 
			{
				if (this.fileRequestControler.isFullPlus(fileRequestExtraCount))	{ return; }

				// must read blocksList.***
				var subOctreeNumberName = lowestOctree.octree_number_name.toString();
				var blocks_folderPath = geometryDataPath + "/" + buildingFolderName + "/Models";
				var filePathInServer = blocks_folderPath + "/" + subOctreeNumberName + "_Model";
				this.readerWriter.getNeoBlocksArraybuffer(filePathInServer, lowestOctree, this);
				continue;
			}
			/*
			else if (blocksList.fileLoadState === CODE.fileLoadState.LOADING_FINISHED)
			{
				//if (refListsParsingCount < maxRefListParsingCount) 
				{
					if (!blocksList.parseBlocksList(blocksList.dataArraybuffer, this.readerWriter, neoBuilding.motherBlocksArray, this))
					{
						//blocksList.deleteGlObjects(gl, this.vboMemManager);
						//blocksList.fileLoadState = CODE.fileLoadState.READY;
					}
					blocksList.dataArraybuffer = undefined;
					refListsParsingCount += 1;
					
				}
				continue;
			}
			*/
		}
		
		// if the lowest octree is not ready to render, then:
		if (lowestOctree.neoReferencesMotherAndIndices.fileLoadState !== CODE.fileLoadState.PARSE_FINISHED )
		{
			globalVisibleObjControlerOctrees.currentVisibles2.push(lowestOctree);
		}
	}
};

/**
 * LOD2 에 대한 F4D LegoData 를 요청
 * 
 * @param {any} gl 
 * @param {any} scene 
 * @param {any} neoBuilding 
 */
MagoManager.prototype.prepareVisibleOctreesSortedByDistanceLOD2 = function(gl, scene, globalVisibleObjControlerOctrees, fileRequestExtraCount) 
{
	var extraCount = fileRequestExtraCount;
	if (this.fileRequestControler.isFullPlus(extraCount))	{ return; }

	//var visibleObjControlerOctrees = neoBuilding.currentVisibleOctreesControler;
	if (globalVisibleObjControlerOctrees === undefined)
	{ return; }

	var lowestOctreeLegosParsingCount = 0;
	var maxLowestOctreeLegosParsingCount = 100;
	var geometryDataPath = this.readerWriter.geometryDataPath;
	var neoBuilding;
	var buildingFolderName;

	// LOD2
	// Check if the lod2lowestOctrees must load and parse data
	var lowestOctree;

	for (var i=0, length = globalVisibleObjControlerOctrees.currentVisibles2.length; i<length; i++) 
	{
		lowestOctree = globalVisibleObjControlerOctrees.currentVisibles2[i];
		
		if (lowestOctree.octree_number_name === undefined)
		{ continue; }
		
		if (lowestOctree.lego === undefined) 
		{
			lowestOctree.lego = new Lego();
			lowestOctree.lego.fileLoadState = CODE.fileLoadState.READY;
		}

		if (lowestOctree.lego === undefined && lowestOctree.lego.dataArrayBuffer === undefined) 
		{ continue; }
	
		neoBuilding = lowestOctree.neoBuildingOwner;
		if (neoBuilding == undefined)
		{ continue; }
		
		buildingFolderName = neoBuilding.buildingFileName;

		if (neoBuilding.buildingType === "outfitting")
		{ continue; }

		// && lowestOctree.neoRefsList_Array.length === 0)
		if (lowestOctree.lego.fileLoadState === CODE.fileLoadState.READY && !this.isCameraMoving) 
		{
			// must load the legoStructure of the lowestOctree.***
			if (!this.fileRequestControler.isFullPlus(extraCount))
			{
				var subOctreeNumberName = lowestOctree.octree_number_name.toString();
				var bricks_folderPath = geometryDataPath + "/" + buildingFolderName + "/Bricks";
				var filePathInServer = bricks_folderPath + "/" + subOctreeNumberName + "_Brick";
				this.readerWriter.getOctreeLegoArraybuffer(filePathInServer, lowestOctree, this);
			}
			continue;
		}
		/*
		if (lowestOctree.lego.fileLoadState === 2 && !this.isCameraMoving) 
		{
			if (lowestOctreeLegosParsingCount < maxLowestOctreeLegosParsingCount) 
			{
				var bytesReaded = 0;
				lowestOctree.lego.parseArrayBuffer(gl, lowestOctree.lego.dataArrayBuffer, this);
				lowestOctree.lego.dataArrayBuffer = undefined;
				lowestOctreeLegosParsingCount++;
			}
			continue;
		}
		*/
		// finally check if there are legoSimpleBuildingTexture.***
		if (lowestOctree.lego.vbo_vicks_container.vboCacheKeysArray[0] && lowestOctree.lego.vbo_vicks_container.vboCacheKeysArray[0].meshTexcoordsCacheKey)
		{
			if (neoBuilding.simpleBuilding3x3Texture === undefined)
			{
				neoBuilding.simpleBuilding3x3Texture = new Texture();
				var buildingFolderName = neoBuilding.buildingFileName;
				var filePath_inServer = this.readerWriter.geometryDataPath + "/" + buildingFolderName + "/SimpleBuildingTexture3x3.bmp";
				this.readerWriter.readLegoSimpleBuildingTexture(gl, filePath_inServer, neoBuilding.simpleBuilding3x3Texture, this);
			}
		}
	}
};


/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param cameraPosition 카메라 입장에서 화면에 그리기 전에 객체를 그릴 필요가 있는지 유무를 판단하는 값
 * @param scene 변수
 * @param shader 변수
 * @param renderTexture 변수
 * @param ssao_idx 변수
 * @param neoRefLists_array 변수
 */
MagoManager.prototype.renderDetailedNeoBuilding = function(gl, cameraPosition, scene, shader, renderTexture, ssao_idx, neoRefLists_array) 
{

	// picking mode.***********************************************************************************
	if (ssao_idx === -1) 
	{
		// picking mode.***
		this.selectionCandidateObjectsArray.length = 0; // init.***

		// set byteColor codes for references objects.***
		var red = 0, green = 0, blue = 0, alfa = 255;

		// 1) Exterior objects.***
		var neoRefListsArray = neoRefLists_array;
		//var neoRefListsArray = this.detailed_neoBuilding._neoRefLists_Container.neoRefsLists_Array;
		var neoRefLists_count = neoRefListsArray.length;
		for (var i = 0; i<neoRefLists_count; i++) 
		{
			var neoRefList = neoRefListsArray[i];
			var neoRefsCount = neoRefList.neoRefs_Array.length;
			for (var j = 0; j < neoRefsCount; j++) 
			{
				var neoRef = neoRefList.neoRefs_Array[j];
				if (neoRef.selColor4 === undefined) { neoRef.selColor4 = new Color(); }

				neoRef.selColor4.set(red, green, blue, alfa);
				this.selectionCandidateObjectsArray.push(neoRef);
				blue++;
				if (blue >= 254) 
				{
					blue = 0;
					green++;
					if (green >= 254) 
					{
						red++;
					}
				}
			}
		}
	}

	// ssao_idx = -1 -> pickingMode.***
	// ssao_idx = 0 -> depth.***
	// ssao_idx = 1 -> ssao.***

	var isInterior = false;
	if (ssao_idx === -1) 
	{
		this.renderer.renderNeoRefListsColorSelection(gl, neoRefLists_array, this.detailed_neoBuilding, this, isInterior, shader, renderTexture, ssao_idx);
	}
	else 
	{
		this.renderer.renderNeoRefLists(gl, neoRefLists_array, this.detailed_neoBuilding, this, isInterior, shader, renderTexture, ssao_idx);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param cameraPosition 카메라 입장에서 화면에 그리기 전에 객체를 그릴 필요가 있는지 유무를 판단하는 값
 * @param scene 변수
 * @param shader 변수
 * @param renderTexture 변수
 * @param ssao_idx 변수
 * @param neoRefLists_array 변수
 */

MagoManager.prototype.renderLowestOctreeAsimetricVersion = function(gl, cameraPosition, shader, renderTexture, ssao_idx, visibleObjControlerBuildings) 
{
	// ssao_idx = -1 -> pickingMode.***
	// ssao_idx = 0 -> depth.***
	// ssao_idx = 1 -> ssao.***
	gl.frontFace(gl.CCW);
	//gl.depthFunc(gl.GREATER);
	//gl.enable(gl.CULL_FACE);
	gl.depthRange(0.0, 1.0);
	
	gl.enable(gl.DEPTH_TEST);

	if (ssao_idx === -1) 
	{
		// is selection.***
	}
	else 
	{

		var isInterior = false; // no used.***

		var currentShader;
		var shaderProgram;
		var lowestOctree;
		var refList;
		var neoBuilding;
		var lowestOctreesCount;
		//		var refListsParsingCount = 0;
		//		var maxRefListParsingCount = 10;

		renderTexture = false;
		var lowestOctreeLegosParsingCount = 0;

		// Test render in lego.***
		if (ssao_idx === 0) 
		{
			
			gl.disable(gl.BLEND);
			this.depthRenderLowestOctreeAsimetricVersion(gl, ssao_idx, visibleObjControlerBuildings);
		}
		if (ssao_idx === 1) 
		{
			
			// 2) ssao render.************************************************************************************************************
			var neoBuildingsCount = visibleObjControlerBuildings.currentVisibles0.length;
			if (neoBuildingsCount > 0)
			{
				if (this.noiseTexture === undefined) 
				{ this.noiseTexture = genNoiseTextureRGBA(gl, 4, 4, this.pixels); }

				currentShader = this.postFxShadersManager.pFx_shaders_array[4];

				shaderProgram = currentShader.program;
				gl.useProgram(shaderProgram);
				
				gl.enableVertexAttribArray(currentShader.texCoord2_loc);
				gl.enableVertexAttribArray(currentShader.position3_loc);
				gl.enableVertexAttribArray(currentShader.normal3_loc);
				
				gl.uniformMatrix4fv(currentShader.modelViewProjectionMatrix4RelToEye_loc, false, this.sceneState.modelViewProjRelToEyeMatrix._floatArrays);
				gl.uniformMatrix4fv(currentShader.modelViewMatrix4RelToEye_loc, false, this.sceneState.modelViewRelToEyeMatrix._floatArrays); // original.***
				gl.uniformMatrix4fv(currentShader.modelViewMatrix4_loc, false, this.sceneState.modelViewMatrix._floatArrays);
				gl.uniformMatrix4fv(currentShader.projectionMatrix4_loc, false, this.sceneState.projectionMatrix._floatArrays);
				gl.uniform3fv(currentShader.cameraPosHIGH_loc, this.sceneState.encodedCamPosHigh);
				gl.uniform3fv(currentShader.cameraPosLOW_loc, this.sceneState.encodedCamPosLow);
				gl.uniformMatrix4fv(currentShader.normalMatrix4_loc, false, this.sceneState.normalMatrix4._floatArrays);
				gl.uniform1f(currentShader.near_loc, this.sceneState.camera.frustum.near);
				gl.uniform1f(currentShader.far_loc, this.sceneState.camera.frustum.far);

				gl.uniform1f(currentShader.fov_loc, this.sceneState.camera.frustum.fovyRad);	// "frustum._fov" is in radians.***
				gl.uniform1f(currentShader.aspectRatio_loc, this.sceneState.camera.frustum.aspectRatio);
				gl.uniform1f(currentShader.screenWidth_loc, this.sceneState.drawingBufferWidth);	
				gl.uniform1f(currentShader.screenHeight_loc, this.sceneState.drawingBufferHeight);
				gl.uniform1f(currentShader.shininessValue_loc, 40.0);

				gl.uniform1i(currentShader.depthTex_loc, 0);
				gl.uniform1i(currentShader.noiseTex_loc, 1);
				gl.uniform1i(currentShader.diffuseTex_loc, 2); // no used.***

				gl.uniform2fv(currentShader.noiseScale2_loc, [this.depthFboNeo.width/this.noiseTexture.width, this.depthFboNeo.height/this.noiseTexture.height]);
				gl.uniform3fv(currentShader.kernel16_loc, this.kernel);
				
				gl.uniform1i(currentShader.textureFlipYAxis_loc, this.sceneState.textureFlipYAxis);
				
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, this.depthFboNeo.colorBuffer);  // original.***
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture);
				
				//gl.clearStencil(0);
				this.visibleObjControlerOctreesAux.initArrays();
				
				// 1) LOD0 & LOD1.*********************************************************************************************************************
				var refTMatrixIdxKey = 0;
				var minSize = 0.0;
				var renderTexture;
				if (this.isLastFrustum)
				{
					this.renderer.renderNeoBuildingsAsimetricVersion(gl, visibleObjControlerBuildings, this, currentShader, renderTexture, ssao_idx, minSize, 0, refTMatrixIdxKey);
				}
				
				if (currentShader)
				{
					if (currentShader.texCoord2_loc !== -1){ gl.disableVertexAttribArray(currentShader.texCoord2_loc); }
					if (currentShader.position3_loc !== -1){ gl.disableVertexAttribArray(currentShader.position3_loc); }
					if (currentShader.normal3_loc !== -1){ gl.disableVertexAttribArray(currentShader.normal3_loc); }
					if (currentShader.color4_loc !== -1){ gl.disableVertexAttribArray(currentShader.color4_loc); }
				}

			}
			// 2) LOD 2 & 3.************************************************************************************************************************************
			var neoBuildingsCount = visibleObjControlerBuildings.currentVisibles2.length;
			if (neoBuildingsCount > 0)
			{
				currentShader = this.postFxShadersManager.pFx_shaders_array[8]; // lodBuilding ssao.***
				shaderProgram = currentShader.program;
				gl.useProgram(shaderProgram);
				gl.enableVertexAttribArray(currentShader.position3_loc);
				gl.enableVertexAttribArray(currentShader.normal3_loc);
				gl.enableVertexAttribArray(currentShader.color4_loc);

				gl.uniformMatrix4fv(currentShader.modelViewProjectionMatrix4RelToEye_loc, false, this.sceneState.modelViewProjRelToEyeMatrix._floatArrays);
				gl.uniformMatrix4fv(currentShader.modelViewMatrix4RelToEye_loc, false, this.sceneState.modelViewRelToEyeMatrix._floatArrays); // original.***
				gl.uniformMatrix4fv(currentShader.modelViewMatrix4_loc, false, this.sceneState.modelViewMatrix._floatArrays);
				gl.uniformMatrix4fv(currentShader.projectionMatrix4_loc, false, this.sceneState.projectionMatrix._floatArrays);
				gl.uniform3fv(currentShader.cameraPosHIGH_loc, this.sceneState.encodedCamPosHigh);
				gl.uniform3fv(currentShader.cameraPosLOW_loc, this.sceneState.encodedCamPosLow);

				gl.uniform1f(currentShader.near_loc, this.sceneState.camera.frustum.near);
				gl.uniform1f(currentShader.far_loc, this.sceneState.camera.frustum.far);

				gl.uniformMatrix4fv(currentShader.normalMatrix4_loc, false, this.sceneState.normalMatrix4._floatArrays);
				//-----------------------------------------------------------------------------------------------------
				gl.uniform1i(currentShader.hasAditionalMov_loc, true);
				gl.uniform3fv(currentShader.aditionalMov_loc, [0.0, 0.0, 0.0]); //.***
				gl.uniform1i(currentShader.hasTexture_loc, false); // initially false.***
				gl.uniform1i(currentShader.textureFlipYAxis_loc, this.sceneState.textureFlipYAxis);

				gl.uniform1i(currentShader.depthTex_loc, 0);
				gl.uniform1i(currentShader.noiseTex_loc, 1);
				gl.uniform1i(currentShader.diffuseTex_loc, 2); // no used.***
				gl.uniform1f(currentShader.fov_loc, this.sceneState.camera.frustum.fovyRad);	// "frustum._fov" is in radians.***
				gl.uniform1f(currentShader.aspectRatio_loc, this.sceneState.camera.frustum.aspectRatio);
				gl.uniform1f(currentShader.screenWidth_loc, this.sceneState.drawingBufferWidth);	
				gl.uniform1f(currentShader.screenHeight_loc, this.sceneState.drawingBufferHeight);

				gl.uniform2fv(currentShader.noiseScale2_loc, [this.depthFboNeo.width/this.noiseTexture.width, this.depthFboNeo.height/this.noiseTexture.height]);
				gl.uniform3fv(currentShader.kernel16_loc, this.kernel);
				
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, this.depthFboNeo.colorBuffer);  // original.***
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture);
				gl.activeTexture(gl.TEXTURE2); 
				gl.bindTexture(gl.TEXTURE_2D, this.textureAux_1x1);

				this.renderer.renderNeoBuildingsLOD2AsimetricVersion(gl, visibleObjControlerBuildings, this, currentShader, renderTexture, ssao_idx);
				
				if (currentShader)
				{
					if (currentShader.texCoord2_loc !== -1){ gl.disableVertexAttribArray(currentShader.texCoord2_loc); }
					if (currentShader.position3_loc !== -1){ gl.disableVertexAttribArray(currentShader.position3_loc); }
					if (currentShader.normal3_loc !== -1){ gl.disableVertexAttribArray(currentShader.normal3_loc); }
					if (currentShader.color4_loc !== -1){ gl.disableVertexAttribArray(currentShader.color4_loc); }
				}
			}
			
			// If there are an object selected, then there are a stencilBuffer.******************************************
			if (this.buildingSelected && this.objectSelected) // if there are an object selected then there are a building selected.***
			{
				neoBuilding = this.buildingSelected;
				var buildingGeoLocation = neoBuilding.geoLocDataManager.getGeoLocationData(0);
				var neoReferencesMotherAndIndices = this.octreeSelected.neoReferencesMotherAndIndices;
				var glPrimitive = gl.POINTS;
				glPrimitive = gl.TRIANGLES;
				var maxSizeToRender = 0.0;
				var refMatrixIdxKey = 0;
				
				// do as the "getSelectedObjectPicking".**********************************************************
				currentShader = this.postFxShadersManager.pFx_shaders_array[14]; // silhouette shader.***
				var shaderProgram = currentShader.program;
				gl.useProgram(shaderProgram);
				
				gl.enableVertexAttribArray(currentShader.position3_loc);
				
				gl.uniformMatrix4fv(currentShader.buildingRotMatrix_loc, false, buildingGeoLocation.rotMatrix._floatArrays);
				gl.uniformMatrix4fv(currentShader.modelViewProjectionMatrix4RelToEye_loc, false, this.sceneState.modelViewProjRelToEyeMatrix._floatArrays);
				gl.uniformMatrix4fv(currentShader.ModelViewMatrixRelToEye_loc, false, this.sceneState.modelViewRelToEyeMatrix._floatArrays);
				gl.uniform3fv(currentShader.cameraPosHIGH_loc, this.sceneState.encodedCamPosHigh);
				gl.uniform3fv(currentShader.cameraPosLOW_loc, this.sceneState.encodedCamPosLow);
				
				// do the colorCoding render.***
				// position uniforms.***
				gl.uniform3fv(currentShader.buildingPosHIGH_loc, buildingGeoLocation.positionHIGH);
				gl.uniform3fv(currentShader.buildingPosLOW_loc, buildingGeoLocation.positionLOW);
				
				gl.uniform4fv(currentShader.color4Aux_loc, [0.0, 1.0, 0.0, 1.0]);
				gl.uniform2fv(currentShader.screenSize_loc, [this.sceneState.drawingBufferWidth, this.sceneState.drawingBufferHeight]);
				gl.uniformMatrix4fv(currentShader.ProjectionMatrix_loc, false, this.sceneState.projectionMatrix._floatArrays);
				
				gl.enable(gl.STENCIL_TEST);
				gl.disable(gl.POLYGON_OFFSET_FILL);
				gl.disable(gl.CULL_FACE);
				gl.disable(gl.DEPTH_TEST);
				gl.depthRange(0, 0);
				
				gl.stencilFunc(gl.EQUAL, 0, 1);
				gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
					
				//glPrimitive = gl.POINTS;
				glPrimitive = gl.TRIANGLES;
				//gl.polygonMode( gl.FRONT_AND_BACK, gl.LINE );
				
				var offsetSize = 3/1000;
				gl.uniform2fv(currentShader.camSpacePixelTranslation_loc, [offsetSize, offsetSize]);
				this.renderer.renderNeoReferenceAsimetricVersionColorSelection(gl, this.objectSelected, neoReferencesMotherAndIndices, neoBuilding, this, currentShader, maxSizeToRender, refMatrixIdxKey, glPrimitive);
				gl.uniform2fv(currentShader.camSpacePixelTranslation_loc, [-offsetSize, offsetSize]);
				this.renderer.renderNeoReferenceAsimetricVersionColorSelection(gl, this.objectSelected, neoReferencesMotherAndIndices, neoBuilding, this, currentShader, maxSizeToRender, refMatrixIdxKey, glPrimitive);
				gl.uniform2fv(currentShader.camSpacePixelTranslation_loc, [offsetSize, -offsetSize]);
				this.renderer.renderNeoReferenceAsimetricVersionColorSelection(gl, this.objectSelected, neoReferencesMotherAndIndices, neoBuilding, this, currentShader, maxSizeToRender, refMatrixIdxKey, glPrimitive);
				gl.uniform2fv(currentShader.camSpacePixelTranslation_loc, [-offsetSize, -offsetSize]);
				this.renderer.renderNeoReferenceAsimetricVersionColorSelection(gl, this.objectSelected, neoReferencesMotherAndIndices, neoBuilding, this, currentShader, maxSizeToRender, refMatrixIdxKey, glPrimitive);
				gl.enable(gl.DEPTH_TEST);// return to the normal state.***
				gl.disable(gl.STENCIL_TEST);
				gl.depthRange(0, 1);// return to the normal value.***
				gl.disableVertexAttribArray(currentShader.position3_loc);
				
				if (currentShader)
				{
					if (currentShader.texCoord2_loc !== -1){ gl.disableVertexAttribArray(currentShader.texCoord2_loc); }
					if (currentShader.position3_loc !== -1){ gl.disableVertexAttribArray(currentShader.position3_loc); }
					if (currentShader.normal3_loc !== -1){ gl.disableVertexAttribArray(currentShader.normal3_loc); }
					if (currentShader.color4_loc !== -1){ gl.disableVertexAttribArray(currentShader.color4_loc); }
				}
				
			}
			
			// 3) now render bboxes.*******************************************************************************************************************
			if (this.magoPolicy.getShowBoundingBox())
			{
				currentShader = this.postFxShadersManager.pFx_shaders_array[12]; // box ssao.***
				shaderProgram = currentShader.program;
				gl.useProgram(shaderProgram);
				gl.enableVertexAttribArray(currentShader.position3_loc);
				gl.enableVertexAttribArray(currentShader.normal3_loc);
				gl.disableVertexAttribArray(currentShader.color4_loc);

				gl.uniformMatrix4fv(currentShader.modelViewProjectionMatrix4RelToEye_loc, false, this.sceneState.modelViewProjRelToEyeMatrix._floatArrays);
				gl.uniformMatrix4fv(currentShader.modelViewMatrix4RelToEye_loc, false, this.sceneState.modelViewRelToEyeMatrix._floatArrays); // original.***
				gl.uniformMatrix4fv(currentShader.modelViewMatrix4_loc, false, this.sceneState.modelViewMatrix._floatArrays);
				gl.uniformMatrix4fv(currentShader.projectionMatrix4_loc, false, this.sceneState.projectionMatrix._floatArrays);
				gl.uniform3fv(currentShader.cameraPosHIGH_loc, this.sceneState.encodedCamPosHigh);
				gl.uniform3fv(currentShader.cameraPosLOW_loc, this.sceneState.encodedCamPosLow);

				gl.uniform1f(currentShader.near_loc, this.sceneState.camera.frustum.near);
				gl.uniform1f(currentShader.far_loc, this.sceneState.camera.frustum.far);

				gl.uniformMatrix4fv(currentShader.normalMatrix4_loc, false, this.sceneState.normalMatrix4._floatArrays);
				//-----------------------------------------------------------------------------------------------------------

				gl.uniform1i(currentShader.hasAditionalMov_loc, true);
				gl.uniform3fv(currentShader.aditionalMov_loc, [0.0, 0.0, 0.0]); //.***
				gl.uniform1i(currentShader.bScale_loc, true);

				gl.uniform1i(currentShader.bUse1Color_loc, true);
				gl.uniform4fv(currentShader.oneColor4_loc, [1.0, 0.0, 1.0, 1.0]); //.***

				gl.uniform1i(currentShader.depthTex_loc, 0);
				gl.uniform1i(currentShader.noiseTex_loc, 1);
				gl.uniform1i(currentShader.diffuseTex_loc, 2); // no used.***
				gl.uniform1f(currentShader.fov_loc, this.sceneState.camera.frustum.fovyRad);	// "frustum._fov" is in radians.***
				gl.uniform1f(currentShader.aspectRatio_loc, this.sceneState.camera.frustum.aspectRatio);
				gl.uniform1f(currentShader.screenWidth_loc, this.sceneState.drawingBufferWidth);	
				gl.uniform1f(currentShader.screenHeight_loc, this.sceneState.drawingBufferHeight);


				gl.uniform2fv(currentShader.noiseScale2_loc, [this.depthFboNeo.width/this.noiseTexture.width, this.depthFboNeo.height/this.noiseTexture.height]);
				gl.uniform3fv(currentShader.kernel16_loc, this.kernel);
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, this.depthFboNeo.colorBuffer);  // original.***
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture);

				var visibleBuildingsCount = this.visibleObjControlerBuildings.currentVisibles0.length;
				for (var b=0; b<visibleBuildingsCount; b++)
				{
					neoBuilding = this.visibleObjControlerBuildings.currentVisibles0[b];
					gl.uniform3fv(currentShader.scale_loc, [neoBuilding.bbox.getXLength(), neoBuilding.bbox.getYLength(), neoBuilding.bbox.getZLength()]); //.***
					var buildingGeoLocation = neoBuilding.geoLocDataManager.getGeoLocationData(0);
					gl.uniformMatrix4fv(currentShader.buildingRotMatrix_loc, false, buildingGeoLocation.rotMatrix._floatArrays);
					gl.uniform3fv(currentShader.buildingPosHIGH_loc, buildingGeoLocation.positionHIGH);
					gl.uniform3fv(currentShader.buildingPosLOW_loc, buildingGeoLocation.positionLOW);

					this.pointSC = neoBuilding.bbox.getCenterPoint(this.pointSC);
					gl.uniform3fv(currentShader.aditionalMov_loc, [this.pointSC.x, this.pointSC.y, this.pointSC.z]); //.***
					this.renderer.renderTriPolyhedron(gl, this.unitaryBoxSC, this, currentShader, ssao_idx, neoBuilding.isHighLighted);
				}

				visibleBuildingsCount = this.visibleObjControlerBuildings.currentVisibles2.length;
				//if(visibleBuildingsCount > 0)
				//	visibleBuildingsCount = 10;

				for (var b=0; b<visibleBuildingsCount; b++)
				{
					neoBuilding = this.visibleObjControlerBuildings.currentVisibles2[b];
					gl.uniform3fv(currentShader.scale_loc, [neoBuilding.bbox.getXLength(), neoBuilding.bbox.getYLength(), neoBuilding.bbox.getZLength()]); //.***

					var buildingGeoLocation = neoBuilding.geoLocDataManager.getGeoLocationData(0);
					gl.uniformMatrix4fv(currentShader.buildingRotMatrix_loc, false, buildingGeoLocation.rotMatrix._floatArrays);
					gl.uniform3fv(currentShader.buildingPosHIGH_loc, buildingGeoLocation.positionHIGH);
					gl.uniform3fv(currentShader.buildingPosLOW_loc, buildingGeoLocation.positionLOW);

					this.pointSC = neoBuilding.bbox.getCenterPoint(this.pointSC);
					gl.uniform3fv(currentShader.aditionalMov_loc, [this.pointSC.x, this.pointSC.y, this.pointSC.z]); //.***
					this.renderer.renderTriPolyhedron(gl, this.unitaryBoxSC, this, currentShader, ssao_idx, neoBuilding.isHighLighted);
				}
				
				if (currentShader)
				{
					if (currentShader.texCoord2_loc !== -1){ gl.disableVertexAttribArray(currentShader.texCoord2_loc); }
					if (currentShader.position3_loc !== -1){ gl.disableVertexAttribArray(currentShader.position3_loc); }
					if (currentShader.normal3_loc !== -1){ gl.disableVertexAttribArray(currentShader.normal3_loc); }
					if (currentShader.color4_loc !== -1){ gl.disableVertexAttribArray(currentShader.color4_loc); }
				}
			}
			
			// 4) Render ObjectMarkers.********************************************************************************************************
			// 4) Render ObjectMarkers.********************************************************************************************************
			// 4) Render ObjectMarkers.********************************************************************************************************
			var objectsMarkersCount = this.objMarkerManager.objectMarkerArray.length;
			if (objectsMarkersCount > 0)
			{
				/*
				currentShader = this.postFxShadersManager.pFx_shaders_array[12]; // box ssao.***
				shaderProgram = currentShader.program;
				gl.useProgram(shaderProgram);
				gl.enableVertexAttribArray(currentShader.position3_loc);
				gl.enableVertexAttribArray(currentShader.normal3_loc);
				gl.disableVertexAttribArray(currentShader.color4_loc);

				gl.uniformMatrix4fv(currentShader.modelViewProjectionMatrix4RelToEye_loc, false, this.sceneState.modelViewProjRelToEyeMatrix._floatArrays);
				gl.uniformMatrix4fv(currentShader.modelViewMatrix4RelToEye_loc, false, this.sceneState.modelViewRelToEyeMatrix._floatArrays); // original.***
				gl.uniformMatrix4fv(currentShader.modelViewMatrix4_loc, false, this.sceneState.modelViewMatrix._floatArrays);
				gl.uniformMatrix4fv(currentShader.projectionMatrix4_loc, false, this.sceneState.projectionMatrix._floatArrays);
				gl.uniform3fv(currentShader.cameraPosHIGH_loc, this.sceneState.encodedCamPosHigh);
				gl.uniform3fv(currentShader.cameraPosLOW_loc, this.sceneState.encodedCamPosLow);

				gl.uniform1f(currentShader.near_loc, this.sceneState.camera.frustum.near);
				gl.uniform1f(currentShader.far_loc, this.sceneState.camera.frustum.far);

				gl.uniformMatrix4fv(currentShader.normalMatrix4_loc, false, this.sceneState.normalMatrix4._floatArrays);
				//-----------------------------------------------------------------------------------------------------------

				gl.uniform1i(currentShader.hasAditionalMov_loc, true);
				gl.uniform3fv(currentShader.aditionalMov_loc, [0.0, 0.0, 0.0]); //.***
				gl.uniform1i(currentShader.bScale_loc, true);

				gl.uniform1i(currentShader.bUse1Color_loc, true);
				gl.uniform4fv(currentShader.oneColor4_loc, [1.0, 0.0, 1.0, 1.0]); //.***

				gl.uniform1i(currentShader.depthTex_loc, 0);
				gl.uniform1i(currentShader.noiseTex_loc, 1);
				gl.uniform1i(currentShader.diffuseTex_loc, 2); // no used.***
				gl.uniform1f(currentShader.fov_loc, this.sceneState.camera.frustum.fovyRad);	// "frustum._fov" is in radians.***
				gl.uniform1f(currentShader.aspectRatio_loc, this.sceneState.camera.frustum.aspectRatio);
				gl.uniform1f(currentShader.screenWidth_loc, this.sceneState.drawingBufferWidth);	
				gl.uniform1f(currentShader.screenHeight_loc, this.sceneState.drawingBufferHeight);


				gl.uniform2fv(currentShader.noiseScale2_loc, [this.depthFboNeo.width/this.noiseTexture.width, this.depthFboNeo.height/this.noiseTexture.height]);
				gl.uniform3fv(currentShader.kernel16_loc, this.kernel);
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, this.depthFboNeo.colorBuffer);  // original.***
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture);
				var boxLengthX = 0.1;
				var boxLengthY = 0.1;
				var boxLengthZ = 0.1;
				var isHighLighted = false;
				for(var i=0; i<objectsMarkersCount; i++)
				{
					var objMarker = this.objMarkerManager.objectMarkerArray[i];
					//neoBuilding = this.visibleObjControlerBuildings.currentVisibles2[b];
					gl.uniform3fv(currentShader.scale_loc, [boxLengthX, boxLengthY, boxLengthZ]); //.***

					var buildingGeoLocation = objMarker.geoLocationData;
					gl.uniformMatrix4fv(currentShader.buildingRotMatrix_loc, false, buildingGeoLocation.rotMatrix._floatArrays);
					gl.uniform3fv(currentShader.buildingPosHIGH_loc, buildingGeoLocation.positionHIGH);
					gl.uniform3fv(currentShader.buildingPosLOW_loc, buildingGeoLocation.positionLOW);

					this.pointSC.set(0.0, 0.0, 0.0);
					gl.uniform3fv(currentShader.aditionalMov_loc, [this.pointSC.x, this.pointSC.y, this.pointSC.z]); //.***
					this.renderer.renderTriPolyhedron(gl, this.unitaryBoxSC, this, currentShader, ssao_idx, isHighLighted);
				}
				if(currentShader)
				{
					if(currentShader.texCoord2_loc !== -1)gl.disableVertexAttribArray(currentShader.texCoord2_loc);
					if(currentShader.position3_loc !== -1)gl.disableVertexAttribArray(currentShader.position3_loc);
					if(currentShader.normal3_loc !== -1)gl.disableVertexAttribArray(currentShader.normal3_loc);
					if(currentShader.color4_loc !== -1)gl.disableVertexAttribArray(currentShader.color4_loc);
				}
				*/
				
				// now repeat the objects markers for png images.***
				// Png for pin image 128x128.********************************************************************
				if (this.pin.positionBuffer === undefined)
				{ this.pin.createPinCenterBottom(gl); }
				
				currentShader = this.postFxShadersManager.pFx_shaders_array[13]; // png image shader.***
				
				shaderProgram = currentShader.program;
				
				gl.useProgram(shaderProgram);
				gl.uniformMatrix4fv(currentShader.modelViewProjectionMatrix4RelToEye_loc, false, this.sceneState.modelViewProjRelToEyeMatrix._floatArrays);
				gl.uniform3fv(currentShader.cameraPosHIGH_loc, this.sceneState.encodedCamPosHigh);
				gl.uniform3fv(currentShader.cameraPosLOW_loc, this.sceneState.encodedCamPosLow);
				gl.uniformMatrix4fv(currentShader.buildingRotMatrix_loc, false, this.sceneState.modelViewRelToEyeMatrixInv._floatArrays);
				
				gl.uniform1i(currentShader.textureFlipYAxis_loc, this.sceneState.textureFlipYAxis); 
				// Tell the shader to get the texture from texture unit 0
				gl.uniform1i(currentShader.texture_loc, 0);
				gl.enableVertexAttribArray(currentShader.texCoord2_loc);
				gl.enableVertexAttribArray(currentShader.position3_loc);
				gl.activeTexture(gl.TEXTURE0);
				
				gl.depthRange(0, 0);
				//var context = document.getElementById('canvas2').getContext("2d");
				//var canvas = document.getElementById("magoContainer");
				
				gl.bindBuffer(gl.ARRAY_BUFFER, this.pin.positionBuffer);
				gl.vertexAttribPointer(currentShader.position3_loc, 3, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, this.pin.texcoordBuffer);
				gl.vertexAttribPointer(currentShader.texCoord2_loc, 2, gl.FLOAT, false, 0, 0);
				var j=0;
				for (var i=0; i<objectsMarkersCount; i++)
				{
					if (j>= this.pin.texturesArray.length)
					{ j=0; }
					
					var currentTexture = this.pin.texturesArray[j];
					var objMarker = this.objMarkerManager.objectMarkerArray[i];
					var objMarkerGeoLocation = objMarker.geoLocationData;
					gl.bindTexture(gl.TEXTURE_2D, currentTexture.texId);
					gl.uniform3fv(currentShader.buildingPosHIGH_loc, objMarkerGeoLocation.positionHIGH);
					gl.uniform3fv(currentShader.buildingPosLOW_loc, objMarkerGeoLocation.positionLOW);

					gl.drawArrays(gl.TRIANGLES, 0, 6);
					
					j++;
				}
				gl.depthRange(0, 1);
				gl.useProgram(null);
				gl.bindTexture(gl.TEXTURE_2D, null);
				gl.disableVertexAttribArray(currentShader.texCoord2_loc);
				gl.disableVertexAttribArray(currentShader.position3_loc);
				
			}
			
		}
		
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		if (currentShader)
		{
			if (currentShader.texCoord2_loc !== -1){ gl.disableVertexAttribArray(currentShader.texCoord2_loc); }
			if (currentShader.position3_loc !== -1){ gl.disableVertexAttribArray(currentShader.position3_loc); }
			if (currentShader.normal3_loc !== -1){ gl.disableVertexAttribArray(currentShader.normal3_loc); }
			if (currentShader.color4_loc !== -1){ gl.disableVertexAttribArray(currentShader.color4_loc); }
		}
	}

};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param cameraPosition 카메라 입장에서 화면에 그리기 전에 객체를 그릴 필요가 있는지 유무를 판단하는 값
 * @param scene 변수
 * @param shader 변수
 * @param renderTexture 변수
 * @param ssao_idx 변수
 * @param neoRefLists_array 변수
 */

MagoManager.prototype.depthRenderLowestOctreeAsimetricVersion = function(gl, ssao_idx, visibleObjControlerBuildings) 
{
	// ssao_idx = -1 -> pickingMode.***
	// ssao_idx = 0 -> depth.***
	// ssao_idx = 1 -> ssao.***

	var isInterior = false; // no used.***

	var currentShader;
	var shaderProgram;
	var lowestOctree;
	var refList;
	var neoBuilding;
	var lowestOctreesCount;
	//		var refListsParsingCount = 0;
	//		var maxRefListParsingCount = 10;

	var renderTexture = false;
	
	var neoBuildingsCount = visibleObjControlerBuildings.currentVisibles0.length;
	if (neoBuildingsCount > 0)
	{
		// LOD 0. Render detailed.***
		currentShader = this.postFxShadersManager.pFx_shaders_array[3]; // neo depth.***
		shaderProgram = currentShader.program;

		gl.useProgram(shaderProgram);
		gl.enableVertexAttribArray(currentShader.position3_loc);

		gl.uniformMatrix4fv(currentShader.modelViewProjectionMatrix4RelToEye_loc, false, this.sceneState.modelViewProjRelToEyeMatrix._floatArrays);
		gl.uniformMatrix4fv(currentShader.modelViewMatrix4RelToEye_loc, false, this.sceneState.modelViewRelToEyeMatrix._floatArrays); // original.***
		gl.uniformMatrix4fv(currentShader.modelViewMatrix4_loc, false, this.sceneState.modelViewMatrix._floatArrays);
		gl.uniformMatrix4fv(currentShader.projectionMatrix4_loc, false, this.sceneState.projectionMatrix._floatArrays);
		gl.uniform3fv(currentShader.cameraPosHIGH_loc, this.sceneState.encodedCamPosHigh);
		gl.uniform3fv(currentShader.cameraPosLOW_loc, this.sceneState.encodedCamPosLow);

		gl.uniform1f(currentShader.near_loc, this.sceneState.camera.frustum.near);
		gl.uniform1f(currentShader.far_loc, this.sceneState.camera.frustum.far);

		// renderDepth for all buildings.***
		// 1) LOD 0 & LOD1.*********************************************************************************************************************
		var refTMatrixIdxKey = 0;
		var minSize = 0.0;
		if (this.isLastFrustum)
		{
			this.renderer.renderNeoBuildingsAsimetricVersion(gl, visibleObjControlerBuildings, this, currentShader, renderTexture, ssao_idx, minSize, 0, refTMatrixIdxKey);
		}
	}
	if (currentShader)
	{
		//if(currentShader.position3_loc !== -1)gl.disableVertexAttribArray(currentShader.position3_loc);
	}
	
	// 2) LOD 2 & 3.************************************************************************************************************************************
	var neoBuildingsCount = visibleObjControlerBuildings.currentVisibles2.length;
	if (neoBuildingsCount > 0)
	{
		currentShader = this.postFxShadersManager.pFx_shaders_array[7]; // lodBuilding depth.***
		shaderProgram = currentShader.program;
		gl.useProgram(shaderProgram);
		gl.enableVertexAttribArray(currentShader.position3_loc);

		gl.uniformMatrix4fv(currentShader.modelViewProjectionMatrix4RelToEye_loc, false, this.sceneState.modelViewProjRelToEyeMatrix._floatArrays);
		gl.uniformMatrix4fv(currentShader.modelViewMatrix4RelToEye_loc, false, this.sceneState.modelViewRelToEyeMatrix._floatArrays); // original.***
		gl.uniformMatrix4fv(currentShader.modelViewMatrix4_loc, false, this.sceneState.modelViewMatrix._floatArrays);
		gl.uniformMatrix4fv(currentShader.projectionMatrix4_loc, false, this.sceneState.projectionMatrix._floatArrays);
		gl.uniform3fv(currentShader.cameraPosHIGH_loc, this.sceneState.encodedCamPosHigh);
		gl.uniform3fv(currentShader.cameraPosLOW_loc, this.sceneState.encodedCamPosLow);

		gl.uniform1f(currentShader.near_loc, this.sceneState.camera.frustum.near);
		gl.uniform1f(currentShader.far_loc, this.sceneState.camera.frustum.far);

		gl.uniform1i(currentShader.hasAditionalMov_loc, true);
		gl.uniform3fv(currentShader.aditionalMov_loc, [0.0, 0.0, 0.0]); //.***
		
		this.renderer.renderNeoBuildingsLOD2AsimetricVersion(gl, visibleObjControlerBuildings, this, currentShader, renderTexture, ssao_idx);

		//if(currentShader.position3_loc !== -1)gl.disableVertexAttribArray(currentShader.position3_loc);
	}
	
	if (currentShader)
	{
		//if(currentShader.position3_loc !== -1)gl.disableVertexAttribArray(currentShader.position3_loc);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
MagoManager.prototype.createDefaultShaders = function(gl) 
{
	// here creates the necessary shaders for mago3d.***
	// 1) ModelReferences ssaoShader.******************************************************************************
	var shaderName = "modelReferencesSsao";
	var shader = this.postFxShadersManager.newShader(shaderName);
	var ssao_vs_source = ShaderSource.ModelRefSsaoVS;
	var ssao_fs_source = ShaderSource.ModelRefSsaoFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.postFxShadersManager.getShader(gl, ssao_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.postFxShadersManager.getShader(gl, ssao_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);
			
	var uniformDataPair;
	uniformDataPair = shader.newUniformDataPair("Matrix4fv", "mvpMat4RelToEye");
	uniformDataPair.uniformLocation = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	uniformDataPair.matrix4fv = this.sceneState.modelViewProjRelToEyeMatrix._floatArrays;
	
	uniformDataPair = shader.newUniformDataPair("Matrix4fv", "mvMat4RelToEye");
	uniformDataPair.uniformLocation = gl.getUniformLocation(shader.program, "modelViewMatrixRelToEye");
	uniformDataPair.matrix4fv = this.sceneState.modelViewRelToEyeMatrix._floatArrays;
	
	uniformDataPair = shader.newUniformDataPair("Matrix4fv", "pMat4");
	uniformDataPair.uniformLocation = gl.getUniformLocation(shader.program, "projectionMatrix");
	uniformDataPair.matrix4fv = this.sceneState.projectionMatrix._floatArrays;
	
	uniformDataPair = shader.newUniformDataPair("Vec3fv", "encodedCamPosHigh");
	uniformDataPair.uniformLocation = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	uniformDataPair.vec3fv = this.sceneState.encodedCamPosHigh;
	
	uniformDataPair = shader.newUniformDataPair("Vec3fv", "encodedCamPosLow");
	uniformDataPair.uniformLocation = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	uniformDataPair.vec3fv = this.sceneState.encodedCamPosLow;
	
	uniformDataPair = shader.newUniformDataPair("Matrix4fv", "normalMat4");
	uniformDataPair.uniformLocation = gl.getUniformLocation(shader.program, "normalMatrix4");
	uniformDataPair.matrix4fv = this.sceneState.normalMatrix4._floatArrays;
	
	uniformDataPair = shader.newUniformDataPair("1f", "frustumFar");
	uniformDataPair.uniformLocation = gl.getUniformLocation(shader.program, "far");
	uniformDataPair.floatValue = this.sceneState.camera.frustum.far;
	
	uniformDataPair = shader.newUniformDataPair("1f", "fovy");
	uniformDataPair.uniformLocation = gl.getUniformLocation(shader.program, "fov");
	uniformDataPair.floatValue = this.sceneState.camera.frustum.fovyRad;
	
	uniformDataPair = shader.newUniformDataPair("1f", "aspectRatio");
	uniformDataPair.uniformLocation = gl.getUniformLocation(shader.program, "aspectRatio");
	uniformDataPair.floatValue = this.sceneState.camera.frustum.aspectRatio;
	
	uniformDataPair = shader.newUniformDataPair("1i", "drawBuffWidht");
	uniformDataPair.uniformLocation = gl.getUniformLocation(shader.program, "screenWidth");
	uniformDataPair.intValue = this.sceneState.drawingBufferWidth;
	
	uniformDataPair = shader.newUniformDataPair("1i", "drawBuffHeight");
	uniformDataPair.uniformLocation = gl.getUniformLocation(shader.program, "screenHeight");
	uniformDataPair.intValue = this.sceneState.drawingBufferHeight;
	
	//gl.uniform2fv(currentShader.noiseScale2_loc, [this.depthFboNeo.width/this.noiseTexture.width, this.depthFboNeo.height/this.noiseTexture.height]);
	//gl.uniform3fv(currentShader.kernel16_loc, this.kernel);
			
	uniformDataPair = shader.newUniformDataPair("1i", "depthTex");
	uniformDataPair.uniformLocation = gl.getUniformLocation(shader.program, "depthTex");
	uniformDataPair.intValue = 0;
	
	uniformDataPair = shader.newUniformDataPair("1i", "noiseTex");
	uniformDataPair.uniformLocation = gl.getUniformLocation(shader.program, "noiseTex");
	uniformDataPair.intValue = 1;
	
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param cameraPosition 카메라 입장에서 화면에 그리기 전에 객체를 그릴 필요가 있는지 유무를 판단하는 값
 * @param scene 변수
 * @param shader 변수
 * @param renderTexture 변수
 * @param ssao_idx 변수
 * @param neoRefLists_array 변수
 */
MagoManager.prototype.renderLodBuilding = function(gl, cameraPosition, scene, shader, renderTexture, ssao_idx, lodBuilding) 
{
	// file loaded but not parsed.***
	if (lodBuilding.fileLoadState === CODE.fileLoadState.LOADING_FINISHED) 
	{
		lodBuilding.parseArrayBuffer(gl, this.readerWriter);
	}

	this.renderer.renderLodBuilding(gl, lodBuilding, this, shader, ssao_idx);
	/*
	// picking mode.***********************************************************************************
	if(ssao_idx === -1) {
		// picking mode.***
		this.selectionCandidateObjectsArray.length = 0; // init.***

		// set byteColor codes for references objects.***
		var red = 0, green = 0, blue = 0, alfa = 255;

		// 1) Exterior objects.***
		var neoRefListsArray = neoRefLists_array;
		//var neoRefListsArray = this.detailed_neoBuilding._neoRefLists_Container.neoRefsLists_Array;
		var neoRefLists_count = neoRefListsArray.length;
		for(var i = 0; i<neoRefLists_count; i++) {
			var neoRefList = neoRefListsArray[i];
			var neoRefsCount = neoRefList.neoRefs_Array.length;
			for(var j=0; j<neoRefsCount; j++) {
				var neoRef = neoRefList.neoRefs_Array[j];
				if(neoRef.selColor4 === undefined) neoRef.selColor4 = new Color();

				neoRef.selColor4.set(red, green, blue, alfa);
				this.selectionCandidateObjectsArray.push(neoRef);
				blue++;
				if(blue >= 254) {
					blue = 0;
					green++;
					if(green >= 254) {
						red++;
					}
				}
			}
		}
	}

	if(ssao_idx === -1) {
		var isInterior = false; // no used.***

		this.renderer.renderNeoRefListsColorSelection(gl, neoRefLists_array, this.detailed_neoBuilding, this, isInterior, shader, renderTexture, ssao_idx);
	} else {
		var isInterior = false; // no used.***
		this.renderer.renderNeoRefLists(gl, neoRefLists_array, this.detailed_neoBuilding, this, isInterior, shader, renderTexture, ssao_idx);
	}
	*/
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param BR_Project 변수
 */
MagoManager.prototype.createFirstTimeVBOCacheKeys = function(gl, BR_Project) 
{
	var simpBuildingV1 = BR_Project._simpleBuilding_v1;
	var simpleObj = BR_Project._simpleBuilding_v1._simpleObjects_array[0];
	var vt_cacheKey = simpleObj._vtCacheKeys_container._vtArrays_cacheKeys_array[0];

	// interleaved vertices_texCoords.***
	vt_cacheKey._verticesArray_cacheKey = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vt_cacheKey._verticesArray_cacheKey);
	gl.bufferData(gl.ARRAY_BUFFER, simpleObj._vtCacheKeys_container._vtArrays_cacheKeys_array[0].verticesArrayBuffer, gl.STATIC_DRAW);
	simpleObj._vtCacheKeys_container._vtArrays_cacheKeys_array[0].verticesArrayBuffer = null;

	// normals.***
	if (simpleObj._vtCacheKeys_container._vtArrays_cacheKeys_array[0].normalsArrayBuffer !== undefined) 
	{
		vt_cacheKey._normalsArray_cacheKey = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vt_cacheKey._normalsArray_cacheKey);
		gl.bufferData(gl.ARRAY_BUFFER, simpleObj._vtCacheKeys_container._vtArrays_cacheKeys_array[0].normalsArrayBuffer, gl.STATIC_DRAW);
		simpleObj._vtCacheKeys_container._vtArrays_cacheKeys_array[0].normalsArrayBuffer = null;
	}

	// Simple building texture(create 1pixel X 1pixel bitmap).****************************************************
	// https://developer.mozilla.org/en-US/docs/Web/API/Webgl_API/Tutorial/Using_textures_in_Webgl
	if (simpBuildingV1._simpleBuildingTexture === undefined) { simpBuildingV1._simpleBuildingTexture = gl.createTexture(); }

	// Test wait for texture to load.********************************************
	//http://stackoverflow.com/questions/19722247/webgl-wait-for-texture-to-load
	gl.bindTexture(gl.TEXTURE_2D, simpBuildingV1._simpleBuildingTexture);
	//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255])); // red
	//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([90, 80, 85, 255])); // red
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([240, 240, 240, 255])); // red
	gl.bindTexture(gl.TEXTURE_2D, null);
	BR_Project._f4d_nailImage_readed_finished = true;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param scene 변수
 */
MagoManager.prototype.reCalculateModelViewProjectionRelToEyeMatrix = function(scene) 
{
	for (var i=0; i<16; i++) 
	{
		if (scene.context._us._modelView[i] === 0) { return; }
	}

	var modelViewRelToEye = new Cesium.Matrix4();
	modelViewRelToEye = Cesium.Matrix4.clone(scene.context._us._modelView);
	modelViewRelToEye[12] = 0.0;
	modelViewRelToEye[13] = 0.0;
	modelViewRelToEye[14] = 0.0;
	var modelViewProjectionRelToEye = new Cesium.Matrix4();
	Cesium.Matrix4.multiply(scene.context._us._projection, modelViewRelToEye, modelViewProjectionRelToEye);
	Cesium.Matrix4.toArray(modelViewProjectionRelToEye, this.modelViewProjRelToEye_matrix);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param scene 변수
 * @param isLastFrustum 변수
 */
MagoManager.prototype.renderTerranTileServiceFormatPostFxShader = function(scene, isLastFrustum) 
{
	if (!isLastFrustum) { return; }
	if (this.isCameraInsideNeoBuilding) { return; }

	var gl = scene.context._gl;
	var cameraPosition = scene.context._us._cameraPosition;
	var cullingVolume = scene._frameState.cullingVolume;
	//	var modelViewProjectionRelativeToEye = scene.context._us._modelViewProjectionRelativeToEye;

	gl.disable(gl.CULL_FACE);

	// Check if camera was moved considerably for update the renderables objects.***
	if (this.detailed_building) 
	{
		this.squareDistUmbral = 4.5*4.5;
	}
	else 
	{
		this.squareDistUmbral = 50*50;
	}
	this.isCameraMoved(cameraPosition, this.squareDistUmbral);

	if (this.depthFbo === undefined) { this.depthFbo = new FBO(gl, scene.drawingBufferWidth, scene.drawingBufferHeight); }
	if (this.ssaoFbo === undefined) { this.ssaoFbo = new FBO(gl, scene.drawingBufferWidth, scene.drawingBufferHeight); } // no used.***

	// Another check for depthBuffer.***
	if (this.depthFbo.width !== scene.drawingBufferWidth || this.depthFbo.height !== scene.drawingBufferHeight) 
	{
		this.depthFbo = new FBO(gl, scene.drawingBufferWidth, scene.drawingBufferHeight);
	}

	//if(cameraMoved && !this.isCameraMoving)
	if (!this.isCameraMoving) 
	{
		this.currentVisibleBuildings_array.length = 0; // Init.***
		this.currentVisibleBuildings_LOD0_array.length = 0; // Init.***
		this.detailed_building;

		//this.doFrustumCulling(cullingVolume, this.currentVisibleBuildings_array, cameraPosition); // delete this.***
		this.doFrustumCullingTerranTileServiceFormat(gl, cullingVolume, this.currentVisibleBuildings_array, cameraPosition);
	}

	// Calculate "modelViewProjectionRelativeToEye".*********************************************************
	this.reCalculateModelViewProjectionRelToEyeMatrix(scene);

	//Cesium.Matrix4.toArray(_modelViewProjectionRelativeToEye, this.modelViewProjRelToEye_matrix);
	Cesium.Matrix4.toArray(scene._context._us._modelViewRelativeToEye, this.modelViewRelToEye_matrix); // Original.***
	Cesium.Matrix4.toArray(scene._context._us._modelView, this.modelView_matrix);
	Cesium.Matrix4.toArray(scene._context._us._projection, this.projection_matrix);
	//End Calculate "modelViewProjectionRelativeToEye".------------------------------------------------------

	// Calculate encodedCamPosMC high and low values.********************************************************
	this.calculateEncodedCameraPositionMCHighLow(this.encodedCamPosMC_High, this.encodedCamPosMC_Low, cameraPosition);

	// *************************************************************************************************************************************************
	// Now, render the detailed building if exist.******************************************************************************************************
	// This is OLD.************************************
	var currentShader;
	if (this.detailed_building && isLastFrustum) 
	{
		currentShader = this.shadersManager.getMagoShader(0);
		//this.render_DetailedBuilding(gl, cameraPosition, _modelViewProjectionRelativeToEye, scene, currentShader);
	}
	// End render the detailed building if exist.---------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------------------------------------
	// Save the cesium framebuffer.***
	//	var cesium_frameBuffer = scene._context._currentFramebuffer._framebuffer;
	//var cesium_frameBuffer = scene._context._currentFramebuffer;

	// Now, render the simple visible buildings.***************************************************************************
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.depthRange(0, 1);

	var shaderProgram;

	// Calculate the normal_matrix.***
	//https://developer.mozilla.org/en-US/docs/Web/API/Webgl_API/Tutorial/Lighting_in_Webgl
	// this code must be executed if the camera was moved.***
	this.isCameraMoved(cameraPosition, 10);
	//if(cameraLittleMoved)
	//	{
	var mvMat = scene._context._us._modelView; // original.***
	//var mvMat = scene._context._us._modelViewRelativeToEye;
	//mvMat[12] = 0.0;
	//mvMat[13] = 0.0;
	//mvMat[14] = 0.0;
	var mvMat_inv = new Cesium.Matrix4();
	mvMat_inv = Cesium.Matrix4.inverseTransformation(mvMat, mvMat_inv);
	//var normalMat = new Cesium.Matrix4();
	this.normalMat4 = Cesium.Matrix4.transpose(mvMat_inv, this.normalMat4);// Original.***
	//this.normalMat4 = Cesium.Matrix4.clone(mvMat_inv, this.normalMat4);
	this.normalMat3 = Cesium.Matrix4.getRotation(this.normalMat4, this.normalMat3);
	//	}

	Cesium.Matrix3.toArray(this.normalMat3, this.normalMat3_array);
	Cesium.Matrix4.toArray(this.normalMat4, this.normalMat4_array);
	//gl.uniformMatrix3fv(currentShader._NormalMatrix, false, this.normalMat3_array);

	this.render_time = 0;
	if (this.isCameraMoving) 
	{
		this.dateSC = new Date();
		this.currentTimeSC;
		this.startTimeSC = this.dateSC.getTime();
	}

	this.currentVisibleBuildingsPost_array.length = 0;

	var filePath_scratch = "";
	var camera = scene._camera;
	var frustum = camera.frustum;
	//	var current_frustum_near = scene._context._us._currentFrustum.x;
	var current_frustum_far = scene._context._us._currentFrustum.y;
	current_frustum_far = 5000.0;

	// Depth render.********************************************************
	// Depth render.********************************************************
	// Depth render.********************************************************
	this.depthFbo.bind(); // DEPTH START.**************************************************************************************************************************************************
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0, this.depthFbo.width, this.depthFbo.height);

	currentShader = this.postFxShadersManager.pFx_shaders_array[0];

	shaderProgram = currentShader.program;
	gl.useProgram(shaderProgram);
	//gl.enableVertexAttribArray(currentShader.texCoord2_loc); // no use texcoords.***
	gl.enableVertexAttribArray(currentShader.position3_loc);
	gl.enableVertexAttribArray(currentShader.normal3_loc);

	gl.uniformMatrix4fv(currentShader.modelViewProjectionMatrix4RelToEye_loc, false, this.modelViewProjRelToEye_matrix);
	gl.uniformMatrix4fv(currentShader.modelViewMatrix4RelToEye_loc, false, this.modelViewRelToEye_matrix); // original.***
	gl.uniformMatrix4fv(currentShader.modelViewMatrix4_loc, false, this.modelView_matrix);
	gl.uniformMatrix4fv(currentShader.projectionMatrix4_loc, false, this.projection_matrix);
	gl.uniform3fv(currentShader.cameraPosHIGH_loc, this.encodedCamPosMC_High);
	gl.uniform3fv(currentShader.cameraPosLOW_loc, this.encodedCamPosMC_Low);

	gl.uniform1f(currentShader.near_loc, frustum._near);
	//gl.uniform1f(currentShader.far_loc, frustum._far);	// Original (bad)..***
	gl.uniform1f(currentShader.far_loc, current_frustum_far); // test (best)..***

	gl.uniformMatrix3fv(currentShader.normalMatrix3_loc, false, this.normalMat3_array);
	gl.uniformMatrix4fv(currentShader.normalMatrix4_loc, false, this.normalMat4_array);

	//gl.uniform1i(currentShader.useRefTransfMatrix_loc, false, false);

	// LOD0 BUILDINGS.***************************************************************************************************************

	// Now, render LOD0 texture buildings.***
	var LOD0_projectsCount = this.currentVisibleBuildings_LOD0_array.length;
	for (var i=0; i<LOD0_projectsCount; i++) 
	{
		var BR_Project = this.currentVisibleBuildings_LOD0_array[i];

		//if(!this.isCameraMoving)
		//		{
		// Check if this building has readed 1- Header, 2- SimpBuilding, 3- NailImage.******************************
		if (BR_Project._header._f4d_version === 2) 
		{
			//if(!BR_Project._f4d_nailImage_readed && BR_Project._f4d_simpleBuilding_readed_finished)
			var simpleObj = BR_Project._simpleBuilding_v1._simpleObjects_array[0];
			if (simpleObj._vtCacheKeys_container._vtArrays_cacheKeys_array[0]._verticesArray_cacheKey === null) 
			{
				this.createFirstTimeVBOCacheKeys(gl, BR_Project);
				continue;
			}
			else if (!BR_Project._f4d_nailImage_readed) 
			{
				if (this.backGround_imageReadings_count < 100) 
				{
					this.backGround_imageReadings_count++;
					BR_Project._f4d_nailImage_readed = true;

					var simpBuildingV1 = BR_Project._simpleBuilding_v1;
					this.readerWriter.readNailImageOfArrayBuffer(gl, simpBuildingV1.textureArrayBuffer, BR_Project, this.readerWriter, this, 3);
				}
				continue;
			}
			else if (!BR_Project._f4d_lod0Image_readed && BR_Project._f4d_nailImage_readed_finished && BR_Project._f4d_lod0Image_exists) 
			{
				if (!this.isCameraMoving && this.backGround_fileReadings_count < 1) 
				{
					//filePath_scratch = this.readerWriter.geometryDataPath +"/Result_xdo2f4d/" + BR_Project._f4d_rawPathName + ".jpg"; // Old.***
					filePath_scratch = this.readerWriter.geometryDataPath + Constant.RESULT_XDO2F4D + BR_Project._header._global_unique_id + ".jpg";

					this.readerWriter.readNailImage(gl, filePath_scratch, BR_Project, this.readerWriter, this, 0);
					this.backGround_fileReadings_count ++;

				}
				//continue;
			}
		}
		else 
		{
			this.currentVisibleBuildingsPost_array.push(BR_Project);
		}
		//		}

		//if(BR_Project._simpleBuilding_v1 && BR_Project._f4d_simpleBuilding_readed_finished)// Original.***
		// Test
		if (BR_Project._simpleBuilding_v1) 
		{
			//renderSimpleBuildingV1PostFxShader
			this.renderer.renderSimpleBuildingV1PostFxShader(gl, BR_Project, this, -1, currentShader); // 3 = lod3.***
			/*
			if(BR_Project._f4d_lod0Image_exists)
			{
				if(BR_Project._f4d_lod0Image_readed_finished)
					this.renderer.renderSimpleBuildingV1PostFxShader(gl, BR_Project, this, -1, currentShader); // 0 = lod0.***

				else if(BR_Project._f4d_nailImage_readed_finished)
				{
					this.renderer.renderSimpleBuildingV1PostFxShader(gl, BR_Project, this, -1, currentShader); // 3 = lod3.***
				}
			}
			else if(BR_Project._f4d_nailImage_readed_finished)
			{
				this.renderer.renderSimpleBuildingV1PostFxShader(gl, BR_Project, this, -1, currentShader); // 3 = lod3.***
			}
			*/
		}
	}

	var projects_count = this.currentVisibleBuildings_array.length;
	for (var p_counter = 0; p_counter<projects_count; p_counter++) 
	{
		var BR_Project = this.currentVisibleBuildings_array[p_counter];

		//if(!this.isCameraMoving)
		//		{
		// Check if this building has readed 1- Header, 2- SimpBuilding, 3- NailImage.******************************
		if (BR_Project._header._f4d_version === 2) 
		{
			//if(!BR_Project._f4d_nailImage_readed && BR_Project._f4d_simpleBuilding_readed_finished)
			var simpleObj = BR_Project._simpleBuilding_v1._simpleObjects_array[0];
			if (simpleObj._vtCacheKeys_container._vtArrays_cacheKeys_array[0]._verticesArray_cacheKey === null) 
			{
				this.createFirstTimeVBOCacheKeys(gl, BR_Project);
				continue;
			}
			else if (!BR_Project._f4d_nailImage_readed) 
			{
				if (this.backGround_imageReadings_count < 100) 
				{
					this.backGround_imageReadings_count++;
					BR_Project._f4d_nailImage_readed = true;

					var simpBuildingV1 = BR_Project._simpleBuilding_v1;
					this.readerWriter.readNailImageOfArrayBuffer(gl, simpBuildingV1.textureArrayBuffer, BR_Project, this.readerWriter, this, 3);
				}
				continue;
			}
		}
		else 
		{
			this.currentVisibleBuildingsPost_array.push(BR_Project);
		}
		//		}

		//if(BR_Project._simpleBuilding_v1 && BR_Project._f4d_simpleBuilding_readed_finished)// Original.***
		// Test
		if (BR_Project._simpleBuilding_v1 && BR_Project._f4d_nailImage_readed_finished) 
		{
			this.renderer.renderSimpleBuildingV1PostFxShader(gl, BR_Project, this, -1, currentShader); // 3 = lod3.***
		}
	}
	//gl.disableVertexAttribArray(currentShader.texCoord2_loc);
	gl.disableVertexAttribArray(currentShader.position3_loc);
	gl.disableVertexAttribArray(currentShader.normal3_loc);
	this.depthFbo.unbind(); // DEPTH END.*****************************************************************************************************************************************************************

	// Now, ssao.************************************************************
	scene._context._currentFramebuffer._bind();

	if (this.depthFbo.width !== scene.drawingBufferWidth || this.depthFbo.height !== scene.drawingBufferHeight) 
	{
		this.depthFbo = new FBO(gl, scene.drawingBufferWidth, scene.drawingBufferHeight);
	}

	//this.ssaoFbo.bind();// SSAO START.********************************************************************************************************************************************************************
	gl.clearColor(0, 0, 0, 1);
	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0, scene.drawingBufferWidth, scene.drawingBufferHeight);

	if (this.noiseTexture === undefined) { this.noiseTexture = genNoiseTextureRGBA(gl, 4, 4, this.pixels); }

	currentShader = this.postFxShadersManager.pFx_shaders_array[1];

	shaderProgram = currentShader.program;
	gl.useProgram(shaderProgram);
	gl.enableVertexAttribArray(currentShader.texCoord2_loc);
	gl.enableVertexAttribArray(currentShader.position3_loc);
	gl.enableVertexAttribArray(currentShader.normal3_loc);

	gl.uniformMatrix4fv(currentShader.modelViewProjectionMatrix4RelToEye_loc, false, this.modelViewProjRelToEye_matrix);
	gl.uniform3fv(currentShader.cameraPosHIGH_loc, this.encodedCamPosMC_High);
	gl.uniform3fv(currentShader.cameraPosLOW_loc, this.encodedCamPosMC_Low);
	gl.uniformMatrix4fv(currentShader.projectionMatrix4_loc, false, this.projection_matrix);
	gl.uniformMatrix4fv(currentShader.modelViewMatrix4_loc, false, this.modelView_matrix); // original.***

	gl.uniform1f(currentShader.near_loc, frustum._near);
	//gl.uniform1f(currentShader.far_loc, frustum._far); // Original.***
	gl.uniform1f(currentShader.far_loc, current_frustum_far); // test.***

	gl.uniformMatrix3fv(currentShader.normalMatrix3_loc, false, this.normalMat3_array);
	gl.uniformMatrix4fv(currentShader.normalMatrix4_loc, false, this.normalMat4_array);

	gl.uniform1i(currentShader.depthTex_loc, 0);
	gl.uniform1i(currentShader.noiseTex_loc, 1);
	gl.uniform1i(currentShader.diffuseTex_loc, 2);
	gl.uniform1f(currentShader.fov_loc, frustum._fovy);	// "frustum._fov" is in radians.***
	gl.uniform1f(currentShader.aspectRatio_loc, frustum._aspectRatio);
	gl.uniform1f(currentShader.screenWidth_loc, scene.drawingBufferWidth);	//scene._canvas.width, scene._canvas.height
	gl.uniform1f(currentShader.screenHeight_loc, scene.drawingBufferHeight);
	gl.uniform2fv(currentShader.noiseScale2_loc, [this.depthFbo.width/this.noiseTexture.width, this.depthFbo.height/this.noiseTexture.height]);
	gl.uniform3fv(currentShader.kernel16_loc, this.kernel);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.depthFbo.colorBuffer);  // original.***
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture);

	// LOD0 BUILDINGS.***************************************************************************************************************
	// Now, render LOD0 texture buildings.***
	var LOD0_projectsCount = this.currentVisibleBuildings_LOD0_array.length;
	for (var i=0; i<LOD0_projectsCount; i++) 
	{
		var BR_Project = this.currentVisibleBuildings_LOD0_array[i];

		//if(!this.isCameraMoving)
		//		{
		// Check if this building has readed 1- Header, 2- SimpBuilding, 3- NailImage.******************************
		if (BR_Project._header._f4d_version === 2) 
		{
			//if(!BR_Project._f4d_nailImage_readed && BR_Project._f4d_simpleBuilding_readed_finished)
			var simpleObj = BR_Project._simpleBuilding_v1._simpleObjects_array[0];
			if (simpleObj._vtCacheKeys_container._vtArrays_cacheKeys_array[0]._verticesArray_cacheKey === null) 
			{
				this.createFirstTimeVBOCacheKeys(gl, BR_Project);
				continue;
			}
			else if (!BR_Project._f4d_nailImage_readed) 
			{
				if (this.backGround_imageReadings_count < 100) 
				{
					this.backGround_imageReadings_count++;
					BR_Project._f4d_nailImage_readed = true;

					var simpBuildingV1 = BR_Project._simpleBuilding_v1;
					this.readerWriter.readNailImageOfArrayBuffer(gl, simpBuildingV1.textureArrayBuffer, BR_Project, this.readerWriter, this, 3);
				}
				continue;
			}
			else if (!BR_Project._f4d_lod0Image_readed && BR_Project._f4d_nailImage_readed_finished && BR_Project._f4d_lod0Image_exists) 
			{
				if (!this.isCameraMoving && this.backGround_fileReadings_count < 1) 
				{
					//filePath_scratch = this.readerWriter.geometryDataPath +"/Result_xdo2f4d/" + BR_Project._f4d_rawPathName + ".jpg"; // Old.***
					filePath_scratch = this.readerWriter.geometryDataPath + Constant.RESULT_XDO2F4D + BR_Project._header._global_unique_id + ".jpg";

					this.readerWriter.readNailImage(gl, filePath_scratch, BR_Project, this.readerWriter, this, 0);
					this.backGround_fileReadings_count ++;
				}
				//continue;
			}
		}
		else 
		{
			this.currentVisibleBuildingsPost_array.push(BR_Project);
		}

		//		}

		//if(BR_Project._simpleBuilding_v1 && BR_Project._f4d_simpleBuilding_readed_finished)// Original.***
		// Test
		if (BR_Project._simpleBuilding_v1) 
		{
			//renderSimpleBuildingV1PostFxShader
			if (BR_Project._f4d_lod0Image_exists) 
			{
				if (BR_Project._f4d_lod0Image_readed_finished) { this.renderer.renderSimpleBuildingV1PostFxShader(gl, BR_Project, this, 0, currentShader); } // 0 = lod0.***
				else if (BR_Project._f4d_nailImage_readed_finished) 
				{
					this.renderer.renderSimpleBuildingV1PostFxShader(gl, BR_Project, this, 3, currentShader); // 3 = lod3.***
				}
			}
			else if (BR_Project._f4d_nailImage_readed_finished) 
			{
				this.renderer.renderSimpleBuildingV1PostFxShader(gl, BR_Project, this, 3, currentShader); // 3 = lod3.***
			}
		}
	}

	var projects_count = this.currentVisibleBuildings_array.length;
	for (var p_counter = 0; p_counter<projects_count; p_counter++) 
	{
		/*
		if(!isLastFrustum && this.isCameraMoving && timeControlCounter === 0)
		{
			date = new Date();
			currentTime = date.getTime();
			secondsUsed = currentTime - startTime;
			if(secondsUsed > 20) // miliseconds.***
			{
				gl.disableVertexAttribArray(shader._texcoord);
				gl.disableVertexAttribArray(shader._position);
				return;
			}
		}
		*/

		var BR_Project = this.currentVisibleBuildings_array[p_counter];

		//if(!this.isCameraMoving)
		//		{
		// Check if this building has readed 1- Header, 2- SimpBuilding, 3- NailImage.******************************
		if (BR_Project._header._f4d_version === 2) 
		{
			//if(!BR_Project._f4d_nailImage_readed && BR_Project._f4d_simpleBuilding_readed_finished)
			var simpleObj = BR_Project._simpleBuilding_v1._simpleObjects_array[0];
			if (simpleObj._vtCacheKeys_container._vtArrays_cacheKeys_array[0]._verticesArray_cacheKey === null) 
			{
				this.createFirstTimeVBOCacheKeys(gl, BR_Project);
				continue;
			}
			else if (!BR_Project._f4d_nailImage_readed) 
			{
				if (this.backGround_imageReadings_count < 100) 
				{
					this.backGround_imageReadings_count++;
					BR_Project._f4d_nailImage_readed = true;

					var simpBuildingV1 = BR_Project._simpleBuilding_v1;
					this.readerWriter.readNailImageOfArrayBuffer(gl, simpBuildingV1.textureArrayBuffer, BR_Project, this.readerWriter, this, 3);
				}
				continue;
			}
		}
		else 
		{
			this.currentVisibleBuildingsPost_array.push(BR_Project);
		}

		//		}

		//if(BR_Project._simpleBuilding_v1 && BR_Project._f4d_simpleBuilding_readed_finished)// Original.***
		// Test
		if (BR_Project._simpleBuilding_v1 && BR_Project._f4d_nailImage_readed_finished) 
		{
			this.renderer.renderSimpleBuildingV1PostFxShader(gl, BR_Project, this, 3, currentShader); // 3 = lod3.***
		}
		/*
		if(this.isCameraMoving)
		{
			this.dateSC = new Date();
			this.currentTimeSC = this.dateSC.getTime();
			if(this.currentTimeSC-this.startTimeSC > this.maxMilisecondsForRender)
			{
				gl.disableVertexAttribArray(shader._texcoord);
				gl.disableVertexAttribArray(shader._position);
				return;
			}
		}
		*/
	}

	gl.activeTexture(gl.TEXTURE0);
	//this.ssaoFbo.unbind();

	gl.disableVertexAttribArray(currentShader.texCoord2_loc);
	gl.disableVertexAttribArray(currentShader.position3_loc);
	gl.disableVertexAttribArray(currentShader.normal3_loc);
	//this.ssaoFbo.unbind();// SSAO END.********************************************************************************************************************************************************************

	// Now, blur.************************************************************
	/*
	scene._context._currentFramebuffer._bind();

	Cesium.Matrix4.toArray(scene._context._us._modelView, this.modelView_matrix);
	Cesium.Matrix4.toArray(scene._context._us._projection, this.projection_matrix);

	currentShader = this.postFxShadersManager.pFx_shaders_array[2]; // blur.***

	shaderProgram = currentShader.program;
	gl.useProgram(shaderProgram);

	gl.enableVertexAttribArray(currentShader.texCoord2_loc);
	gl.enableVertexAttribArray(currentShader.position3_loc);
	//gl.enableVertexAttribArray(currentShader.normal3_loc);

	this.modelView_matrix[12] = 0.0;
	this.modelView_matrix[13] = 0.0;
	this.modelView_matrix[14] = 0.0;

	gl.uniformMatrix4fv(currentShader.projectionMatrix4_loc, false, this.projection_matrix);
	gl.uniformMatrix4fv(currentShader.modelViewMatrix4_loc, false, this.modelView_matrix);

	gl.uniform1i(currentShader.colorTex_loc, 0);
	gl.uniform2fv(currentShader.texelSize_loc, [1/this.ssaoFbo.width, 1/this.ssaoFbo.height]);
	gl.activeTexture(gl.TEXTURE0);
	//gl.bindTexture(gl.TEXTURE_2D, this.ssaoFbo.colorBuffer); // original.***
	gl.bindTexture(gl.TEXTURE_2D, scene._context._currentFramebuffer.colorBuffer);
	//scene._context._currentFramebuffer._bind();
	this.ssaoFSQuad.draw(currentShader, gl);
	gl.activeTexture(gl.TEXTURE0);

	gl.disableVertexAttribArray(currentShader.texCoord2_loc);
	gl.disableVertexAttribArray(currentShader.position3_loc);
	//gl.disableVertexAttribArray(currentShader.normal3_loc);
	*/
	// END BLUR.**************************************************************************************************************************************************************************************************************

	gl.viewport(0, 0, scene._canvas.width, scene._canvas.height);

	scene._context._currentFramebuffer._bind();
	//this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, cesium_frameBuffer);
	// Render the lasts simpleBuildings.***

	var last_simpBuilds_count = this.currentVisibleBuildingsPost_array.length;

	for (var i=0; i<last_simpBuilds_count; i++) 
	{
		this.renderer.render_F4D_simpleBuilding(	gl, this.currentVisibleBuildingsPost_array[i], this.modelViewProjRelToEye_matrix,
			this.encodedCamPosMC_High, this.encodedCamPosMC_Low, this.shadersManager);
	}

	//gl.useProgram(null);
	//gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param frustumVolume 변수
 * @param neoVisibleBuildingsArray 변수
 * @param cameraPosition 변수
 * @returns neoVisibleBuildingsArray
 */
MagoManager.prototype.deleteNeoBuilding = function(gl, neoBuilding) 
{
	// check if the neoBuilding id the selected building.***
	var vboMemoryManager = this.vboMemoryManager;
	if (neoBuilding === this.buildingSelected)
	{
		this.buildingSelected = undefined;
		this.octreeSelected = undefined;
		this.objectSelected = undefined;
	}

	neoBuilding.metaData.deleteObjects();
	neoBuilding.metaData.fileLoadState = CODE.fileLoadState.READY;

	var blocksCount = neoBuilding.motherBlocksArray.length;
	for (var i=0; i<blocksCount; i++)
	{
		if (neoBuilding.motherBlocksArray[i])
		{ neoBuilding.motherBlocksArray[i].deleteObjects(gl, vboMemoryManager); }
		neoBuilding.motherBlocksArray[i] = undefined;
	}
	neoBuilding.motherBlocksArray = [];

	var referencesCount = neoBuilding.motherNeoReferencesArray.length;
	for (var i=0; i<referencesCount; i++)
	{
		if (neoBuilding.motherNeoReferencesArray[i])
		{ neoBuilding.motherNeoReferencesArray[i].deleteGlObjects(gl, vboMemoryManager); }
		neoBuilding.motherNeoReferencesArray[i] = undefined;
	}
	neoBuilding.motherNeoReferencesArray = [];

	// Textures loaded.***************************************************
	//neoBuilding.textures_loaded = [];
	
	// The octree.********************************************************
	if (neoBuilding.octree !== undefined)
	{ neoBuilding.octree.deleteGlObjects(gl, vboMemoryManager); }
	neoBuilding.octree = undefined; // f4d_octree. Interior objects.***
	neoBuilding.octreeLoadedAllFiles = false;
	
	//neoBuilding.buildingFileName = "";

	neoBuilding.allFilesLoaded = false;
	neoBuilding.isReadyToRender = false;

	// The simple building.***********************************************
	//neoBuilding.neoSimpleBuilding = undefined; // this is a simpleBuilding for Buildings with texture.***

	// The lodBuildings.***
	//neoBuilding.lod2Building = undefined;
	//neoBuilding.lod3Building = undefined;

};

/**
 * 카메라 영역에 벗어난 오브젝트의 렌더링은 비 활성화
 * 
 * @param frustumVolume 변수
 * @param cameraPosition 변수
 */
MagoManager.prototype.doFrustumCullingNeoBuildings = function(frustumVolume, cameraPosition) 
{
	// This makes the visible buildings array.***
	//---------------------------------------------------------------------------------------------------------
	// Note: in this function, we do frustum culling and determine the detailedBuilding in same time.***
	var deleteBuildings = false;
	this.framesCounter += 1;
	if (this.framesCounter > 1000)
	{
		deleteBuildings = true;
		this.framesCounter = 0;
	}

	var squaredDistToCamera;
	var lod0_minSquaredDist = 100000;
	var lod1_minSquaredDist = 1;
	var lod2_minSquaredDist = 100000*10000;
	var lod3_minSquaredDist = 100000*9;

	this.visibleObjControlerBuildings.currentVisibles0.length = 0;
	this.visibleObjControlerBuildings.currentVisibles1.length = 0;
	this.visibleObjControlerBuildings.currentVisibles2.length = 0;
	this.visibleObjControlerBuildings.currentVisibles3.length = 0;

	var maxNumberOfCalculatingPositions = 100;
	var currentCalculatingPositionsCount = 0;
	
	if (this.boundingSphere_Aux === undefined)
	{
		this.boundingSphere_Aux = new Sphere();
	}

	for (var i=0, length = this.neoBuildingsList.neoBuildingsArray.length; i<length; i++) 
	{
		var neoBuilding = this.neoBuildingsList.get(i);

		if (this.renderingModeTemp === 2 && neoBuilding.isDemoBlock === false)
		{ continue; }

		if (neoBuilding.bbox === undefined)
		{
			if (currentCalculatingPositionsCount < maxNumberOfCalculatingPositions)
			{
				this.visibleObjControlerBuildings.currentVisibles0.push(neoBuilding);
				currentCalculatingPositionsCount++;
			}
			continue;
		}

		this.pointSC = neoBuilding.bbox.getCenterPoint(this.pointSC);

		var geoLoc = neoBuilding.geoLocDataManager.getGeoLocationData(0); // the idx = 0 -> is the 1rst (default).***
		if (geoLoc === undefined || geoLoc.pivotPoint === undefined)
		{ continue; }

		//var realBuildingPos = geoLoc.pivotPoint;
		var bboxCenterPoint = neoBuilding.bbox.getCenterPoint(bboxCenterPoint); // local bbox.
		var realBuildingPos = geoLoc.tMatrix.transformPoint3D(bboxCenterPoint, realBuildingPos);
		if (neoBuilding.buildingType === "basicBuilding")
		{
			//lod0_minSquaredDist = 50000.0;
		}
		
		if (neoBuilding.buildingId === "ctships")
		{
			lod0_minSquaredDist = 100000000;
			lod1_minSquaredDist = 1;
			lod2_minSquaredDist = 10000000*10000;
			lod3_minSquaredDist = 100000*9;
		}

		this.radiusAprox_aux = (neoBuilding.bbox.maxX - neoBuilding.bbox.minX) * 1.2/2.0;
		squaredDistToCamera = cameraPosition.squareDistTo(realBuildingPos.x, realBuildingPos.y, realBuildingPos.z);
		squaredDistToCamera -= (this.radiusAprox_aux*this.radiusAprox_aux)*2;
		if (squaredDistToCamera > this.magoPolicy.getFrustumFarSquaredDistance())
		{
			if (deleteBuildings)
			{ 
				this.deleteNeoBuilding(this.sceneState.gl, neoBuilding); 
			}
			continue;
		}
			
		this.boundingSphere_Aux.setCenterPoint(realBuildingPos.x, realBuildingPos.y, realBuildingPos.z);
		var ratio = 1.0;
		if (this.renderingModeTemp === 0)
		{
			ratio = 1.2/2.0;
		}
		else if (this.renderingModeTemp === 1)
		{
			ratio = 4.2/2.0;
		}
		else if (this.renderingModeTemp === 2)
		{
			ratio = 1.2/2.0;
		}

		this.radiusAprox_aux = (neoBuilding.bbox.maxX - neoBuilding.bbox.minX) * ratio;

		this.boundingSphere_Aux.setRadius(this.radiusAprox_aux);
		
		var frustumCull = frustumVolume.intersectionSphere(this.boundingSphere_Aux); // cesium.***
		// intersect with Frustum
		if (frustumCull !== Constant.INTERSECTION_OUTSIDE) 
		{	
			if (this.isLastFrustum)
			{
				if (squaredDistToCamera < lod0_minSquaredDist) 
				{
					this.visibleObjControlerBuildings.currentVisibles0.push(neoBuilding);
				}
				else if (squaredDistToCamera < lod1_minSquaredDist) 
				{
					this.visibleObjControlerBuildings.currentVisibles1.push(neoBuilding);
				}
				else if (squaredDistToCamera < lod2_minSquaredDist) 
				{
					this.visibleObjControlerBuildings.currentVisibles2.push(neoBuilding);
				}
				else if (squaredDistToCamera < lod3_minSquaredDist) 
				{
					this.visibleObjControlerBuildings.currentVisibles3.push(neoBuilding);
				}
			}
			else
			{
				if (squaredDistToCamera < lod1_minSquaredDist) 
				{
					this.visibleObjControlerBuildings.currentVisibles1.push(neoBuilding);
				}
				else if (squaredDistToCamera < lod2_minSquaredDist) 
				{
					this.visibleObjControlerBuildings.currentVisibles2.push(neoBuilding);
				}
				else if (squaredDistToCamera < lod3_minSquaredDist) 
				{
					this.visibleObjControlerBuildings.currentVisibles3.push(neoBuilding);
				}
			}
		}
		else
		{
			if (deleteBuildings)
			{ this.deleteNeoBuilding(this.sceneState.gl, neoBuilding); }
		}
	}
};

/**
 * 카메라 영역에 벗어난 오브젝트의 렌더링은 비 활성화
 * 
 * @param frustumVolume 변수
 * @param cameraPosition 변수
 */
MagoManager.prototype.putBuildingToArraySortedByDist = function(buildingArray, neoBuilding) 
{
	// provisionally do this.
	var finished = false;
	var i=0;
	var idx;
	var buildingsCount = buildingArray.length;
	while (!finished && i<buildingsCount)
	{
		if (neoBuilding.squaredDistToCam < buildingArray[i].squaredDistToCam)
		{
			idx = i;
			finished = true;
		}
		i++;
	}
	
	if (finished)
	{
		buildingArray.splice(idx, 0, neoBuilding);
	}
	else 
	{
		buildingArray.push(neoBuilding);
	}
};

/**
 * 카메라 영역에 벗어난 오브젝트의 렌더링은 비 활성화
 * 
 * @param frustumVolume 변수
 * @param cameraPosition 변수
 */
MagoManager.prototype.doFrustumCullingSmartTiles = function(frustumVolume, cameraPosition) 
{
	// This makes the visible buildings array.
	var smartTile1 = this.smartTileManager.tilesArray[0];
	var smartTile2 = this.smartTileManager.tilesArray[1];
	if (this.intersectedLowestTilesArray == undefined)
	{ this.intersectedLowestTilesArray = []; }
	
	this.intersectedLowestTilesArray.length = 0; // init array.
	smartTile1.getFrustumIntersectedLowestTiles(frustumVolume, this.intersectedLowestTilesArray);
	smartTile2.getFrustumIntersectedLowestTiles(frustumVolume, this.intersectedLowestTilesArray);
	
	var tilesCount = this.intersectedLowestTilesArray.length;
	
	if (tilesCount == 0)
	{ return; }
	
	var squaredDistToCamera;
	var lod0_minSquaredDist = 100000;
	var lod1_minSquaredDist = 1;
	var lod2_minSquaredDist = 100000*10000;
	var lod3_minSquaredDist = 100000*10000*2;

	this.visibleObjControlerBuildings.currentVisibles0.length = 0;
	this.visibleObjControlerBuildings.currentVisibles1.length = 0;
	this.visibleObjControlerBuildings.currentVisibles2.length = 0;
	this.visibleObjControlerBuildings.currentVisibles3.length = 0;

	var maxNumberOfCalculatingPositions = 100;
	var currentCalculatingPositionsCount = 0;
	
	var lowestTile;
	var tileCenterPos;
	var buildingSeedsCount;
	var buildingSeed;
	var neoBuilding;
	var geoLoc;
	var bboxCenterPoint;
	var realBuildingPos;
	var parentBuilding;
	var longitude, latitude, altitude, heading, pitch, roll;
	
	for (var i=0; i<tilesCount; i++)
	{
		lowestTile = this.intersectedLowestTilesArray[i];
		tileCenterPos = lowestTile.sphereExtent.centerPoint;
		squaredDistToCamera = cameraPosition.squareDistTo(tileCenterPos.x, tileCenterPos.y, tileCenterPos.z);
		if (squaredDistToCamera > lod3_minSquaredDist)
		{ continue; }
		
		if (lowestTile.buildingsArray && lowestTile.buildingsArray.length > 0)
		{
			var buildingsCount = lowestTile.buildingsArray.length;
			for (var j=0; j<buildingsCount; j++)
			{
				// determine LOD for each building.
				neoBuilding = lowestTile.buildingsArray[j];
				
				if (neoBuilding.buildingId == "U310T")
				{ var hola = 0; }
	
				geoLoc = neoBuilding.geoLocDataManager.getGeoLocationData(0);
				if (geoLoc === undefined || geoLoc.pivotPoint === undefined)
				{ 
					geoLoc = neoBuilding.geoLocDataManager.newGeoLocationData("deploymentLoc");
					longitude = neoBuilding.metaData.geographicCoord.longitude;
					latitude = neoBuilding.metaData.geographicCoord.latitude;
					altitude = neoBuilding.metaData.geographicCoord.altitude;
					heading = neoBuilding.metaData.heading;
					pitch = neoBuilding.metaData.pitch;
					roll = neoBuilding.metaData.roll;
					ManagerUtils.calculateGeoLocationData(longitude, latitude, altitude+10, heading, pitch, roll, geoLoc, this);
					
					parentBuilding = neoBuilding;
					this.pointSC = parentBuilding.bbox.getCenterPoint(this.pointSC);
					
					if (neoBuilding.buildingId === "ctships")
					{
						// Test:
						// for this building dont translate the pivot point to the bbox center.***
						return;
					}
					//if (firstName !== "testId")
					//ManagerUtils.translatePivotPointGeoLocationData(geoLoc, this.pointSC );
					continue;
					
				}
				
				//realBuildingPos = geoLoc.pivotPoint;
				bboxCenterPoint = neoBuilding.bbox.getCenterPoint(bboxCenterPoint); // local bbox.
				realBuildingPos = geoLoc.tMatrix.transformPoint3D(bboxCenterPoint, realBuildingPos);
				
				if (neoBuilding.buildingId === "ctships")
				{
					lod0_minSquaredDist = 1000;
					lod1_minSquaredDist = 1;
					lod2_minSquaredDist = 10000000*10000;
					lod3_minSquaredDist = 100000*9;
				}

				this.radiusAprox_aux = (neoBuilding.bbox.maxX - neoBuilding.bbox.minX) * 1.2/2.0;
				squaredDistToCamera = cameraPosition.squareDistTo(realBuildingPos.x, realBuildingPos.y, realBuildingPos.z);
				squaredDistToCamera -= (this.radiusAprox_aux*this.radiusAprox_aux)*2;
				neoBuilding.squaredDistToCam = squaredDistToCamera;
				if (squaredDistToCamera > this.magoPolicy.getFrustumFarSquaredDistance())
				{
					continue;
				}
				//this.putBuildingToArraySortedByDist(this.visibleObjControlerBuildings.currentVisibles0, neoBuilding);

				
				if (this.isLastFrustum)
				{
					if (squaredDistToCamera < lod0_minSquaredDist) 
					{
						//this.visibleObjControlerBuildings.currentVisibles0.push(neoBuilding);
						this.putBuildingToArraySortedByDist(this.visibleObjControlerBuildings.currentVisibles0, neoBuilding);
					}
					else if (squaredDistToCamera < lod1_minSquaredDist) 
					{
						//this.visibleObjControlerBuildings.currentVisibles1.push(neoBuilding);
						this.putBuildingToArraySortedByDist(this.visibleObjControlerBuildings.currentVisibles1, neoBuilding);
					}
					else if (squaredDistToCamera < lod2_minSquaredDist) 
					{
						//this.visibleObjControlerBuildings.currentVisibles2.push(neoBuilding);
						this.putBuildingToArraySortedByDist(this.visibleObjControlerBuildings.currentVisibles2, neoBuilding);
					}
					else if (squaredDistToCamera < lod3_minSquaredDist) 
					{
						//this.visibleObjControlerBuildings.currentVisibles3.push(neoBuilding);
						this.putBuildingToArraySortedByDist(this.visibleObjControlerBuildings.currentVisibles3, neoBuilding);
					}
				}
				else
				{
					if (squaredDistToCamera < lod1_minSquaredDist) 
					{
						//this.visibleObjControlerBuildings.currentVisibles1.push(neoBuilding);
						this.putBuildingToArraySortedByDist(this.visibleObjControlerBuildings.currentVisibles1, neoBuilding);
					}
					else if (squaredDistToCamera < lod2_minSquaredDist) 
					{
						//this.visibleObjControlerBuildings.currentVisibles2.push(neoBuilding);
						this.putBuildingToArraySortedByDist(this.visibleObjControlerBuildings.currentVisibles2, neoBuilding);
					}
					else if (squaredDistToCamera < lod3_minSquaredDist) 
					{
						//this.visibleObjControlerBuildings.currentVisibles3.push(neoBuilding);
						this.putBuildingToArraySortedByDist(this.visibleObjControlerBuildings.currentVisibles3, neoBuilding);
					}
				}
				
			}
		
		}
		else
		{
			// create the buildings by buildingSeeds.
			buildingSeedsCount = lowestTile.buildingSeedsArray.length;
			for (var j=0; j<buildingSeedsCount; j++)
			{
				buildingSeed = lowestTile.buildingSeedsArray[j];
				neoBuilding = new NeoBuilding();
				
				if (lowestTile.buildingsArray == undefined)
				{ lowestTile.buildingsArray = []; }
				
				lowestTile.buildingsArray.push(neoBuilding);
				
				if (neoBuilding.metaData === undefined) 
				{ neoBuilding.metaData = new MetaData(); }

				if (neoBuilding.metaData.geographicCoord === undefined)
				{ neoBuilding.metaData.geographicCoord = new GeographicCoord(); }

				if (neoBuilding.metaData.bbox === undefined) 
				{ neoBuilding.metaData.bbox = new BoundingBox(); }

				// create a building and set the location.***
				neoBuilding.buildingId = buildingSeed.buildingId;
				neoBuilding.buildingType = "basicBuilding";
				neoBuilding.buildingFileName = buildingSeed.buildingFileName;
				neoBuilding.metaData.geographicCoord.setLonLatAlt(buildingSeed.geographicCoord.longitude, buildingSeed.geographicCoord.latitude, buildingSeed.geographicCoord.altitude);
				neoBuilding.metaData.bbox = buildingSeed.bBox;
				if (neoBuilding.bbox == undefined)
				{ neoBuilding.bbox = new BoundingBox(); }
				neoBuilding.bbox.copyFrom(buildingSeed.bBox);
				neoBuilding.metaData.heading = buildingSeed.rotationsDegree.z;
				neoBuilding.metaData.pitch = buildingSeed.rotationsDegree.x;
				neoBuilding.metaData.roll = buildingSeed.rotationsDegree.y;
				if (neoBuilding.bbox === undefined)
				{
					if (currentCalculatingPositionsCount < maxNumberOfCalculatingPositions)
					{
						this.visibleObjControlerBuildings.currentVisibles0.push(neoBuilding);
						//this.parseQueue.neoBuildingsHeaderToParseArray.push(neoBuilding);
						currentCalculatingPositionsCount++;
					}
					continue;
				}
			}
		}
	}
};

/**
 * dataKey 이용해서 data 검색
 * @param dataKey
 */
MagoManager.prototype.flyToBuilding = function(dataKey) 
{
	var neoBuilding = this.getNeoBuildingById(null, dataKey);

	if (neoBuilding === undefined)
	{ return; }

	// calculate realPosition of the building.****************************************************************************
	var realBuildingPos;
	if (this.renderingModeTemp === 1 || this.renderingModeTemp === 2) // 0 = assembled mode. 1 = dispersed mode.***
	{
		if (neoBuilding.geoLocationDataAux === undefined) 
		{
			var realTimeLocBlocksList = MagoConfig.getData().alldata;
			var newLocation = realTimeLocBlocksList[neoBuilding.dataKey];
			// must calculate the realBuildingPosition (bbox_center_position).***

			if (newLocation) 
			{
				neoBuilding.geoLocationDataAux = ManagerUtils.calculateGeoLocationData(newLocation.LONGITUDE, newLocation.LATITUDE, newLocation.ELEVATION, heading, pitch, roll, neoBuilding.geoLocationDataAux, this);
				this.pointSC = neoBuilding.bbox.getCenterPoint(this.pointSC);
				//realBuildingPos = neoBuilding.geoLocationDataAux.tMatrix.transformPoint3D(this.pointSC, realBuildingPos );
				realBuildingPos = neoBuilding.geoLocationDataAux.pivotPoint;
			}
			else 
			{
				// use the normal data.***
				this.pointSC = neoBuilding.bbox.getCenterPoint(this.pointSC);
				realBuildingPos = neoBuilding.transfMat.transformPoint3D(this.pointSC, realBuildingPos );
			}
		}
		else 
		{
			this.pointSC = neoBuilding.bbox.getCenterPoint(this.pointSC);
			//realBuildingPos = neoBuilding.geoLocationDataAux.tMatrix.transformPoint3D(this.pointSC, realBuildingPos );
			realBuildingPos = neoBuilding.geoLocationDataAux.pivotPoint;
		}
	}
	else 
	{
		var buildingGeoLocation = neoBuilding.geoLocDataManager.getGeoLocationData(0);
		this.pointSC = neoBuilding.bbox.getCenterPoint(this.pointSC);
		realBuildingPos = buildingGeoLocation.tMatrix.transformPoint3D(this.pointSC, realBuildingPos );
	}
	// end calculating realPosition of the building.------------------------------------------------------------------------

	if (realBuildingPos === undefined)
	{ return; }

	//
	
	if (this.renderingModeTemp === 0)
	{ this.radiusAprox_aux = (neoBuilding.bbox.maxX - neoBuilding.bbox.minX) * 1.2/2.0; }
	if (this.renderingModeTemp === 1)
	{ this.radiusAprox_aux = (neoBuilding.bbox.maxX - neoBuilding.bbox.minX) * 1.2/2.0; }
	if (this.renderingModeTemp === 2)
	{ this.radiusAprox_aux = (neoBuilding.bbox.maxX - neoBuilding.bbox.minX) * 1.2/2.0; }

	if (this.boundingSphere_Aux == undefined)
	{ this.boundingSphere_Aux = new Sphere(); }
	
	this.boundingSphere_Aux.radius = this.radiusAprox_aux;

	//var position = new Cesium.Cartesian3(this.pointSC.x, this.pointSC.y, this.pointSC.z);
	//var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
	if (this.configInformation.geo_view_library === Constant.CESIUM)
	{
		this.boundingSphere_Aux.center = Cesium.Cartesian3.clone(realBuildingPos);
		var viewer = this.scene.viewer;
		var seconds = 3;
		this.scene.camera.flyToBoundingSphere(this.boundingSphere_Aux, seconds);
	}
	else if (this.configInformation.geo_view_library === Constant.WORLDWIND)
	{
		//this.boundingSphere_Aux.center = realBuildingPos;
		var buildingGeoLocation = neoBuilding.geoLocDataManager.getGeoLocationData(0);
		var geographicCoord = buildingGeoLocation.geographicCoord;
		this.wwd.goToAnimator.travelTime = 3000;
		this.wwd.goTo(new WorldWind.Position(geographicCoord.latitude, geographicCoord.longitude, geographicCoord.altitude + 1000));
	}
};

/**
 * 어떤 일을 하고 있습니까?
 */
MagoManager.prototype.getNeoBuildingById = function(buildingType, buildingId) 
{
	/*
	// old.
	var buildingCount = this.neoBuildingsList.neoBuildingsArray.length;
	var find = false;
	var i=0;
	var resultNeoBuilding;
	while (!find && i<buildingCount) 
	{
		if (buildingType)
		{
			if (this.neoBuildingsList.neoBuildingsArray[i].buildingId === buildingId && this.neoBuildingsList.neoBuildingsArray[i].buildingType === buildingType) 
			{
				find = true;
				resultNeoBuilding = this.neoBuildingsList.neoBuildingsArray[i];
			}
		}
		else 
		{
			if (this.neoBuildingsList.neoBuildingsArray[i].buildingId === buildingId) 
			{
				find = true;
				resultNeoBuilding = this.neoBuildingsList.neoBuildingsArray[i];
			}
		}
		i++;
	}
	*/
	var resultNeoBuilding = this.smartTileManager.getNeoBuildingById(buildingType, buildingId);
	return resultNeoBuilding;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param frustumVolume 변수
 * @param visibleBuildings_array 변수
 * @param cameraPosition 변수
 * @returns visibleBuildings_array
 */
MagoManager.prototype.doFrustumCullingTerranTileServiceFormat = function(gl, frustumVolume, visibleBuildings_array, cameraPosition) 
{
	// This makes the visible buildings array.***
	// This has Cesium dependency because uses the frustumVolume and the boundingSphere of cesium.***
	//---------------------------------------------------------------------------------------------------------
	// Note: in this function, we do frustum culling and determine the detailedBuilding in same time.***

	// Init the visible buildings array.***************************
	//visibleBuildings_array.length = 0; // Init.***
	//this.currentVisibleBuildings_LOD0_array.length = 0; // Init.***
	//this.detailed_building;

	var squaredDistToCamera;
	//	var squaredDistToCamera_candidate;
	var last_squared_dist;
	var buildings_count;
	//	var nearestTile;
	//	var nearestTile_candidate;

	this.filteredVisibleTiles_array.length = 0;
	this.detailedVisibleTiles_array.length = 0;
	this.LOD0VisibleTiles_array.length = 0;

	var BR_Project;

	var max_tileFilesReading = 10;

	this.currentVisible_terranTiles_array.length = 0;// Init.***
	this.terranTile.getIntersectedSmallestTiles(frustumVolume, this.currentVisible_terranTiles_array, this.boundingSphere_Aux);

	// Find the nearest tile to camera.***
	var visibleTiles_count = this.currentVisible_terranTiles_array.length;
	if (visibleTiles_count === 0) { return; }

	for (var i=0; i<visibleTiles_count; i++) 
	{
		this.terranTileSC = this.currentVisible_terranTiles_array[i];
		squaredDistToCamera = Cesium.Cartesian3.distanceSquared(cameraPosition, this.terranTileSC.position);

		if (squaredDistToCamera > this.min_squaredDist_to_see) { continue; }

		if (squaredDistToCamera < this.min_squaredDist_to_see_detailed * 1.2) 
		{
			this.detailedVisibleTiles_array.push(this.terranTileSC);
		}
		else if (squaredDistToCamera <  this.min_squaredDist_to_see_LOD0 * 1.2) 
		{
			this.LOD0VisibleTiles_array.push(this.terranTileSC);
		}
		else 
		{
			this.filteredVisibleTiles_array.push(this.terranTileSC); // Original.***
			//this.LOD0VisibleTiles_array.push(this.terranTileSC); // Test.***
		}
	}

	// Make the visible buildings list.******************************************************************************
	this.boundingSphere_Aux.radius = 50.0;
	var need_frustumCulling = false;
	var filePath_scratch;
	var tileNumberNameString;

	var detailedVisibleTiles_count = this.detailedVisibleTiles_array.length;
	for (var i=0; i<detailedVisibleTiles_count; i++) 
	{
		this.terranTileSC = this.detailedVisibleTiles_array[i];

		if (!this.terranTileSC.fileReading_started) 
		{
			if (this.backGround_fileReadings_count < max_tileFilesReading) 
			{
				tileNumberNameString = this.terranTileSC._numberName.toString();
				filePath_scratch = this.readerWriter.geometryDataPath + Constant.RESULT_XDO2F4D_TERRAINTILES + tileNumberNameString + ".til";
				this.readerWriter.getTileArrayBuffer(gl, filePath_scratch, this.terranTileSC, this.readerWriter, this);
				this.backGround_fileReadings_count ++;
			}

			continue;
		}

		if (this.terranTileSC.fileReading_finished && !this.terranTileSC.fileParsingFinished) 
		{
			//this.terranTileSC.parseFileOneBuilding(gl, this);
			this.terranTileSC.parseFileAllBuildings(this);
			//continue;
		}

		need_frustumCulling = false;
		if (this.terranTileSC.visibilityType === Cesium.Intersect.INTERSECTING) { need_frustumCulling = true; }

		buildings_count = this.terranTileSC._BR_buildingsArray.length;
		for (var j=0; j<buildings_count; j++) 
		{
			BR_Project = this.detailedVisibleTiles_array[i]._BR_buildingsArray[j];
			if (BR_Project.buildingPosition === undefined) 
			{
				this.currentVisibleBuildings_LOD0_array.push(BR_Project);
				continue;
			}

			squaredDistToCamera = Cesium.Cartesian3.distanceSquared(cameraPosition, BR_Project.buildingPosition);
			if (squaredDistToCamera < this.min_squaredDist_to_see_detailed) 
			{

				// Activate this in the future, when all f4d_projects unified.***
				if (BR_Project._compRefList_Container.compRefsListArray.length > 0) 
				{
					if (BR_Project._header._f4d_version === 1) 
					{
						if (last_squared_dist) 
						{
							if (squaredDistToCamera < last_squared_dist) 
							{
								last_squared_dist = squaredDistToCamera;
								this.currentVisibleBuildings_LOD0_array.push(this.detailed_building);
								this.detailed_building = BR_Project;
							}
							else 
							{
								this.currentVisibleBuildings_LOD0_array.push(BR_Project);
							}
						}
						else 
						{
							last_squared_dist = squaredDistToCamera;
							this.detailed_building = BR_Project;
						}
					}
				}
				else 
				{
					if (BR_Project._header.isSmall) { visibleBuildings_array.push(BR_Project); }
					else { this.currentVisibleBuildings_LOD0_array.push(BR_Project); }
				}
			}
			else if (squaredDistToCamera < this.min_squaredDist_to_see_LOD0) 
			{
				if (need_frustumCulling) 
				{
					this.boundingSphere_Aux.center = Cesium.Cartesian3.clone(BR_Project.buildingPosition);
					if (need_frustumCulling && frustumVolume.computeVisibility(this.boundingSphere_Aux) !== Cesium.Intersect.OUTSIDE) 
					{
						this.currentVisibleBuildings_LOD0_array.push(BR_Project);
					}
				}
				else { this.currentVisibleBuildings_LOD0_array.push(BR_Project); }
			}
			else 
			{
				if (need_frustumCulling) 
				{
					this.boundingSphere_Aux.center = Cesium.Cartesian3.clone(BR_Project.buildingPosition);
					if (need_frustumCulling && frustumVolume.computeVisibility(this.boundingSphere_Aux) !== Cesium.Intersect.OUTSIDE) 
					{
						visibleBuildings_array.push(BR_Project);
					}
				}
				else { visibleBuildings_array.push(BR_Project); }
			}
		}
	}

	var LOD0VisiblesTiles_count = this.LOD0VisibleTiles_array.length;
	for (var i=0; i<LOD0VisiblesTiles_count; i++) 
	{
		this.terranTileSC = this.LOD0VisibleTiles_array[i];

		if (!this.terranTileSC.fileReading_started) 
		{
			if (this.backGround_fileReadings_count < max_tileFilesReading) 
			{
				tileNumberNameString = this.terranTileSC._numberName.toString();
				filePath_scratch = this.readerWriter.geometryDataPath + Constant.RESULT_XDO2F4D_TERRAINTILES + tileNumberNameString + ".til";
				this.readerWriter.getTileArrayBuffer(gl, filePath_scratch, this.terranTileSC, this.readerWriter, this);
				this.backGround_fileReadings_count ++;
			}
			continue;
		}

		if (this.terranTileSC.fileReading_finished && !this.terranTileSC.fileParsingFinished) 
		{
			//this.terranTileSC.parseFileOneBuilding(gl, this);
			this.terranTileSC.parseFileAllBuildings(this);
			//continue;
		}

		need_frustumCulling = false;
		if (this.terranTileSC.visibilityType === Cesium.Intersect.INTERSECTING) { need_frustumCulling = true; }

		buildings_count = this.terranTileSC._BR_buildingsArray.length;
		for (var j=0; j<buildings_count; j++) 
		{
			BR_Project = this.LOD0VisibleTiles_array[i]._BR_buildingsArray[j];
			if (BR_Project.buildingPosition === undefined) 
			{
				visibleBuildings_array.push(BR_Project);
				continue;
			}

			squaredDistToCamera = Cesium.Cartesian3.distanceSquared(cameraPosition, BR_Project.buildingPosition);
			if (squaredDistToCamera < this.min_squaredDist_to_see_LOD0) 
			{
				if (need_frustumCulling) 
				{
					this.boundingSphere_Aux.center = Cesium.Cartesian3.clone(BR_Project.buildingPosition);
					if (frustumVolume.computeVisibility(this.boundingSphere_Aux) !== Cesium.Intersect.OUTSIDE) 
					{
						this.currentVisibleBuildings_LOD0_array.push(BR_Project);
					}
				}
				else { this.currentVisibleBuildings_LOD0_array.push(BR_Project); }
			}
			else 
			{
				if (need_frustumCulling) 
				{
					this.boundingSphere_Aux.center = Cesium.Cartesian3.clone(BR_Project.buildingPosition);
					if (frustumVolume.computeVisibility(this.boundingSphere_Aux) !== Cesium.Intersect.OUTSIDE) 
					{
						visibleBuildings_array.push(BR_Project);
					}
				}
				else { visibleBuildings_array.push(BR_Project); }
			}
		}
	}

	var filteredVisibleTiles_count = this.filteredVisibleTiles_array.length;
	for (var i=0; i<filteredVisibleTiles_count; i++) 
	{
		this.terranTileSC = this.filteredVisibleTiles_array[i];
		if (!this.terranTileSC.fileReading_started) 
		{
			if (this.backGround_fileReadings_count < max_tileFilesReading) 
			{
				tileNumberNameString = this.terranTileSC._numberName.toString();
				filePath_scratch = this.readerWriter.geometryDataPath + Constant.RESULT_XDO2F4D_TERRAINTILES + tileNumberNameString + ".til";
				this.readerWriter.getTileArrayBuffer(gl, filePath_scratch, this.terranTileSC, this.readerWriter, this);
				this.backGround_fileReadings_count ++;
			}
			continue;
		}

		if (this.terranTileSC.fileReading_finished && !this.terranTileSC.fileParsingFinished) 
		{
			//this.terranTileSC.parseFileOneBuilding(gl, this);
			this.terranTileSC.parseFileAllBuildings(this);
			//continue;
		}

		need_frustumCulling = false;
		if (this.terranTileSC.visibilityType === Cesium.Intersect.INTERSECTING) { need_frustumCulling = true; }

		buildings_count = this.terranTileSC._BR_buildingsArray.length;
		for (var j=0; j<buildings_count; j++) 
		{
			BR_Project = this.filteredVisibleTiles_array[i]._BR_buildingsArray[j];
			if (BR_Project.buildingPosition === undefined) 
			{
				visibleBuildings_array.push(BR_Project);
				continue;
			}
			else 
			{
				squaredDistToCamera = Cesium.Cartesian3.distanceSquared(cameraPosition, BR_Project.buildingPosition);
				if (BR_Project._header.isSmall) 
				{
					if (squaredDistToCamera < this.min_squaredDist_to_see_smallBuildings) 
					{
						if (need_frustumCulling) 
						{
							this.boundingSphere_Aux.center = Cesium.Cartesian3.clone(BR_Project.buildingPosition);
							if (frustumVolume.computeVisibility(this.boundingSphere_Aux) !== Cesium.Intersect.OUTSIDE)
							{ visibleBuildings_array.push(BR_Project); }
						}
						else { visibleBuildings_array.push(BR_Project); }
					}
				}
				else 
				{
					// Provisionally check for LODzero distance.***
					if (squaredDistToCamera < this.min_squaredDist_to_see_LOD0) 
					{
						if (need_frustumCulling) 
						{
							this.boundingSphere_Aux.center = Cesium.Cartesian3.clone(BR_Project.buildingPosition);
							if (frustumVolume.computeVisibility(this.boundingSphere_Aux) !== Cesium.Intersect.OUTSIDE) 
							{
								this.currentVisibleBuildings_LOD0_array.push(BR_Project);
							}
						}
						else { this.currentVisibleBuildings_LOD0_array.push(BR_Project); }
					}
					else 
					{
						if (need_frustumCulling) 
						{
							this.boundingSphere_Aux.center = Cesium.Cartesian3.clone(BR_Project.buildingPosition);
							if (frustumVolume.computeVisibility(this.boundingSphere_Aux) !== Cesium.Intersect.OUTSIDE)
							{ visibleBuildings_array.push(BR_Project); }
						}
						else { visibleBuildings_array.push(BR_Project); }
					}
				}
			}
		}
	}

	return visibleBuildings_array;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param frustumVolume 변수
 * @param visibleBuildings_array 변수
 * @param cameraPosition 변수
 * @returns visibleBuildings_array
 */
MagoManager.prototype.doFrustumCullingClouds = function(frustumVolume, visibleBuildings_array, cameraPosition) 
{
	// This makes the visible buildings array.***
	// This has Cesium dependency because uses the frustumVolume and the boundingSphere of cesium.***
	//---------------------------------------------------------------------------------------------------------
	// Note: in this function, we do frustum culling and determine the detailedBuilding in same time.***

	// Init the visible buildings array.***

	this.currentVisibleClouds_array.length = 0; // Init.***

	//	var min_squaredDist_to_see_detailed = 40000; // 200m.***
	//	var min_squaredDist_to_see_LOD0 = 250000; // 600m.***
	//	var min_squaredDist_to_see = 10000000;
	//	var min_squaredDist_to_see_smallBuildings = 700000;
	//
	//	var squaredDistToCamera;
	//	var last_squared_dist;

	var clouds_count = this.atmosphere.cloudsManager.circularCloudsArray.length;
	for (var p_counter = 0; p_counter<clouds_count; p_counter++) 
	{
		var cloud = this.atmosphere.cloudsManager.circularCloudsArray[p_counter];

		if (cloud.cullingPosition === undefined) 
		{
			continue;
		}

		/*
		squaredDistToCamera = Cesium.Cartesian3.distanceSquared(cameraPosition, cloud.cullingPosition);
		if(squaredDistToCamera > min_squaredDist_to_see)
			continue;

		if(BR_Project._header.isSmall && squaredDistToCamera>min_squaredDist_to_see_smallBuildings)
			continue;
		*/

		this.boundingSphere_Aux.center = Cesium.Cartesian3.clone(cloud.cullingPosition);
		this.radiusAprox_aux = cloud.cullingRadius;

		if (this.radiusAprox_aux) 
		{
			this.boundingSphere_Aux.radius = this.radiusAprox_aux;
		}
		else 
		{
			this.boundingSphere_Aux.radius = 50.0; // 50m. Provisional.***
		}

		var frustumCull = frustumVolume.computeVisibility(this.boundingSphere_Aux);
		if (frustumCull !== Cesium.Intersect.OUTSIDE) 
		{
			this.currentVisibleClouds_array.push(cloud);
		}
	}

	return visibleBuildings_array;
};

/**
 * object index 파일을 읽어서 빌딩 개수, 포지션, 크기 정보를 배열에 저장
 */
MagoManager.prototype.highLightBuildings = function()
{
	// 1rst, init highlightiedBuildings.***
	var buildingsCount = this.neoBuildingsList.neoBuildingsArray.length;
	for (var i=0; i<buildingsCount; i++)
	{
		this.neoBuildingsList.neoBuildingsArray[i].isHighLighted = false;
	}

	var buildingType = "structure";
	//var buildingType = "MSP"; khj(0331)
	var highLightingBuildingsCount = this.magoPolicy.highLightedBuildings.length;
	for (var i=0; i<highLightingBuildingsCount; i++)
	{
		var highLightedBuildingId = this.magoPolicy.highLightedBuildings[i];
		var highLightedBuilding = this.neoBuildingsList.getNeoBuildingByTypeId(buildingType, highLightedBuildingId.projectId + "_" + highLightedBuildingId.blockId);
		if (highLightedBuilding)
		{
			highLightedBuilding.isHighLighted = true;
		}
		//var hola = 0;
	}
};

/**
 * object index 파일을 읽어서 빌딩 개수, 포지션, 크기 정보를 배열에 저장
 */
MagoManager.prototype.renderModeChanged = function()
{
	if (this.renderModeTemp === 0)
	{
		;//
	}
	else if (this.renderModeTemp === 1)
	{
		;//
	}
	else if (this.renderModeTemp === 2)
	{
		;//
	}

};

MagoManager.prototype.buildingColorChanged = function(projectAndBlockId, color)
{
	var neoBuilding = this.getNeoBuildingById("structure", projectAndBlockId);
	
	if (neoBuilding)
	{
		if (neoBuilding.aditionalColor === undefined)
		{
			neoBuilding.aditionalColor = new Color();
		}
		neoBuilding.isColorChanged = true;
		neoBuilding.aditionalColor.setRGB(color[0], color[1], color[2]);
	}
};

MagoManager.prototype.objectColorChanged = function(projectAndBlockId, objectId, color)
{
	var neoBuilding = this.getNeoBuildingById("structure", projectAndBlockId);
	
	if (neoBuilding)
	{
		var neoReference;
		var neoReferencesCount = neoBuilding.motherNeoReferencesArray.length;
		var found = false;
		var i = 0;
		while (!found && i<neoReferencesCount)
		{
			if (neoBuilding.motherNeoReferencesArray[i])
			{
				if (neoBuilding.motherNeoReferencesArray[i].objectId === objectId)
				{
					neoReference = neoBuilding.motherNeoReferencesArray[i];
					found = true;
				}
			}
			i++;
		}
		
		if (neoReference)
		{
			if (neoReference.aditionalColor === undefined)
			{
				neoReference.aditionalColor = new Color();
			}
			
			neoReference.aditionalColor.setRGB(color[0], color[1], color[2]);
		}
	}
};

MagoManager.prototype.policyColorChanged = function(projectAndBlockId, objectId)
{
	// old.***
	var neoBuilding = this.getNeoBuildingById("structure", projectAndBlockId);

	// 1rst, init colorChanged.***
	var buildingsCount = this.neoBuildingsList.neoBuildingsArray.length;
	for (var i=0; i<buildingsCount; i++)
	{
		this.neoBuildingsList.neoBuildingsArray[i].isColorChanged = false;
	}

	neoBuilding.isColorChanged = true;
	this.magoPolicy.colorChangedObjectId = objectId;

};

/**
 * 변환 행렬
 */
 
MagoManager.prototype.displayLocationAndRotation = function(neoBuilding) 
{
	//var projectIdAndBlockId = neoBuilding.buildingId;
	var latitude, longitude, altitude, heading, pitch, roll;
	var geoLocationData = neoBuilding.geoLocDataManager.geoLocationDataArray[0];
	latitude = geoLocationData.geographicCoord.latitude;
	longitude = geoLocationData.geographicCoord.longitude;
	altitude = geoLocationData.geographicCoord.altitude;
	heading = geoLocationData.heading;
	pitch = geoLocationData.pitch;
	roll = geoLocationData.roll;
	
	var dividedName = neoBuilding.buildingId.split("_");
};

/**
 * 변환 행렬
 */
MagoManager.prototype.selectedObjectNotice = function(neoBuilding) 
{
	//var projectIdAndBlockId = neoBuilding.buildingId;
	var geoLocationData = neoBuilding.geoLocDataManager.geoLocationDataArray[0];
	var dividedName = neoBuilding.buildingId.split("_");
	
	if (MagoConfig.getPolicy().geo_callback_enable === "true") 
	{
		if (this.objMarkerSC === undefined) { return; }
		var objectId = null;
		if (this.objectSelected !== undefined) { objectId = this.objectSelected.objectId; }
		
		// click object 정보를 표시
		if (this.magoPolicy.getObjectInfoViewEnable()) 
		{
			selectedObjectCallback(		MagoConfig.getPolicy().geo_callback_selectedobject,
				dividedName[0],
				dividedName[1],
				objectId,
				this.objMarkerSC.geoLocationData.geographicCoord.latitude,
				this.objMarkerSC.geoLocationData.geographicCoord.longitude,
				this.objMarkerSC.geoLocationData.geographicCoord.altitude,
				geoLocationData.heading,
				geoLocationData.pitch,
				geoLocationData.roll);
		}
			
		// 이슈 등록 창 오픈
		if (this.magoPolicy.getIssueInsertEnable()) 
		{
			if (this.objMarkerSC === undefined) { return; }
			
			insertIssueCallback(	MagoConfig.getPolicy().geo_callback_insertissue,
				dividedName[0] + "_" + dividedName[1],
				objectId,
				this.objMarkerSC.geoLocationData.geographicCoord.latitude,
				this.objMarkerSC.geoLocationData.geographicCoord.longitude,
				(parseFloat(this.objMarkerSC.geoLocationData.geographicCoord.altitude)));
		}
	}
};

/**
 * 변환 행렬
 */
MagoManager.prototype.changeLocationAndRotation = function(projectIdAndBlockId, latitude, longitude, elevation, heading, pitch, roll) 
{
	//var neoBuilding = this.getNeoBuildingById("structure", projectIdAndBlockId); // original for heavyIndustries.***
	var neoBuilding = this.getNeoBuildingById(undefined, projectIdAndBlockId);

	if (neoBuilding === undefined)
	{ return; }
	var geoLocationData = neoBuilding.geoLocDataManager.geoLocationDataArray[0];
	geoLocationData = ManagerUtils.calculateGeoLocationData(longitude, latitude, elevation, heading, pitch, roll, geoLocationData, this);
	if (geoLocationData === undefined)
	{ return; }

	this.pointSC = neoBuilding.bbox.getCenterPoint(this.pointSC);
	ManagerUtils.translatePivotPointGeoLocationData(geoLocationData, this.pointSC );

	// now, must change the keyMatrix of the references of the octrees.***
	if (neoBuilding.octree)
	{
		neoBuilding.octree.multiplyKeyTransformMatrix(0, geoLocationData.rotMatrix);
	}


	// repeat this for outfitting building.*********************************************************************************************************************
	// repeat this for outfitting building.*********************************************************************************************************************
	// repeat this for outfitting building.*********************************************************************************************************************
	var neoBuildingOutffiting = this.getNeoBuildingById("outfitting", projectIdAndBlockId);

	if (neoBuildingOutffiting === undefined)
	{ return; }

	// "longitude", "latitude" and "elevation" is from the structure block.***
	geoLocationData = neoBuildingOutffiting.geoLocDataManager.geoLocationDataArray[0];
	geoLocationData = ManagerUtils.calculateGeoLocationData(longitude, latitude, elevation, heading, pitch, roll, geoLocationData, this);
	if (geoLocationData === undefined)
	{ return; }

	this.pointSC = neoBuilding.bbox.getCenterPoint(this.pointSC); // the centerpoint is taken from structure block.***
	ManagerUtils.translatePivotPointGeoLocationData(geoLocationData, this.pointSC );

	// now, must change the keyMatrix of the references of the octrees.***
	if (neoBuildingOutffiting.octree)
	{
		neoBuildingOutffiting.octree.multiplyKeyTransformMatrix(0, geoLocationData.rotMatrix);
	}
};

/**
 * object index 파일을 읽어서 빌딩 개수, 포지션, 크기 정보를 배열에 저장
 */
MagoManager.prototype.createDeploymentGeoLocationsForHeavyIndustries = function() 
{
	// as the heavy industries special method, add new position for buildings.***.***
	var realTimeLocBlocksList = MagoConfig.getData().alldata;
	var neoBuildingsCount = this.neoBuildingsList.neoBuildingsArray.length;
	var neoBuilding;
	var newLocation;
	var structureTypedBuilding;
	var buildingGeoLocation;
	for (var i=0; i<neoBuildingsCount; i++) 
	{
		neoBuilding = this.neoBuildingsList.neoBuildingsArray[i];
		
		if (neoBuilding.buildingType === "outfitting")
		{
			structureTypedBuilding = this.neoBuildingsList.getNeoBuildingByTypeId("structure", neoBuilding.buildingId);
		}
		else
		{ structureTypedBuilding = neoBuilding; }

		if (structureTypedBuilding === undefined)
		{ continue; }

		if (structureTypedBuilding.bbox === undefined)
		{ continue; }
	
		// Test son.****************************************************************************
		var buildingNameDivided = neoBuilding.buildingId.split("_");
		if (buildingNameDivided.length > 0)
		{
			var firstName = buildingNameDivided[0];
			if (firstName === "testId")
			{
				if (buildingNameDivided[2] !== undefined)
				{
					neoBuilding.buildingId = buildingNameDivided[0] + "_" + buildingNameDivided[1];
					neoBuilding.buildingType = buildingNameDivided[2];
				}
				else
				{
					neoBuilding.buildingId = buildingNameDivided[1];
					neoBuilding.buildingType = buildingNameDivided[3];
				}
			}
		}
		// End Test son.------------------------------------------------------------------------
		
		newLocation = realTimeLocBlocksList[neoBuilding.buildingId];
		// must calculate the realBuildingPosition (bbox_center_position).***
		var longitude;
		var latitude;
		var altitude;
		var heading, pitch, roll;
			
		if (newLocation) 
		{
			longitude = parseFloat(newLocation.longitude);
			latitude = parseFloat(newLocation.latitude);
			altitude = parseFloat(newLocation.height);
			heading = parseFloat(newLocation.heading);
			pitch = parseFloat(newLocation.pitch);
			roll = parseFloat(newLocation.roll);

			buildingGeoLocation = neoBuilding.geoLocDataManager.newGeoLocationData("deploymentLoc");
			ManagerUtils.calculateGeoLocationData(longitude, latitude, altitude+10, heading, pitch, roll, buildingGeoLocation, this);
			
			this.pointSC = structureTypedBuilding.bbox.getCenterPoint(this.pointSC);
			
			if (neoBuilding.buildingId === "ctships")
			{
				// Test:
				// for this building dont translate the pivot point to the bbox center.***
				return;
			}
			ManagerUtils.translatePivotPointGeoLocationData(buildingGeoLocation, this.pointSC );
			////this.changeLocationAndRotation(neoBuilding.buildingId, latitude, longitude, altitude, heading, pitch, roll);
			////currentCalculatingPositionsCount ++;
		}
		else
		{
			if (firstName === "testId")
			{
				longitude = 128.5894;
				latitude = 34.90167;
				altitude = -400.0;
				heading = 0;
				pitch = 0;
				roll = 0;
				
				buildingGeoLocation = neoBuilding.geoLocDataManager.newGeoLocationData("deploymentLoc");
				ManagerUtils.calculateGeoLocationData(longitude, latitude, altitude+10, heading, pitch, roll, buildingGeoLocation, this);
				
				this.pointSC = structureTypedBuilding.bbox.getCenterPoint(this.pointSC);
			}
		}
	}
};

/**
 * object index 파일을 읽어서 빌딩 개수, 포지션, 크기 정보를 배열에 저장
 */

MagoManager.prototype.getObjectIndexFile = function() 
{
	if (this.configInformation === undefined)
	{
		this.configInformation = MagoConfig.getPolicy();
	}
	// old.***
	//this.readerWriter.getObjectIndexFile(	this.readerWriter.geometryDataPath + Constant.OBJECT_INDEX_FILE, this.readerWriter, this.neoBuildingsList, this);
	
	// use smartTile. Create one smartTile for all Korea.
	this.buildingSeedList = new BuildingSeedList();
	this.readerWriter.getObjectIndexFileForSmartTile(	this.readerWriter.geometryDataPath + Constant.OBJECT_INDEX_FILE, this, this.buildingSeedList);
};

/**
 * object index 파일을 읽어서 빌딩 개수, 포지션, 크기 정보를 배열에 저장
 */
MagoManager.prototype.makeSmartTile = function(buildingSeedList) 
{
	// as the heavy industries special method, add new position for buildings.***.***
	var realTimeLocBlocksList = MagoConfig.getData().alldata;
	var buildingSeedsCount;
	var buildingSeed;
	var newLocation;
	var structureTypedBuilding;
	var buildingGeoLocation;
	
	var smartTilesCount = this.smartTileManager.tilesArray.length;
	for (var a=0; a<smartTilesCount; a++)
	{
		var smartTile = this.smartTileManager.tilesArray[a];
		buildingSeedsCount = buildingSeedList.buildingSeedArray.length;
		for (var i=0; i<buildingSeedsCount; i++) 
		{
			buildingSeed = buildingSeedList.buildingSeedArray[i];
		
			// Test son.****************************************************************************
			var buildingNameDivided = buildingSeed.buildingId.split("_");
			if (buildingNameDivided.length > 0)
			{
				var firstName = buildingNameDivided[0];
				buildingSeed.firstName = firstName;
				if (firstName === "testId")
				{
					if (buildingNameDivided[2] !== undefined)
					{
						buildingSeed.buildingId = buildingNameDivided[0] + "_" + buildingNameDivided[1];
						buildingSeed.buildingType = buildingNameDivided[2];
					}
					else
					{
						buildingSeed.buildingId = buildingNameDivided[1];
						buildingSeed.buildingType = buildingNameDivided[3];
					}
				}
			}
			// End Test son.------------------------------------------------------------------------
			
			newLocation = realTimeLocBlocksList[buildingSeed.buildingId];
			// must calculate the realBuildingPosition (bbox_center_position).***
			var longitude;
			var latitude;
			var altitude;
			var heading, pitch, roll;
				
			if (newLocation) 
			{
				longitude = parseFloat(newLocation.longitude);
				latitude = parseFloat(newLocation.latitude);
				altitude = parseFloat(newLocation.height);
				heading = parseFloat(newLocation.heading);
				pitch = parseFloat(newLocation.pitch);
				roll = parseFloat(newLocation.roll);
			}
			else
			{
				if (firstName === "testId")
				{
					longitude = 128.5894;
					latitude = 34.90167;
					altitude = -400.0;
					heading = 0;
					pitch = 0;
					roll = 0;
				}
				else 
				{
					longitude = 128.5894;
					latitude = 35.0;
					altitude = 50.0;
					heading = 0;
					pitch = 0;
					roll = 0;
				}
			}
			
			if (buildingSeed.geographicCoord === undefined)
			{ buildingSeed.geographicCoord = new GeographicCoord(); }
		
			if (buildingSeed.rotationsDegree == undefined)
			{ buildingSeed.rotationsDegree = new Point3D(); }
		
			buildingSeed.geographicCoord.setLonLatAlt(longitude, latitude, altitude);
			buildingSeed.rotationsDegree.set(pitch, roll, heading);
		}
		
		smartTile.buildingSeedsArray = buildingSeedList.buildingSeedArray;
		var minDegree = 0.015; // 0.01deg = 1.105,74m.
		smartTile.makeTree(minDegree, this);
		
	}
	this.buildingSeedList.buildingSeedArray.length = 0; // init.
};

/**
 * api gateway
 */
MagoManager.prototype.callAPI = function(api) 
{
	var apiName = api.getAPIName();
	if (apiName === "changeMagoState") 
	{
		this.magoPolicy.setMagoEnable(api.getMagoEnable());
	}
	else if (apiName === "changeRender") 
	{
		this.renderingModeTemp = api.getRenderMode();
	}
	else if (apiName === "searchData") 
	{
		this.flyToBuilding(api.getDataKey());
	}
	else if (apiName === "changeHighLighting") 
	{
		this.magoPolicy.highLightedBuildings.length = 0;
		var projectId = api.getProjectId();
		var blockIds = api.getBlockIds().split(",");
		var objectIds = null;
		var isExistObjectIds = false;
		if (api.getObjectIds() !== null && api.getObjectIds().length !== 0) 
		{
			objectIds = api.getObjectIds().split(",");
			isExistObjectIds = true;
		}
		var hightedBuilds = [];
		for (var i=0, count = blockIds.length; i<count; i++) 
		{
			var projectLayer = new ProjectLayer();
			projectLayer.setProjectId(projectId);
			projectLayer.setBlockId(blockIds[i].trim());
			if (isExistObjectIds) { projectLayer.setObjectId(objectIds[i].trim()); }
			else { projectLayer.setObjectId(null); }
			hightedBuilds.push(projectLayer);
		}
		this.magoPolicy.setHighLightedBuildings(hightedBuilds);
		this.highLightBuildings();
	}
	else if (apiName === "changeColor") 
	{
		this.magoPolicy.colorBuildings.length = 0;
		var projectId = api.getProjectId();
		var blockIds = api.getBlockIds().split(",");
		var objectIds = null;
		var isExistObjectIds = false;
		if (api.getObjectIds() !== null && api.getObjectIds().length !== 0) 
		{
			objectIds = api.getObjectIds().split(",");
			isExistObjectIds = true;
		}
		var colorBuilds = [];
		for (var i=0, count = blockIds.length; i<count; i++) 
		{
			if (isExistObjectIds) 
			{
				for (var j=0, objectCount = objectIds.length; j<objectCount; j++) 
				{
					var projectLayer = new ProjectLayer();
					projectLayer.setProjectId(projectId);
					projectLayer.setBlockId(blockIds[i].trim());
					projectLayer.setObjectId(objectIds[j].trim());
					colorBuilds.push(projectLayer);
				}
			}
			else 
			{
				var projectLayer = new ProjectLayer();
				projectLayer.setProjectId(projectId);
				projectLayer.setBlockId(blockIds[i].trim());
				projectLayer.setObjectId(null);
				colorBuilds.push(projectLayer);
			}
		}
		this.magoPolicy.setColorBuildings(colorBuilds);

		var rgbColor = api.getColor().split(",");
		var rgbArray = [ rgbColor[0]/255, rgbColor[1]/255, rgbColor[2]/255 ] ;
		this.magoPolicy.setColor(rgbArray);
		
		var buildingsCount = colorBuilds.length;
		for (var i=0; i<buildingsCount; i++)
		{
			//var projectAndBlockId = projectId + "_" + blockIds[i]; // old.***
			var projectAndBlockId = colorBuilds[i].projectId + "_" + colorBuilds[i].blockId;
			if (colorBuilds[i].objectId === null)
			{
				this.buildingColorChanged(projectAndBlockId, rgbArray);
			}
			else
			{
				this.objectColorChanged(projectAndBlockId, colorBuilds[i].objectId, rgbArray);
			}
			
		}
	}
	else if (apiName === "show") 
	{
		this.magoPolicy.setHideBuildings.length = 0;
	}
	else if (apiName === "hide") 
	{
		this.magoPolicy.setHideBuildings(api.gethideBuilds());
	}
	else if (apiName === "move") 
	{
		;//
	}
	else if (apiName === "changeOutFitting") 
	{
		this.magoPolicy.setShowOutFitting(api.getShowOutFitting());
	}
	else if (apiName === "changeBoundingBox") 
	{
		this.magoPolicy.setShowBoundingBox(api.getShowBoundingBox());
	}
	else if (apiName === "changeShadow") 
	{
		this.magoPolicy.setShowShadow(api.getShowShadow());
	}
	else if (apiName === "changefrustumFarDistance") 
	{
		// frustum culling 가시 거리
		this.magoPolicy.setFrustumFarSquaredDistance(api.getFrustumFarDistance() * api.getFrustumFarDistance());
	}
	else if (apiName === "changeLocationAndRotation") 
	{
		// 변환 행렬
		// find the building.***
		var buildingId = api.getDataKey();
		var buildingType = "structure";
		var building = this.neoBuildingsList.getNeoBuildingByTypeId(buildingType, buildingId);

		this.changeLocationAndRotation(api.getDataKey(),
			parseFloat(api.getLatitude()),
			parseFloat(api.getLongitude()),
			parseFloat(api.getElevation()),
			parseFloat(api.getHeading()),
			parseFloat(api.getPitch()),
			parseFloat(api.getRoll()));
	}
	else if (apiName === "getLocationAndRotation") 
	{
		return this.neoBuildingsList.getNeoBuildingByTypeId("structure", api.getProjectId() + "_" + api.getBlockId());
	}
	else if (apiName === "changeMouseMove") 
	{
		this.magoPolicy.setMouseMoveMode(api.getMouseMoveMode());
	}
	else if (apiName === "changeInsertIssueMode") 
	{
		this.magoPolicy.setIssueInsertEnable(api.getIssueInsertEnable());
		//selectedObjectCallback(이걸 해 주면 될거 같음)
	}
	else if (apiName === "changeObjectInfoViewMode") 
	{
		// object info 표시
		this.magoPolicy.setObjectInfoViewEnable(api.getObjectInfoViewEnable());
	}
	else if (apiName === "changeNearGeoIssueListViewMode") 
	{
		// issue list 표시
		this.magoPolicy.setNearGeoIssueListEnable(api.getNearGeoIssueListEnable());
		if (!api.getNearGeoIssueListEnable()) 
		{
			// clear objMarkerManager objectmakersarrays 사이즈를 0 으로 하면... .됨
			this.objMarkerManager.objectMarkerArray = [];
		}
	}
	else if (apiName === "drawInsertIssueImage") 
	{
		// pin 을 표시
		if (this.objMarkerSC === undefined || api.getDrawType() === 0) 
		{
			this.objMarkerSC = new ObjectMarker();
			this.objMarkerSC.geoLocationData.geographicCoord = new GeographicCoord();
			ManagerUtils.calculateGeoLocationData(parseFloat(api.getLongitude()), parseFloat(api.getLatitude()), parseFloat(api.getElevation()), 
				undefined, undefined, undefined, this.objMarkerSC.geoLocationData, this);
		}
		
		var objMarker = this.objMarkerManager.newObjectMarker();
		
		this.objMarkerSC.issue_id = api.getIssueId();
		this.objMarkerSC.issue_type = api.getIssueType();
		this.objMarkerSC.geoLocationData.geographicCoord.setLonLatAlt(parseFloat(api.getLongitude()), parseFloat(api.getLatitude()), parseFloat(api.getElevation()));
		
		objMarker.copyFrom(this.objMarkerSC);
		this.objMarkerSC = undefined;
	}
	else if (apiName === "changeInsertIssueState") 
	{
		this.sceneState.insertIssueState = 0;
	}
};
'use strict';

/**
 * Factory method 패턴을 사용해서 cesium, worldwind 등을 wrapping 해 주는 클래스
 * @class ManagerFactory
 *
 * @param viewer 타 시스템과의 연동의 경우 view 객체가 생성되어서 넘어 오는 경우가 있음
 * @param containerId 뷰에서 표시할 위치 id
 * @param serverPolicy policy json object
 * @param serverData data json object
 * @param imagePath 이미지 경로
 * @return api
 */
var ManagerFactory = function(viewer, containerId, serverPolicy, serverData, imagePath) 
{
	if (!(this instanceof ManagerFactory)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	var magoManager = null;
	var scene = null;
	
	//var startMousePosition = null;
	//var nowMousePosition = null;

	// 환경 설정
	MagoConfig.init(serverPolicy, serverData);
	
    if(viewer === null) viewer = new Cesium.Viewer(containerId, {homeButton:false, geocoder:false, sceneModePicker:false, infoBox:false, fullscreenButton:false, navigationHelpButton:false});
    viewer.scene.frameState.creditDisplay.container.style.visibility = 'hidden';
    
	if (serverPolicy.geo_view_library === null
			|| serverPolicy.geo_view_library === ''
			|| serverPolicy.geo_view_library === Constant.CESIUM) 
	{
		
		if (viewer === null) { viewer = new Cesium.Viewer(containerId); }

		// 기본 지도 설정
		setDefaultDataset();

		viewer.scene.magoManager = new MagoManager();
		viewer.scene.magoManager.sceneState.textureFlipYAxis = false;
		viewer.camera.frustum.fov = Cesium.Math.PI_OVER_THREE*1.8;

		// background provider 적용
		if (serverPolicy.geo_server_enable === "true") { backgroundProvider(); }
		
		draw();
		// build을 rendering 할 위치
		initEntity();
		// terrain 적용 여부
		/*if() {
			initTerrain();
		}*/
		// 최초 로딩시 카메라 이동 여부
		if (serverPolicy.geo_init_camera_enable === "true") { initCamera(); }
		// render Mode 적용
		initRenderMode();
	}
	else if (serverPolicy.geo_view_library === Constant.WORLDWIND) 
	{
		
		// Tell World Wind to log only warnings and errors.
		WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

		// set to canvas the current gl.***
		var canvas = document.getElementById(containerId);
		// Create the World Window.
		var wwd = new WorldWind.WorldWindow(containerId);
		//wwd.depthBits = 32;
		
		var layers = [
			{layer: new WorldWind.BMNGLayer(), enabled: true},
			{layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
			{layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
			{layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
			{layer: new WorldWind.CompassLayer(), enabled: false},
			{layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
			{layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
		];

		for (var l = 0; l < layers.length; l++) 
		{
			layers[l].layer.enabled = layers[l].enabled;
			wwd.addLayer(layers[l].layer);
		}

		// Now set up to handle highlighting.
		//var highlightController = new WorldWind.HighlightController(wwd);

		magoManager = new MagoManager();
		magoManager.wwd = wwd;
		magoManager.sceneState.textureFlipYAxis = true;
		
		var newRenderableLayer = new WorldWind.RenderableLayer();
		newRenderableLayer.displayName = "F4D tiles";
		newRenderableLayer.inCurrentFrame = true; // Test.***
		wwd.addLayer(newRenderableLayer);
		
		//newRenderableLayer.addRenderable(f4d_wwwLayer);// old.***
		newRenderableLayer.addRenderable(magoManager);
		// End Create a layer to hold the f4dBuildings.-------------------------------------------------------

		var gl = wwd.drawContext.currentGlContext;
		initWwwMago(magoManager, gl);

		// Click event. Is different to anothers event handlers.******************************************************
		// The common gesture-handling function.
		var handleClick = function (recognizer) 
		{
			// Obtain the event location.
			magoManager.mouse_x = event.layerX,
			magoManager.mouse_y = event.layerY;
			magoManager.bPicking = true;
			
			// Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
			// relative to the upper left corner of the canvas rather than the upper left corner of the page.
			//var pickList = wwd.pick(wwd.canvasCoordinates(x, y));

			// If only one thing is picked and it is the terrain, use a go-to animator to go to the picked location.
			/*
			if (pickList.objects.length === 1 && pickList.objects[0].isTerrain) {
				var position = pickList.objects[0].position;
				//wwd.goTo(new WorldWind.Location(position.latitude, position.longitude));
				//wwd.goTo(new WorldWind.Position(37.48666, 127.05618, 500));
				wwd.goToOriented(new WorldWind.Position(37.48666, 127.05618, 500.0), 120.0, 80.0);
			}
			*/
		};

		// Listen for mouse clicks.
		var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);
		
		var mouseDownEvent = function(event) 
		{
			if (event.button === 0) { magoManager.mouseLeftDown = true; }
			magoManager.isCameraMoving = true;
			magoManager.mouse_x = event.layerX,
			magoManager.mouse_y = event.layerY;
		};
		wwd.addEventListener("mousedown", mouseDownEvent, false);
		
		var mouseUpEvent = function(event) 
		{
			if (event.button === 0) { magoManager.mouseLeftDown = false; }
			magoManager.isCameraMoving = false;
		};
		wwd.addEventListener("mouseup", mouseUpEvent, false);
		
		var mouseMoveEvent = function(event) 
		{
			magoManager.mouse_x = event.layerX,
			magoManager.mouse_y = event.layerY;
			if (magoManager.mouseLeftDown) { magoManager.manageMouseMove(event.layerX, event.layerY); }
			
		};
		wwd.addEventListener("mousemove", mouseMoveEvent, false);
	
		wwd.goToAnimator.travelTime = MagoConfig.getPolicy().geo_init_duration * 1000;
		wwd.goTo(new WorldWind.Position(MagoConfig.getPolicy().geo_init_latitude, MagoConfig.getPolicy().geo_init_longitude, MagoConfig.getPolicy().geo_init_height));
	}
	
	// 이미지 경로
	magoManager.magoPolicy.imagePath = imagePath;

	// 실제 화면에 object를 rendering 하는 메인 메서드
	function draw() 
	{
		if (MagoConfig.getPolicy().geo_view_library === Constant.CESIUM) 
		{
			drawCesium();
		}
		else if (MagoConfig.getPolicy().geo_view_library === Constant.WORLDWIND) 
		{
			//initWwwMago();
		}
	}
	
	// cesium을 구현체로서 이용
	function initWwwMago(magoManager, gl) 
	{
		var viewport = magoManager.wwd.viewport;
		magoManager.selection.init(gl, viewport.width, viewport.height);
		magoManager.shadersManager.createDefaultShader(gl);
		magoManager.postFxShadersManager.gl = gl;
		magoManager.postFxShadersManager.createDefaultShaders(gl); // A1-OLD.***
		magoManager.createDefaultShaders(gl);// A1-Use this.***

		// Start postRender version.***********************************************
		// object index 파일을 읽어서 빌딩 개수, 포지션, 크기 정보를 배열에 저장
		magoManager.getObjectIndexFile();
		//viewer.scene.magoManager.handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
		//addMouseAction();
	}

	// cesium을 구현체로서 이용
	function drawCesium() 
	{
		var gl = viewer.scene.context._gl;
		viewer.scene.magoManager.selection.init(gl, viewer.scene.drawingBufferWidth, viewer.scene.drawingBufferHeight);
		viewer.scene.magoManager.shadersManager.createDefaultShader(gl);
		viewer.scene.magoManager.postFxShadersManager.gl = gl;
		viewer.scene.magoManager.postFxShadersManager.createDefaultShaders(gl); // A1-OLD.***
		viewer.scene.magoManager.createDefaultShaders(gl);// A1-Use this.***
		viewer.scene.magoManager.scene = viewer.scene;

		// Start postRender version.***********************************************
		magoManager = viewer.scene.magoManager;
		scene = viewer.scene;
		//scene.copyGlobeDepth = true;
		viewer.scene.globe.depthTestAgainstTerrain = true;

		// object index 파일을 읽어서 빌딩 개수, 포지션, 크기 정보를 배열에 저장
		viewer.scene.magoManager.getObjectIndexFile();
		viewer.scene.magoManager.handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
		addMouseAction();
	}

	// 뭐하는 메서드 인가?
	function disableCameraMotion(state)
	{
		viewer.scene.screenSpaceCameraController.enableRotate = state;
		viewer.scene.screenSpaceCameraController.enableZoom = state;
		viewer.scene.screenSpaceCameraController.enableLook = state;
		viewer.scene.screenSpaceCameraController.enableTilt = state;
		viewer.scene.screenSpaceCameraController.enableTranslate = state;
	}

	// 이벤트 확장
	function addMouseAction() 
	{
		magoManager.handler.setInputAction(function(click) 
		{
			magoManager.dateSC = new Date();
			magoManager.startTimeSC = magoManager.dateSC.getTime();
			//secondsUsed = this.currentTimeSC - this.startTimeSC;

			magoManager.mouse_x = click.position.x;
			magoManager.mouse_y = click.position.y;
			magoManager.mouseLeftDown = true;
			
			//nowMousePosition = startMousePosition = Cesium.Cartesian3.clone(click.position);
		}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

		magoManager.handler.setInputAction(function(click) 
		{
			magoManager.dateSC = new Date();
			magoManager.startTimeSC = magoManager.dateSC.getTime();
			//secondsUsed = this.currentTimeSC - this.startTimeSC;

			magoManager.mouse_x = click.position.x;
			magoManager.mouse_y = click.position.y;
			magoManager.mouseMiddleDown = true;
		}, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);

		magoManager.handler.setInputAction(function(movement) 
		{
			if (magoManager.mouseLeftDown) 
			{
				if (movement.startPosition.x !== movement.endPosition.x || movement.startPosition.y !== movement.endPosition.y) 
				{
					magoManager.manageMouseMove(movement.startPosition.x, movement.startPosition.y);
				}
			}
			else
			{
				magoManager.mouseDragging = false;
				disableCameraMotion(true);
				if (magoManager.mouseMiddleDown)
				{
					magoManager.isCameraMoving = true;
				}
			}
			//nowMousePosition = movement.endPosition;
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

		magoManager.handler.setInputAction(function(movement) 
		{
			// if picked
			//vm.pickedPolygon = false;
			//disableCameraMotion(true)
			if (magoManager.isCameraMoving)
			{
				//magoManager.sceneState.bMust = true;
			}
			magoManager.isCameraMoving = false;
			magoManager.mouseLeftDown = false;
			magoManager.mouseDragging = false;
			magoManager.selObjMovePlane = undefined;
			magoManager.mustCheckIfDragging = true;
			magoManager.thereAreStartMovePoint = false;
			disableCameraMotion(true);

			magoManager.dateSC = new Date();
			magoManager.currentTimeSC = magoManager.dateSC.getTime();
			var miliSecondsUsed = magoManager.currentTimeSC - magoManager.startTimeSC;
			//if(miliSecondsUsed < 500) // original.***
			if (miliSecondsUsed < 1000) 
			{
				if (magoManager.mouse_x === movement.position.x && magoManager.mouse_y === movement.position.y) 
				{
					magoManager.bPicking = true;
					//var gl = scene.context._gl;
					//f4d_topManager.objectSelected = f4d_topManager.getSelectedObjectPicking(scene, f4d_topManager.currentRenderablesNeoRefListsArray);
				}
			}
	    }, Cesium.ScreenSpaceEventType.LEFT_UP);

		magoManager.handler.setInputAction(function(movement) 
		{
			// if picked
			//vm.pickedPolygon = false;
			//disableCameraMotion(true)
			magoManager.isCameraMoving = false;
			magoManager.mouseMiddleDown = false;
			magoManager.mouseDragging = false;
			magoManager.selObjMovePlane = undefined;
			magoManager.mustCheckIfDragging = true;
			magoManager.thereAreStartMovePoint = false;
			disableCameraMotion(true);

			magoManager.dateSC = new Date();
			magoManager.currentTimeSC = magoManager.dateSC.getTime();
			var miliSecondsUsed = magoManager.currentTimeSC - magoManager.startTimeSC;
			if (miliSecondsUsed < 500) 
			{
				if (magoManager.mouse_x === movement.position.x && magoManager.mouse_y === movement.position.y) 
				{
					magoManager.bPicking = true;
					//var gl = scene.context._gl;
					//f4d_topManager.objectSelected = f4d_topManager.getSelectedObjectPicking(scene, f4d_topManager.currentRenderablesNeoRefListsArray);
				}
			}
	    }, Cesium.ScreenSpaceEventType.MIDDLE_UP);
	}

	// KeyPressEvents.**************************************
	document.addEventListener('keydown', function(e) 
	{
		setKey(e);
	}, false);

	function setKey(event) 
	{
		var increDeg = 3.0;
		if (event.key === "q" || event.key === "Q") 
		{  // right arrow
			// get current building selected.***
			if (magoManager.magoPolicy.issueInsertEnable)
			{ return; }
			var selectedBuilding = magoManager.buildingSelected;	
			if (selectedBuilding !== undefined) 
			{
				var geoLocationData = selectedBuilding.geoLocDataManager.geoLocationDataArray[0];
				if (geoLocationData !== undefined) 
				{
					if (geoLocationData.heading === undefined) { geoLocationData.heading = 0; } 
					var currentHeading = geoLocationData.heading;
					magoManager.changeLocationAndRotation(selectedBuilding.buildingId, geoLocationData.latitude, geoLocationData.longitude, geoLocationData.elevation,
						currentHeading+increDeg, geoLocationData.pitch, geoLocationData.roll);
				}
			}
		}
		else if (event.key === "a" || event.key === "A") 
		{  // right arrow
			// get current building selected.***
			if (magoManager.magoPolicy.issueInsertEnable)
			{ return; }
			var selectedBuilding = magoManager.buildingSelected;
			if (selectedBuilding !== undefined) 
			{
				var geoLocationData = selectedBuilding.geoLocDataManager.geoLocationDataArray[0];
				if (geoLocationData !== undefined) 
				{
					if (geoLocationData.heading === undefined) { geoLocationData.heading = 0; } 
					var currentHeading = geoLocationData.heading;
					magoManager.changeLocationAndRotation(selectedBuilding.buildingId, geoLocationData.latitude, geoLocationData.longitude, geoLocationData.elevation,
						currentHeading-increDeg, geoLocationData.pitch, geoLocationData.roll);
				}
			}
		}
		else if (event.key === "w" || event.key === "W") 
		{  // right arrow
			// get current building selected.***
			if (magoManager.magoPolicy.issueInsertEnable)
			{ return; }
			var selectedBuilding = magoManager.buildingSelected;
			if (selectedBuilding !== undefined) 
			{
				var geoLocationData = selectedBuilding.geoLocDataManager.geoLocationDataArray[0];
				if (geoLocationData !== undefined) 
				{
					if (geoLocationData.pitch === undefined) { geoLocationData.pitch = 0; } 
					var currentPitch = geoLocationData.pitch;
					magoManager.changeLocationAndRotation(selectedBuilding.buildingId, geoLocationData.latitude, geoLocationData.longitude, geoLocationData.elevation,
						geoLocationData.heading, currentPitch+increDeg, geoLocationData.roll);
				}
			}
		}
		else if (event.key === "s" || event.key === "S") 
		{  // right arrow
			// get current building selected.***
			if (magoManager.magoPolicy.issueInsertEnable)
			{ return; }
			var selectedBuilding = magoManager.buildingSelected;
			if (selectedBuilding !== undefined) 
			{
				var geoLocationData = selectedBuilding.geoLocDataManager.geoLocationDataArray[0];
				if (geoLocationData !== undefined) 
				{
					if (geoLocationData.pitch === undefined) { geoLocationData.pitch = 0; } 
					var currentPitch = geoLocationData.pitch;
					magoManager.changeLocationAndRotation(selectedBuilding.buildingId, geoLocationData.latitude, geoLocationData.longitude, geoLocationData.elevation,
						geoLocationData.heading, currentPitch-increDeg, geoLocationData.roll);
				}
			}
		}
		else if (event.key === "e" || event.key === "E") 
		{  // right arrow
			// get current building selected.***
			if (magoManager.magoPolicy.issueInsertEnable)
			{ return; }
			var selectedBuilding = magoManager.buildingSelected;
			if (selectedBuilding !== undefined) 
			{		
				var geoLocationData = selectedBuilding.geoLocDataManager.geoLocationDataArray[0];
				if (geoLocationData !== undefined) 
				{
					if (geoLocationData.roll === undefined) { geoLocationData.roll = 0; } 
					var currentRoll = geoLocationData.roll;
					magoManager.changeLocationAndRotation(selectedBuilding.buildingId, geoLocationData.latitude, geoLocationData.longitude, geoLocationData.elevation,
						geoLocationData.heading, geoLocationData.pitch, currentRoll+increDeg);
				}
			}
		}
		else if (event.key === "d" || event.key === "D") 
		{  // right arrow
			// get current building selected.***
			if (magoManager.magoPolicy.issueInsertEnable)
			{ return; }
			var selectedBuilding = magoManager.buildingSelected;
			if (selectedBuilding !== undefined) 
			{
				var geoLocationData = selectedBuilding.geoLocDataManager.geoLocationDataArray[0];
				if (geoLocationData !== undefined) 
				{
					if (geoLocationData.roll === undefined) { geoLocationData.roll = 0; } 
					var currentRoll = geoLocationData.roll;
					magoManager.changeLocationAndRotation(selectedBuilding.buildingId, geoLocationData.latitude, geoLocationData.longitude, geoLocationData.elevation,
						geoLocationData.heading, geoLocationData.pitch, currentRoll-increDeg);
				}
			}
		}
	}

	// world wind 구현체를 이용
	function drawWorldWind() 
	{
	}

	/**
	 * background provider
	 */
	function backgroundProvider() 
	{
		var provider = new Cesium.WebMapServiceImageryProvider({
			url        : MagoConfig.getPolicy().geo_server_url,
			layers     : MagoConfig.getPolicy().geo_server_layers,
			parameters : {
				service     : MagoConfig.getPolicy().geo_server_parameters_service,
				version     : MagoConfig.getPolicy().geo_server_parameters_version,
				request     : MagoConfig.getPolicy().geo_server_parameters_request,
				transparent : MagoConfig.getPolicy().geo_server_parameters_transparent,
				//tiled : MagoConfig.getPolicy().backgroundProvider.parameters.tiled,
				format      : MagoConfig.getPolicy().geo_server_parameters_format
				//				time : MagoConfig.getPolicy().backgroundProvider.parameters.time,
				//		    	rand : MagoConfig.getPolicy().backgroundProvider.parameters.rand,
				//		    	asdf : MagoConfig.getPolicy().backgroundProvider.parameters.asdf
			}
			//,proxy: new Cesium.DefaultProxy('/proxy/')
		});

		//		if(index) viewer.imageryLayers.addImageryProvider(provider, index);
		viewer.imageryLayers.addImageryProvider(provider);
	}

	/**
	 * zoomTo 할 Entity
	 * @returns entities
	 */
	function initEntity() 
	{
		return viewer.entities.add({
			name     : "여의도",
			position : Cesium.Cartesian3.fromDegrees(37.521168, 126.924185, 3000.0),
			box      : {
				dimensions   : new Cesium.Cartesian3(300000.0*1000.0, 300000.0*1000.0, 300000.0*1000.0), // dimensions : new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
				//material : Cesium.Color.TRANSPARENT
				fill         : false,
				material     : Cesium.Color.TRANSPARENT,
				outline      : true,
				outlineWidth : 3.0,
				outlineColor : Cesium.Color.BLACK
			}
		});
	}

	// terrain 적용 유무를 설정
	function initTerrain() 
	{
		/*		if(MagoConfig.getPolicy().geoConfig.initTerrain.enable) {
			var terrainProvider = new Cesium.CesiumTerrainProvider({
				url : MagoConfig.getPolicy().geoConfig.initTerrain.url,
				requestWaterMask: MagoConfig.getPolicy().geoConfig.initTerrain.requestWaterMask,
				requestVertexNormals: MagoConfig.getPolicy().geoConfig.initTerrain.requestVertexNormals
			});
			viewer.terrainProvider = terrainProvider;
		}*/
	}

	// 최초 로딩시 이동할 카메라 위치
	function initCamera() 
	{
		viewer.camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(parseFloat(MagoConfig.getPolicy().geo_init_longitude),
				parseFloat(MagoConfig.getPolicy().geo_init_latitude),
				parseFloat(MagoConfig.getPolicy().geo_init_height)),
			duration: parseInt(MagoConfig.getPolicy().geo_init_duration)
		});
	}

	// deploy 타입 적용
	function initRenderMode() 
	{
		var api = new API("renderMode");
		api.setRenderMode("1");
		magoManager.callAPI(api);

		if (MagoConfig.getPolicy().geo_time_line_enable === "false") 
		{
			// visible <---> hidden
			$(viewer._animation.container).css("visibility", "hidden");
			$(viewer._timeline.container).css("visibility", "hidden");
			viewer.forceResize();
		}
	}
	
	// pick baseLayer
	function setDefaultDataset() 
	{
		var DEFALUT_IMAGE = "ESRI World Imagery";
		var DEFALUT_TERRAIN = "STK World Terrain meshes";
		
		// search default imageryProvider from baseLayerPicker
		var imageryProvider = null;
		var imageryProviderViewModels = viewer.baseLayerPicker.viewModel.imageryProviderViewModels; 
		for (var i in imageryProviderViewModels) 
		{
			var provider = imageryProviderViewModels[i];
			if (provider.name === DEFALUT_IMAGE) 
			{
				imageryProvider = provider;
				break;
			}
		}
		if (imageryProvider) { viewer.baseLayerPicker.viewModel.selectedImagery = imageryProvider; }
	  
		// search default terrainProvider from baseLayerPicker
		var terrainProvider = null;
		var terrainProviderViewModels = viewer.baseLayerPicker.viewModel.terrainProviderViewModels;
		for (var i in terrainProviderViewModels) 
		{
			var provider = terrainProviderViewModels[i];
			if (provider.name === DEFALUT_TERRAIN) 
			{
				terrainProvider = provider;
				break;
			}
		}
		if (terrainProvider) { viewer.baseLayerPicker.viewModel.selectedTerrain = terrainProvider; }
	}
	
	// TODO API 객체를 생성해서 하나의 parameter로 전달하는 방식이 좀 더 깔끔할거 같지만 성능적인 부분에서 조금은 투박할거 같아서 일단 이렇게 처리
	return {
		// api gateway 역할
		callAPI: function(api) 
		{
			var result = magoManager.callAPI(api);
			if (api.getAPIName() === "getLocationAndRotation") 
			{
				return result;
			}
		},
		// 초기화 api
		init: function() 
		{
		},
		// flyTo
		flyTo: function(issueId, issueType, longitude, latitude, height, duration) 
		{
			if (MagoConfig.getPolicy().geo_view_library === Constant.CESIUM) 
			{
				viewer.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(parseFloat(longitude),
						parseFloat(latitude),
						parseFloat(height) + 10),
					duration: parseInt(duration)
				});
			}
			else 
			{
				wwd.goToAnimator.travelTime = duration * 1000;
				wwd.goTo(new WorldWind.Position(parseFloat(latitude), parseFloat(longitude), parseFloat(height) + 50));
			}
			// pin을 그림
			if (issueId !== null && issueType !== undefined) 
			{
				var api = new API("drawInsertIssueImage");
				api.setDrawType(0);
				api.setIssueId(issueId);
				api.setIssueType(issueType);
				api.setDataKey(null);
				api.setLatitude(latitude);
				api.setLongitude(longitude);
				api.setElevation(height);
				magoManager.callAPI(api);
			}
		},
		// 블락 및 부재 검색 api
		search: function(blockId) 
		{
		},
		// 블락 및 부재 검색 api
		renderMode: function(renderMode) 
		{
		},
		// 선택 블락 highlighting
		highlighting: function(blockId) 
		{
		},
		// 선택 블락 color 변경
		setColor: function() 
		{
		},
		// 선택 블락 표시
		show: function() 
		{
			draw();
		},
		// 선택 블락 숨기기
		hide: function() 
		{
		},
		// 선택 블락 이동
		move: function() 
		{
		},
		mouseMove: function(eventType) 
		{
			var camera = viewer.camera;
			var canvas = viewer.canvas;
			var ellipsoid = scene.globe.ellipsoid;
			var width = canvas.clientWidth;
	        var height = canvas.clientHeight;

	        // Coordinate (0.0, 0.0) will be where the mouse was clicked.
			/*	        var x = (nowMousePosition.x - startMousePosition.x) / width;
	        var y = -(nowMousePosition.y - startMousePosition.y) / height;

	        var lookFactor = 0.05;
	        camera.lookRight(x * lookFactor);
	        camera.lookUp(y * lookFactor);*/

		    // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
		    var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
		    var moveRate = (cameraHeight) / 100.0;
		    
		    // 보정을 위한 값
		    var reviseValue = 0;
		    if (parseInt(moveRate) >= 300) { reviseValue = parseInt(moveRate) * 50; }
		    else if (parseInt(moveRate) >= 20 && parseInt(moveRate) < 300) { reviseValue = parseInt(moveRate) * 30; }
		    else { reviseValue = parseInt(moveRate) * 10; }
		    if (reviseValue === 0) { reviseValue = 5; }
		    
		    console.log("moveRate = " + moveRate + ", reviseValue = " + reviseValue);
		    moveRate = moveRate + reviseValue;
		    
		    switch (eventType) 
			{
		    	case "moveForward" : camera.moveForward(moveRate);
		    		break;
		    	case "moveBackward" : camera.moveBackward(moveRate);
	    			break;
		    	case "moveRight" : camera.moveRight(moveRate);
		    		break;
		    	case "moveLeft" : camera.moveLeft(moveRate);
		    		break;
		    	case "moveUp" : camera.moveUp(moveRate);
	    			break;
		    	case "moveDown" : camera.moveDown(moveRate);
	    			break;
		    }
		}
	};
};

'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class Matrix4
 */
var Matrix4 = function() 
{
	if (!(this instanceof Matrix4)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this._floatArrays = [ 	1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
};

/**
 * 어떤 일을 하고 있습니까?
 */
Matrix4.prototype.Identity = function() 
{
	this._floatArrays = [ 	1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns rowMajor_matrix
 */
Matrix4.prototype.getRowMajorMatrix = function() 
{
	var rowMajor_matrix = new Float32Array(16);

	rowMajor_matrix[0] = this.get(0, 0);
	rowMajor_matrix[1] = this.get(1, 0);
	rowMajor_matrix[2] = this.get(2, 0);
	rowMajor_matrix[3] = this.get(3, 0);

	rowMajor_matrix[4] = this.get(0, 1);
	rowMajor_matrix[5] = this.get(1, 1);
	rowMajor_matrix[6] = this.get(2, 1);
	rowMajor_matrix[7] = this.get(3, 1);

	rowMajor_matrix[8] = this.get(0, 2);
	rowMajor_matrix[9] = this.get(1, 2);
	rowMajor_matrix[10] = this.get(2, 2);
	rowMajor_matrix[11] = this.get(3, 2);

	rowMajor_matrix[12] = this.get(0, 3);
	rowMajor_matrix[13] = this.get(1, 3);
	rowMajor_matrix[14] = this.get(2, 3);
	rowMajor_matrix[15] = this.get(3, 3);

	return rowMajor_matrix;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param angDeg 변수
 * @param axis_x 변수
 * @param axis_y 변수
 * @param axis_z 변수
 */
Matrix4.prototype.rotationAxisAngDeg = function(angDeg, axis_x, axis_y, axis_z) 
{
	var quaternion = new Quaternion();
	quaternion.rotationAngDeg(angDeg, axis_x, axis_y, axis_z);
	this.rotationByQuaternion(quaternion);
	quaternion = undefined;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param angRad 변수
 * @param axis_x 변수
 * @param axis_y 변수
 * @param axis_z 변수
 */
Matrix4.prototype.rotationAxisAngRad = function(angRad, axis_x, axis_y, axis_z) 
{
	var quaternion = new Quaternion();
	quaternion.rotationAngRad(angRad, axis_x, axis_y, axis_z);
	this.rotationByQuaternion(quaternion);
	quaternion = undefined;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param quaternion 변수
 */
Matrix4.prototype.rotationByQuaternion = function(quaternion) 
{
	var w = quaternion.w;
	var x = quaternion.x;
	var y = quaternion.y;
	var z = quaternion.z;

	this._floatArrays[this.getIndexOfArray(0, 0)] = 1 - 2*y*y - 2*z*z;
	this._floatArrays[this.getIndexOfArray(0, 1)] = 2*x*y + 2*z*w;
	this._floatArrays[this.getIndexOfArray(0, 2)] = 2*x*z - 2*y*w;
	this._floatArrays[this.getIndexOfArray(0, 3)] = 0.0;

	this._floatArrays[this.getIndexOfArray(1, 0)] = 2*x*y - 2*z*w;
	this._floatArrays[this.getIndexOfArray(1, 1)] = 1 - 2*x*x - 2*z*z;
	this._floatArrays[this.getIndexOfArray(1, 2)] = 2*y*z + 2*x*w;
	this._floatArrays[this.getIndexOfArray(1, 3)] = 0.0;

	this._floatArrays[this.getIndexOfArray(2, 0)] = 2*x*z + 2*y*w;
	this._floatArrays[this.getIndexOfArray(2, 1)] = 2*y*z - 2*x*w;
	this._floatArrays[this.getIndexOfArray(2, 2)] = 1 - 2*x*x - 2*y*y;
	this._floatArrays[this.getIndexOfArray(2, 3)] = 0.0;

	this._floatArrays[this.getIndexOfArray(3, 0)] = 0.0;
	this._floatArrays[this.getIndexOfArray(3, 1)] = 0.0;
	this._floatArrays[this.getIndexOfArray(3, 2)] = 0.0;
	this._floatArrays[this.getIndexOfArray(3, 3)] = 1.0;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param float32array 변수
 */
Matrix4.prototype.setByFloat32Array = function(float32array) 
{
	for (var i=0; i<16; i++) 
	{
		this._floatArrays[i] = float32array[i];
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param col 변수
 * @param row 변수
 */
Matrix4.prototype.getIndexOfArray = function(col, row) 
{
	return 4 * col + row;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param col 변수
 * @param row 변수
 */
Matrix4.prototype.get = function(col, row) 
{
	return this._floatArrays[this.getIndexOfArray(col, row)];
};

/**
 * 어떤 일을 하고 있습니까?
 * @param point3d 변수
 * @param result_point3d 변수
 * @returns result_point3d
 */
Matrix4.prototype.transformPoint3D = function(point3d, result_point3d) 
{
	if (result_point3d === undefined) { result_point3d = new Point3D(); }

	var x = point3d.x;
	var y = point3d.y;
	var z = point3d.z;

	result_point3d.x = x*this.get(0, 0) + y*this.get(1, 0) + z*this.get(2, 0) + this.get(3, 0);
	result_point3d.y = x*this.get(0, 1) + y*this.get(1, 1) + z*this.get(2, 1) + this.get(3, 1);
	result_point3d.z = x*this.get(0, 2) + y*this.get(1, 2) + z*this.get(2, 2) + this.get(3, 2);

	return result_point3d;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param point3d 변수
 * @param result_point3d 변수
 * @returns result_point3d
 */
Matrix4.prototype.rotatePoint3D = function(point3d, result_point3d) 
{
	if (result_point3d === undefined) { result_point3d = new Point3D(); }

	var x = point3d.x;
	var y = point3d.y;
	var z = point3d.z;

	result_point3d.x = x*this.get(0, 0) + y*this.get(1, 0) + z*this.get(2, 0);
	result_point3d.y = x*this.get(0, 1) + y*this.get(1, 1) + z*this.get(2, 1);
	result_point3d.z = x*this.get(0, 2) + y*this.get(1, 2) + z*this.get(2, 2);

	return result_point3d;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param matrix 변수
 * @param resultMat 변수
 * @returns resultMat
 */
Matrix4.prototype.getMultipliedByMatrix = function(matrix, resultMat) 
{

	if (resultMat === undefined) { resultMat = new Matrix4(); }

	for (var i=0; i<4; i++) 
	{
		for (var j=0; j<4; j++) 
		{
			var idx = this.getIndexOfArray(i, j);
			resultMat._floatArrays[idx] = 0.0;
			for (var k=0; k<4; k++) 
			{
				resultMat._floatArrays[idx] += matrix.get(k, j) * this.get(i, k);
			}
		}
	}
	return resultMat;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param matrix 변수
 * @param resultMat 변수
 * @returns resultMat
 */
Matrix4.prototype.copyFromMatrix4 = function(matrix) 
{
	for (var i=0; i<16; i++)
	{
		this._floatArrays[i] = matrix._floatArrays[i];
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param matrix 변수
 * @param resultMat 변수
 * @returns resultMat
 */
Matrix4.prototype.copyFromFloatArray = function(floatArrays) 
{
	for (var i=0; i<16; i++)
	{
		this._floatArrays[i] = floatArrays[i];
	}
};

/**
 * Returns if the value is aproximately equal to the valueToCompare with error.
 * @returns {boolean} are equal.
 */
Matrix4.prototype.computeMatrixType = function() 
{
	// matrixType = 0 -> identity matrix.
	// matrixType = 1 -> translate matrix.
	// matrixType = 2 -> transform matrix.
	
	var error = 10E-8;
	if (this.isRotationIdentity())
	{
		// check if there are translation.
		if (this.aproxEqual(this._floatArrays[3], 0, error))
		{
			if (this.aproxEqual(this._floatArrays[7], 0, error))
			{
				if (this.aproxEqual(this._floatArrays[11], 0, error))
				{
					if (this.aproxEqual(this._floatArrays[12], 0, error))
					{
						if (this.aproxEqual(this._floatArrays[13], 0, error))
						{
							if (this.aproxEqual(this._floatArrays[14], 0, error))
							{
								if (this.aproxEqual(this._floatArrays[15], 1, error))
								{
									return 0;
								}
								else { return 1; }
							}
							else { return 1; }
						}
						else { return 1; }
					}
					else { return 1; }
				}
				else { return 1; }
			}
			else { return 1; }
		}
		else { return 1; }
	}
	else
	{
		return 2;
	}
};

/**
 * Returns if the value is aproximately equal to the valueToCompare with error.
 * @returns {boolean} are equal.
 */
Matrix4.prototype.aproxEqual = function(value, valueToCompare, error) 
{
	if (error === undefined)
	{ error = 10E-8; }
	
	if (value === valueToCompare)
	{
		return true;
	}
	else
	{
		if (value > (valueToCompare - error) && value < (valueToCompare + error))
		{ return true; }
		else
		{ return false; }
	}
};

/**
 * Returns if the matrix is identity.
 * @returns {boolean} matrixIsIdentity.
 */
Matrix4.prototype.isIdentity = function(error) 
{	
	if (this.isRotationIdentity())
	{
		if (this.aproxEqual(this._floatArrays[3], 0, error))
		{
			if (this.aproxEqual(this._floatArrays[7], 0, error))
			{
				if (this.aproxEqual(this._floatArrays[11], 0, error))
				{
					if (this.aproxEqual(this._floatArrays[12], 0, error))
					{
						if (this.aproxEqual(this._floatArrays[13], 0, error))
						{
							if (this.aproxEqual(this._floatArrays[14], 0, error))
							{
								if (this.aproxEqual(this._floatArrays[15], 1, error))
								{
									return true;
								}
								else { return false; }
							}
							else { return false; }
						}
						else { return false; }
					}
					else { return false; }
				}
				else { return false; }
			}
			else { return false; }
		}
		else { return false; }
	}
	else
	{ return false; }
};

/**
 * Returns if the matrix is identity.
 * @returns {boolean} matrixIsIdentity.
 */
Matrix4.prototype.isRotationIdentity = function(error) 
{
	if (this.aproxEqual(this._floatArrays[0], 1, error))
	{
		if (this.aproxEqual(this._floatArrays[1], 0, error))
		{
			if (this.aproxEqual(this._floatArrays[2], 0, error))
			{
				if (this.aproxEqual(this._floatArrays[4], 0, error))
				{
					if (this.aproxEqual(this._floatArrays[5], 1, error))
					{
						if (this.aproxEqual(this._floatArrays[6], 0, error))
						{
							if (this.aproxEqual(this._floatArrays[8], 0, error))
							{
								if (this.aproxEqual(this._floatArrays[9], 0, error))
								{
									if (this.aproxEqual(this._floatArrays[10], 1, error))
									{
										return true;
									}
									else { return false; }
								}
								else { return false; }
							}
							else { return false; }
						}
						else { return false; }
					}
					else { return false; }
				}
				else { return false; }
			}
			else { return false; }
		}
		else { return false; }
	}
	else { return false; }
};























'use strict';

var Messages = {};

Messages.CONSTRUCT_ERROR = "이 객체는 new를 사용하여 생성해야 합니다.";
'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class ObjectMarker
 *
 */
var ObjectMarker = function() 
{
	if (!(this instanceof ObjectMarker)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.geoLocationData = new GeoLocationData();
	this.issue_id = null;
	this.issue_type = null;
	//this.latitude = 0;
	//this.longitude = 0;
	//this.height = 0;
};

ObjectMarker.prototype.copyFrom = function(objMarker) 
{
	if (objMarker === undefined) { return; }
		
	if (objMarker.geoLocationData) 
	{
		this.geoLocationData.copyFrom(objMarker.geoLocationData);
	}
	
	this.issue_id = objMarker.issue_id;
	this.issue_type = objMarker.issue_type;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class ObjectMarkerManager
 *
 */
var ObjectMarkerManager = function() 
{
	if (!(this instanceof ObjectMarkerManager)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.objectMarkerArray = [];

};

/**
 * 어떤 일을 하고 있습니까?
 * @class ObjectMarkerManager
 *
 */
ObjectMarkerManager.prototype.newObjectMarker = function()
{
	var objMarker = new ObjectMarker();
	this.objectMarkerArray.push(objMarker);
	return objMarker;
};
'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class OcclusionCullingOctreeCell
 * @param occlusionCullingOctree_Cell_Owner 변수
 */
var OcclusionCullingOctreeCell = function(occlusionCullingOctree_Cell_Owner) 
{
	if (!(this instanceof OcclusionCullingOctreeCell)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this._ocCulling_Cell_owner = occlusionCullingOctree_Cell_Owner;
	this.minX = 0.0;
	this.maxX = 0.0;
	this.minY = 0.0;
	this.maxY = 0.0;
	this.minZ = 0.0;
	this.maxZ = 0.0;
	this._indicesArray = []; // Visible objects indices.***
	this._subBoxesArray = [];
	this.modelReferencedGroupsList; // undefined initially.
};

/**
 * 어떤 일을 하고 있습니까?
 * @param neoRefsIndices 변수
 * @param motherNeoRefsList 변수
 */
OcclusionCullingOctreeCell.prototype.createModelReferencedGroups = function(motherNeoRefsList) 
{
	var subBoxesCount = this._subBoxesArray.length;
	if (subBoxesCount == 0)
	{
		if (this._indicesArray.length == 0)
		{ return; }
		
		if (this.modelReferencedGroupsList == undefined)
		{ this.modelReferencedGroupsList = new ModelReferencedGroupsList(); }
		
		this.modelReferencedGroupsList.createModelReferencedGroups(this._indicesArray, motherNeoRefsList);
	}
	else
	{
		for (var i=0; i<subBoxesCount; i++)
		{
			this._subBoxesArray[i].createModelReferencedGroups(motherNeoRefsList);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns subBox
 */
OcclusionCullingOctreeCell.prototype.newSubBox = function() 
{
	var subBox = new OcclusionCullingOctreeCell(this);
	this._subBoxesArray.push(subBox);
	return subBox;
};

/**
 * 어떤 일을 하고 있습니까?
 */
OcclusionCullingOctreeCell.prototype.create8SubBoxes = function() 
{
	this._subBoxesArray.length = 0;	
	for (var i=0; i<8; i++) 
	{
		this.newSubBox();
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param min_x 변수
 * @param max_x 변수
 * @param min_y 변수
 * @param max_y 변수
 * @param min_z 변수
 * @param max_z 변수
 */
OcclusionCullingOctreeCell.prototype.setDimensions = function(min_x, max_x, min_y, max_y, min_z, max_z) 
{
	this.minX = min_x;
	this.maxX = max_x;
	this.minY = min_y;
	this.maxY = max_y;
	this.minZ = min_z;
	this.maxZ = max_z;
};

/**
 * 어떤 일을 하고 있습니까?
 */
OcclusionCullingOctreeCell.prototype.setSizesSubBoxes = function() 
{
	// Bottom                      Top
	// |----------|----------|     |----------|----------|
	// |          |          |     |          |          |       Y
	// |    3     |    2     |	   |    7     |    6     |       ^
	// |          |          |     |          |          |       |
	// |----------|----------|     |----------|----------|       |
	// |          |          |     |          |          |       |
	// |     0    |     1    |     |    4     |    5     |       |
	// |          |          |     |          |          |       -----------------> X
	// |----------|----------|     |----------|----------|  
	
	if (this._subBoxesArray.length > 0) 
	{
		var half_x= (this.maxX + this.minX)/2.0;
		var half_y= (this.maxY + this.minY)/2.0;
		var half_z= (this.maxZ + this.minZ)/2.0;
		
		this._subBoxesArray[0].setDimensions(this.minX, half_x,   this.minY, half_y,   this.minZ, half_z);
		this._subBoxesArray[1].setDimensions(half_x, this.maxX,   this.minY, half_y,   this.minZ, half_z);
		this._subBoxesArray[2].setDimensions(half_x, this.maxX,   half_y, this.maxY,   this.minZ, half_z);
		this._subBoxesArray[3].setDimensions(this.minX, half_x,   half_y, this.maxY,   this.minZ, half_z);

		this._subBoxesArray[4].setDimensions(this.minX, half_x,   this.minY, half_y,   half_z, this.maxZ);
		this._subBoxesArray[5].setDimensions(half_x, this.maxX,   this.minY, half_y,   half_z, this.maxZ);
		this._subBoxesArray[6].setDimensions(half_x, this.maxX,   half_y, this.maxY,   half_z, this.maxZ);
		this._subBoxesArray[7].setDimensions(this.minX, half_x,   half_y, this.maxY,   half_z, this.maxZ);
		
		for (var i=0; i<this._subBoxesArray.length; i++) 
		{
			this._subBoxesArray[i].setSizesSubBoxes();
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param x 변수
 * @param y 변수
 * @param z 변수
 * @returns intersects
 */
OcclusionCullingOctreeCell.prototype.intersectsWithPoint3D = function(x, y, z) 
{
	var intersects = false;
	if (x> this.minX && x<this.maxX) 
	{
		if (y> this.minY && y<this.maxY) 
		{
			if (z> this.minZ && z<this.maxZ) 
			{
				intersects = true;
			}
		}
	}
	
	return intersects;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param x 변수
 * @param y 변수
 * @param z 변수
 * @returns intersectedSubBox
 */
OcclusionCullingOctreeCell.prototype.getIntersectedSubBoxByPoint3D = function(x, y, z) 
{
	if (this._ocCulling_Cell_owner === null) 
	{
		// This is the mother_cell.***
		if (!this.intersectsWithPoint3D(x, y, z)) 
		{
			return null;
		}
	}
	
	var intersectedSubBox = null;
	var subBoxes_count = this._subBoxesArray.length;
	if (subBoxes_count > 0) 
	{
		var center_x = (this.minX + this.maxX)/2.0;
		var center_y = (this.minY + this.maxY)/2.0;
		var center_z = (this.minZ + this.maxZ)/2.0;
		
		var intersectedSubBox_aux = null;
		var intersectedSubBox_idx;
		if (x<center_x) 
		{
			// Here are the boxes number 0, 3, 4, 7.***
			if (y<center_y) 
			{
				// Here are 0, 4.***
				if (z<center_z) { intersectedSubBox_idx = 0; }
				else { intersectedSubBox_idx = 4; }
			}
			else 
			{
				// Here are 3, 7.***
				if (z<center_z) { intersectedSubBox_idx = 3; }
				else { intersectedSubBox_idx = 7; }
			}
		}
		else 
		{
			// Here are the boxes number 1, 2, 5, 6.***
			if (y<center_y) 
			{
				// Here are 1, 5.***
				if (z<center_z) { intersectedSubBox_idx = 1; }
				else { intersectedSubBox_idx = 5; }
			}
			else 
			{
				// Here are 2, 6.***
				if (z<center_z) { intersectedSubBox_idx = 2; }
				else { intersectedSubBox_idx = 6; }
			}
		}
		
		intersectedSubBox_aux = this._subBoxesArray[intersectedSubBox_idx];
		intersectedSubBox = intersectedSubBox_aux.getIntersectedSubBoxByPoint3D(x, y, z);
		
	}
	else 
	{
		intersectedSubBox = this;
	}
	
	return intersectedSubBox;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 * @param result_visibleIndicesArray 변수
 * @returns result_visibleIndicesArray
 */
OcclusionCullingOctreeCell.prototype.getIndicesVisiblesForEye = function(eye_x, eye_y, eye_z, result_visibleIndicesArray, result_modelReferencedGroup) 
{
	var intersectedSubBox = this.getIntersectedSubBoxByPoint3D(eye_x, eye_y, eye_z);
	
	if (intersectedSubBox !== null && intersectedSubBox._indicesArray.length > 0) 
	{
		result_visibleIndicesArray = intersectedSubBox._indicesArray;
		if (result_modelReferencedGroup)
		{
			result_modelReferencedGroup = this.modelReferencedGroupsList;
		}
	}
	
	return result_visibleIndicesArray;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param expansionDist 변수
 */
OcclusionCullingOctreeCell.prototype.expandBox = function(expansionDist) 
{
	this.minX -= expansionDist;
	this.maxX += expansionDist;
	this.minY -= expansionDist;
	this.maxY += expansionDist;
	this.minZ -= expansionDist;
	this.maxZ += expansionDist;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param arrayBuffer 변수
 * @param bytes_readed 변수
 * @param f4dReaderWriter 변수
 * @returns bytes_readed
 */
OcclusionCullingOctreeCell.prototype.parseArrayBuffer = function(arrayBuffer, bytes_readed, f4dReaderWriter) 
{
	// Important note: this is the version of neoGeometry.***
	// Important note: this is the version of neoGeometry.***
	// Important note: this is the version of neoGeometry.***
	var is_mother_cell = f4dReaderWriter.readInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed += 1;
	if (is_mother_cell) 
	{
		// read the mother dimensions.***
		var minX = f4dReaderWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
		var maxX = f4dReaderWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
		var minY = f4dReaderWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
		var maxY = f4dReaderWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
		var minZ = f4dReaderWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
		var maxZ = f4dReaderWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
		
		this.setDimensions(minX, maxX, minY, maxY, minZ, maxZ);
	}
	
	var subBoxes_count = f4dReaderWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
	
	if (subBoxes_count === 0) 
	{
		var objects_count = f4dReaderWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
		for (var i=0; i<objects_count; i++) 
		{
			var objects_idxInList = f4dReaderWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			this._indicesArray.push(objects_idxInList);
		}
	}
	else 
	{
		for (var i=0; i<subBoxes_count; i++) 
		{
			var subOcclusionBox = this.newSubBox();
			bytes_readed = subOcclusionBox.parseArrayBuffer(arrayBuffer, bytes_readed, f4dReaderWriter);
		}
	}
	
	return bytes_readed;
};
	
/**
 * 어떤 일을 하고 있습니까?
 * @class OcclusionCullingOctree
 */
var OcclusionCullingOctree = function() 
{
	if (!(this instanceof OcclusionCullingOctree)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this._ocCulling_box = new OcclusionCullingOctreeCell(null);
	this._infinite_ocCulling_box = new OcclusionCullingOctreeCell(null);
};
'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class Pin
 *
 */
var Pin = function() 
{
	if (!(this instanceof Pin)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.texture; // default.***
	this.texturesArray = [];
	this.positionBuffer;
	this.texcoordBuffer;
	
};

Pin.prototype.createPin = function(gl)
{
	this.positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

	// Put a unit quad in the buffer
	var positionsPinQuad = [
		0, 0, 0,
		1, 0, 0,
		0, 1, 0,
		0, 1, 0,
		1, 0, 0,
		1, 1, 0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionsPinQuad), gl.STATIC_DRAW);

	this.texcoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
	var texcoordsPinQuad = [
		0, 0,
		1, 0,
		0, 1,
		0, 1,
		1, 0,
		1, 1
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoordsPinQuad), gl.STATIC_DRAW);
	
};

Pin.prototype.createPinCenterBottom = function(gl)
{
	this.positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

	// Put a unit quad in the buffer
	var positionsPinQuad = [
		-0.5, 0, 0,
		0.5, 0, 0,
		-0.5, 1, 0,
		-0.5, 1, 0,
		0.5, 0, 0,
		0.5, 1, 0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionsPinQuad), gl.STATIC_DRAW);

	this.texcoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
	var texcoordsPinQuad = [
		0, 0,
		1, 0,
		0, 1,
		0, 1,
		1, 0,
		1, 1
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoordsPinQuad), gl.STATIC_DRAW);
	
};
'use strict';

/**
 * Plane on 3D space. Plane equation ax+by+cz+d = 0.
 * @class Plane
 */
var Plane = function() 
{
	if (!(this instanceof Plane)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	// ax+by+cz+d = 0 plane.***
	this.a = 0.0;
	this.b = 0.0;
	this.c = 0.0;
	this.d = 0.0;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param px 변수
 * @param py 변수
 * @param pz 변수
 * @param nx 변수
 * @param ny 변수
 * @param nz 변수p
 */
Plane.prototype.setPointAndNormal = function(px, py, pz, nx, ny, nz) 
{
	this.a = nx;
	this.b = ny;
	this.c = nz;
	this.d = -this.a*px -this.b*py - this.c*pz;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param dist
 * @param nx 변수
 * @param ny 변수
 * @param nz 변수p
 */
Plane.prototype.setNormalAndDistance = function(nx, ny, nz, dist) 
{
	this.a = nx;
	this.b = ny;
	this.c = nz;
	this.d = dist;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param line 변수
 * @param intersectionPoint 변수
 */
Plane.prototype.intersectionLine = function(line, intersectionPoint) 
{
	
	var r = line.point.x;
	var s = line.point.y;
	var t = line.point.z;
	
	var u = line.direction.x;
	var v = line.direction.y;
	var w = line.direction.z;
	
	var den = this.a*u + this.b*v + this.c*w;
	
	if (Math.abs(den) > 10E-8) 
	{
		var alfa = -((this.a*r + this.b*s + this.c*t + this.d)/(den));
		
		if (intersectionPoint === undefined) { intersectionPoint = new Point3D(); }
		
		intersectionPoint.set(r+alfa*u, s+alfa*v, t+alfa*w);
		return intersectionPoint;
	}
	else { return undefined; }
};

/**
 * 어떤 일을 하고 있습니까?
 * @param line 변수
 * @param intersectionPoint 변수
 */
Plane.prototype.intersectionSphere = function(sphere) 
{
	if (sphere == undefined)
	{ var hola = 0; }
	
	var sphereCenter = sphere.centerPoint;
	
	// calculate the distance by dotProduct.***
	var distance = sphereCenter.x * this.a + sphereCenter.y * this.b + sphereCenter.z * this.c + this.d;

	if (distance < -sphere.r)
	{
		return Constant.INTERSECTION_OUTSIDE;
	}
	else if (distance < sphere.r)
	{
		return Constant.INTERSECTION_INTERSECT;
	}
	return Constant.INTERSECTION_INSIDE;
};






'use strict';

/**
 * 3차원 정보
 * @class Point3D
 */
var Point3D = function() 
{
	if (!(this instanceof Point3D)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.x = 0.0;
	this.y = 0.0;
	this.z = 0.0;
};

/**
 * 포인트값 삭제
 * 어떤 일을 하고 있습니까?
 */
Point3D.prototype.deleteObjects = function() 
{
	this.x = undefined;
	this.y = undefined;
	this.z = undefined;
};

/**
 * 포인트값 삭제
 * 어떤 일을 하고 있습니까?
 */
Point3D.prototype.copyFrom = function(point3d) 
{
	this.x = point3d.x;
	this.y = point3d.y;
	this.z = point3d.z;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z );
 */
Point3D.prototype.getModul = function() 
{
	return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z );
};

/**
 * 
 * 어떤 일을 하고 있습니까?
 */
Point3D.prototype.unitary = function() 
{
	var modul = this.getModul();
	this.x /= modul;
	this.y /= modul;
	this.z /= modul;
};

/**
 * nomal 계산
 * @param point 변수
 * @param resultPoint 변수
 * @returns resultPoint
 */
Point3D.prototype.crossProduct = function(point, resultPoint) 
{
	if (resultPoint === undefined) { resultPoint = new Point3D(); }

	resultPoint.x = this.y * point.z - point.y * this.z;
	resultPoint.y = point.x * this.z - this.x * point.z;
	resultPoint.z = this.x * point.y - point.x * this.y;

	return resultPoint;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param px 변수
 * @param py 변수
 * @param pz 변수
 * @returns dx*dx + dy*dy + dz*dz
 */
Point3D.prototype.squareDistTo = function(x, y, z) 
{
	var dx = this.x - x;
	var dy = this.y - y;
	var dz = this.z - z;

	return dx*dx + dy*dy + dz*dz;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param px 변수
 * @param py 변수
 * @param pz 변수
 * @returns dx*dx + dy*dy + dz*dz
 */
Point3D.prototype.distTo = function(x, y, z) 
{
	return Math.sqrt(this.squareDistTo(x, y, z));
};

/**
 * 어떤 일을 하고 있습니까?
 * @param x 변수
 * @param y 변수
 * @param z 변수
 */
Point3D.prototype.set = function(x, y, z) 
{
	this.x = x; this.y = y; this.z = z;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param x 변수
 * @param y 변수
 * @param z 변수
 */
Point3D.prototype.add = function(x, y, z) 
{
	this.x += x; this.y += y; this.z += z;
};

'use strict';

/**
* 어떤 일을 하고 있습니까?
* @class Quaternion
*/
var Quaternion = function() 
{
	if (!(this instanceof Quaternion)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.x = 0.0;
	this.y = 0.0;
	this.z = 0.0;
	this.w = 1.0;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w )
 */
Quaternion.prototype.Modul = function() 
{
	return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w );
};

/**
 * 어떤 일을 하고 있습니까?
 */
Quaternion.prototype.Unitary = function() 
{
	var modul = this.Modul();
	this.x /= modul;
	this.y /= modul;
	this.z /= modul;
	this.w /= modul;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param angDeg 변수
 * @param axis_x 변수
 * @param axis_y 변수
 * @param axis_z 변수
 */
Quaternion.prototype.rotationAngDeg = function(angDeg, axis_x, axis_y, axis_z) 
{
	var angRad = angDeg*Math.PI/180.0;
	this.rotationAngRad(angRad, axis_x, axis_y, axis_z);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param angRad 변수
 * @param axis_x 변수
 * @param axis_y 변수
 * @param axis_z 변수
 */
Quaternion.prototype.rotationAngRad = function(angRad, axis_x, axis_y, axis_z) 
{
	var s = Math.sqrt(axis_x*axis_x + axis_y*axis_y + axis_z*axis_z);
	var error = 10E-13;
	if (!s < error) 
	{
		var c = 1.0/s;
		var omega = -0.5 * angRad;
		s = Math.sin(omega);
		this.x = axis_x * c * s;
		this.y = axis_y * c * s;
		this.z = axis_z * c * s;
		this.w = Math.cos(omega);
		this.Unitary();
	}
	else 
	{
		this.x = 0.0;
		this.y = 0.0;
		this.z = 0.0;
		this.w = 1.0;
	}
};

'use strict';

/**
 * Quadtree based tile with thickness.
 * @class SmartTile
 */
var SmartTile = function(smartTileName) 
{
	//       +-----+-----+
	//       |  3  |  2  |
	//       +-----+-----+
	//       |  0  |  1  |
	//       +-----+-----+
	
	if (!(this instanceof SmartTile)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.name;
	if (smartTileName)
	{ this.name = smartTileName; }
	this.depth; // mother tile depth = 0.
	this.minGeographicCoord; // longitude, latitude, altitude.
	this.maxGeographicCoord; // longitude, latitude, altitude.
	this.sphereExtent; // cartesian position sphere in worldCoord.
	this.subTiles; // array.
	//this.startIdx; // todo.
	//this.endIdx; // todo.
	
	this.buildingSeedsArray;
	this.buildingsArray;
};

/**
 * 어떤 일을 하고 있습니까?
 */
SmartTile.prototype.newSubTile = function(parentTile) 
{
	if (this.subTiles == undefined)
	{ this.subTiles = []; }
	
	var subTile = new SmartTile();
	subTile.depth = parentTile.depth + 1;
	this.subTiles.push(subTile);
	return subTile;
};

/**
 * 어떤 일을 하고 있습니까?
 */
SmartTile.prototype.getNeoBuildingById = function(buildingType, buildingId) 
{
	var resultNeoBuilding;
	var hasSubTiles = true;
	if (this.subTiles == undefined)
	{ hasSubTiles = false; }
	
	if (this.subTiles && this.subTiles.length == 0)
	{ hasSubTiles = false; }
		
	if (!hasSubTiles)
	{
		if (this.buildingsArray)
		{
			var buildingCount = this.buildingsArray.length;
			var find = false;
			var i=0;
			while (!find && i<buildingCount) 
			{
				if (buildingType)
				{
					if (this.buildingsArray[i].buildingId === buildingId && this.buildingsArray[i].buildingType === buildingType) 
					{
						find = true;
						resultNeoBuilding = this.buildingsArray[i];
						return resultNeoBuilding;
					}
				}
				else 
				{
					if (this.buildingsArray[i].buildingId === buildingId) 
					{
						find = true;
						resultNeoBuilding = this.buildingsArray[i];
						return resultNeoBuilding;
					}
				}
				i++;
			}
		}	
	}
	else 
	{
		for (var i=0; i<this.subTiles.length; i++)
		{
			resultNeoBuilding = this.subTiles[i].getNeoBuildingById(buildingType, buildingId);
			if (resultNeoBuilding)
			{ return resultNeoBuilding; }
		}
	}
	
	return resultNeoBuilding;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param geoLocData 변수
 */
SmartTile.prototype.makeSphereExtent = function(magoManager) 
{
	if (this.sphereExtent == undefined)
	{ this.sphereExtent = new Sphere(); }
	
	// calculate worldCoord center position.
	var midLongitude = (this.maxGeographicCoord.longitude + this.minGeographicCoord.longitude)/2;
	var midLatitude = (this.maxGeographicCoord.latitude + this.minGeographicCoord.latitude)/2;
	var midAltitude = (this.maxGeographicCoord.altitude + this.minGeographicCoord.altitude)/2;
	this.sphereExtent.centerPoint = ManagerUtils.geographicCoordToWorldPoint(midLongitude, midLatitude, midAltitude, this.sphereExtent.centerPoint, magoManager);
	
	// calculate an aproximate radius.
	var cornerPoint = ManagerUtils.geographicCoordToWorldPoint(this.minGeographicCoord.longitude, this.minGeographicCoord.latitude, this.minGeographicCoord.altitude, cornerPoint, magoManager);
	this.sphereExtent.r = this.sphereExtent.centerPoint.distTo(cornerPoint.x, cornerPoint.y, cornerPoint.z) * 1.2;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param geoLocData 변수
 */
SmartTile.prototype.makeTree = function(minDegree, magoManager) 
{
	if (this.buildingSeedsArray == undefined || this.buildingSeedsArray.length == 0)
	{ return; }
	
	// if this has "buildingSeedsArray" then make sphereExtent.
	this.makeSphereExtent(magoManager);
	
	// now, if the dimensions of the tile is bigger than "minDegree", then make subTiles.
	var longitudeRangeDegree = this.getLongitudeRangeDegree();
	if (longitudeRangeDegree > minDegree)
	{
		// create 4 child smartTiles.
		for (var i=0; i<4; i++)
		{ this.newSubTile(this); }
		
		// set the sizes to subTiles.
		this.setSizesToSubTiles();
		
		// intercept buildingSeeds for each subTiles.
		for (var i=0; i<4; i++)
		{
			this.subTiles[i].takeIntersectedBuildingSeeds(this.buildingSeedsArray);
		}
		
		// for each subTile that has intercepted buildingSeeds -> makeTree.
		for (var i=0; i<4; i++)
		{
			this.subTiles[i].makeTree(minDegree, magoManager);
		}
		
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param geoLocData 변수
 */
SmartTile.prototype.takeIntersectedBuildingSeeds = function(buildingSeedsArray) 
{
	var buildingSeed;
	var buildingSeedsCount = buildingSeedsArray.length;
	for (var i=0; i<buildingSeedsCount; i++)
	{
		buildingSeed = buildingSeedsArray[i];
		if (this.intersectPoint(buildingSeed.geographicCoord.longitude, buildingSeed.geographicCoord.latitude))
		{
			buildingSeedsArray.splice(i, 1);
			i--;
			buildingSeedsCount = buildingSeedsArray.length;
			
			if (this.buildingSeedsArray == undefined)
			{ this.buildingSeedsArray = []; }
			
			this.buildingSeedsArray.push(buildingSeed);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param geographicCoord 변수
 */
SmartTile.prototype.intersectPoint = function(longitude, latitude) 
{
	if (longitude < this.minGeographicCoord.longitude || longitude > this.maxGeographicCoord.longitude)
	{ return false; }
	
	if (latitude < this.minGeographicCoord.latitude || latitude > this.maxGeographicCoord.latitude)
	{ return false; }
	
	return true;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param frustum 변수
 */
SmartTile.prototype.extractLowestTiles = function(resultLowestTilesArray) 
{
	if (this.subTiles == undefined)
	{
		if (this.buildingSeedsArray && this.buildingSeedsArray.length > 0)
		{
			resultLowestTilesArray.push(this);
		}
		return;
	}
		
	var subTilesCount = this.subTiles.length;
	for (var i=0; i<subTilesCount; i++)
	{
		this.subTiles[i].extractLowestTiles(resultLowestTilesArray);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param frustum 변수
 */
SmartTile.prototype.getFrustumIntersectedLowestTiles = function(frustum, resultIntersectedTilesArray) 
{
	var intersectedTiles = [];
	this.getFrustumIntersectedTiles(frustum, intersectedTiles);
	
	var intersectedTilesCount = intersectedTiles.length;
	for (var i=0; i<intersectedTilesCount; i++)
	{
		intersectedTiles[i].extractLowestTiles(resultIntersectedTilesArray);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param frustum 변수
 */
SmartTile.prototype.getFrustumIntersectedTiles = function(frustum, resultIntersectedTilesArray) 
{	
	var intersectionType = frustum.intersectionSphere(this.sphereExtent);
	
	if (intersectionType === Constant.INTERSECTION_OUTSIDE)
	{ return; }
	else if (intersectionType === Constant.INTERSECTION_INSIDE)
	{
		resultIntersectedTilesArray.push(this);
		return;
	}
	else if (intersectionType === Constant.INTERSECTION_INTERSECT)
	{
		if (this.subTiles && this.subTiles.length > 0)
		{
			for (var i=0; i<this.subTiles.length; i++)
			{
				if (this.subTiles[i].sphereExtent)
				{ this.subTiles[i].getFrustumIntersectedTiles(frustum, resultIntersectedTilesArray); }
			}
		}
		else
		{ resultIntersectedTilesArray.push(this); }
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * Extent(범위)
 * @param frustum 변수
 */
SmartTile.prototype.getSphereExtent = function() 
{
	return this.sphereExtent;
};

/**
 * 어떤 일을 하고 있습니까?
 */
SmartTile.prototype.setSize = function(minLon, minLat, minAlt, maxLon, maxLat, maxAlt) 
{
	if (this.minGeographicCoord == undefined)
	{ this.minGeographicCoord = new GeographicCoord(); }
	if (this.maxGeographicCoord == undefined)	
	{ this.maxGeographicCoord = new GeographicCoord(); }
		
	this.minGeographicCoord.setLonLatAlt(minLon, minLat, minAlt);	
	this.maxGeographicCoord.setLonLatAlt(maxLon, maxLat, maxAlt);	
};

/**
 * 어떤 일을 하고 있습니까?
 */
SmartTile.prototype.setSizesToSubTiles = function() 
{
	//       +-----+-----+
	//       |  3  |  2  |
	//       +-----+-----+
	//       |  0  |  1  |
	//       +-----+-----+
	
	var minLon = this.minGeographicCoord.longitude;
	var maxLon = this.maxGeographicCoord.longitude;
	var minLat = this.minGeographicCoord.latitude;
	var maxLat = this.maxGeographicCoord.latitude;
	var minAlt = this.minGeographicCoord.altitude;
	var maxAlt = this.maxGeographicCoord.altitude;
	
	var midLon = (maxLon + minLon)/2;
	var midLat = (maxLat + minLat)/2;
	
	var subTile = this.subTiles[0];
	subTile.setSize(minLon, minLat, minAlt,     midLon, midLat, maxAlt);
	
	subTile = this.subTiles[1];
	subTile.setSize(midLon, minLat, minAlt,     maxLon, midLat, maxAlt);
	
	subTile = this.subTiles[2];
	subTile.setSize(midLon, midLat, minAlt,     maxLon, maxLat, maxAlt);
	
	subTile = this.subTiles[3];
	subTile.setSize(minLon, midLat, minAlt,     midLon, maxLat, maxAlt);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param geoLocData 변수
 */
SmartTile.prototype.getLongitudeRangeDegree = function() 
{
	return this.maxGeographicCoord.longitude - this.minGeographicCoord.longitude;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param geoLocData 변수
 */
SmartTile.prototype.getLatitudeRangeDegree = function() 
{
	return this.maxGeographicCoord.latitude - this.minGeographicCoord.latitude;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param geoLocData 변수
 */
SmartTile.prototype.calculateTileRange = function() 
{
	// No used function.
	if (this.buildingSeedsArray == undefined)
	{ return; }
	
	if (this.minGeographicCoord == undefined)
	{ this.minGeographicCoord = new GeographicCoord(); }
	if (this.maxGeographicCoord == undefined)	
	{ this.maxGeographicCoord = new GeographicCoord(); }
	
	var buildingSeed;
	var longitude, latitude, altitude;
	var buildingSeedsCount = this.buildingSeedsArray.length;
	for (var i=0; i<buildingSeedsCount; i++)
	{
		buildingSeed = this.buildingSeedsArray[i];
		longitude = buildingSeed.geographicCoord.longitude;
		latitude = buildingSeed.geographicCoord.latitude;
		altitude = buildingSeed.geographicCoord.altitude;
		
		if (i == 0)
		{
			this.minGeographicCoord.setLonLatAlt(longitude, latitude, altitude);
			this.maxGeographicCoord.setLonLatAlt(longitude, latitude, altitude);
		}
		else 
		{
			if (longitude < this.minGeographicCoord.longitude)
			{ this.minGeographicCoord.longitude = longitude; }
			
			if (latitude < this.minGeographicCoord.latitude)
			{ this.minGeographicCoord.latitude = latitude; }
			
			if (altitude < this.minGeographicCoord.altitude)
			{ this.minGeographicCoord.altitude = altitude; }
			
			if (longitude > this.maxGeographicCoord.longitude)
			{ this.maxGeographicCoord.longitude = longitude; }
			
			if (latitude > this.maxGeographicCoord.latitude)
			{ this.maxGeographicCoord.latitude = latitude; }
			
			if (altitude > this.maxGeographicCoord.altitude)
			{ this.maxGeographicCoord.altitude = altitude; }
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param geoLocData 변수
 */
SmartTile.prototype.deleteBuildings = function(gl, vboMemManager) 
{
	
};

/**
 * Quadtree based tile with thickness.
 * @class SmartTileManager
 */
var SmartTileManager = function() 
{
	if (!(this instanceof SmartTileManager)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.tilesArray = []; // has 2 tiles.

	// tile 1 : longitude {-180, 0}, latitude {-90, 90}
	// tile 2 : longitude {0, 180},  latitude {-90, 90}
	
	var tile1 = this.newSmartTile("AmericaSide");
	if (tile1.minGeographicCoord == undefined)
	{ tile1.minGeographicCoord = new GeographicCoord(); }
	if (tile1.maxGeographicCoord == undefined)
	{ tile1.maxGeographicCoord = new GeographicCoord(); }
	
	tile1.depth = 0; // mother tile.
	tile1.minGeographicCoord.setLonLatAlt(-180, -90, 0);
	tile1.maxGeographicCoord.setLonLatAlt(0, 90, 0);
	
	var tile2 = this.newSmartTile("AsiaSide");
	if (tile2.minGeographicCoord == undefined)
	{ tile2.minGeographicCoord = new GeographicCoord(); }
	if (tile2.maxGeographicCoord == undefined)
	{ tile2.maxGeographicCoord = new GeographicCoord(); }
	
	tile2.depth = 0; // mother tile.
	tile2.minGeographicCoord.setLonLatAlt(0, -90, 0);
	tile2.maxGeographicCoord.setLonLatAlt(180, 90, 0);
};

/**
 * 어떤 일을 하고 있습니까?
 * @class GeoLocationData
 * @param geoLocData 변수
 */
SmartTileManager.prototype.newSmartTile = function(smartTileName) 
{
	var smartTile = new SmartTile(smartTileName);
	this.tilesArray.push(smartTile);
	return smartTile;
};

/**
 * 어떤 일을 하고 있습니까?
 */
SmartTileManager.prototype.getNeoBuildingById = function(buildingType, buildingId) 
{
	var resultNeoBuilding;
	var i = 0;
	var smartTilesCount = this.tilesArray.length;
	while (resultNeoBuilding == undefined && i<smartTilesCount)
	{
		resultNeoBuilding = this.tilesArray[i].getNeoBuildingById(buildingType, buildingId);
		i++;
	}
	
	return resultNeoBuilding;
};













'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class Sphere
 */
var Sphere = function() 
{
	if (!(this instanceof Sphere)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.r = 0.0;
	this.centerPoint = new Point3D();
};

/**
 * 포인트값 삭제
 * 어떤 일을 하고 있습니까?
 */
Sphere.prototype.setCenterPoint = function(x, y, z) 
{
	this.centerPoint.set(x, y, z);
};

/**
 * 포인트값 삭제
 * 어떤 일을 하고 있습니까?
 */
Sphere.prototype.setRadius = function(radius) 
{
	this.r = radius;
};
'use strict';

/**
 * ??
 * @class SceneState
 */

var SplitValue = function()
{
	this.high = undefined;
	this.low = undefined;
};

'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class TerranTile
 */
var TerranTile = function() 
{
	if (!(this instanceof TerranTile)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	//           +-----+-----+
	//           |  3  |  2  |
	//           +-----+-----+
	//           |  0  |  1  |
	//           +-----+-----+

	this._depth = 0; // qudtree depth. 0 => mother_quadtree.***
	this._numberName = 1; // mother quadtree.***
	this._terranTile_owner;
	//------------------------------------------------------------
	this.projectsArray = [];
	
	this._BR_buildingsArray = []; // Old.***
	this._boundingBox; // dont use this.***
	this._pCloudMesh_array = []; // 1rst aproximation to the pointCloud data. Test.***

	this.position; // absolute position, for do frustum culling.***
	this.radius; // aprox radius for this tile.***

	this.leftDown_position;
	this.rightDown_position;
	this.rightUp_position;
	this.leftUp_position;
	this.visibilityType;

	this.subTiles_array = [];
	this.terranIndexFile_readed = false;
	this.empty_tile = false;

	// File.***************************************************
	this.fileReading_started = false;
	this.fileReading_finished = false;
	this.fileArrayBuffer;
	this.fileBytesReaded = 0;
	this.fileParsingFinished = false;
	this.projectsParsed_count = 0;

	this.current_BRProject_parsing;
	this.current_BRProject_parsing_state = 0;

	this.readWriter;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns br_buildingProject
 */
TerranTile.prototype.newBRProject = function() 
{
	// Old.*** Old.*** Old.*** Old.*** Old.*** Old.*** Old.*** Old.***
	// dont use this. delete this.***
	var br_buildingProject = new BRBuildingProject();
	this._BR_buildingsArray.push(br_buildingProject);
	return br_buildingProject;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns subTile
 */
TerranTile.prototype.newSubTerranTile = function() 
{
	var subTiles_count = this.subTiles_array.length;
	var subTile = new TerranTile();
	subTile._depth = this._depth + 1;
	subTile._numberName = this._numberName*10 + subTiles_count + 1;
	this.subTiles_array.push(subTile);
	return subTile;
};

/**
 * 어떤 일을 하고 있습니까?
 */
TerranTile.prototype.make4subTiles = function() 
{
	for (var i = 0; i < 4; i++) 
	{
		var subTile = this.newSubTerranTile();
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param lonMin 변수
 * @param lonMax 변수
 * @param latMin 변수
 * @param latMax 변수
 */
TerranTile.prototype.setDimensions = function(lonMin, lonMax, latMin, latMax) 
{
	this.longitudeMin = lonMin;
	this.longitudeMax = lonMax;
	this.latitudeMin = latMin;
	this.latitudeMax = latMax;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param maxDepth 변수
 */
TerranTile.prototype.makeTree = function(maxDepth) 
{
	if (this._depth < maxDepth)
	{
		var subTileAux;
		for (var i = 0; i < 4; i++)
		{
			subTileAux = this.newSubTerranTile();
			subTileAux.makeTree(maxDepth);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 */
TerranTile.prototype.calculatePositionByLonLat = function() 
{
	var lon_mid = (this.longitudeMax + this.longitudeMin)/2.0;
	var lat_mid = (this.latitudeMax + this.latitudeMin)/2.0;

	this.position = Cesium.Cartesian3.fromDegrees(lon_mid, lat_mid, 0.0);

	this.leftDown_position = Cesium.Cartesian3.fromDegrees(this.longitudeMin, this.latitudeMin, 0.0);
	this.rightDown_position = Cesium.Cartesian3.fromDegrees(this.longitudeMax, this.latitudeMin, 0.0);
	this.rightUp_position = Cesium.Cartesian3.fromDegrees(this.longitudeMax, this.latitudeMax, 0.0);
	this.leftUp_position = Cesium.Cartesian3.fromDegrees(this.longitudeMin, this.latitudeMax, 0.0);

	this.radius = Cesium.Cartesian3.distance(this.leftDown_position, this.rightUp_position)/2.0 * 0.9;
};

/**
 * 어떤 일을 하고 있습니까?
 */
TerranTile.prototype.calculatePositionByLonLatSubTiles = function() 
{
	this.calculatePositionByLonLat();

	var subTile;
	var subTiles_count = this.subTiles_array.length; // subTiles_count must be 4.***

	for (var i=0; i<subTiles_count; i++)
	{
		this.subTiles_array[i].calculatePositionByLonLatSubTiles();
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param BR_Project 변수
 */
TerranTile.prototype.parseFileHeader = function(BR_Project) 
{
	var fileLegth = this.fileArrayBuffer.byteLength;
	if (this.fileBytesReaded >= fileLegth)
	{ return; }

	var version_string_length = 5;
	var intAux_scratch = 0;
	var auxScratch;
	var header = BR_Project._header;
	var arrayBuffer = this.fileArrayBuffer;
	var bytes_readed = this.fileBytesReaded;

	if (this.readWriter === undefined)
	{ this.readWriter = new ReaderWriter(); }

	// 1) Version(5 chars).***********
	for (var j=0; j<version_string_length; j++)
	{
		header._version += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
	}

	header._f4d_version = 2;

	// 3) Global unique ID.*********************
	intAux_scratch = this.readWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
	for (var j=0; j<intAux_scratch; j++)
	{
		header._global_unique_id += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
	}

	// 4) Location.*************************
	header._longitude = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
	header._latitude = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
	header._elevation = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;

	//header._elevation += 70.0; // delete this. TEST.!!!

	// 6) BoundingBox.************************
	header._boundingBox.minX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	header._boundingBox.minY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	header._boundingBox.minZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	header._boundingBox.maxX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	header._boundingBox.maxY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	header._boundingBox.maxZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;

	var semiHeight = (header._boundingBox.maxZ - header._boundingBox.minZ )/2.0;
	header._elevation = 45.0 + semiHeight-0.5;

	var isLarge = false;
	if (header._boundingBox.maxX - header._boundingBox.minX > 40.0 || header._boundingBox.maxY - header._boundingBox.minY > 40.0)
	{
		isLarge = true;
	}

	if (!isLarge && header._boundingBox.maxZ - header._boundingBox.minZ < 30.0)
	{
		header.isSmall = true;
	}

	var imageLODs_count = this.readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed += 1;

	// Now, must calculate some params of the project.**********************************************
	// 0) PositionMatrix.************************************************************************
	// Determine the elevation of the position.***********************************************************
	var position = Cesium.Cartesian3.fromDegrees(header._longitude, header._latitude, header._elevation);
	var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
	var height = cartographic.height;
	// End Determine the elevation of the position.-------------------------------------------------------

	//var position = Cesium.Cartesian3.fromDegrees(header._longitude, header._latitude, header._elevation);  // Original.***
	position = Cesium.Cartesian3.fromDegrees(header._longitude, header._latitude, height);

	BR_Project.buildingPosition = position;

	// High and Low values of the position.****************************************************
	var splitValue = Cesium.EncodedCartesian3.encode(position);
	var splitVelue_X  = Cesium.EncodedCartesian3.encode(position.x);
	var splitVelue_Y  = Cesium.EncodedCartesian3.encode(position.y);
	var splitVelue_Z  = Cesium.EncodedCartesian3.encode(position.z);

	BR_Project.buildingPositionHIGH = new Float32Array(3);
	BR_Project.buildingPositionHIGH[0] = splitVelue_X.high;
	BR_Project.buildingPositionHIGH[1] = splitVelue_Y.high;
	BR_Project.buildingPositionHIGH[2] = splitVelue_Z.high;

	BR_Project.buildingPositionLOW = new Float32Array(3);
	BR_Project.buildingPositionLOW[0] = splitVelue_X.low;
	BR_Project.buildingPositionLOW[1] = splitVelue_Y.low;
	BR_Project.buildingPositionLOW[2] = splitVelue_Z.low;

	this.fileBytesReaded = bytes_readed;
};


/**
 * 어떤 일을 하고 있습니까?
 * @param BR_Project 변수
 */
TerranTile.prototype.parseFileSimpleBuilding = function(BR_Project) 
{
	var fileLegth = this.fileArrayBuffer.byteLength;
	if (this.fileBytesReaded >= fileLegth)
	{ return; }

	if (this.readWriter === undefined)
	{ this.readWriter = new ReaderWriter(); }

	var bytes_readed = this.fileBytesReaded;
	var startBuff;
	var endBuff;
	var arrayBuffer = this.fileArrayBuffer;

	if (BR_Project._simpleBuilding_v1 === undefined)
	{ BR_Project._simpleBuilding_v1 = new SimpleBuildingV1(); }

	var simpBuildingV1 = BR_Project._simpleBuilding_v1;
	var vbo_objects_count = this.readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4; // Almost allways is 1.***

	// single interleaved buffer mode.*********************************************************************************
	for (var i=0; i<vbo_objects_count; i++) // Almost allways is 1.***
	{
		var simpObj = simpBuildingV1.newSimpleObject();
		var vt_cacheKey = simpObj._vtCacheKeys_container.newVertexTexcoordsArraysCacheKey();

		var iDatas_count = this.readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
		startBuff = bytes_readed;
		endBuff = bytes_readed + (4*3+2*2+1*4)*iDatas_count; // fPos_usTex_bNor.****
		vt_cacheKey.verticesArrayBuffer = arrayBuffer.slice(startBuff, endBuff);

		bytes_readed = bytes_readed + (4*3+2*2+1*4)*iDatas_count; // updating data.***

		vt_cacheKey._vertices_count = iDatas_count;

	}

	// Finally read the 4byte color.***
	var color_4byte_temp = this.readWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;

	//var b = color_4byte_temp & 0xFF;
	//var g = (color_4byte_temp & 0xFF00) >>> 8;
	//var r = (color_4byte_temp & 0xFF0000) >>> 16;
	//var a = ( (color_4byte_temp & 0xFF000000) >>> 24 ) / 255 ;

	this.fileBytesReaded = bytes_readed;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param BR_Project 변수
 * @param magoManager 변수
 */
TerranTile.prototype.parseFileNailImage = function(BR_Project, magoManager) 
{
	//BR_Project._f4d_nailImage_readed = true;

	if (BR_Project._simpleBuilding_v1 === undefined)
	{ BR_Project._simpleBuilding_v1 = new SimpleBuildingV1(); }

	if (this.readWriter === undefined)
	{ this.readWriter = new ReaderWriter(); }

	var simpBuildingV1 = BR_Project._simpleBuilding_v1;

	// Read the image.**********************************************************************************
	var bytes_readed = this.fileBytesReaded;
	var arrayBuffer = this.fileArrayBuffer;

	var nailImageSize = this.readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
	var startBuff = bytes_readed;
	var endBuff = bytes_readed + nailImageSize;
	simpBuildingV1.textureArrayBuffer = new Uint8Array(arrayBuffer.slice(startBuff, endBuff));

	bytes_readed += nailImageSize;

	this.fileBytesReaded = bytes_readed;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param magoManager 변수
 */
TerranTile.prototype.parseFileAllBuildings = function(magoManager) 
{
	var fileLegth = this.fileArrayBuffer.byteLength;
	if (this.fileBytesReaded >= fileLegth)
	{
		this.fileParsingFinished = true;
		return;
	}

	if (this.readWriter === undefined)
	{ this.readWriter = new ReaderWriter(); }

	var arrayBuffer = this.fileArrayBuffer;
	var projects_count = this.readWriter.readInt32(arrayBuffer, 0, 4); this.fileBytesReaded += 4;

	if (projects_count === 0)
	{ this.empty_tile = true; }

	for (var i=0; i<projects_count; i++)
	{
		/*
		// 1rst, read the relative rawFile_path.***
		var rawFileNamePath_length = this.readWriter.readInt16(arrayBuffer, bytes_readed, bytes_readed+2); bytes_readed += 2;// only debug test.***
		var rawFileNamePath = "";

		for(var j=0; j<rawFileNamePath_length; j++){
			rawFileNamePath += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
		}
		*/
		var bytes_readed = this.fileBytesReaded;
		this.fileBytesReaded = bytes_readed;

		this.current_BRProject_parsing = this.newBRProject();
		//this.current_BRProject_parsing._f4d_rawPathName = rawFileNamePath;

		this.parseFileHeader(this.current_BRProject_parsing);
		this.parseFileSimpleBuilding(this.current_BRProject_parsing);
		this.parseFileNailImage(this.current_BRProject_parsing, magoManager);
	}
	this.fileParsingFinished = true;
	this.fileArrayBuffer = null;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param magoManager 변수
 */
TerranTile.prototype.parseFileOneBuilding = function(gl, magoManager) 
{
	var fileLegth = this.fileArrayBuffer.byteLength;
	if (this.fileBytesReaded >= fileLegth)
	{
		this.fileParsingFinished = true;
		return;
	}

	if (this.readWriter === undefined)
	{ this.readWriter = new ReaderWriter(); }

	var projects_count = this.readWriter.readInt32(this.fileArrayBuffer, 0, 4); // only debug test.***

	if (this.projectsParsed_count >= projects_count)
	{
		this.fileParsingFinished = true;
		this.fileBytesReaded = null;
		return;
	}

	if (this.current_BRProject_parsing_state === 0)
	{
		if (this.projectsParsed_count === 0)
		{ this.fileBytesReaded = 4; }

		this.current_BRProject_parsing = this.newBRProject();
	}

	var BR_Project = this.current_BRProject_parsing;

	// Read header, simpleBuilding, and the nailImage.***
	if (this.current_BRProject_parsing_state === 0) 
	{
		this.parseFileHeader(BR_Project);
		this.current_BRProject_parsing_state=1;
	}
	else if (this.current_BRProject_parsing_state === 1) 
	{
		if (magoManager.backGround_imageReadings_count < 1) 
		{
			this.parseFile_simpleBuilding_old(gl, BR_Project);
			this.current_BRProject_parsing_state=2;
		}
	}
	else if (this.current_BRProject_parsing_state === 2) 
	{
		if (magoManager.backGround_imageReadings_count < 1) 
		{
			this.parseFile_nailImage_old(gl, BR_Project, magoManager);
			this.current_BRProject_parsing_state=0;
			this.projectsParsed_count++;
			magoManager.backGround_imageReadings_count ++;
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 */
TerranTile.prototype.setDimensionsSubTiles = function() 
{
	var subTile;
	var subTiles_count = this.subTiles_array.length; // subTiles_count must be 4.***
	if (subTiles_count === 4) 
	{
		var lon_mid = (this.longitudeMax + this.longitudeMin)/2.0;
		var lat_mid = (this.latitudeMax + this.latitudeMin)/2.0;

		subTile = this.subTiles_array[0];
		subTile.setDimensions(this.longitudeMin, lon_mid, this.latitudeMin, lat_mid);

		subTile = this.subTiles_array[1];
		subTile.setDimensions(lon_mid, this.longitudeMax, this.latitudeMin, lat_mid);

		subTile = this.subTiles_array[2];
		subTile.setDimensions(lon_mid, this.longitudeMax, lat_mid, this.latitudeMax);

		subTile = this.subTiles_array[3];
		subTile.setDimensions(this.longitudeMin, lon_mid, lat_mid, this.latitudeMax);

		for (var i=0; i<subTiles_count; i++) 
		{
			this.subTiles_array[i].setDimensionsSubTiles();
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param smallefstTiles_array 변수
 */
TerranTile.prototype.getSmallestTiles = function(smallestTiles_array) 
{
	// this returns smallestTiles, if the smallestTile has buildingd inside.***
	if (this.subTiles_array.length > 0) 
	{
		for (var i=0; i<this.subTiles_array.length; i++) 
		{
			this.subTiles_array[i].visibilityType = this.visibilityType;
			this.subTiles_array[i].getSmallestTiles(smallestTiles_array);
		}
	}
	else 
	{
		if (!this.empty_tile.length) { smallestTiles_array.push(this); }
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param frustumVolume 변수
 * @param intersectedSmallestTiles_array 변수
 * @param boundingSphere_Aux 변수
 */
TerranTile.prototype.getIntersectedSmallestTiles = function(frustumVolume, intersectedSmallestTiles_array, boundingSphere_Aux) 
{
	var intersectedTiles_array = [];
	this.getIntersectedTiles(frustumVolume, intersectedTiles_array, boundingSphere_Aux);

	var intersectedTiles_count = intersectedTiles_array.length;
	for (var i=0; i<intersectedTiles_count; i++) 
	{
		intersectedTiles_array[i].getSmallestTiles(intersectedSmallestTiles_array);
	}
	intersectedTiles_array.length = 0;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param frustumVolume 변수
 * @param intersectedTiles_array 변수
 * @param boundingSphere_Aux 변수
 */
TerranTile.prototype.getIntersectedTiles = function(frustumVolume, intersectedTiles_array, boundingSphere_Aux) 
{
	// Cesium dependency.***
	if (this.position === undefined) { return; }

	if (boundingSphere_Aux === undefined) { boundingSphere_Aux = new Cesium.BoundingSphere(); }

	var intersectedPoints_count = 0;
	boundingSphere_Aux.radius = this.radius;
	boundingSphere_Aux.center.x = this.position.x;
	boundingSphere_Aux.center.y = this.position.y;
	boundingSphere_Aux.center.z = this.position.z;
	this.visibilityType = frustumVolume.computeVisibility(boundingSphere_Aux); // old. change for intersectionSphere.
	/*
	boundingSphere_Aux.center = this.leftDown_position;
	if(frustumVolume.computeVisibility(boundingSphere_Aux) !== Cesium.Intersect.OUTSIDE)
		intersectedPoints_count++;

	boundingSphere_Aux.center = this.rightDown_position;
	if(frustumVolume.computeVisibility(boundingSphere_Aux) !== Cesium.Intersect.OUTSIDE)
		intersectedPoints_count++;

	boundingSphere_Aux.center = this.rightUp_position;
	if(frustumVolume.computeVisibility(boundingSphere_Aux) !== Cesium.Intersect.OUTSIDE)
		intersectedPoints_count++;

	boundingSphere_Aux.center = this.leftUp_position;
	if(frustumVolume.computeVisibility(boundingSphere_Aux) !== Cesium.Intersect.OUTSIDE)
		intersectedPoints_count++;
	*/

	if (this.visibilityType === Cesium.Intersect.OUTSIDE) 
	{
		// OUTSIDE.***
		// do nothing.***
	}
	else if (this.visibilityType === Cesium.Intersect.INSIDE) 
	{
		// INSIDE.***
		intersectedTiles_array.push(this);
	}
	else 
	{
		// INTERSECTED.***
		if (this.subTiles_array.length > 0) 
		{
			for (var i=0; i<this.subTiles_array.length; i++) 
			{
				this.subTiles_array[i].getIntersectedTiles(frustumVolume, intersectedTiles_array);
			}
		}
		else 
		{
			intersectedTiles_array.push(this);
		}
	}
};

'use strict';


/**
 * 맵 이미지. 머티리얼에는 텍스처에 대한 참조가 포함될 수 있으므로 머티리얼의 셰이더는 객체의 표면색을 계산하는 동안 텍스처를 사용할 수 있습니다.
 * 오브제의 표면의 기본 색상 (알베도) 외에도 텍스쳐는 반사율이나 거칠기와 같은 재질 표면의 많은 다른면을 나타낼 수 있습니다.
 * @class Texture
 */
var Texture = function() 
{
	if (!(this instanceof Texture)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.textureTypeName = "";
	this.textureImageFileName = "";
	this.texId;
	this.fileLoadState = CODE.fileLoadState.READY;
};
'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class Triangle
 */
var Triangle= function() 
{
	if (!(this instanceof Triangle)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.vertex0;
	this.vertex1;
	this.vertex2;
	this.normal;
};

/**
 * 어떤 일을 하고 있습니까?
 */
Triangle.prototype.destroy = function() 
{
	this.vertex0 = undefined;
	this.vertex1 = undefined;
	this.vertex2 = undefined;
	this.normal = undefined;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param vertex0 변수
 * @param vertex1 변수
 * @param vertex2 변수
 */
Triangle.prototype.setVertices = function(vertex0, vertex1, vertex2) 
{
	this.vertex0 = vertex0;
	this.vertex1 = vertex1;
	this.vertex2 = vertex2;
};

/**
 * 어떤 일을 하고 있습니까?
 */
Triangle.prototype.calculatePlaneNormal = function() 
{
	if (this.normal === undefined)
	{ this.normal = new Point3D(); }

	this.getCrossProduct(0, this.normal);
	this.normal.unitary();
};

/**
 * 어떤 일을 하고 있습니까?
 * @param idxVertex 변수
 * @param resultCrossProduct 변수
 * @returns resultCrossProduct
 */
Triangle.prototype.getCrossProduct = function(idxVertex, resultCrossProduct) 
{
	if (resultCrossProduct === undefined)
	{ resultCrossProduct = new Point3D(); }

	var currentPoint, prevPoint, nextPoint;

	if (idxVertex === 0)
	{
		currentPoint = this.vertex0.point3d;
		prevPoint = this.vertex2.point3d;
		nextPoint = this.vertex1.point3d;
	}
	else if (idxVertex === 1)
	{
		currentPoint = this.vertex1.point3d;
		prevPoint = this.vertex0.point3d;
		nextPoint = this.vertex2.point3d;
	}
	else if (idxVertex === 2)
	{
		currentPoint = this.vertex2.point3d;
		prevPoint = this.vertex1.point3d;
		nextPoint = this.vertex0.point3d;
	}

	var v1 = new Point3D();
	var v2 = new Point3D();

	v1.set(currentPoint.x - prevPoint.x,     currentPoint.y - prevPoint.y,     currentPoint.z - prevPoint.z);
	v2.set(nextPoint.x - currentPoint.x,     nextPoint.y - currentPoint.y,     nextPoint.z - currentPoint.z);

	v1.unitary();
	v2.unitary();

	resultCrossProduct = v1.crossProduct(v2, resultCrossProduct);

	return resultCrossProduct;
};

'use strict';

/**
 * 영역 박스
 * @class TriPolyhedron
 */
var TriPolyhedron = function() 
{
	if (!(this instanceof TriPolyhedron)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.vertexMatrix = new VertexMatrix();
	this.vertexList = this.vertexMatrix.newVertexList();
	this.triSurfacesArray = [];
};

TriPolyhedron.prototype.newTriSurface = function() 
{
	var triSurface = new TriSurface();
	this.triSurfacesArray.push(triSurface);
	return triSurface;
};

TriPolyhedron.prototype.getVBOArrayModePosNorCol = function(resultVBOVertexIdxCacheKey) 
{
	// there are "arrayMode" and the "elementMode". "elementMode" uses indices.***
	if (resultVBOVertexIdxCacheKey === undefined)
	{ resultVBOVertexIdxCacheKey = new VBOVertexIdxCacheKey(); }

	if (resultVBOVertexIdxCacheKey.posVboDataArray === undefined)
	{ resultVBOVertexIdxCacheKey.posVboDataArray = []; }

	if (resultVBOVertexIdxCacheKey.norVboDataArray === undefined)
	{ resultVBOVertexIdxCacheKey.norVboDataArray = []; }

	if (resultVBOVertexIdxCacheKey.colVboDataArray === undefined)
	{ resultVBOVertexIdxCacheKey.colVboDataArray = []; }

	var positionArray = [];
	var normalsArray = [];
	var colorsArray = [];


	resultVBOVertexIdxCacheKey.vertexCount = 0;

	var vertex0, vertex1, vertex2;
	var triangle;
	var trianglesCount;
	var triSurface;
	var triSurfacesCount = this.triSurfacesArray.length;
	for (var i = 0; i < triSurfacesCount; i++) 
	{
		triSurface = this.triSurfacesArray[i];
		trianglesCount = triSurface.trianglesArray.length;
		for (var j = 0; j < trianglesCount; j++) 
		{
			triangle = triSurface.trianglesArray[j];
			if (triangle.normal === undefined)
			{ triangle.calculatePlaneNormal(); }

			// position.***
			vertex0 = triangle.vertex0;
			vertex1 = triangle.vertex1;
			vertex2 = triangle.vertex2;

			positionArray.push(vertex0.point3d.x);
			positionArray.push(vertex0.point3d.y);
			positionArray.push(vertex0.point3d.z);

			positionArray.push(vertex1.point3d.x);
			positionArray.push(vertex1.point3d.y);
			positionArray.push(vertex1.point3d.z);

			positionArray.push(vertex2.point3d.x);
			positionArray.push(vertex2.point3d.y);
			positionArray.push(vertex2.point3d.z);

			// normal (use planeNormal).***
			normalsArray.push(triangle.normal.x);
			normalsArray.push(triangle.normal.y);
			normalsArray.push(triangle.normal.z);

			normalsArray.push(triangle.normal.x);
			normalsArray.push(triangle.normal.y);
			normalsArray.push(triangle.normal.z);

			normalsArray.push(triangle.normal.x);
			normalsArray.push(triangle.normal.y);
			normalsArray.push(triangle.normal.z);

			// colors.***
			if (vertex0.color4 === undefined) 
			{
				colorsArray.push(255);
				colorsArray.push(255);
				colorsArray.push(255);
				colorsArray.push(255);

				colorsArray.push(255);
				colorsArray.push(255);
				colorsArray.push(255);
				colorsArray.push(255);

				colorsArray.push(255);
				colorsArray.push(255);
				colorsArray.push(255);
				colorsArray.push(255);
			}
			else 
			{
				colorsArray.push(vertex0.color4.r);
				colorsArray.push(vertex0.color4.g);
				colorsArray.push(vertex0.color4.b);
				colorsArray.push(vertex0.color4.a);

				colorsArray.push(vertex1.color4.r);
				colorsArray.push(vertex1.color4.g);
				colorsArray.push(vertex1.color4.b);
				colorsArray.push(vertex1.color4.a);

				colorsArray.push(vertex2.color4.r);
				colorsArray.push(vertex2.color4.g);
				colorsArray.push(vertex2.color4.b);
				colorsArray.push(vertex2.color4.a);
			}

			resultVBOVertexIdxCacheKey.vertexCount += 3;
		}
	}

	var vertexCount = resultVBOVertexIdxCacheKey.vertexCount;
	resultVBOVertexIdxCacheKey.norVboDataArray = new Int8Array(vertexCount*3);
	resultVBOVertexIdxCacheKey.colVboDataArray = new Uint8Array(vertexCount*4);
	resultVBOVertexIdxCacheKey.posVboDataArray = new Float32Array(vertexCount*3);
	
	for (var i = 0; i < vertexCount * 3; i++) 
	{
		resultVBOVertexIdxCacheKey.posVboDataArray[i] = positionArray[i];
		resultVBOVertexIdxCacheKey.norVboDataArray[i] = normalsArray[i];
	}
	
	for (var i = 0; i < vertexCount * 4; i++) 
	{
		resultVBOVertexIdxCacheKey.colVboDataArray[i] = colorsArray[i];
	}

	//resultVBOVertexIdxCacheKey.norVboDataArray = Int8Array.from(normalsArray);
	//resultVBOVertexIdxCacheKey.colVboDataArray = Uint8Array.from(colorsArray);
	positionArray = undefined;
	normalsArray = undefined;
	colorsArray = undefined;

	return resultVBOVertexIdxCacheKey;
};

'use strict';

/**
 * 영역 박스
 * @class TriSurface
 */
var TriSurface = function() 
{
	if (!(this instanceof TriSurface)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.trianglesArray = [];
};

TriSurface.prototype.newTriangle = function() 
{
	var triangle = new Triangle();
	this.trianglesArray.push(triangle);
	return triangle;
};

'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class VBOManager
 */
var VBOManager = function() 
{
	if (!(this instanceof VBOManager)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @class Buffer
 */
var Buffer = function() 
{
	if (!(this instanceof Buffer)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.dataArray;
	this.dataArrayByteLength = 0;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class VBOVertexIdxCacheKey
 */
var VBOVertexIdxCacheKey = function() 
{
	if (!(this instanceof VBOVertexIdxCacheKey)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.indicesCount = -1;
	this.vertexCount = -1;
	this.bigTrianglesIndicesCount = -1;

	this.meshVertexCacheKey;
	this.meshFacesCacheKey;
	this.meshNormalCacheKey;
	this.meshColorCacheKey;
	this.meshTexcoordsCacheKey;

	this.posVboDataArray; // to store data here, and when necessary bind to gl and delete it.***
	this.norVboDataArray; // to store data here, and when necessary bind to gl and delete it.***
	this.idxVboDataArray; // to store data here, and when necessary bind to gl and delete it.***
	this.colVboDataArray; // to store data here, and when necessary bind to gl and delete it.***
	this.tcoordVboDataArray; // to store data here, and when necessary bind to gl and delete it.***
	
	this.posArrayByteSize;
	this.norArrayByteSize;
	this.idxArrayByteSize;
	this.colArrayByteSize;
	this.tcoordArrayByteSize;

	this.buffer;// delete this. provisionally put this here.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboViCacheKey
 */
VBOVertexIdxCacheKey.prototype.deleteGlObjects = function(gl, vboMemManager) 
{
	if (this.meshVertexCacheKey) 
	{
		vboMemManager.storeClassifiedBufferKey(gl, this.meshVertexCacheKey, this.posArrayByteSize);
		this.meshVertexCacheKey = undefined;
	}
	this.posVboDataArray = undefined;

	if (this.meshNormalCacheKey) 
	{
		vboMemManager.storeClassifiedBufferKey(gl, this.meshNormalCacheKey, this.norArrayByteSize);
		this.meshNormalCacheKey = undefined;
	}
	this.norVboDataArray = undefined;

	if (this.meshColorCacheKey) 
	{
		vboMemManager.storeClassifiedBufferKey(gl, this.meshColorCacheKey, this.colArrayByteSize);
		this.meshColorCacheKey = undefined;
	}
	this.colVboDataArray = undefined;

	if (this.meshTexcoordsCacheKey) 
	{
		vboMemManager.storeClassifiedBufferKey(gl, this.meshTexcoordsCacheKey, this.tcoordArrayByteSize);
		this.meshTexcoordsCacheKey = undefined;
	}
	this.tcoordVboDataArray = undefined;

	if (this.meshFacesCacheKey) 
	{
		vboMemManager.storeClassifiedElementKey(gl, this.meshFacesCacheKey, this.idxArrayByteSize);
		this.meshFacesCacheKey = undefined;
	}
	this.idxVboDataArray = undefined;
	
	this.posArrayByteSize = undefined;
	this.norArrayByteSize = undefined;
	this.idxArrayByteSize = undefined;
	this.colArrayByteSize = undefined;
	this.tcoordArrayByteSize = undefined;

	this.buffer = undefined;
};

/**
 * 어떤 일을 하고 있습니까?
 * @return boolean
 */
VBOVertexIdxCacheKey.prototype.isReadyPositions = function(gl, vboMemManager) 
{
	if (this.meshVertexCacheKey === undefined) 
	{
		if (this.posVboDataArray === undefined) { return false; }
		
		this.meshVertexCacheKey = vboMemManager.getClassifiedBufferKey(gl, this.posArrayByteSize);
		if (this.meshVertexCacheKey == undefined)
		{ return false; }
		gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVertexCacheKey);
		gl.bufferData(gl.ARRAY_BUFFER, this.posVboDataArray, gl.STATIC_DRAW);
		this.posVboDataArray = undefined;
		return false;
	}
	return true;
};

/**
 * 어떤 일을 하고 있습니까?
 * @return boolean
 */
VBOVertexIdxCacheKey.prototype.isReadyNormals = function(gl, vboMemManager) 
{
	if (this.meshNormalCacheKey === undefined) 
	{
		if (this.norVboDataArray === undefined) { return false; }

		this.meshNormalCacheKey = vboMemManager.getClassifiedBufferKey(gl, this.norArrayByteSize);
		if (this.meshNormalCacheKey == undefined)
		{ return false; }
		gl.bindBuffer(gl.ARRAY_BUFFER, this.meshNormalCacheKey);
		gl.bufferData(gl.ARRAY_BUFFER, this.norVboDataArray, gl.STATIC_DRAW);
		this.norVboDataArray = undefined;
		return false;
	}
	return true;
};

/**
 * 어떤 일을 하고 있습니까?
 * @return boolean
 */
VBOVertexIdxCacheKey.prototype.isReadyFaces = function(gl, vboMemManager) 
{
	if (this.meshFacesCacheKey === undefined) 
	{
		if (this.idxVboDataArray === undefined) { return false; }

		this.meshFacesCacheKey = vboMemManager.getClassifiedElementKey(gl, this.idxArrayByteSize);
		if (this.meshFacesCacheKey == undefined)
		{ return false; }
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshFacesCacheKey);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.idxVboDataArray, gl.STATIC_DRAW);
		this.idxVboDataArray = undefined;
		return false;
	}
	return true;
};

/**
 * 어떤 일을 하고 있습니까?
 * @return boolean
 */
VBOVertexIdxCacheKey.prototype.isReadyTexCoords = function(gl, vboMemManager) 
{
	if (this.meshTexcoordsCacheKey === undefined) 
	{
		if (this.tcoordVboDataArray === undefined) { return false; }

		this.meshTexcoordsCacheKey = vboMemManager.getClassifiedBufferKey(gl, this.tcoordArrayByteSize);
		if (this.meshTexcoordsCacheKey == undefined)
		{ return false; }
		gl.bindBuffer(gl.ARRAY_BUFFER, this.meshTexcoordsCacheKey);
		gl.bufferData(gl.ARRAY_BUFFER, this.tcoordVboDataArray, gl.STATIC_DRAW);
		this.tcoordVboDataArray = undefined;

		return false;
	}
	return true;
};

/**
 * 어떤 일을 하고 있습니까?
 * @return boolean
 */
VBOVertexIdxCacheKey.prototype.isReadyColors = function(gl, vboMemManager) 
{
	if (this.meshColorCacheKey === undefined) 
	{
		if (this.colVboDataArray === undefined) { return false; }
		
		this.meshColorCacheKey = vboMemManager.getClassifiedBufferKey(gl, this.colArrayByteSize);
		if (this.meshColorCacheKey == undefined)
		{ return false; }
		gl.bindBuffer(gl.ARRAY_BUFFER, this.meshColorCacheKey);
		gl.bufferData(gl.ARRAY_BUFFER, this.colVboDataArray, gl.STATIC_DRAW);
		this.colVboDataArray = undefined;
		
		return false;
	}
	return true;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class VBOVertexIdxCacheKeysContainer
 */
var VBOVertexIdxCacheKeysContainer = function() 
{
	if (!(this instanceof VBOVertexIdxCacheKeysContainer)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.vboCacheKeysArray = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboViCacheKey
 */
VBOVertexIdxCacheKeysContainer.prototype.newVBOVertexIdxCacheKey = function() 
{
	var vboViCacheKey = new VBOVertexIdxCacheKey();
	this.vboCacheKeysArray.push(vboViCacheKey);
	return vboViCacheKey;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboViCacheKey
 */
VBOVertexIdxCacheKeysContainer.prototype.deleteGlObjects = function(gl, vboMemManager) 
{
	var vboDatasCount = this.vboCacheKeysArray.length;
	for (var j = 0; j < vboDatasCount; j++) 
	{
		this.vboCacheKeysArray[j].deleteGlObjects(gl, vboMemManager);
		this.vboCacheKeysArray[j] = undefined;
	}
	this.vboCacheKeysArray.length = 0;
	this.vboCacheKeysArray = undefined;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class VBOByteColorCacheKey
 */
var VBOByteColorCacheKey = function() 
{
	if (!(this instanceof VBOByteColorCacheKey)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.meshColorsCacheKey = null;
	this.meshTexcoordsCacheKey = null;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class VBOByteColorCacheKeysContainer
 */
var VBOByteColorCacheKeysContainer = function() 
{
	if (!(this instanceof VBOByteColorCacheKeysContainer)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.vboByteColorsCacheKeysArray = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @return vboByteColCacheKey
 */
VBOByteColorCacheKeysContainer.prototype.newVBOByteColorsCacheKey = function() 
{
	var vboByteColCacheKey = new VBOByteColorCacheKey();
	this.vboByteColorsCacheKeysArray.push(vboByteColCacheKey);
	return vboByteColCacheKey;
};











'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class VBOKeysStore
 */
var VBOKeysStore = function(bufferSize) 
{
	if (!(this instanceof VBOKeysStore)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.classifiedSize = bufferSize;
	this.vboKeysArray = [];
	this.keysCreated = 0; // total keys created for this size.
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns boolean. 
 */
VBOKeysStore.prototype.getBufferKey = function(gl, keyNation, keyWorld, onlyReuse) 
{
	if (this.vboKeysArray.length > 0)
	{
		var vboKey = this.vboKeysArray.pop();
		return vboKey;
	}
	else 
	{
		if (!onlyReuse)
		{
			// there are no free key, so create one.
			var vboKey = gl.createBuffer();
			this.keysCreated += 1; // increment key created counter.
			keyNation.totalBytesUsed += this.classifiedSize;
			keyWorld.totalBytesUsed += this.classifiedSize;
			return vboKey;
		}
		return undefined;
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns boolean. 
 */
VBOKeysStore.prototype.storeBufferKey = function(bufferKey) 
{
	this.vboKeysArray.push(bufferKey);
};

/**
 * 어떤 일을 하고 있습니까?
 * @class VBOKeysNation
 */
var VBOKeysNation = function(bufferSizes, minSize) 
{
	if (!(this instanceof VBOKeysNation)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	// buffer sizes are in bytes.
	this.vboKeysStoreMap = new Map();
	this.bufferSizes = bufferSizes;
	this.minSize = minSize;
	this.maxSize = bufferSizes[bufferSizes.length-1];
	this.totalBytesUsed = 0;
	
	var vboKeysStore;
	var sizesCount = bufferSizes.length;
	for (var i=0; i<sizesCount; i++)
	{
		vboKeysStore = new VBOKeysStore(bufferSizes[i]);
		this.vboKeysStoreMap.set(bufferSizes[i], vboKeysStore);

		if (bufferSizes[i] > this.maxSize) { this.maxSize = bufferSizes[i]; }
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboBufferKey. 
 */
VBOKeysNation.prototype.getClassifiedBufferKey = function(gl, bufferSize, keyWorld, onlyReuse) 
{
	// 1rst find the vboKeyStore for this bufferSize.
	var vboKeyStore = this.vboKeysStoreMap.get(bufferSize);
	
	if (vboKeyStore)
	{
		return vboKeyStore.getBufferKey(gl, this, keyWorld, onlyReuse);
	}
	else { return -1; }
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboBufferKey. 
 */
VBOKeysNation.prototype.storeClassifiedBufferKey = function(bufferKey, bufferSize) 
{
	// 1rst find the vboKeyStore for this bufferSize.
	var vboKeyStore = this.vboKeysStoreMap.get(bufferSize);
	if (vboKeyStore)
	{
		vboKeyStore.storeBufferKey(bufferKey);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns boolean. true if the currentBufferSize is in the range of this nation.
 */
VBOKeysNation.prototype.getClosestBufferSize = function(currentBufferSize) 
{
	if (!this.isInsideRange(currentBufferSize))
	{ return -1; }
	
	var sizesCount = this.bufferSizes.length;
	for (var i=0; i<sizesCount; i++)
	{
		if (currentBufferSize <= this.bufferSizes[i])
		{
			return this.bufferSizes[i];
		}
	}
	return -1;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns boolean. true if the currentBufferSize is in the range of this nation.
 */
VBOKeysNation.prototype.isInsideRange = function(bufferSize) 
{
	if (bufferSize > this.maxSize || bufferSize < this.minSize)
	{ return false; }

	return true;
};

/**
 * 어떤 일을 하고 있습니까?
 */
var VBOKeysWorld = function() 
{
	if (!(this instanceof VBOKeysWorld)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.totalBytesUsed = 0;
	this.bytesLimit = 1000;
	
	this.vboKeysNationsArray = [];
	this.vboKeyNation12to128 = new VBOKeysNation(new Uint32Array([12, 16, 32, 48, 64, 76, 92, 128]), 0);
	this.vboKeysNationsArray.push(this.vboKeyNation12to128);
	this.vboKeyNation200to1000 = new VBOKeysNation(new Uint32Array([200, 300, 400, 500, 600, 700, 800, 900, 1000]), 129);
	this.vboKeysNationsArray.push(this.vboKeyNation200to1000);
	this.vboKeyNation1500to6000 = new VBOKeysNation(new Uint32Array([1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000]), 1001);
	this.vboKeysNationsArray.push(this.vboKeyNation1500to6000);
	this.vboKeyNation7000to16000 = new VBOKeysNation(new Uint32Array([7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000]), 6001);
	this.vboKeysNationsArray.push(this.vboKeyNation7000to16000);
	this.vboKeyNation20000to56000 = new VBOKeysNation(new Uint32Array([20000, 24000, 28000, 32000, 36000, 40000, 44000, 48000, 52000, 56000]), 16001);
	this.vboKeysNationsArray.push(this.vboKeyNation20000to56000);
	this.vboKeyNation60000to150000 = new VBOKeysNation(new Uint32Array([60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000]), 56001);
	this.vboKeysNationsArray.push(this.vboKeyNation60000to150000);
	this.vboKeyNation200000to1100000 = new VBOKeysNation(new Uint32Array([200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1100000]), 150001);
	this.vboKeysNationsArray.push(this.vboKeyNation200000to1100000);
	this.vboKeyNation1500000to3000000 = new VBOKeysNation(new Uint32Array([1500000, 2000000, 2500000, 3000000]), 1100001);
	this.vboKeysNationsArray.push(this.vboKeyNation1500000to3000000);
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboBufferCacheKey
 */
VBOKeysWorld.prototype.getClassifiedBufferKey = function(gl, bufferSize) 
{
	// check gpuMemory limit.
	var onlyReuse = false;
	if (this.totalBytesUsed > this.bytesLimit)
	{
		onlyReuse = true;
	}
	
	// 1rst, find the Nation for this bufferSize.
	var keyNation = this.getKeyNationBySize(bufferSize);
	var vboBufferKey = undefined;
	if (keyNation)
	{
		vboBufferKey = keyNation.getClassifiedBufferKey(gl, bufferSize, this, onlyReuse);
	}
	return vboBufferKey;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboBufferCacheKey
 */
VBOKeysWorld.prototype.storeClassifiedBufferKey = function(bufferKey, bufferSize) 
{
	// 1rst, find the Nation for this bufferSize.
	var keyNation = this.getKeyNationBySize(bufferSize);
	if (keyNation)
	{ keyNation.storeClassifiedBufferKey(bufferKey, bufferSize); }
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboBufferCacheKey
 */
VBOKeysWorld.prototype.getKeyNationBySize = function(bufferSize) 
{
	// 1rst, find the Nation for this bufferSize.
	var nationsCount = this.vboKeysNationsArray.length;
	var i=0;
	var vboBufferKey = -1;
	while (i<nationsCount)
	{
		if (this.vboKeysNationsArray[i].isInsideRange(bufferSize))
		{
			return this.vboKeysNationsArray[i];
		}
		i++;
	}
	return vboBufferKey;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboBufferStandardSize
 */
VBOKeysWorld.prototype.getClassifiedBufferSize = function(currentBufferSize) 
{
	// 1rst, find the Nation for this bufferSize.
	var keyNation = this.getKeyNationBySize(currentBufferSize);
	var classifiedSize = -1;
	if (keyNation == -1)
	{ var hola =0; }
	
	if (keyNation != -1)
	{ classifiedSize = keyNation.getClosestBufferSize(currentBufferSize); }
	return classifiedSize;
};



/**
 * 어떤 일을 하고 있습니까?
 * @class VBOMemoryManager
 */
var VBOMemoryManager = function() 
{
	if (!(this instanceof VBOMemoryManager)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	// if "enableMemoryManagement" == false -> no management of the gpu memory.
	this.enableMemoryManagement = false;
	
	this.buffersKeyWorld = new VBOKeysWorld();
	this.elementKeyWorld = new VBOKeysWorld();
	
	this.buffersKeyWorld.bytesLimit = 800000000;
	this.elementKeyWorld.bytesLimit = 300000000;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboBufferCacheKey
 */
VBOMemoryManager.prototype.isGpuMemFull = function() 
{
	if (this.buffersKeyWorld.totalBytesUsed > this.buffersKeyWorld.bytesLimit || this.elementKeyWorld.totalBytesUsed > this.elementKeyWorld.bytesLimit)
	{ return true; }
	else { return false; }
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboBufferCacheKey
 */
VBOMemoryManager.prototype.getClassifiedBufferKey = function(gl, bufferSize) 
{
	if (this.enableMemoryManagement)
	{ return this.buffersKeyWorld.getClassifiedBufferKey(gl, bufferSize); }
	else
	{ return gl.createBuffer(); }
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboBufferCacheKey
 */
VBOMemoryManager.prototype.storeClassifiedBufferKey = function(gl, bufferKey, bufferSize) 
{
	if (this.enableMemoryManagement)
	{ this.buffersKeyWorld.storeClassifiedBufferKey(bufferKey, bufferSize); }
	else
	{ gl.deleteBuffer(bufferKey); }
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboBufferCacheKey
 */
VBOMemoryManager.prototype.getClassifiedElementKey = function(gl, bufferSize) 
{
	if (this.enableMemoryManagement)
	{ return this.elementKeyWorld.getClassifiedBufferKey(gl, bufferSize); }
	else
	{ return gl.createBuffer(); }
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboBufferCacheKey
 */
VBOMemoryManager.prototype.storeClassifiedElementKey = function(gl, bufferKey, bufferSize) 
{
	if (this.enableMemoryManagement)
	{ this.elementKeyWorld.storeClassifiedBufferKey(bufferKey, bufferSize); }
	else
	{ gl.deleteBuffer(bufferKey); }
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vboBufferStandardSize
 */
VBOMemoryManager.prototype.getClassifiedBufferSize = function(currentBufferSize) 
{
	if (this.enableMemoryManagement)
	{ return this.buffersKeyWorld.getClassifiedBufferSize(currentBufferSize); } 
	else
	{ return currentBufferSize; }
};














'use strict';

  
/**
 * 어떤 일을 하고 있습니까?
 * @class Vertex
 */
var Vertex = function() 
{
	if (!(this instanceof Vertex)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.point3d = new Point3D();
	this.normal;
	this.texCoord;
	this.color4;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param x 변수
 * @param y 변수
 * @param z 변수
 */
Vertex.prototype.setPosition = function(x, y, z) 
{
	this.point3d.set(x, y, z);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param r 변수
 * @param g 변수
 * @param b 변수
 */
Vertex.prototype.setColorRGB = function(r, g, b) 
{
	if (this.color4 === undefined) { this.color4 = new Color(); }
	
	this.color4.setRGB(r, g, b);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param r 변수
 * @param g 변수
 * @param b 변수
 * @param alpha 변수
 */
Vertex.prototype.setColorRGBA = function(r, g, b, alpha) 
{
	if (this.color4 === undefined) { this.color4 = new Color(); }
	
	this.color4.setRGBA(r, g, b, alpha);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param dirX 변수
 * @param dirY 변수
 * @param dirZ 변수
 * @param distance 변수
 */
Vertex.prototype.translate = function(dirX, dirY, dirZ, distance) 
{
	this.point3d.add(dirX * distance, dirY * distance, dirZ * distance);
};

'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class VertexList
 */
var VertexList = function() 
{
	if (!(this instanceof VertexList)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.vertexArray = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vertex
 */
VertexList.prototype.newVertex = function() 
{
	var vertex = new Vertex();
	this.vertexArray.push(vertex);
	return vertex;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param idx 변수
 * @returns vertexArray[idx]
 */
VertexList.prototype.getVertex = function(idx) 
{
	return this.vertexArray[idx];
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vertexArray.length
 */
VertexList.prototype.getVertexCount = function() 
{
	return this.vertexArray.length;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param dirX 변수
 * @param dirY 변수
 * @param dirZ 변수
 * @param distance 변수
 */
VertexList.prototype.translateVertices = function(dirX, dirY, dirZ, distance) 
{
	for (var i = 0, vertexCount = this.vertexArray.length; i < vertexCount; i++) 
	{
		this.vertexArray[i].translate(dirX, dirY, dirZ, distance);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param resultBox 변수
 * @returns resultBox
 */
VertexList.prototype.getBoundingBox = function(resultBox) 
{
	if (resultBox === undefined) { resultBox = new BoundingBox(); }

	for (var i = 0, vertexCount = this.vertexArray.length; i < vertexCount; i++) 
	{
		if (i === 0) { resultBox.init(this.vertexArray[i].point3d); }
		else { resultBox.addPoint(this.vertexArray[i].point3d); }
	}
	return resultBox;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param transformMatrix 변수
 */
VertexList.prototype.transformPointsByMatrix4 = function(transformMatrix) 
{
	for (var i = 0, vertexCount = this.vertexArray.length; i < vertexCount; i++) 
	{
		var vertex = this.vertexArray[i];
		transformMatrix.transformPoint3D(vertex.point3d, vertex.point3d);
	}
};


'use strict';


/**
 * 어떤 일을 하고 있습니까?
 * @class VertexMatrix
 */
var VertexMatrix = function() 
{
	if (!(this instanceof VertexMatrix)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.vertexListsArray = [];
	// SCTRATXH.******************
	this.totalVertexArraySC = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vertexList
 */
VertexMatrix.prototype.newVertexList = function() 
{
	var vertexList = new VertexList();
	this.vertexListsArray.push(vertexList);
	return vertexList;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param idx 변수
 * @returns vertexListArray[idx]
 */
VertexMatrix.prototype.getVertexList = function(idx) 
{
	if (idx >= 0 && idx < this.vertexListsArray.length) 
	{
		return this.vertexListsArray[idx];
	}
	else 
	{
		return undefined;
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param resultBox
 * @returns resultBox
 */
VertexMatrix.prototype.getBoundingBox = function(resultBox) 
{
	if (resultBox === undefined) { resultBox = new BoundingBox(); }
	
	this.totalVertexArraySC.length = 0;
	this.totalVertexArraySC = this.getTotalVertexArray(this.totalVertexArraySC);
	for (var i = 0, totalVertexCount = this.totalVertexArraySC.length; i < totalVertexCount; i++) 
	{
		if (i === 0) { resultBox.init(this.totalVertexArraySC[i].point3d); }
		else { resultBox.addPoint(this.totalVertexArraySC[i].point3d); }
	}
	return resultBox;
};

/**
 * 어떤 일을 하고 있습니까?
 */
VertexMatrix.prototype.setVertexIdxInList = function() 
{
	var idxInList = 0;
	for (var i = 0, vertexListsCount = this.vertexListsArray.length; i < vertexListsCount; i++) 
	{
		var vtxList = this.vertexListsArray[i];
		for (var j = 0, vertexCount = vtxList.vertexArray.length; j < vertexCount; j++) 
		{
			var vertex = vtxList.getVertex(j);
			vertex.mIdxInList = idxInList;
			idxInList++;
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vertexCount
 */
VertexMatrix.prototype.getVertexCount = function() 
{
	var vertexCount = 0;
	for (var i = 0, vertexListsCount = this.vertexListsArray.length; i < vertexListsCount; i++) 
	{
		vertexCount += this.vertexListsArray[i].getVertexCount();
	}
	
	return vertexCount;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param resultTotalVertexArray 변수
 * @returns resultTotalVertexArray
 */
VertexMatrix.prototype.getTotalVertexArray = function(resultTotalVertexArray) 
{
	for (var i = 0, vertexListsCount = this.vertexListsArray.length; i < vertexListsCount; i++) 
	{
		var vtxList = this.vertexListsArray[i];
		for (var j = 0, vertexCount = vtxList.vertexArray.length; j < vertexCount; j++) 
		{
			var vertex = vtxList.getVertex(j);
			resultTotalVertexArray.push(vertex);
		}
	}
	
	return resultTotalVertexArray;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param resultFloatArray 변수
 * @returns resultFloatArray
 */
VertexMatrix.prototype.getVBOVertexColorFloatArray = function(resultFloatArray) 
{
	this.totalVertexArraySC.length = 0;
	this.totalVertexArraySC = this.getTotalVertexArray(this.totalVertexArraySC);
	
	var totalVertexCount = this.totalVertexArraySC.length;
	if (resultFloatArray === undefined) { resultFloatArray = new Float32Array(totalVertexCount * 6); }
	
	for (var i = 0; i < totalVertexCount; i++) 
	{
		var vertex = this.totalVertexArraySC[i];
		resultFloatArray[i*6] = vertex.point3d.x;
		resultFloatArray[i*6+1] = vertex.point3d.y;
		resultFloatArray[i*6+2] = vertex.point3d.z;
		
		resultFloatArray[i*6+3] = vertex.color4.r;
		resultFloatArray[i*6+4] = vertex.color4.g;
		resultFloatArray[i*6+5] = vertex.color4.b;
	}
	
	return resultFloatArray;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param resultFloatArray 변수
 * @returns resultFloatArray
 */
VertexMatrix.prototype.getVBOVertexColorRGBAFloatArray = function(resultFloatArray) 
{
	this.totalVertexArraySC.length = 0;
	this.totalVertexArraySC = this.getTotalVertexArray(this.totalVertexArraySC);
	
	var totalVertexCount = this.totalVertexArraySC.length;
	if (resultFloatArray === undefined) { resultFloatArray = new Float32Array(totalVertexCount * 7); }
	
	for (var i = 0; i < totalVertexCount; i++) 
	{
		var vertex = this.totalVertexArraySC[i];
		resultFloatArray[i*7] = vertex.point3d.x;
		resultFloatArray[i*7+1] = vertex.point3d.y;
		resultFloatArray[i*7+2] = vertex.point3d.z;
		
		resultFloatArray[i*7+3] = vertex.color4.r;
		resultFloatArray[i*7+4] = vertex.color4.g;
		resultFloatArray[i*7+5] = vertex.color4.b;
		resultFloatArray[i*7+6] = vertex.color4.a;
	}
	
	return resultFloatArray;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param resultFloatArray 변수
 * @returns resultFloatArray
 */
VertexMatrix.prototype.getVBOVertexFloatArray = function(resultFloatArray) 
{
	this.totalVertexArraySC.length = 0;
	this.totalVertexArraySC = this.getTotalVertexArray(this.totalVertexArraySC);
	
	var totalVertexCount = this.totalVertexArraySC.length;
	if (resultFloatArray === undefined) { resultFloatArray = new Float32Array(totalVertexCount * 3); }
	
	for (var i = 0; i < totalVertexCount; i++) 
	{
		var vertex = this.totalVertexArraySC[i];
		resultFloatArray[i*3] = vertex.point3d.x;
		resultFloatArray[i*3+1] = vertex.point3d.y;
		resultFloatArray[i*3+2] = vertex.point3d.z;
	}
	
	return resultFloatArray;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param dirX 변수
 * @param dirY 변수
 * @param dirZ 변수
 * @param distance 변수
 */
VertexMatrix.prototype.translateVertices = function(dirX, dirY, dirZ, distance) 
{
	for (var i = 0, vertexListsCount = this.vertexListsArray.length; i < vertexListsCount; i++) 
	{
		this.vertexListsArray[i].translateVertices(dirX, dirY, dirZ, distance);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param tTrianglesMatrix 변수
 */
VertexMatrix.prototype.makeTTrianglesLateralSidesLOOP = function(tTrianglesMatrix) 
{
	// condition: all the vertex lists must have the same number of vertex.***
	var vtxList1;
	var vtxList2;
	var tTrianglesList;
	var tTriangle1;
	var tTriangle2;
	var vertexCount = 0;
	for (var i = 0, vertexListsCount = this.vertexListsArray.length; i < vertexListsCount-1; i++) 
	{
		vtxList1 = this.vertexListsArray[i];
		vtxList2 = this.vertexListsArray[i+1];
		tTrianglesList = tTrianglesMatrix.newTTrianglesList();
		
		vertexCount = vtxList1.vertexArray.length;
		for (var j = 0; j < vertexCount; j++) 
		{
			tTriangle1 = tTrianglesList.newTTriangle();
			tTriangle2 = tTrianglesList.newTTriangle();
			
			if (j === vertexCount-1) 
			{
				tTriangle1.setVertices(vtxList1.getVertex(j), vtxList2.getVertex(j), vtxList2.getVertex(0)); 
				tTriangle2.setVertices(vtxList1.getVertex(j), vtxList2.getVertex(0), vtxList1.getVertex(0)); 
			}
			else 
			{
				tTriangle1.setVertices(vtxList1.getVertex(j), vtxList2.getVertex(j), vtxList2.getVertex(j+1)); 
				tTriangle2.setVertices(vtxList1.getVertex(j), vtxList2.getVertex(j+1), vtxList1.getVertex(j+1)); 
			}
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param transformMatrix
 */
VertexMatrix.prototype.transformPointsByMatrix4 = function(transformMatrix) 
{
	for (var i = 0, vertexListsCount = this.vertexListsArray.length; i < vertexListsCount; i++) 
	{
		var vtxList = this.vertexListsArray[i];
		vtxList.transformPointsByMatrix4(transformMatrix);
	}
};


'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class VisibleObjectsController
 */
var VisibleObjectsController = function() 
{
	if (!(this instanceof VisibleObjectsController)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.currentVisibles0 = [];
	this.currentVisibles1 = [];
	this.currentVisibles2 = [];
	this.currentVisibles3 = [];
	
	this.currentRenderables0 = [];
	this.currentRenderables1 = [];
	this.currentRenderables2 = [];
	this.currentRenderables3 = [];
	
	this.currentRenderableRefArray = [];
};

VisibleObjectsController.prototype.initArrays = function() 
{
	this.currentVisibles0 = [];
	this.currentVisibles1 = [];
	this.currentVisibles2 = [];
	this.currentVisibles3 = [];
	
	this.currentRenderables0 = [];
	this.currentRenderables1 = [];
	this.currentRenderables2 = [];
	this.currentRenderables3 = [];
};

'use strict';

/**
 * mago3djs API
 * 
 * @alias API
 * @class API
 * 
 * @param {any} apiName api이름
 */
function API(apiName)
{
	if (!(this instanceof API)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	// mago3d 활성화/비활성화 여부
	this.magoEnable = true;

	// api 이름
	this.apiName = apiName;
	// project id
	this.projectId = null;
	// block id
	this.blockId = null;
	// blockIds
	this.blockIds = null;
	// objectIds
	this.objectIds = null;
	// data_key
	this.dataKey = null;
	// issueId
	this.issueId = null;
	// issueType
	this.issueType = null;
	// drawType 이미지를 그리는 유형 0 : DB, 1 : 이슈등록
	this.drawType = 0;

	// fullship = 0, deploy = 1
	this.renderMode = 0;
	// 위도
	this.latitude = 0;
	// 경도
	this.longitude = 0;
	// 높이
	this.elevation = 0;
	// heading
	this.heading = 0;
	// pitch
	this.pitch = 0;
	// roll
	this.roll = 0;

	// 색깔
	this.color = 0;
	// structs = MSP, outfitting = MOP
	this.blockType = null;
	// outfitting 표시/비표시
	this.showOutFitting = false;
	// boundingBox 표시/비표시
	this.showBoundingBox = false;
	// 그림자 표시/비표시
	this.showShadow = false;
	// frustum culling 가시 거리(M단위)
	this.frustumFarDistance = 0;
	// move mode 
	this.mouseMoveMode = CODE.moveMode.NONE;
	// 이슈 등록 표시
	this.issueInsertEnable = false;
	// object 정보 표시
	this.objectInfoViewEnable = false;
	// 이슈 목록 표시
	this.nearGeoIssueListEnable = false;
	//
	this.insertIssueState = 0;
};

API.prototype.getMagoEnable = function() 
{
	return this.magoEnable;
};
API.prototype.setMagoEnable = function(magoEnable) 
{
	this.magoEnable = magoEnable;
};

API.prototype.getAPIName = function() 
{
	return this.apiName;
};

API.prototype.getProjectId = function() 
{
	return this.projectId;
};
API.prototype.setProjectId = function(projectId) 
{
	this.projectId = projectId;
};

API.prototype.getBlockId = function() 
{
	return this.blockId;
};
API.prototype.setBlockId = function(blockId) 
{
	this.blockId = blockId;
};

API.prototype.getBlockIds = function() 
{
	return this.blockIds;
};
API.prototype.setBlockIds = function(blockIds) 
{
	this.blockIds = blockIds;
};

API.prototype.getObjectIds = function() 
{
	return this.objectIds;
};
API.prototype.setObjectIds = function(objectIds) 
{
	this.objectIds = objectIds;
};

API.prototype.getIssueId = function() 
{
	return this.issueId;
};
API.prototype.setIssueId = function(issueId) 
{
	this.issueId = issueId;
};
API.prototype.getIssueType = function() 
{
	return this.issueType;
};
API.prototype.setIssueType = function(issueType) 
{
	this.issueId = issueType;
};

API.prototype.getDataKey = function() 
{
	return this.dataKey;
};
API.prototype.setDataKey = function(dataKey) 
{
	this.dataKey = dataKey;
};

API.prototype.getRenderMode = function() 
{
	return this.renderMode;
};
API.prototype.setRenderMode = function(renderMode) 
{
	this.renderMode = renderMode;
};

API.prototype.getLatitude = function() 
{
	return this.latitude;
};
API.prototype.setLatitude = function(latitude) 
{
	this.latitude = latitude;
};

API.prototype.getLongitude = function() 
{
	return this.longitude;
};
API.prototype.setLongitude = function(longitude) 
{
	this.longitude = longitude;
};

API.prototype.getElevation = function() 
{
	return this.elevation;
};
API.prototype.setElevation = function(elevation) 
{
	this.elevation = elevation;
};

API.prototype.getHeading = function() 
{
	return this.heading;
};
API.prototype.setHeading = function(heading) 
{
	this.heading = heading;
};

API.prototype.getPitch = function() 
{
	return this.pitch;
};
API.prototype.setPitch = function(pitch) 
{
	this.pitch = pitch;
};

API.prototype.getRoll = function() 
{
	return this.roll;
};
API.prototype.setRoll = function(roll) 
{
	this.roll = roll;
};

API.prototype.getColor = function() 
{
	return this.color;
};
API.prototype.setColor = function(color) 
{
	this.color = color;
};

API.prototype.getBlockType = function() 
{
	return this.blockType;
};
API.prototype.setBlockType = function(blockType) 
{
	this.blockType = blockType;
};

API.prototype.getShowOutFitting = function() 
{
	return this.showOutFitting;
};
API.prototype.setShowOutFitting = function(showOutFitting) 
{
	this.showOutFitting = showOutFitting;
};

API.prototype.getShowBoundingBox = function() 
{
	return this.showBoundingBox;
};
API.prototype.setShowBoundingBox = function(showBoundingBox) 
{
	this.showBoundingBox = showBoundingBox;
};

API.prototype.getShowShadow = function() 
{
	return this.showShadow;
};
API.prototype.setShowShadow = function(showShadow) 
{
	this.showShadow = showShadow;
};

API.prototype.getFrustumFarDistance = function() 
{
	return this.frustumFarDistance;
};
API.prototype.setFrustumFarDistance = function(frustumFarDistance) 
{
	this.frustumFarDistance = frustumFarDistance;
};

API.prototype.getMouseMoveMode = function() 
{
	return this.mouseMoveMode;
};
API.prototype.setMouseMoveMode = function(mouseMoveMode) 
{
	this.mouseMoveMode = mouseMoveMode;
};

API.prototype.getIssueInsertEnable = function() 
{
	return this.issueInsertEnable;
};
API.prototype.setIssueInsertEnable = function(issueInsertEnable) 
{
	this.issueInsertEnable = issueInsertEnable;
};
API.prototype.getObjectInfoViewEnable = function() 
{
	return this.objectInfoViewEnable;
};
API.prototype.setObjectInfoViewEnable = function(objectInfoViewEnable) 
{
	this.objectInfoViewEnable = objectInfoViewEnable;
};
API.prototype.getNearGeoIssueListEnable = function() 
{
	return this.nearGeoIssueListEnable;
};
API.prototype.setNearGeoIssueListEnable = function(nearGeoIssueListEnable) 
{
	this.nearGeoIssueListEnable = nearGeoIssueListEnable;
};

API.prototype.getInsertIssueState = function() 
{
	return this.insertIssueState;
};
API.prototype.setInsertIssueState = function(insertIssueState) 
{
	this.insertIssueState = insertIssueState;
};

API.prototype.getDrawType = function() 
{
	return this.drawType;
};
API.prototype.setDrawType = function(drawType) 
{
	this.drawType = drawType;
};

'use strict';

/**
 * 선택한 object 정보를 화면에 표시
 * @param
 */
function selectedObjectCallback(functionName, projectId, blockId, objectId, latitude, longitude, elevation, heading, pitch, roll) 
{
	window[functionName](projectId, blockId, objectId, latitude, longitude, elevation, heading, pitch, roll);
}

/**
 * 선택한 object 정보를 화면에 표시
 * @param functionName
 * @param data_key
 * @param object_key
 * @param latitude
 * @param longitude
 * @param elevation
 */
function insertIssueCallback(functionName, data_key, object_key, latitude, longitude, elevation) 
{
	window[functionName](data_key, object_key, latitude, longitude, elevation);
}
'use strict';

/**
 * 환경 설정 클래스. json 으로 할까 고민도 했지만 우선은 이 형태로 하기로 함
 * @class MagoConfig
 */
var MagoConfig = {};

MagoConfig.getPolicy = function() 
{
	return this.serverPolicy;
};

MagoConfig.getData = function() 
{
	return this.serverData;
};

/**
 * 환경설정 세팅
 * 
 * @param serverPolicy mago3d policy(json)
 * @param serverData data 정보(json)
 */
MagoConfig.init = function(serverPolicy, serverData) 
{
	this.serverPolicy = serverPolicy;
	this.serverData = serverData;
};

/* eslint-env jquery */
'use strict';

/**
 * 화면단 UI와 연동 되는 API. APIGateWay 혹은 API 클래스로 클래스명 수정 예정
 * @class MagoFacade
 */
/**
 * mago3d 활성화/비활성화
 * 
 * @param {Property} isShow true = 활성화, false = 비활성화
 */
function changeMagoStateAPI(isShow) 
{
	var api = new API("changeMagoState");
	api.setMagoEnable(isShow);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * render mode
 * 
 * @param {Property} renderMode 0 = 호선, 1 = 지번전개
 */
function changeRenderAPI(renderMode) 
{
	var api = new API("changeRender");
	api.setRenderMode(renderMode);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * outfitting 표시/비표시
 * 
 * @param {Property} isShow true = 활성화, false = 비활성화
 */
function changeOutFittingAPI(isShow) 
{
	var api = new API("changeOutFitting");
	api.setShowOutFitting(isShow);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * boundingBox 표시/비표시
 * 
 * @param {Property} isShow true = 활성화, false = 비활성화
 */
function changeBoundingBoxAPI(isShow) 
{
	var api = new API("changeBoundingBox");
	api.setShowBoundingBox(isShow);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * 그림자 표시/비표시
 * 
 * @param {Property} isShow true = 활성화, false = 비활성화
 */
function changeShadowAPI(isShow) 
{
	var api = new API("changeShadow");
	api.setShowShadow(isShow);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * frustum culling 가시 거리
 * 
 * @param {Property} frustumFarDistance frustum 거리. 내부적으로는 입력값의 제곱이 사용됨
 */
function changeFrustumFarDistanceAPI(frustumFarDistance) 
{
	var api = new API("changefrustumFarDistance");
	api.setFrustumFarDistance(frustumFarDistance);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * 데이터 검색
 * 
 * @param {Property} dataKey 데이터 고유키
 */
function searchDataAPI(dataKey) 
{
	var api = new API("searchData");
	api.setDataKey(dataKey);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * highlighting
 * 
 * @param {Property} projectId 프로젝트 아이디
 * @param {Property} blockIds block id. 복수개의 경우 , 로 입력
 * @param {Property} objectIds object id. 복수개의 경우 , 로 입력
 */
function changeHighLightingAPI(projectId, blockIds, objectIds) 
{
	var api = new API("changeHighLighting");
	api.setProjectId(projectId);
	api.setBlockIds(blockIds);
	api.setObjectIds(objectIds);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * color 변경
 * 
 * @param {Property} projectId 프로젝트 아이디
 * @param {Property} blockIds block id. 복수개의 경우 , 로 입력
 * @param {Property} objectIds object id. 복수개의 경우 , 로 입력
 * @param {Property} color R, G, B 색깔을 ',' 로 연결한 string 값을 받음.
 */
function changeColorAPI(projectId, blockIds, objectIds, color) 
{
	var api = new API("changeColor");
	api.setProjectId(projectId);
	api.setBlockIds(blockIds);
	api.setObjectIds(objectIds);
	api.setColor(color);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * location and rotation 변경
 * 
 * @param {Property} data_key
 * @param {Property} latitude 위도
 * @param {Property} longitude 경도
 * @param {Property} height 높이
 * @param {Property} heading 좌, 우
 * @param {Property} pitch 위, 아래
 * @param {Property} roll 좌, 우 기울기
 */
function changeLocationAndRotationAPI(data_key, latitude, longitude, height, heading, pitch, roll) 
{
	var api = new API("changeLocationAndRotation");
	api.setDataKey(data_key);
	api.setLatitude(latitude);
	api.setLongitude(longitude);
	api.setElevation(height);
	api.setHeading(heading);
	api.setPitch(pitch);
	api.setRoll(roll);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * 마우스 클릭 객체 이동 대상 변경
 * 
 * @param {Property} mouseMoveMode 0 = All, 1 = object, 2 = None
 */
function changeMouseMoveAPI(mouseMoveMode) 
{
	var api = new API("changeMouseMove");
	api.setMouseMoveMode(mouseMoveMode);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * 이슈 등록 활성화 유무
 * 
 * @param {Property} flag true = 활성화, false = 비활성화
 */
function changeInsertIssueModeAPI(flag) 
{
	var api = new API("changeInsertIssueMode");
	api.setIssueInsertEnable(flag);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * object 정보 표시 활성화 유무
 * 
 * @param {Property} flag true = 활성화, false = 비활성화
 */
function changeObjectInfoViewModeAPI(flag) 
{
	var api = new API("changeObjectInfoViewMode");
	api.setObjectInfoViewEnable(flag);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * 현재 위치 근처 issue list. false인 경우 clear
 * 
 * @param {Property} flag true = 활성화, false = 비활성화
 */
function changeNearGeoIssueListViewModeAPI(flag) 
{
	var api = new API("changeNearGeoIssueListViewMode");
	api.setNearGeoIssueListEnable(flag);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * pin image를 그림
 * 
 * @param {Property} drawType 이미지를 그리는 유형 0 : DB, 1 : 이슈등록
 * @param {Property} issue_id 이슈 고유키
 * @param {Property} issue_type 이슈 고유키
 * @param {Property} data_key 데이터 고유키
 * @param {Property} latitude 데이터 고유키
 * @param {Property} longitude 데이터 고유키
 * @param {Property} height 데이터 고유키
 */
function drawInsertIssueImageAPI(drawType, issue_id, issue_type, data_key, latitude, longitude, height) 
{
	var api = new API("drawInsertIssueImage");
	api.setDrawType(drawType);
	api.setIssueId(issue_id);
	api.setIssueId(issue_type);
	api.setDataKey(data_key);
	api.setLatitude(latitude);
	api.setLongitude(longitude);
	api.setElevation(height);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * TODO 이건 위에 이슈 등록 활성화, 비활성화 api로 통합이 가능할거 같음
 * issue 등록 geo 정보 관련 상태 변경
 * 
 * @param {Property} insertIssueState 이슈 등록 좌표 상태
 */
function changeInsertIssueStateAPI(insertIssueState) 
{
	var api = new API("changeInsertIssueState");
	api.setInsertIssueState(insertIssueState);
	if (managerFactory !== null) 
	{
		managerFactory.callAPI(api);
	}
}

/**
 * 마우스를 사용할 수 없는 환경에서 버튼 이벤트로 대체
 * @param {Property} eventType 어떤 마우스 동작을 원하는지를 구분
 */
function mouseMoveAPI(eventType) 
{
	if (managerFactory !== null) 
	{
		managerFactory.mouseMove(eventType);
	}
}

'use strict';

/**
 * Policy
 * @class API
 */
var Policy = function() 
{
	if (!(this instanceof Policy)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	// mago3d 활성화/비활성화 여부
	this.magoEnable = true;

	// outfitting 표시 여부
	this.showOutFitting = false;
	// boundingBox 표시/비표시
	this.showBoundingBox = false;
	// 그림자 표시/비표시
	this.showShadow = false;
	// far frustum 거리
	this.frustumFarSquaredDistance = 5000000;

	// highlighting
	this.highLightedBuildings = [];
	// color
	this.colorBuildings = [];
	// color
	this.color = [];
	// show/hide
	this.hideBuildings = [];
	// move mode
	this.mouseMoveMode = CODE.moveMode.NONE;
	// 이슈 등록 표시
	this.issueInsertEnable = false;
	// object 정보 표시
	this.objectInfoViewEnable = false;
	// 이슈 목록 표시
	this.nearGeoIssueListEnable = false;
	
	// 이미지 경로
	this.imagePath = "";
	
	// provisional.***
	this.colorChangedObjectId;
};

Policy.prototype.getMagoEnable = function() 
{
	return this.magoEnable;
};
Policy.prototype.setMagoEnable = function(magoEnable) 
{
	this.magoEnable = magoEnable;
};

Policy.prototype.getShowOutFitting = function() 
{
	return this.showOutFitting;
};
Policy.prototype.setShowOutFitting = function(showOutFitting) 
{
	this.showOutFitting = showOutFitting;
};

Policy.prototype.getShowBoundingBox = function() 
{
	return this.showBoundingBox;
};
Policy.prototype.setShowBoundingBox = function(showBoundingBox) 
{
	this.showBoundingBox = showBoundingBox;
};

Policy.prototype.getShowShadow = function() 
{
	return this.showShadow;
};
Policy.prototype.setShowShadow = function(showShadow) 
{
	this.showShadow = showShadow;
};

Policy.prototype.getFrustumFarSquaredDistance = function() 
{
	return this.frustumFarSquaredDistance;
};
Policy.prototype.setFrustumFarSquaredDistance = function(frustumFarSquaredDistance) 
{
	this.frustumFarSquaredDistance = frustumFarSquaredDistance;
};

Policy.prototype.getHighLightedBuildings = function() 
{
	return this.highLightedBuildings;
};
Policy.prototype.setHighLightedBuildings = function(highLightedBuildings) 
{
	this.highLightedBuildings = highLightedBuildings;
};

Policy.prototype.getColorBuildings = function() 
{
	return this.colorBuildings;
};
Policy.prototype.setColorBuildings = function(colorBuildings) 
{
	this.colorBuildings = colorBuildings;
};

Policy.prototype.getColor = function() 
{
	return this.color;
};
Policy.prototype.setColor = function(color) 
{
	this.color = color;
};

Policy.prototype.getHideBuildings = function() 
{
	return this.hideBuildings;
};
Policy.prototype.setHideBuildings = function(hideBuildings) 
{
	this.hideBuildings = hideBuildings;
};

Policy.prototype.getMouseMoveMode = function() 
{
	return this.mouseMoveMode;
};
Policy.prototype.setMouseMoveMode = function(mouseMoveMode) 
{
	this.mouseMoveMode = mouseMoveMode;
};

Policy.prototype.getIssueInsertEnable = function() 
{
	return this.issueInsertEnable;
};
Policy.prototype.setIssueInsertEnable = function(issueInsertEnable) 
{
	this.issueInsertEnable = issueInsertEnable;
};
Policy.prototype.getObjectInfoViewEnable = function() 
{
	return this.objectInfoViewEnable;
};
Policy.prototype.setObjectInfoViewEnable = function(objectInfoViewEnable) 
{
	this.objectInfoViewEnable = objectInfoViewEnable;
};
Policy.prototype.getNearGeoIssueListEnable = function() 
{
	return this.nearGeoIssueListEnable;
};
Policy.prototype.setNearGeoIssueListEnable = function(nearGeoIssueListEnable) 
{
	this.nearGeoIssueListEnable = nearGeoIssueListEnable;
};

Policy.prototype.getImagePath = function() 
{
	return this.imagePath;
};
Policy.prototype.setImagePath = function(imagePath) 
{
	this.imagePath = imagePath;
};

'use strict';

/**
 * 프로젝트(ship, weather등)의 구성 요소
 * @class SearchCondition
 */
var ProjectLayer = function() 
{
	if (!(this instanceof ProjectLayer)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	// project id
	this.projectId = null;
	// block id
	this.blockId = null;
	// object id
	this.objectId = null;
	
};

ProjectLayer.prototype.getProjectId = function() 
{
	return this.projectId;
};
ProjectLayer.prototype.setProjectId = function(projectId) 
{
	this.projectId = projectId;
};

ProjectLayer.prototype.getBlockId = function() 
{
	return this.blockId;
};
ProjectLayer.prototype.setBlockId = function(blockId) 
{
	this.blockId = blockId;
};

ProjectLayer.prototype.getObjectId = function() 
{
	return this.objectId;
};
ProjectLayer.prototype.setObjectId = function(objectId) 
{
	this.objectId = objectId;
};
'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class Renderer
 */
var Renderer = function() 
{
	if (!(this instanceof Renderer)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.vbo_vi_cacheKey_aux;
	this.byteColorAux = new ByteColor();

	// SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.***

	this.currentTimeSC;
	this.dateSC;
	this.startTimeSC;
	this.simpObj_scratch;
};


/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
Renderer.prototype.renderNeoBuildingsAsimetricVersion = function(gl, visibleObjControlerBuildings, magoManager, standardShader, renderTexture, ssao_idx, maxSizeToRender, lod, refMatrixIdxKey) 
{
	var neoBuilding;
	var minSize = 0.0;
	var lowestOctreesCount;
	var lowestOctree;
	var isInterior = false; // no used.***
	
	// set webgl options.
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.depthRange(0, 1);
	if (MagoConfig.getPolicy().geo_cull_face_enable === "true") 
	{
		gl.enable(gl.CULL_FACE);
	}
	else 
	{
		gl.disable(gl.CULL_FACE);
	}

	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	
	// do render.
	var neoBuildingsCount = visibleObjControlerBuildings.currentVisibles0.length;
	for (var i=0; i<neoBuildingsCount; i++)
	{
		neoBuilding = visibleObjControlerBuildings.currentVisibles0[i];
		
		if (neoBuilding.currentVisibleOctreesControler === undefined)
		{ continue; }
		
		var buildingGeoLocation = neoBuilding.geoLocDataManager.getGeoLocationData(0);
		gl.uniformMatrix4fv(standardShader.buildingRotMatrix_loc, false, buildingGeoLocation.rotMatrix._floatArrays);
		gl.uniform3fv(standardShader.buildingPosHIGH_loc, buildingGeoLocation.positionHIGH);
		gl.uniform3fv(standardShader.buildingPosLOW_loc, buildingGeoLocation.positionLOW);
			
		if (ssao_idx === 0)
		{
			renderTexture = false;
		}
		else if (ssao_idx === 1)
		{
			if (neoBuilding.texturesLoaded.length>0)
			{
				renderTexture = true;
			}
			else { renderTexture = false; }
		}
		
		// LOD0.***
		minSize = 0.0;
		lowestOctreesCount = neoBuilding.currentVisibleOctreesControler.currentVisibles0.length;
		for (var j=0; j<lowestOctreesCount; j++) 
		{
			lowestOctree = neoBuilding.currentVisibleOctreesControler.currentVisibles0[j];
			if (lowestOctree.neoReferencesMotherAndIndices === undefined) 
			{ continue; }

			this.renderNeoRefListsAsimetricVersion(gl, lowestOctree.neoReferencesMotherAndIndices, neoBuilding, magoManager, isInterior, standardShader, renderTexture, ssao_idx, minSize, 0, refMatrixIdxKey);
			//this.renderNeoRefListsGroupedVersion(gl, lowestOctree.neoReferencesMotherAndIndices, neoBuilding, magoManager, isInterior, standardShader, renderTexture, ssao_idx, minSize, 0, refMatrixIdxKey);
		}
		
		// LOD1.***
		minSize = 1.0;
		lowestOctreesCount = neoBuilding.currentVisibleOctreesControler.currentVisibles1.length;
		for (var j=0; j<lowestOctreesCount; j++) 
		{
			lowestOctree = neoBuilding.currentVisibleOctreesControler.currentVisibles1[j];
			if (lowestOctree.neoReferencesMotherAndIndices === undefined) 
			{ continue; }

			this.renderNeoRefListsAsimetricVersion(gl, lowestOctree.neoReferencesMotherAndIndices, neoBuilding, magoManager, isInterior, standardShader, renderTexture, ssao_idx, minSize, 1, refMatrixIdxKey);
			//this.renderNeoRefListsGroupedVersion(gl, lowestOctree.neoReferencesMotherAndIndices, neoBuilding, magoManager, isInterior, standardShader, renderTexture, ssao_idx, minSize, 1, refMatrixIdxKey);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
Renderer.prototype.renderNeoBuildingsLOD2AsimetricVersion = function(gl, visibleObjControlerBuildings, magoManager, standardShader, renderTexture, ssao_idx) 
{
	var neoBuilding;
	var minSize = 0.0;
	var lowestOctreesCount;
	var lowestOctree;
	var isInterior = false; // no used.***
	var lastExtureId;
	
	var neoBuildingsCount = visibleObjControlerBuildings.currentVisibles2.length;
	for (var i=0; i<neoBuildingsCount; i++)
	{
		neoBuilding = visibleObjControlerBuildings.currentVisibles2[i];
		if (neoBuilding.currentVisibleOctreesControler === undefined)
		{ continue; }
		
		var buildingGeoLocation = neoBuilding.geoLocDataManager.getGeoLocationData(0);
		gl.uniformMatrix4fv(standardShader.buildingRotMatrix_loc, false, buildingGeoLocation.rotMatrix._floatArrays);
		gl.uniform3fv(standardShader.buildingPosHIGH_loc, buildingGeoLocation.positionHIGH);
		gl.uniform3fv(standardShader.buildingPosLOW_loc, buildingGeoLocation.positionLOW);
		
		
		lowestOctreesCount = neoBuilding.currentVisibleOctreesControler.currentVisibles2.length;
		for (var j=0; j<lowestOctreesCount; j++) 
		{
			lowestOctree = neoBuilding.currentVisibleOctreesControler.currentVisibles2[j];

			if (lowestOctree.lego === undefined) 
			{
				lowestOctree.lego = new Lego();
				lowestOctree.lego.fileLoadState = CODE.fileLoadState.READY;
			}

			if (lowestOctree.lego === undefined && lowestOctree.lego.dataArrayBuffer === undefined) 
			{ continue; }

			if (neoBuilding === undefined)
			{ continue; }

			if (neoBuilding.buildingType === "outfitting")
			{ continue; }

			// if the building is highlighted, the use highlight oneColor4.*********************
			if (ssao_idx === 1)
			{
				if (neoBuilding.isHighLighted)
				{
					gl.uniform1i(standardShader.bUse1Color_loc, true);
					gl.uniform4fv(standardShader.oneColor4_loc, this.highLightColor4); //.***
				}
				else if (neoBuilding.isColorChanged)
				{
					gl.uniform1i(standardShader.bUse1Color_loc, true);
					gl.uniform4fv(standardShader.oneColor4_loc, [neoBuilding.aditionalColor.r, neoBuilding.aditionalColor.g, neoBuilding.aditionalColor.b, neoBuilding.aditionalColor.a]); //.***
				}
				else
				{
					gl.uniform1i(standardShader.bUse1Color_loc, false);
				}
				//----------------------------------------------------------------------------------
				renderTexture = true;
				if (neoBuilding.simpleBuilding3x3Texture !== undefined && neoBuilding.simpleBuilding3x3Texture.texId)
				{
					gl.enableVertexAttribArray(standardShader.texCoord2_loc);
					//gl.activeTexture(gl.TEXTURE2); 
					gl.uniform1i(standardShader.hasTexture_loc, true);
					if (lastExtureId !== neoBuilding.simpleBuilding3x3Texture.texId)
					{
						gl.bindTexture(gl.TEXTURE_2D, neoBuilding.simpleBuilding3x3Texture.texId);
						lastExtureId = neoBuilding.simpleBuilding3x3Texture.texId;
					}
				}
				else 
				{
					gl.uniform1i(standardShader.hasTexture_loc, false);
					gl.disableVertexAttribArray(standardShader.texCoord2_loc);
					renderTexture = false;
				}
			}

			this.renderLodBuilding(gl, lowestOctree.lego, magoManager, standardShader, ssao_idx, renderTexture);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param neoRefList_array 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 * @param isInterior 변수
 * @param standardShader 변수
 * @param renderTexture 변수
 * @param ssao_idx 변수
 */
Renderer.prototype.renderNeoRefListsAsimetricVersion = function(gl, neoReferencesMotherAndIndices, neoBuilding, magoManager,
	isInterior, standardShader, renderTexture, ssao_idx, maxSizeToRender, lod, refMatrixIdxKey) 
{
	// render_neoRef
	if (neoReferencesMotherAndIndices.neoRefsIndices == undefined)
	{ return; }
	
	var neoRefsCount = neoReferencesMotherAndIndices.neoRefsIndices.length;
	if (neoRefsCount === 0) 
	{ return; }
	
	if (ssao_idx === 0) // do depth render.***
	{
		this.depthRenderNeoRefListsAsimetricVersion(gl, neoReferencesMotherAndIndices, neoBuilding, magoManager,
			isInterior, standardShader, renderTexture, ssao_idx, maxSizeToRender, lod, refMatrixIdxKey);
		return;
	}

	var timeControlCounter = 0;

	var cacheKeys_count;
	var reference;
	var block_idx;
	var block;
	var ifc_entity;
	var vbo_ByteColorsCacheKeys_Container;
	var current_tex_id;
	var current_vbo_id;
	var textureBinded = false;

	gl.activeTexture(gl.TEXTURE2); // ...***
	if (renderTexture) 
	{
		if (ssao_idx === 1) { gl.uniform1i(standardShader.hasTexture_loc, true); } //.***
	}
	else 
	{
		gl.bindTexture(gl.TEXTURE_2D, magoManager.textureAux_1x1);
	}
	gl.bindTexture(gl.TEXTURE_2D, magoManager.textureAux_1x1);

	var geometryDataPath = magoManager.readerWriter.geometryDataPath;

	var myBlocksList = neoReferencesMotherAndIndices.blocksList;
	if (myBlocksList === undefined)
	{ return; }

	if (myBlocksList.fileLoadState !== CODE.fileLoadState.PARSE_FINISHED) { return; }
		
	// New version. Use occlussion indices.***
	//var visibleIndices_count = neoReferencesMotherAndIndices.neoRefsIndices.length; // no occludeCulling mode.***
	var visibleIndices_count = neoReferencesMotherAndIndices.currentVisibleIndices.length;

	for (var k=0; k<visibleIndices_count; k++) 
	{
		//var neoReference = neoReferencesMotherAndIndices.motherNeoRefsList[neoReferencesMotherAndIndices.neoRefsIndices[k]]; // no occludeCulling mode.***
		var neoReference = neoReferencesMotherAndIndices.motherNeoRefsList[neoReferencesMotherAndIndices.currentVisibleIndices[k]];
		if (neoReference === undefined) 
		{
			continue;
		}

		if (neoReference.bRendered === magoManager.renderingFase)
		{
			continue;
		}
		
		if (neoReference.tMatrixAuxArray === undefined)
		{
			//neoReference.multiplyKeyTransformMatrix(refMatrixIdxKey, neoBuilding.geoLocationDataAux.rotMatrix);
			// we must collect all the neoReferences that has no tMatrixAuxArray and make it.***
			continue;
		}

		block_idx = neoReference._block_idx;
		block = neoBuilding.motherBlocksArray[block_idx];

		if (block === undefined)
		{ continue; }

		if (maxSizeToRender && (block.radius < maxSizeToRender))
		{ continue; }
		
		if (magoManager.isCameraMoving && block.isSmallObj && magoManager.objectSelected !== neoReference)
		{ continue; }
		
		// Check if the texture is loaded.
		//if(renderTexture)
		{
			if (neoReference.texture !== undefined)
			{
				if (neoBuilding.manageNeoReferenceTexture(neoReference, magoManager) !== CODE.fileLoadState.LOADING_FINISHED)
				{ continue; }
			}
		}
		
		// Check the color or texture of reference object.
		if (neoBuilding.isHighLighted)
		{
			gl.uniform1i(standardShader.hasTexture_loc, false); //.***
			gl.uniform4fv(standardShader.color4Aux_loc, magoManager.highLightColor4);
		}
		else if (neoBuilding.isColorChanged)
		{
			gl.uniform1i(standardShader.hasTexture_loc, false); //.***
			if (magoManager.objectSelected === neoReference) 
			{
				gl.uniform4fv(standardShader.color4Aux_loc, [255.0/255.0, 0/255.0, 0/255.0, 255.0/255.0]);
			}
			else
			{
				gl.uniform4fv(standardShader.color4Aux_loc, [neoBuilding.aditionalColor.r, neoBuilding.aditionalColor.g, neoBuilding.aditionalColor.b, neoBuilding.aditionalColor.a] );
			}
		}
		else if (neoReference.aditionalColor)
		{
			gl.uniform1i(standardShader.hasTexture_loc, false); //.***
			if (magoManager.objectSelected === neoReference) 
			{
				gl.uniform4fv(standardShader.color4Aux_loc, [255.0/255.0, 0/255.0, 0/255.0, 255.0/255.0]);
			}
			else
			{
				gl.uniform4fv(standardShader.color4Aux_loc, [neoReference.aditionalColor.r, neoReference.aditionalColor.g, neoReference.aditionalColor.b, neoReference.aditionalColor.a] );
			}
		}
		else
		{
			// Normal rendering.
			if (magoManager.objectSelected === neoReference) 
			{
				gl.uniform1i(standardShader.hasTexture_loc, false); //.***
				gl.uniform4fv(standardShader.color4Aux_loc, [255.0/255.0, 0/255.0, 0/255.0, 255.0/255.0]);
				
				// Active stencil if the object is selected.
				gl.enable(gl.STENCIL_TEST);
				gl.clearStencil(0);
				gl.clear(gl.STENCIL_BUFFER_BIT);
				gl.stencilFunc(gl.ALWAYS, 1, 1);
				gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
				gl.disable(gl.CULL_FACE);
			}
			else if (magoManager.magoPolicy.colorChangedObjectId === neoReference.objectId)
			{
				gl.uniform1i(standardShader.hasTexture_loc, false); //.***
				gl.uniform4fv(standardShader.color4Aux_loc, [magoManager.magoPolicy.color[0], magoManager.magoPolicy.color[1], magoManager.magoPolicy.color[2], 1.0]);
			}
			else
			{
				if (renderTexture && neoReference.hasTexture) 
				{
					if (neoReference.texture !== undefined && neoReference.texture.texId !== undefined) 
					{
						//textureBinded = true;
						gl.uniform1i(standardShader.hasTexture_loc, true); //.***
						if (current_tex_id !== neoReference.texture.texId) 
						{
							gl.bindTexture(gl.TEXTURE_2D, neoReference.texture.texId);
							current_tex_id = neoReference.texture.texId;
						}
					}
					else 
					{
						gl.uniform1i(standardShader.hasTexture_loc, false); //.***
						gl.uniform4fv(standardShader.color4Aux_loc, [0.8, 0.8, 0.8, 1.0]);
					}
				}
				else 
				{
					// if no render texture, then use a color.***
					if (neoReference.color4) 
					{
						gl.uniform1i(standardShader.hasTexture_loc, false); //.***
						gl.uniform4fv(standardShader.color4Aux_loc, [neoReference.color4.r/255.0, neoReference.color4.g/255.0, neoReference.color4.b/255.0, neoReference.color4.a/255.0]);
					}
					else
					{
						gl.uniform1i(standardShader.hasTexture_loc, false); //.***
						gl.uniform4fv(standardShader.color4Aux_loc, [0.8, 0.8, 0.8, 1.0]);
					}
				}
			}
		}
		
		cacheKeys_count = block.vBOVertexIdxCacheKeysContainer.vboCacheKeysArray.length;
		// Must applicate the transformMatrix of the reference object.***
		gl.uniform1i(standardShader.refMatrixType_loc, neoReference.refMatrixType);
		if (refMatrixIdxKey === undefined || refMatrixIdxKey === -1)
		{ // never enter here...
			if (neoReference.refMatrixType === 1)
			{ gl.uniform3fv(standardShader.refTranslationVec_loc, neoReference.refTranslationVec); }
			else if (neoReference.refMatrixType === 2)
			{ gl.uniformMatrix4fv(standardShader.RefTransfMatrix, false, neoReference._matrix4._floatArrays); } 
		}
		else 
		{
			if (neoReference.refMatrixType === 1)
			{ gl.uniform3fv(standardShader.refTranslationVec_loc, neoReference.refTranslationVec); }
			else if (neoReference.refMatrixType === 2)
			{ gl.uniformMatrix4fv(standardShader.RefTransfMatrix, false, neoReference.tMatrixAuxArray[refMatrixIdxKey]._floatArrays); }
		}

		if (neoReference.moveVector !== undefined) 
		{
			gl.uniform1i(standardShader.hasAditionalMov_loc, true);
			gl.uniform3fv(standardShader.aditionalMov_loc, [neoReference.moveVector.x, neoReference.moveVector.y, neoReference.moveVector.z]); //.***
		}
		else 
		{
			gl.uniform1i(standardShader.hasAditionalMov_loc, false);
			gl.uniform3fv(standardShader.aditionalMov_loc, [0.0, 0.0, 0.0]); //.***
		}

		for (var n=0; n<cacheKeys_count; n++) // Original.***
		{
			//var mesh_array = block.viArraysContainer._meshArrays[n];
			this.vbo_vi_cacheKey_aux = block.vBOVertexIdxCacheKeysContainer.vboCacheKeysArray[n];
			if (!this.vbo_vi_cacheKey_aux.isReadyPositions(gl, magoManager.vboMemoryManager) || !this.vbo_vi_cacheKey_aux.isReadyNormals(gl, magoManager.vboMemoryManager) || !this.vbo_vi_cacheKey_aux.isReadyFaces(gl, magoManager.vboMemoryManager))
			{ continue; }
			
			// Positions.***
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_vi_cacheKey_aux.meshVertexCacheKey);
			gl.vertexAttribPointer(standardShader.position3_loc, 3, gl.FLOAT, false, 0, 0);
			//gl.vertexAttribPointer(standardShader.attribLocationCacheObj["position"], 3, gl.FLOAT, false,0,0);

			
			// Normals.***
			if (standardShader.normal3_loc !== -1) 
			{
				gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_vi_cacheKey_aux.meshNormalCacheKey);
				gl.vertexAttribPointer(standardShader.normal3_loc, 3, gl.BYTE, true, 0, 0);
			}

			if (renderTexture && neoReference.hasTexture) 
			{
				if (block.vertexCount <= neoReference.vertexCount) 
				{
					var refVboData = neoReference.vBOVertexIdxCacheKeysContainer.vboCacheKeysArray[n];
					if (!refVboData.isReadyTexCoords(gl, magoManager.vboMemoryManager))
					{ continue; }

					gl.enableVertexAttribArray(standardShader.texCoord2_loc);
					gl.bindBuffer(gl.ARRAY_BUFFER, refVboData.meshTexcoordsCacheKey);
					gl.vertexAttribPointer(standardShader.texCoord2_loc, 2, gl.FLOAT, false, 0, 0);
				}
				else 
				{
					if (standardShader.texCoord2_loc !== -1) { gl.disableVertexAttribArray(standardShader.texCoord2_loc); }
				}
			}
			else 
			{
				if (standardShader.texCoord2_loc !== -1) { gl.disableVertexAttribArray(standardShader.texCoord2_loc); }
			}

			// Indices.***
			var indicesCount;
			if (magoManager.isCameraMoving)// && !isInterior && magoManager.isCameraInsideBuilding)
			{
				if (magoManager.objectSelected === neoReference)
				{ indicesCount = this.vbo_vi_cacheKey_aux.indicesCount; }
				else
				{
					indicesCount = this.vbo_vi_cacheKey_aux.bigTrianglesIndicesCount;
					if (indicesCount > this.vbo_vi_cacheKey_aux.indicesCount)
					{ indicesCount = this.vbo_vi_cacheKey_aux.indicesCount; }
					
					//if(indicesCount === 0)
					//	indicesCount = this.vbo_vi_cacheKey_aux.indicesCount;
				}
			}
			else
			{
				//if(lod > 0)
				//{
				//	indicesCount = this.vbo_vi_cacheKey_aux.bigTrianglesIndicesCount;
				//	if(indicesCount > this.vbo_vi_cacheKey_aux.indicesCount)
				//		indicesCount = this.vbo_vi_cacheKey_aux.indicesCount;
				//}
				//else indicesCount = this.vbo_vi_cacheKey_aux.indicesCount;
				indicesCount = this.vbo_vi_cacheKey_aux.indicesCount;
			}

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vbo_vi_cacheKey_aux.meshFacesCacheKey);
			gl.drawElements(gl.TRIANGLES, indicesCount, gl.UNSIGNED_SHORT, 0); // Fill.***
			//gl.drawElements(gl.LINES, this.vbo_vi_cacheKey_aux.indicesCount, gl.UNSIGNED_SHORT, 0); // Wireframe.***
		}

		neoReference.bRendered = !neoReference.bRendered;
		if (magoManager.objectSelected === neoReference)
		{
			gl.disable(gl.STENCIL_TEST);
			gl.disable(gl.POLYGON_OFFSET_FILL);
			gl.enable(gl.CULL_FACE);
		}
	}
		
	gl.enable(gl.DEPTH_TEST);
	gl.disable(gl.STENCIL_TEST);
	gl.enable(gl.CULL_FACE);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param neoRefList_array 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 * @param isInterior 변수
 * @param standardShader 변수
 * @param renderTexture 변수
 * @param ssao_idx 변수
 */
Renderer.prototype.renderNeoRefListsGroupedVersion = function(gl, neoReferencesMotherAndIndices, neoBuilding, magoManager,
	isInterior, standardShader, renderTexture, ssao_idx, maxSizeToRender, lod, refMatrixIdxKey) 
{
	// render_neoRef
	var neoRefsCount = neoReferencesMotherAndIndices.neoRefsIndices.length;
	if (neoRefsCount === 0) 
	{ return; }
	
	if (ssao_idx === 0) // do depth render.***
	{
		//this.depthRenderNeoRefListsAsimetricVersion(gl, neoReferencesMotherAndIndices, neoBuilding, magoManager,
		//	isInterior, standardShader, renderTexture, ssao_idx, maxSizeToRender, lod, refMatrixIdxKey);
			
		this.depthRenderNeoRefListsGroupedVersion(gl, neoReferencesMotherAndIndices, neoBuilding, magoManager,
			isInterior, standardShader, renderTexture, ssao_idx, maxSizeToRender, lod, refMatrixIdxKey);
		return;
	}

	var timeControlCounter = 0;
	

	var cacheKeys_count;
	var reference;
	var block_idx;
	var block;
	var ifc_entity;
	var vbo_ByteColorsCacheKeys_Container;
	var current_tex_id;
	var current_vbo_id;

	gl.activeTexture(gl.TEXTURE2); // ...***
	if (renderTexture) 
	{
		if (ssao_idx === 1) { gl.uniform1i(standardShader.hasTexture_loc, true); } //.***
	}
	else 
	{
		gl.bindTexture(gl.TEXTURE_2D, magoManager.textureAux_1x1);
	}
	gl.bindTexture(gl.TEXTURE_2D, magoManager.textureAux_1x1);

	var geometryDataPath = magoManager.readerWriter.geometryDataPath;

	var myBlocksList = neoReferencesMotherAndIndices.blocksList;
	if (myBlocksList === undefined)
	{ return; }

	if (myBlocksList.fileLoadState !== CODE.fileLoadState.PARSE_FINISHED) { return; }
		
	// New version. Use occlussion indices.***
	var modelReferencedGroupsList = neoReferencesMotherAndIndices.modelReferencedGroupsList;
	var modelReferencedGroupsCount = modelReferencedGroupsList.modelReferencedGroupsArray.length;
	
	for (var i=0; i<modelReferencedGroupsCount; i++)
	{
		var currentModelReferencedGroup = modelReferencedGroupsList.modelReferencedGroupsArray[i];
		
		// first, bind model geometry.
		block_idx = currentModelReferencedGroup.modelIdx;
		block = neoBuilding.motherBlocksArray[block_idx];
		if (block === undefined)
		{ continue; }

		if (maxSizeToRender && (block.radius < maxSizeToRender))
		{ continue; }
	
		if (lod == 1 && block.isSmallObj && magoManager.objectSelected !== neoReference)
		{ continue; }
		
		if (magoManager.isCameraMoving && block.isSmallObj && magoManager.objectSelected !== neoReference)
		{ continue; }
		
		// binding models geometry.
		cacheKeys_count = block.vBOVertexIdxCacheKeysContainer.vboCacheKeysArray.length;
		for (var n=0; n<cacheKeys_count; n++) // Original.***
		{
			//var mesh_array = block.viArraysContainer._meshArrays[n];
			this.vbo_vi_cacheKey_aux = block.vBOVertexIdxCacheKeysContainer.vboCacheKeysArray[n];
			if (!this.vbo_vi_cacheKey_aux.isReadyPositions(gl, magoManager.vboMemoryManager) || !this.vbo_vi_cacheKey_aux.isReadyNormals(gl, magoManager.vboMemoryManager) || !this.vbo_vi_cacheKey_aux.isReadyFaces(gl, magoManager.vboMemoryManager))
			{ continue; }

			// Positions.***
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_vi_cacheKey_aux.meshVertexCacheKey);
			gl.vertexAttribPointer(standardShader.position3_loc, 3, gl.FLOAT, false, 0, 0);
			//gl.vertexAttribPointer(standardShader.attribLocationCacheObj["position"], 3, gl.FLOAT, false,0,0);

			// Normals.***
			if (standardShader.normal3_loc !== -1) 
			{
				gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_vi_cacheKey_aux.meshNormalCacheKey);
				gl.vertexAttribPointer(standardShader.normal3_loc, 3, gl.BYTE, true, 0, 0);
			}

			// Indices.***
			var indicesCount;
			if (magoManager.isCameraMoving)// && !isInterior && magoManager.isCameraInsideBuilding)
			{
				if (magoManager.objectSelected === neoReference)
				{ indicesCount = this.vbo_vi_cacheKey_aux.indicesCount; }
				else
				{
					indicesCount = this.vbo_vi_cacheKey_aux.bigTrianglesIndicesCount;
					if (indicesCount > this.vbo_vi_cacheKey_aux.indicesCount)
					{ indicesCount = this.vbo_vi_cacheKey_aux.indicesCount; }
					
					//if(indicesCount === 0)
					//	indicesCount = this.vbo_vi_cacheKey_aux.indicesCount;
				}
			}
			else
			{
				//if(lod > 0)
				//{
				//	indicesCount = this.vbo_vi_cacheKey_aux.bigTrianglesIndicesCount;
				//	if(indicesCount > this.vbo_vi_cacheKey_aux.indicesCount)
				//		indicesCount = this.vbo_vi_cacheKey_aux.indicesCount;
				//}
				//else indicesCount = this.vbo_vi_cacheKey_aux.indicesCount;
				indicesCount = this.vbo_vi_cacheKey_aux.indicesCount;
			}

			// now render all references of this model.
			var visibleIndices_count = currentModelReferencedGroup.referencesIdxArray.length;
			for (var k=0; k<visibleIndices_count; k++) 
			{
				//var neoReference = neoReferencesMotherAndIndices.motherNeoRefsList[neoReferencesMotherAndIndices.currentVisibleIndices[k]]; // old.***
				var neoReference = neoReferencesMotherAndIndices.motherNeoRefsList[currentModelReferencedGroup.referencesIdxArray[k]];
				if (neoReference === undefined) 
				{ continue; }

				if (neoReference.bRendered === magoManager.renderingFase)
				{ continue; }
				
				if (neoReference.tMatrixAuxArray === undefined)
				{
					//neoReference.multiplyKeyTransformMatrix(refMatrixIdxKey, neoBuilding.geoLocationDataAux.rotMatrix);
					// we must collect all the neoReferences that has no tMatrixAuxArray and make it.***
					continue;
				}
				
				// Check if the texture is loaded.
				//if(renderTexture)
				{
					if (neoReference.texture !== undefined)
					{
						if (neoBuilding.manageNeoReferenceTexture(neoReference, magoManager) !== CODE.fileLoadState.LOADING_FINISHED)
						{ continue; }
					}
				}
				
				// Check the color or texture of reference object.
				if (neoBuilding.isHighLighted)
				{
					gl.uniform1i(standardShader.hasTexture_loc, false); //.***
					gl.uniform4fv(standardShader.color4Aux_loc, magoManager.highLightColor4);
				}
				else if (neoBuilding.isColorChanged)
				{
					gl.uniform1i(standardShader.hasTexture_loc, false); //.***
					if (magoManager.objectSelected === neoReference) 
					{
						gl.uniform4fv(standardShader.color4Aux_loc, [255.0/255.0, 0/255.0, 0/255.0, 255.0/255.0]);
					}
					else
					{
						gl.uniform4fv(standardShader.color4Aux_loc, [neoBuilding.aditionalColor.r, neoBuilding.aditionalColor.g, neoBuilding.aditionalColor.b, neoBuilding.aditionalColor.a] );
					}
				}
				else if (neoReference.aditionalColor)
				{
					gl.uniform1i(standardShader.hasTexture_loc, false); //.***
					if (magoManager.objectSelected === neoReference) 
					{
						gl.uniform4fv(standardShader.color4Aux_loc, [255.0/255.0, 0/255.0, 0/255.0, 255.0/255.0]);
					}
					else
					{
						gl.uniform4fv(standardShader.color4Aux_loc, [neoReference.aditionalColor.r, neoReference.aditionalColor.g, neoReference.aditionalColor.b, neoReference.aditionalColor.a] );
					}
				}
				else
				{
					// Normal rendering.
					if (magoManager.objectSelected === neoReference) 
					{
						gl.uniform1i(standardShader.hasTexture_loc, false); //.***
						gl.uniform4fv(standardShader.color4Aux_loc, [255.0/255.0, 0/255.0, 0/255.0, 255.0/255.0]);
						
						// Active stencil if the object is selected.
						gl.enable(gl.STENCIL_TEST);
						gl.clearStencil(0);
						gl.clear(gl.STENCIL_BUFFER_BIT);
						gl.stencilFunc(gl.ALWAYS, 1, 1);
						gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
						gl.disable(gl.CULL_FACE);
					}
					else if (magoManager.magoPolicy.colorChangedObjectId === neoReference.objectId)
					{
						gl.uniform1i(standardShader.hasTexture_loc, false); //.***
						gl.uniform4fv(standardShader.color4Aux_loc, [magoManager.magoPolicy.color[0], magoManager.magoPolicy.color[1], magoManager.magoPolicy.color[2], 1.0]);
					}
					else
					{
						if (renderTexture && neoReference.hasTexture) 
						{
							if (neoReference.texture !== undefined && neoReference.texture.texId !== undefined) 
							{
								//textureBinded = true;
								gl.uniform1i(standardShader.hasTexture_loc, true); //.***
								if (current_tex_id !== neoReference.texture.texId) 
								{
									gl.bindTexture(gl.TEXTURE_2D, neoReference.texture.texId);
									current_tex_id = neoReference.texture.texId;
								}
							}
							else 
							{
								gl.uniform1i(standardShader.hasTexture_loc, false); //.***
								gl.uniform4fv(standardShader.color4Aux_loc, [0.8, 0.8, 0.8, 1.0]);
							}
						}
						else 
						{
							// if no render texture, then use a color.***
							if (neoReference.color4) 
							{
								gl.uniform1i(standardShader.hasTexture_loc, false); //.***
								gl.uniform4fv(standardShader.color4Aux_loc, [neoReference.color4.r/255.0, neoReference.color4.g/255.0, neoReference.color4.b/255.0, neoReference.color4.a/255.0]);
							}
							else
							{
								gl.uniform1i(standardShader.hasTexture_loc, false); //.***
								gl.uniform4fv(standardShader.color4Aux_loc, [0.8, 0.8, 0.8, 1.0]);
							}
							
						}
					}
				}
				
				// Must applicate the transformMatrix of the reference object.***
				gl.uniform1i(standardShader.refMatrixType_loc, neoReference.refMatrixType);
				if (refMatrixIdxKey === undefined || refMatrixIdxKey === -1)
				{ // never enter here...
					if (neoReference.refMatrixType === 1)
					{ gl.uniform3fv(standardShader.refTranslationVec_loc, neoReference.refTranslationVec); }
					else if (neoReference.refMatrixType === 2)
					{ gl.uniformMatrix4fv(standardShader.RefTransfMatrix, false, neoReference._matrix4._floatArrays); } 
				}
				else 
				{
					if (neoReference.refMatrixType === 1)
					{ gl.uniform3fv(standardShader.refTranslationVec_loc, neoReference.refTranslationVec); }
					else if (neoReference.refMatrixType === 2)
					{ gl.uniformMatrix4fv(standardShader.RefTransfMatrix, false, neoReference.tMatrixAuxArray[refMatrixIdxKey]._floatArrays); }
				}

				if (neoReference.moveVector !== undefined) 
				{
					gl.uniform1i(standardShader.hasAditionalMov_loc, true);
					gl.uniform3fv(standardShader.aditionalMov_loc, [neoReference.moveVector.x, neoReference.moveVector.y, neoReference.moveVector.z]); //.***
				}
				else 
				{
					gl.uniform1i(standardShader.hasAditionalMov_loc, false);
					gl.uniform3fv(standardShader.aditionalMov_loc, [0.0, 0.0, 0.0]); //.***
				}
				
				if (renderTexture && neoReference.hasTexture) 
				{
					if (block.vertexCount <= neoReference.vertexCount) 
					{
						var refVboData = neoReference.vBOVertexIdxCacheKeysContainer.vboCacheKeysArray[n];
						if (!refVboData.isReadyTexCoords(gl, magoManager.vboMemoryManager))
						{ continue; }

						gl.enableVertexAttribArray(standardShader.texCoord2_loc);
						gl.bindBuffer(gl.ARRAY_BUFFER, refVboData.meshTexcoordsCacheKey);
						gl.vertexAttribPointer(standardShader.texCoord2_loc, 2, gl.FLOAT, false, 0, 0);
					}
					else 
					{
						if (standardShader.texCoord2_loc !== -1) { gl.disableVertexAttribArray(standardShader.texCoord2_loc); }
					}
				}
				else 
				{
					if (standardShader.texCoord2_loc !== -1) { gl.disableVertexAttribArray(standardShader.texCoord2_loc); }
				}
				
				
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vbo_vi_cacheKey_aux.meshFacesCacheKey);
				gl.drawElements(gl.TRIANGLES, indicesCount, gl.UNSIGNED_SHORT, 0); // Fill.***
				//gl.drawElements(gl.LINES, this.vbo_vi_cacheKey_aux.indicesCount, gl.UNSIGNED_SHORT, 0); // Wireframe.***
				
				neoReference.bRendered = !neoReference.bRendered;
				if (magoManager.objectSelected === neoReference)
				{
					gl.disable(gl.STENCIL_TEST);
					gl.disable(gl.POLYGON_OFFSET_FILL);
					gl.enable(gl.CULL_FACE);
				}
			}
		}
	}

	gl.enable(gl.DEPTH_TEST);
	gl.disable(gl.STENCIL_TEST);
	gl.enable(gl.CULL_FACE);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param neoRefList_array 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 * @param isInterior 변수
 * @param standardShader 변수
 * @param renderTexture 변수
 * @param ssao_idx 변수
 */
Renderer.prototype.depthRenderNeoRefListsGroupedVersion = function(gl, neoReferencesMotherAndIndices, neoBuilding, magoManager,
	isInterior, standardShader, renderTexture, ssao_idx, maxSizeToRender, lod, refMatrixIdxKey) 
{
	// render_neoRef
	var neoRefsCount = neoReferencesMotherAndIndices.neoRefsIndices.length;
	if (neoRefsCount === 0) 
	{ return; }
	
	var timeControlCounter = 0;

	var cacheKeys_count;
	var reference;
	var block_idx;
	var block;
	var current_tex_id;
	var current_vbo_id;

	var geometryDataPath = magoManager.readerWriter.geometryDataPath;

	var myBlocksList = neoReferencesMotherAndIndices.blocksList;
	if (myBlocksList === undefined)
	{ return; }

	if (myBlocksList.fileLoadState !== CODE.fileLoadState.PARSE_FINISHED) { return; }
		
	// New version. Use occlussion indices.***
	var modelReferencedGroupsList = neoReferencesMotherAndIndices.modelReferencedGroupsList;
	var modelReferencedGroupsCount = modelReferencedGroupsList.modelReferencedGroupsArray.length;
	
	for (var i=0; i<modelReferencedGroupsCount; i++)
	{
		var currentModelReferencedGroup = modelReferencedGroupsList.modelReferencedGroupsArray[i];
		
		// first, bind model geometry.
		block_idx = currentModelReferencedGroup.modelIdx;
		block = neoBuilding.motherBlocksArray[block_idx];
		if (block === undefined)
		{ continue; }

		if (maxSizeToRender && (block.radius < maxSizeToRender))
		{ continue; }
	
		if (lod == 1 && block.isSmallObj && magoManager.objectSelected !== neoReference)
		{ continue; }
		
		if (magoManager.isCameraMoving && block.isSmallObj && magoManager.objectSelected !== neoReference)
		{ continue; }
		
		// binding models geometry.
		cacheKeys_count = block.vBOVertexIdxCacheKeysContainer.vboCacheKeysArray.length;
		for (var n=0; n<cacheKeys_count; n++) // Original.***
		{
			//var mesh_array = block.viArraysContainer._meshArrays[n];
			this.vbo_vi_cacheKey_aux = block.vBOVertexIdxCacheKeysContainer.vboCacheKeysArray[n];
			if (!this.vbo_vi_cacheKey_aux.isReadyPositions(gl, magoManager.vboMemoryManager) || !this.vbo_vi_cacheKey_aux.isReadyFaces(gl, magoManager.vboMemoryManager))
			{ continue; }

			// Positions.***
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_vi_cacheKey_aux.meshVertexCacheKey);
			gl.vertexAttribPointer(standardShader.position3_loc, 3, gl.FLOAT, false, 0, 0);
			//gl.vertexAttribPointer(standardShader.attribLocationCacheObj["position"], 3, gl.FLOAT, false,0,0);

			// Indices.***
			var indicesCount;
			if (magoManager.isCameraMoving)// && !isInterior && magoManager.isCameraInsideBuilding)
			{
				if (magoManager.objectSelected === neoReference)
				{ indicesCount = this.vbo_vi_cacheKey_aux.indicesCount; }
				else
				{
					indicesCount = this.vbo_vi_cacheKey_aux.bigTrianglesIndicesCount;
					if (indicesCount > this.vbo_vi_cacheKey_aux.indicesCount)
					{ indicesCount = this.vbo_vi_cacheKey_aux.indicesCount; }
					
					//if(indicesCount === 0)
					//	indicesCount = this.vbo_vi_cacheKey_aux.indicesCount;
				}
			}
			else
			{
				//if(lod > 0)
				//{
				//	indicesCount = this.vbo_vi_cacheKey_aux.bigTrianglesIndicesCount;
				//	if(indicesCount > this.vbo_vi_cacheKey_aux.indicesCount)
				//		indicesCount = this.vbo_vi_cacheKey_aux.indicesCount;
				//}
				//else indicesCount = this.vbo_vi_cacheKey_aux.indicesCount;
				indicesCount = this.vbo_vi_cacheKey_aux.indicesCount;
			}

			// now render all references of this model.
			var visibleIndices_count = currentModelReferencedGroup.referencesIdxArray.length;
			for (var k=0; k<visibleIndices_count; k++) 
			{
				//var neoReference = neoReferencesMotherAndIndices.motherNeoRefsList[neoReferencesMotherAndIndices.currentVisibleIndices[k]]; // old.***
				var neoReference = neoReferencesMotherAndIndices.motherNeoRefsList[currentModelReferencedGroup.referencesIdxArray[k]];
				if (neoReference === undefined) 
				{ continue; }

				if (neoReference.bRendered === magoManager.renderingFase)
				{ continue; }
				
				if (neoReference.tMatrixAuxArray === undefined)
				{
					//neoReference.multiplyKeyTransformMatrix(refMatrixIdxKey, neoBuilding.geoLocationDataAux.rotMatrix);
					// we must collect all the neoReferences that has no tMatrixAuxArray and make it.***
					continue;
				}
				
				// Check if the texture is loaded.
				//if(renderTexture)
				{
					if (neoReference.texture !== undefined)
					{
						if (neoBuilding.manageNeoReferenceTexture(neoReference, magoManager) !== CODE.fileLoadState.LOADING_FINISHED)
						{ continue; }
					}
				}
				
				// Must applicate the transformMatrix of the reference object.***
				gl.uniform1i(standardShader.refMatrixType_loc, neoReference.refMatrixType);
				if (refMatrixIdxKey === undefined || refMatrixIdxKey === -1)
				{ // never enter here...
					if (neoReference.refMatrixType === 1)
					{ gl.uniform3fv(standardShader.refTranslationVec_loc, neoReference.refTranslationVec); }
					else if (neoReference.refMatrixType === 2)
					{ gl.uniformMatrix4fv(standardShader.RefTransfMatrix, false, neoReference._matrix4._floatArrays); } 
				}
				else 
				{
					if (neoReference.refMatrixType === 1)
					{ gl.uniform3fv(standardShader.refTranslationVec_loc, neoReference.refTranslationVec); }
					else if (neoReference.refMatrixType === 2)
					{ gl.uniformMatrix4fv(standardShader.RefTransfMatrix, false, neoReference.tMatrixAuxArray[refMatrixIdxKey]._floatArrays); }
				}

				if (neoReference.moveVector !== undefined) 
				{
					gl.uniform1i(standardShader.hasAditionalMov_loc, true);
					gl.uniform3fv(standardShader.aditionalMov_loc, [neoReference.moveVector.x, neoReference.moveVector.y, neoReference.moveVector.z]); //.***
				}
				else 
				{
					gl.uniform1i(standardShader.hasAditionalMov_loc, false);
					gl.uniform3fv(standardShader.aditionalMov_loc, [0.0, 0.0, 0.0]); //.***
				}

				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vbo_vi_cacheKey_aux.meshFacesCacheKey);
				gl.drawElements(gl.TRIANGLES, indicesCount, gl.UNSIGNED_SHORT, 0); // Fill.***
				//gl.drawElements(gl.LINES, this.vbo_vi_cacheKey_aux.indicesCount, gl.UNSIGNED_SHORT, 0); // Wireframe.***
				
				neoReference.bRendered = !neoReference.bRendered;
			}
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param neoRefList_array 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 * @param isInterior 변수
 * @param standardShader 변수
 * @param renderTexture 변수
 * @param ssao_idx 변수
 */
Renderer.prototype.depthRenderNeoRefListsAsimetricVersion = function(gl, neoReferencesMotherAndIndices, neoBuilding, magoManager,
	isInterior, standardShader, renderTexture, ssao_idx, maxSizeToRender, lod, refMatrixIdxKey) 
{
	// render_neoRef
	var neoRefsCount = neoReferencesMotherAndIndices.neoRefsIndices.length;
	if (neoRefsCount === 0) 
	{ return; }
	

	var cacheKeys_count;
	var reference;
	var block_idx;
	var block;
	var vbo_ByteColorsCacheKeys_Container;

	var geometryDataPath = magoManager.readerWriter.geometryDataPath;

	for (var j=0; j<1; j++) 
	{
		var myBlocksList = neoReferencesMotherAndIndices.blocksList;
		if (myBlocksList === undefined)
		{ continue; }

		if (myBlocksList.fileLoadState !== CODE.fileLoadState.PARSE_FINISHED) { continue; }
			
		// New version. Use occlussion indices.***
		//var visibleIndices_count = neoReferencesMotherAndIndices.neoRefsIndices.length; // no occludeCulling mode.***
		var visibleIndices_count = neoReferencesMotherAndIndices.currentVisibleIndices.length;

		for (var k=0; k<visibleIndices_count; k++) 
		{
			//var neoReference = neoReferencesMotherAndIndices.motherNeoRefsList[neoReferencesMotherAndIndices.neoRefsIndices[k]]; // no occludeCulling mode.***
			var neoReference = neoReferencesMotherAndIndices.motherNeoRefsList[neoReferencesMotherAndIndices.currentVisibleIndices[k]];
			if (neoReference === undefined) 
			{
				continue;
			}

			if (neoReference.bRendered === magoManager.renderingFase)
			{
				continue;
			}
			
			if (neoReference.tMatrixAuxArray === undefined)
			{
				//neoReference.multiplyKeyTransformMatrix(refMatrixIdxKey, neoBuilding.geoLocationDataAux.rotMatrix);
				// we must collect all the neoReferences that has no tMatrixAuxArray and make it.***
				continue;
			}

			block_idx = neoReference._block_idx;
			block = neoBuilding.motherBlocksArray[block_idx];

			if (block === undefined)
			{ continue; }

			if (maxSizeToRender && (block.radius < maxSizeToRender))
			{ continue; }
			
			if (magoManager.isCameraMoving && block.isSmallObj && magoManager.objectSelected !== neoReference)
			{ continue; }
			
			gl.uniform1i(standardShader.hasTexture_loc, false); //.***
			gl.uniform4fv(standardShader.color4Aux_loc, [0.0/255.0, 0.0/255.0, 0.0/255.0, 1.0]);


			cacheKeys_count = block.vBOVertexIdxCacheKeysContainer.vboCacheKeysArray.length;
			// Must applicate the transformMatrix of the reference object.***
			// Must applicate the transformMatrix of the reference object.***
			gl.uniform1i(standardShader.refMatrixType_loc, neoReference.refMatrixType);
			if (refMatrixIdxKey === undefined || refMatrixIdxKey === -1)
			{ // never enter here...
				if (neoReference.refMatrixType === 1)
				{ gl.uniform3fv(standardShader.refTranslationVec_loc, neoReference.refTranslationVec); }
				else if (neoReference.refMatrixType === 2)
				{ gl.uniformMatrix4fv(standardShader.RefTransfMatrix, false, neoReference._matrix4._floatArrays); } 
			}
			else 
			{
				if (neoReference.refMatrixType === 1)
				{ gl.uniform3fv(standardShader.refTranslationVec_loc, neoReference.refTranslationVec); }
				else if (neoReference.refMatrixType === 2)
				{ gl.uniformMatrix4fv(standardShader.RefTransfMatrix, false, neoReference.tMatrixAuxArray[refMatrixIdxKey]._floatArrays); }
			}

			if (neoReference.moveVector !== undefined) 
			{
				gl.uniform1i(standardShader.hasAditionalMov_loc, true);
				gl.uniform3fv(standardShader.aditionalMov_loc, [neoReference.moveVector.x, neoReference.moveVector.y, neoReference.moveVector.z]); //.***
			}
			else 
			{
				gl.uniform1i(standardShader.hasAditionalMov_loc, false);
				gl.uniform3fv(standardShader.aditionalMov_loc, [0.0, 0.0, 0.0]); //.***
			}

			for (var n=0; n<cacheKeys_count; n++) // Original.***
			{
				//var mesh_array = block.viArraysContainer._meshArrays[n];
				this.vbo_vi_cacheKey_aux = block.vBOVertexIdxCacheKeysContainer.vboCacheKeysArray[n];
				if (!this.vbo_vi_cacheKey_aux.isReadyPositions(gl, magoManager.vboMemoryManager))
				{ continue; }

				if (!this.vbo_vi_cacheKey_aux.isReadyFaces(gl, magoManager.vboMemoryManager))
				{ continue; }
				
				// Positions.***
				gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_vi_cacheKey_aux.meshVertexCacheKey);
				gl.vertexAttribPointer(standardShader.position3_loc, 3, gl.FLOAT, false, 0, 0);
				
				// Indices.***
				var indicesCount;
				if (magoManager.isCameraMoving)// && !isInterior && magoManager.isCameraInsideBuilding)
				{
					if (magoManager.objectSelected === neoReference)
					{ indicesCount = this.vbo_vi_cacheKey_aux.indicesCount; }
					else 
					{
						indicesCount = this.vbo_vi_cacheKey_aux.bigTrianglesIndicesCount;
						if (indicesCount > this.vbo_vi_cacheKey_aux.indicesCount)
						{ indicesCount = this.vbo_vi_cacheKey_aux.indicesCount; }
						
						//if(indicesCount === 0)
						//	indicesCount = this.vbo_vi_cacheKey_aux.indicesCount;
					}
				}
				else
				{
					indicesCount = this.vbo_vi_cacheKey_aux.indicesCount;
				}

				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vbo_vi_cacheKey_aux.meshFacesCacheKey);
				gl.drawElements(gl.TRIANGLES, indicesCount, gl.UNSIGNED_SHORT, 0); // Fill.***
				//gl.drawElements(gl.LINES, this.vbo_vi_cacheKey_aux.indicesCount, gl.UNSIGNED_SHORT, 0); // Wireframe.***
			}

			neoReference.bRendered = !neoReference.bRendered;
		}
	}
};


/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param neoRefList_array 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 * @param isInterior 변수
 * @param standardShader 변수
 */
Renderer.prototype.renderNeoRefListsAsimetricVersionColorSelection = function(gl, neoReferencesMotherAndIndices, neoBuilding, magoManager, isInterior, standardShader, maxSizeToRender, refMatrixIdxKey, glPrimitive) 
{
	// render_neoRef
	if (neoReferencesMotherAndIndices === undefined)
	{ return; }
	
	var neoRefsCount = neoReferencesMotherAndIndices.neoRefsIndices.length;
	if (neoRefsCount === 0) { return; }

	var timeControlCounter = 0;
	var geometryDataPath = magoManager.readerWriter.geometryDataPath;
	var myBlocksList = neoReferencesMotherAndIndices.blocksList;

	if (myBlocksList === undefined)
	{ return; }

	if (myBlocksList.fileLoadState === CODE.fileLoadState.LOADING_FINISHED && !magoManager.isCameraMoving)
	{ return; }

	if (myBlocksList.fileLoadState !== CODE.fileLoadState.PARSE_FINISHED) { return; }

	// New version. Use occlussion indices.***
	var visibleIndices_count = neoReferencesMotherAndIndices.currentVisibleIndices.length;

	for (var k=0; k<visibleIndices_count; k++) 
	{
		var neoReference = neoReferencesMotherAndIndices.motherNeoRefsList[neoReferencesMotherAndIndices.currentVisibleIndices[k]];
		if (neoReference.selColor4) 
		{
			//if(neoReference.color4.a < 255) // if transparent object, then skip. provisional.***
			//gl.uniform1i(standardShader.hasTexture_loc, false); //.***
			gl.uniform4fv(standardShader.color4Aux_loc, [neoReference.selColor4.r/255.0, neoReference.selColor4.g/255.0, neoReference.selColor4.b/255.0, 1.0]);
		}
		else
		{
			var hola = 0;
		}
		this.renderNeoReferenceAsimetricVersionColorSelection(gl, neoReference, neoReferencesMotherAndIndices, neoBuilding, magoManager, standardShader, maxSizeToRender, refMatrixIdxKey, glPrimitive);
	}

	//gl.enable(gl.DEPTH_TEST);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param neoRefList_array 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 * @param isInterior 변수
 * @param standardShader 변수
 */
Renderer.prototype.renderNeoReferenceAsimetricVersionColorSelection = function(gl, neoReference, neoReferencesMotherAndIndices, neoBuilding, magoManager, standardShader, maxSizeToRender, refMatrixIdxKey, glPrimitive) 
{
	if (neoReferencesMotherAndIndices === undefined)
	{ return; }

	var cacheKeys_count;
	var block_idx;
	var block;

	var myBlocksList = neoReferencesMotherAndIndices.blocksList;

	if (myBlocksList === undefined)
	{ return; }

	if (myBlocksList.fileLoadState === CODE.fileLoadState.LOADING_FINISHED && !magoManager.isCameraMoving)
	{ return; }

	if (myBlocksList.fileLoadState !== CODE.fileLoadState.PARSE_FINISHED) 
	{ return; }

	if (neoReference=== undefined) 
	{ return; }

	block_idx = neoReference._block_idx;
	block = neoBuilding.motherBlocksArray[block_idx];

	if (block === undefined)
	{ return; }

	if (maxSizeToRender && (block.radius < maxSizeToRender))
	{ return; }
	
	if (magoManager.isCameraMoving && block.isSmallObj && magoManager.objectSelected !== neoReference)
	{ return; }
	
	// End checking textures loaded.------------------------------------------------------------------------------------
	cacheKeys_count = block.vBOVertexIdxCacheKeysContainer.vboCacheKeysArray.length;
	// Must applicate the transformMatrix of the reference object.***

	gl.uniform1i(standardShader.refMatrixType_loc, neoReference.refMatrixType);
	if (refMatrixIdxKey === undefined || refMatrixIdxKey === -1)
	{ // never enter here...
		if (neoReference.refMatrixType === 1)
		{ gl.uniform3fv(standardShader.refTranslationVec_loc, neoReference.refTranslationVec); }
		else if (neoReference.refMatrixType === 2)
		{ gl.uniformMatrix4fv(standardShader.RefTransfMatrix, false, neoReference._matrix4._floatArrays); } 
	}
	else 
	{
		if (neoReference.tMatrixAuxArray === undefined)
		{
			//neoReference.multiplyKeyTransformMatrix(refMatrixIdxKey, neoBuilding.geoLocationDataAux.rotMatrix);
			// we must collect all the neoReferences that has no tMatrixAuxArray and make it.***
			return;
		}
		
		if (neoReference.refMatrixType === 1)
		{ gl.uniform3fv(standardShader.refTranslationVec_loc, neoReference.refTranslationVec); }
		else if (neoReference.refMatrixType === 2)
		{ gl.uniformMatrix4fv(standardShader.RefTransfMatrix, false, neoReference.tMatrixAuxArray[refMatrixIdxKey]._floatArrays); }

	}

	if (neoReference.moveVector !== undefined) 
	{
		gl.uniform1i(standardShader.hasAditionalMov_loc, true);
		gl.uniform3fv(standardShader.aditionalMov_loc, [neoReference.moveVector.x, neoReference.moveVector.y, neoReference.moveVector.z]); //.***
	}
	else 
	{
		gl.uniform1i(standardShader.hasAditionalMov_loc, false);
		gl.uniform3fv(standardShader.aditionalMov_loc, [0.0, 0.0, 0.0]); //.***
	}

	for (var n=0; n<cacheKeys_count; n++) // Original.***
	{
		//var mesh_array = block.viArraysContainer._meshArrays[n];
		this.vbo_vi_cacheKey_aux = block.vBOVertexIdxCacheKeysContainer.vboCacheKeysArray[n];

		if (!this.vbo_vi_cacheKey_aux.isReadyPositions(gl, magoManager.vboMemoryManager))
		{ continue; }
		
		if (!this.vbo_vi_cacheKey_aux.isReadyFaces(gl, magoManager.vboMemoryManager))
		{ continue; }

		// Positions.***
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_vi_cacheKey_aux.meshVertexCacheKey);
		gl.vertexAttribPointer(standardShader.position3_loc, 3, gl.FLOAT, false, 0, 0);

		// Indices.***
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vbo_vi_cacheKey_aux.meshFacesCacheKey);
		gl.drawElements(glPrimitive, this.vbo_vi_cacheKey_aux.indicesCount, gl.UNSIGNED_SHORT, 0); 
	}
};



/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param neoRefList_array 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 * @param isInterior 변수
 * @param standardShader 변수
 * @param renderTexture 변수
 * @param ssao_idx 변수
 */
Renderer.prototype.renderNeoRefListsColorSelection = function(gl, neoRefList_array, neoBuilding, magoManager, isInterior, standardShader, renderTexture, ssao_idx) 
{
	// render_neoRef
	var neoRefLists_count = neoRefList_array.length;
	if (neoRefLists_count === 0) { return; }

	this.dateSC = new Date();
	this.startTimeSC = this.dateSC.getTime();
	this.currentTimeSC;
	var secondsUsed;
	var timeControlCounter = 0;

	gl.enable(gl.DEPTH_TEST);
	//gl.disable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.depthRange(0, 1);
	gl.enable(gl.CULL_FACE);
	//gl.disable(gl.CULL_FACE);

	//if(ssao_idx === 0)
	//	gl.disable(gl.CULL_FACE);

	var cacheKeys_count;
	var reference;
	var block_idx;
	var block;
	var ifc_entity;
	var vbo_ByteColorsCacheKeys_Container;
	var current_tex_id;

	for (var j=0; j<neoRefLists_count; j++) 
	{

		var neoRefList = neoRefList_array[j];
		var myBlocksList = neoRefList_array[j].blocksList;

		// New version. Use occlussion indices.***
		var visibleIndices_count = neoRefList._currentVisibleIndices.length;

		//visibleIndices_count = neoRefList.neoRefs_Array.length; // TEST******************************
		for (var k=0; k<visibleIndices_count; k++) 
		{
			//if(magoManager.isCameraMoving && isInterior && timeControlCounter === 0)
			//			if(magoManager.isCameraMoving && timeControlCounter === 0){
			//			}
			var neoReference = neoRefList.neoRefs_Array[neoRefList._currentVisibleIndices[k]]; // good.***
			//var neoReference = neoRefList.neoRefs_Array[k]; // TEST.***
			if (!neoReference || neoReference=== undefined) 
			{
				continue;
			}

			block_idx = neoReference._block_idx;

			if (block_idx >= myBlocksList.blocksArray.length) 
			{
				continue;
			}
			block = myBlocksList.getBlock(block_idx);

			if (neoReference.selColor4) 
			{
				gl.uniform4fv(standardShader.color4Aux_loc, [neoReference.selColor4.r/255.0, neoReference.selColor4.g/255.0, neoReference.selColor4.b/255.0, neoReference.selColor4.a/255.0]);
			}
			else { continue; } // never enter here.***
			// End checking textures loaded.------------------------------------------------------------------------------------

			// ifc_space = 27, ifc_window = 26, ifc_plate = 14
			if (block !== undefined)
			{

				cacheKeys_count = block.vBOVertexIdxCacheKeysContainer.vboCacheKeysArray.length;
				// Must applicate the transformMatrix of the reference object.***
				gl.uniformMatrix4fv(standardShader.RefTransfMatrix, false, neoReference._matrix4._floatArrays);

				if (neoReference.moveVector !== undefined) 
				{
					gl.uniform1i(standardShader.hasAditionalMov_loc, true);
					gl.uniform3fv(standardShader.aditionalMov_loc, [neoReference.moveVector.x, neoReference.moveVector.y, neoReference.moveVector.z]); //.***
				}
				else 
				{
					gl.uniform1i(standardShader.hasAditionalMov_loc, false);
					gl.uniform3fv(standardShader.aditionalMov_loc, [0.0, 0.0, 0.0]); //.***
				}

				// for workers.**************************************************************************************************************************
				//vbo_ByteColorsCacheKeys_Container = neoBuilding._VBO_ByteColorsCacheKeysContainer_List[reference._VBO_ByteColorsCacheKeys_Container_idx];
				// End for workers.----------------------------------------------------------------------------------------------------------------------
				for (var n=0; n<cacheKeys_count; n++) // Original.***
				{
					//var mesh_array = block.viArraysContainer._meshArrays[n];
					this.vbo_vi_cacheKey_aux = block.vBOVertexIdxCacheKeysContainer.vboCacheKeysArray[n];

					if (!this.vbo_vi_cacheKey_aux.isReadyPositions(gl, magoManager.vboMemoryManager))
					{ continue; }

					if (!this.vbo_vi_cacheKey_aux.isReadyFaces(gl, magoManager.vboMemoryManager))
					{ continue; }

					// Positions.***
					gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_vi_cacheKey_aux.meshVertexCacheKey);
					gl.vertexAttribPointer(standardShader.position3_loc, 3, gl.FLOAT, false, 0, 0);

					// Indices.***
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vbo_vi_cacheKey_aux.meshFacesCacheKey);
					gl.drawElements(gl.TRIANGLES, this.vbo_vi_cacheKey_aux.indicesCount, gl.UNSIGNED_SHORT, 0); // Fill.***
					//gl.drawElements(gl.LINES, this.vbo_vi_cacheKey_aux.indicesCount, gl.UNSIGNED_SHORT, 0); // Wireframe.***

				}
			}

			timeControlCounter++;
			if (timeControlCounter > 20) { timeControlCounter = 0; }
		}
	}

	gl.enable(gl.DEPTH_TEST);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param neoRefList_array 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 * @param isInterior 변수
 * @param standardShader 변수
 * @param renderTexture 변수
 * @param ssao_idx 변수
 */
Renderer.prototype.renderLodBuilding = function(gl, lodBuilding, magoManager, shader, ssao_idx, renderTexture) 
{
	if (lodBuilding.vbo_vicks_container.vboCacheKeysArray.length === 0) 
	{
		return;
	}
	gl.frontFace(gl.CCW);
	// ssao_idx = -1 -> pickingMode.***
	// ssao_idx = 0 -> depth.***
	// ssao_idx = 1 -> ssao.***

	if (ssao_idx === 0) // depth.***
	{
		// 1) Position.*********************************************
		var vbo_vicky = lodBuilding.vbo_vicks_container.vboCacheKeysArray[0]; // there are only one.***
		if (!vbo_vicky.isReadyPositions(gl, magoManager.vboMemoryManager))
		{ return; }

		var vertices_count = vbo_vicky.vertexCount;
		if (vertices_count === 0) 
		{
			return;
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshVertexCacheKey);
		gl.vertexAttribPointer(shader.position3_loc, 3, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, vertices_count);
	}
	else if (ssao_idx === 1) // ssao.***
	{
		var vbo_vicky = lodBuilding.vbo_vicks_container.vboCacheKeysArray[0]; // there are only one.***
		var vertices_count = vbo_vicky.vertexCount;

		if (vertices_count === 0) 
		{
			return;
		}
		
		if (!vbo_vicky.isReadyPositions(gl, magoManager.vboMemoryManager))
		{ return; }
		
		if (!vbo_vicky.isReadyNormals(gl, magoManager.vboMemoryManager))
		{ return; }
		
		if (!vbo_vicky.isReadyColors(gl, magoManager.vboMemoryManager))
		{ return; }
		
		// 4) Texcoord.*********************************************
		if (renderTexture)
		{
			if (!vbo_vicky.isReadyTexCoords(gl, magoManager.vboMemoryManager))
			{ return; }
		}
		

		gl.disableVertexAttribArray(shader.color4_loc);

		gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshVertexCacheKey);
		gl.vertexAttribPointer(shader.position3_loc, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshNormalCacheKey);
		gl.vertexAttribPointer(shader.normal3_loc, 3, gl.BYTE, true, 0, 0);

		if (vbo_vicky.meshColorCacheKey !== undefined )
		{
			gl.enableVertexAttribArray(shader.color4_loc);
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshColorCacheKey);
			gl.vertexAttribPointer(shader.color4_loc, 4, gl.UNSIGNED_BYTE, true, 0, 0);
		}
		
		if (renderTexture && vbo_vicky.meshTexcoordsCacheKey)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshTexcoordsCacheKey);
			gl.vertexAttribPointer(shader.texCoord2_loc, 2, gl.FLOAT, false, 0, 0);
		}

		gl.drawArrays(gl.TRIANGLES, 0, vertices_count);
	}
	
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param neoRefList_array 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 * @param isInterior 변수
 * @param standardShader 변수
 * @param renderTexture 변수
 * @param ssao_idx 변수
 */
Renderer.prototype.renderLodBuildingColorSelection = function(gl, lodBuilding, magoManager, shader, ssao_idx, isHighLighted) 
{
	if (lodBuilding.vbo_vicks_container.vboCacheKeysArray.length === 0) 
	{
		return;
	}
	gl.frontFace(gl.CCW);

	// 1) Position.*********************************************
	var vbo_vicky = lodBuilding.vbo_vicks_container.vboCacheKeysArray[0]; // there are only one.***
	if (!vbo_vicky.isReadyPositions(gl, magoManager.vboMemoryManager))
	{ return; }

	var vertices_count = vbo_vicky.vertexCount;
	if (vertices_count === 0) 
	{
		return;
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshVertexCacheKey);
	gl.vertexAttribPointer(shader.position3_loc, 3, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, vertices_count);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param neoRefList_array 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 * @param isInterior 변수
 * @param standardShader 변수
 * @param renderTexture 변수
 * @param ssao_idx 변수
 */
Renderer.prototype.renderTriPolyhedron = function(gl, lodBuilding, magoManager, shader, ssao_idx, isHighLighted) 
{
	if (lodBuilding.vbo_vicks_container.vboCacheKeysArray.length === 0) 
	{
		return;
	}
	gl.frontFace(gl.CCW);
	// ssao_idx = -1 -> pickingMode.***
	// ssao_idx = 0 -> depth.***
	// ssao_idx = 1 -> ssao.***

	if (ssao_idx === 0) // depth.***
	{
		// 1) Position.*********************************************
		var vbo_vicky = lodBuilding.vbo_vicks_container.vboCacheKeysArray[0]; // there are only one.***
		if (!vbo_vicky.isReadyPositions(gl, magoManager.vboMemoryManager))
		{ return; }

		var vertices_count = vbo_vicky.vertexCount;
		if (vertices_count === 0) 
		{
			return;
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshVertexCacheKey);
		gl.vertexAttribPointer(shader.position3_loc, 3, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, vertices_count);
	}
	else if (ssao_idx === 1) // ssao.***
	{
		var vbo_vicky = lodBuilding.vbo_vicks_container.vboCacheKeysArray[0]; // there are only one.***
		var vertices_count = vbo_vicky.vertexCount;

		if (vertices_count === 0) 
		{
			return;
		}

		if (isHighLighted && isHighLighted === true)
		{
			var hola = 0;
		}

		if (!vbo_vicky.isReadyPositions(gl, magoManager.vboMemoryManager))
		{ return; }

		if (!vbo_vicky.isReadyNormals(gl, magoManager.vboMemoryManager))
		{ return; }
		
		if (!vbo_vicky.isReadyColors(gl, magoManager.vboMemoryManager))
		{ return; }

		gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshVertexCacheKey);
		gl.vertexAttribPointer(shader.position3_loc, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshNormalCacheKey);
		gl.vertexAttribPointer(shader.normal3_loc, 3, gl.BYTE, true, 0, 0);

		//gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshColorCacheKey);
		//gl.vertexAttribPointer(shader.color4_loc, 4, gl.UNSIGNED_BYTE, true, 0, 0);

		//gl.drawArrays(gl.TRIANGLES, 0, vertices_count);
		gl.drawArrays(gl.LINE_STRIP, 0, vertices_count);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param neoRefList_array 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 * @param isInterior 변수
 * @param standardShader 변수
 * @param renderTexture 변수
 * @param ssao_idx 변수
 */
Renderer.prototype.renderLego = function(gl, lego, magoManager, shader, ssao_idx) 
{
	if (lego.vbo_vicks_container.vboCacheKeysArray.length === 0) 
	{
		return;
	}

	// ssao_idx = -1 -> pickingMode.***
	// ssao_idx = 0 -> depth.***
	// ssao_idx = 1 -> ssao.***

	if (ssao_idx === 0) // depth.***
	{
		if (!vbo_vicky.isReadyPositions(gl, magoManager.vboMemoryManager))
		{ return; }

		var vertices_count = vbo_vicky.vertexCount;
		if (vertices_count === 0) 
		{
			return;
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshVertexCacheKey);
		gl.vertexAttribPointer(shader.position3_loc, 3, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, vertices_count);
	}
	else if (ssao_idx === 1) // ssao.***
	{
		var vbo_vicky = lego.vbo_vicks_container.vboCacheKeysArray[0]; // there are only one.***
		var vertices_count = vbo_vicky.vertexCount;

		if (vertices_count === 0) 
		{
			return;
		}

		if (!vbo_vicky.isReadyPositions(gl, magoManager.vboMemoryManager))
		{ return; }

		if (!vbo_vicky.isReadyNormals(gl, magoManager.vboMemoryManager))
		{ return; }
		
		if (!vbo_vicky.isReadyColors(gl, magoManager.vboMemoryManager))
		{ return; }

		gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshVertexCacheKey);
		gl.vertexAttribPointer(shader.position3_loc, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshNormalCacheKey);
		gl.vertexAttribPointer(shader.normal3_loc, 3, gl.BYTE, true, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshColorCacheKey);
		gl.vertexAttribPointer(shader.color4_loc, 4, gl.UNSIGNED_BYTE, true, 0, 0);

		gl.drawArrays(gl.TRIANGLES, 0, vertices_count);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 * @param imageLod 변수
 * @param shader 변수
 */
Renderer.prototype.renderNeoSimpleBuildingPostFxShader = function(gl, neoBuilding, magoManager, imageLod, shader) 
{
	var simpBuild = neoBuilding.neoSimpleBuilding;
	//var simpObjs_count = simpBuildV1._simpleObjects_array.length;
	var shadersManager = magoManager.shadersManager;

	// check if has vbos.***
	if (simpBuild.vbo_vicks_container.vboCacheKeysArray.length === 0) 
	{
		return;
	}

	if (imageLod === undefined) { imageLod = 3; } // The lowest lod.***

	//if(magoManager.isCameraMoving)
	//	imageLod = 3; // The lowest lod.***
	var shaderProgram = shader.program;

	gl.uniform3fv(shader.buildingPosHIGH_loc, neoBuilding.buildingPositionHIGH);
	gl.uniform3fv(shader.buildingPosLOW_loc, neoBuilding.buildingPositionLOW);

	//gl.activeTexture(gl.TEXTURE0);
	// if we are rendering in depth buffer, then no bind texture.***

	var skinTexture = simpBuild.texturesArray[0]; // provisionally take the 1rst.***

	gl.activeTexture(gl.TEXTURE2); // for diffuse texture.***
	if (imageLod === 3) { gl.bindTexture(gl.TEXTURE_2D, skinTexture.textureId); } // embedded image.***
	else if (imageLod === 0) { gl.bindTexture(gl.TEXTURE_2D, skinTexture.textureId); } // biggest image.***
	else if (imageLod === -1) 
	{
		// dont bind texture.***
	}

	// now, check accesors.***
	var accesorsCount = simpBuild.accesorsArray.length;
	var stride = 0;
	for (var i=0; i<accesorsCount; i++) 
	{
		var accesor = simpBuild.accesorsArray[i];

		var normalize_data = false;
		//var dataType = undefined;

		// Use accesor.data_ytpe. no use dataType.***
		if (accesor.data_ytpe === 5120) 
		{
			//dataType = gl.BYTE;
			normalize_data = true;
		}
		else if (accesor.data_ytpe === 5121) 
		{
			//dataType = gl.UNSIGNED_BYTE;
			normalize_data = true;
		}
		else if (accesor.data_ytpe === 5122) 
		{
			//dataType = gl.SHORT;
			normalize_data = true;
		}
		else if (accesor.data_ytpe === 5123) 
		{
			//dataType = gl.UNSIGNED_SHORT;
			normalize_data = true;
		}
		else if (accesor.data_ytpe === 5126) 
		{
			//dataType = gl.FLOAT;
			normalize_data = false;
		}

		// 0= position, 1= normal, 2= color, 3= texcoord.***
		if (accesor.accesor_type === 0) // position.***
		{
			gl.enableVertexAttribArray(shader.position3_loc);
			//gl.vertexAttribPointer(shader.position3_loc, accesor.dimension, dataType, normalize_data, accesor.stride, accesor.buffer_start); // old.***
			gl.vertexAttribPointer(shader.position3_loc, accesor.dimension, accesor.data_ytpe, normalize_data, accesor.stride, accesor.buffer_start);
			stride = accesor.stride;
		}
		else if (accesor.accesor_type === 1) // normal.***
		{
			gl.enableVertexAttribArray(shader.normal3_loc);
			//gl.vertexAttribPointer(shader.normal3_loc, accesor.dimension, dataType, normalize_data, accesor.stride, accesor.buffer_start); // old.***
			gl.vertexAttribPointer(shader.normal3_loc, accesor.dimension, accesor.data_ytpe, normalize_data, accesor.stride, accesor.buffer_start);
		}
		else if (accesor.accesor_type === 3) // texcoord.***
		{
			if (imageLod !== -1) 
			{
				gl.enableVertexAttribArray(shader.texCoord2_loc);
				//gl.vertexAttribPointer(shader.texCoord2_loc, accesor.dimension, dataType, normalize_data, accesor.stride, accesor.buffer_start); // old.***
				gl.vertexAttribPointer(shader.texCoord2_loc, accesor.dimension, accesor.data_ytpe, normalize_data, accesor.stride, accesor.buffer_start);
			}
		}
	}

	var vbo_vicky = simpBuild.vbo_vicks_container.vboCacheKeysArray[0];
	if (vbo_vicky.meshVertexCacheKey === undefined) 
	{
		if (vbo_vicky.buffer.dataArray !== undefined) //dataArrayByteLength > 0
		{
			vbo_vicky.meshVertexCacheKey = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshVertexCacheKey);
			gl.bufferData(gl.ARRAY_BUFFER, vbo_vicky.buffer.dataArray, gl.STATIC_DRAW);

			vbo_vicky.buffer.dataArray = undefined;
		}
	}

	//	//for(var i=0; i<simpObjs_count; i++)
	//	{
	//		//for(var k=0; k<vt_arraysCacheKeys_arrays_count; k++)
	//		{
	var vertices_count = vbo_vicky.buffer.dataArrayByteLength / stride;
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshVertexCacheKey);
	//gl.vertexAttribPointer(shader.position3_loc, 3, gl.FLOAT, false,20,0);
	//if(imageLod !== -1)gl.vertexAttribPointer(shader.texCoord2_loc, 2, gl.UNSIGNED_SHORT, true,20,12);
	//gl.vertexAttribPointer(shader.normal3_loc, 3, gl.BYTE, true,20,16);

	gl.drawArrays(gl.TRIANGLES, 0, vertices_count);
//		}
//	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 * @param shader 변수
 */
Renderer.prototype.renderNeoSimpleBuildingDepthShader = function(gl, neoBuilding, magoManager, shader) 
{
	var simpBuild = neoBuilding.neoSimpleBuilding;
	//var simpObjs_count = simpBuildV1._simpleObjects_array.length;
	var shadersManager = magoManager.shadersManager;

	// check if has vbos.***
	if (simpBuild.vbo_vicks_container.vboCacheKeysArray.length === 0) 
	{
		return;
	}

	var shaderProgram = shader.program;

	gl.uniform3fv(shader.buildingPosHIGH_loc, neoBuilding.buildingPositionHIGH);
	gl.uniform3fv(shader.buildingPosLOW_loc, neoBuilding.buildingPositionLOW);

	//gl.activeTexture(gl.TEXTURE0);
	// if we are rendering in depth buffer, then no bind texture.***

	//gl.activeTexture(gl.TEXTURE2); // for diffuse texture.***

	// now, check accesors.***
	var accesorsCount = simpBuild.accesorsArray.length;
	var stride = 0;
	for (var i=0; i<accesorsCount; i++) 
	{
		var accesor = simpBuild.accesorsArray[i];

		var normalize_data = false;
		//var dataType = undefined;

		// Use accesor.data_ytpe. no use dataType.***
		if (accesor.data_ytpe === 5120) 
		{
			//dataType = gl.BYTE;
			normalize_data = true;
		}
		else if (accesor.data_ytpe === 5121) 
		{
			//dataType = gl.UNSIGNED_BYTE;
			normalize_data = true;
		}
		else if (accesor.data_ytpe === 5122) 
		{
			//dataType = gl.SHORT;
			normalize_data = true;
		}
		else if (accesor.data_ytpe === 5123) 
		{
			//dataType = gl.UNSIGNED_SHORT;
			normalize_data = true;
		}
		else if (accesor.data_ytpe === 5126) 
		{
			//dataType = gl.FLOAT;
			normalize_data = false;
		}

		// 0= position, 1= normal, 2= color, 3= texcoord.***
		if (accesor.accesor_type === 0) // position.***
		{
			gl.enableVertexAttribArray(shader.position3_loc);
			//gl.vertexAttribPointer(shader.position3_loc, accesor.dimension, dataType, normalize_data, accesor.stride, accesor.buffer_start); // old.***
			gl.vertexAttribPointer(shader.position3_loc, accesor.dimension, accesor.data_ytpe, normalize_data, accesor.stride, accesor.buffer_start);
			stride = accesor.stride;
		}
	}

	var vbo_vicky = simpBuild.vbo_vicks_container.vboCacheKeysArray[0];
	if (vbo_vicky.meshVertexCacheKey === undefined) 
	{
		if (vbo_vicky.buffer.dataArray !== undefined) //dataArrayByteLength > 0
		{
			vbo_vicky.meshVertexCacheKey = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshVertexCacheKey);
			gl.bufferData(gl.ARRAY_BUFFER, vbo_vicky.buffer.dataArray, gl.STATIC_DRAW);

			vbo_vicky.buffer.dataArray = undefined;
		}
	}

	//	//for(var i=0; i<simpObjs_count; i++)
	//	{
	//		//for(var k=0; k<vt_arraysCacheKeys_arrays_count; k++)
	//		{
	var vertices_count = vbo_vicky.buffer.dataArrayByteLength / stride;
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vicky.meshVertexCacheKey);
	gl.drawArrays(gl.TRIANGLES, 0, vertices_count);
//		}
//	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param BR_Project 변수
 * @param magoManager 변수
 * @param imageLod 변수
 * @param shader 변수
 */
Renderer.prototype.renderSimpleBuildingV1PostFxShader = function(gl, BR_Project, magoManager, imageLod, shader) 
{
	var simpBuildV1 = BR_Project._simpleBuilding_v1;
	//var simpObjs_count = simpBuildV1._simpleObjects_array.length;
	var shadersManager = magoManager.shadersManager;

	if (simpBuildV1._simpleObjects_array.length === 0) 
	{
		return;
	}

	if (imageLod === undefined) { imageLod = 3; } // The lowest lod.***

	//if(magoManager.isCameraMoving)
	//	imageLod = 3; // The lowest lod.***
	var shaderProgram = shader.program;

	gl.uniform3fv(shader.buildingPosHIGH_loc, BR_Project.buildingPositionHIGH);
	gl.uniform3fv(shader.buildingPosLOW_loc, BR_Project.buildingPositionLOW);

	//gl.activeTexture(gl.TEXTURE0);
	// if we are rendering in depth buffer, then no bind texture.***


	gl.activeTexture(gl.TEXTURE2); // for diffuse texture.***
	if (imageLod === 3) { gl.bindTexture(gl.TEXTURE_2D, simpBuildV1._simpleBuildingTexture); } // embedded image.***
	else if (imageLod === 0) { gl.bindTexture(gl.TEXTURE_2D, simpBuildV1._texture_0); } // biggest image.***
	else if (imageLod === -1) 
	{
		// dont bind texture.***
	}

	//gl.uniform1i(shaderProgram.samplerUniform, 0);

	// single interleaved buffer mode.************************************************************************************
	//for(var i=0; i<simpObjs_count; i++)
	//	{

	this.simpObj_scratch = simpBuildV1._simpleObjects_array[0];

	//var vt_arraysCacheKeys_arrays_count = this.simpObj_scratch._vtCacheKeys_container._vtArrays_cacheKeys_array.length;
	//for(var k=0; k<vt_arraysCacheKeys_arrays_count; k++)
	//		{
	var vertices_count = this.simpObj_scratch._vtCacheKeys_container._vtArrays_cacheKeys_array[0]._vertices_count;
	gl.bindBuffer(gl.ARRAY_BUFFER, this.simpObj_scratch._vtCacheKeys_container._vtArrays_cacheKeys_array[0]._verticesArray_cacheKey);
	gl.vertexAttribPointer(shader.position3_loc, 3, gl.FLOAT, false, 20, 0);
	if (imageLod !== -1){ gl.vertexAttribPointer(shader.texCoord2_loc, 2, gl.UNSIGNED_SHORT, true, 20, 12); }
	gl.vertexAttribPointer(shader.normal3_loc, 3, gl.BYTE, true, 20, 16);

	gl.drawArrays(gl.TRIANGLES, 0, vertices_count);
//		}
//	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param pCloudProject 변수
 * @param modelViewProjRelToEye_matrix 변수
 * @param encodedCamPosMC_High 변수
 * @param encodedCamPosMC_Low 변수
 * @param magoManager 변수
 */
Renderer.prototype.renderPCloudProject = function(gl, pCloudProject, modelViewProjRelToEye_matrix, encodedCamPosMC_High, encodedCamPosMC_Low, magoManager) 
{
	var shadersManager = magoManager.shadersManager;

	//if(simpBuildV1._simpleObjects_array.length === 0)
	//{
	//	return;
	//}

	// Test using f4d_shaderManager.************************
	var shader = shadersManager.getMagoShader(6);
	var shaderProgram = shader.SHADER_PROGRAM;

	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.uniform3fv(shader._BuildingPosHIGH, pCloudProject._pCloudPositionHIGH);
	gl.uniform3fv(shader._BuildingPosLOW, pCloudProject._pCloudPositionLOW);

	// single interleaved buffer mode.************************************************************************************
	var vbo_datas_count = pCloudProject.vbo_datas.vboCacheKeysArray.length;
	for (var i=0; i<vbo_datas_count; i++) 
	{
		var vbo_data = pCloudProject.vbo_datas.vboCacheKeysArray[i];

		//for(var k=0; k<vt_arraysCacheKeys_arrays_count; k++)
		//		{
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo_data.meshVertexCacheKey);
		//gl.vertexAttribPointer(shader._position, 3, gl.FLOAT, false,19,0); // pos(4*3) + nor(1*3) + col(1*4) = 12+3+4 = 19.***
		gl.vertexAttribPointer(shader._position, 3, gl.FLOAT, false, 28, 0); // pos(4*3) + nor(4*3) + col(1*4) = 12+12+4 = 28.***
		gl.vertexAttribPointer(shader._color, 3, gl.UNSIGNED_BYTE, true, 28, 24);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo_data.meshFacesCacheKey);
		gl.drawElements(gl.TRIANGLES, vbo_data.indicesCount, gl.UNSIGNED_SHORT, 0);

		//this.dateSC = new Date();
		//this.currentTimeSC = this.dateSC.getTime();
		//magoManager.renderingTime += this.currentTimeSC - this.startTimeSC;
		//		}
	}
};

'use strict';

/**
 * ??
 * @class SceneState
 */
var SceneState = function() 
{
	if (!(this instanceof SceneState)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.gl;

	// this contains the model matrices and camera position.***
	this.modelViewProjRelToEyeMatrix = new Matrix4(); // created as identity matrix.***
	this.modelViewRelToEyeMatrix = new Matrix4(); // created as identity matrix.***
	this.modelViewRelToEyeMatrixInv = new Matrix4(); // created as identity matrix.***
	this.modelViewMatrix = new Matrix4(); // created as identity matrix.***
	this.modelViewMatrixInv = new Matrix4(); // created as identity matrix.***
	this.projectionMatrix = new Matrix4(); // created as identity matrix.***
	this.normalMatrix4 = new Matrix4(); // created as identity matrix.***
	this.identityMatrix4 = new Matrix4(); // created as identity matrix.***

	this.encodedCamPosHigh = new Float32Array([0.0, 0.0, 0.0]);
	this.encodedCamPosLow = new Float32Array([0.0, 0.0, 0.0]);
	
	this.camera = new Camera();
	this.drawingBufferWidth = new Int32Array([1000]);
	this.drawingBufferHeight = new Int32Array([1000]);
	
	this.bMust = false;
	
	// webWorldWind vars.***
	this.dc;
	
	// insertIssue states.***
	this.insertIssueState = 0; // 0 = no started. 1 = started.***
	
	// provisionally.***
	this.textureFlipYAxis = false;
};

'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class Selection
 */
var Selection = function() 
{
	if (!(this instanceof Selection)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.drawing_height;
	this.drawing_width;
	this.GAIA_selectFrameBuffer;
	this.GAIA_selectRenderBuffer;
	this.GAIA_selectRttTexture;
	
	this.currentByteColorPicked = new Uint8Array(4);
	this.currentSelectedObj_idx = -1;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param drawingBufferWidth 변수
 * @param drawingBufferHeight 변수
 */
Selection.prototype.init = function(gl, drawingBufferWidth, drawingBufferHeight) 
{
	// http://www.webglacademy.com/courses.php?courses=0|1|20|2|3|4|23|5|6|7|10#10
	this.drawing_height = drawingBufferHeight;
	this.drawing_width = drawingBufferWidth;
	//this.lastCapturedColourMap = new Uint8Array(this.drawing_width * this.drawing_height * 4);
	this.GAIA_selectFrameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.GAIA_selectFrameBuffer);
	
	this.GAIA_selectRenderBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, this.GAIA_selectRenderBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.drawing_width, this.drawing_height);

	this.GAIA_selectRttTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.GAIA_selectRttTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.drawing_width, this.drawing_height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.GAIA_selectRttTexture, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.GAIA_selectRenderBuffer);
	
	// Finally...
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};
'use strict';

/**
 * 버퍼 안의 데이터를 어떻게 읽어야 할지 키가 되는 객체
 * 
 * @alias Accessor
 * @class Accessor
 */
var Accessor = function () 
{

	if (!(this instanceof Accessor)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.bufferId;
	// 0= position, 1= normal, 2= color, 3= texcoord.***
	this.accesorType;
	this.bufferStart;
	// 버퍼의 시작 시점
	this.stride;
	// character, int 등
	this.dataType;
	// 2차원, 3차원
	this.dimension;

	// 데이터가 포함되어 있는 x,y,z의 한계를 바운드라고 한다. 바운드 좌표
	this.minX = 0.0;
	this.minY = 0.0;
	this.minZ = 0.0;
	this.maxX = 0.0;
	this.maxY = 0.0;
	this.maxZ = 0.0;
};

'use strict';

/**
 * 블럭 모델
 * @class Block
 */
var Block = function() 
{
	if (!(this instanceof Block)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	// This has "VertexIdxVBOArraysContainer" because the "indices" cannot to be greater than 65000, because indices are short type.***
	this.vBOVertexIdxCacheKeysContainer = new VBOVertexIdxCacheKeysContainer(); // Change this for "vbo_VertexIdx_CacheKeys_Container__idx".***
	this.mIFCEntityType = -1;
	this.isSmallObj = false;
	this.radius = 10;
	this.vertexCount = 0; // only for test.*** delete this.***

	this.lego; // legoBlock.***
};

/**
 * 블럭이 가지는 데이터 삭제
 * @returns block
 */
Block.prototype.deleteObjects = function(gl, vboMemManager) 
{

	this.vBOVertexIdxCacheKeysContainer.deleteGlObjects(gl, vboMemManager);
	this.vBOVertexIdxCacheKeysContainer = undefined;
	this.mIFCEntityType = undefined;
	this.isSmallObj = undefined;
	this.radius = undefined;
	this.vertexCount = undefined; // only for test.*** delete this.***

	if (this.lego) { this.lego.deleteGlObjects(gl); }

	this.lego = undefined;
};

/**
 * 블록 목록
 * @class BlocksList
 */
var BlocksList = function() 
{
	if (!(this instanceof BlocksList)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.name = "";
	this.blocksArray;
	// 0 = no started to load. 1 = started loading. 2 = finished loading. 3 = parse started. 4 = parse finished.***
	this.fileLoadState = CODE.fileLoadState.READY;
	this.dataArraybuffer; // file loaded data, that is no parsed yet.***
};

/**
 * 새 블록 생성
 * @returns block
 */
BlocksList.prototype.newBlock = function() 
{
	if (this.blocksArray === undefined) { this.blocksArray = []; }

	var block = new Block();
	this.blocksArray.push(block);
	return block;
};

/**
 * 블록 획득
 * @param idx 변수
 * @returns block
 */
BlocksList.prototype.getBlock = function(idx) 
{
	if (this.blocksArray === undefined) { return null; }

	if (idx >= 0 && idx < this.blocksArray.length) 
	{
		return this.blocksArray[idx];
	}
	return null;
};

/**
 * 블록을 삭제
 * @param idx 변수
 * @returns block
 */
BlocksList.prototype.deleteGlObjects = function(gl, vboMemManager) 
{
	if (this.blocksArray === undefined) { return; }

	for (var i = 0, blocksCount = this.blocksArray.length; i < blocksCount; i++ ) 
	{
		var block = this.blocksArray[i];
		block.vBOVertexIdxCacheKeysContainer.deleteGlObjects(gl, vboMemManager);
		block.vBOVertexIdxCacheKeysContainer = undefined; // Change this for "vbo_VertexIdx_CacheKeys_Container__idx".***
		block.mIFCEntityType = undefined;
		block.isSmallObj = undefined;
		block.radius = undefined;
		block.vertexCount = undefined; // only for test.*** delete this.***
		if (block.lego) 
		{
			block.lego.vbo_vicks_container.deleteGlObjects(gl, vboMemManager);
			block.lego.vbo_vicks_container = undefined;
		}
		block.lego = undefined; // legoBlock.***
		this.blocksArray[i] = undefined;
	}
	this.blocksArray = undefined;
	this.name = undefined;
	this.fileLoadState = undefined;
	this.dataArraybuffer = undefined; // file loaded data, that is no parsed yet.***
};


/**
 * 블록리스트 버퍼를 파싱(비대칭적)
 * This function parses the geometry data from binary arrayBuffer.
 * 
 * @param {arrayBuffer} arrayBuffer Binary data to parse.
 * @param {ReadWriter} readWriter Helper to read inside of the arrayBuffer.
 * @param {Array} motherBlocksArray Global blocks array.
 */
BlocksList.prototype.parseBlocksList = function(arrayBuffer, readWriter, motherBlocksArray, magoManager) 
{
	this.fileLoadState = CODE.fileLoadState.PARSE_STARTED;
	var bytesReaded = 0;
	var blocksCount = readWriter.readUInt32(arrayBuffer, bytesReaded, bytesReaded + 4);
	bytesReaded += 4;
	var startBuff, endBuff;
	var posByteSize, norByteSize, idxByteSize;
	var vboMemManager = magoManager.vboMemoryManager;
	var classifiedPosByteSize = 0, classifiedNorByteSize = 0, classifiedIdxByteSize = 0;
	var gl = magoManager.sceneState.gl;
	var succesfullyGpuDataBinded = true;

	for ( var i = 0; i< blocksCount; i++ ) 
	{
		var blockIdx = readWriter.readInt32(arrayBuffer, bytesReaded, bytesReaded+4);
		bytesReaded += 4;

		// Check if block exist.
		if (motherBlocksArray[blockIdx]) 
		{
			// The block exists, then read data but no create a new block.
			bytesReaded += 4 * 6; // boundingBox.
			// Read vbo datas (indices cannot superate 65535 value).
			var vboDatasCount = readWriter.readInt32(arrayBuffer, bytesReaded, bytesReaded+4);
			bytesReaded += 4;
			for ( var j = 0; j < vboDatasCount; j++ ) 
			{
				// 1) Positions array.
				var vertexCount = readWriter.readUInt32(arrayBuffer, bytesReaded, bytesReaded+4);
				bytesReaded += 4;
				var verticesFloatValuesCount = vertexCount * 3;
				startBuff = bytesReaded;
				endBuff = bytesReaded + 4 * verticesFloatValuesCount;
				bytesReaded = bytesReaded + 4 * verticesFloatValuesCount; // updating data.***

				// 2) Normals.
				vertexCount = readWriter.readUInt32(arrayBuffer, bytesReaded, bytesReaded+4);
				bytesReaded += 4;
				var normalByteValuesCount = vertexCount * 3;
				bytesReaded = bytesReaded + 1 * normalByteValuesCount; // updating data.***

				// 3) Indices.
				var shortIndicesValuesCount = readWriter.readUInt32(arrayBuffer, bytesReaded, bytesReaded+4);
				bytesReaded += 4;
				var sizeLevels = readWriter.readUInt8(arrayBuffer, bytesReaded, bytesReaded+1);
				bytesReaded += 1;
				bytesReaded = bytesReaded + sizeLevels * 4;
				bytesReaded = bytesReaded + sizeLevels * 4;
				bytesReaded = bytesReaded + 2 * shortIndicesValuesCount; // updating data.***
			}
			// Pendent to load the block's lego.***
			continue;
		}
		
		// The block doesn't exist, so creates a new block and read data.
		var block = new Block();
		block.idx = blockIdx;
		motherBlocksArray[blockIdx] = block;

		// 1rst, read bbox.
		var bbox = new BoundingBox();
		bbox.minX = new Float32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4));
		bytesReaded += 4;
		bbox.minY = new Float32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4));
		bytesReaded += 4;
		bbox.minZ = new Float32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4));
		bytesReaded += 4;

		bbox.maxX = new Float32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4));
		bytesReaded += 4;
		bbox.maxY = new Float32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4));
		bytesReaded += 4;
		bbox.maxZ = new Float32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4));
		bytesReaded += 4;

		var maxLength = bbox.getMaxLength();
		if (maxLength < 0.5) { block.isSmallObj = true; }
		else { block.isSmallObj = false; }

		block.radius = maxLength/2.0;

		bbox.deleteObjects();
		bbox = undefined;

		// New for read multiple vbo datas (indices cannot superate 65535 value).***
		var vboDatasCount = readWriter.readInt32(arrayBuffer, bytesReaded, bytesReaded+4);
		bytesReaded += 4;
		for ( var j = 0; j < vboDatasCount; j++ ) 
		{
			// 1) Positions array.
			var vertexCount = readWriter.readUInt32(arrayBuffer, bytesReaded, bytesReaded+4);
			bytesReaded += 4;
			var verticesFloatValuesCount = vertexCount * 3;
			// now padding the array to adjust to standard memory size of pool.
			posByteSize = 4 * verticesFloatValuesCount;
			classifiedPosByteSize = vboMemManager.getClassifiedBufferSize(posByteSize);
			
			block.vertexCount = vertexCount;
			startBuff = bytesReaded;
			endBuff = bytesReaded + 4 * verticesFloatValuesCount;
			var vboViCacheKey = block.vBOVertexIdxCacheKeysContainer.newVBOVertexIdxCacheKey();
			vboViCacheKey.posVboDataArray = new Float32Array(classifiedPosByteSize);
			vboViCacheKey.posVboDataArray.set(new Float32Array(arrayBuffer.slice(startBuff, endBuff)));
			vboViCacheKey.posArrayByteSize = classifiedPosByteSize; 
			bytesReaded = bytesReaded + 4 * verticesFloatValuesCount; // updating data.***
			
			// 2) Normals.
			vertexCount = readWriter.readUInt32(arrayBuffer, bytesReaded, bytesReaded+4);
			bytesReaded += 4;
			var normalByteValuesCount = vertexCount * 3;
			// now padding the array to adjust to standard memory size of pool.
			norByteSize = 1 * normalByteValuesCount;
			classifiedNorByteSize = vboMemManager.getClassifiedBufferSize(norByteSize);
			
			startBuff = bytesReaded;
			endBuff = bytesReaded + 1 * normalByteValuesCount;
			vboViCacheKey.norVboDataArray = new Int8Array(classifiedNorByteSize);
			vboViCacheKey.norVboDataArray.set(new Int8Array(arrayBuffer.slice(startBuff, endBuff)));
			vboViCacheKey.norArrayByteSize = classifiedNorByteSize;
			bytesReaded = bytesReaded + 1 * normalByteValuesCount; // updating data.***
			
			// 3) Indices.
			var shortIndicesValuesCount = readWriter.readUInt32(arrayBuffer, bytesReaded, bytesReaded+4);
			// now padding the array to adjust to standard memory size of pool.
			idxByteSize = 2 * shortIndicesValuesCount;
			classifiedIdxByteSize = vboMemManager.getClassifiedBufferSize(idxByteSize);
			
			bytesReaded += 4;
			var sizeLevels = readWriter.readUInt8(arrayBuffer, bytesReaded, bytesReaded+1);
			bytesReaded +=1;
			var sizeThresholds = [];
			for ( var k = 0; k < sizeLevels; k++ )
			{
				sizeThresholds.push(new Float32Array(arrayBuffer.slice(bytesReaded, bytesReaded+4)));
				bytesReaded += 4;
			}
			var indexMarkers = [];
			for ( var k = 0; k < sizeLevels; k++ )
			{
				indexMarkers.push(readWriter.readUInt32(arrayBuffer, bytesReaded, bytesReaded+4));
				bytesReaded += 4;
			}
			var bigTrianglesShortIndicesValues_count = indexMarkers[sizeLevels-1];
			vboViCacheKey.bigTrianglesIndicesCount = bigTrianglesShortIndicesValues_count;
			startBuff = bytesReaded;
			endBuff = bytesReaded + 2 * shortIndicesValuesCount;

			vboViCacheKey.idxVboDataArray = new Int16Array(classifiedIdxByteSize);
			vboViCacheKey.idxVboDataArray.set(new Int16Array(arrayBuffer.slice(startBuff, endBuff)));
			vboViCacheKey.idxArrayByteSize = classifiedIdxByteSize;
			bytesReaded = bytesReaded + 2 * shortIndicesValuesCount; // updating data.***
			vboViCacheKey.indicesCount = shortIndicesValuesCount;

			posByteSize;
			norByteSize;
			idxByteSize;
			
			classifiedPosByteSize;
			classifiedNorByteSize;
			classifiedIdxByteSize;
			
			var hola = 0;
			
			// test.
			if (!vboViCacheKey.isReadyPositions(gl, magoManager.vboMemoryManager))
			{ succesfullyGpuDataBinded = false; }
			if (!vboViCacheKey.isReadyNormals(gl, magoManager.vboMemoryManager))
			{ succesfullyGpuDataBinded = false; }
			if (!vboViCacheKey.isReadyFaces(gl, magoManager.vboMemoryManager))
			{ succesfullyGpuDataBinded = false; }
		}
		
		

		// Pendent to load the block's lego.***
	}
	this.fileLoadState = CODE.fileLoadState.PARSE_FINISHED;
	return succesfullyGpuDataBinded;
};

/**
 * 블록 컨테이너
 * @class BlocksListsContainer
 */
var BlocksListsContainer = function() 
{
	if (!(this instanceof BlocksListsContainer)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.blocksListsArray = [];
};

/**
 * 새 블록 리스트를 생성
 * @param blocksListName 변수
 * @returns blocksList
 */
BlocksListsContainer.prototype.newBlocksList = function(blocksListName) 
{
	var blocksList = new BlocksList();
	blocksList.name = blocksListName;
	this.blocksListsArray.push(blocksList);
	return blocksList;
};

/**
 * 블록 리스트 획득
 * @param blockList_name 변수
 * @returns blocksList
 */
BlocksListsContainer.prototype.getBlockList = function(blockList_name) 
{
	var blocksListsCount = this.blocksListsArray.length;
	var found = false;
	var i=0;
	var blocksList = null;
	while (!found && i<blocksListsCount) 
	{
		var currentBlocksList = this.blocksListsArray[i];
		if (currentBlocksList.name === blockList_name) 
		{
			found = true;
			blocksList = currentBlocksList;
		}
		i++;
	}
	return blocksList;
};

'use strict';

/**
 * F4D Lego 클래스
 * 
 * @alias Lego
 * @class Lego
 */
var Lego = function() 
{
	if (!(this instanceof Lego)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.vbo_vicks_container = new VBOVertexIdxCacheKeysContainer();
	this.fileLoadState = CODE.fileLoadState.READY;
	this.dataArrayBuffer;
	this.selColor4;
};

/**
 * F4D Lego 자료를 읽는다
 * 
 * @param {any} gl 
 * @param {any} readWriter 
 * @param {any} dataArraybuffer 
 * @param {any} bytesReaded 
 */
Lego.prototype.parseArrayBuffer = function(gl, dataArraybuffer, magoManager)
{
	this.parseLegoData(dataArraybuffer, gl, magoManager);
};

/**
 * F4D Lego 자료를 읽는다
 * 
 * @param {any} gl 
 * @param {any} readWriter 
 * @param {any} dataArraybuffer 
 * @param {any} bytesReaded 
 */
Lego.prototype.deleteObjects = function(gl, vboMemManager)
{
	this.vbo_vicks_container.deleteGlObjects(gl, vboMemManager);
	this.vbo_vicks_container = undefined;
	this.fileLoadState = undefined;
	this.dataArrayBuffer = undefined;
	if (this.selColor4 != undefined)
	{
		this.selColor4.deleteObjects();
		this.selColor4 = undefined;
	}
};

/**
 * F4D Lego 자료를 읽는다
 * 
 * @param {ArrayBuffer} buffer 
 */
Lego.prototype.parseLegoData = function(buffer, gl, magoManager)
{
	if (this.fileLoadState !== CODE.fileLoadState.LOADING_FINISHED)	{ return; }
	
	var vboMemManager = magoManager.vboMemoryManager;

	var stream = new DataStream(buffer, 0, DataStream.LITTLE_ENDIAN);
	this.fileLoadState = CODE.fileLoadState.PARSE_STARTED;

	var bbox = new BoundingBox();
	var vboCacheKey = this.vbo_vicks_container.newVBOVertexIdxCacheKey();

	// BoundingBox
	bbox.minX = stream.readFloat32();
	bbox.minY = stream.readFloat32();
	bbox.minZ = stream.readFloat32();
	bbox.maxX = stream.readFloat32();
	bbox.maxY = stream.readFloat32();
	bbox.maxZ = stream.readFloat32();

	// VBO(Position Buffer) - x,y,z
	var numPositions = stream.readUint32();
	var posByteSize = 4 * numPositions * 3;
	var classifiedPosByteSize = vboMemManager.getClassifiedBufferSize(posByteSize);
	//var positionBuffer = stream.readFloat32Array(numPositions * 3); // original.***
	var positionBuffer = new Float32Array(classifiedPosByteSize);
	positionBuffer.set(stream.readFloat32Array(numPositions * 3));
	// console.log(numPositions + " Positions = " + positionBuffer[0]);

	vboCacheKey.vertexCount = numPositions;
	vboCacheKey.posVboDataArray = positionBuffer;
	vboCacheKey.posArrayByteSize = classifiedPosByteSize;

	// VBO(Normal Buffer) - i,j,k
	var hasNormals = stream.readUint8();
	if (hasNormals) 
	{
		var numNormals = stream.readUint32();
		var norByteSize = 1 * numNormals * 3;
		var classifiedNorByteSize = vboMemManager.getClassifiedBufferSize(norByteSize);
		//var normalBuffer = stream.readInt8Array(numNormals * 3); // original.***
		var normalBuffer = new Int8Array(classifiedNorByteSize);
		normalBuffer.set(stream.readInt8Array(numNormals * 3));
		// console.log(numNormals + " Normals = " + normalBuffer[0]);

		vboCacheKey.norVboDataArray = normalBuffer;
		vboCacheKey.norArrayByteSize = classifiedNorByteSize;
	}

	// VBO(Color Buffer) - r,g,b,a
	var hasColors = stream.readUint8();
	if (hasColors)
	{
		var numColors = stream.readUint32();
		var colByteSize = 1 * numColors * 4;
		var classifiedColByteSize = vboMemManager.getClassifiedBufferSize(colByteSize);
						
		//var colorBuffer = stream.readUint8Array(numColors * 4); // original.***
		var colorBuffer = new Uint8Array(classifiedColByteSize);
		colorBuffer.set(stream.readUint8Array(numColors * 4));
		// console.log(numColors + " Colors = " + colorBuffer[0]);

		vboCacheKey.colVboDataArray = colorBuffer;
		vboCacheKey.colArrayByteSize = classifiedColByteSize;
	}

	// VBO(TextureCoord Buffer) - u,v
	var hasTexCoords = stream.readUint8();
	if (hasTexCoords)
	{
		var dataType = stream.readUint16();
		var numCoords = stream.readUint32();
		var tCoordByteSize = 2 * numCoords * 4;
		var classifiedTCoordByteSize = vboMemManager.getClassifiedBufferSize(tCoordByteSize);
		//var coordBuffer = stream.readFloat32Array(numCoords * 2); // original.***
		var coordBuffer = new Float32Array(classifiedTCoordByteSize);
		coordBuffer.set(stream.readFloat32Array(numCoords * 2));
		// console.log(numCoords + " Coords = " + coordBuffer[0]);

		vboCacheKey.tcoordVboDataArray = coordBuffer;
		vboCacheKey.tcoordArrayByteSize = classifiedTCoordByteSize;
	}

	this.fileLoadState = CODE.fileLoadState.PARSE_FINISHED;
	
	var succesfullyGpuDataBinded = true;
	if (!vboCacheKey.isReadyPositions(gl, magoManager.vboMemoryManager))
	{ succesfullyGpuDataBinded = false; }
	if (!vboCacheKey.isReadyNormals(gl, magoManager.vboMemoryManager))
	{ succesfullyGpuDataBinded = false; }
	if (!vboCacheKey.isReadyColors(gl, magoManager.vboMemoryManager))
	{ succesfullyGpuDataBinded = false; }

	// 4) Texcoord.*********************************************
	if (hasTexCoords)
	{
		if (!vboCacheKey.isReadyTexCoords(gl, magoManager.vboMemoryManager))
		{ succesfullyGpuDataBinded = false; }
	}	
	return succesfullyGpuDataBinded;
};




















'use strict';

/**
 * F4D MetaData 클래스
 * 
 * @alias MetaData
 * @class MetaData
 */
var MetaData = function() 
{
	if (!(this instanceof MetaData)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.guid; // must be undefined initially.***
	this.version = "";
	this.geographicCoord; // longitude, latitude, altitude.***

	this.heading;
	this.pitch;
	this.roll;

	this.bbox; // BoundingBox.***
	this.imageLodCount;

	// Buildings octree mother size.***
	this.oct_min_x = 0.0;
	this.oct_max_x = 0.0;
	this.oct_min_y = 0.0;
	this.oct_max_y = 0.0;
	this.oct_min_z = 0.0;
	this.oct_max_z = 0.0;

	this.isSmall = false;
	this.fileLoadState = CODE.fileLoadState.READY;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param arrayBuffer 변수
 * @param readWriter 변수
 */
MetaData.prototype.deleteObjects = function() 
{
	this.guid = undefined; // must be undefined initially.***
	this.version = undefined;
	if (this.geographicCoord)
	{ this.geographicCoord.deleteObjects(); }
	this.geographicCoord = undefined; // longitude, latitude, altitude.***

	this.heading = undefined;
	this.pitch = undefined;
	this.roll = undefined;

	if (this.bbox)
	{ this.bbox.deleteObjects(); }
	this.bbox = undefined; // BoundingBox.***
	this.imageLodCount = undefined;

	// Buildings octree mother size.***
	this.oct_min_x = undefined;
	this.oct_max_x = undefined;
	this.oct_min_y = undefined;
	this.oct_max_y = undefined;
	this.oct_min_z = undefined;
	this.oct_max_z = undefined;

	this.isSmall = undefined;
	this.fileLoadState = undefined;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param arrayBuffer 변수
 * @param readWriter 변수
 */
MetaData.prototype.parseFileHeader = function(arrayBuffer, readWriter) 
{
	var version_string_length = 5;
	var intAux_scratch = 0;
	var auxScratch;
	//var header = BR_Project._header;
	//var arrayBuffer = this.fileArrayBuffer;
	//var bytes_readed = this.fileBytesReaded;
	var bytes_readed = 0;

	if (readWriter === undefined) { readWriter = new ReaderWriter(); }

	// 1) Version(5 chars).***********
	for (var j=0; j<version_string_length; j++)
	{
		this.version += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
	}

	// 3) Global unique ID.*********************
	if (this.guid === undefined) { this.guid =""; }

	intAux_scratch = readWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
	for (var j=0; j<intAux_scratch; j++)
	{
		this.guid += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
	}

	// 4) Location.*************************
	if (this.longitude === undefined) 
	{
		this.longitude = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
	}
	else { bytes_readed += 8; }

	if (this.latitude === undefined) 
	{
		this.latitude = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
	}
	else { bytes_readed += 8; }

	if (this.altitude === undefined) 
	{
		this.altitude = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	}
	else { bytes_readed += 4; }

	//this.altitude += 20.0; // TEST.***

	//header._elevation += 70.0; // delete this. TEST.!!!
	if (this.bbox === undefined) { this.bbox = new BoundingBox(); }

	// 6) BoundingBox.************************
	this.bbox.minX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.minY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.minZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.maxX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.maxY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.maxZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;

	// TEST. PROVISIONAL. DELETE.***
	//this.bbox.expand(20.0);
	var imageLODs_count = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed += 1;

	// 7) Buildings octree mother size.***
	this.oct_min_x = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.oct_min_y = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.oct_min_z = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.oct_max_x = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.oct_max_y = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.oct_max_z = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;

	var isLarge = false;
	if (this.bbox.maxX - this.bbox.minX > 40.0 || this.bbox.maxY - this.bbox.minY > 40.0) 
	{
		isLarge = true;
	}

	if (!isLarge && this.bbox.maxZ - this.bbox.minZ < 30.0) 
	{
		this.isSmall = true;
	}

	return bytes_readed;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param arrayBuffer 변수
 * @param readWriter 변수
 */
MetaData.prototype.parseFileHeaderAsimetricVersion = function(arrayBuffer, readWriter) 
{
	var version_string_length = 5;
	var intAux_scratch = 0;
	var auxScratch;
	//var header = BR_Project._header;
	//var arrayBuffer = this.fileArrayBuffer;
	//var bytes_readed = this.fileBytesReaded;
	var bytes_readed = 0;

	if (readWriter === undefined) { readWriter = new ReaderWriter(); }

	// 1) Version(5 chars).***********
	for (var j=0; j<version_string_length; j++)
	{
		this.version += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
	}

	// 3) Global unique ID.*********************
	if (this.guid === undefined) { this.guid =""; }

	intAux_scratch = readWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
	for (var j=0; j<intAux_scratch; j++)
	{
		this.guid += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
	}

	// 4) Location.*************************
	if (this.longitude === undefined) 
	{
		this.longitude = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
	}
	else { bytes_readed += 8; }

	if (this.latitude === undefined) 
	{
		this.latitude = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
	}
	else { bytes_readed += 8; }

	if (this.altitude === undefined) 
	{
		this.altitude = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	}
	else { bytes_readed += 4; }

	//this.altitude -= 140.0; // TEST.***

	//header._elevation += 70.0; // delete this. TEST.!!!
	if (this.bbox === undefined) { this.bbox = new BoundingBox(); }

	// 6) BoundingBox.************************
	this.bbox.minX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.minY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.minZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.maxX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.maxY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.maxZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;

	// TEST. PROVISIONAL. DELETE.***
	//this.bbox.expand(20.0);

	//var imageLODs_count = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed += 1;

	//// 7) Buildings octree mother size.***
	//this.oct_min_x = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	//this.oct_min_y = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	//this.oct_min_z = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	//this.oct_max_x = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	//this.oct_max_y = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	//this.oct_max_z = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;

	var isLarge = false;
	if (this.bbox.maxX - this.bbox.minX > 40.0 || this.bbox.maxY - this.bbox.minY > 40.0) 
	{
		isLarge = true;
	}

	if (!isLarge && this.bbox.maxZ - this.bbox.minZ < 30.0) 
	{
		this.isSmall = true;
	}

	return bytes_readed;
};



'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class ModelReferencedGroup
 */
var ModelReferencedGroup = function() 
{
	if (!(this instanceof ModelReferencedGroup)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.modelIdx; // there are only one model.
	this.referencesIdxArray = []; // all references has the same model.
};


/**
 * 어떤 일을 하고 있습니까?
 * @class ModelReferencedGroupsList
 */
var ModelReferencedGroupsList = function() 
{
	if (!(this instanceof ModelReferencedGroupsList)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.modelReferencedGroupsMap = [];
	this.modelReferencedGroupsArray = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
ModelReferencedGroupsList.prototype.getModelReferencedGroup = function(modelIdx) 
{
	var modelReferencedGroup = this.modelReferencedGroupsMap[modelIdx];
	
	if (modelReferencedGroup == undefined)
	{
		modelReferencedGroup = new ModelReferencedGroup();
		modelReferencedGroup.modelIdx = modelIdx;
		this.modelReferencedGroupsMap[modelIdx] = modelReferencedGroup;
	}
	
	return modelReferencedGroup;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
ModelReferencedGroupsList.prototype.makeModelReferencedGroupsArray = function() 
{
	this.modelReferencedGroupsArray.length = 0;
	
	var modelRefGroupsCount = this.modelReferencedGroupsMap.length;
	for (var i=0; i<modelRefGroupsCount; i++)
	{
		if (this.modelReferencedGroupsMap[i] != undefined)
		{ this.modelReferencedGroupsArray.push(this.modelReferencedGroupsMap[i]); }
	}
	this.modelReferencedGroupsMap.length = 0;
	
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
ModelReferencedGroupsList.prototype.createModelReferencedGroups = function(neoRefsIndices, motherNeoRefsList) 
{
	// Group all the references that has the same model.
	if (neoRefsIndices == undefined)
	{ return; }
	
	if (motherNeoRefsList == undefined)
	{ return; }
	
	var referenceIdx;
	var modelIdx;
	var modelRefGroup;
	var referencesCount = neoRefsIndices.length;
	for (var i=0; i<referencesCount; i++)
	{
		referenceIdx = neoRefsIndices[i];
		modelIdx = motherNeoRefsList[referenceIdx]._block_idx;
		modelRefGroup = this.getModelReferencedGroup(modelIdx);
		modelRefGroup.referencesIdxArray.push(referenceIdx);
	}
	
	// Now, delete the "modelReferencedGroupsMap" and make a simple array.
	this.makeModelReferencedGroupsArray();
	
};





'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class NeoReference
 */
var NeoReference = function() 
{
	if (!(this instanceof NeoReference)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	// 1) Object IDX.***
	this._id = 0;

	this.objectId = "";

	// 2) Block Idx.***
	this._block_idx = -1;

	// 3) Transformation Matrix.***
	this._matrix4 = new Matrix4(); // initial and necessary matrix.***
	this._originalMatrix4 = new Matrix4(); // original matrix, for use with block-reference (do not modify).***
	this.tMatrixAuxArray; // use for deploying mode, cronological transformations for example.***
	this.refMatrixType = 2; // 0 = identity matrix, 1 = translate matrix, 2 = transformation matrix.
	this.refTranslationVec; // use this if "refMatrixType" == 1.
	// 4) VBO datas container.***
	this.vBOVertexIdxCacheKeysContainer; // initially undefined.***
	
	// 4) Tex coords cache_key.*** // old.***
	this.MESH_TEXCOORD_cacheKey; // old.***

	// 5) The texture image.***
	this.hasTexture = false;
	this.texture; // Texture

	// 6) 1 color.***
	this.color4; //new Color();
	this.aditionalColor; // used when object color was changed.***

	// 7) selection color.***
	this.selColor4; //new Color(); // use for selection only.***

	this.vertexCount = 0;// provisional. for checking vertexCount of the block.*** delete this.****

	// 8) movement of the object.***
	this.moveVector; // Point3D.***

	// 9) check for render.***
	this.bRendered = false;
};

/**
 * 어떤 일을 하고 있습니까?
 */
NeoReference.prototype.multiplyTransformMatrix = function(matrix) 
{
	this._matrix4 = this._originalMatrix4.getMultipliedByMatrix(matrix); // Original.***
};

/**
 * 어떤 일을 하고 있습니까?
 */
NeoReference.prototype.multiplyKeyTransformMatrix = function(idxKey, matrix) 
{
	// this function multiplies the originalMatrix by "matrix" and stores it in the "idxKey" position.***
	if (this.tMatrixAuxArray === undefined)
	{ this.tMatrixAuxArray = []; }

	this.tMatrixAuxArray[idxKey] = this._originalMatrix4.getMultipliedByMatrix(matrix, this.tMatrixAuxArray[idxKey]);
};

/**
 * 어떤 일을 하고 있습니까?
 */
NeoReference.prototype.hasKeyMatrix = function(idxKey) 
{
	if (this.tMatrixAuxArray === undefined)
	{ return false; }

	if (this.tMatrixAuxArray[idxKey] === undefined)
	{ return false; }
	else
	{ return true; }
};

/**
 * 어떤 일을 하고 있습니까?
 */
NeoReference.prototype.deleteGlObjects = function(gl, vboMemManager) 
{
	// 1) Object ID.***
	this._id = undefined;

	// 2) Block Idx.***
	this._block_idx = undefined;

	// 3) Transformation Matrix.***
	this._matrix4._floatArrays = undefined;
	this._matrix4 = undefined;
	this._originalMatrix4._floatArrays = undefined;
	this._originalMatrix4 = undefined; //
	
	// 4) Tex coords cache_key.*** // old.***
	if (this.MESH_TEXCOORD_cacheKey) 
	{ // old.***
		gl.deleteBuffer(this.MESH_TEXCOORD_cacheKey); // old.***
		this.MESH_TEXCOORD_cacheKey = undefined; // old.***
	} // old.***

	// 5) The texture image.***
	this.hasTexture = undefined;
	this.texture = undefined; // Texture

	// 6) 1 color.***
	this.color4 = undefined; //new Color();

	// 7) selection color.***
	this.selColor4 = undefined; //new Color(); // use for selection only.***

	this.vertexCount = undefined;// provisional. for checking vertexCount of the block.*** delete this.****

	// 8) movement of the object.***
	this.moveVector = undefined; // Point3D.***

	this.bRendered = undefined;
};

//*************************************************************************************************************************************************************
//*************************************************************************************************************************************************************
//*************************************************************************************************************************************************************
/**
 * 어떤 일을 하고 있습니까?
 * @class NeoReferencesMotherAndIndices
 */
var NeoReferencesMotherAndIndices = function() 
{
	if (!(this instanceof NeoReferencesMotherAndIndices)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	// for asimetric mode.***// for asimetric mode.***// for asimetric mode.***// for asimetric mode.***
	this.motherNeoRefsList; // this is a NeoReferencesList pointer.***
	this.blocksList; // local blocks list. used only for parse data.***
	this.neoRefsIndices = []; // All objects(references) of this class.
	this.modelReferencedGroupsList;

	this.fileLoadState = 0;
	this.dataArraybuffer;
	this.succesfullyGpuDataBinded;

	this.exterior_ocCullOctree; // octree that contains the visible indices.
	this.interior_ocCullOctree; // octree that contains the visible indices.
	
	this.currentVisibleIndices = [];
	this.currentVisibleMRG; // MRG = ModelReferencedGroup.
};

/**
 * 어떤 일을 하고 있습니까?
 * @param matrix 변수
 */
NeoReferencesMotherAndIndices.prototype.multiplyKeyTransformMatrix = function(idxKey, matrix) 
{
	var refIndicesCount = this.neoRefsIndices.length;
	for (var i=0; i<refIndicesCount; i++)
	{
		this.motherNeoRefsList[this.neoRefsIndices[i]].multiplyKeyTransformMatrix(idxKey, matrix);
	}
};

NeoReferencesMotherAndIndices.prototype.updateCurrentVisibleIndices = function(isExterior, eye_x, eye_y, eye_z) 
{
	if (isExterior)
	{
		if (this.exterior_ocCullOctree !== undefined)
		{
			if (this.exterior_ocCullOctree._subBoxesArray && this.exterior_ocCullOctree._subBoxesArray.length > 0)
			{
				if (this.currentVisibleMRG == undefined)
				{ this.currentVisibleMRG = new ModelReferencedGroupsList(); }
				
				this.currentVisibleIndices = this.exterior_ocCullOctree.getIndicesVisiblesForEye(eye_x, eye_y, eye_z, this.currentVisibleIndices, this.currentVisibleMRG);
			}
			else 
			{
				this.currentVisibleIndices = this.neoRefsIndices;
				this.currentVisibleMRG = this.modelReferencedGroupsList;
			}
		}
	}
	else
	{
		if (this.interior_ocCullOctree !== undefined)
		{
			if (this.interior_ocCullOctree._subBoxesArray && this.interior_ocCullOctree._subBoxesArray.length > 0)
			{
				if (this.currentVisibleMRG == undefined)
				{ this.currentVisibleMRG = new ModelReferencedGroupsList(); }
				
				this.currentVisibleIndices = this.interior_ocCullOctree.getIndicesVisiblesForEye(eye_x, eye_y, eye_z, this.currentVisibleIndices, this.currentVisibleMRG);
			}
			else
			{
				this.currentVisibleIndices = this.neoRefsIndices;
				this.currentVisibleMRG = this.modelReferencedGroupsList;
			}
		}
	}
};

/**
 * Returns the neoReference
 * @param matrix 변수
 */
NeoReferencesMotherAndIndices.prototype.getNeoReference = function(idx) 
{
	return this.motherNeoRefsList[this.neoRefsIndices[idx]];
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
NeoReferencesMotherAndIndices.prototype.deleteObjects = function(gl, vboMemManager) 
{
	this.motherNeoRefsList = undefined; // this is a NeoReferencesList pointer.***
	if (this.blocksList)
	{ this.blocksList.deleteGlObjects(gl, vboMemManager); }

	this.blocksList = undefined;
	this.neoRefsIndices = undefined;

	this.fileLoadState = 0;
	this.dataArraybuffer = undefined;

	this.exterior_ocCullOctree = undefined;
	this.interior_ocCullOctree = undefined;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
NeoReferencesMotherAndIndices.prototype.setRenderedFalseToAllReferences = function() 
{
	var refIndicesCount = this.neoRefsIndices.length;
	for (var i=0; i<refIndicesCount; i++)
	{
		this.motherNeoRefsList[this.neoRefsIndices[i]].bRendered = false;
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
NeoReferencesMotherAndIndices.prototype.createModelReferencedGroups = function() 
{
	// Group all the references that has the same model.
	if (this.neoRefsIndices == undefined)
	{ return; }
	
	if (this.modelReferencedGroupsList == undefined)
	{ this.modelReferencedGroupsList = new ModelReferencedGroupsList(); }

	this.modelReferencedGroupsList.createModelReferencedGroups(this.neoRefsIndices, this.motherNeoRefsList);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param arrayBuffer 변수
 * @param neoBuilding 변수
 * @param readWriter 변수
 */
NeoReferencesMotherAndIndices.prototype.parseArrayBufferReferences = function(gl, arrayBuffer, readWriter, motherNeoReferencesArray, tMatrix4, magoManager) 
{
	this.fileLoadState = CODE.fileLoadState.PARSE_STARTED;

	var startBuff;
	var endBuff;
	var bytes_readed = 0;
	var neoRefsCount = readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
	var testIdentityMatsCount = 0;
	var stadistic_refMat_Identities_count = 0;
	var stadistic_refMat_Translates_count = 0;
	var stadistic_refMat_Transforms_count = 0;
	var vboMemManager = magoManager.vboMemoryManager;
	var classifiedTCoordByteSize = 0, classifiedColByteSize = 0;
	var colByteSize, tCoordByteSize;
	this.succesfullyGpuDataBinded = true;

	for (var i = 0; i < neoRefsCount; i++) 
	{
		var neoRef = new NeoReference();

		// 1) Id.***
		var ref_ID =  readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
		neoRef._id = ref_ID;

		this.motherNeoRefsList = motherNeoReferencesArray;
		if (motherNeoReferencesArray[neoRef._id] !== undefined)
		{
			// pass this neoReference because exist in the motherNeoReferencesArray.***
			neoRef = motherNeoReferencesArray[neoRef._id];
			if (this.neoRefsIndices === undefined)
			{ this.neoRefsIndices = []; }
			
			this.neoRefsIndices.push(neoRef._id);

			var objectIdLength = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed +=1;
			var objectId = String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+objectIdLength)));
			neoRef.objectId = objectId;
			bytes_readed += objectIdLength;

			// 2) Block's Idx.***
			var blockIdx =   readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			neoRef._block_idx = blockIdx;

			// 3) Transform Matrix4.***
			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;

			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;

			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;

			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;

			// Float mode.**************************************************************
			// New modifications for xxxx 20161013.*****************************
			var has_1_color = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed += 1;
			if (has_1_color) 
			{
				// "type" : one of following
				// 5120 : signed byte, 5121 : unsigned byte, 5122 : signed short, 5123 : unsigned short, 5126 : float
				var data_type = readWriter.readUInt16(arrayBuffer, bytes_readed, bytes_readed+2); bytes_readed += 2;
				var dim = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed += 1;

				var daya_bytes;
				if (data_type === 5121) { daya_bytes = 1; }

				var r = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+daya_bytes); bytes_readed += daya_bytes;
				var g = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+daya_bytes); bytes_readed += daya_bytes;
				var b = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+daya_bytes); bytes_readed += daya_bytes;
				var alfa = 255;

				if (dim === 4) 
				{
					alfa = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+daya_bytes); bytes_readed += daya_bytes;
				}
			}
			
			var has_colors = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed += 1;
			var has_texCoords = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed += 1;
			
			if (has_colors || has_texCoords)
			{
				var vboDatasCount = readWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
				
				for (var j=0; j<vboDatasCount; j++)
				{
					if (has_colors)
					{
						var data_type = readWriter.readUInt16(arrayBuffer, bytes_readed, bytes_readed+2); bytes_readed += 2;
						var dim = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed += 1;

						var daya_bytes; // (5120 signed byte), (5121 unsigned byte), (5122 signed short), (5123 unsigned short), (5126 float)
						if (data_type === 5120 || data_type === 5121) { daya_bytes = 1; }
						else if (data_type === 5122 || data_type === 5123) { daya_bytes = 2; }
						else if (data_type === 5126) { daya_bytes = 4; }
						
						var vertexCount = readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
						var verticesFloatValuesCount = vertexCount * dim;
						startBuff = bytes_readed;
						endBuff = bytes_readed + daya_bytes * verticesFloatValuesCount; 
						bytes_readed += daya_bytes * verticesFloatValuesCount; // updating data.***
					}
					
					if (has_texCoords)
					{
						var data_type = readWriter.readUInt16(arrayBuffer, bytes_readed, bytes_readed+2); bytes_readed += 2;
						
						var daya_bytes; // (5120 signed byte), (5121 unsigned byte), (5122 signed short), (5123 unsigned short), (5126 float)
						if (data_type === 5120 || data_type === 5121) { daya_bytes = 1; }
						else if (data_type === 5122 || data_type === 5123) { daya_bytes = 2; }
						else if (data_type === 5126) { daya_bytes = 4; }
						
						var vertexCount = readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
						var verticesFloatValuesCount = vertexCount * 2; // 2 = dimension of texCoord.***
						startBuff = bytes_readed;
						endBuff = bytes_readed + daya_bytes * verticesFloatValuesCount; 
						bytes_readed += daya_bytes * verticesFloatValuesCount;
					}
				}
			}
			
			// 4) short texcoords. OLD. Change this for Materials.***
			var textures_count = readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4; // this is only indicative that there are a texcoords.***
			if (textures_count > 0) 
			{

				// Now, read the texture_type and texture_file_name.***
				var texture_type_nameLegth = readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
				for (var j=0; j<texture_type_nameLegth; j++) 
				{
					bytes_readed += 1; // for example "diffuse".***
				}

				var texture_fileName_Legth = readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
				for (var j=0; j<texture_fileName_Legth; j++) 
				{
					bytes_readed += 1;
				}
			} 
			
			// do the stadistic recount.
			if (neoRef.refMatrixType == 0){ stadistic_refMat_Identities_count +=1; }
			if (neoRef.refMatrixType == 1){ stadistic_refMat_Translates_count +=1; }
			if (neoRef.refMatrixType == 2){ stadistic_refMat_Transforms_count +=1; }
		}
		else
		{

			motherNeoReferencesArray[neoRef._id] = neoRef;
			if (this.neoRefsIndices === undefined)
			{ this.neoRefsIndices = []; }
			
			this.neoRefsIndices.push(neoRef._id);

			var objectIdLength = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed +=1;
			var objectId = String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+objectIdLength)));
			neoRef.objectId = objectId;
			bytes_readed += objectIdLength;

			// 2) Block's Idx.***
			var blockIdx =   readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			neoRef._block_idx = blockIdx;

			// 3) Transform Matrix4.***
			neoRef._originalMatrix4._floatArrays[0] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			neoRef._originalMatrix4._floatArrays[1] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			neoRef._originalMatrix4._floatArrays[2] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			neoRef._originalMatrix4._floatArrays[3] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;

			neoRef._originalMatrix4._floatArrays[4] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			neoRef._originalMatrix4._floatArrays[5] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			neoRef._originalMatrix4._floatArrays[6] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			neoRef._originalMatrix4._floatArrays[7] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;

			neoRef._originalMatrix4._floatArrays[8] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			neoRef._originalMatrix4._floatArrays[9] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			neoRef._originalMatrix4._floatArrays[10] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			neoRef._originalMatrix4._floatArrays[11] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;

			neoRef._originalMatrix4._floatArrays[12] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			neoRef._originalMatrix4._floatArrays[13] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			neoRef._originalMatrix4._floatArrays[14] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			neoRef._originalMatrix4._floatArrays[15] =  readWriter.readFloat32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			
			// Compute the references matrix type.
			neoRef.refMatrixType = neoRef._originalMatrix4.computeMatrixType();
			if (neoRef.refMatrixType === 0){ stadistic_refMat_Identities_count +=1; }
			if (neoRef.refMatrixType === 1)
			{
				neoRef.refTranslationVec = new Float32Array([neoRef._originalMatrix4._floatArrays[12], neoRef._originalMatrix4._floatArrays[13], neoRef._originalMatrix4._floatArrays[14]]);
				stadistic_refMat_Translates_count +=1;
			}
			if (neoRef.refMatrixType === 2){ stadistic_refMat_Transforms_count +=1; }

			// Float mode.**************************************************************
			// New modifications for xxxx 20161013.*****************************
			var has_1_color = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed += 1;
			if (has_1_color) 
			{
				// "type" : one of following
				// 5120 : signed byte, 5121 : unsigned byte, 5122 : signed short, 5123 : unsigned short, 5126 : float
				var data_type = readWriter.readUInt16(arrayBuffer, bytes_readed, bytes_readed+2); bytes_readed += 2;
				var dim = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed += 1;

				var daya_bytes;
				if (data_type === 5121) { daya_bytes = 1; }

				var r = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+daya_bytes); bytes_readed += daya_bytes;
				var g = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+daya_bytes); bytes_readed += daya_bytes;
				var b = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+daya_bytes); bytes_readed += daya_bytes;
				var alfa = 255;

				if (dim === 4) 
				{
					alfa = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+daya_bytes); bytes_readed += daya_bytes;
				}

				neoRef.color4 = new Color();
				neoRef.color4.set(r, g, b, alfa);
			}
			
			var has_colors = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed += 1;
			var has_texCoords = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed += 1;
			
			if (has_colors || has_texCoords)
			{
				var vboDatasCount = readWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
				
				if (vboDatasCount > 0)
				{
					if (neoRef.vBOVertexIdxCacheKeysContainer === undefined)
					{ neoRef.vBOVertexIdxCacheKeysContainer = new VBOVertexIdxCacheKeysContainer(); }
				}
				
				for (var j=0; j<vboDatasCount; j++)
				{
					var vboViCacheKey = neoRef.vBOVertexIdxCacheKeysContainer.newVBOVertexIdxCacheKey();
					
					if (has_colors)
					{
						var data_type = readWriter.readUInt16(arrayBuffer, bytes_readed, bytes_readed+2); bytes_readed += 2;
						var dim = readWriter.readUInt8(arrayBuffer, bytes_readed, bytes_readed+1); bytes_readed += 1;

						var daya_bytes; // (5120 signed byte), (5121 unsigned byte), (5122 signed short), (5123 unsigned short), (5126 float)
						if (data_type === 5120 || data_type === 5121) { daya_bytes = 1; }
						else if (data_type === 5122 || data_type === 5123) { daya_bytes = 2; }
						else if (data_type === 5126) { daya_bytes = 4; }
						
						var vertexCount = readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
						var verticesFloatValuesCount = vertexCount * dim;
						colByteSize = daya_bytes * verticesFloatValuesCount;
						classifiedColByteSize = vboMemManager.getClassifiedBufferSize(colByteSize);
						
						neoRef.vertexCount = vertexCount; // no necessary.***
						startBuff = bytes_readed;
						endBuff = bytes_readed + daya_bytes * verticesFloatValuesCount; 
						//vboViCacheKey.colVboDataArray = new Float32Array(arrayBuffer.slice(startBuff, endBuff)); // original.***
						// TODO: Float32Array or UintArray depending of dataType.***
						vboViCacheKey.colVboDataArray = new Float32Array(classifiedColByteSize);
						vboViCacheKey.colVboDataArray.set(new Float32Array(arrayBuffer.slice(startBuff, endBuff)));
						vboViCacheKey.colArrayByteSize = classifiedColByteSize;
						bytes_readed += daya_bytes * verticesFloatValuesCount; // updating data.***
						
						// send data to gpu.
						if (!vboViCacheKey.isReadyColors(gl, magoManager.vboMemoryManager))
						{
							this.succesfullyGpuDataBinded = false;
						}
					}
					
					if (has_texCoords)
					{
						var data_type = readWriter.readUInt16(arrayBuffer, bytes_readed, bytes_readed+2); bytes_readed += 2;
						
						var daya_bytes; // (5120 signed byte), (5121 unsigned byte), (5122 signed short), (5123 unsigned short), (5126 float)
						if (data_type === 5120 || data_type === 5121) { daya_bytes = 1; }
						else if (data_type === 5122 || data_type === 5123) { daya_bytes = 2; }
						else if (data_type === 5126) { daya_bytes = 4; }
						
						var vertexCount = readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
						var verticesFloatValuesCount = vertexCount * 2; // 2 = dimension of texCoord.***
						// example: posByteSize = 4 * verticesFloatValuesCount;
						tCoordByteSize = daya_bytes * verticesFloatValuesCount;
						classifiedTCoordByteSize = vboMemManager.getClassifiedBufferSize(tCoordByteSize);
						
						neoRef.vertexCount = vertexCount; // no necessary.***
						startBuff = bytes_readed;
						endBuff = bytes_readed + daya_bytes * verticesFloatValuesCount; 
						//vboViCacheKey.tcoordVboDataArray = new Float32Array(arrayBuffer.slice(startBuff, endBuff)); // original.***
						vboViCacheKey.tcoordVboDataArray = new Float32Array(classifiedTCoordByteSize);
						vboViCacheKey.tcoordVboDataArray.set(new Float32Array(arrayBuffer.slice(startBuff, endBuff)));
						vboViCacheKey.tcoordArrayByteSize = classifiedTCoordByteSize;
						bytes_readed += daya_bytes * verticesFloatValuesCount;
						
						// send data to gpu.
						if (!vboViCacheKey.isReadyTexCoords(gl, magoManager.vboMemoryManager))
						{
							this.succesfullyGpuDataBinded = false;
						}
					}
				}
			}

			// 4) short texcoords. OLD. Change this for Materials.***
			var textures_count = readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4; // this is only indicative that there are a texcoords.***
			if (textures_count > 0) 
			{
				var textureTypeName = "";
				var textureImageFileName = "";

				// Now, read the texture_type and texture_file_name.***
				var texture_type_nameLegth = readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
				for (var j=0; j<texture_type_nameLegth; j++) 
				{
					textureTypeName += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1; // for example "diffuse".***
				}

				var texture_fileName_Legth = readWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
				for (var j=0; j<texture_fileName_Legth; j++) 
				{
					textureImageFileName += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
				}
				
				if (texture_fileName_Legth > 0)
				{
					neoRef.texture = new Texture();
					neoRef.hasTexture = true;
					neoRef.texture.textureTypeName = textureTypeName;
					neoRef.texture.textureImageFileName = textureImageFileName;
				}

				/*
				// 1pixel texture, wait for texture to load.********************************************
				if(neoRef.texture.texId === undefined)
					neoRef.texture.texId = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, neoRef.texture.texId);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([90, 80, 85, 255])); // red
				gl.bindTexture(gl.TEXTURE_2D, null);
				*/
			}
			else 
			{
				neoRef.hasTexture = false;
			}

			if (tMatrix4)
			{
				neoRef.multiplyTransformMatrix(tMatrix4);
			}
		}

	}
	
	this.createModelReferencedGroups(); // test for stadistics.
	

	// Now occlusion cullings.***
	// Occlusion culling octree data.*****
	if (this.exterior_ocCullOctree === undefined)
	{ this.exterior_ocCullOctree = new OcclusionCullingOctreeCell(); }

	var infiniteOcCullBox = this.exterior_ocCullOctree;
	//bytes_readed = this.readOcclusionCullingOctreeCell(arrayBuffer, bytes_readed, infiniteOcCullBox); // old.***
	bytes_readed = this.exterior_ocCullOctree.parseArrayBuffer(arrayBuffer, bytes_readed, readWriter);
	infiniteOcCullBox.expandBox(1000); // Only for the infinite box.***
	infiniteOcCullBox.setSizesSubBoxes();
	infiniteOcCullBox.createModelReferencedGroups(this.motherNeoRefsList);

	if (this.interior_ocCullOctree === undefined)
	{ this.interior_ocCullOctree = new OcclusionCullingOctreeCell(); }

	var ocCullBox = this.interior_ocCullOctree;
	//bytes_readed = this.readOcclusionCullingOctreeCell(arrayBuffer, bytes_readed, ocCullBox); // old.***
	bytes_readed = this.interior_ocCullOctree.parseArrayBuffer(arrayBuffer, bytes_readed, readWriter);
	ocCullBox.setSizesSubBoxes();
	ocCullBox.createModelReferencedGroups(this.motherNeoRefsList);

	this.fileLoadState = CODE.fileLoadState.PARSE_FINISHED;
	return this.succesfullyGpuDataBinded;
};













'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class NeoTexture
 */
var NeoTexture = function() 
{
	if (!(this instanceof NeoTexture)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.lod;
	this.textureId; // texture id in gl.***
	this.texImage; // image. delete this once upload to gl.***
	this.loadStarted = false;
	this.loadFinished = false;
};
'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class Octree
 *
 * @param octreeOwner 변수
 */
var Octree = function(octreeOwner) 
{
	if (!(this instanceof Octree)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	// Note: an octree is a cube, not a box.***
	this.centerPos = new Point3D();
	this.half_dx = 0.0; // half width.***
	this.half_dy = 0.0; // half length.***
	this.half_dz = 0.0; // half height.***

	this.octree_owner;
	this.octree_level = 0;
	this.octree_number_name = 0;
	this.squareDistToEye = 10000.0;
	this.triPolyhedronsCount = 0; // no calculated. Readed when parsing.***
	this.fileLoadState = CODE.fileLoadState.READY;

	if (octreeOwner) 
	{
		this.octree_owner = octreeOwner;
		this.octree_level = octreeOwner.octree_level + 1;
	}

	this.subOctrees_array = [];
	this.neoReferencesMotherAndIndices; // Asimetric mode.***

	// now, for legoStructure.***
	this.lego;
	
	// aditional data for web world wind, provisionally.******************
	this.provisionalSegmentsArray;
	// end provisional data.----------------------------------------------
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns subOctree 변수
 */
Octree.prototype.new_subOctree = function() 
{
	var subOctree = new Octree(this);
	subOctree.octree_level = this.octree_level + 1;
	this.subOctrees_array.push(subOctree);
	return subOctree;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
Octree.prototype.deleteGlObjects = function(gl, vboMemManager) 
{
	if (this.lego !== undefined) 
	{
		this.lego.deleteObjects(gl, vboMemManager);
		this.lego = undefined;
	}
	
	this.legoDataArrayBuffer = undefined;
	this.centerPos.deleteObjects();
	this.centerPos = undefined;
	this.half_dx = undefined; // half width.***
	this.half_dy = undefined; // half length.***
	this.half_dz = undefined; // half height.***

	this.octree_owner = undefined;
	this.octree_level = undefined;
	this.octree_number_name = undefined;
	this.squareDistToEye = undefined;
	this.triPolyhedronsCount = undefined; // no calculated. Readed when parsing.***
	this.fileLoadState = undefined; // 0 = no started to load. 1 = started loading. 2 = finished loading. 3 = parse started. 4 = parse finished.***

	this.neoBuildingOwner = undefined;

	if (this.neoReferencesMotherAndIndices)
	{ this.neoReferencesMotherAndIndices.deleteObjects(gl, vboMemManager); }

	this.neoReferencesMotherAndIndices = undefined;

	// delete the blocksList.***
	if (this.neoRefsList_Array !== undefined) 
	{
		for (var i=0, neoRefListsCount = this.neoRefsList_Array.length; i<neoRefListsCount; i++) 
		{
			if (this.neoRefsList_Array[i]) 
			{
				this.neoRefsList_Array[i].deleteGlObjects(gl, vboMemManager);
			}
			this.neoRefsList_Array[i] = undefined;
		}
		this.neoRefsList_Array = undefined;
	}

	if (this.subOctrees_array !== undefined) 
	{
		for (var i=0, subOctreesCount = this.subOctrees_array.length; i<subOctreesCount; i++) 
		{
			this.subOctrees_array[i].deleteGlObjects(gl, vboMemManager);
			this.subOctrees_array[i] = undefined;
		}
		this.subOctrees_array = undefined;
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
Octree.prototype.deleteLod0GlObjects = function(gl, vboMemManager) 
{
	if (this.neoReferencesMotherAndIndices)
	{ this.neoReferencesMotherAndIndices.deleteObjects(gl, vboMemManager); }

	if (this.subOctrees_array !== undefined) 
	{
		for (var i=0, subOctreesCount = this.subOctrees_array.length; i<subOctreesCount; i++) 
		{
			this.subOctrees_array[i].deleteLod0GlObjects(gl, vboMemManager);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
Octree.prototype.setRenderedFalseToAllReferences = function() 
{


	if (this.neoReferencesMotherAndIndices)
	{
		this.neoReferencesMotherAndIndices.setRenderedFalseToAllReferences();
		var subOctreesCount = this.subOctrees_array.length;
		for (var i=0; i<subOctreesCount; i++) 
		{
			this.subOctrees_array[i].setRenderedFalseToAllReferences();
		}
	}


};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
Octree.prototype.makeTree = function(treeDepth) 
{
	if (this.octree_level < treeDepth) 
	{
		for (var i=0; i<8; i++) 
		{
			var subOctree = this.new_subOctree();
			subOctree.octree_number_name = this.octree_number_name * 10 + (i+1);
		}

		this.setSizesSubBoxes();

		for (var i=0; i<8; i++) 
		{
			this.subOctrees_array[i].makeTree(treeDepth);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param intNumber 변수
 * @returns numDigits
 */
Octree.prototype.getNumberOfDigits = function(intNumber) 
{
	if (intNumber > 0) 
	{
		var numDigits = Math.floor(Math.log10(intNumber)+1);
		return numDigits;
	}
	else 
	{
		return 1;
	}
};

/**
 * 어떤 일을 하고 있습니까?
 */
Octree.prototype.getMotherOctree = function() 
{
	if (this.octree_owner === undefined) { return this; }

	return this.octree_owner.getMotherOctree();
};

/**
 * 어떤 일을 하고 있습니까?
 * @param octreeNumberName 변수
 * @param numDigits 변수
 * @returns subOctrees_array[idx-1].getOctree(rest_octreeNumberName, numDigits-1)
 */
Octree.prototype.getOctree = function(octreeNumberName, numDigits) 
{
	if (numDigits === 1) 
	{
		if (octreeNumberName === 0) { return this.getMotherOctree(); }
		else { return this.subOctrees_array[octreeNumberName-1]; }
	}

	// determine the next level octree.***
	var exp = numDigits-1;
	var denominator = Math.pow(10, exp);
	var idx = Math.floor(octreeNumberName /denominator) % 10;
	var rest_octreeNumberName = octreeNumberName - idx * denominator;
	return this.subOctrees_array[idx-1].getOctree(rest_octreeNumberName, numDigits-1);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param octreeNumberName 변수
 * @returns motherOctree.subOctrees_array[idx-1].getOctree(rest_octreeNumberName, numDigits-1)
 */
Octree.prototype.getOctreeByNumberName = function(octreeNumberName) 
{
	var motherOctree = this.getMotherOctree();
	var numDigits = this.getNumberOfDigits(octreeNumberName);
	if (numDigits === 1) 
	{
		if (octreeNumberName === 0) { return motherOctree; }
		else { return motherOctree.subOctrees_array[octreeNumberName-1]; }
	}

	if (motherOctree.subOctrees_array.length === 0) { return undefined; }

	// determine the next level octree.***
	var exp = numDigits-1;
	var denominator = Math.pow(10, exp);
	var idx = Math.floor(octreeNumberName /denominator) % 10;
	var rest_octreeNumberName = octreeNumberName - idx * denominator;
	return motherOctree.subOctrees_array[idx-1].getOctree(rest_octreeNumberName, numDigits-1);
};

/**
 * 어떤 일을 하고 있습니까?
 */
Octree.prototype.setSizesSubBoxes = function() 
{
	// Octree number name.********************************
	// Bottom                      Top
	// |---------|---------|     |---------|---------|
	// |         |         |     |         |         |       Y
	// |    3    |    2    |     |    7    |    6    |       ^
	// |         |         |     |         |         |       |
	// |---------+---------|     |---------+---------|       |
	// |         |         |     |         |         |       |
	// |    0    |    1    |     |    4    |    5    |       |
	// |         |         |     |         |         |       |-----------> X
	// |---------|---------|     |---------|---------|

	if (this.subOctrees_array.length > 0) 
	{
		var half_x = this.centerPos.x;
		var half_y = this.centerPos.y;
		var half_z = this.centerPos.z;

		var min_x = this.centerPos.x - this.half_dx;
		var min_y = this.centerPos.y - this.half_dy;
		var min_z = this.centerPos.z - this.half_dz;

		var max_x = this.centerPos.x + this.half_dx;
		var max_y = this.centerPos.y + this.half_dy;
		var max_z = this.centerPos.z + this.half_dz;

		this.subOctrees_array[0].setBoxSize(min_x, half_x, min_y, half_y, min_z, half_z);
		this.subOctrees_array[1].setBoxSize(half_x, max_x, min_y, half_y, min_z, half_z);
		this.subOctrees_array[2].setBoxSize(half_x, max_x, half_y, max_y, min_z, half_z);
		this.subOctrees_array[3].setBoxSize(min_x, half_x, half_y, max_y, min_z, half_z);

		this.subOctrees_array[4].setBoxSize(min_x, half_x, min_y, half_y, half_z, max_z);
		this.subOctrees_array[5].setBoxSize(half_x, max_x, min_y, half_y, half_z, max_z);
		this.subOctrees_array[6].setBoxSize(half_x, max_x, half_y, max_y, half_z, max_z);
		this.subOctrees_array[7].setBoxSize(min_x, half_x, half_y, max_y, half_z, max_z);

		for (var i=0; i<8; i++) 
		{
			this.subOctrees_array[i].setSizesSubBoxes();
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param Min_x 변수
 * @param Max_x 변수
 * @param Min_y 변수
 * @param Max_y 변수
 * @param Min_z 변수
 * @param Max_z 변수
 */
Octree.prototype.setBoxSize = function(Min_X, Max_X, Min_Y, Max_Y, Min_Z, Max_Z) 
{
	this.centerPos.x = (Max_X + Min_X)/2.0;
	this.centerPos.y = (Max_Y + Min_Y)/2.0;
	this.centerPos.z = (Max_Z + Min_Z)/2.0;

	this.half_dx = (Max_X - Min_X)/2.0; // half width.***
	this.half_dy = (Max_Y - Min_Y)/2.0; // half length.***
	this.half_dz = (Max_Z - Min_Z)/2.0; // half height.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns centerPos
 */
Octree.prototype.getCenterPos = function() 
{
	return this.centerPos;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns Math.abs(this.half_dx*1.2);
 */
Octree.prototype.getRadiusAprox = function() 
{
	//return Math.abs(this.half_dx*1.2);
	return Math.abs(this.half_dx*3.0);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_CRefListsArray 변수
 */
Octree.prototype.getCRefListArray = function(result_CRefListsArray) 
{
	if (result_CRefListsArray === undefined) { result_CRefListsArray = []; }

	if (this.subOctrees_array.length > 0) 
	{
		for (var i=0, subOctreesArrayLength = this.subOctrees_array.length; i<subOctreesArrayLength; i++) 
		{
			this.subOctrees_array[i].getCRefListArray(result_CRefListsArray);
		}
	}
	else 
	{
		if (this.compRefsListArray.length>0) 
		{
			result_CRefListsArray.push(this.compRefsListArray[0]); // there are only 1.***
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_NeoRefListsArray 변수
 */
Octree.prototype.getNeoRefListArray = function(result_NeoRefListsArray) 
{
	if (result_NeoRefListsArray === undefined) { result_NeoRefListsArray = []; }

	var subOctreesArrayLength = this.subOctrees_array.length;
	if (subOctreesArrayLength > 0) 
	{
		for (var i=0; i<subOctreesArrayLength; i++) 
		{
			this.subOctrees_array[i].getNeoRefListArray(result_NeoRefListsArray);
		}
	}
	else 
	{
		if (this.neoRefsList_Array.length>0) // original.***
		//if(this.triPolyhedronsCount>0)
		{
			result_NeoRefListsArray.push(this.neoRefsList_Array[0]); // there are only 1.***
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cesium_cullingVolume 변수
 * @param result_CRefListsArray 변수
 * @param cesium_boundingSphere_scratch 변수
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
Octree.prototype.getFrustumVisibleCRefListArray = function(cesium_cullingVolume, result_CRefListsArray, cesium_boundingSphere_scratch, eye_x, eye_y, eye_z) 
{
	var visibleOctreesArray = [];
	var sortedOctreesArray = [];
	var distAux = 0.0;

	//this.getAllSubOctrees(visibleOctreesArray); // Test.***
	this.getFrustumVisibleOctrees(cesium_cullingVolume, visibleOctreesArray, cesium_boundingSphere_scratch);

	// Now, we must sort the subOctrees near->far from eye.***
	var visibleOctrees_count = visibleOctreesArray.length;
	for (var i=0; i<visibleOctrees_count; i++) 
	{
		visibleOctreesArray[i].setSquareDistToEye(eye_x, eye_y, eye_z);
		this.putOctreeInEyeDistanceSortedArray(sortedOctreesArray, visibleOctreesArray[i], eye_x, eye_y, eye_z);
	}

	for (var i=0; i<visibleOctrees_count; i++) 
	{
		sortedOctreesArray[i].getCRefListArray(result_CRefListsArray);
		//visibleOctreesArray[i].getCRefListArray(result_CRefListsArray);
	}

	visibleOctreesArray.length = 0;
	excludedOctArray.length = 0;

	visibleOctreesArray = undefined;
	excludedOctArray = undefined;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cesium_cullingVolume 변수
 * @param result_NeoRefListsArray 변수
 * @param cesium_boundingSphere_scratch 변수
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
Octree.prototype.getFrustumVisibleNeoRefListArray = function(cesium_cullingVolume, result_NeoRefListsArray, cesium_boundingSphere_scratch, eye_x, eye_y, eye_z) 
{
	var visibleOctreesArray = [];
	var sortedOctreesArray = [];
	var distAux = 0.0;

	//this.getAllSubOctrees(visibleOctreesArray); // Test.***
	this.getFrustumVisibleOctreesNeoBuilding(cesium_cullingVolume, visibleOctreesArray, cesium_boundingSphere_scratch); // Original.***

	// Now, we must sort the subOctrees near->far from eye.***
	var visibleOctrees_count = visibleOctreesArray.length;
	for (var i=0; i<visibleOctrees_count; i++) 
	{
		visibleOctreesArray[i].setSquareDistToEye(eye_x, eye_y, eye_z);
		this.putOctreeInEyeDistanceSortedArray(sortedOctreesArray, visibleOctreesArray[i], eye_x, eye_y, eye_z);
	}

	for (var i=0; i<visibleOctrees_count; i++) 
	{
		sortedOctreesArray[i].getNeoRefListArray(result_NeoRefListsArray);
	}

	visibleOctreesArray = null;
	sortedOctreesArray = null;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cullingVolume 변수
 * @param result_NeoRefListsArray 변수
 * @param boundingSphere_scratch 변수
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
Octree.prototype.getBBoxIntersectedLowestOctreesByLOD = function(bbox, visibleObjControlerOctrees, globalVisibleObjControlerOctrees,
	bbox_scratch, eye_x, eye_y, eye_z, squaredDistLod0, squaredDistLod1, squaredDistLod2 ) 
{
	var visibleOctreesArray = [];
	var distAux = 0.0;
	var find = false;

	this.getBBoxIntersectedOctreesNeoBuildingAsimetricVersion(bbox, visibleOctreesArray, bbox_scratch);
	//this.getFrustumVisibleOctreesNeoBuildingAsimetricVersion(cullingVolume, visibleOctreesArray, boundingSphere_scratch); // Original.***

	// Now, we must sort the subOctrees near->far from eye.***
	var visibleOctrees_count = visibleOctreesArray.length;
	for (var i=0; i<visibleOctrees_count; i++) 
	{
		visibleOctreesArray[i].setSquareDistToEye(eye_x, eye_y, eye_z);
	}

	for (var i=0; i<visibleOctrees_count; i++) 
	{
		if (visibleOctreesArray[i].squareDistToEye < squaredDistLod0) 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles0, visibleOctreesArray[i], eye_x, eye_y, eye_z); }
				visibleObjControlerOctrees.currentVisibles0.push(visibleOctreesArray[i]);
				find = true;
			}
		}
		else if (visibleOctreesArray[i].squareDistToEye < squaredDistLod1) 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles1, visibleOctreesArray[i], eye_x, eye_y, eye_z); }
				visibleObjControlerOctrees.currentVisibles1.push(visibleOctreesArray[i]);
				find = true;
			}
		}
		else if (visibleOctreesArray[i].squareDistToEye < squaredDistLod2) 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles2, visibleOctreesArray[i], eye_x, eye_y, eye_z); }
				visibleObjControlerOctrees.currentVisibles2.push(visibleOctreesArray[i]);
				find = true;
			}
		}
		else 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles3, visibleOctreesArray[i], eye_x, eye_y, eye_z); }
				visibleObjControlerOctrees.currentVisibles3.push(visibleOctreesArray[i]);
				find = true;
			}
		}
	}

	visibleOctreesArray = null;
	return find;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cullingVolume 변수
 * @param result_NeoRefListsArray 변수
 * @param boundingSphere_scratch 변수
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
Octree.prototype.getFrustumVisibleLowestOctreesByLOD = function(cullingVolume, visibleObjControlerOctrees, globalVisibleObjControlerOctrees,
	boundingSphere_scratch, eye_x, eye_y, eye_z, squaredDistLod0, squaredDistLod1, squaredDistLod2 ) 
{
	var visibleOctreesArray = [];
	var distAux = 0.0;
	var find = false;

	//this.getAllSubOctrees(visibleOctreesArray); // Test.***
	this.getFrustumVisibleOctreesNeoBuildingAsimetricVersion(cullingVolume, visibleOctreesArray, boundingSphere_scratch); // Original.***

	// Now, we must sort the subOctrees near->far from eye.***
	var visibleOctrees_count = visibleOctreesArray.length;
	for (var i=0; i<visibleOctrees_count; i++) 
	{
		visibleOctreesArray[i].setSquareDistToEye(eye_x, eye_y, eye_z);
	}

	for (var i=0; i<visibleOctrees_count; i++) 
	{
		if (visibleOctreesArray[i].squareDistToEye < squaredDistLod0) 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles0, visibleOctreesArray[i], eye_x, eye_y, eye_z); }
				visibleObjControlerOctrees.currentVisibles0.push(visibleOctreesArray[i]);
				find = true;
			}
		}
		else if (visibleOctreesArray[i].squareDistToEye < squaredDistLod1) 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles1, visibleOctreesArray[i], eye_x, eye_y, eye_z); }
				visibleObjControlerOctrees.currentVisibles1.push(visibleOctreesArray[i]);
				find = true;
			}
		}
		else if (visibleOctreesArray[i].squareDistToEye < squaredDistLod2) 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles2, visibleOctreesArray[i], eye_x, eye_y, eye_z); }
				visibleObjControlerOctrees.currentVisibles2.push(visibleOctreesArray[i]);
				find = true;
			}
		}
		else 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ globalVisibleObjControlerOctrees.currentVisibles3.push(visibleOctreesArray[i]); }
				visibleObjControlerOctrees.currentVisibles3.push(visibleOctreesArray[i]);
				find = true;
			}
		}
	}

	visibleOctreesArray = null;
	return find;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cullingVolume 변수
 * @param result_NeoRefListsArray 변수
 * @param boundingSphere_scratch 변수
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
Octree.prototype.extractLowestOctreesByLOD = function(visibleObjControlerOctrees, globalVisibleObjControlerOctrees,
	boundingSphere_scratch, eye_x, eye_y, eye_z, squaredDistLod0, squaredDistLod1, squaredDistLod2 ) 
{
	var lowestOctreesArray = [];
	var distAux = 0.0;
	var find = false;

	this.extractLowestOctreesIfHasTriPolyhedrons(lowestOctreesArray);
	
	// Now, we must sort the subOctrees near->far from eye.***
	var visibleOctrees_count = lowestOctreesArray.length;
	for (var i=0; i<visibleOctrees_count; i++) 
	{
		lowestOctreesArray[i].setSquareDistToEye(eye_x, eye_y, eye_z);
	}

	for (var i=0; i<visibleOctrees_count; i++) 
	{
		if (lowestOctreesArray[i].squareDistToEye < squaredDistLod0) 
		{
			if (lowestOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles0, lowestOctreesArray[i], eye_x, eye_y, eye_z); }
				visibleObjControlerOctrees.currentVisibles0.push(lowestOctreesArray[i]);
				find = true;
			}
		}
		else if (lowestOctreesArray[i].squareDistToEye < squaredDistLod1) 
		{
			if (lowestOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles1, lowestOctreesArray[i], eye_x, eye_y, eye_z); }
				visibleObjControlerOctrees.currentVisibles1.push(lowestOctreesArray[i]);
				find = true;
			}
		}
		else if (lowestOctreesArray[i].squareDistToEye < squaredDistLod2) 
		{
			if (lowestOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles2, lowestOctreesArray[i], eye_x, eye_y, eye_z); }
				visibleObjControlerOctrees.currentVisibles2.push(lowestOctreesArray[i]);
				find = true;
			}
		}
		else 
		{
			if (lowestOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ globalVisibleObjControlerOctrees.currentVisibles3.push(lowestOctreesArray[i]); }
				visibleObjControlerOctrees.currentVisibles3.push(lowestOctreesArray[i]);
				find = true;
			}
		}
	}

	return find;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cesium_cullingVolume 변수
 * @param result_octreesArray 변수
 * @param cesium_boundingSphere_scratch 변수
 */
Octree.prototype.getFrustumVisibleOctreesNeoBuilding = function(cesium_cullingVolume, result_octreesArray, cesium_boundingSphere_scratch) 
{
	if (this.subOctrees_array.length === 0 && this.neoRefsList_Array.length === 0) // original.***
	//if(this.subOctrees_array.length === 0 && this.triPolyhedronsCount === 0)
	//if(this.subOctrees_array.length === 0 && this.compRefsListArray.length === 0) // For use with ifc buildings.***
	{ return; }

	// this function has Cesium dependence.***
	if (result_octreesArray === undefined) { result_octreesArray = []; }

	if (cesium_boundingSphere_scratch === undefined) { cesium_boundingSphere_scratch = new Cesium.BoundingSphere(); } // Cesium dependency.***

	cesium_boundingSphere_scratch.center.x = this.centerPos.x;
	cesium_boundingSphere_scratch.center.y = this.centerPos.y;
	cesium_boundingSphere_scratch.center.z = this.centerPos.z;

	if (this.subOctrees_array.length === 0) 
	{
	//cesium_boundingSphere_scratch.radius = this.getRadiusAprox()*0.7;
		cesium_boundingSphere_scratch.radius = this.getRadiusAprox();
	}
	else 
	{
		cesium_boundingSphere_scratch.radius = this.getRadiusAprox();
	}

	var frustumCull = cesium_cullingVolume.computeVisibility(cesium_boundingSphere_scratch);
	if (frustumCull === Cesium.Intersect.INSIDE ) 
	{
		//result_octreesArray.push(this);
		this.getAllSubOctreesIfHasRefLists(result_octreesArray);
	}
	else if (frustumCull === Cesium.Intersect.INTERSECTING  ) 
	{
		if (this.subOctrees_array.length === 0) 
		{
			//if(this.neoRefsList_Array.length > 0) // original.***
			//if(this.triPolyhedronsCount > 0)
			result_octreesArray.push(this);
		}
		else 
		{
			for (var i=0, subOctreesArrayLength = this.subOctrees_array.length; i<subOctreesArrayLength; i++ ) 
			{
				this.subOctrees_array[i].getFrustumVisibleOctreesNeoBuilding(cesium_cullingVolume, result_octreesArray, cesium_boundingSphere_scratch);
			}
		}
	}
	// else if(frustumCull === Cesium.Intersect.OUTSIDE) => do nothing.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cesium_cullingVolume 변수
 * @param result_octreesArray 변수
 * @param boundingSphere_scratch 변수
 */
Octree.prototype.getFrustumVisibleOctreesNeoBuildingAsimetricVersion = function(cullingVolume, result_octreesArray, boundingSphere_scratch) 
{
	//if(this.subOctrees_array.length === 0 && this.neoRefsList_Array.length === 0) // original.***
	if (this.subOctrees_array === undefined) { return; }

	if (this.subOctrees_array.length === 0 && this.triPolyhedronsCount === 0)
	//if(this.subOctrees_array.length === 0 && this.compRefsListArray.length === 0) // For use with ifc buildings.***
	{ return; }

	if (result_octreesArray === undefined) { result_octreesArray = []; }
	
	if (boundingSphere_scratch === undefined) 
	{ boundingSphere_scratch = new Sphere(); } 

	boundingSphere_scratch.centerPoint.x = this.centerPos.x;
	boundingSphere_scratch.centerPoint.y = this.centerPos.y;
	boundingSphere_scratch.centerPoint.z = this.centerPos.z;
	boundingSphere_scratch.r = this.getRadiusAprox();

	var frustumCull = cullingVolume.intersectionSphere(boundingSphere_scratch);
	if (frustumCull === Constant.INTERSECTION_INSIDE ) 
	{
		//result_octreesArray.push(this);
		this.getAllSubOctreesIfHasRefLists(result_octreesArray);
	}
	else if (frustumCull === Constant.INTERSECTION_INTERSECT  ) 
	{
		if (this.subOctrees_array.length === 0) 
		{
			//if(this.neoRefsList_Array.length > 0) // original.***
			//if(this.triPolyhedronsCount > 0)
			result_octreesArray.push(this);
		}
		else 
		{
			for (var i=0, subOctreesArrayLength = this.subOctrees_array.length; i<subOctreesArrayLength; i++ ) 
			{
				this.subOctrees_array[i].getFrustumVisibleOctreesNeoBuildingAsimetricVersion(cullingVolume, result_octreesArray, boundingSphere_scratch);
			}
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cesium_cullingVolume 변수
 * @param result_octreesArray 변수
 * @param boundingSphere_scratch 변수
 */
Octree.prototype.getBBoxIntersectedOctreesNeoBuildingAsimetricVersion = function(bbox, result_octreesArray, bbox_scratch) 
{
	//if(this.subOctrees_array.length === 0 && this.neoRefsList_Array.length === 0) // original.***
	if (this.subOctrees_array === undefined) { return; }

	if (this.subOctrees_array.length === 0 && this.triPolyhedronsCount === 0)
	//if(this.subOctrees_array.length === 0 && this.compRefsListArray.length === 0) // For use with ifc buildings.***
	{ return; }

	if (result_octreesArray === undefined) { result_octreesArray = []; }
	
	if (bbox_scratch === undefined) 
	{ bbox_scratch = new BoundingBox(); } 
	

	bbox_scratch.minX = this.centerPos.x - this.half_dx;
	bbox_scratch.maxX = this.centerPos.x + this.half_dx;
	bbox_scratch.minY = this.centerPos.y - this.half_dy;
	bbox_scratch.maxY = this.centerPos.y + this.half_dy;
	bbox_scratch.minZ = this.centerPos.z - this.half_dz;
	bbox_scratch.maxZ = this.centerPos.z + this.half_dz;

	var intersects = bbox.intersectsWithBBox(bbox_scratch);
	if (intersects)
	{
		this.getAllSubOctreesIfHasRefLists(result_octreesArray);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cesium_cullingVolume 변수
 * @param result_octreesArray 변수
 * @param cesium_boundingSphere_scratch 변수
 */
Octree.prototype.getFrustumVisibleOctrees = function(cesium_cullingVolume, result_octreesArray, cesium_boundingSphere_scratch) 
{
	if (this.subOctrees_array.length === 0 && this.compRefsListArray.length === 0) // For use with ifc buildings.***
	{ return; }
	// old. delete this.***
	// this function has Cesium dependence.***
	if (result_octreesArray === undefined) { result_octreesArray = []; }

	if (cesium_boundingSphere_scratch === undefined) { cesium_boundingSphere_scratch = new Cesium.BoundingSphere(); } // Cesium dependency.***

	cesium_boundingSphere_scratch.center.x = this.centerPos.x;
	cesium_boundingSphere_scratch.center.y = this.centerPos.y;
	cesium_boundingSphere_scratch.center.z = this.centerPos.z;

	if (this.subOctrees_array.length === 0) 
	{
	//cesium_boundingSphere_scratch.radius = this.getRadiusAprox()*0.7;
		cesium_boundingSphere_scratch.radius = this.getRadiusAprox();
	}
	else 
	{
		cesium_boundingSphere_scratch.radius = this.getRadiusAprox();
	}

	var frustumCull = cesium_cullingVolume.computeVisibility(cesium_boundingSphere_scratch);
	if (frustumCull === Cesium.Intersect.INSIDE ) 
	{
		//result_octreesArray.push(this);
		this.getAllSubOctrees(result_octreesArray);
	}
	else if (frustumCull === Cesium.Intersect.INTERSECTING ) 
	{
		if (this.subOctrees_array.length === 0 && this.neoRefsList_Array.length > 0) 
		{
			result_octreesArray.push(this);
		}
		else 
		{
			for (var i=0, subOctreesArrayLength = this.subOctrees_array.length; i<subOctreesArrayLength; i++ ) 
			{
				this.subOctrees_array[i].getFrustumVisibleOctrees(cesium_cullingVolume, result_octreesArray, cesium_boundingSphere_scratch);
			}
		}
	}
	// else if(frustumCull === Cesium.Intersect.OUTSIDE) => do nothing.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
Octree.prototype.setSquareDistToEye = function(eye_x, eye_y, eye_z) 
{
	this.squareDistToEye = (this.centerPos.x - eye_x)*(this.centerPos.x - eye_x) +
							(this.centerPos.y - eye_y)*(this.centerPos.y - eye_y) +
							(this.centerPos.z - eye_z)*(this.centerPos.z - eye_z) ;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param octreesArray 변수
 * @param octree 변수
 * @returns result_idx
 */
Octree.prototype.getIndexToInsertBySquaredDistToEye = function(octreesArray, octree) 
{
	// lineal implementation. In the future use dicotomic search technique.***
	var finished = false;
	var octrees_count = octreesArray.length;
	var i=0;
	var result_idx = 0;

	while (!finished && i<octrees_count) 
	{
		if (octreesArray[i].squareDistToEye > octree.squareDistToEye) 
		{
			result_idx = i;
			finished = true;
		}
		i++;
	}
	if (!finished) 
	{
		result_idx = octrees_count;
	}

	return result_idx;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_octreesArray 변수
 * @param octree 변수
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
Octree.prototype.putOctreeInEyeDistanceSortedArray = function(result_octreesArray, octree, eye_x, eye_y, eye_z) 
{
	// sorting is from minDist to maxDist.***
	// http://stackoverflow.com/questions/586182/how-to-insert-an-item-into-an-array-at-a-specific-index

	var insert_idx= this.getIndexToInsertBySquaredDistToEye(result_octreesArray, octree);

	result_octreesArray.splice(insert_idx, 0, octree);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_octreesArray 변수
 */
Octree.prototype.getAllSubOctreesIfHasRefLists = function(result_octreesArray) 
{
	if (this.subOctrees_array === undefined) { return; }

	if (result_octreesArray === undefined) { result_octreesArray = []; }

	if (this.subOctrees_array.length > 0) 
	{
		for (var i=0, subOctreesArrayLength = this.subOctrees_array.length; i<subOctreesArrayLength; i++) 
		{
			this.subOctrees_array[i].getAllSubOctreesIfHasRefLists(result_octreesArray);
		}
	}
	else 
	{
		//if(this.neoRefsList_Array.length > 0)
		if (this.triPolyhedronsCount > 0) { result_octreesArray.push(this); } // there are only 1.***
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_octreesArray 변수
 */
Octree.prototype.getAllSubOctrees = function(result_octreesArray) 
{
	if (result_octreesArray === undefined) { result_octreesArray = []; }

	if (this.subOctrees_array.length > 0) 
	{
		for (var i=0, subOctreesArrayLength = this.subOctrees_array.length; i<subOctreesArrayLength; i++) 
		{
			this.subOctrees_array[i].getAllSubOctrees(result_octreesArray);
		}
	}
	else 
	{
		result_octreesArray.push(this); // there are only 1.***
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_octreesArray 변수
 */
Octree.prototype.extractLowestOctreesIfHasTriPolyhedrons = function(lowestOctreesArray) 
{
	if (this.subOctrees_array == undefined)
	{ return; }
	
	var subOctreesCount = this.subOctrees_array.length;

	if (subOctreesCount === 0 && this.triPolyhedronsCount > 0) 
	{
		lowestOctreesArray.push(this);
	}
	else 
	{
		for (var i=0; i<subOctreesCount; i++) 
		{
			this.subOctrees_array[i].extractLowestOctreesIfHasTriPolyhedrons(lowestOctreesArray);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_octreesArray 변수
 */
Octree.prototype.multiplyKeyTransformMatrix = function(idxKey, matrix) 
{
	var subOctreesCount = this.subOctrees_array.length;

	if (subOctreesCount === 0 && this.triPolyhedronsCount > 0) 
	{
		if (this.neoReferencesMotherAndIndices)
		{ this.neoReferencesMotherAndIndices.multiplyKeyTransformMatrix(idxKey, matrix); }
	}
	else 
	{
		for (var i=0; i<subOctreesCount; i++) 
		{
			this.subOctrees_array[i].multiplyKeyTransformMatrix(idxKey, matrix);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_octreesArray 변수
 */
Octree.prototype.parseAsimetricVersion = function(arrayBuffer, readerWriter, bytesReaded, neoBuildingOwner) 
{
	var octreeLevel = readerWriter.readInt32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;

	if (octreeLevel === 0) 
	{
		// this is the mother octree, so read the mother octree's size.***
		var minX = readerWriter.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		var maxX = readerWriter.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		var minY = readerWriter.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		var maxY = readerWriter.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		var minZ = readerWriter.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		var maxZ = readerWriter.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;

		this.setBoxSize(minX, maxX, minY, maxY, minZ, maxZ );
		this.octree_number_name = 0;
	}

	var subOctreesCount = readerWriter.readUInt8(arrayBuffer, bytesReaded, bytesReaded+1); bytesReaded += 1; // this must be 0 or 8.***
	this.triPolyhedronsCount = readerWriter.readInt32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
	if (this.triPolyhedronsCount > 0)
	{ this.neoBuildingOwner = neoBuildingOwner; }

	// 1rst, create the 8 subOctrees.***
	for (var i=0; i<subOctreesCount; i++) 
	{
		var subOctree = this.new_subOctree();
		subOctree.octree_number_name = this.octree_number_name * 10 + (i+1);
	}

	// now, set size of subOctrees.***
	this.setSizesSubBoxes();

	for (var i=0; i<subOctreesCount; i++) 
	{
		var subOctree = this.subOctrees_array[i];
		bytesReaded = subOctree.parseAsimetricVersion(arrayBuffer, readerWriter, bytesReaded, neoBuildingOwner);
	}

	return bytesReaded;
};

'use strict';

/**
 * ParseQueue
 * 
 * @alias ParseQueue
 * @class ParseQueue
 */
var ParseQueue = function() 
{
	if (!(this instanceof ParseQueue)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.octreesLod0ReferencesToParseArray = [];
	this.octreesLod0ModelsToParseArray = [];
	this.octreesLod2LegosToParseArray = [];
	this.neoBuildingsHeaderToParseArray = [];
};
'use strict';

/**
 * ProcessQueue
 * 
 * @alias ProcessQueue
 * @class ProcessQueue
 */
var ProcessQueue = function() 
{
	if (!(this instanceof ProcessQueue)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.buildingsToDelete = [];
};
'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class ReaderWriter
 */
var ReaderWriter = function() 
{
	if (!(this instanceof ReaderWriter)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	//this.geometryDataPath = "/F4D_GeometryData";
	this.geometryDataPath = MagoConfig.getPolicy().geo_data_path;
	this.viArraysContainer = new VertexIdxVBOArraysContainer();
	this.byteColorsVBOArraysContainer = new ByteColorsVBOArraysContainer();
	//var simpleBuildingImage = new Image();

	this.j_counter;
	this.k_counter;

	this.gl;
	this.incre_latAng = 0.001;
	this.incre_longAng = 0.001;
	this.GAIA3D__offset_latitude = -0.001;
	this.GAIA3D__offset_longitude = -0.001;
	this.GAIA3D__counter = 0;

	// Var for reading files.
	this.uint32;
	this.uint16;
	this.int16;
	this.float32;
	this.float16;
	this.int8;
	this.int8_value;
	this.max_color_value = 126;

	this.startBuff;
	this.endBuff;

	this.filesReadings_count = 0;

	// SCRATCH.*** 
	this.temp_var_to_waste;
	this.countSC;
	this.xSC;
	this.ySC;
	this.zSC;
	this.point3dSC = new Point3D();
	this.bboxSC = new BoundingBox();
};

/**
 * 버퍼에서 데이터를 읽어서 32비트 부호없는 정수값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns uint32[0]
 */
ReaderWriter.prototype.readUInt32 = function(buffer, start, end) 
{
	var uint32 = new Uint32Array(buffer.slice(start, end));
	return uint32[0];
};

/**
 * 버퍼에서 데이터를 읽어서 32비트 정수값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns int32[0]
 */
ReaderWriter.prototype.readInt32 = function(buffer, start, end) 
{
	var int32 = new Int32Array(buffer.slice(start, end));
	return int32[0];
};

/**
 * 버퍼에서 데이터를 읽어서 16비트 부호없는 정수값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns uint16[0]
 */
ReaderWriter.prototype.readUInt16 = function(buffer, start, end) 
{
	var uint16 = new Uint16Array(buffer.slice(start, end));
	return uint16[0];
};

/**
 * 버퍼에서 데이터를 읽어서 32비트 정수값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns int16[0]
 */
ReaderWriter.prototype.readInt16 = function(buffer, start, end) 
{
	var int16 = new Int16Array(buffer.slice(start, end));
	return int16[0];
};

/**
 * 버퍼에서 데이터를 읽어서 64비트 float값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns float64[0]
 */
ReaderWriter.prototype.readFloat64 = function(buffer, start, end) 
{
	var float64 = new Float64Array(buffer.slice(start, end));
	return float64[0];
};

/**
 * 버퍼에서 데이터를 읽어서 32비트 float값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns float32[0]
 */
ReaderWriter.prototype.readFloat32 = function(buffer, start, end) 
{
	var float32 = new Float32Array(buffer.slice(start, end));
	return float32[0];
};

/**
 * 버퍼에서 데이터를 읽어서 32비트 부호없는 정수값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns float16[0]
 */
ReaderWriter.prototype.readFloat16 = function(buffer, start, end) 
{
	var float16 = new Float32Array(buffer.slice(start, end));
	return float16[0];
};

/**
 * 버퍼에서 데이터를 읽어서 8비트 정수값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns int8[0]
 */
ReaderWriter.prototype.readInt8 = function(buffer, start, end) 
{
	var int8 = new Int8Array(buffer.slice(start, end));
	return int8[0];
};

/**
 * 버퍼에서 데이터를 읽어서 8비트 부호없는 정수값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns uint8[0]
 */
ReaderWriter.prototype.readUInt8 = function(buffer, start, end) 
{
	var uint8 = new Uint8Array(buffer.slice(start, end));
	return uint8[0];
};

/**
 * 어떤 일을 하고 있습니까?
 * @param buffer 변수
 * @param start 변수
 * @param end 변수
 * @returns int8_value
 */
ReaderWriter.prototype.readInt8ByteColor = function(buffer, start, end) 
{
	var int8 = new Int8Array(buffer.slice(start, end));
	var int8_value = int8[0];

	if (int8_value > max_color_value) { int8_value = max_color_value; }

	if (int8_value < 0) { int8_value += 256; }

	return int8_value;
};

function loadWithXhr(fileName) 
{
	// 1) 사용될 jQuery Deferred 객체를 생성한다.
	var deferred = $.Deferred();
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", fileName, true);
	xhr.responseType = "arraybuffer";;
	  
	// 이벤트 핸들러를 등록한다.
	xhr.onload = function() 
	{
		if (xhr.status < 200 || xhr.status >= 300) 
		{
			deferred.reject(xhr.status);
			return;
		}
		else 
		{
			// 3.1) DEFERRED를 해결한다. (모든 done()...을 동작시킬 것이다.)
			deferred.resolve(xhr.response);
		} 
	};
	
	xhr.onerror = function(e) 
	{
		console.log("Invalid XMLHttpRequest response type.");
		deferred.reject(xhr.status);
	};

	// 작업을 수행한다.
	xhr.send(null);
	
	// 참고: jQuery.ajax를 사용할 수 있었고 해야할 수 있었다.
	// 참고: jQuery.ajax는 Promise를 반환하지만 다른 Deferred/Promise를 사용하여 애플리케이션에 의미있는 구문으로 감싸는 것은 언제나 좋은 생각이다.
	// ---- /AJAX 호출 ---- //
	  
	// 2) 이 deferred의 promise를 반환한다.
	return deferred.promise();
};

/**
 * 어떤 일을 하고 있습니까?
 * @param float32Array 변수
 * @param resultBbox 변수
 * @returns resultBbox
 */
ReaderWriter.prototype.getBoundingBoxFromFloat32Array = function(float32Array, resultBbox) 
{
	if (resultBbox === undefined) { resultBbox = new BoundingBox(); }

	var values_count = float32Array.length;
	for (var i=0; i<values_count; i+=3) 
	{
		this.point3dSC.x = float32Array[i];
		this.point3dSC.y = float32Array[i+1];
		this.point3dSC.z = float32Array[i+2];

		if (i===0) 
		{
			resultBbox.init(this.point3dSC);
		}
		else 
		{
			resultBbox.addPoint(this.point3dSC);
		}
	}

	return resultBbox;
};

ReaderWriter.prototype.getNeoBlocksArraybuffer = function(fileName, lowestOctree, magoManager) 
{
	magoManager.fileRequestControler.filesRequestedCount += 1;
	var blocksList = lowestOctree.neoReferencesMotherAndIndices.blocksList;
	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;
	
	loadWithXhr(fileName).done(function(response) 
	{
		var arrayBuffer = response;
		if (arrayBuffer) 
		{
			blocksList.dataArraybuffer = arrayBuffer;
			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
			magoManager.parseQueue.octreesLod0ModelsToParseArray.push(lowestOctree);
		}
		else 
		{
			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) 
	{
		console.log("Invalid XMLHttpRequest status = " + status);
		if (status === 0) { blocksList.fileLoadState = 500; }
		else { blocksList.fileLoadState = status; }
	}).always(function() 
	{
		magoManager.fileRequestControler.filesRequestedCount -= 1;
		if (magoManager.fileRequestControler.filesRequestedCount < 0) { magoManager.fileRequestControler.filesRequestedCount = 0; }
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 변수
 * @param blocksList 변수
 * @param neoBuilding 변수
 * @param readerWriter 변수
 */
ReaderWriter.prototype.getNeoBlocks = function(gl, fileName, blocksList, readerWriter, magoManager) 
{
//	magoManager.fileRequestControler.neoBuildingBlocksListsRequestedCount += 1;
	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) 
	{
		var arrayBuffer = response;
		if (arrayBuffer) 
		{
			readerWriter.readNeoBlocks(gl, arrayBuffer, blocksList);
			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
		}
		else 
		{
			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) 
	{
		console.log("xhr status = " + status);
		if (status === 0) { blocksList.fileLoadState = 500; }
		else { blocksList.fileLoadState = status; }
	}).always(function() 
	{
		//		magoManager.fileRequestControler.neoBuildingBlocksListsRequestedCount -= 1;
		//		if(magoManager.fileRequestControler.neoBuildingBlocksListsRequestedCount < 0) magoManager.fileRequestControler.neoBuildingBlocksListsRequestedCount = 0;
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 파일명
 * @param magoManager 변수
 */
ReaderWriter.prototype.getNeoReferencesArraybuffer = function(fileName, lowestOctree, magoManager) 
{
	magoManager.fileRequestControler.filesRequestedCount += 1;
	lowestOctree.neoReferencesMotherAndIndices.fileLoadState = CODE.fileLoadState.LOADING_STARTED;
	
	loadWithXhr(fileName).done(function(response) 
	{
		var arrayBuffer = response;
		if (arrayBuffer) 
		{
			var neoRefsList = lowestOctree.neoReferencesMotherAndIndices;
			if (neoRefsList)
			{
				neoRefsList.dataArraybuffer = arrayBuffer;
				neoRefsList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
				magoManager.parseQueue.octreesLod0ReferencesToParseArray.push(lowestOctree);
			}
			arrayBuffer = null;
			
		}
		else 
		{
			lowestOctree.neoReferencesMotherAndIndices.fileLoadState = 500;
		}
	}).fail(function(status) 
	{
		console.log("xhr status = " + status);
		if (status === 0) { lowestOctree.neoReferencesMotherAndIndices.fileLoadState = 500; }
		else { lowestOctree.neoReferencesMotherAndIndices.fileLoadState = status; }
	}).always(function() 
	{
		magoManager.fileRequestControler.filesRequestedCount -= 1;
		if (magoManager.fileRequestControler.filesRequestedCount < 0) { magoManager.fileRequestControler.filesRequestedCount = 0; }
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 파일명
 * @param magoManager 변수
 */
ReaderWriter.prototype.getOctreeLegoArraybuffer = function(fileName, lowestOctree, magoManager) 
{
	magoManager.fileRequestControler.filesRequestedCount += 1;
	lowestOctree.lego.fileLoadState = CODE.fileLoadState.LOADING_STARTED;
	
	loadWithXhr(fileName).done(function(response) 
	{
		var arrayBuffer = response;
		if (arrayBuffer) 
		{
			if (lowestOctree.lego)
			{
				lowestOctree.lego.dataArrayBuffer = arrayBuffer;
				lowestOctree.lego.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
				magoManager.parseQueue.octreesLod2LegosToParseArray.push(lowestOctree);
			}
			else 
			{
				lowestOctree = undefined;
			}
			arrayBuffer = null;
		}
		else 
		{
			lowestOctree.lego.fileLoadState = 500;
		}
	}).fail(function(status) 
	{
		console.log("xhr status = " + status);
		if (status === 0) { lowestOctree.lego.fileLoadState = 500; }
		else { lowestOctree.lego.fileLoadState = status; }
	}).always(function() 
	{
		magoManager.fileRequestControler.filesRequestedCount -= 1;
		if (magoManager.fileRequestControler.filesRequestedCount < 0) { magoManager.fileRequestControler.filesRequestedCount = 0; }
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param fileName 변수
 * @param lodBuilding 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.getLodBuildingArraybuffer = function(fileName, lodBuilding, magoManager) 
{
	magoManager.fileRequestControler.filesRequestedCount += 1;
	lodBuilding.fileLoadState = CODE.fileLoadState.LOADING_STARTED;
	
	loadWithXhr(fileName).done(function(response) 
	{
		var arrayBuffer = response;
		if (arrayBuffer) 
		{
			lodBuilding.dataArraybuffer = arrayBuffer;
			lodBuilding.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
		}
		else 
		{
			lodBuilding.fileLoadState = 500;
		}
	}).fail(function(status) 
	{
		console.log("xhr status = " + status);
		if (status === 0) { lodBuilding.fileLoadState = 500; }
		else { lodBuilding.fileLoadState = status; }
	}).always(function() 
	{
		magoManager.fileRequestControler.filesRequestedCount -= 1;
		if (magoManager.fileRequestControler.filesRequestedCount < 0) { magoManager.fileRequestControler.filesRequestedCount = 0; }
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param arrayBuffer 변수
 * @param filePath_inServer 변수
 * @param terranTile 변수
 * @param readerWriter 변수
 * @param bytes_readed 변수
 * @returns bytes_readed
 */
ReaderWriter.prototype.readTerranTileFile = function(gl, arrayBuffer, filePath_inServer, terranTile, readerWriter, bytes_readed) 
{
	//var bytes_readed = 0;
//	var f4d_headerPathName_length = 0;
//	var BP_Project;
//	var idxFile;
//	var subTile;

	terranTile._depth = this.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
	if (terranTile._depth === 0) 
	{
		// Read dimensions.***
		terranTile.longitudeMin = this.readFloat64(arrayBuffer, bytes_readed, bytes_readed+8); bytes_readed += 8;
		terranTile.longitudeMax = this.readFloat64(arrayBuffer, bytes_readed, bytes_readed+8); bytes_readed += 8;
		terranTile.latitudeMin = this.readFloat64(arrayBuffer, bytes_readed, bytes_readed+8); bytes_readed += 8;
		terranTile.latitudeMax = this.readFloat64(arrayBuffer, bytes_readed, bytes_readed+8); bytes_readed += 8;
	}

	// Read the max_depth of the quadtree.***
	var max_dpeth = this.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;

	// Now, make the quadtree.***
	terranTile.makeTree(max_dpeth);

	return bytes_readed;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 변수
 * @param terranTile 변수
 * @param readerWriter 변수
 */
ReaderWriter.prototype.getTerranTileFile = function(gl, fileName, terranTile, readerWriter) 
{
	// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
//	magoManager.fileRequestControler.filesRequestedCount += 1;
//	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) 
	{
		var arrayBuffer = response;
		if (arrayBuffer) 
		{
			var bytes_readed = 0;
			readerWriter.readTerranTileFile(gl, arrayBuffer, fileName, terranTile, readerWriter, bytes_readed);

			// Once readed the terranTilesFile, must make all the quadtree.***
			terranTile.setDimensionsSubTiles();
			terranTile.calculatePositionByLonLatSubTiles();
			terranTile.terranIndexFile_readed = true;

			//			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
		}
		else 
		{
			//			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) 
	{
		console.log("xhr status = " + xhr.status);
		//		if(status === 0) blocksList.fileLoadState = 500;
		//		else blocksList.fileLoadState = status;
	}).always(function() 
	{
		//		magoManager.fileRequestControler.filesRequestedCount -= 1;
		//		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param filePath_inServer 변수
 * @param BR_ProjectsList 변수
 * @param readerWriter 변수
 */
ReaderWriter.prototype.getPCloudIndexFile = function(gl, fileName, BR_ProjectsList, readerWriter) 
{
//	magoManager.fileRequestControler.filesRequestedCount += 1;
//	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) 
	{
		var arrayBuffer = response;
		if (arrayBuffer) 
		{
			// write code here.***
			var pCloudProject;

			var bytes_readed = 0;

			var f4d_rawPathName_length = 0;
			//			var f4d_simpleBuildingPathName_length = 0;
			//			var f4d_nailImagePathName_length = 0;

			var pCloudProjects_count = readerWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;

			for (var i=0; i<pCloudProjects_count; i++) 
			{
				pCloudProject = new PCloudMesh();
				BR_ProjectsList._pCloudMesh_array.push(pCloudProject);
				pCloudProject._header._f4d_version = 2;
				// 1rst, read the files path names.************************************************************************************************************
				f4d_rawPathName_length = readerWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
				for (var j=0; j<f4d_rawPathName_length; j++) 
				{
					pCloudProject._f4d_rawPathName += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
				}

				pCloudProject._f4d_headerPathName = pCloudProject._f4d_rawPathName + "/pCloud_Header.hed";
				pCloudProject._f4d_geometryPathName = pCloudProject._f4d_rawPathName + "/pCloud_Geo.f4d";

				//BP_Project._f4d_headerPathName = BP_Project._f4d_rawPathName + "_Header.hed";
				//BP_Project._f4d_simpleBuildingPathName = BP_Project._f4d_rawPathName + "_Geom.f4d";
				//BP_Project._f4d_nailImagePathName = BP_Project._f4d_rawPathName + "_Gaia.jpg";
			}
			//			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
		}
		else 
		{
			//			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) 
	{
		console.log("xhr status = " + status);
		//		if(status === 0) blocksList.fileLoadState = 500;
		//		else blocksList.fileLoadState = status;
	}).always(function() 
	{
		//		magoManager.fileRequestControler.filesRequestedCount -= 1;
		//		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 변수
 * @param pCloud 변수
 * @param readerWriter 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.getPCloudHeader = function(gl, fileName, pCloud, readerWriter, magoManager) 
{
	pCloud._f4d_header_readed = true;
	//	magoManager.fileRequestControler.filesRequestedCount += 1;
	//	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) 
	{
		var arrayBuffer = response;
		if (arrayBuffer) 
		{
			// write code here.***

			var bytes_readed = 0;
			var version_string_length = 5;
			var intAux_scratch = 0;
			var auxScratch;
			var header = pCloud._header;

			// 1) Version(5 chars).***********
			for (var j=0; j<version_string_length; j++)
			{
				header._version += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
			}

			// 2) Type (1 byte).**************
			header._type = String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;

			// 3) Global unique ID.*********************
			intAux_scratch = readerWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			for (var j=0; j<intAux_scratch; j++)
			{
				header._global_unique_id += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
			}

			// 4) Location.*************************
			header._latitude = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
			header._longitude = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
			header._elevation = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;

			header._elevation += 60.0; // delete this. TEST.!!!

			// 5) Orientation.*********************
			auxScratch = new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)); bytes_readed += 4; // yaw.***
			auxScratch = new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)); bytes_readed += 4; // pitch.***
			auxScratch = new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)); bytes_readed += 4; // roll.***

			// 6) BoundingBox.************************
			header._boundingBox.minX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._boundingBox.minY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._boundingBox.minZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._boundingBox.maxX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._boundingBox.maxY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._boundingBox.maxZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;

			var isLarge = false;
			if (header._boundingBox.maxX - header._boundingBox.minX > 40.0 || header._boundingBox.maxY - header._boundingBox.minY > 40.0) 
			{
				isLarge = true;
			}

			if (!isLarge && header._boundingBox.maxZ - header._boundingBox.minZ < 30.0) 
			{
				header.isSmall = true;
			}

			// 7) octZerothBox.***********************
			header._octZerothBox.minX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._octZerothBox.minY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._octZerothBox.minZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._octZerothBox.maxX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._octZerothBox.maxY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._octZerothBox.maxZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;

			// 8) Data file name.********************
			intAux_scratch = readerWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			for (var j=0; j<intAux_scratch; j++) 
			{
				header._dataFileName += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
			}

			// Now, must calculate some params of the project.**********************************************
			// 0) PositionMatrix.************************************************************************
			//var height = elevation;

			var position = Cesium.Cartesian3.fromDegrees(header._longitude, header._latitude, header._elevation); // Old.***
			pCloud._pCloudPosition = position;

			// High and Low values of the position.****************************************************
			var splitValue = Cesium.EncodedCartesian3.encode(position);
			var splitVelue_X  = Cesium.EncodedCartesian3.encode(position.x);
			var splitVelue_Y  = Cesium.EncodedCartesian3.encode(position.y);
			var splitVelue_Z  = Cesium.EncodedCartesian3.encode(position.z);

			pCloud._pCloudPositionHIGH = new Float32Array(3);
			pCloud._pCloudPositionHIGH[0] = splitVelue_X.high;
			pCloud._pCloudPositionHIGH[1] = splitVelue_Y.high;
			pCloud._pCloudPositionHIGH[2] = splitVelue_Z.high;

			pCloud._pCloudPositionLOW = new Float32Array(3);
			pCloud._pCloudPositionLOW[0] = splitVelue_X.low;
			pCloud._pCloudPositionLOW[1] = splitVelue_Y.low;
			pCloud._pCloudPositionLOW[2] = splitVelue_Z.low;

			if (magoManager.backGround_fileReadings_count > 0 ) { magoManager.backGround_fileReadings_count -=1; }

			pCloud._f4d_header_readed_finished = true;
			//			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
		}
		else 
		{
			//			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) 
	{
		console.log("xhr status = " + status);
		//		if(status === 0) blocksList.fileLoadState = 500;
		//		else blocksList.fileLoadState = status;
	}).always(function() 
	{
		//		magoManager.fileRequestControler.filesRequestedCount -= 1;
		//		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * object index 파일을 읽어서 빌딩 개수, 포지션, 크기 정보를 배열에 저장
 * @param gl gl context
 * @param fileName 파일명
 * @param readerWriter 파일 처리를 담당
 * @param neoBuildingsList object index 파일을 파싱한 정보를 저장할 배열
 */
ReaderWriter.prototype.getObjectIndexFileForSmartTile = function(fileName, magoManager, buildingSeedList) 
{
	loadWithXhr(fileName).done(function(response) 
	{
		var arrayBuffer = response;
		if (arrayBuffer) 
		{
			buildingSeedList.dataArrayBuffer = arrayBuffer;
			buildingSeedList.parseBuildingSeedArrayBuffer();
			
			magoManager.makeSmartTile(buildingSeedList);
			arrayBuffer = null;
			//magoManager.createDeploymentGeoLocationsForHeavyIndustries();
		}
		else 
		{
			//			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) 
	{
		console.log("xhr status = " + status);
		//		if(status === 0) blocksList.fileLoadState = 500;
		//		else blocksList.fileLoadState = status;
	}).always(function() 
	{
		//		magoManager.fileRequestControler.filesRequestedCount -= 1;
		//		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * object index 파일을 읽어서 빌딩 개수, 포지션, 크기 정보를 배열에 저장
 * @param gl gl context
 * @param fileName 파일명
 * @param readerWriter 파일 처리를 담당
 * @param neoBuildingsList object index 파일을 파싱한 정보를 저장할 배열
 */
ReaderWriter.prototype.getObjectIndexFile = function(fileName, readerWriter, neoBuildingsList, magoManager) 
{
	loadWithXhr(fileName).done(function(response) 
	{
		var arrayBuffer = response;
		if (arrayBuffer) 
		{
			readerWriter.parseObjectIndexFile(arrayBuffer, neoBuildingsList);
			arrayBuffer = null;
			magoManager.createDeploymentGeoLocationsForHeavyIndustries();
		}
		else 
		{
			//			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) 
	{
		console.log("xhr status = " + status);
		//		if(status === 0) blocksList.fileLoadState = 500;
		//		else blocksList.fileLoadState = status;
	}).always(function() 
	{
		//		magoManager.fileRequestControler.filesRequestedCount -= 1;
		//		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * object index 파일을 읽어서 빌딩 개수, 포지션, 크기 정보를 배열에 저장
 * @param arrayBuffer object index file binary data
 * @param neoBuildingsList object index 파일을 파싱한 정보를 저장할 배열
 */
ReaderWriter.prototype.parseObjectIndexFile = function(arrayBuffer, neoBuildingsList) 
{
	var bytesReaded = 0;
	var buildingNameLength;
	var longitude;
	var latitude;
	var altitude;

	var buildingsCount = this.readInt32(arrayBuffer, bytesReaded, bytesReaded+4);
	bytesReaded += 4;
	for (var i =0; i<buildingsCount; i++) 
	{
		// read the building location data.***
		var neoBuilding = neoBuildingsList.newNeoBuilding();
		if (neoBuilding.metaData === undefined) 
		{
			neoBuilding.metaData = new MetaData();
		}

		if (neoBuilding.metaData.geographicCoord === undefined)
		{ neoBuilding.metaData.geographicCoord = new GeographicCoord(); }

		if (neoBuilding.metaData.bbox === undefined) 
		{
			neoBuilding.metaData.bbox = new BoundingBox();
		}

		buildingNameLength = this.readInt32(arrayBuffer, bytesReaded, bytesReaded+4);
		bytesReaded += 4;
		var buildingName = String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(bytesReaded, bytesReaded+ buildingNameLength)));
		bytesReaded += buildingNameLength;

		longitude = this.readFloat64(arrayBuffer, bytesReaded, bytesReaded+8); bytesReaded += 8;
		latitude = this.readFloat64(arrayBuffer, bytesReaded, bytesReaded+8); bytesReaded += 8;
		altitude = this.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;

		neoBuilding.bbox = new BoundingBox();
		neoBuilding.bbox.minX = this.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		neoBuilding.bbox.minY = this.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		neoBuilding.bbox.minZ = this.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		neoBuilding.bbox.maxX = this.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		neoBuilding.bbox.maxY = this.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		neoBuilding.bbox.maxZ = this.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;

		// create a building and set the location.***
		neoBuilding.buildingId = buildingName.substr(4, buildingNameLength-4);
		neoBuilding.buildingType = "basicBuilding";
		neoBuilding.buildingFileName = buildingName;
		neoBuilding.metaData.geographicCoord.setLonLatAlt(longitude, latitude, altitude);
	}

	neoBuildingsList.neoBuildingsArray.reverse();
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 변수
 * @param neoBuilding 변수
 * @param readerWriter 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.getNeoHeader = function(gl, fileName, neoBuilding, readerWriter, magoManager) 
{
	//BR_Project._f4d_header_readed = true;
	magoManager.fileRequestControler.filesRequestedCount += 1;
	neoBuilding.metaData.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) 
	{
		var arrayBuffer = response;
		if (arrayBuffer) 
		{
			if (neoBuilding.metaData === undefined) 
			{
				neoBuilding.metaData = new MetaData();
			}
			neoBuilding.metaData.parseFileHeader(arrayBuffer, readerWriter);

			// Now, make the neoBuilding's octree.***
			if (neoBuilding.octree === undefined) { neoBuilding.octree = new Octree(undefined); }

			neoBuilding.octree.setBoxSize(neoBuilding.metaData.oct_min_x, neoBuilding.metaData.oct_max_x,
				neoBuilding.metaData.oct_min_y, neoBuilding.metaData.oct_max_y,
				neoBuilding.metaData.oct_min_z, neoBuilding.metaData.oct_max_z);

			neoBuilding.octree.makeTree(3);
			neoBuilding.octree.setSizesSubBoxes();

			neoBuilding.metaData.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			//if(magoManager.backGround_fileReadings_count > 0 )
			//    magoManager.backGround_fileReadings_count -= 1; // old.***
			//BR_Project._f4d_header_readed_finished = true;
			arrayBuffer = null;
		}
		else 
		{
			neoBuilding.metaData.fileLoadState = 500;
		}
	}).fail(function(status) 
	{
		console.log("xhr status = " + status);
		if (status === 0) { neoBuilding.metaData.fileLoadState = 500; }
		else { neoBuilding.metaData.fileLoadState = status; }
	}).always(function() 
	{
		magoManager.fileRequestControler.filesRequestedCount -= 1;
		if (magoManager.fileRequestControler.filesRequestedCount < 0) { magoManager.fileRequestControler.filesRequestedCount = 0; }
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 변수
 * @param neoBuilding 변수
 * @param readerWriter 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.getNeoHeaderAsimetricVersion = function(gl, fileName, neoBuilding, readerWriter, magoManager) 
{
	//BR_Project._f4d_header_readed = true;
	magoManager.fileRequestControler.filesRequestedCount += 1;
	neoBuilding.metaData.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) 
	{
		var arrayBuffer = response;
		if (arrayBuffer) 
		{
			if (neoBuilding.metaData === undefined) 
			{
				neoBuilding.metaData = new MetaData();
			}
			var bytesReaded = neoBuilding.metaData.parseFileHeaderAsimetricVersion(arrayBuffer, readerWriter);

			// Now, make the neoBuilding's octree.***
			if (neoBuilding.octree === undefined) { neoBuilding.octree = new Octree(undefined); }

			// now, parse octreeAsimetric.***
			neoBuilding.octree.parseAsimetricVersion(arrayBuffer, readerWriter, bytesReaded, neoBuilding);

			neoBuilding.metaData.oct_min_x = neoBuilding.octree.centerPos.x - neoBuilding.octree.half_dx;
			neoBuilding.metaData.oct_max_x = neoBuilding.octree.centerPos.x + neoBuilding.octree.half_dx;
			neoBuilding.metaData.oct_min_y = neoBuilding.octree.centerPos.y - neoBuilding.octree.half_dy;
			neoBuilding.metaData.oct_max_y = neoBuilding.octree.centerPos.y + neoBuilding.octree.half_dy;
			neoBuilding.metaData.oct_min_z = neoBuilding.octree.centerPos.z - neoBuilding.octree.half_dz;
			neoBuilding.metaData.oct_max_z = neoBuilding.octree.centerPos.z + neoBuilding.octree.half_dz;

			neoBuilding.metaData.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;

			//BR_Project._f4d_header_readed_finished = true;
			arrayBuffer = undefined;
		}
		else 
		{
			neoBuilding.metaData.fileLoadState = 500;
			arrayBuffer = undefined;
		}
	}).fail(function(status) 
	{
		console.log("xhr status = " + status);
		if (status === 0) { neoBuilding.metaData.fileLoadState = 500; }
		else { neoBuilding.metaData.fileLoadState = status; }
	}).always(function() 
	{
		magoManager.fileRequestControler.filesRequestedCount -= 1;
		if (magoManager.fileRequestControler.filesRequestedCount < 0) { magoManager.fileRequestControler.filesRequestedCount = 0; }
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param imageArrayBuffer 변수
 * @param BR_Project 변수
 * @param readerWriter 변수
 * @param magoManager 변수
 * @param imageLod 변수
 */
ReaderWriter.prototype.readNailImageOfArrayBuffer = function(gl, imageArrayBuffer, BR_Project, readerWriter, magoManager, imageLod) 
{
	var simpBuildingV1 = BR_Project._simpleBuilding_v1;
	var blob = new Blob( [ imageArrayBuffer ], { type: "image/jpeg" } );
	var urlCreator = window.URL || window.webkitURL;
	var imagenUrl = urlCreator.createObjectURL(blob);
	var simpleBuildingImage = new Image();

	simpleBuildingImage.onload = function () 
	{
		//console.log("Image Onload");
		if (simpBuildingV1._simpleBuildingTexture === undefined)
		{ simpBuildingV1._simpleBuildingTexture = gl.createTexture(); }
		handleTextureLoaded(gl, simpleBuildingImage, simpBuildingV1._simpleBuildingTexture);
		BR_Project._f4d_nailImage_readed_finished = true;
		imageArrayBuffer = null;
		BR_Project._simpleBuilding_v1.textureArrayBuffer = null;

		if (magoManager.backGround_imageReadings_count > 0) 
		{
			magoManager.backGround_imageReadings_count--;
		}
	};

	simpleBuildingImage.onerror = function() 
	{
		// doesn't exist or error loading

		//BR_Project._f4d_lod0Image_readed_finished = false;
		//BR_Project._f4d_lod0Image_exists = false;
		//if(magoManager.backGround_fileReadings_count > 0 )
		//	  magoManager.backGround_fileReadings_count -=1;

		return;
	};

	simpleBuildingImage.src = imagenUrl;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param filePath_inServer 변수
 * @param BR_Project 변수
 * @param readerWriter 변수
 * @param magoManager 변수
 * @param imageLod 변수
 */
ReaderWriter.prototype.readNailImage = function(gl, filePath_inServer, BR_Project, readerWriter, magoManager, imageLod) 
{
	if (imageLod === undefined) { imageLod = 3; } // The lowest lod.***

	if (imageLod === 3) { BR_Project._f4d_nailImage_readed = true; }
	else if (imageLod === 0) { BR_Project._f4d_lod0Image_readed  = true; }

	if (BR_Project._simpleBuilding_v1 === undefined) { BR_Project._simpleBuilding_v1 = new SimpleBuildingV1(); }

	var simpBuildingV1 = BR_Project._simpleBuilding_v1;

	var simpleBuildingImage = new Image();
	simpleBuildingImage.onload = function() 
	{
	/*
		if(magoManager.render_time > 20)// for the moment is a test.***
		{
			if(imageLod === 3)
				BR_Project._f4d_nailImage_readed = false;
			else if(imageLod === 0)
				BR_Project._f4d_lod0Image_readed  = false;

			if(magoManager.backGround_fileReadings_count > 0 )
			  magoManager.backGround_fileReadings_count -=1;

			return;
		}
		*/

		if (imageLod === 3) 
		{
			handleTextureLoaded(gl, simpleBuildingImage, simpBuildingV1._simpleBuildingTexture);
			BR_Project._f4d_nailImage_readed_finished = true;
		}
		else if (imageLod === 0) 
		{
			if (simpBuildingV1._texture_0 === undefined) { simpBuildingV1._texture_0 = gl.createTexture(); }

			handleTextureLoaded(gl, simpleBuildingImage, simpBuildingV1._texture_0);
			BR_Project._f4d_lod0Image_readed_finished = true;
		}

		if (magoManager.backGround_fileReadings_count > 0 ) { magoManager.backGround_fileReadings_count -=1; }
	};

	simpleBuildingImage.onerror = function() 
	{
		// doesn't exist or error loading
		BR_Project._f4d_lod0Image_readed_finished = false;
		BR_Project._f4d_lod0Image_exists = false;
		if (magoManager.backGround_fileReadings_count > 0 ) { magoManager.backGround_fileReadings_count -=1; }
		return;
	};

	var filePath_inServer_SimpleBuildingImage = filePath_inServer;
	simpleBuildingImage.src = filePath_inServer_SimpleBuildingImage;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param filePath_inServer 변수
 * @param f4dTex 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.readTexture = function(gl, filePath_inServer, f4dTex, magoManager) 
{
	f4dTex.loadStarted = true;
	f4dTex.texImage = new Image();
	f4dTex.texImage.onload = function() 
	{
		f4dTex.loadFinished = true;

		if (magoManager.backGround_fileReadings_count > 0 ) { magoManager.backGround_fileReadings_count -=1; }
	};

	f4dTex.texImage.onerror = function() 
	{
		// doesn't exist or error loading
		f4dTex.loadStarted = false;
		if (magoManager.backGround_fileReadings_count > 0 ) { magoManager.backGround_fileReadings_count -=1; }
		return;
	};

	f4dTex.texImage.src = filePath_inServer;
};

ReaderWriter.prototype.decodeTGA = function(arrayBuffer) 
{
	// code from toji.***
	var content = new Uint8Array(arrayBuffer),
		contentOffset = 18 + content[0],
		imagetype = content[2], // 2 = rgb, only supported format for now
		width = content[12] + (content[13] << 8),
		height = content[14] + (content[15] << 8),
		bpp = content[16], // should be 8,16,24,32
		
		bytesPerPixel = bpp / 8,
		bytesPerRow = width * 4,
		data, i, j, x, y;

	if (!width || !height) 
	{
		console.error("Invalid dimensions");
		return null;
	}

	if (imagetype !== 2) 
	{
		console.error("Unsupported TGA format:", imagetype);
		return null;
	}

	data = new Uint8Array(width * height * 4);
	i = contentOffset;

	// Oy, with the flipping of the rows...
	for (y = height-1; y >= 0; --y) 
	{
		for (x = 0; x < width; ++x, i += bytesPerPixel) 
		{
			j = (x * 4) + (y * bytesPerRow);
			data[j] = content[i+2];
			data[j+1] = content[i+1];
			data[j+2] = content[i+0];
			data[j+3] = (bpp === 32 ? content[i+3] : 255);
		}
	}

	return {
		width  : width,
		height : height,
		data   : data
	};
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param filePath_inServer 변수
 * @param texture 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.readNeoReferenceTexture = function(gl, filePath_inServer, texture, neoBuilding, magoManager) 
{
	// Must know the fileExtension.***
	var extension = filePath_inServer.split('.').pop();
	
	if (extension === "tga" || extension === "TGA" || extension === "Tga")
	{
		//texture.fileLoadState = CODE.fileLoadState.LOADING_STARTED;
		loadWithXhr(filePath_inServer).done(function(response) 
		{
			var arrayBuffer = response;
			if (arrayBuffer) 
			{
				// decode tga.***
				// Test with tga decoder from https://github.com/schmittl/tgajs
				var tga = new TGA();
				tga.load(arrayBuffer);
				// End decoding.---------------------------------------------------
				
				//var tga = magoManager.readerWriter.decodeTGA(arrayBuffer); // old code.
				//if(tga) {
				//    gl.bindTexture(gl.TEXTURE_2D, texture.texId);
				//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tga.width, tga.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, tga.data);
				//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				//	gl.generateMipmap(gl.TEXTURE_2D);
				//	texture.fileLoadState = CODE.fileLoadState.LOADING_FINISHED; // file load finished.***
				//}
				
				// example values of tga.header
				// alphaBits 0
				// bytePerPixel 3
				// colorMapDepth 0
				// colorMapIndex 0
				// colorMapLength 0
				// colorMapType 0
				// flags 32
				// hasColorMap false
				// hasEncoding false
				// height 2048
				// idLength 0
				// imageType 2
				// isGreyColor false
				// offsetX 0
				// offsetY 0
				// origin 2
				// pixelDepth 24
				// width 2048
				
				if (tga) 
				{
					var rgbType;
					if (tga.header.bytePerPixel === 3)
					{
						rgbType = gl.RGB;
						
						// test change rgb to bgr.***
						/*
						var imageDataLength = tga.imageData.length;
						var pixelsCount = imageDataLength/3;
						var r, g, b;
						for(var i=0; i<pixelsCount; i++)
						{
							r = tga.imageData[i*3];
							g = tga.imageData[i*3+1];
							b = tga.imageData[i*3+2];
							
							tga.imageData[i*3] = b;
							tga.imageData[i*3+1] = g;
							tga.imageData[i*3+2] = r;
						}
						*/
					}
					else if (tga.header.bytePerPixel === 4)
					{
						rgbType = gl.RGBA;
						
						// test change rgb to bgr.***
						
						var imageDataLength = tga.imageData.length;
						var pixelsCount = imageDataLength/4;
						var r, g, b, a;
						for (var i=0; i<pixelsCount; i++)
						{
							r = tga.imageData[i*4];
							g = tga.imageData[i*4+1];
							b = tga.imageData[i*4+2];
							a = tga.imageData[i*4+3];
							
							tga.imageData[i*4] = b;
							tga.imageData[i*4+1] = g;
							tga.imageData[i*4+2] = r;
							tga.imageData[i*4+3] = a;
						}
						
					}
					
					
					
					gl.bindTexture(gl.TEXTURE_2D, texture.texId);
					gl.texImage2D(gl.TEXTURE_2D, 0, rgbType, tga.header.width, tga.header.height, 0, rgbType, gl.UNSIGNED_BYTE, tga.imageData);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
					gl.generateMipmap(gl.TEXTURE_2D);
					texture.fileLoadState = CODE.fileLoadState.LOADING_FINISHED; // file load finished.***
				}
			}
		}).fail(function(status) 
		{
			if (neoBuilding)
			{
				console.log("xhr status = " + status);
				if (status === 0) { neoBuilding.metaData.fileLoadState = 500; }
				else { neoBuilding.metaData.fileLoadState = status; }
			}
		}).always(function() 
		{
			magoManager.backGround_fileReadings_count -= 1;
			if (magoManager.backGround_fileReadings_count < 0) { magoManager.backGround_fileReadings_count = 0; }
		});
	}
	else 
	{
		var neoRefImage = new Image();
		texture.fileLoadState = CODE.fileLoadState.LOADING_STARTED; // file load started.***
		//magoManager.backGround_fileReadings_count ++;
		neoRefImage.onload = function() 
		{
			handleTextureLoaded(gl, neoRefImage, texture.texId);
			texture.fileLoadState = CODE.fileLoadState.LOADING_FINISHED; // file load finished.***

			if (magoManager.backGround_fileReadings_count > 0 ) 
			{ magoManager.backGround_fileReadings_count -=1; }
		};

		neoRefImage.onerror = function() 
		{
			// doesn't exist or error loading
			return;
		};
		neoRefImage.src = filePath_inServer;
	}	
};


/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param filePath_inServer 변수
 * @param texture 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.readLegoSimpleBuildingTexture = function(gl, filePath_inServer, texture, magoManager) 
{
	var neoRefImage = new Image();
	//magoManager.backGround_fileReadings_count ++;
	neoRefImage.onload = function() 
	{
		if (texture.texId === undefined) 
		{ texture.texId = gl.createTexture(); }

		handleTextureLoaded(gl, neoRefImage, texture.texId);

		if (magoManager.backGround_fileReadings_count > 0 ) { magoManager.backGround_fileReadings_count -=1; }
	};

	neoRefImage.onerror = function() 
	{
		// doesn't exist or error loading
		return;
	};

	neoRefImage.src = filePath_inServer;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param terranTile 변수
 * @param readerWriter 변수
 */
ReaderWriter.prototype.openTerranTile = function(gl, terranTile, readerWriter ) 
{
	var filePath_inServer = this.geometryDataPath + Constant.RESULT_XDO2F4D_TERRAINTILEFILE_TXT;
	readerWriter.getTerranTileFile(gl, filePath_inServer, terranTile, readerWriter);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 변수
 * @param terranTile 변수
 * @param readerWriter 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.getTileArrayBuffer = function(gl, fileName, terranTile, readerWriter, magoManager) 
{
	// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
	terranTile.fileReading_started = true;
	//	magoManager.fileRequestControler.backGround_fileReadings_count += 1;
	//	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) 
	{
		var arrayBuffer = response;
		if (arrayBuffer) 
		{
			//var BR_Project = new BRBuildingProject(); // Test.***
			//readerWriter.readF4D_Header(gl, arrayBuffer, BR_Project ); // Test.***
			terranTile.fileArrayBuffer = arrayBuffer;
			terranTile.fileReading_finished = true;

			if (magoManager.backGround_fileReadings_count > 0 ) { magoManager.backGround_fileReadings_count -=1; }
			//			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
		}
		else 
		{
			//			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) 
	{
		console.log("xhr status = " + status);
		//		if(status === 0) blocksList.fileLoadState = 500;
		//		else blocksList.fileLoadState = status;
	}).always(function() 
	{
		//		magoManager.fileRequestControler.filesRequestedCount -= 1;
		//		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param filePath_inServer 변수
 * @param pCloud 변수
 * @param readerWriter 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.getPCloudGeometry = function(gl, fileName, pCloud, readerWriter, magoManager) 
{
	// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
	pCloud._f4d_geometry_readed = true;
	//	magoManager.fileRequestControler.filesRequestedCount += 1;
	//	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) 
	{
		var arrayBuffer = response;
		if (arrayBuffer) 
		{
			// write code here.***
			var bytes_readed = 0;
			var startBuff;
			var endBuff;

			var meshes_count = readerWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4; // Almost allways is 1.***
			for (var a=0; a<meshes_count; a++) 
			{
				var vbo_objects_count = readerWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4; // Almost allways is 1.***

				// single interleaved buffer mode.*********************************************************************************
				for (var i=0; i<vbo_objects_count; i++) 
				{
					var vbo_vertexIdx_data = pCloud.vbo_datas.newVBOVertexIdxCacheKey();
					//var vt_cacheKey = simpObj._vtCacheKeys_container.newVertexTexcoordsArraysCacheKey();

					var iDatas_count = readerWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4; // iDatasCount = vertexCount.***
					startBuff = bytes_readed;
					//endBuff = bytes_readed + (4*3+1*3+1*4)*iDatas_count; // pos(float*3) + normal(byte*3) + color4(byte*4).***
					endBuff = bytes_readed + (4*3+4*3+1*4)*iDatas_count; // pos(float*3) + normal(float*3) + color4(byte*4).***

					//vt_cacheKey._verticesArray_cacheKey = gl.createBuffer ();
					vbo_vertexIdx_data.meshVertexCacheKey = gl.createBuffer();
					gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vertexIdx_data.meshVertexCacheKey);
					gl.bufferData(gl.ARRAY_BUFFER, arrayBuffer.slice(startBuff, endBuff), gl.STATIC_DRAW);

					//bytes_readed = bytes_readed + (4*3+1*3+1*4)*iDatas_count; // pos(float*3) + normal(byte*3) + color4(byte*4).*** // updating data.***
					bytes_readed = bytes_readed + (4*3+4*3+1*4)*iDatas_count; // pos(float*3) + normal(float*3) + color4(byte*4).*** // updating data.***

					//vt_cacheKey._vertices_count = iDatas_count;
					// Now, read short indices.***
					var shortIndices_count = readerWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;

					vbo_vertexIdx_data.indicesCount = shortIndices_count;

					// Indices.***********************
					startBuff = bytes_readed;
					endBuff = bytes_readed + 2*shortIndices_count;
					/*
					// Test.***************************************************************************************
					for(var counter = 0; counter<shortIndices_count; counter++)
					{
						var shortIdx = new Uint16Array(arrayBuffer.slice(bytes_readed, bytes_readed+2));bytes_readed += 2;
						if(shortIdx[0] >= iDatas_count)
						{
							var h=0;
						}
					}
					bytes_readed -= 2*shortIndices_count;
					// End test.------------------------------------------------------------------------------------
					*/

					vbo_vertexIdx_data.meshFacesCacheKey= gl.createBuffer();
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo_vertexIdx_data.meshFacesCacheKey);
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrayBuffer.slice(startBuff, endBuff)), gl.STATIC_DRAW);

					bytes_readed = bytes_readed + 2*shortIndices_count; // updating data.***
				}
			}

			//			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			if (magoManager.backGround_fileReadings_count > 0 ) { magoManager.backGround_fileReadings_count -=1; }

			pCloud._f4d_geometry_readed_finished = true;
			arrayBuffer = null;
		}
		else 
		{
			//			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) 
	{
		console.log("xhr status = " + status);
		//		if(status === 0) blocksList.fileLoadState = 500;
		//		else blocksList.fileLoadState = status;
	}).always(function() 
	{
		//		magoManager.fileRequestControler.filesRequestedCount -= 1;
		//		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};


//load neoTextures
ReaderWriter.prototype.handleTextureLoaded = function(gl, image, texture) 
{
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
	//var gl = viewer.scene.context._gl;
	gl.bindTexture(gl.TEXTURE_2D, texture);
	//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true); // if need vertical mirror of the image.***
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); // Original.***
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
};

/**
  DataStream reads scalars, arrays and structs of data from an ArrayBuffer.
  It's like a file-like DataView on steroids.

  @param {ArrayBuffer} arrayBuffer ArrayBuffer to read from.
  @param {?Number} byteOffset Offset from arrayBuffer beginning for the DataStream.
  @param {?Boolean} endianness DataStream.BIG_ENDIAN or DataStream.LITTLE_ENDIAN (the default).
  */
var DataStream = function(arrayBuffer, byteOffset, endianness) {
  this._byteOffset = byteOffset || 0;
  if (arrayBuffer instanceof ArrayBuffer) {
    this.buffer = arrayBuffer;
  } else if (typeof arrayBuffer == "object") {
    this.dataView = arrayBuffer;
    if (byteOffset) {
      this._byteOffset += byteOffset;
    }
  } else {
    this.buffer = new ArrayBuffer(arrayBuffer || 1);
  }
  this.position = 0;
  this.endianness = endianness == null ? DataStream.LITTLE_ENDIAN : endianness;
};
DataStream.prototype = {};

/* Fix for Opera 12 not defining BYTES_PER_ELEMENT in typed array prototypes. */
if (Uint8Array.prototype.BYTES_PER_ELEMENT === undefined) {
    Uint8Array.prototype.BYTES_PER_ELEMENT = Uint8Array.BYTES_PER_ELEMENT; 
    Int8Array.prototype.BYTES_PER_ELEMENT = Int8Array.BYTES_PER_ELEMENT; 
    Uint8ClampedArray.prototype.BYTES_PER_ELEMENT = Uint8ClampedArray.BYTES_PER_ELEMENT; 
    Uint16Array.prototype.BYTES_PER_ELEMENT = Uint16Array.BYTES_PER_ELEMENT; 
    Int16Array.prototype.BYTES_PER_ELEMENT = Int16Array.BYTES_PER_ELEMENT; 
    Uint32Array.prototype.BYTES_PER_ELEMENT = Uint32Array.BYTES_PER_ELEMENT; 
    Int32Array.prototype.BYTES_PER_ELEMENT = Int32Array.BYTES_PER_ELEMENT; 
    Float64Array.prototype.BYTES_PER_ELEMENT = Float64Array.BYTES_PER_ELEMENT; 
}

/**
  Saves the DataStream contents to the given filename.
  Uses Chrome's anchor download property to initiate download.

  @param {string} filename Filename to save as.
  @return {null}
  */
DataStream.prototype.save = function(filename) {
  var blob = new Blob(this.buffer);
  var URL = (window.webkitURL || window.URL);
  if (URL && URL.createObjectURL) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', filename);
      a.click();
      URL.revokeObjectURL(url);
  } else {
      throw("DataStream.save: Can't create object URL.");
  }
};

/**
  Big-endian const to use as default endianness.
  @type {boolean}
  */
DataStream.BIG_ENDIAN = false;

/**
  Little-endian const to use as default endianness.
  @type {boolean}
  */
DataStream.LITTLE_ENDIAN = true;

/**
  Whether to extend DataStream buffer when trying to write beyond its size.
  If set, the buffer is reallocated to twice its current size until the
  requested write fits the buffer.
  @type {boolean}
  */
DataStream.prototype._dynamicSize = true;
Object.defineProperty(DataStream.prototype, 'dynamicSize',
  { get: function() {
      return this._dynamicSize;
    },
    set: function(v) {
      if (!v) {
        this._trimAlloc();
      }
      this._dynamicSize = v;
    } });

/**
  Virtual byte length of the DataStream backing buffer.
  Updated to be max of original buffer size and last written size.
  If dynamicSize is false is set to buffer size.
  @type {number}
  */
DataStream.prototype._byteLength = 0;

/**
  Returns the byte length of the DataStream object.
  @type {number}
  */
Object.defineProperty(DataStream.prototype, 'byteLength',
  { get: function() {
    return this._byteLength - this._byteOffset;
  }});

/**
  Set/get the backing ArrayBuffer of the DataStream object.
  The setter updates the DataView to point to the new buffer.
  @type {Object}
  */
Object.defineProperty(DataStream.prototype, 'buffer',
  { get: function() {
      this._trimAlloc();
      return this._buffer;
    },
    set: function(v) {
      this._buffer = v;
      this._dataView = new DataView(this._buffer, this._byteOffset);
      this._byteLength = this._buffer.byteLength;
    } });

/**
  Set/get the byteOffset of the DataStream object.
  The setter updates the DataView to point to the new byteOffset.
  @type {number}
  */
Object.defineProperty(DataStream.prototype, 'byteOffset',
  { get: function() {
      return this._byteOffset;
    },
    set: function(v) {
      this._byteOffset = v;
      this._dataView = new DataView(this._buffer, this._byteOffset);
      this._byteLength = this._buffer.byteLength;
    } });

/**
  Set/get the backing DataView of the DataStream object.
  The setter updates the buffer and byteOffset to point to the DataView values.
  @type {Object}
  */
Object.defineProperty(DataStream.prototype, 'dataView',
  { get: function() {
      return this._dataView;
    },
    set: function(v) {
      this._byteOffset = v.byteOffset;
      this._buffer = v.buffer;
      this._dataView = new DataView(this._buffer, this._byteOffset);
      this._byteLength = this._byteOffset + v.byteLength;
    } });

/**
  Internal function to resize the DataStream buffer when required.
  @param {number} extra Number of bytes to add to the buffer allocation.
  @return {null}
  */
DataStream.prototype._realloc = function(extra) {
  if (!this._dynamicSize) {
    return;
  }
  var req = this._byteOffset + this.position + extra;
  var blen = this._buffer.byteLength;
  if (req <= blen) {
    if (req > this._byteLength) {
      this._byteLength = req;
    }
    return;
  }
  if (blen < 1) {
    blen = 1;
  }
  while (req > blen) {
    blen *= 2;
  }
  var buf = new ArrayBuffer(blen);
  var src = new Uint8Array(this._buffer);
  var dst = new Uint8Array(buf, 0, src.length);
  dst.set(src);
  this.buffer = buf;
  this._byteLength = req;
};

/**
  Internal function to trim the DataStream buffer when required.
  Used for stripping out the extra bytes from the backing buffer when
  the virtual byteLength is smaller than the buffer byteLength (happens after
  growing the buffer with writes and not filling the extra space completely).

  @return {null}
  */
DataStream.prototype._trimAlloc = function() {
  if (this._byteLength == this._buffer.byteLength) {
    return;
  }
  var buf = new ArrayBuffer(this._byteLength);
  var dst = new Uint8Array(buf);
  var src = new Uint8Array(this._buffer, 0, dst.length);
  dst.set(src);
  this.buffer = buf;
};

/**
  Sets the DataStream read/write position to given position.
  Clamps between 0 and DataStream length.

  @param {number} pos Position to seek to.
  @return {null}
  */
DataStream.prototype.seek = function(pos) {
  var npos = Math.max(0, Math.min(this.byteLength, pos));
  this.position = (isNaN(npos) || !isFinite(npos)) ? 0 : npos;
};

/**
  Returns true if the DataStream seek pointer is at the end of buffer and
  there's no more data to read.

  @return {boolean} True if the seek pointer is at the end of the buffer.
  */
DataStream.prototype.isEof = function() {
  return (this.position >= this.byteLength);
};

/**
  Maps an Int32Array into the DataStream buffer, swizzling it to native
  endianness in-place. The current offset from the start of the buffer needs to
  be a multiple of element size, just like with typed array views.

  Nice for quickly reading in data. Warning: potentially modifies the buffer
  contents.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} Int32Array to the DataStream backing buffer.
  */
DataStream.prototype.mapInt32Array = function(length, e) {
  this._realloc(length * 4);
  var arr = new Int32Array(this._buffer, this.byteOffset+this.position, length);
  DataStream.arrayToNative(arr, e == null ? this.endianness : e);
  this.position += length * 4;
  return arr;
};

/**
  Maps an Int16Array into the DataStream buffer, swizzling it to native
  endianness in-place. The current offset from the start of the buffer needs to
  be a multiple of element size, just like with typed array views.

  Nice for quickly reading in data. Warning: potentially modifies the buffer
  contents.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} Int16Array to the DataStream backing buffer.
  */
DataStream.prototype.mapInt16Array = function(length, e) {
  this._realloc(length * 2);
  var arr = new Int16Array(this._buffer, this.byteOffset+this.position, length);
  DataStream.arrayToNative(arr, e == null ? this.endianness : e);
  this.position += length * 2;
  return arr;
};

/**
  Maps an Int8Array into the DataStream buffer.

  Nice for quickly reading in data.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} Int8Array to the DataStream backing buffer.
  */
DataStream.prototype.mapInt8Array = function(length) {
  this._realloc(length * 1);
  var arr = new Int8Array(this._buffer, this.byteOffset+this.position, length);
  this.position += length * 1;
  return arr;
};

/**
  Maps a Uint32Array into the DataStream buffer, swizzling it to native
  endianness in-place. The current offset from the start of the buffer needs to
  be a multiple of element size, just like with typed array views.

  Nice for quickly reading in data. Warning: potentially modifies the buffer
  contents.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} Uint32Array to the DataStream backing buffer.
  */
DataStream.prototype.mapUint32Array = function(length, e) {
  this._realloc(length * 4);
  var arr = new Uint32Array(this._buffer, this.byteOffset+this.position, length);
  DataStream.arrayToNative(arr, e == null ? this.endianness : e);
  this.position += length * 4;
  return arr;
};

/**
  Maps a Uint16Array into the DataStream buffer, swizzling it to native
  endianness in-place. The current offset from the start of the buffer needs to
  be a multiple of element size, just like with typed array views.

  Nice for quickly reading in data. Warning: potentially modifies the buffer
  contents.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} Uint16Array to the DataStream backing buffer.
  */
DataStream.prototype.mapUint16Array = function(length, e) {
  this._realloc(length * 2);
  var arr = new Uint16Array(this._buffer, this.byteOffset+this.position, length);
  DataStream.arrayToNative(arr, e == null ? this.endianness : e);
  this.position += length * 2;
  return arr;
};

/**
  Maps a Uint8Array into the DataStream buffer.

  Nice for quickly reading in data.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} Uint8Array to the DataStream backing buffer.
  */
DataStream.prototype.mapUint8Array = function(length) {
  this._realloc(length * 1);
  var arr = new Uint8Array(this._buffer, this.byteOffset+this.position, length);
  this.position += length * 1;
  return arr;
};

/**
  Maps a Float64Array into the DataStream buffer, swizzling it to native
  endianness in-place. The current offset from the start of the buffer needs to
  be a multiple of element size, just like with typed array views.

  Nice for quickly reading in data. Warning: potentially modifies the buffer
  contents.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} Float64Array to the DataStream backing buffer.
  */
DataStream.prototype.mapFloat64Array = function(length, e) {
  this._realloc(length * 8);
  var arr = new Float64Array(this._buffer, this.byteOffset+this.position, length);
  DataStream.arrayToNative(arr, e == null ? this.endianness : e);
  this.position += length * 8;
  return arr;
};

/**
  Maps a Float32Array into the DataStream buffer, swizzling it to native
  endianness in-place. The current offset from the start of the buffer needs to
  be a multiple of element size, just like with typed array views.

  Nice for quickly reading in data. Warning: potentially modifies the buffer
  contents.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} Float32Array to the DataStream backing buffer.
  */
DataStream.prototype.mapFloat32Array = function(length, e) {
  this._realloc(length * 4);
  var arr = new Float32Array(this._buffer, this.byteOffset+this.position, length);
  DataStream.arrayToNative(arr, e == null ? this.endianness : e);
  this.position += length * 4;
  return arr;
};

/**
  Reads an Int32Array of desired length and endianness from the DataStream.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Int32Array.
 */
DataStream.prototype.readInt32Array = function(length, e) {
  length = length == null ? (this.byteLength-this.position / 4) : length;
  var arr = new Int32Array(length);
  DataStream.memcpy(arr.buffer, 0,
                    this.buffer, this.byteOffset+this.position,
                    length*arr.BYTES_PER_ELEMENT);
  DataStream.arrayToNative(arr, e == null ? this.endianness : e);
  this.position += arr.byteLength;
  return arr;
};

/**
  Reads an Int16Array of desired length and endianness from the DataStream.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Int16Array.
 */
DataStream.prototype.readInt16Array = function(length, e) {
  length = length == null ? (this.byteLength-this.position / 2) : length;
  var arr = new Int16Array(length);
  DataStream.memcpy(arr.buffer, 0,
                    this.buffer, this.byteOffset+this.position,
                    length*arr.BYTES_PER_ELEMENT);
  DataStream.arrayToNative(arr, e == null ? this.endianness : e);
  this.position += arr.byteLength;
  return arr;
};

/**
  Reads an Int8Array of desired length from the DataStream.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Int8Array.
 */
DataStream.prototype.readInt8Array = function(length) {
  length = length == null ? (this.byteLength-this.position) : length;
  var arr = new Int8Array(length);
  DataStream.memcpy(arr.buffer, 0,
                    this.buffer, this.byteOffset+this.position,
                    length*arr.BYTES_PER_ELEMENT);
  this.position += arr.byteLength;
  return arr;
};

/**
  Reads a Uint32Array of desired length and endianness from the DataStream.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Uint32Array.
 */
DataStream.prototype.readUint32Array = function(length, e) {
  length = length == null ? (this.byteLength-this.position / 4) : length;
  var arr = new Uint32Array(length);
  DataStream.memcpy(arr.buffer, 0,
                    this.buffer, this.byteOffset+this.position,
                    length*arr.BYTES_PER_ELEMENT);
  DataStream.arrayToNative(arr, e == null ? this.endianness : e);
  this.position += arr.byteLength;
  return arr;
};

/**
  Reads a Uint16Array of desired length and endianness from the DataStream.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Uint16Array.
 */
DataStream.prototype.readUint16Array = function(length, e) {
  length = length == null ? (this.byteLength-this.position / 2) : length;
  var arr = new Uint16Array(length);
  DataStream.memcpy(arr.buffer, 0,
                    this.buffer, this.byteOffset+this.position,
                    length*arr.BYTES_PER_ELEMENT);
  DataStream.arrayToNative(arr, e == null ? this.endianness : e);
  this.position += arr.byteLength;
  return arr;
};

/**
  Reads a Uint8Array of desired length from the DataStream.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Uint8Array.
 */
DataStream.prototype.readUint8Array = function(length) {
  length = length == null ? (this.byteLength-this.position) : length;
  var arr = new Uint8Array(length);
  DataStream.memcpy(arr.buffer, 0,
                    this.buffer, this.byteOffset+this.position,
                    length*arr.BYTES_PER_ELEMENT);
  this.position += arr.byteLength;
  return arr;
};

/**
  Reads a Float64Array of desired length and endianness from the DataStream.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Float64Array.
 */
DataStream.prototype.readFloat64Array = function(length, e) {
  length = length == null ? (this.byteLength-this.position / 8) : length;
  var arr = new Float64Array(length);
  DataStream.memcpy(arr.buffer, 0,
                    this.buffer, this.byteOffset+this.position,
                    length*arr.BYTES_PER_ELEMENT);
  DataStream.arrayToNative(arr, e == null ? this.endianness : e);
  this.position += arr.byteLength;
  return arr;
};

/**
  Reads a Float32Array of desired length and endianness from the DataStream.

  @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Float32Array.
 */
DataStream.prototype.readFloat32Array = function(length, e) {
  length = length == null ? (this.byteLength-this.position / 4) : length;
  var arr = new Float32Array(length);
  DataStream.memcpy(arr.buffer, 0,
                    this.buffer, this.byteOffset+this.position,
                    length*arr.BYTES_PER_ELEMENT);
  DataStream.arrayToNative(arr, e == null ? this.endianness : e);
  this.position += arr.byteLength;
  return arr;
};

/**
  Writes an Int32Array of specified endianness to the DataStream.

  @param {Object} arr The array to write.
  @param {?boolean} e Endianness of the data to write.
 */
DataStream.prototype.writeInt32Array = function(arr, e) {
  this._realloc(arr.length * 4);
  if (arr instanceof Int32Array &&
      (this.byteOffset+this.position) % arr.BYTES_PER_ELEMENT == 0) {
    DataStream.memcpy(this._buffer, this.byteOffset+this.position,
                      arr.buffer, arr.byteOffset,
                      arr.byteLength);
    this.mapInt32Array(arr.length, e);
  } else {
    for (var i=0; i<arr.length; i++) {
      this.writeInt32(arr[i], e);
    }
  }
};

/**
  Writes an Int16Array of specified endianness to the DataStream.

  @param {Object} arr The array to write.
  @param {?boolean} e Endianness of the data to write.
 */
DataStream.prototype.writeInt16Array = function(arr, e) {
  this._realloc(arr.length * 2);
  if (arr instanceof Int16Array &&
      (this.byteOffset+this.position) % arr.BYTES_PER_ELEMENT == 0) {
    DataStream.memcpy(this._buffer, this.byteOffset+this.position,
                      arr.buffer, arr.byteOffset,
                      arr.byteLength);
    this.mapInt16Array(arr.length, e);
  } else {
    for (var i=0; i<arr.length; i++) {
      this.writeInt16(arr[i], e);
    }
  }
};

/**
  Writes an Int8Array to the DataStream.

  @param {Object} arr The array to write.
 */
DataStream.prototype.writeInt8Array = function(arr) {
  this._realloc(arr.length * 1);
  if (arr instanceof Int8Array &&
      (this.byteOffset+this.position) % arr.BYTES_PER_ELEMENT == 0) {
    DataStream.memcpy(this._buffer, this.byteOffset+this.position,
                      arr.buffer, arr.byteOffset,
                      arr.byteLength);
    this.mapInt8Array(arr.length);
  } else {
    for (var i=0; i<arr.length; i++) {
      this.writeInt8(arr[i]);
    }
  }
};

/**
  Writes a Uint32Array of specified endianness to the DataStream.

  @param {Object} arr The array to write.
  @param {?boolean} e Endianness of the data to write.
 */
DataStream.prototype.writeUint32Array = function(arr, e) {
  this._realloc(arr.length * 4);
  if (arr instanceof Uint32Array &&
      (this.byteOffset+this.position) % arr.BYTES_PER_ELEMENT == 0) {
    DataStream.memcpy(this._buffer, this.byteOffset+this.position,
                      arr.buffer, arr.byteOffset,
                      arr.byteLength);
    this.mapUint32Array(arr.length, e);
  } else {
    for (var i=0; i<arr.length; i++) {
      this.writeUint32(arr[i], e);
    }
  }
};

/**
  Writes a Uint16Array of specified endianness to the DataStream.

  @param {Object} arr The array to write.
  @param {?boolean} e Endianness of the data to write.
 */
DataStream.prototype.writeUint16Array = function(arr, e) {
  this._realloc(arr.length * 2);
  if (arr instanceof Uint16Array &&
      (this.byteOffset+this.position) % arr.BYTES_PER_ELEMENT == 0) {
    DataStream.memcpy(this._buffer, this.byteOffset+this.position,
                      arr.buffer, arr.byteOffset,
                      arr.byteLength);
    this.mapUint16Array(arr.length, e);
  } else {
    for (var i=0; i<arr.length; i++) {
      this.writeUint16(arr[i], e);
    }
  }
};

/**
  Writes a Uint8Array to the DataStream.

  @param {Object} arr The array to write.
 */
DataStream.prototype.writeUint8Array = function(arr) {
  this._realloc(arr.length * 1);
  if (arr instanceof Uint8Array &&
      (this.byteOffset+this.position) % arr.BYTES_PER_ELEMENT == 0) {
    DataStream.memcpy(this._buffer, this.byteOffset+this.position,
                      arr.buffer, arr.byteOffset,
                      arr.byteLength);
    this.mapUint8Array(arr.length);
  } else {
    for (var i=0; i<arr.length; i++) {
      this.writeUint8(arr[i]);
    }
  }
};

/**
  Writes a Float64Array of specified endianness to the DataStream.

  @param {Object} arr The array to write.
  @param {?boolean} e Endianness of the data to write.
 */
DataStream.prototype.writeFloat64Array = function(arr, e) {
  this._realloc(arr.length * 8);
  if (arr instanceof Float64Array &&
      (this.byteOffset+this.position) % arr.BYTES_PER_ELEMENT == 0) {
    DataStream.memcpy(this._buffer, this.byteOffset+this.position,
                      arr.buffer, arr.byteOffset,
                      arr.byteLength);
    this.mapFloat64Array(arr.length, e);
  } else {
    for (var i=0; i<arr.length; i++) {
      this.writeFloat64(arr[i], e);
    }
  }
};

/**
  Writes a Float32Array of specified endianness to the DataStream.

  @param {Object} arr The array to write.
  @param {?boolean} e Endianness of the data to write.
 */
DataStream.prototype.writeFloat32Array = function(arr, e) {
  this._realloc(arr.length * 4);
  if (arr instanceof Float32Array &&
      (this.byteOffset+this.position) % arr.BYTES_PER_ELEMENT == 0) {
    DataStream.memcpy(this._buffer, this.byteOffset+this.position,
                      arr.buffer, arr.byteOffset,
                      arr.byteLength);
    this.mapFloat32Array(arr.length, e);
  } else {
    for (var i=0; i<arr.length; i++) {
      this.writeFloat32(arr[i], e);
    }
  }
};


/**
  Reads a 32-bit int from the DataStream with the desired endianness.

  @param {?boolean} e Endianness of the number.
  @return {number} The read number.
 */
DataStream.prototype.readInt32 = function(e) {
  var v = this._dataView.getInt32(this.position, e == null ? this.endianness : e);
  this.position += 4;
  return v;
};

/**
  Reads a 16-bit int from the DataStream with the desired endianness.

  @param {?boolean} e Endianness of the number.
  @return {number} The read number.
 */
DataStream.prototype.readInt16 = function(e) {
  var v = this._dataView.getInt16(this.position, e == null ? this.endianness : e);
  this.position += 2;
  return v;
};

/**
  Reads an 8-bit int from the DataStream.

  @return {number} The read number.
 */
DataStream.prototype.readInt8 = function() {
  var v = this._dataView.getInt8(this.position);
  this.position += 1;
  return v;
};

/**
  Reads a 32-bit unsigned int from the DataStream with the desired endianness.

  @param {?boolean} e Endianness of the number.
  @return {number} The read number.
 */
DataStream.prototype.readUint32 = function(e) {
  var v = this._dataView.getUint32(this.position, e == null ? this.endianness : e);
  this.position += 4;
  return v;
};

/**
  Reads a 16-bit unsigned int from the DataStream with the desired endianness.

  @param {?boolean} e Endianness of the number.
  @return {number} The read number.
 */
DataStream.prototype.readUint16 = function(e) {
  var v = this._dataView.getUint16(this.position, e == null ? this.endianness : e);
  this.position += 2;
  return v;
};

/**
  Reads an 8-bit unsigned int from the DataStream.

  @return {number} The read number.
 */
DataStream.prototype.readUint8 = function() {
  var v = this._dataView.getUint8(this.position);
  this.position += 1;
  return v;
};

/**
  Reads a 32-bit float from the DataStream with the desired endianness.

  @param {?boolean} e Endianness of the number.
  @return {number} The read number.
 */
DataStream.prototype.readFloat32 = function(e) {
  var v = this._dataView.getFloat32(this.position, e == null ? this.endianness : e);
  this.position += 4;
  return v;
};

/**
  Reads a 64-bit float from the DataStream with the desired endianness.

  @param {?boolean} e Endianness of the number.
  @return {number} The read number.
 */
DataStream.prototype.readFloat64 = function(e) {
  var v = this._dataView.getFloat64(this.position, e == null ? this.endianness : e);
  this.position += 8;
  return v;
};


/**
  Writes a 32-bit int to the DataStream with the desired endianness.

  @param {number} v Number to write.
  @param {?boolean} e Endianness of the number.
 */
DataStream.prototype.writeInt32 = function(v, e) {
  this._realloc(4);
  this._dataView.setInt32(this.position, v, e == null ? this.endianness : e);
  this.position += 4;
};

/**
  Writes a 16-bit int to the DataStream with the desired endianness.

  @param {number} v Number to write.
  @param {?boolean} e Endianness of the number.
 */
DataStream.prototype.writeInt16 = function(v, e) {
  this._realloc(2);
  this._dataView.setInt16(this.position, v, e == null ? this.endianness : e);
  this.position += 2;
};

/**
  Writes an 8-bit int to the DataStream.

  @param {number} v Number to write.
 */
DataStream.prototype.writeInt8 = function(v) {
  this._realloc(1);
  this._dataView.setInt8(this.position, v);
  this.position += 1;
};

/**
  Writes a 32-bit unsigned int to the DataStream with the desired endianness.

  @param {number} v Number to write.
  @param {?boolean} e Endianness of the number.
 */
DataStream.prototype.writeUint32 = function(v, e) {
  this._realloc(4);
  this._dataView.setUint32(this.position, v, e == null ? this.endianness : e);
  this.position += 4;
};

/**
  Writes a 16-bit unsigned int to the DataStream with the desired endianness.

  @param {number} v Number to write.
  @param {?boolean} e Endianness of the number.
 */
DataStream.prototype.writeUint16 = function(v, e) {
  this._realloc(2);
  this._dataView.setUint16(this.position, v, e == null ? this.endianness : e);
  this.position += 2;
};

/**
  Writes an 8-bit unsigned  int to the DataStream.

  @param {number} v Number to write.
 */
DataStream.prototype.writeUint8 = function(v) {
  this._realloc(1);
  this._dataView.setUint8(this.position, v);
  this.position += 1;
};

/**
  Writes a 32-bit float to the DataStream with the desired endianness.

  @param {number} v Number to write.
  @param {?boolean} e Endianness of the number.
 */
DataStream.prototype.writeFloat32 = function(v, e) {
  this._realloc(4);
  this._dataView.setFloat32(this.position, v, e == null ? this.endianness : e);
  this.position += 4;
};

/**
  Writes a 64-bit float to the DataStream with the desired endianness.

  @param {number} v Number to write.
  @param {?boolean} e Endianness of the number.
 */
DataStream.prototype.writeFloat64 = function(v, e) {
  this._realloc(8);
  this._dataView.setFloat64(this.position, v, e == null ? this.endianness : e);
  this.position += 8;
};

/**
  Native endianness. Either DataStream.BIG_ENDIAN or DataStream.LITTLE_ENDIAN
  depending on the platform endianness.

  @type {boolean}
 */
DataStream.endianness = new Int8Array(new Int16Array([1]).buffer)[0] > 0;

/**
  Copies byteLength bytes from the src buffer at srcOffset to the
  dst buffer at dstOffset.

  @param {Object} dst Destination ArrayBuffer to write to.
  @param {number} dstOffset Offset to the destination ArrayBuffer.
  @param {Object} src Source ArrayBuffer to read from.
  @param {number} srcOffset Offset to the source ArrayBuffer.
  @param {number} byteLength Number of bytes to copy.
 */
DataStream.memcpy = function(dst, dstOffset, src, srcOffset, byteLength) {
  var dstU8 = new Uint8Array(dst, dstOffset, byteLength);
  var srcU8 = new Uint8Array(src, srcOffset, byteLength);
  dstU8.set(srcU8);
};

/**
  Converts array to native endianness in-place.

  @param {Object} array Typed array to convert.
  @param {boolean} arrayIsLittleEndian True if the data in the array is
                                       little-endian. Set false for big-endian.
  @return {Object} The converted typed array.
 */
DataStream.arrayToNative = function(array, arrayIsLittleEndian) {
  if (arrayIsLittleEndian == this.endianness) {
    return array;
  } else {
    return this.flipArrayEndianness(array);
  }
};

/**
  Converts native endianness array to desired endianness in-place.

  @param {Object} array Typed array to convert.
  @param {boolean} littleEndian True if the converted array should be
                                little-endian. Set false for big-endian.
  @return {Object} The converted typed array.
 */
DataStream.nativeToEndian = function(array, littleEndian) {
  if (this.endianness == littleEndian) {
    return array;
  } else {
    return this.flipArrayEndianness(array);
  }
};

/**
  Flips typed array endianness in-place.

  @param {Object} array Typed array to flip.
  @return {Object} The converted typed array.
 */
DataStream.flipArrayEndianness = function(array) {
  var u8 = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
  for (var i=0; i<array.byteLength; i+=array.BYTES_PER_ELEMENT) {
    for (var j=i+array.BYTES_PER_ELEMENT-1, k=i; j>k; j--, k++) {
      var tmp = u8[k];
      u8[k] = u8[j];
      u8[j] = tmp;
    }
  }
  return array;
};

/**
  Creates an array from an array of character codes.
  Uses String.fromCharCode in chunks for memory efficiency and then concatenates
  the resulting string chunks.

  @param {array} array Array of character codes.
  @return {string} String created from the character codes.
**/
DataStream.createStringFromArray = function(array) {
  var chunk_size = 0x8000;
  var chunks = [];
  for (var i=0; i < array.length; i += chunk_size) {
    chunks.push(String.fromCharCode.apply(null, array.subarray(i, i + chunk_size)));
  }
  return chunks.join("");
};

/**
  Seek position where DataStream#readStruct ran into a problem.
  Useful for debugging struct parsing.

  @type {number}
 */
DataStream.prototype.failurePosition = 0;

/**
  Reads a struct of data from the DataStream. The struct is defined as
  a flat array of [name, type]-pairs. See the example below:

  ds.readStruct([
    'headerTag', 'uint32', // Uint32 in DataStream endianness.
    'headerTag2', 'uint32be', // Big-endian Uint32.
    'headerTag3', 'uint32le', // Little-endian Uint32.
    'array', ['[]', 'uint32', 16], // Uint32Array of length 16.
    'array2Length', 'uint32',
    'array2', ['[]', 'uint32', 'array2Length'] // Uint32Array of length array2Length
  ]);

  The possible values for the type are as follows:

  // Number types

  // Unsuffixed number types use DataStream endianness.
  // To explicitly specify endianness, suffix the type with
  // 'le' for little-endian or 'be' for big-endian,
  // e.g. 'int32be' for big-endian int32.

  'uint8' -- 8-bit unsigned int
  'uint16' -- 16-bit unsigned int
  'uint32' -- 32-bit unsigned int
  'int8' -- 8-bit int
  'int16' -- 16-bit int
  'int32' -- 32-bit int
  'float32' -- 32-bit float
  'float64' -- 64-bit float

  // String types
  'cstring' -- ASCII string terminated by a zero byte.
  'string:N' -- ASCII string of length N, where N is a literal integer.
  'string:variableName' -- ASCII string of length $variableName,
    where 'variableName' is a previously parsed number in the current struct.
  'string,CHARSET:N' -- String of byteLength N encoded with given CHARSET.
  'u16string:N' -- UCS-2 string of length N in DataStream endianness.
  'u16stringle:N' -- UCS-2 string of length N in little-endian.
  'u16stringbe:N' -- UCS-2 string of length N in big-endian.

  // Complex types
  [name, type, name_2, type_2, ..., name_N, type_N] -- Struct
  function(dataStream, struct) {} -- Callback function to read and return data.
  {get: function(dataStream, struct) {},
   set: function(dataStream, struct) {}}
  -- Getter/setter functions to read and return data, handy for using the same
     struct definition for reading and writing structs.
  ['[]', type, length] -- Array of given type and length. The length can be either
                        a number, a string that references a previously-read
                        field, or a callback function(struct, dataStream, type){}.
                        If length is '*', reads in as many elements as it can.

  @param {Object} structDefinition Struct definition object.
  @return {Object} The read struct. Null if failed to read struct.
 */
DataStream.prototype.readStruct = function(structDefinition) {
  var struct = {}, t, v, n;
  var p = this.position;
  for (var i=0; i<structDefinition.length; i+=2) {
    t = structDefinition[i+1];
    v = this.readType(t, struct);
    if (v == null) {
      if (this.failurePosition == 0) {
        this.failurePosition = this.position;
      }
      this.position = p;
      return null;
    }
    struct[structDefinition[i]] = v;
  }
  return struct;
};

/**
  Read UCS-2 string of desired length and endianness from the DataStream.

  @param {number} length The length of the string to read.
  @param {boolean} endianness The endianness of the string data in the DataStream.
  @return {string} The read string.
 */
DataStream.prototype.readUCS2String = function(length, endianness) {
  return DataStream.createStringFromArray(this.readUint16Array(length, endianness));
};

/**
  Write a UCS-2 string of desired endianness to the DataStream. The
  lengthOverride argument lets you define the number of characters to write.
  If the string is shorter than lengthOverride, the extra space is padded with
  zeroes.

  @param {string} str The string to write.
  @param {?boolean} endianness The endianness to use for the written string data.
  @param {?number} lengthOverride The number of characters to write.
 */
DataStream.prototype.writeUCS2String = function(str, endianness, lengthOverride) {
  if (lengthOverride == null) {
    lengthOverride = str.length;
  }
  for (var i = 0; i < str.length && i < lengthOverride; i++) {
    this.writeUint16(str.charCodeAt(i), endianness);
  }
  for (; i<lengthOverride; i++) {
    this.writeUint16(0);
  }
};

/**
  Read a string of desired length and encoding from the DataStream.

  @param {number} length The length of the string to read in bytes.
  @param {?string} encoding The encoding of the string data in the DataStream.
                            Defaults to ASCII.
  @return {string} The read string.
 */
DataStream.prototype.readString = function(length, encoding) {
  if (encoding == null || encoding == "ASCII") {
    return DataStream.createStringFromArray(this.mapUint8Array(length == null ? this.byteLength-this.position : length));
  } else {
    return (new TextDecoder(encoding)).decode(this.mapUint8Array(length));
  }
};

/**
  Writes a string of desired length and encoding to the DataStream.

  @param {string} s The string to write.
  @param {?string} encoding The encoding for the written string data.
                            Defaults to ASCII.
  @param {?number} length The number of characters to write.
 */
DataStream.prototype.writeString = function(s, encoding, length) {
  if (encoding == null || encoding == "ASCII") {
    if (length != null) {
      var i = 0;
      var len = Math.min(s.length, length);
      for (i=0; i<len; i++) {
        this.writeUint8(s.charCodeAt(i));
      }
      for (; i<length; i++) {
        this.writeUint8(0);
      }
    } else {
      for (var i=0; i<s.length; i++) {
        this.writeUint8(s.charCodeAt(i));
      }
    }
  } else {
    this.writeUint8Array((new TextEncoder(encoding)).encode(s.substring(0, length)));
  }
};


/**
  Read null-terminated string of desired length from the DataStream. Truncates
  the returned string so that the null byte is not a part of it.

  @param {?number} length The length of the string to read.
  @return {string} The read string.
 */
DataStream.prototype.readCString = function(length) {
  var blen = this.byteLength-this.position;
  var u8 = new Uint8Array(this._buffer, this._byteOffset + this.position);
  var len = blen;
  if (length != null) {
    len = Math.min(length, blen);
  }
  for (var i = 0; i < len && u8[i] != 0; i++); // find first zero byte
  var s = DataStream.createStringFromArray(this.mapUint8Array(i));
  if (length != null) {
    this.position += len-i;
  } else if (i != blen) {
    this.position += 1; // trailing zero if not at end of buffer
  }
  return s;
};

/**
  Writes a null-terminated string to DataStream and zero-pads it to length
  bytes. If length is not given, writes the string followed by a zero.
  If string is longer than length, the written part of the string does not have
  a trailing zero.

  @param {string} s The string to write.
  @param {?number} length The number of characters to write.
 */
DataStream.prototype.writeCString = function(s, length) {
  if (length != null) {
    var i = 0;
    var len = Math.min(s.length, length);
    for (i=0; i<len; i++) {
      this.writeUint8(s.charCodeAt(i));
    }
    for (; i<length; i++) {
      this.writeUint8(0);
    }
  } else {
    for (var i=0; i<s.length; i++) {
      this.writeUint8(s.charCodeAt(i));
    }
    this.writeUint8(0);
  }
};

/**
  Reads an object of type t from the DataStream, passing struct as the thus-far
  read struct to possible callbacks that refer to it. Used by readStruct for
  reading in the values, so the type is one of the readStruct types.

  @param {Object} t Type of the object to read.
  @param {?Object} struct Struct to refer to when resolving length references
                          and for calling callbacks.
  @return {?Object} Returns the object on successful read, null on unsuccessful.
 */
DataStream.prototype.readType = function(t, struct) {
  if (typeof t == "function") {
    return t(this, struct);
  } else if (typeof t == "object" && !(t instanceof Array)) {
    return t.get(this, struct);
  } else if (t instanceof Array && t.length != 3) {
    return this.readStruct(t, struct);
  }
  var v = null;
  var lengthOverride = null;
  var charset = "ASCII";
  var pos = this.position;
  var len;
  if (typeof t == 'string' && /:/.test(t)) {
    var tp = t.split(":");
    t = tp[0];
    len = tp[1];

    // allow length to be previously parsed variable
    // e.g. 'string:fieldLength', if `fieldLength` has
    // been parsed previously.
    if (struct[len] != null) {
      lengthOverride = parseInt(struct[len]);
    } else {
      // assume literal integer e.g., 'string:4'
      lengthOverride = parseInt(tp[1]);
    }
  }
  if (typeof t == 'string' && /,/.test(t)) {
    var tp = t.split(",");
    t = tp[0];
    charset = parseInt(tp[1]);
  }
  switch(t) {

    case 'uint8':
      v = this.readUint8(); break;
    case 'int8':
      v = this.readInt8(); break;

    case 'uint16':
      v = this.readUint16(this.endianness); break;
    case 'int16':
      v = this.readInt16(this.endianness); break;
    case 'uint32':
      v = this.readUint32(this.endianness); break;
    case 'int32':
      v = this.readInt32(this.endianness); break;
    case 'float32':
      v = this.readFloat32(this.endianness); break;
    case 'float64':
      v = this.readFloat64(this.endianness); break;

    case 'uint16be':
      v = this.readUint16(DataStream.BIG_ENDIAN); break;
    case 'int16be':
      v = this.readInt16(DataStream.BIG_ENDIAN); break;
    case 'uint32be':
      v = this.readUint32(DataStream.BIG_ENDIAN); break;
    case 'int32be':
      v = this.readInt32(DataStream.BIG_ENDIAN); break;
    case 'float32be':
      v = this.readFloat32(DataStream.BIG_ENDIAN); break;
    case 'float64be':
      v = this.readFloat64(DataStream.BIG_ENDIAN); break;

    case 'uint16le':
      v = this.readUint16(DataStream.LITTLE_ENDIAN); break;
    case 'int16le':
      v = this.readInt16(DataStream.LITTLE_ENDIAN); break;
    case 'uint32le':
      v = this.readUint32(DataStream.LITTLE_ENDIAN); break;
    case 'int32le':
      v = this.readInt32(DataStream.LITTLE_ENDIAN); break;
    case 'float32le':
      v = this.readFloat32(DataStream.LITTLE_ENDIAN); break;
    case 'float64le':
      v = this.readFloat64(DataStream.LITTLE_ENDIAN); break;

    case 'cstring':
      v = this.readCString(lengthOverride); break;

    case 'string':
      v = this.readString(lengthOverride, charset); break;

    case 'u16string':
      v = this.readUCS2String(lengthOverride, this.endianness); break;

    case 'u16stringle':
      v = this.readUCS2String(lengthOverride, DataStream.LITTLE_ENDIAN); break;

    case 'u16stringbe':
      v = this.readUCS2String(lengthOverride, DataStream.BIG_ENDIAN); break;

    default:
      if (t.length == 3) {
        var ta = t[1];
        var len = t[2];
        var length = 0;
        if (typeof len == 'function') {
          length = len(struct, this, t);
        } else if (typeof len == 'string' && struct[len] != null) {
          length = parseInt(struct[len]);
        } else {
          length = parseInt(len);
        }
        if (typeof ta == "string") {
          var tap = ta.replace(/(le|be)$/, '');
          var endianness = null;
          if (/le$/.test(ta)) {
            endianness = DataStream.LITTLE_ENDIAN;
          } else if (/be$/.test(ta)) {
            endianness = DataStream.BIG_ENDIAN;
          }
          if (len == '*') {
            length = null;
          }
          switch(tap) {
            case 'uint8':
              v = this.readUint8Array(length); break;
            case 'uint16':
              v = this.readUint16Array(length, endianness); break;
            case 'uint32':
              v = this.readUint32Array(length, endianness); break;
            case 'int8':
              v = this.readInt8Array(length); break;
            case 'int16':
              v = this.readInt16Array(length, endianness); break;
            case 'int32':
              v = this.readInt32Array(length, endianness); break;
            case 'float32':
              v = this.readFloat32Array(length, endianness); break;
            case 'float64':
              v = this.readFloat64Array(length, endianness); break;
            case 'cstring':
            case 'utf16string':
            case 'string':
              if (length == null) {
                v = [];
                while (!this.isEof()) {
                  var u = this.readType(ta, struct);
                  if (u == null) break;
                  v.push(u);
                }
              } else {
                v = new Array(length);
                for (var i=0; i<length; i++) {
                  v[i] = this.readType(ta, struct);
                }
              }
              break;
          }
        } else {
          if (len == '*') {
            v = [];
            this.buffer;
            while (true) {
              var p = this.position;
              try {
                var o = this.readType(ta, struct);
                if (o == null) {
                  this.position = p;
                  break;
                }
                v.push(o);
              } catch(e) {
                this.position = p;
                break;
              }
            }
          } else {
            v = new Array(length);
            for (var i=0; i<length; i++) {
              var u = this.readType(ta, struct);
              if (u == null) return null;
              v[i] = u;
            }
          }
        }
        break;
      }
  }
  if (lengthOverride != null) {
    this.position = pos + lengthOverride;
  }
  return v;
};

/**
  Writes a struct to the DataStream. Takes a structDefinition that gives the
  types and a struct object that gives the values. Refer to readStruct for the
  structure of structDefinition.

  @param {Object} structDefinition Type definition of the struct.
  @param {Object} struct The struct data object.
  */
DataStream.prototype.writeStruct = function(structDefinition, struct) {
  for (var i = 0; i < structDefinition.length; i+=2) {
    var t = structDefinition[i+1];
    this.writeType(t, struct[structDefinition[i]], struct);
  }
};

/**
  Writes object v of type t to the DataStream.

  @param {Object} t Type of data to write.
  @param {Object} v Value of data to write.
  @param {Object} struct Struct to pass to write callback functions.
  */
DataStream.prototype.writeType = function(t, v, struct) {
  if (typeof t == "function") {
    return t(this, v);
  } else if (typeof t == "object" && !(t instanceof Array)) {
    return t.set(this, v, struct);
  }
  var lengthOverride = null;
  var charset = "ASCII";
  var pos = this.position;
  if (typeof(t) == 'string' && /:/.test(t)) {
    var tp = t.split(":");
    t = tp[0];
    lengthOverride = parseInt(tp[1]);
  }
  if (typeof t == 'string' && /,/.test(t)) {
    var tp = t.split(",");
    t = tp[0];
    charset = parseInt(tp[1]);
  }

  switch(t) {
    case 'uint8':
      this.writeUint8(v);
      break;
    case 'int8':
      this.writeInt8(v);
      break;

    case 'uint16':
      this.writeUint16(v, this.endianness);
      break;
    case 'int16':
      this.writeInt16(v, this.endianness);
      break;
    case 'uint32':
      this.writeUint32(v, this.endianness);
      break;
    case 'int32':
      this.writeInt32(v, this.endianness);
      break;
    case 'float32':
      this.writeFloat32(v, this.endianness);
      break;
    case 'float64':
      this.writeFloat64(v, this.endianness);
      break;

    case 'uint16be':
      this.writeUint16(v, DataStream.BIG_ENDIAN);
      break;
    case 'int16be':
      this.writeInt16(v, DataStream.BIG_ENDIAN);
      break;
    case 'uint32be':
      this.writeUint32(v, DataStream.BIG_ENDIAN);
      break;
    case 'int32be':
      this.writeInt32(v, DataStream.BIG_ENDIAN);
      break;
    case 'float32be':
      this.writeFloat32(v, DataStream.BIG_ENDIAN);
      break;
    case 'float64be':
      this.writeFloat64(v, DataStream.BIG_ENDIAN);
      break;

    case 'uint16le':
      this.writeUint16(v, DataStream.LITTLE_ENDIAN);
      break;
    case 'int16le':
      this.writeInt16(v, DataStream.LITTLE_ENDIAN);
      break;
    case 'uint32le':
      this.writeUint32(v, DataStream.LITTLE_ENDIAN);
      break;
    case 'int32le':
      this.writeInt32(v, DataStream.LITTLE_ENDIAN);
      break;
    case 'float32le':
      this.writeFloat32(v, DataStream.LITTLE_ENDIAN);
      break;
    case 'float64le':
      this.writeFloat64(v, DataStream.LITTLE_ENDIAN);
      break;

    case 'cstring':
      this.writeCString(v, lengthOverride);
      break;

    case 'string':
      this.writeString(v, charset, lengthOverride);
      break;

    case 'u16string':
      this.writeUCS2String(v, this.endianness, lengthOverride);
      break;

    case 'u16stringle':
      this.writeUCS2String(v, DataStream.LITTLE_ENDIAN, lengthOverride);
      break;

    case 'u16stringbe':
      this.writeUCS2String(v, DataStream.BIG_ENDIAN, lengthOverride);
      break;

    default:
      if (t.length == 3) {
        var ta = t[1];
        for (var i=0; i<v.length; i++) {
          this.writeType(ta, v[i]);
        }
        break;
      } else {
        this.writeStruct(t, v);
        break;
      }
  }
  if (lengthOverride != null) {
    this.position = pos;
    this._realloc(lengthOverride);
    this.position = pos + lengthOverride;
  }
};

// Export DataStream for amd environments
if (typeof define === 'function' && define.amd) {
    define('DataStream', [], function() {
      return DataStream;
    });
  }
  
// Export DataStream for CommonJS
if (typeof module === 'object' && module && module.exports) {
  module.exports = DataStream;
}

/**
 * @file tgajs - Javascript decoder & (experimental) encoder for TGA files
 * @desc tgajs is a fork from https://github.com/vthibault/jsTGALoader
 * @author Vincent Thibault (Original author)
 * @author Lukas Schmitt
 * @version 1.0.0
 */

/* Copyright (c) 2013, Vincent Thibault. All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

(function (_global) {
  'use strict';

  /**
   * @var {object} TGA type constants
   */
  Targa.Type = {
    NO_DATA: 0,
    INDEXED: 1,
    RGB: 2,
    GREY: 3,
    RLE_INDEXED: 9,
    RLE_RGB: 10,
    RLE_GREY: 11
  };

  /**
   * @var {object} TGA origin constants
   */
  Targa.Origin = {
    BOTTOM_LEFT: 0x00,
    BOTTOM_RIGHT: 0x01,
    TOP_LEFT: 0x02,
    TOP_RIGHT: 0x03,
    SHIFT: 0x04,
    MASK: 0x30,
    ALPHA: 0x08
  };

  Targa.HEADER_SIZE = 18;
  Targa.FOOTER_SIZE = 26;
  Targa.LITTLE_ENDIAN = true;
  Targa.RLE_BIT = 0x80;
  Targa.RLE_MASK = 0x7f;
  Targa.RLE_PACKET = 1;
  Targa.RAW_PACKET = 2;
  Targa.SIGNATURE = "TRUEVISION-XFILE.\0";

  /**
   * TGA Namespace
   * @constructor
   */
  function Targa() {
    if (arguments.length == 1) {
      var h = arguments[0];

      this.header = createHeader(h);
      setHeaderBooleans(this.header);
      checkHeader(this.header);
    }
  }

  /**
   * Sets header or default values
   * @param header header
   * @returns {Object}
   */
  function createHeader(header) {
    return {
      /* 0x00  BYTE */  idLength: defaultFor(header.idLength, 0),
      /* 0x01  BYTE */  colorMapType: defaultFor(header.colorMapType, 0),
      /* 0x02  BYTE */  imageType: defaultFor(header.imageType, Targa.Type.RGB),
      /* 0x03  WORD */  colorMapIndex: defaultFor(header.colorMapIndex, 0),
      /* 0x05  WORD */  colorMapLength: defaultFor(header.colorMapLength, 0),
      /* 0x07  BYTE */  colorMapDepth: defaultFor(header.colorMapDepth, 0),
      /* 0x08  WORD */  offsetX: defaultFor(header.offsetX, 0),
      /* 0x0a  WORD */  offsetY: defaultFor(header.offsetY, 0),
      /* 0x0c  WORD */  width: defaultFor(header.width, 0),
      /* 0x0e  WORD */  height: defaultFor(header.height, 0),
      /* 0x10  BYTE */  pixelDepth: defaultFor(header.pixelDepth,32),
      /* 0x11  BYTE */  flags: defaultFor(header.flags, 8)
    };
  }

  function defaultFor(arg, val) { return typeof arg !== 'undefined' ? arg : val; }

  /**
   * Write footer of TGA file to view
   * Byte 0-3 - Extension Area Offset, 0 if no Extension Area exists
   * Byte 4-7 - Developer Directory Offset, 0 if no Developer Area exists
   * Byte 8-25 - Signature
   * @param {Uint8Array} footer
   */
  function writeFooter(footer) {
    var signature = Targa.SIGNATURE;
    var offset = footer.byteLength - signature.length;
    for (var i = 0; i < signature.length; i++) {
      footer[offset + i] = signature.charCodeAt(i);
    }
  }

  /**
   * Write header of TGA file to view
   * @param header
   * @param view DataView
   */
  function writeHeader(header, view) {
    var littleEndian = Targa.LITTLE_ENDIAN;

    view.setUint8(0x00, header.idLength);
    view.setUint8(0x01, header.colorMapType);
    view.setUint8(0x02, header.imageType);
    view.setUint16(0x03, header.colorMapIndex, littleEndian);
    view.setUint16(0x05, header.colorMapLength, littleEndian);
    view.setUint8(0x07, header.colorMapDepth);
    view.setUint16(0x08, header.offsetX, littleEndian);
    view.setUint16(0x0a, header.offsetY, littleEndian);
    view.setUint16(0x0c, header.width, littleEndian);
    view.setUint16(0x0e, header.height, littleEndian);
    view.setUint8(0x10, header.pixelDepth);
    view.setUint8(0x11, header.flags);
  }

  function readHeader(view) {
    var littleEndian = Targa.LITTLE_ENDIAN;

    // Not enough data to contain header ?
    if (view.byteLength  < 0x12) {
      throw new Error('Targa::load() - Not enough data to contain header');
    }

    var header = {};
    header.idLength = view.getUint8(0x00);
    header.colorMapType = view.getUint8(0x01);
    header.imageType =  view.getUint8(0x02);
    header.colorMapIndex = view.getUint16(0x03, littleEndian);
    header.colorMapLength = view.getUint16(0x05, littleEndian);
    header.colorMapDepth = view.getUint8(0x07);
    header.offsetX = view.getUint16(0x08, littleEndian);
    header.offsetY = view.getUint16(0x0a, littleEndian);
    header.width = view.getUint16(0x0c, littleEndian);
    header.height = view.getUint16(0x0e, littleEndian);
    header.pixelDepth = view.getUint8(0x10);
    header.flags = view.getUint8(0x11);

    return header;
  }

  /**
   * Set additional header booleans
   * @param header
   */
  function setHeaderBooleans(header) {
    header.hasEncoding = (header.imageType === Targa.Type.RLE_INDEXED || header.imageType === Targa.Type.RLE_RGB || header.imageType === Targa.Type.RLE_GREY);
    header.hasColorMap = (header.imageType === Targa.Type.RLE_INDEXED || header.imageType === Targa.Type.INDEXED);
    header.isGreyColor = (header.imageType === Targa.Type.RLE_GREY || header.imageType === Targa.Type.GREY);
    header.bytePerPixel = header.pixelDepth >> 3;
    header.origin = (header.flags & Targa.Origin.MASK) >> Targa.Origin.SHIFT;
    header.alphaBits = header.flags & Targa.Origin.ALPHA;
  }

  /**
   * Check the header of TGA file to detect errors
   *
   * @param {object} header tga header structure
   * @throws Error
   */
  function checkHeader(header) {
    // What the need of a file without data ?
    if (header.imageType === Targa.Type.NO_DATA) {
      throw new Error('Targa::checkHeader() - No data');
    }

    // Indexed type
    if (header.hasColorMap) {
      if (header.colorMapLength > 256 || header.colorMapType !== 1) {
        throw new Error('Targa::checkHeader() - Unsupported colormap for indexed type');
      }
      if (header.colorMapDepth !== 16 && header.colorMapDepth !== 24  && header.colorMapDepth !== 32) {
        throw new Error('Targa::checkHeader() - Unsupported colormap depth');
      }
    }
    else {
      if (header.colorMapType) {
        throw new Error('Targa::checkHeader() - Why does the image contain a palette ?');
      }
    }

    // Check image size
    if (header.width <= 0 || header.height <= 0) {
      throw new Error('Targa::checkHeader() - Invalid image size');
    }

    // Check pixel size
    if (header.pixelDepth !== 8 &&
      header.pixelDepth !== 16 &&
      header.pixelDepth !== 24 &&
      header.pixelDepth !== 32) {
      throw new Error('Targa::checkHeader() - Invalid pixel size "' + header.pixelDepth + '"');
    }

    // Check alpha size
    if (header.alphaBits !== 0 &&
        header.alphaBits !== 1 &&
        header.alphaBits !== 8) {
      throw new Error('Targa::checkHeader() - Unsuppported alpha size');
    }
  }


  /**
   * Decode RLE compression
   *
   * @param {Uint8Array} data
   * @param {number} bytesPerPixel bytes per Pixel
   * @param {number} outputSize in byte: width * height * pixelSize
   */
  function decodeRLE(data, bytesPerPixel, outputSize) {
    var pos, c, count, i, offset;
    var pixels, output;

    output = new Uint8Array(outputSize);
    pixels = new Uint8Array(bytesPerPixel);
    offset = 0; // offset in data
    pos = 0; // offset for output

    while (pos < outputSize) {
      c = data[offset++]; // current byte to check
      count = (c & Targa.RLE_MASK) + 1; // repetition count of pixels, the lower 7 bits + 1

      // RLE packet, if highest bit is set to 1.
      if (c & Targa.RLE_BIT) {
        // Copy pixel values to be repeated to tmp array
        for (i = 0; i < bytesPerPixel; ++i) {
          pixels[i] = data[offset++];
        }

        // Copy pixel values * count to output
        for (i = 0; i < count; ++i) {
          output.set(pixels, pos);
          pos += bytesPerPixel;
        }
      }

      // Raw packet (Non-Run-Length Encoded)
      else {
        count *= bytesPerPixel;
        for (i = 0; i < count; ++i) {
          output[pos++] = data[offset++];
        }
      }
    }

    if (pos > outputSize) {
      throw new Error("Targa::decodeRLE() - Read bytes: " + pos + " Expected bytes: " + outputSize);
    }

    return output;
  }

  /**
   * Encode ImageData object with RLE compression
   *
   * @param header
   * @param imageData from canvas to compress
   */
  function encodeRLE(header, imageData) {
    var maxRepetitionCount = 128;
    var i;
    var data = imageData;
    var output = []; // output size is unknown
    var pos = 0; // pos in imageData array
    var bytesPerPixel = header.pixelDepth >> 3;
    var offset = 0;
    var packetType, packetLength, packetHeader;
    var tgaLength = header.width * header.height * bytesPerPixel;
    var isSamePixel = function isSamePixel(pos, offset) {
      for (var i = 0; i < bytesPerPixel; i++) {
        if (data[pos * bytesPerPixel + i] !== data[offset * bytesPerPixel + i]) {
          return false;
        }
      }
      return true;
    };
    var getPacketType = function(pos) {
      if (isSamePixel(pos, pos + 1)) {
        return Targa.RLE_PACKET;
      }
      return Targa.RAW_PACKET;
    };

    while (pos * bytesPerPixel < data.length && pos * bytesPerPixel < tgaLength) {
      // determine packet type
      packetType = getPacketType(pos);

      // determine packet length
      packetLength = 0;
      if (packetType === Targa.RLE_PACKET) {
        while (pos + packetLength < data.length
        && packetLength < maxRepetitionCount
        && isSamePixel(pos, pos + packetLength)) {
          packetLength++;
        }
      } else { // packetType === Targa.RAW_PACKET
        while (pos + packetLength < data.length
        && packetLength < maxRepetitionCount
        && getPacketType(pos + packetLength) === Targa.RAW_PACKET) {
          packetLength++;
        }
      }

      // write packet header
      packetHeader = packetLength - 1;
      if (packetType === Targa.RLE_PACKET) {
        packetHeader |= Targa.RLE_BIT;
      }
      output[offset++] = packetHeader;

      // write rle packet pixel OR raw pixels
      if (packetType === Targa.RLE_PACKET) {
        for (i = 0; i < bytesPerPixel; i++) {
          output[i + offset] = data[i + pos * bytesPerPixel];
        }
        offset += bytesPerPixel;
      } else {
        for (i = 0; i < bytesPerPixel * packetLength; i++) {
          output[i + offset] = data[i + pos * bytesPerPixel];
        }
        offset += bytesPerPixel * packetLength;
      }
      pos += packetLength;
    }

    return new Uint8Array(output);
  }


  /**
   * Return a ImageData object from a TGA file (8bits)
   *
   * @param {Array} imageData - ImageData to bind
   * @param {Array} indexes - index to colorMap
   * @param {Array} colorMap
   * @param {number} width
   * @param {number} y_start - start at y pixel.
   * @param {number} x_start - start at x pixel.
   * @param {number} y_step  - increment y pixel each time.
   * @param {number} y_end   - stop at pixel y.
   * @param {number} x_step  - increment x pixel each time.
   * @param {number} x_end   - stop at pixel x.
   * @returns {Array} imageData
   */
  function getImageData8bits(imageData, indexes, colorMap, width, y_start, y_step, y_end, x_start, x_step, x_end) {
    var color, index, offset, i, x, y;
    var bytePerPixel = this.header.colorMapDepth >> 3;

    for (i = 0, y = y_start; y !== y_end; y += y_step) {
      for (x = x_start; x !== x_end; x += x_step, i++) {
        offset = (x + width * y) * 4;
        index = indexes[i] * bytePerPixel;
        if (bytePerPixel === 4) {
          imageData[offset    ] = colorMap[index + 2]; // red
          imageData[offset + 1] = colorMap[index + 1]; // green
          imageData[offset + 2] = colorMap[index    ]; // blue
          imageData[offset + 3] = colorMap[index + 3]; // alpha
        } else if (bytePerPixel === 3) {
          imageData[offset    ] = colorMap[index + 2]; // red
          imageData[offset + 1] = colorMap[index + 1]; // green
          imageData[offset + 2] = colorMap[index    ]; // blue
          imageData[offset + 3] = 255; // alpha
        } else if (bytePerPixel === 2) {
          color = colorMap[index] | (colorMap[index + 1] << 8);
          imageData[offset    ] = (color & 0x7C00) >> 7; // red
          imageData[offset + 1] = (color & 0x03E0) >> 2; // green
          imageData[offset + 2] = (color & 0x001F) << 3; // blue
          imageData[offset + 3] = (color & 0x8000) ? 0 : 255; // overlay 0 = opaque and 1 = transparent Discussion at: https://bugzilla.gnome.org/show_bug.cgi?id=683381
        }
      }
    }

    return imageData;
  }


  /**
   * Return a ImageData object from a TGA file (16bits)
   *
   * @param {Array} imageData - ImageData to bind
   * @param {Array} pixels data
   * @param {Array} colormap - not used
   * @param {number} width
   * @param {number} y_start - start at y pixel.
   * @param {number} x_start - start at x pixel.
   * @param {number} y_step  - increment y pixel each time.
   * @param {number} y_end   - stop at pixel y.
   * @param {number} x_step  - increment x pixel each time.
   * @param {number} x_end   - stop at pixel x.
   * @returns {Array} imageData
   */
  function getImageData16bits(imageData, pixels, colormap, width, y_start, y_step, y_end, x_start, x_step, x_end) {
    var color, offset, i, x, y;

    for (i = 0, y = y_start; y !== y_end; y += y_step) {
      for (x = x_start; x !== x_end; x += x_step, i += 2) {
        color = pixels[i] | (pixels[i + 1] << 8);
        offset = (x + width * y) * 4;
        imageData[offset    ] = (color & 0x7C00) >> 7; // red
        imageData[offset + 1] = (color & 0x03E0) >> 2; // green
        imageData[offset + 2] = (color & 0x001F) << 3; // blue
        imageData[offset + 3] = (color & 0x8000) ? 0 : 255; // overlay 0 = opaque and 1 = transparent Discussion at: https://bugzilla.gnome.org/show_bug.cgi?id=683381
      }
    }

    return imageData;
  }


  /**
   * Return a ImageData object from a TGA file (24bits)
   *
   * @param {Array} imageData - ImageData to bind
   * @param {Array} pixels data
   * @param {Array} colormap - not used
   * @param {number} width
   * @param {number} y_start - start at y pixel.
   * @param {number} x_start - start at x pixel.
   * @param {number} y_step  - increment y pixel each time.
   * @param {number} y_end   - stop at pixel y.
   * @param {number} x_step  - increment x pixel each time.
   * @param {number} x_end   - stop at pixel x.
   * @returns {Array} imageData
   */
  function getImageData24bits(imageData, pixels, colormap, width, y_start, y_step, y_end, x_start, x_step, x_end) {
    var offset, i, x, y;
    var bpp = this.header.pixelDepth >> 3;

    for (i = 0, y = y_start; y !== y_end; y += y_step) {
      for (x = x_start; x !== x_end; x += x_step, i += bpp) {
        offset = (x + width * y) * 4;
        imageData[offset + 3] = 255;  // alpha
        imageData[offset + 2] = pixels[i    ]; // blue
        imageData[offset + 1] = pixels[i + 1]; // green
        imageData[offset    ] = pixels[i + 2]; // red
      }
    }

    return imageData;
  }


  /**
   * Return a ImageData object from a TGA file (32bits)
   *
   * @param {Array} imageData - ImageData to bind
   * @param {Array} pixels data from TGA file
   * @param {Array} colormap - not used
   * @param {number} width
   * @param {number} y_start - start at y pixel.
   * @param {number} x_start - start at x pixel.
   * @param {number} y_step  - increment y pixel each time.
   * @param {number} y_end   - stop at pixel y.
   * @param {number} x_step  - increment x pixel each time.
   * @param {number} x_end   - stop at pixel x.
   * @returns {Array} imageData
   */
  function getImageData32bits(imageData, pixels, colormap, width, y_start, y_step, y_end, x_start, x_step, x_end) {
    var i, x, y, offset;

    for (i = 0, y = y_start; y !== y_end; y += y_step) {
      for (x = x_start; x !== x_end; x += x_step, i += 4) {
        offset = (x + width * y) * 4;
        imageData[offset + 2] = pixels[i    ]; // blue
        imageData[offset + 1] = pixels[i + 1]; // green
        imageData[offset    ] = pixels[i + 2]; // red
        imageData[offset + 3] = pixels[i + 3]; // alpha
      }
    }

    return imageData;
  }

  /**
   * Return a ImageData object from a TGA file (32bits). Uses pre multiplied alpha values
   *
   * @param {Array} imageData - ImageData to bind
   * @param {Array} pixels data from TGA file
   * @param {Array} colormap - not used
   * @param {number} width
   * @param {number} y_start - start at y pixel.
   * @param {number} x_start - start at x pixel.
   * @param {number} y_step  - increment y pixel each time.
   * @param {number} y_end   - stop at pixel y.
   * @param {number} x_step  - increment x pixel each time.
   * @param {number} x_end   - stop at pixel x.
   * @returns {Array} imageData
   */
  function getImageData32bitsPre(imageData, pixels, colormap, width, y_start, y_step, y_end, x_start, x_step, x_end) {
    var i, x, y, offset, alpha;

    for (i = 0, y = y_start; y !== y_end; y += y_step) {
      for (x = x_start; x !== x_end; x += x_step, i += 4) {
        offset = (x + width * y) * 4;
        alpha = pixels[i + 3] * 255; // TODO needs testing
        imageData[offset + 2] = pixels[i    ] / alpha; // blue
        imageData[offset + 1] = pixels[i + 1] / alpha; // green
        imageData[offset    ] = pixels[i + 2] / alpha; // red
        imageData[offset + 3] = pixels[i + 3]; // alpha
      }
    }

    return imageData;
  }


  /**
   * Return a ImageData object from a TGA file (8bits grey)
   *
   * @param {Array} imageData - ImageData to bind
   * @param {Array} pixels data
   * @param {Array} colormap - not used
   * @param {number} width
   * @param {number} y_start - start at y pixel.
   * @param {number} x_start - start at x pixel.
   * @param {number} y_step  - increment y pixel each time.
   * @param {number} y_end   - stop at pixel y.
   * @param {number} x_step  - increment x pixel each time.
   * @param {number} x_end   - stop at pixel x.
   * @returns {Array} imageData
   */
  function getImageDataGrey8bits(imageData, pixels, colormap, width, y_start, y_step, y_end, x_start, x_step, x_end) {
    var color, offset, i, x, y;

    for (i = 0, y = y_start; y !== y_end; y += y_step) {
      for (x = x_start; x !== x_end; x += x_step, i++) {
        color = pixels[i];
        offset = (x + width * y) * 4;
        imageData[offset    ] = color; // red
        imageData[offset + 1] = color; // green
        imageData[offset + 2] = color; // blue
        imageData[offset + 3] = 255;   // alpha
      }
    }

    return imageData;
  }


  /**
   * Return a ImageData object from a TGA file (16bits grey) 8 Bit RGB and 8 Bit Alpha
   *
   * @param {Array} imageData - ImageData to bind
   * @param {Array} pixels data
   * @param {Array} colormap - not used
   * @param {number} width
   * @param {number} y_start - start at y pixel.
   * @param {number} x_start - start at x pixel.
   * @param {number} y_step  - increment y pixel each time.
   * @param {number} y_end   - stop at pixel y.
   * @param {number} x_step  - increment x pixel each time.
   * @param {number} x_end   - stop at pixel x.
   * @returns {Array} imageData
   */
  function getImageDataGrey16bits(imageData, pixels, colormap, width, y_start, y_step, y_end, x_start, x_step, x_end) {
    var color, offset, i, x, y;

    for (i = 0, y = y_start; y !== y_end; y += y_step) {
      for (x = x_start; x !== x_end; x += x_step, i += 2) {
        color = pixels[i];
        offset = (x + width * y) * 4;
        imageData[offset] = color;
        imageData[offset + 1] = color;
        imageData[offset + 2] = color;
        imageData[offset + 3] = pixels[i + 1];
      }
    }

    return imageData;
  }


  /**
   * Open a targa file using XHR, be aware with Cross Domain files...
   *
   * @param {string} path - Path of the filename to load
   * @param {function} callback - callback to trigger when the file is loaded
   */
  Targa.prototype.open = function targaOpen(path, callback) {
    var req, tga = this;
    req = new XMLHttpRequest();
    req.open('GET', path, true);
    req.responseType = 'arraybuffer';
    req.onload = function () {
      if (this.status === 200) {
        tga.arrayBuffer = req.response;
        tga.load(tga.arrayBuffer);
        if (callback) {
          callback.call(tga);
        }
      }
    };
    req.send(null);
  };


  function readFooter(view) {
    var offset = view.byteLength - Targa.FOOTER_SIZE;
    var signature = Targa.SIGNATURE;

    var footer = {};

    var signatureArray = new Uint8Array(view.buffer, offset + 0x08, signature.length);
    var str = String.fromCharCode.apply(null, signatureArray);

    if (!isSignatureValid(str)) {
      footer.hasFooter = false;
      return footer;
    }

    footer.hasFooter = true;
    footer.extensionOffset = view.getUint32(offset, Targa.LITTLE_ENDIAN);
    footer.developerOffset = view.getUint32(offset + 0x04, Targa.LITTLE_ENDIAN);
    footer.hasExtensionArea = footer.extensionOffset !== 0;
    footer.hasDeveloperArea = footer.developerOffset !== 0;

    if (footer.extensionOffset) {
      footer.attributeType = view.getUint8(footer.extensionOffset + 494);
    }

    return footer;
  }

  function isSignatureValid(str) {
    var signature = Targa.SIGNATURE;

    for (var i = 0; i < signature.length; i++) {
      if (str.charCodeAt(i) !== signature.charCodeAt(i)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Load and parse a TGA file
   *
   * @param {ArrayBuffer} data - TGA file buffer array
   */
  Targa.prototype.load = function targaLoad(data) {
    var dataView = new DataView(data);

    this.headerData = new Uint8Array(data, 0, Targa.HEADER_SIZE);

    this.header = readHeader(dataView); // Parse Header
    setHeaderBooleans(this.header);
    checkHeader(this.header); // Check if a valid TGA file (or if we can load it)

    var offset = Targa.HEADER_SIZE;
    // Move to data
    offset += this.header.idLength;
    if (offset >= data.byteLength) {
      throw new Error('Targa::load() - No data');
    }

    // Read palette
    if (this.header.hasColorMap) {
      var colorMapSize = this.header.colorMapLength * (this.header.colorMapDepth >> 3);
      this.palette = new Uint8Array(data, offset, colorMapSize);
      offset += colorMapSize;
    }

    var bytesPerPixel = this.header.pixelDepth >> 3;
    var imageSize = this.header.width * this.header.height;
    var pixelTotal = imageSize * bytesPerPixel;

    if (this.header.hasEncoding) { // RLE encoded
      var RLELength = data.byteLength - offset - Targa.FOOTER_SIZE;
      var RLEData = new Uint8Array(data, offset, RLELength);
      this.imageData = decodeRLE(RLEData, bytesPerPixel, pixelTotal);
    } else { // RAW pixels
      this.imageData = new Uint8Array(data, offset, this.header.hasColorMap ? imageSize : pixelTotal);
    }
    
    this.footer = readFooter(dataView);

    if (this.header.alphaBits !== 0  || this.footer.hasExtensionArea && (this.footer.attributeType === 3 || this.footer.attributeType === 4)) {
      this.footer.usesAlpha = true;
    }
  };


  /**
   * Return a ImageData object from a TGA file
   *
   * @param {object} imageData - Optional ImageData to work with
   * @returns {object} imageData
   */
  Targa.prototype.getImageData = function targaGetImageData(imageData) {
    var width = this.header.width;
    var height = this.header.height;
    var origin = (this.header.flags & Targa.Origin.MASK) >> Targa.Origin.SHIFT;
    var x_start, x_step, x_end, y_start, y_step, y_end;
    var getImageData;

    // Create an imageData
    if (!imageData) {
      if (document) {
        imageData = document.createElement('canvas').getContext('2d').createImageData(width, height);
      }
      // In Thread context ?
      else {
        imageData = {
          width: width,
          height: height,
          data: new Uint8ClampedArray(width * height * 4)
        };
      }
    }

    if (origin === Targa.Origin.TOP_LEFT || origin === Targa.Origin.TOP_RIGHT) {
      y_start = 0;
      y_step = 1;
      y_end = height;
    }
    else {
      y_start = height - 1;
      y_step = -1;
      y_end = -1;
    }

    if (origin === Targa.Origin.TOP_LEFT || origin === Targa.Origin.BOTTOM_LEFT) {
      x_start = 0;
      x_step = 1;
      x_end = width;
    }
    else {
      x_start = width - 1;
      x_step = -1;
      x_end = -1;
    }

    // TODO: use this.header.offsetX and this.header.offsetY ?

    switch (this.header.pixelDepth) {
      case 8:
        getImageData = this.header.isGreyColor ? getImageDataGrey8bits : getImageData8bits;
        break;

      case 16:
        getImageData = this.header.isGreyColor ? getImageDataGrey16bits : getImageData16bits;
        break;

      case 24:
        getImageData = getImageData24bits;
        break;

      case 32:
        if (this.footer.hasExtensionArea) {
          if (this.footer.attributeType === 3) { // straight alpha
            getImageData = getImageData32bits;
          } else if (this.footer.attributeType === 4) { // pre multiplied alpha
            getImageData = getImageData32bitsPre;
          } else { // ignore alpha values if attributeType set to 0, 1, 2
            getImageData = getImageData24bits;
          }
        } else {
          if (this.header.alphaBits !== 0) {
            getImageData = getImageData32bits;
          } else { // 32 bits Depth, but alpha Bits set to 0
            getImageData = getImageData24bits;
          }
        }

        break;
    }

    getImageData.call(this, imageData.data, this.imageData, this.palette, width, y_start, y_step, y_end, x_start, x_step, x_end);
    return imageData;
  };

  /** (Experimental)
   *  Encodes imageData into TGA format
   *  Only TGA True Color 32 bit with optional RLE encoding is supported for now
   * @param imageData
   */
  Targa.prototype.setImageData = function targaSetImageData(imageData) {

    if (!imageData) {
      throw new Error('Targa::setImageData() - imageData argument missing');
    }

    var width = this.header.width;
    var height = this.header.height;
    var expectedLength = width * height * (this.header.pixelDepth  >> 3);
    var origin = (this.header.flags & Targa.Origin.MASK) >> Targa.Origin.SHIFT;
    var x_start, x_step, x_end, y_start, y_step, y_end;

    if (origin === Targa.Origin.TOP_LEFT || origin === Targa.Origin.TOP_RIGHT) {
      y_start = 0; // start bottom, step upward
      y_step = 1;
      y_end = height;
    } else {
      y_start = height - 1; // start at top, step downward
      y_step = -1;
      y_end = -1;
    }

    if (origin === Targa.Origin.TOP_LEFT || origin === Targa.Origin.BOTTOM_LEFT) {
      x_start = 0; // start left, step right
      x_step = 1;
      x_end = width;
    } else {
      x_start = width - 1; // start right, step left
      x_step = -1;
      x_end = -1;
    }

    if (!this.imageData) {
      this.imageData = new Uint8Array(expectedLength);
    }

    // start top left if origin is bottom left
    // swapping order of first two arguments does the trick for writing
    // this converts canvas data to internal tga representation
    // this.imageData contains tga data
    getImageData32bits(this.imageData, imageData.data, this.palette, width, y_start, y_step, y_end, x_start, x_step, x_end);

    var data = this.imageData;

    if (this.header.hasEncoding) {
      data = encodeRLE(this.header, data);
    }

    var bufferSize = Targa.HEADER_SIZE + data.length + Targa.FOOTER_SIZE;
    var buffer = new ArrayBuffer(bufferSize);

    this.arrayBuffer = buffer;
    // create array, useful for inspecting data while debugging
    this.headerData = new Uint8Array(buffer, 0, Targa.HEADER_SIZE);
    this.RLEData = new Uint8Array(buffer, Targa.HEADER_SIZE, data.length);
    this.footerData = new Uint8Array(buffer, Targa.HEADER_SIZE + data.length, Targa.FOOTER_SIZE);

    var headerView = new DataView(this.headerData.buffer);
    writeHeader(this.header, headerView);
    this.RLEData.set(data);
    writeFooter(this.footerData);
  };

  /**
   * Return a canvas with the TGA render on it
   *
   * @returns {object} CanvasElement
   */
  Targa.prototype.getCanvas = function targaGetCanvas() {
    var canvas, ctx, imageData;

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    imageData = ctx.createImageData(this.header.width, this.header.height);

    canvas.width = this.header.width;
    canvas.height = this.header.height;

    ctx.putImageData(this.getImageData(imageData), 0, 0);

    return canvas;
  };


  /**
   * Return a dataURI of the TGA file
   *
   * @param {string} type - Optional image content-type to output (default: image/png)
   * @returns {string} url
   */
  Targa.prototype.getDataURL = function targaGetDatURL(type) {
    return this.getCanvas().toDataURL(type || 'image/png');
  };

  /**
   * Return a objectURL of the TGA file
   * The url can be used in the download attribute of a link
   * @returns {string} url
   */
  Targa.prototype.getBlobURL = function targetGetBlobURL() {
    if (!this.arrayBuffer) {
      throw new Error('Targa::getBlobURL() - No data available for blob');
    }
    var blob = new Blob([this.arrayBuffer], { type: "image/x-tga" });
    return URL.createObjectURL(blob);
  };


  // Find Context
  var shim = {};
  if (typeof(exports) === 'undefined') {
    if (typeof(define) === 'function' && typeof(define.amd) === 'object' && define.amd) {
      define(function () {
        return Targa;
      });
    } else {
      // Browser
      shim.exports = typeof(window) !== 'undefined' ? window : _global;
    }
  }
  else {
    // Commonjs
    shim.exports = exports;
  }


  // Export
  if (shim.exports) {
    shim.exports.TGA = Targa;
  }

})(this);

'use strict';


/**
 * 어떤 일을 하고 있습니까?
 * @class UniformMatrix4fvDataPair
 * @param gl 변수
 */
var UniformMatrix4fvDataPair = function(gl, uniformName) 
{
	if (!(this instanceof UniformMatrix4fvDataPair)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.gl = gl;
	this.name = uniformName;
	this.uniformLocation;
	this.matrix4fv; 
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
UniformMatrix4fvDataPair.prototype.bindUniform = function() 
{
	this.gl.uniformMatrix4fv(this.uniformLocation, false, this.matrix4fv);
};

/**
 * 어떤 일을 하고 있습니까?
 * @class UniformVec2fvDataPair
 * @param gl 변수
 */
var UniformVec2fvDataPair = function(gl, uniformName) 
{
	if (!(this instanceof UniformVec2fvDataPair)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.gl = gl;
	this.name = uniformName;
	this.uniformLocation;
	this.vec2fv; 
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
UniformVec2fvDataPair.prototype.bindUniform = function() 
{
	this.gl.uniform2fv(this.uniformLocation, false, this.vec2fv);
};

/**
 * 어떤 일을 하고 있습니까?
 * @class UniformVec3fvDataPair
 * @param gl 변수
 */
var UniformVec3fvDataPair = function(gl, uniformName) 
{
	if (!(this instanceof UniformVec3fvDataPair)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.gl = gl;
	this.name = uniformName;
	this.uniformLocation;
	this.vec3fv; 
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
UniformVec3fvDataPair.prototype.bindUniform = function() 
{
	this.gl.uniform3fv(this.uniformLocation, false, this.vec3fv);
};

/**
 * 어떤 일을 하고 있습니까?
 * @class UniformVec4fvDataPair
 * @param gl 변수
 */
var UniformVec4fvDataPair = function(gl, uniformName) 
{
	if (!(this instanceof UniformVec4fvDataPair)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.gl = gl;
	this.name = uniformName;
	this.uniformLocation;
	this.vec4fv; 
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
UniformVec4fvDataPair.prototype.bindUniform = function() 
{
	this.gl.uniform4fv(this.uniformLocation, false, this.vec4fv);
};

/**
 * 어떤 일을 하고 있습니까?
 * @class Uniform1fDataPair
 * @param gl 변수
 */
var Uniform1fDataPair = function(gl, uniformName) 
{
	if (!(this instanceof Uniform1fDataPair)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.gl = gl;
	this.name = uniformName;
	this.uniformLocation;
	this.floatValue; 
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
Uniform1fDataPair.prototype.bindUniform = function() 
{
	this.gl.uniform1f(this.uniformLocation, false, this.floatValue);
};

/**
 * 어떤 일을 하고 있습니까?
 * @class Uniform1iDataPair
 * @param gl 변수
 */
var Uniform1iDataPair = function(gl, uniformName) 
{
	if (!(this instanceof Uniform1iDataPair)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.gl = gl;
	this.name = uniformName;
	this.uniformLocation;
	this.intValue; 
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
Uniform1iDataPair.prototype.bindUniform = function() 
{
	this.gl.uniform1i(this.uniformLocation, false, this.intValue);
};

//**********************************************************************************************************************************************************

/**
 * 어떤 일을 하고 있습니까?
 * @class PostFxShader
 * @param gl 변수
 */
var PostFxShader = function(gl) 
{
	if (!(this instanceof PostFxShader)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.gl = gl;
	this.name;
	this.attribLocationCacheObj = {};
	this.uniformsArray = []; // this array has the same uniforms that "uniformsCacheObj".***
	this.uniformsCacheObj = {}; // this object has the same uniforms that "uniformsArray".***
	
	// shader program.***
	this.program;
	this.shader_vertex;
	this.shader_fragment;

	// attributes.***
	this.position3_loc;
	this.color3_loc;
	this.normal3_loc;
	this.texCoord2_loc;

	// uniforms matrix.***
	this.projectionMatrix4_loc; // usually no used.***
	this.modelViewMatrix4_loc;
	this.modelViewProjectionMatrix4_loc;
	this.modelViewMatrix4RelToEye_loc;
	this.modelViewProjectionMatrix4RelToEye_loc;
	this.normalMatrix4_loc;
	this.normalMatrix3_loc;
	this.RefTransfMatrix;

	// uniform vectors.***
	this.buildingPosHIGH_loc;
	this.buildingPosLOW_loc;
	this.cameraPosHIGH_loc;
	this.cameraPosLOW_loc;
	this.noiseScale2_loc;
	this.kernel16_loc;

	// uniform values.***
	this.near_loc;
	this.far_loc;
	this.fov_loc;
	this.aspectRatio_loc;
	this.screenWidth_loc;
	this.screenHeight_loc;

	// uniform samplers.***
	this.diffuseTex_loc;
	this.depthTex_loc;
	this.noiseTex_loc;

	// blur.***
	this.texelSize_loc;
	this.colorTex_loc;

	// Model Reference meshes.***
	this.useRefTransfMatrix_loc;
	this.useTexture_loc;
	this.invertNormals_loc;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param shaderName 변수
 * @returns shader
 */
PostFxShader.prototype.bindUniforms = function()
{
	var uniformsDataPairsCount = this.uniformsArray.length;
	for (var i=0; i<uniformsDataPairsCount; i++)
	{
		this.uniformsArray[i].bindUniform();
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param shaderName 변수
 * @returns shader
 */
PostFxShader.prototype.newUniformDataPair = function(uniformType, uniformName)
{
	var uniformDataPair;//
	if (uniformType === "Matrix4fv")
	{
		uniformDataPair = new UniformMatrix4fvDataPair(this.gl, uniformName);
		this.uniformsArray.push(uniformDataPair);
		this.uniformsCacheObj[uniformName] = uniformDataPair;
	}
	else if (uniformType === "Vec4fv")
	{
		uniformDataPair = new UniformVec4fvDataPair(this.gl, uniformName);
		this.uniformsArray.push(uniformDataPair);
		this.uniformsCacheObj[uniformName] = uniformDataPair;
	}
	else if (uniformType === "Vec3fv")
	{
		uniformDataPair = new UniformVec3fvDataPair(this.gl, uniformName);
		this.uniformsArray.push(uniformDataPair);
		this.uniformsCacheObj[uniformName] = uniformDataPair;
	}
	else if (uniformType === "Vec2fv")
	{
		uniformDataPair = new UniformVec2fvDataPair(this.gl, uniformName);
		this.uniformsArray.push(uniformDataPair);
		this.uniformsCacheObj[uniformName] = uniformDataPair;
	}
	else if (uniformType === "1f")
	{
		uniformDataPair = new Uniform1fDataPair(this.gl, uniformName);
		this.uniformsArray.push(uniformDataPair);
		this.uniformsCacheObj[uniformName] = uniformDataPair;
	}
	else if (uniformType === "1i")
	{
		uniformDataPair = new Uniform1iDataPair(this.gl, uniformName);
		this.uniformsArray.push(uniformDataPair);
		this.uniformsCacheObj[uniformName] = uniformDataPair;
	}
	
	return uniformDataPair;
};

//*********************************************************************************************************************

/**
 * 어떤 일을 하고 있습니까?
 * @class PostFxShadersManager
 */
var PostFxShadersManager = function() 
{
	if (!(this instanceof PostFxShadersManager)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.gl;
	this.pFx_shaders_array = []; // old.***
	this.shadersCache = {};
};

/**
 * 어떤 일을 하고 있습니까?
 * @param shaderName 변수
 * @returns shader
 */
PostFxShadersManager.prototype.newShader = function(shaderName)
{
	var shader = new PostFxShader(this.gl);
	shader.name = shaderName;
	this.shadersCache[shaderName] = shader;
	return shader;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param source 변수
 * @param type 변수
 * @param typeString 변수
 * @returns shader
 */
PostFxShadersManager.prototype.getShader = function(gl, source, type, typeString) 
{
	// Source from internet.***
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
	{
		alert("ERROR IN "+typeString+ " SHADER : " + gl.getShaderInfoLog(shader));
		return false;
	}
	return shader;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createDefaultShaders = function(gl) 
{
	this.createRenderDepthShader(gl); // 0.***
	this.createSsaoShader(gl); // 1.***
	this.createBlurShader(gl); // 2.***

	// Now, create shaders for modelReference geometries.****
	this.createRenderDepthShaderModelRef(gl); // 3.***
	this.createSsaoShaderModelRef(gl); // 4.***
	//this.createBlurShader_ModelRef(gl); // 5.***

	this.createColorSelectionShaderModelRef(gl);// 5.***
	this.createSimpleDepthShaderModelRef(gl);// 6.***

	this.createRenderDepthShaderLODBuilding(gl);// 7.***
	this.createSsaoShaderLODBuilding(gl);// 8.***

	this.createRenderDepthShaderLego(gl);// 9.***
	this.createSsaoShaderLego(gl);// 10.***

	this.createDepthShaderBox(gl); // 11.***
	this.createSsaoShaderBox(gl); // 12.***

	this.createPngImageShader(gl); // 13.***
	this.createSilhouetteShaderModelRef(gl); // 14.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createBlurShader = function(gl) 
{
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var blur_vs_source = ShaderSource.BlurVS;
	var blur_fs_source = ShaderSource.BlurFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, blur_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, blur_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.projectionMatrix4_loc = gl.getUniformLocation(shader.program, "projectionMatrix");
	shader.modelViewMatrix4_loc = gl.getUniformLocation(shader.program, "modelViewMatrix");

	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	shader.texCoord2_loc = gl.getAttribLocation(shader.program, "texCoord");
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.texCoord = gl.getAttribLocation(shader.program, "texCoord");

	shader.texelSize_loc = gl.getUniformLocation(shader.program, "texelSize");
	shader.colorTex_loc = gl.getUniformLocation(shader.program, "colorTex");
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createSsaoShader = function(gl) 
{
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var ssao_vs_source = ShaderSource.SsaoVS;
	var ssao_fs_source = ShaderSource.SsaoFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, ssao_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, ssao_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");

	shader.modelViewMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "modelViewMatrixRelToEye");
	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	shader.normalMatrix4_loc = gl.getUniformLocation(shader.program, "normalMatrix4");
	shader.projectionMatrix4_loc = gl.getUniformLocation(shader.program, "projectionMatrix");
	shader.modelViewMatrix4_loc = gl.getUniformLocation(shader.program, "modelViewMatrix");

	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	shader.texCoord2_loc = gl.getAttribLocation(shader.program, "texCoord");
	shader.normal3_loc = gl.getAttribLocation(shader.program, "normal");
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.normal = gl.getAttribLocation(shader.program, "normal");
	shader.attribLocationCacheObj.texCoord = gl.getAttribLocation(shader.program, "texCoord");
	// ssao uniforms.**********************************************************************
	shader.noiseScale2_loc = gl.getUniformLocation(shader.program, "noiseScale");
	shader.kernel16_loc = gl.getUniformLocation(shader.program, "kernel");

	// uniform values.***
	shader.near_loc = gl.getUniformLocation(shader.program, "near");
	shader.far_loc = gl.getUniformLocation(shader.program, "far");
	shader.fov_loc = gl.getUniformLocation(shader.program, "fov");
	shader.aspectRatio_loc = gl.getUniformLocation(shader.program, "aspectRatio");

	shader.screenWidth_loc = gl.getUniformLocation(shader.program, "screenWidth");
	shader.screenHeight_loc = gl.getUniformLocation(shader.program, "screenHeight");

	// uniform samplers.***
	shader.depthTex_loc = gl.getUniformLocation(shader.program, "depthTex");
	shader.noiseTex_loc = gl.getUniformLocation(shader.program, "noiseTex");
	shader.diffuseTex_loc = gl.getUniformLocation(shader.program, "diffuseTex");
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createRenderDepthShader = function(gl) 
{
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var showDepth_vs_source = ShaderSource.ShowDepthVS;
	var showDepth_fs_source = ShaderSource.ShowDepthFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, showDepth_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, showDepth_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");
	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");

	shader.modelViewMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "modelViewMatrixRelToEye");
	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	shader.normalMatrix4_loc = gl.getUniformLocation(shader.program, "normalMatrix4");

	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	shader.normal3_loc = gl.getAttribLocation(shader.program, "normal");
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.normal = gl.getAttribLocation(shader.program, "normal");

	shader.near_loc = gl.getUniformLocation(shader.program, "near");
	shader.far_loc = gl.getUniformLocation(shader.program, "far");
};

// Ref Model.***********************************************************************************************************************
// Ref Model.***********************************************************************************************************************
// Ref Model.***********************************************************************************************************************
/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createSsaoShaderModelRef = function(gl) 
{
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var ssao_vs_source = ShaderSource.ModelRefSsaoVS;
	var ssao_fs_source = ShaderSource.ModelRefSsaoFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, ssao_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, ssao_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh"); // sceneState.***
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow"); // sceneState.***
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");

	shader.modelViewMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "modelViewMatrixRelToEye"); // sceneState.***
	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye"); // sceneState.***
	shader.normalMatrix4_loc = gl.getUniformLocation(shader.program, "normalMatrix4"); // sceneState.***
	shader.projectionMatrix4_loc = gl.getUniformLocation(shader.program, "projectionMatrix"); // sceneState.***
	shader.RefTransfMatrix = gl.getUniformLocation(shader.program, "RefTransfMatrix");
	
	shader.buildingRotMatrix_loc = gl.getUniformLocation(shader.program, "buildingRotMatrix");
	shader.refMatrixType_loc = gl.getUniformLocation(shader.program, "refMatrixType");
	shader.refTranslationVec_loc = gl.getUniformLocation(shader.program, "refTranslationVec");

	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	shader.texCoord2_loc = gl.getAttribLocation(shader.program, "texCoord");
	shader.normal3_loc = gl.getAttribLocation(shader.program, "normal");
	
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.texCoord = gl.getAttribLocation(shader.program, "texCoord");
	shader.attribLocationCacheObj.normal = gl.getAttribLocation(shader.program, "normal");
	//*********************************************************************************
	shader.aditionalMov_loc = gl.getUniformLocation(shader.program, "aditionalPosition");

	// ssao uniforms.**********************************************************************
	shader.noiseScale2_loc = gl.getUniformLocation(shader.program, "noiseScale");
	shader.kernel16_loc = gl.getUniformLocation(shader.program, "kernel");

	// uniform values.***
	shader.near_loc = gl.getUniformLocation(shader.program, "near"); // sceneState.***
	shader.far_loc = gl.getUniformLocation(shader.program, "far"); // sceneState.***
	shader.fov_loc = gl.getUniformLocation(shader.program, "fov"); // sceneState.***
	shader.aspectRatio_loc = gl.getUniformLocation(shader.program, "aspectRatio"); // sceneState.***

	shader.screenWidth_loc = gl.getUniformLocation(shader.program, "screenWidth"); // sceneState.***
	shader.screenHeight_loc = gl.getUniformLocation(shader.program, "screenHeight"); // sceneState.***
	
	shader.shininessValue_loc = gl.getUniformLocation(shader.program, "shininessValue");

	shader.hasTexture_loc = gl.getUniformLocation(shader.program, "hasTexture");
	shader.color4Aux_loc = gl.getUniformLocation(shader.program, "vColor4Aux");
	shader.textureFlipYAxis_loc = gl.getUniformLocation(shader.program, "textureFlipYAxis");

	// uniform samplers.***
	shader.depthTex_loc = gl.getUniformLocation(shader.program, "depthTex");
	shader.noiseTex_loc = gl.getUniformLocation(shader.program, "noiseTex");
	shader.diffuseTex_loc = gl.getUniformLocation(shader.program, "diffuseTex"); 

};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createRenderDepthShaderModelRef = function(gl, sceneState) 
{
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var showDepth_vs_source = ShaderSource.RenderShowDepthVS;
	var showDepth_fs_source = ShaderSource.RenderShowDepthFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, showDepth_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, showDepth_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");
	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");

	shader.modelViewMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "modelViewMatrixRelToEye");
	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	shader.modelViewMatrix4_loc = gl.getUniformLocation(shader.program, "modelViewMatrix");
	shader.RefTransfMatrix = gl.getUniformLocation(shader.program, "RefTransfMatrix");
	shader.buildingRotMatrix_loc = gl.getUniformLocation(shader.program, "buildingRotMatrix");
	shader.refMatrixType_loc = gl.getUniformLocation(shader.program, "refMatrixType");
	shader.refTranslationVec_loc = gl.getUniformLocation(shader.program, "refTranslationVec");

	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");
	shader.aditionalMov_loc = gl.getUniformLocation(shader.program, "aditionalPosition");

	shader.near_loc = gl.getUniformLocation(shader.program, "near");
	shader.far_loc = gl.getUniformLocation(shader.program, "far");
};

// Selection shader.***********************************************************************************************************************
// Selection shader.***********************************************************************************************************************
// Selection shader.***********************************************************************************************************************
/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createColorSelectionShaderModelRef = function(gl) 
{
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var ssao_vs_source = ShaderSource.ColorSelectionSsaoVS;
	var ssao_fs_source = ShaderSource.ColorSelectionSsaoFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, ssao_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, ssao_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");

	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	shader.RefTransfMatrix = gl.getUniformLocation(shader.program, "RefTransfMatrix");
	shader.buildingRotMatrix_loc = gl.getUniformLocation(shader.program, "buildingRotMatrix");
	shader.refMatrixType_loc = gl.getUniformLocation(shader.program, "refMatrixType");
	shader.refTranslationVec_loc = gl.getUniformLocation(shader.program, "refTranslationVec");

	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");

	shader.aditionalMov_loc = gl.getUniformLocation(shader.program, "aditionalPosition");

	shader.color4Aux_loc = gl.getUniformLocation(shader.program, "vColor4Aux");
};

// SimpleDepth shader.***********************************************************************************************************************
// SimpleDepth shader.***********************************************************************************************************************
// SimpleDepth shader.***********************************************************************************************************************
/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createSimpleDepthShaderModelRef = function(gl) 
{
	// no used.!!!!!!!!!!!!!!!
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var ssao_vs_source = ShaderSource.SimpleDepthSsaoVS;
	var ssao_fs_source = ShaderSource.SimpleDepthSsaoFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, ssao_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, ssao_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");

	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	shader.RefTransfMatrix = gl.getUniformLocation(shader.program, "RefTransfMatrix");
	shader.modelViewMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "modelViewMatrixRelToEye");

	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");

	//shader.color4Aux_loc = gl.getUniformLocation(shader.program, "vColor4Aux");
	shader.far_loc = gl.getUniformLocation(shader.program, "far");
};

// LOD 2 Building Shader.***********************************************************************************************************************
// LOD 2 Building Shader.***********************************************************************************************************************
// LOD 2 Building Shader.***********************************************************************************************************************
/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createSsaoShaderLODBuilding = function(gl) 
{
	// 8.***
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var ssao_vs_source = ShaderSource.LodBuildingSsaoVS;
	var ssao_fs_source = ShaderSource.LodBuildingSsaoFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, ssao_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, ssao_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");

	shader.modelViewMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "modelViewMatrixRelToEye");
	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	shader.normalMatrix4_loc = gl.getUniformLocation(shader.program, "normalMatrix4");
	shader.projectionMatrix4_loc = gl.getUniformLocation(shader.program, "projectionMatrix");
	shader.modelViewMatrix4_loc = gl.getUniformLocation(shader.program, "modelViewMatrix");
	shader.RefTransfMatrix = gl.getUniformLocation(shader.program, "RefTransfMatrix");
	shader.buildingRotMatrix_loc = gl.getUniformLocation(shader.program, "buildingRotMatrix");
	shader.bUse1Color_loc = gl.getUniformLocation(shader.program, "bUse1Color");
	shader.oneColor4_loc = gl.getUniformLocation(shader.program, "oneColor4");
	shader.hasTexture_loc = gl.getUniformLocation(shader.program, "hasTexture");
	shader.textureFlipYAxis_loc = gl.getUniformLocation(shader.program, "textureFlipYAxis");

	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	shader.texCoord2_loc = gl.getAttribLocation(shader.program, "texCoord");
	shader.normal3_loc = gl.getAttribLocation(shader.program, "normal");
	shader.color4_loc = gl.getAttribLocation(shader.program, "color4");
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.normal = gl.getAttribLocation(shader.program, "normal");
	shader.attribLocationCacheObj.color4 = gl.getAttribLocation(shader.program, "color4");

	//*********************************************************************************
	shader.aditionalMov_loc = gl.getUniformLocation(shader.program, "aditionalPosition");

	// ssao uniforms.**********************************************************************
	shader.noiseScale2_loc = gl.getUniformLocation(shader.program, "noiseScale");
	shader.kernel16_loc = gl.getUniformLocation(shader.program, "kernel");

	// uniform values.***
	shader.near_loc = gl.getUniformLocation(shader.program, "near");
	shader.far_loc = gl.getUniformLocation(shader.program, "far");
	shader.fov_loc = gl.getUniformLocation(shader.program, "fov");
	shader.aspectRatio_loc = gl.getUniformLocation(shader.program, "aspectRatio");

	shader.screenWidth_loc = gl.getUniformLocation(shader.program, "screenWidth");
	shader.screenHeight_loc = gl.getUniformLocation(shader.program, "screenHeight");

	//shader.hasTexture_loc = gl.getUniformLocation(shader.program, "hasTexture");
	shader.color4Aux_loc = gl.getUniformLocation(shader.program, "vColor4Aux");

	// uniform samplers.***
	shader.depthTex_loc = gl.getUniformLocation(shader.program, "depthTex");
	shader.noiseTex_loc = gl.getUniformLocation(shader.program, "noiseTex");
	shader.diffuseTex_loc = gl.getUniformLocation(shader.program, "diffuseTex");

	// ModelReference.****
	shader.useRefTransfMatrix_loc = gl.getUniformLocation(shader.program, "useRefTransfMatrix");
	shader.useTexture_loc = gl.getUniformLocation(shader.program, "useTexture");
	shader.invertNormals_loc  = gl.getUniformLocation(shader.program, "invertNormals");
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createRenderDepthShaderLODBuilding = function(gl) 
{
	// 7.***
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var showDepth_vs_source = ShaderSource.LodBuildingDepthVS;
	var showDepth_fs_source = ShaderSource.LodBuildingDepthFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, showDepth_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, showDepth_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");
	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");

	shader.modelViewMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "modelViewMatrixRelToEye");
	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	shader.modelViewMatrix4_loc = gl.getUniformLocation(shader.program, "modelViewMatrix");
	shader.RefTransfMatrix = gl.getUniformLocation(shader.program, "RefTransfMatrix");
	shader.buildingRotMatrix_loc = gl.getUniformLocation(shader.program, "buildingRotMatrix");

	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");
	shader.aditionalMov_loc = gl.getUniformLocation(shader.program, "aditionalPosition");

	shader.near_loc = gl.getUniformLocation(shader.program, "near");
	shader.far_loc = gl.getUniformLocation(shader.program, "far");
};

// Lego Shader.***********************************************************************************************************************
// Lego Shader.***********************************************************************************************************************
// Lego Shader.***********************************************************************************************************************
/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createSsaoShaderLego = function(gl) 
{
	// 10.***
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var ssao_vs_source = ShaderSource.LegoSsaoVS;
	var ssao_fs_source = ShaderSource.LegoSsaoFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, ssao_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, ssao_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");

	shader.modelViewMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "modelViewMatrixRelToEye");
	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	shader.normalMatrix4_loc = gl.getUniformLocation(shader.program, "normalMatrix4");
	shader.projectionMatrix4_loc = gl.getUniformLocation(shader.program, "projectionMatrix");
	shader.modelViewMatrix4_loc = gl.getUniformLocation(shader.program, "modelViewMatrix");
	shader.RefTransfMatrix = gl.getUniformLocation(shader.program, "RefTransfMatrix");
	shader.buildingRotMatrix_loc = gl.getUniformLocation(shader.program, "buildingRotMatrix");

	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	//shader.texCoord2_loc = gl.getAttribLocation(shader.program, "texCoord");
	shader.normal3_loc = gl.getAttribLocation(shader.program, "normal");
	shader.color4_loc = gl.getAttribLocation(shader.program, "color4");
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.normal = gl.getAttribLocation(shader.program, "normal");
	shader.attribLocationCacheObj.color4 = gl.getAttribLocation(shader.program, "color4");

	shader.aditionalMov_loc = gl.getUniformLocation(shader.program, "aditionalPosition");

	// ssao uniforms.**********************************************************************
	shader.noiseScale2_loc = gl.getUniformLocation(shader.program, "noiseScale");
	shader.kernel16_loc = gl.getUniformLocation(shader.program, "kernel");

	// uniform values.***
	shader.near_loc = gl.getUniformLocation(shader.program, "near");
	shader.far_loc = gl.getUniformLocation(shader.program, "far");
	shader.fov_loc = gl.getUniformLocation(shader.program, "fov");
	shader.aspectRatio_loc = gl.getUniformLocation(shader.program, "aspectRatio");

	shader.screenWidth_loc = gl.getUniformLocation(shader.program, "screenWidth");
	shader.screenHeight_loc = gl.getUniformLocation(shader.program, "screenHeight");

	shader.hasTexture_loc = gl.getUniformLocation(shader.program, "hasTexture");
	shader.color4Aux_loc = gl.getUniformLocation(shader.program, "vColor4Aux");

	// uniform samplers.***
	shader.depthTex_loc = gl.getUniformLocation(shader.program, "depthTex");
	shader.noiseTex_loc = gl.getUniformLocation(shader.program, "noiseTex");
	shader.diffuseTex_loc = gl.getUniformLocation(shader.program, "diffuseTex");

	// ModelReference.****
	shader.useRefTransfMatrix_loc = gl.getUniformLocation(shader.program, "useRefTransfMatrix");
	shader.useTexture_loc = gl.getUniformLocation(shader.program, "useTexture");
	shader.invertNormals_loc  = gl.getUniformLocation(shader.program, "invertNormals");
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createRenderDepthShaderLego = function(gl) 
{
	// 9.***
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var showDepth_vs_source = ShaderSource.LegoDepthVS;
	var showDepth_fs_source = ShaderSource.LegoDepthFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, showDepth_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, showDepth_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");
	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");

	shader.modelViewMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "modelViewMatrixRelToEye");
	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	shader.modelViewMatrix4_loc = gl.getUniformLocation(shader.program, "modelViewMatrix");
	shader.RefTransfMatrix = gl.getUniformLocation(shader.program, "RefTransfMatrix");
	shader.buildingRotMatrix_loc = gl.getUniformLocation(shader.program, "buildingRotMatrix");

	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");
	shader.aditionalMov_loc = gl.getUniformLocation(shader.program, "aditionalPosition");

	shader.near_loc = gl.getUniformLocation(shader.program, "near");
	shader.far_loc = gl.getUniformLocation(shader.program, "far");
};





/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createRenderDepthShaderLODBuilding = function(gl) 
{
	// 7.***
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var showDepth_vs_source = ShaderSource.LodBuildingDepthVS;
	var showDepth_fs_source = ShaderSource.LodBuildingDepthFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, showDepth_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, showDepth_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");
	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");

	shader.modelViewMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "modelViewMatrixRelToEye");
	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	shader.modelViewMatrix4_loc = gl.getUniformLocation(shader.program, "modelViewMatrix");
	shader.RefTransfMatrix = gl.getUniformLocation(shader.program, "RefTransfMatrix");
	shader.buildingRotMatrix_loc = gl.getUniformLocation(shader.program, "buildingRotMatrix");

	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");
	shader.aditionalMov_loc = gl.getUniformLocation(shader.program, "aditionalPosition");

	shader.near_loc = gl.getUniformLocation(shader.program, "near");
	shader.far_loc = gl.getUniformLocation(shader.program, "far");
};

// box depth Shader.***********************************************************************************************************************
// box depth Shader.***********************************************************************************************************************
// box depth Shader.***********************************************************************************************************************
/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createDepthShaderBox = function(gl) 
{
	// 7.***
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var showDepth_vs_source = ShaderSource.BoxDepthVS;
	var showDepth_fs_source = ShaderSource.BoxDepthFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, showDepth_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, showDepth_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");
	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");

	shader.modelViewMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "modelViewMatrixRelToEye");
	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	shader.modelViewMatrix4_loc = gl.getUniformLocation(shader.program, "modelViewMatrix");
	shader.RefTransfMatrix = gl.getUniformLocation(shader.program, "RefTransfMatrix");
	shader.buildingRotMatrix_loc = gl.getUniformLocation(shader.program, "buildingRotMatrix");

	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");
	shader.aditionalMov_loc = gl.getUniformLocation(shader.program, "aditionalPosition");

	shader.near_loc = gl.getUniformLocation(shader.program, "near");
	shader.far_loc = gl.getUniformLocation(shader.program, "far");
};

// box Shader.***********************************************************************************************************************
// box Shader.***********************************************************************************************************************
// box Shader.***********************************************************************************************************************
/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createSsaoShaderBox = function(gl) 
{
	// 8.***
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var ssao_vs_source = ShaderSource.BoxSsaoVS;
	var ssao_fs_source = ShaderSource.BoxSsaoFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, ssao_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, ssao_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");

	shader.modelViewMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "modelViewMatrixRelToEye");
	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	shader.normalMatrix4_loc = gl.getUniformLocation(shader.program, "normalMatrix4");
	shader.projectionMatrix4_loc = gl.getUniformLocation(shader.program, "projectionMatrix");
	shader.modelViewMatrix4_loc = gl.getUniformLocation(shader.program, "modelViewMatrix");
	//shader.RefTransfMatrix = gl.getUniformLocation(shader.program, "RefTransfMatrix");
	shader.buildingRotMatrix_loc = gl.getUniformLocation(shader.program, "buildingRotMatrix");
	shader.bUse1Color_loc = gl.getUniformLocation(shader.program, "bUse1Color");
	shader.oneColor4_loc = gl.getUniformLocation(shader.program, "oneColor4");
	shader.bScale_loc = gl.getUniformLocation(shader.program, "bScale");
	shader.scale_loc = gl.getUniformLocation(shader.program, "scale");


	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	//shader.texCoord2_loc = gl.getAttribLocation(shader.program, "texCoord");
	shader.normal3_loc = gl.getAttribLocation(shader.program, "normal");
	shader.color4_loc = gl.getAttribLocation(shader.program, "color4");
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.normal = gl.getAttribLocation(shader.program, "normal");
	shader.attribLocationCacheObj.color4 = gl.getAttribLocation(shader.program, "color4");

	//*********************************************************************************
	shader.aditionalMov_loc = gl.getUniformLocation(shader.program, "aditionalPosition");

	// ssao uniforms.**********************************************************************
	shader.noiseScale2_loc = gl.getUniformLocation(shader.program, "noiseScale");
	shader.kernel16_loc = gl.getUniformLocation(shader.program, "kernel");

	// uniform values.***
	shader.near_loc = gl.getUniformLocation(shader.program, "near");
	shader.far_loc = gl.getUniformLocation(shader.program, "far");
	shader.fov_loc = gl.getUniformLocation(shader.program, "fov");
	shader.aspectRatio_loc = gl.getUniformLocation(shader.program, "aspectRatio");

	shader.screenWidth_loc = gl.getUniformLocation(shader.program, "screenWidth");
	shader.screenHeight_loc = gl.getUniformLocation(shader.program, "screenHeight");

	shader.hasTexture_loc = gl.getUniformLocation(shader.program, "hasTexture");
	shader.color4Aux_loc = gl.getUniformLocation(shader.program, "vColor4Aux");

	// uniform samplers.***
	shader.depthTex_loc = gl.getUniformLocation(shader.program, "depthTex");
	shader.noiseTex_loc = gl.getUniformLocation(shader.program, "noiseTex");
	shader.diffuseTex_loc = gl.getUniformLocation(shader.program, "diffuseTex");

	// ModelReference.****
	shader.useRefTransfMatrix_loc = gl.getUniformLocation(shader.program, "useRefTransfMatrix");
	shader.useTexture_loc = gl.getUniformLocation(shader.program, "useTexture");
	shader.invertNormals_loc  = gl.getUniformLocation(shader.program, "invertNormals");
};

// PNG images shader.**************************************************************************************************
// PNG images shader.**************************************************************************************************
// PNG images shader.**************************************************************************************************
/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createPngImageShader = function(gl) 
{
	// 13.***
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var ssao_vs_source = ShaderSource.PngImageVS;
	var ssao_fs_source = ShaderSource.PngImageFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, ssao_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, ssao_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.texture_loc = gl.getUniformLocation(shader.program, "u_texture"); 
	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");
	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	shader.buildingRotMatrix_loc = gl.getUniformLocation(shader.program, "buildingRotMatrix");
	
	shader.position3_loc = gl.getAttribLocation(shader.program, "a_position");
	shader.texCoord2_loc = gl.getAttribLocation(shader.program, "a_texcoord");
	
	shader.textureFlipYAxis_loc = gl.getUniformLocation(shader.program, "textureFlipYAxis");
	
};

// 14) Silhouette shader.***********************************************************************************************************************
// 14) Silhouette shader.***********************************************************************************************************************
// 14) Silhouette shader.***********************************************************************************************************************
/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 */
PostFxShadersManager.prototype.createSilhouetteShaderModelRef = function(gl) 
{
	// 14.***
	var shader = new PostFxShader(this.gl);
	this.pFx_shaders_array.push(shader);

	var ssao_vs_source = ShaderSource.SilhouetteVS;
	var ssao_fs_source = ShaderSource.SilhouetteFS;

	shader.program = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, ssao_vs_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, ssao_fs_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(shader.program, shader.shader_vertex);
	gl.attachShader(shader.program, shader.shader_fragment);
	gl.linkProgram(shader.program);

	shader.cameraPosHIGH_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCHigh");
	shader.cameraPosLOW_loc = gl.getUniformLocation(shader.program, "encodedCameraPositionMCLow");
	shader.buildingPosHIGH_loc = gl.getUniformLocation(shader.program, "buildingPosHIGH");
	shader.buildingPosLOW_loc = gl.getUniformLocation(shader.program, "buildingPosLOW");

	shader.modelViewProjectionMatrix4RelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewProjectionMatrixRelToEye");
	shader.RefTransfMatrix = gl.getUniformLocation(shader.program, "RefTransfMatrix");
	shader.buildingRotMatrix_loc = gl.getUniformLocation(shader.program, "buildingRotMatrix");
	shader.refMatrixType_loc = gl.getUniformLocation(shader.program, "refMatrixType");
	shader.refTranslationVec_loc = gl.getUniformLocation(shader.program, "refTranslationVec");

	shader.position3_loc = gl.getAttribLocation(shader.program, "position");
	shader.attribLocationCacheObj.position = gl.getAttribLocation(shader.program, "position");

	shader.aditionalMov_loc = gl.getUniformLocation(shader.program, "aditionalPosition");

	shader.color4Aux_loc = gl.getUniformLocation(shader.program, "vColor4Aux");
	shader.camSpacePixelTranslation_loc = gl.getUniformLocation(shader.program, "camSpacePixelTranslation");
	shader.screenSize_loc = gl.getUniformLocation(shader.program, "screenSize");
	shader.ProjectionMatrix_loc = gl.getUniformLocation(shader.program, "ProjectionMatrix");
	shader.ModelViewMatrixRelToEye_loc = gl.getUniformLocation(shader.program, "ModelViewMatrixRelToEye");
};

















'use strict';

// An basic example.***********************************************************
/*
	var shader_vertex_source="\n\
		attribute vec3 position;\n\
		uniform mat4 Pmatrix;\n\
		uniform mat4 Vmatrix;\n\
		uniform mat4 Mmatrix;\n\
		attribute vec3 color; //the color of the point\n\
		varying vec3 vColor;\n\
		void main(void) { //pre-built function\n\
		gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
		vColor=color;\n\
		}";

	var shader_fragment_source="\n\
		precision mediump float;\n\
		varying vec3 vColor;\n\
		void main(void) {\n\
		gl_FragColor = vec4(vColor, 1.);\n\
		}";
		*/
// End example.-----------------------------------------------------------------

// http://learningwebgl.com/blog/?p=507
/*
		http://blogs.agi.com/insight3d/index.php/2008/09/03/precisions-precisions/ // GPU RTE HighValue-LowValue
		uniform vec3 uViewerHigh;
		uniform vec3 uViewerLow;

		void main(void)
		{
			vec3 highDifference = vec3(gl_Vertex.xyz - uViewerHigh);
			vec3 lowDifference = vec3(gl_Normal.xyz - uViewerLow);
			gl_Position = gl_ModelViewProjectionMatrix *
				 vec4(highDifference + lowDifference, 1.0);
		}
		//-----------------------------------------------
		void CDoubleToTwoFloats::Convert(double doubleValue,
		float&amp; floatHigh, float&amp; floatLow)
		{
			if (doubleValue &gt;= 0.0)
			{
				double doubleHigh = floor(doubleValue / 65536.0) * 65536.0;
				floatHigh = (float)doubleHigh;
				floatLow = (float)(doubleValue - doubleHigh);
			}
			else
			{
				double doubleHigh = floor(-doubleValue / 65536.0) * 65536.0;
				floatHigh = (float)-doubleHigh;
				floatLow = (float)(doubleValue + doubleHigh);
			}
		}
		//-----------------------------------------------
		*/
/*
		vec4 czm_translateRelativeToEye(vec3 high, vec3 low)\n\
		{\n\
			vec3 highDifference = high - czm_encodedCameraPositionMCHigh;\n\
			vec3 lowDifference = low - czm_encodedCameraPositionMCLow;\n\
		\n\
			return vec4(highDifference + lowDifference, 1.0);\n\
		}\n\
		*/

/**
 * 조명 입력 및 재질 구성을 기반으로 렌더링 된 각 픽셀의 색상을 계산하기위한 수학적 계산 및 알고리즘을 포함하는 작은 스크립트
 * @class Shader
 */
var Shader = function() 
{
	if (!(this instanceof Shader)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.shader_name;
	this.shader_vertex_source;
	this.shader_fragment_source;
	this.SHADER_PROGRAM;

	this.shader_vertex;
	this.shader_fragment;

	this._ModelViewProjectionMatrixRelToEye;
	this._RefTransfMatrix;
	this._NormalMatrix;

	this._encodedCamPosHIGH;
	this._encodedCamPosLOW;
	this._BuildingPosHIGH;
	this._BuildingPosLOW;
	this._lightDirection;

	this._color;
	this._position;
	this._texcoord;
	this._normal;

	// test.***
	this.samplerUniform;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class ShadersManager
 */
var ShadersManager = function() 
{
	if (!(this instanceof ShadersManager)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.shaders_array = [];

	// Create shaders to render F4D_Format.**********************
	// 1) Standard shader, that can render light mapping.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @param idx = 변수
 * returns shader
 */
ShadersManager.prototype.getMagoShader = function(idx) 
{
	var shader;

	if (idx >= 0 && idx < this.shaders_array.length) 
	{
		shader = this.shaders_array[idx];
	}

	return shader;
};

/**
 * 어떤 일을 하고 있습니까?
 */
ShadersManager.prototype.getShader = function(gl, source, type, typeString) 
{
	// Source from internet.***
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
	{
		alert("ERROR IN "+typeString+ " SHADER : " + gl.getShaderInfoLog(shader));
		return false;
	}
	return shader;
};

/**
 * 어떤 일을 하고 있습니까?
 */
ShadersManager.prototype.createDefaultShader = function(gl) 
{
	this.createStandardShader(gl);                // 0.***
	this.createTextureSimpleObjectShader(gl);     // 1.***
	this.createColorSelectionShader(gl);          // 2.***
	this.createTextureSimpleObjectA1Shader(gl);   // 3.***
	this.createCloudShader(gl);                   // 4.***
	this.createBlendingCubeShader(gl);            // 5.***
	this.createPCloudShader(gl);                  // 6.***
	this.createSimpleObjectTexNormalShader(gl); // 7.***
};

/**
 * 어떤 일을 하고 있습니까?
 */
ShadersManager.prototype.createColorSelectionShader = function(gl) 
{
	var shader = new Shader();
	this.shaders_array.push(shader);

	shader.shader_vertex_source = ShaderSource.ColorVS;
	//http://www.lighthouse3d.com/tutorials/opengl-selection-tutorial/

	shader.shader_fragment_source = ShaderSource.ColorFS;

	// https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf
	shader.SHADER_PROGRAM = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, shader.shader_vertex_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, shader.shader_fragment_source, gl.FRAGMENT_SHADER, "FRAGMENT");
	gl.attachShader(shader.SHADER_PROGRAM, shader.shader_vertex);
	gl.attachShader(shader.SHADER_PROGRAM, shader.shader_fragment);
	gl.linkProgram(shader.SHADER_PROGRAM);

	shader._ModelViewProjectionMatrixRelToEye = gl.getUniformLocation(shader.SHADER_PROGRAM, "ModelViewProjectionMatrixRelToEye");
	shader._encodedCamPosHIGH = gl.getUniformLocation(shader.SHADER_PROGRAM, "encodedCameraPositionMCHigh");
	shader._encodedCamPosLOW = gl.getUniformLocation(shader.SHADER_PROGRAM, "encodedCameraPositionMCLow");
	shader._BuildingPosHIGH = gl.getUniformLocation(shader.SHADER_PROGRAM, "buildingPosHIGH");
	shader._BuildingPosLOW = gl.getUniformLocation(shader.SHADER_PROGRAM, "buildingPosLOW");
	shader._RefTransfMatrix = gl.getUniformLocation(shader.SHADER_PROGRAM, "RefTransfMatrix");

	shader._position = gl.getAttribLocation(shader.SHADER_PROGRAM, "position");
};

/**
 * 어떤 일을 하고 있습니까?
 */
ShadersManager.prototype.createTextureSimpleObjectShader = function(gl) 
{
	var shader = new Shader();
	this.shaders_array.push(shader);

	shader.shader_vertex_source = ShaderSource.TextureVS;
	shader.shader_fragment_source = ShaderSource.TextureFS;

	//http://learningwebgl.com/blog/?p=507
	//https://gist.github.com/elnaqah/5070979
	shader.SHADER_PROGRAM = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, shader.shader_vertex_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, shader.shader_fragment_source, gl.FRAGMENT_SHADER, "FRAGMENT");
	gl.attachShader(shader.SHADER_PROGRAM, shader.shader_vertex);
	gl.attachShader(shader.SHADER_PROGRAM, shader.shader_fragment);
	gl.linkProgram(shader.SHADER_PROGRAM);

	shader._encodedCamPosHIGH = gl.getUniformLocation(shader.SHADER_PROGRAM, "encodedCameraPositionMCHigh");
	shader._encodedCamPosLOW = gl.getUniformLocation(shader.SHADER_PROGRAM, "encodedCameraPositionMCLow");
	shader._BuildingPosHIGH = gl.getUniformLocation(shader.SHADER_PROGRAM, "buildingPosHIGH");
	shader._BuildingPosLOW = gl.getUniformLocation(shader.SHADER_PROGRAM, "buildingPosLOW");
	shader._Mmatrix = gl.getUniformLocation(shader.SHADER_PROGRAM, "Mmatrix");
	shader._ModelViewProjectionMatrixRelToEye = gl.getUniformLocation(shader.SHADER_PROGRAM, "ModelViewProjectionMatrixRelToEye");
	shader.SHADER_PROGRAM.samplerUniform = gl.getUniformLocation(shader.SHADER_PROGRAM, "uSampler");

	shader._position = gl.getAttribLocation(shader.SHADER_PROGRAM, "position");
	shader._texcoord = gl.getAttribLocation(shader.SHADER_PROGRAM, "aTextureCoord");
};

/**
 * 어떤 일을 하고 있습니까?
 */
ShadersManager.prototype.createTextureSimpleObjectA1Shader = function(gl) 
{
	var shader = new Shader();
	this.shaders_array.push(shader);

	shader.shader_vertex_source = ShaderSource.TextureA1VS;
	shader.shader_fragment_source = ShaderSource.TextureA1FS;

	//http://learningwebgl.com/blog/?p=507
	//https://gist.github.com/elnaqah/5070979
	shader.SHADER_PROGRAM = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, shader.shader_vertex_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, shader.shader_fragment_source, gl.FRAGMENT_SHADER, "FRAGMENT");
	gl.attachShader(shader.SHADER_PROGRAM, shader.shader_vertex);
	gl.attachShader(shader.SHADER_PROGRAM, shader.shader_fragment);
	gl.linkProgram(shader.SHADER_PROGRAM);

	shader._encodedCamPosHIGH = gl.getUniformLocation(shader.SHADER_PROGRAM, "encodedCameraPositionMCHigh");
	shader._encodedCamPosLOW = gl.getUniformLocation(shader.SHADER_PROGRAM, "encodedCameraPositionMCLow");
	shader._BuildingPosHIGH = gl.getUniformLocation(shader.SHADER_PROGRAM, "buildingPosHIGH");
	shader._BuildingPosLOW = gl.getUniformLocation(shader.SHADER_PROGRAM, "buildingPosLOW");
	shader._ModelViewProjectionMatrixRelToEye = gl.getUniformLocation(shader.SHADER_PROGRAM, "ModelViewProjectionMatrixRelToEye");
	shader.SHADER_PROGRAM.samplerUniform = gl.getUniformLocation(shader.SHADER_PROGRAM, "uSampler");

	shader._position = gl.getAttribLocation(shader.SHADER_PROGRAM, "position");
	shader._texcoord = gl.getAttribLocation(shader.SHADER_PROGRAM, "aTextureCoord");
};

/**
 * 어떤 일을 하고 있습니까?
 */
ShadersManager.prototype.createStandardShader = function(gl) 
{
	// This shader renders the normal f4d geometry.***
	var standard_shader = new Shader();
	this.shaders_array.push(standard_shader);

	standard_shader.shader_vertex_source = ShaderSource.StandardVS;
	standard_shader.shader_fragment_source = ShaderSource.StandardFS;

	// Default ShaderProgram.********************************************************************
	standard_shader.SHADER_PROGRAM = gl.createProgram();
	standard_shader.shader_vertex = this.getShader(gl, standard_shader.shader_vertex_source, gl.VERTEX_SHADER, "VERTEX");
	standard_shader.shader_fragment = this.getShader(gl, standard_shader.shader_fragment_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(standard_shader.SHADER_PROGRAM, standard_shader.shader_vertex);
	gl.attachShader(standard_shader.SHADER_PROGRAM, standard_shader.shader_fragment);
	gl.linkProgram(standard_shader.SHADER_PROGRAM);

	standard_shader._ModelViewProjectionMatrixRelToEye = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "ModelViewProjectionMatrixRelToEye");
	standard_shader._RefTransfMatrix = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "RefTransfMatrix");
	standard_shader._encodedCamPosHIGH = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "encodedCameraPositionMCHigh");
	standard_shader._encodedCamPosLOW = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "encodedCameraPositionMCLow");
	standard_shader._BuildingPosHIGH = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "buildingPosHIGH");
	standard_shader._BuildingPosLOW = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "buildingPosLOW");

	standard_shader._color = gl.getAttribLocation(standard_shader.SHADER_PROGRAM, "color");
	standard_shader._position = gl.getAttribLocation(standard_shader.SHADER_PROGRAM, "position");
};

/**
 * 어떤 일을 하고 있습니까?
 */
ShadersManager.prototype.createCloudShader = function(gl) 
{
	// This shader renders the f4d clouds.***
	var standard_shader = new Shader();
	this.shaders_array.push(standard_shader);

	standard_shader.shader_vertex_source = ShaderSource.CloudVS;
	standard_shader.shader_fragment_source = ShaderSource.CloudFS;

	// Default ShaderProgram.********************************************************************
	standard_shader.SHADER_PROGRAM = gl.createProgram();
	standard_shader.shader_vertex = this.getShader(gl, standard_shader.shader_vertex_source, gl.VERTEX_SHADER, "VERTEX");
	standard_shader.shader_fragment = this.getShader(gl, standard_shader.shader_fragment_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(standard_shader.SHADER_PROGRAM, standard_shader.shader_vertex);
	gl.attachShader(standard_shader.SHADER_PROGRAM, standard_shader.shader_fragment);
	gl.linkProgram(standard_shader.SHADER_PROGRAM);

	standard_shader._ModelViewProjectionMatrixRelToEye = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "ModelViewProjectionMatrixRelToEye");
	standard_shader._encodedCamPosHIGH = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "encodedCameraPositionMCHigh");
	standard_shader._encodedCamPosLOW = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "encodedCameraPositionMCLow");
	standard_shader._cloudPosHIGH = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "cloudPosHIGH");
	standard_shader._cloudPosLOW = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "cloudPosLOW");

	standard_shader._color = gl.getAttribLocation(standard_shader.SHADER_PROGRAM, "color");
	standard_shader._position = gl.getAttribLocation(standard_shader.SHADER_PROGRAM, "position");
};

/**
 * 어떤 일을 하고 있습니까?
 */
ShadersManager.prototype.createBlendingCubeShader = function(gl) 
{
	// This shader renders the f4d clouds.***
	var standard_shader = new Shader();
	this.shaders_array.push(standard_shader);

	standard_shader.shader_vertex_source = ShaderSource.BlendingCubeVS;
	standard_shader.shader_fragment_source = ShaderSource.BlendingCubeFS;

	// Default ShaderProgram.********************************************************************
	standard_shader.SHADER_PROGRAM = gl.createProgram();
	standard_shader.shader_vertex = this.getShader(gl, standard_shader.shader_vertex_source, gl.VERTEX_SHADER, "VERTEX");
	standard_shader.shader_fragment = this.getShader(gl, standard_shader.shader_fragment_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(standard_shader.SHADER_PROGRAM, standard_shader.shader_vertex);
	gl.attachShader(standard_shader.SHADER_PROGRAM, standard_shader.shader_fragment);
	gl.linkProgram(standard_shader.SHADER_PROGRAM);

	standard_shader._ModelViewProjectionMatrixRelToEye = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "ModelViewProjectionMatrixRelToEye");
	standard_shader._encodedCamPosHIGH = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "encodedCameraPositionMCHigh");
	standard_shader._encodedCamPosLOW = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "encodedCameraPositionMCLow");

	standard_shader._color = gl.getAttribLocation(standard_shader.SHADER_PROGRAM, "color");
	standard_shader._position = gl.getAttribLocation(standard_shader.SHADER_PROGRAM, "position");
};

/**
 * 어떤 일을 하고 있습니까?
 */
ShadersManager.prototype.createPCloudShader = function(gl) 
{
	// This shader renders the f4d clouds.***
	var standard_shader = new Shader();
	this.shaders_array.push(standard_shader);

	standard_shader.shader_vertex_source = ShaderSource.PointCloudVS;
	standard_shader.shader_fragment_source = ShaderSource.PointCloudFS;

	// Default ShaderProgram.********************************************************************
	standard_shader.SHADER_PROGRAM = gl.createProgram();
	standard_shader.shader_vertex = this.getShader(gl, standard_shader.shader_vertex_source, gl.VERTEX_SHADER, "VERTEX");
	standard_shader.shader_fragment = this.getShader(gl, standard_shader.shader_fragment_source, gl.FRAGMENT_SHADER, "FRAGMENT");

	gl.attachShader(standard_shader.SHADER_PROGRAM, standard_shader.shader_vertex);
	gl.attachShader(standard_shader.SHADER_PROGRAM, standard_shader.shader_fragment);
	gl.linkProgram(standard_shader.SHADER_PROGRAM);

	standard_shader._ModelViewProjectionMatrixRelToEye = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "ModelViewProjectionMatrixRelToEye");
	standard_shader._encodedCamPosHIGH = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "encodedCameraPositionMCHigh");
	standard_shader._encodedCamPosLOW = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "encodedCameraPositionMCLow");
	standard_shader._BuildingPosHIGH = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "buildingPosHIGH");
	standard_shader._BuildingPosLOW = gl.getUniformLocation(standard_shader.SHADER_PROGRAM, "buildingPosLOW");

	standard_shader._color = gl.getAttribLocation(standard_shader.SHADER_PROGRAM, "color");
	standard_shader._position = gl.getAttribLocation(standard_shader.SHADER_PROGRAM, "position");
};

/**
 * 어떤 일을 하고 있습니까?
 */
ShadersManager.prototype.createSimpleObjectTexNormalShader = function(gl) 
{
	var shader = new Shader();
	this.shaders_array.push(shader);
	shader.shader_vertex_source = ShaderSource.TextureNormalVS;
	shader.shader_fragment_source = ShaderSource.TextureNormalFS;

	//http://learningwebgl.com/blog/?p=507
	//https://gist.github.com/elnaqah/5070979
	//https://dannywoodz.wordpress.com/2014/12/14/webgl-from-scratch-directional-lighting-part-1/
	//http://learningwebgl.com/blog/?p=684 // good.***
	shader.SHADER_PROGRAM = gl.createProgram();
	shader.shader_vertex = this.getShader(gl, shader.shader_vertex_source, gl.VERTEX_SHADER, "VERTEX");
	shader.shader_fragment = this.getShader(gl, shader.shader_fragment_source, gl.FRAGMENT_SHADER, "FRAGMENT");
	gl.attachShader(shader.SHADER_PROGRAM, shader.shader_vertex);
	gl.attachShader(shader.SHADER_PROGRAM, shader.shader_fragment);
	gl.linkProgram(shader.SHADER_PROGRAM);

	shader._encodedCamPosHIGH = gl.getUniformLocation(shader.SHADER_PROGRAM, "encodedCameraPositionMCHigh");
	shader._encodedCamPosLOW = gl.getUniformLocation(shader.SHADER_PROGRAM, "encodedCameraPositionMCLow");
	shader._BuildingPosHIGH = gl.getUniformLocation(shader.SHADER_PROGRAM, "buildingPosHIGH");
	shader._BuildingPosLOW = gl.getUniformLocation(shader.SHADER_PROGRAM, "buildingPosLOW");

	shader._ModelViewProjectionMatrixRelToEye = gl.getUniformLocation(shader.SHADER_PROGRAM, "ModelViewProjectionMatrixRelToEye");
	shader._NormalMatrix = gl.getUniformLocation(shader.SHADER_PROGRAM, "uNMatrix");

	//shader.SHADER_PROGRAM.samplerUniform = gl.getUniformLocation(shader.SHADER_PROGRAM, "uSampler");
	shader.samplerUniform = gl.getUniformLocation(shader.SHADER_PROGRAM, "uSampler");
	shader._lightDirection = gl.getUniformLocation(shader.SHADER_PROGRAM, "uLightingDirection");

	shader._position = gl.getAttribLocation(shader.SHADER_PROGRAM, "position");
	shader._texcoord = gl.getAttribLocation(shader.SHADER_PROGRAM, "aTextureCoord");
	shader._normal = gl.getAttribLocation(shader.SHADER_PROGRAM, "aVertexNormal");
};

//# sourceURL=Shader.js

'use strict';
var ShaderSource = {};
ShaderSource.BlendingCubeFS = "	precision lowp float;\n\
	varying vec4 vColor;\n\
\n\
	void main()\n\
    {\n\
		gl_FragColor = vColor;\n\
	}";
ShaderSource.BlendingCubeVS = "attribute vec3 position;\n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
attribute vec4 color;\n\
varying vec4 vColor;\n\
\n\
void main()\n\
{\n\
    vec3 highDifference = -encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = position.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos = vec4(position.xyz, 1.0);\n\
\n\
    vColor=color;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos;\n\
}";
ShaderSource.BlurFS = "#ifdef GL_ES\n\
    precision highp float;\n\
    #endif\n\
uniform sampler2D colorTex;\n\
uniform vec2 texelSize;\n\
varying vec2 vTexCoord; 	 	\n\
\n\
void main()\n\
{\n\
    vec3 result = vec3(0.0);\n\
    for (int i = 0; i < 4; ++i) {\n\
        for (int j = 0; j < 4; ++j) {\n\
            vec2 offset = vec2(texelSize.x * float(j), texelSize.y * float(i));\n\
            result += texture2D(colorTex, vTexCoord + offset).rgb;\n\
        }\n\
    }\n\
            \n\
    gl_FragColor.rgb = vec3(result * 0.0625); \n\
    gl_FragColor.a = 1.0;\n\
}\n\
";
ShaderSource.BlurVS = "attribute vec4 position;\n\
attribute vec2 texCoord;\n\
\n\
uniform mat4 projectionMatrix;\n\
uniform mat4 modelViewMatrix;  \n\
\n\
varying vec2 vTexCoord;\n\
\n\
void main()\n\
{	\n\
    vTexCoord = texCoord;\n\
    \n\
    gl_Position = projectionMatrix * modelViewMatrix * position;\n\
}\n\
";
ShaderSource.BoxDepthFS = "#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
uniform float near;\n\
uniform float far;\n\
\n\
varying float depth;  \n\
\n\
vec4 packDepth(const in float depth)\n\
{\n\
    const vec4 bit_shift = vec4(16777216.0, 65536.0, 256.0, 1.0);\n\
    const vec4 bit_mask  = vec4(0.0, 0.00390625, 0.00390625, 0.00390625); \n\
    vec4 res = fract(depth * bit_shift);\n\
    res -= res.xxyz * bit_mask;\n\
    return res;  \n\
}\n\
\n\
void main()\n\
{     \n\
    gl_FragData[0] = packDepth(-depth);\n\
}\n\
";
ShaderSource.BoxDepthVS = "attribute vec3 position;\n\
\n\
uniform mat4 modelViewMatrixRelToEye; \n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform mat4 buildingRotMatrix;  \n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
uniform float near;\n\
uniform float far;\n\
uniform vec3 aditionalPosition;\n\
\n\
varying float depth;  \n\
void main()\n\
{	\n\
    vec4 rotatedPos = buildingRotMatrix * vec4(position.xyz + aditionalPosition.xyz, 1.0);\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos4 = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
    \n\
    //linear depth in camera space (0..far)\n\
    depth = (modelViewMatrixRelToEye * pos4).z/far;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos4;\n\
}\n\
";
ShaderSource.BoxSsaoFS = "#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
uniform sampler2D depthTex;\n\
uniform sampler2D noiseTex;  \n\
uniform sampler2D diffuseTex;\n\
uniform bool hasTexture;\n\
varying vec3 vNormal;\n\
uniform mat4 projectionMatrix;\n\
uniform mat4 m;\n\
uniform vec2 noiseScale;\n\
uniform float near;\n\
uniform float far;            \n\
uniform float fov;\n\
uniform float aspectRatio;    \n\
uniform float screenWidth;    \n\
uniform float screenHeight;    \n\
uniform vec3 kernel[16];   \n\
uniform vec4 vColor4Aux;\n\
\n\
varying vec2 vTexCoord;   \n\
varying vec3 vLightWeighting;\n\
varying vec4 vcolor4;\n\
\n\
const int kernelSize = 16;  \n\
const float radius = 0.5;      \n\
\n\
float unpackDepth(const in vec4 rgba_depth)\n\
{\n\
    const vec4 bit_shift = vec4(0.000000059605, 0.000015258789, 0.00390625, 1.0);\n\
    float depth = dot(rgba_depth, bit_shift);\n\
    return depth;\n\
}                \n\
\n\
vec3 getViewRay(vec2 tc)\n\
{\n\
    float hfar = 2.0 * tan(fov/2.0) * far;\n\
    float wfar = hfar * aspectRatio;    \n\
    vec3 ray = vec3(wfar * (tc.x - 0.5), hfar * (tc.y - 0.5), -far);    \n\
    return ray;                      \n\
}         \n\
            \n\
//linear view space depth\n\
float getDepth(vec2 coord)\n\
{                          \n\
    return unpackDepth(texture2D(depthTex, coord.xy));\n\
}    \n\
\n\
void main()\n\
{          \n\
    vec2 screenPos = vec2(gl_FragCoord.x / screenWidth, gl_FragCoord.y / screenHeight);		                 \n\
    float linearDepth = getDepth(screenPos);          \n\
    vec3 origin = getViewRay(screenPos) * linearDepth;   \n\
    vec3 normal2 = vNormal;   \n\
            \n\
    vec3 rvec = texture2D(noiseTex, screenPos.xy * noiseScale).xyz * 2.0 - 1.0;\n\
    vec3 tangent = normalize(rvec - normal2 * dot(rvec, normal2));\n\
    vec3 bitangent = cross(normal2, tangent);\n\
    mat3 tbn = mat3(tangent, bitangent, normal2);        \n\
    \n\
    float occlusion = 0.0;\n\
    for(int i = 0; i < kernelSize; ++i)\n\
    {    	 \n\
        vec3 sample = origin + (tbn * kernel[i]) * radius;\n\
        vec4 offset = projectionMatrix * vec4(sample, 1.0);		\n\
        offset.xy /= offset.w;\n\
        offset.xy = offset.xy * 0.5 + 0.5;        \n\
        float sampleDepth = -sample.z/far;\n\
        float depthBufferValue = getDepth(offset.xy);				              \n\
        float range_check = abs(linearDepth - depthBufferValue)+radius*0.998;\n\
        if (range_check < radius*1.001 && depthBufferValue <= sampleDepth)\n\
        {\n\
            occlusion +=  1.0;\n\
        }\n\
        \n\
    }   \n\
        \n\
    occlusion = 1.0 - occlusion / float(kernelSize);\n\
                                \n\
    vec3 lightPos = vec3(10.0, 10.0, 10.0);\n\
    vec3 L = normalize(lightPos);\n\
    float DiffuseFactor = dot(normal2, L);\n\
    float NdotL = abs(DiffuseFactor);\n\
    vec3 diffuse = vec3(NdotL);\n\
    vec3 ambient = vec3(1.0);\n\
    vec4 textureColor;\n\
    textureColor = vcolor4;\n\
\n\
    gl_FragColor.rgb = vec3((textureColor.xyz)*vLightWeighting * occlusion); \n\
    gl_FragColor.a = 1.0;   \n\
}\n\
";
ShaderSource.BoxSsaoVS = "attribute vec3 position;\n\
attribute vec3 normal;\n\
attribute vec4 color4;\n\
\n\
uniform mat4 projectionMatrix;  \n\
uniform mat4 modelViewMatrix;\n\
uniform mat4 modelViewMatrixRelToEye; \n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform mat4 normalMatrix4;\n\
uniform mat4 buildingRotMatrix;  \n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
uniform vec3 aditionalPosition;\n\
uniform vec4 oneColor4;\n\
uniform bool bUse1Color;\n\
uniform vec3 scale;\n\
uniform bool bScale;\n\
\n\
varying vec3 vNormal;\n\
varying vec2 vTexCoord;  \n\
varying vec3 uAmbientColor;\n\
varying vec3 vLightWeighting;\n\
varying vec4 vcolor4;\n\
\n\
void main()\n\
{	\n\
    vec4 position2 = vec4(position.xyz, 1.0);\n\
    if(bScale)\n\
    {\n\
        position2.x *= scale.x;\n\
        position2.y *= scale.y;\n\
        position2.z *= scale.z;\n\
    }\n\
    vec4 rotatedPos = buildingRotMatrix * vec4(position2.xyz + aditionalPosition.xyz, 1.0);\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos4 = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
   \n\
    vec4 rotatedNormal = buildingRotMatrix * vec4(normal.xyz, 1.0);\n\
    vLightWeighting = vec3(1.0, 1.0, 1.0);\n\
    uAmbientColor = vec3(0.8, 0.8, 0.8);\n\
    vec3 uLightingDirection = vec3(0.5, 0.5, 0.5);\n\
    vec3 directionalLightColor = vec3(0.6, 0.6, 0.6);\n\
    vNormal = (normalMatrix4 * vec4(rotatedNormal.x, rotatedNormal.y, rotatedNormal.z, 1.0)).xyz;\n\
    float directionalLightWeighting = max(dot(vNormal, uLightingDirection), 0.0);\n\
    vLightWeighting = uAmbientColor + directionalLightColor * directionalLightWeighting;\n\
    if(bUse1Color)\n\
    {\n\
        vcolor4 = oneColor4;\n\
    }\n\
    else\n\
    {\n\
        vcolor4 = color4;\n\
    }\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos4;\n\
}\n\
";
ShaderSource.CloudFS = "precision lowp float;\n\
varying vec3 vColor;\n\
\n\
void main()\n\
{\n\
    gl_FragColor = vec4(vColor, 1.);\n\
}";
ShaderSource.CloudVS = "attribute vec3 position;\n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform vec3 cloudPosHIGH;\n\
uniform vec3 cloudPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
attribute vec3 color;\n\
varying vec3 vColor;\n\
\n\
void main()\n\
{\n\
    vec3 objPosHigh = cloudPosHIGH;\n\
    vec3 objPosLow = cloudPosLOW.xyz + position.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
\n\
    vColor=color;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos;\n\
}";
ShaderSource.ColorFS = "precision mediump float;\n\
uniform int byteColor_r;\n\
uniform int byteColor_g;\n\
uniform int byteColor_b;\n\
\n\
void main()\n\
{\n\
    float byteMaxValue = 255.0;\n\
\n\
    gl_FragColor = vec4(float(byteColor_r)/byteMaxValue, float(byteColor_g)/byteMaxValue, float(byteColor_b)/byteMaxValue, 1);\n\
}\n\
";
ShaderSource.ColorSelectionSsaoFS = "precision highp float;\n\
uniform vec4 vColor4Aux;\n\
\n\
void main()\n\
{          \n\
    gl_FragColor = vColor4Aux;\n\
}\n\
";
ShaderSource.ColorSelectionSsaoVS = "attribute vec3 position;\n\
\n\
uniform mat4 buildingRotMatrix;\n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform mat4 RefTransfMatrix;\n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
uniform vec3 aditionalPosition;\n\
uniform vec3 refTranslationVec;\n\
uniform int refMatrixType; // 0= identity, 1= translate, 2= transform\n\
\n\
void main()\n\
{\n\
    vec4 rotatedPos;\n\
	if(refMatrixType == 0)\n\
	{\n\
		rotatedPos = buildingRotMatrix * vec4(position.xyz, 1.0) + vec4(aditionalPosition.xyz, 0.0);\n\
	}\n\
	else if(refMatrixType == 1)\n\
	{\n\
		rotatedPos = buildingRotMatrix * vec4(position.xyz + refTranslationVec.xyz, 1.0) + vec4(aditionalPosition.xyz, 0.0);\n\
	}\n\
	else if(refMatrixType == 2)\n\
	{\n\
		rotatedPos = RefTransfMatrix * vec4(position.xyz, 1.0) + vec4(aditionalPosition.xyz, 0.0);\n\
	}\n\
\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos4 = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
    \n\
    gl_PointSize = 10.0;\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos4;\n\
}\n\
";
ShaderSource.ColorVS = "attribute vec3 position;\n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
uniform mat4 RefTransfMatrix;\n\
\n\
void main()\n\
{\n\
    vec4 rotatedPos = RefTransfMatrix * vec4(position.xyz, 1.0);\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
    \n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos;\n\
}\n\
";
ShaderSource.LegoDepthFS = "#ifdef GL_ES\n\
precision highp float;\n\
#endif\n\
uniform float near;\n\
uniform float far;\n\
\n\
varying float depth;  \n\
\n\
vec4 packDepth(const in float depth)\n\
{\n\
    const vec4 bit_shift = vec4(16777216.0, 65536.0, 256.0, 1.0);\n\
    const vec4 bit_mask  = vec4(0.0, 0.00390625, 0.00390625, 0.00390625); \n\
    vec4 res = fract(depth * bit_shift);\n\
    res -= res.xxyz * bit_mask;\n\
    return res;  \n\
}\n\
\n\
void main()\n\
{     \n\
    gl_FragData[0] = packDepth(-depth);\n\
}\n\
";
ShaderSource.LegoDepthVS = "attribute vec3 position;\n\
attribute vec3 normal;\n\
attribute vec2 texCoord;\n\
\n\
uniform mat4 modelViewMatrixRelToEye; \n\
uniform mat4 RefTransfMatrix;\n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
uniform float near;\n\
uniform float far;\n\
uniform vec3 aditionalPosition;\n\
\n\
varying float depth;  \n\
void main()\n\
{	\n\
    vec4 rotatedPos = RefTransfMatrix * vec4(position.xyz + aditionalPosition.xyz, 1.0);\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos4 = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
\n\
    depth = (modelViewMatrixRelToEye * pos4).z/far;\n\
    \n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos4;\n\
}\n\
";
ShaderSource.LegoSsaoFS = "#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
uniform sampler2D depthTex;\n\
uniform sampler2D noiseTex;  \n\
uniform sampler2D diffuseTex;\n\
uniform bool hasTexture;\n\
varying vec3 vNormal;\n\
uniform mat4 projectionMatrix;\n\
uniform mat4 m;\n\
uniform vec2 noiseScale;\n\
uniform float near;\n\
uniform float far;            \n\
uniform float fov;\n\
uniform float aspectRatio;    \n\
uniform float screenWidth;    \n\
uniform float screenHeight;    \n\
uniform vec3 kernel[16];   \n\
uniform vec4 vColor4Aux;\n\
\n\
varying vec2 vTexCoord;   \n\
varying vec3 vLightWeighting;\n\
varying vec4 vcolor4;\n\
\n\
const int kernelSize = 16;  \n\
const float radius = 0.5;      \n\
\n\
float unpackDepth(const in vec4 rgba_depth)\n\
{\n\
    const vec4 bit_shift = vec4(0.000000059605, 0.000015258789, 0.00390625, 1.0);\n\
    float depth = dot(rgba_depth, bit_shift);\n\
    return depth;\n\
}                \n\
\n\
vec3 getViewRay(vec2 tc)\n\
{\n\
    float hfar = 2.0 * tan(fov/2.0) * far;\n\
    float wfar = hfar * aspectRatio;    \n\
    vec3 ray = vec3(wfar * (tc.x - 0.5), hfar * (tc.y - 0.5), -far);    \n\
    return ray;                      \n\
}         \n\
            \n\
//linear view space depth\n\
float getDepth(vec2 coord)\n\
{                          \n\
    return unpackDepth(texture2D(depthTex, coord.xy));\n\
}    \n\
\n\
void main()\n\
{          \n\
    vec2 screenPos = vec2(gl_FragCoord.x / screenWidth, gl_FragCoord.y / screenHeight);		                 \n\
    float linearDepth = getDepth(screenPos);          \n\
    vec3 origin = getViewRay(screenPos) * linearDepth;   \n\
    vec3 normal2 = vNormal;   \n\
            \n\
    vec3 rvec = texture2D(noiseTex, screenPos.xy * noiseScale).xyz * 2.0 - 1.0;\n\
    vec3 tangent = normalize(rvec - normal2 * dot(rvec, normal2));\n\
    vec3 bitangent = cross(normal2, tangent);\n\
    mat3 tbn = mat3(tangent, bitangent, normal2);        \n\
    \n\
    float occlusion = 0.0;\n\
    for(int i = 0; i < kernelSize; ++i)\n\
    {    	 \n\
        vec3 sample = origin + (tbn * kernel[i]) * radius;\n\
        vec4 offset = projectionMatrix * vec4(sample, 1.0);		\n\
        offset.xy /= offset.w;\n\
        offset.xy = offset.xy * 0.5 + 0.5;        \n\
        float sampleDepth = -sample.z/far;\n\
        float depthBufferValue = getDepth(offset.xy);				              \n\
        float range_check = abs(linearDepth - depthBufferValue)+radius*0.998;\n\
        if (range_check < radius*1.001 && depthBufferValue <= sampleDepth)\n\
        {\n\
            occlusion +=  1.0;\n\
        }\n\
        \n\
    }   \n\
        \n\
    occlusion = 1.0 - occlusion / float(kernelSize);\n\
                                \n\
    vec3 lightPos = vec3(10.0, 10.0, 10.0);\n\
    vec3 L = normalize(lightPos);\n\
    float DiffuseFactor = dot(normal2, L);\n\
    float NdotL = abs(DiffuseFactor);\n\
    vec3 diffuse = vec3(NdotL);\n\
    vec3 ambient = vec3(1.0);\n\
    vec4 textureColor;\n\
    textureColor = vcolor4;\n\
\n\
    gl_FragColor.rgb = vec3((textureColor.xyz)*vLightWeighting * occlusion); \n\
    gl_FragColor.a = 1.0;   \n\
}\n\
";
ShaderSource.LegoSsaoVS = "attribute vec3 position;\n\
attribute vec3 normal;\n\
attribute vec4 color4;\n\
attribute vec2 texCoord;\n\
\n\
uniform mat4 projectionMatrix;  \n\
uniform mat4 modelViewMatrix;\n\
uniform mat4 modelViewMatrixRelToEye; \n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform mat4 RefTransfMatrix;\n\
uniform mat4 normalMatrix4;\n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
uniform vec3 aditionalPosition;\n\
\n\
varying vec3 vNormal;\n\
varying vec2 vTexCoord;  \n\
varying vec3 uAmbientColor;\n\
varying vec3 vLightWeighting;\n\
varying vec4 vcolor4;\n\
\n\
void main()\n\
{	\n\
    vec4 rotatedPos = RefTransfMatrix * vec4(position.xyz + aditionalPosition.xyz, 1.0);\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos4 = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
    \n\
    vec3 rotatedNormal = mat3(RefTransfMatrix) * normal;\n\
    vLightWeighting = vec3(1.0, 1.0, 1.0);\n\
    uAmbientColor = vec3(0.8, 0.8, 0.8);\n\
    vec3 uLightingDirection = vec3(0.5, 0.5, 0.5);\n\
    vec3 directionalLightColor = vec3(0.6, 0.6, 0.6);\n\
    vNormal = (normalMatrix4 * vec4(rotatedNormal.x, rotatedNormal.y, rotatedNormal.z, 1.0)).xyz;\n\
\n\
    float directionalLightWeighting = max(dot(vNormal, uLightingDirection), 0.0);\n\
    vLightWeighting = uAmbientColor + directionalLightColor * directionalLightWeighting;\n\
    vcolor4 = color4;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos4;\n\
}\n\
";
ShaderSource.LodBuildingDepthFS = "#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
uniform float near;\n\
uniform float far;\n\
\n\
varying float depth;  \n\
\n\
vec4 packDepth(const in float depth)\n\
{\n\
    const vec4 bit_shift = vec4(16777216.0, 65536.0, 256.0, 1.0);\n\
    const vec4 bit_mask  = vec4(0.0, 0.00390625, 0.00390625, 0.00390625); \n\
    vec4 res = fract(depth * bit_shift);\n\
    res -= res.xxyz * bit_mask;\n\
    return res;  \n\
}\n\
\n\
void main()\n\
{     \n\
    gl_FragData[0] = packDepth(-depth);\n\
}\n\
";
ShaderSource.LodBuildingDepthVS = "attribute vec3 position;\n\
\n\
uniform mat4 modelViewMatrixRelToEye; \n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform mat4 buildingRotMatrix;  \n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
uniform float near;\n\
uniform float far;\n\
uniform vec3 aditionalPosition;\n\
\n\
varying float depth;  \n\
void main()\n\
{	\n\
    vec4 rotatedPos = buildingRotMatrix * vec4(position.xyz + aditionalPosition.xyz, 1.0);\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos4 = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
        \n\
    depth = (modelViewMatrixRelToEye * pos4).z/far;\n\
    \n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos4;\n\
}\n\
";
ShaderSource.LodBuildingSsaoFS = "#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
uniform sampler2D depthTex;\n\
uniform sampler2D noiseTex;  \n\
uniform sampler2D diffuseTex;\n\
uniform bool hasTexture;\n\
uniform bool textureFlipYAxis;\n\
varying vec3 vNormal;\n\
uniform mat4 projectionMatrix;\n\
uniform mat4 m;\n\
uniform vec2 noiseScale;\n\
uniform float near;\n\
uniform float far;            \n\
uniform float fov;\n\
uniform float aspectRatio;    \n\
uniform float screenWidth;    \n\
uniform float screenHeight;    \n\
uniform vec3 kernel[16];   \n\
uniform vec4 vColor4Aux;\n\
\n\
varying vec2 vTexCoord;   \n\
varying vec3 vLightWeighting;\n\
varying vec4 vcolor4;\n\
\n\
const int kernelSize = 16;  \n\
const float radius = 0.5;      \n\
\n\
float unpackDepth(const in vec4 rgba_depth)\n\
{\n\
    const vec4 bit_shift = vec4(0.000000059605, 0.000015258789, 0.00390625, 1.0);\n\
    float depth = dot(rgba_depth, bit_shift);\n\
    return depth;\n\
}                \n\
\n\
vec3 getViewRay(vec2 tc)\n\
{\n\
    float hfar = 2.0 * tan(fov/2.0) * far;\n\
    float wfar = hfar * aspectRatio;    \n\
    vec3 ray = vec3(wfar * (tc.x - 0.5), hfar * (tc.y - 0.5), -far);    \n\
    return ray;                      \n\
}         \n\
            \n\
//linear view space depth\n\
float getDepth(vec2 coord)\n\
{                          \n\
    return unpackDepth(texture2D(depthTex, coord.xy));\n\
}    \n\
\n\
void main()\n\
{          \n\
    vec2 screenPos = vec2(gl_FragCoord.x / screenWidth, gl_FragCoord.y / screenHeight);		                 \n\
    float linearDepth = getDepth(screenPos);          \n\
    vec3 origin = getViewRay(screenPos) * linearDepth;   \n\
\n\
    vec3 normal2 = vNormal;   \n\
            \n\
    vec3 rvec = texture2D(noiseTex, screenPos.xy * noiseScale).xyz * 2.0 - 1.0;\n\
    vec3 tangent = normalize(rvec - normal2 * dot(rvec, normal2));\n\
    vec3 bitangent = cross(normal2, tangent);\n\
    mat3 tbn = mat3(tangent, bitangent, normal2);        \n\
    \n\
    float occlusion = 0.0;\n\
    for(int i = 0; i < kernelSize; ++i)\n\
    {    	 \n\
        vec3 sample = origin + (tbn * kernel[i]) * radius;\n\
        vec4 offset = projectionMatrix * vec4(sample, 1.0);		\n\
        offset.xy /= offset.w;\n\
        offset.xy = offset.xy * 0.5 + 0.5;        \n\
        float sampleDepth = -sample.z/far;\n\
        float depthBufferValue = getDepth(offset.xy);				              \n\
        float range_check = abs(linearDepth - depthBufferValue)+radius*0.998;\n\
        if (range_check < radius*1.001 && depthBufferValue <= sampleDepth)\n\
        {\n\
            occlusion +=  1.0;\n\
        }\n\
        \n\
    }   \n\
        \n\
    occlusion = 1.0 - occlusion / float(kernelSize);\n\
                                \n\
    vec3 lightPos = vec3(10.0, 10.0, 10.0);\n\
    vec3 L = normalize(lightPos);\n\
    float DiffuseFactor = dot(normal2, L);\n\
    float NdotL = abs(DiffuseFactor);\n\
    vec3 diffuse = vec3(NdotL);\n\
    vec3 ambient = vec3(1.0);\n\
    vec4 textureColor;\n\
    if(hasTexture)\n\
    {\n\
        if(textureFlipYAxis)\n\
        {\n\
            textureColor = texture2D(diffuseTex, vec2(vTexCoord.s, 1.0 - vTexCoord.t));\n\
        }\n\
        else\n\
        {\n\
            textureColor = texture2D(diffuseTex, vec2(vTexCoord.s, vTexCoord.t));\n\
        }\n\
    }\n\
    else\n\
    {\n\
        textureColor = vcolor4;\n\
    }\n\
    \n\
    gl_FragColor.rgb = vec3((textureColor.xyz)*vLightWeighting * occlusion); \n\
    gl_FragColor.a = 1.0;   \n\
}\n\
";
ShaderSource.LodBuildingSsaoVS = "attribute vec3 position;\n\
attribute vec3 normal;\n\
attribute vec4 color4;\n\
attribute vec2 texCoord;\n\
\n\
uniform sampler2D diffuseTex;\n\
uniform mat4 projectionMatrix;  \n\
uniform mat4 modelViewMatrix;\n\
uniform mat4 modelViewMatrixRelToEye; \n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform mat4 normalMatrix4;\n\
uniform mat4 buildingRotMatrix;  \n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
uniform vec3 aditionalPosition;\n\
uniform vec4 oneColor4;\n\
uniform bool bUse1Color;\n\
uniform bool hasTexture;\n\
\n\
varying vec3 vNormal;\n\
varying vec2 vTexCoord;   \n\
varying vec3 uAmbientColor;\n\
varying vec3 vLightWeighting;\n\
varying vec4 vcolor4;\n\
\n\
void main()\n\
{	\n\
    vec4 rotatedPos = buildingRotMatrix * vec4(position.xyz + aditionalPosition.xyz, 1.0);\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos4 = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
   \n\
    vec4 rotatedNormal = buildingRotMatrix * vec4(normal.xyz, 1.0);\n\
    vLightWeighting = vec3(1.0, 1.0, 1.0);\n\
    uAmbientColor = vec3(0.8, 0.8, 0.8);\n\
    vec3 uLightingDirection = vec3(0.5, 0.5, 0.5);\n\
    vec3 directionalLightColor = vec3(0.6, 0.6, 0.6);\n\
    vNormal = (normalMatrix4 * vec4(rotatedNormal.x, rotatedNormal.y, rotatedNormal.z, 1.0)).xyz;\n\
    float directionalLightWeighting = max(dot(vNormal, uLightingDirection), 0.0);\n\
    vLightWeighting = uAmbientColor + directionalLightColor * directionalLightWeighting;\n\
\n\
    if(bUse1Color)\n\
    {\n\
        vcolor4 = oneColor4;\n\
    }\n\
    else\n\
    {\n\
        vcolor4 = color4;\n\
    }\n\
    vTexCoord = texCoord;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos4;\n\
}\n\
";
ShaderSource.ModelRefSsaoFS = "#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
\n\
uniform sampler2D depthTex;\n\
uniform sampler2D noiseTex;  \n\
uniform sampler2D diffuseTex;\n\
uniform bool hasTexture;\n\
uniform bool textureFlipYAxis;\n\
varying vec3 vNormal;\n\
uniform mat4 projectionMatrix;\n\
uniform mat4 m;\n\
uniform vec2 noiseScale;\n\
uniform float near;\n\
uniform float far;            \n\
uniform float fov;\n\
uniform float aspectRatio;    \n\
uniform float screenWidth;    \n\
uniform float screenHeight;    \n\
uniform float shininessValue;\n\
uniform vec3 kernel[16];   \n\
uniform vec4 vColor4Aux;\n\
\n\
varying vec2 vTexCoord;   \n\
varying vec3 vLightWeighting;\n\
\n\
varying vec3 ambientColor;\n\
varying vec3 diffuseColor;\n\
varying vec3 specularColor;\n\
varying vec3 vertexPos;\n\
\n\
const int kernelSize = 16;  \n\
const float radius = 0.15;      \n\
\n\
const float ambientReflectionCoef = 0.5;\n\
const float diffuseReflectionCoef = 1.0;  \n\
const float specularReflectionCoef = 1.0; \n\
\n\
float unpackDepth(const in vec4 rgba_depth)\n\
{\n\
    const vec4 bit_shift = vec4(0.000000059605, 0.000015258789, 0.00390625, 1.0);\n\
    float depth = dot(rgba_depth, bit_shift);\n\
    return depth;\n\
}                \n\
\n\
vec3 getViewRay(vec2 tc)\n\
{\n\
    float hfar = 2.0 * tan(fov/2.0) * far;\n\
    float wfar = hfar * aspectRatio;    \n\
    vec3 ray = vec3(wfar * (tc.x - 0.5), hfar * (tc.y - 0.5), -far);    \n\
    return ray;                      \n\
}         \n\
            \n\
//linear view space depth\n\
float getDepth(vec2 coord)\n\
{\n\
    return unpackDepth(texture2D(depthTex, coord.xy));\n\
}    \n\
\n\
void main()\n\
{          \n\
    vec2 screenPos = vec2(gl_FragCoord.x / screenWidth, gl_FragCoord.y / screenHeight);		                 \n\
    float linearDepth = getDepth(screenPos);          \n\
    vec3 origin = getViewRay(screenPos) * linearDepth;   \n\
\n\
    vec3 normal2 = vNormal;\n\
            \n\
    vec3 rvec = texture2D(noiseTex, screenPos.xy * noiseScale).xyz * 2.0 - 1.0;\n\
    vec3 tangent = normalize(rvec - normal2 * dot(rvec, normal2));\n\
    vec3 bitangent = cross(normal2, tangent);\n\
    mat3 tbn = mat3(tangent, bitangent, normal2);        \n\
    \n\
    float occlusion = 0.0;\n\
    for(int i = 0; i < kernelSize; ++i)\n\
    {    	 \n\
        vec3 sample = origin + (tbn * kernel[i]) * radius;\n\
        vec4 offset = projectionMatrix * vec4(sample, 1.0);		\n\
        offset.xy /= offset.w;\n\
        offset.xy = offset.xy * 0.5 + 0.5;        \n\
        float sampleDepth = -sample.z/far;\n\
        float depthBufferValue = getDepth(offset.xy);				              \n\
        float range_check = abs(linearDepth - depthBufferValue)+radius*0.998;\n\
        if (range_check < radius*1.001 && depthBufferValue <= sampleDepth)\n\
        {\n\
            occlusion +=  1.0;\n\
        }\n\
        \n\
    }   \n\
        \n\
    occlusion = 1.0 - occlusion / float(kernelSize);\n\
\n\
    vec3 lightPos = vec3(0.0, 0.0, 20.0);\n\
    vec3 L = normalize(lightPos - vertexPos);\n\
    float lambertian = max(dot(normal2, L), 0.0);\n\
    float specular = 0.0;\n\
    if(lambertian > 0.0)\n\
    {\n\
        vec3 R = reflect(-L, normal2);      // Reflected light vector\n\
        vec3 V = normalize(-vertexPos); // Vector to viewer\n\
        \n\
        // Compute the specular term\n\
        float specAngle = max(dot(R, V), 0.0);\n\
        specular = pow(specAngle, shininessValue);\n\
    }\n\
\n\
    vec4 textureColor;\n\
    if(hasTexture)\n\
    {\n\
        if(textureFlipYAxis)\n\
        {\n\
            textureColor = texture2D(diffuseTex, vec2(vTexCoord.s, 1.0 - vTexCoord.t));\n\
        }\n\
        else{\n\
            textureColor = texture2D(diffuseTex, vec2(vTexCoord.s, vTexCoord.t));\n\
        }\n\
        if(textureColor.w == 0.0)\n\
        {\n\
            discard;\n\
        }\n\
    }\n\
    else{\n\
        textureColor = vColor4Aux;\n\
    }\n\
    vec3 specularColor = vec3(0.7);\n\
    vec3 ambientColor = vec3(textureColor.x * 0.7, textureColor.y * 0.7, textureColor.z * 0.7);\n\
\n\
    gl_FragColor = vec4((ambientReflectionCoef * ambientColor + diffuseReflectionCoef * lambertian * textureColor.xyz + specularReflectionCoef * specular * specularColor)*vLightWeighting * occlusion, 1.0); \n\
}\n\
";
ShaderSource.ModelRefSsaoVS = "	attribute vec3 position;\n\
	attribute vec3 normal;\n\
	attribute vec2 texCoord;\n\
	\n\
	uniform mat4 buildingRotMatrix; \n\
	uniform mat4 projectionMatrix;  \n\
	uniform mat4 modelViewMatrix;\n\
	uniform mat4 modelViewMatrixRelToEye; \n\
	uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
	uniform mat4 RefTransfMatrix;\n\
	uniform mat4 normalMatrix4;\n\
	uniform vec3 buildingPosHIGH;\n\
	uniform vec3 buildingPosLOW;\n\
	uniform vec3 encodedCameraPositionMCHigh;\n\
	uniform vec3 encodedCameraPositionMCLow;\n\
	uniform vec3 aditionalPosition;\n\
	uniform vec3 refTranslationVec;\n\
	uniform int refMatrixType; // 0= identity, 1= translate, 2= transform\n\
\n\
	varying vec3 vNormal;\n\
	varying vec2 vTexCoord;  \n\
	varying vec3 uAmbientColor;\n\
	varying vec3 vLightWeighting;\n\
	varying vec3 vertexPos;\n\
	\n\
	void main()\n\
    {	\n\
		vec4 rotatedPos;\n\
		mat3 currentTMat;\n\
		if(refMatrixType == 0)\n\
		{\n\
			rotatedPos = buildingRotMatrix * vec4(position.xyz, 1.0) + vec4(aditionalPosition.xyz, 0.0);\n\
			currentTMat = mat3(buildingRotMatrix);\n\
		}\n\
		else if(refMatrixType == 1)\n\
		{\n\
			rotatedPos = buildingRotMatrix * vec4(position.xyz + refTranslationVec.xyz, 1.0) + vec4(aditionalPosition.xyz, 0.0);\n\
			currentTMat = mat3(buildingRotMatrix);\n\
		}\n\
		else if(refMatrixType == 2)\n\
		{\n\
			rotatedPos = RefTransfMatrix * vec4(position.xyz, 1.0) + vec4(aditionalPosition.xyz, 0.0);\n\
			currentTMat = mat3(RefTransfMatrix);\n\
		}\n\
\n\
		vec3 objPosHigh = buildingPosHIGH;\n\
		vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
		vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
		vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
		vec4 pos4 = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
\n\
		vertexPos = vec3(modelViewMatrixRelToEye * pos4);\n\
		vec3 rotatedNormal = currentTMat * normal;\n\
		vLightWeighting = vec3(1.0, 1.0, 1.0);\n\
		uAmbientColor = vec3(0.8);\n\
		vec3 uLightingDirection = vec3(0.7, 0.7, 0.7);\n\
		vec3 directionalLightColor = vec3(0.6, 0.6, 0.6);\n\
		vNormal = (normalMatrix4 * vec4(rotatedNormal.x, rotatedNormal.y, rotatedNormal.z, 1.0)).xyz;\n\
		vTexCoord = texCoord;\n\
		float directionalLightWeighting = max(dot(vNormal, uLightingDirection), 0.0);\n\
		vLightWeighting = uAmbientColor + directionalLightColor * directionalLightWeighting;\n\
\n\
        gl_Position = ModelViewProjectionMatrixRelToEye * pos4;\n\
	}\n\
";
ShaderSource.PngImageFS = "precision mediump float;\n\
varying vec2 v_texcoord;\n\
uniform bool textureFlipYAxis;\n\
uniform sampler2D u_texture;\n\
\n\
void main()\n\
{\n\
    vec4 textureColor;\n\
    if(textureFlipYAxis)\n\
    {\n\
        textureColor = texture2D(u_texture, vec2(v_texcoord.s, 1.0 - v_texcoord.t));\n\
    }\n\
    else\n\
    {\n\
        textureColor = texture2D(u_texture, v_texcoord);\n\
    }\n\
    if(textureColor.w < 0.1)\n\
    {\n\
        discard;\n\
    }\n\
\n\
    gl_FragColor = textureColor;\n\
}";
ShaderSource.PngImageVS = "attribute vec3 a_position;\n\
attribute vec2 a_texcoord;\n\
uniform mat4 buildingRotMatrix;  \n\
uniform mat4 ModelViewProjectionMatrixRelToEye;  \n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
varying vec2 v_texcoord;\n\
\n\
void main()\n\
{\n\
    vec4 position2 = vec4(a_position.xyz, 1.0);\n\
    vec4 rotatedPos = buildingRotMatrix * vec4(position2.xyz, 1.0);\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos4 = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
\n\
    v_texcoord = a_texcoord;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos4;\n\
}\n\
";
ShaderSource.PointCloudFS = "	precision lowp float;\n\
	varying vec4 vColor;\n\
\n\
	void main()\n\
    {\n\
		gl_FragColor = vColor;\n\
	}";
ShaderSource.PointCloudVS = "attribute vec3 position;\n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
attribute vec4 color;\n\
varying vec4 vColor;\n\
\n\
void main()\n\
{\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + position.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
\n\
    vColor=color;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos;\n\
}";
ShaderSource.RenderShowDepthFS = "#ifdef GL_ES\n\
precision highp float;\n\
#endif\n\
uniform float near;\n\
uniform float far;\n\
\n\
varying float depth;  \n\
\n\
vec4 packDepth(const in float depth)\n\
{\n\
    const vec4 bit_shift = vec4(16777216.0, 65536.0, 256.0, 1.0);\n\
    const vec4 bit_mask  = vec4(0.0, 0.00390625, 0.00390625, 0.00390625); \n\
    vec4 res = fract(depth * bit_shift);\n\
    res -= res.xxyz * bit_mask;\n\
    return res;  \n\
}\n\
\n\
void main()\n\
{     \n\
    gl_FragData[0] = packDepth(-depth);\n\
}\n\
";
ShaderSource.RenderShowDepthVS = "attribute vec3 position;\n\
\n\
uniform mat4 buildingRotMatrix; \n\
uniform mat4 modelViewMatrixRelToEye; \n\
uniform mat4 RefTransfMatrix;\n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
uniform float near;\n\
uniform float far;\n\
uniform vec3 aditionalPosition;\n\
uniform vec3 refTranslationVec;\n\
uniform int refMatrixType; // 0= identity, 1= translate, 2= transform\n\
\n\
varying float depth;\n\
  \n\
void main()\n\
{	\n\
	vec4 rotatedPos;\n\
\n\
	if(refMatrixType == 0)\n\
	{\n\
		rotatedPos = buildingRotMatrix * vec4(position.xyz, 1.0) + vec4(aditionalPosition.xyz, 0.0);\n\
	}\n\
	else if(refMatrixType == 1)\n\
	{\n\
		rotatedPos = buildingRotMatrix * vec4(position.xyz + refTranslationVec.xyz, 1.0) + vec4(aditionalPosition.xyz, 0.0);\n\
	}\n\
	else if(refMatrixType == 2)\n\
	{\n\
		rotatedPos = RefTransfMatrix * vec4(position.xyz, 1.0) + vec4(aditionalPosition.xyz, 0.0);\n\
	}\n\
\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos4 = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
    \n\
    //linear depth in camera space (0..far)\n\
    depth = (modelViewMatrixRelToEye * pos4).z/far;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos4;\n\
}\n\
";
ShaderSource.ShowDepthFS = "#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
uniform float near;\n\
uniform float far;\n\
\n\
varying float depth;  \n\
varying vec3 vN; \n\
varying vec4 vVSPos;\n\
\n\
// from http://spidergl.org/example.php?id=6\n\
vec4 packDepth(const in float depth)\n\
{\n\
    const vec4 bit_shift = vec4(16777216.0, 65536.0, 256.0, 1.0);\n\
    const vec4 bit_mask  = vec4(0.0, 0.00390625, 0.00390625, 0.00390625); \n\
    vec4 res = fract(depth * bit_shift);\n\
    res -= res.xxyz * bit_mask;\n\
\n\
    return res;  \n\
}\n\
\n\
void main()\n\
{\n\
    gl_FragData[0] = packDepth(-depth);\n\
    gl_FragData[0].r = -depth/far;\n\
}\n\
";
ShaderSource.ShowDepthVS = "attribute vec3 position;\n\
attribute vec3 normal;\n\
\n\
uniform mat4 modelViewMatrixRelToEye; \n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform mat4 normalMatrix3;\n\
uniform mat4 normalMatrix4;\n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
uniform float near;\n\
uniform float far;\n\
\n\
varying vec3 vN;\n\
varying float depth;  \n\
varying vec4 vVSPos;\n\
\n\
void main()\n\
{	\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + position.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos4 = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
\n\
    vN = normalize((normalMatrix4 * vec4(normal, 1.0)).xyz);\n\
    \n\
    //linear depth in camera space (0..far)\n\
    depth = (modelViewMatrixRelToEye * pos4).z/far;\n\
    vVSPos = modelViewMatrixRelToEye * pos4;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos4;\n\
}\n\
";
ShaderSource.SilhouetteFS = "precision highp float;\n\
uniform vec4 vColor4Aux;\n\
\n\
void main()\n\
{          \n\
    gl_FragColor = vColor4Aux;\n\
}";
ShaderSource.SilhouetteVS = "attribute vec3 position;\n\
\n\
uniform mat4 buildingRotMatrix; \n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform mat4 ModelViewMatrixRelToEye;\n\
uniform mat4 ProjectionMatrix;\n\
uniform mat4 RefTransfMatrix;\n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
uniform vec3 aditionalPosition;\n\
uniform vec3 refTranslationVec;\n\
uniform int refMatrixType; // 0= identity, 1= translate, 2= transform\n\
uniform vec2 camSpacePixelTranslation;\n\
uniform vec2 screenSize;    \n\
varying vec2 camSpaceTranslation;\n\
\n\
void main()\n\
{    \n\
    vec4 rotatedPos;\n\
	if(refMatrixType == 0)\n\
	{\n\
		rotatedPos = buildingRotMatrix * vec4(position.xyz, 1.0) + vec4(aditionalPosition.xyz, 0.0);\n\
	}\n\
	else if(refMatrixType == 1)\n\
	{\n\
		rotatedPos = buildingRotMatrix * vec4(position.xyz + refTranslationVec.xyz, 1.0) + vec4(aditionalPosition.xyz, 0.0);\n\
	}\n\
	else if(refMatrixType == 2)\n\
	{\n\
		rotatedPos = RefTransfMatrix * vec4(position.xyz, 1.0) + vec4(aditionalPosition.xyz, 0.0);\n\
	}\n\
\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos4 = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
    vec4 camSpacePos = ModelViewMatrixRelToEye * pos4;\n\
    vec4 translationVec = ProjectionMatrix * vec4(camSpacePixelTranslation.x*(-camSpacePos.z), camSpacePixelTranslation.y*(-camSpacePos.z), 0.0, 1.0);\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos4;\n\
    gl_Position += translationVec;  \n\
}";
ShaderSource.SimpleDepthSsaoFS = "precision highp float;\n\
const vec4 bitEnc = vec4(1.0,255.0,65025.0,16581375.0);\n\
const vec4 bitDec = 1.0/bitEnc;\n\
varying float zDepth;\n\
\n\
vec4 EncodeFloatRGBA (float v)\n\
{\n\
    vec4 enc = bitEnc * v;\n\
    enc = fract(enc);\n\
    enc -= enc.yzww * vec2(1.0/255.0, 0.0).xxxy;\n\
    return enc;\n\
}\n\
\n\
void main()\n\
{          \n\
    vec4 encodedZ = EncodeFloatRGBA(zDepth);\n\
    gl_FragData[0] = encodedZ;\n\
}\n\
";
ShaderSource.SimpleDepthSsaoVS = "attribute vec3 position;\n\
\n\
uniform mat4 modelViewMatrixRelToEye; \n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform mat4 RefTransfMatrix;\n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
varying float zDepth;\n\
uniform float far;\n\
\n\
void main()\n\
{	\n\
    vec4 rotatedPos = RefTransfMatrix * vec4(position.xyz, 1.0);\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos4 = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
    \n\
    zDepth = (modelViewMatrixRelToEye * pos4).z/far;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos4;\n\
}\n\
";
ShaderSource.SsaoFS = "#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
uniform sampler2D depthTex;\n\
uniform sampler2D noiseTex;  \n\
uniform sampler2D diffuseTex;\n\
varying vec3 vNormal;\n\
uniform mat4 projectionMatrix;\n\
uniform mat4 m;\n\
uniform vec2 noiseScale;\n\
uniform float near;\n\
uniform float far;            \n\
uniform float fov;\n\
uniform float aspectRatio;    \n\
uniform float screenWidth;    \n\
uniform float screenHeight;    \n\
uniform vec3 kernel[16];   \n\
\n\
varying vec2 vTexCoord;   \n\
\n\
const int kernelSize = 16;  \n\
const float radius = 1.0;      \n\
\n\
float unpackDepth(const in vec4 rgba_depth)\n\
{\n\
    const vec4 bit_shift = vec4(0.000000059605, 0.000015258789, 0.00390625, 1.0);\n\
    float depth = dot(rgba_depth, bit_shift);\n\
    return depth;\n\
}                \n\
\n\
vec3 getViewRay(vec2 tc)\n\
{\n\
    float hfar = 2.0 * tan(fov/2.0) * far;\n\
    float wfar = hfar * aspectRatio;    \n\
    vec3 ray = vec3(wfar * (tc.x - 0.5), hfar * (tc.y - 0.5), -far);    \n\
    return ray;                      \n\
}         \n\
            \n\
//linear view space depth\n\
float getDepth(vec2 coord)\n\
{                          \n\
    return unpackDepth(texture2D(depthTex, coord.xy));\n\
}    \n\
\n\
void main()\n\
{          \n\
    vec2 screenPos = vec2(gl_FragCoord.x / screenWidth, gl_FragCoord.y / screenHeight);		                 \n\
    float linearDepth = getDepth(screenPos);          \n\
    vec3 origin = getViewRay(screenPos) * linearDepth;   \n\
 \n\
    vec3 normal2 = vNormal;   \n\
            \n\
    vec3 rvec = texture2D(noiseTex, screenPos.xy * noiseScale).xyz * 2.0 - 1.0;\n\
    vec3 tangent = normalize(rvec - normal2 * dot(rvec, normal2));\n\
    vec3 bitangent = cross(normal2, tangent);\n\
    mat3 tbn = mat3(tangent, bitangent, normal2);        \n\
    \n\
    float occlusion = 0.0;\n\
    for(int i = 0; i < kernelSize; ++i)\n\
    {    	 \n\
        vec3 sample = origin + (tbn * kernel[i]) * radius;\n\
        vec4 offset = projectionMatrix * vec4(sample, 1.0);		\n\
        offset.xy /= offset.w;\n\
        offset.xy = offset.xy * 0.5 + 0.5;        \n\
        float sampleDepth = -sample.z/far;\n\
        float depthBufferValue = getDepth(offset.xy);				              \n\
\n\
        float range_check = abs(linearDepth - depthBufferValue)+radius*0.998;\n\
        if (range_check < radius && depthBufferValue <= sampleDepth)\n\
        {\n\
            occlusion +=  1.0;\n\
        }\n\
        \n\
    }   \n\
        \n\
    occlusion = 1.0 - (occlusion) / float(kernelSize);\n\
                                \n\
    vec3 lightPos = vec3(10.0, 10.0, 10.0);\n\
    vec3 L = normalize(lightPos);\n\
    float NdotL = abs(dot(normal2, L));\n\
    vec3 diffuse = vec3(NdotL);\n\
    vec3 ambient = vec3(1.0);\n\
    vec4 textureColor = texture2D(diffuseTex, vec2(vTexCoord.s, vTexCoord.t));\n\
\n\
    gl_FragColor.rgb = vec3((textureColor.xyz*0.2 + textureColor.xyz*0.8) * occlusion); // with texture.***\n\
    gl_FragColor.a = 1.0;   \n\
}\n\
";
ShaderSource.SsaoVS = "attribute vec3 position;\n\
attribute vec3 normal;\n\
attribute vec2 texCoord;\n\
\n\
uniform mat4 projectionMatrix;  \n\
uniform mat4 modelViewMatrix;\n\
uniform mat4 modelViewMatrixRelToEye; \n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform mat4 normalMatrix4;\n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
\n\
varying vec3 vNormal;\n\
varying vec2 vTexCoord;  \n\
\n\
void main()\n\
{	\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + position.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos4 = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
\n\
    vNormal = (normalMatrix4 * vec4(-normal.x, -normal.y, -normal.z, 1.0)).xyz;\n\
    vTexCoord = texCoord;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos4;\n\
}";
ShaderSource.StandardFS = "precision lowp float;\n\
varying vec3 vColor;\n\
\n\
void main()\n\
{\n\
    gl_FragColor = vec4(vColor, 1.);\n\
}";
ShaderSource.StandardVS = "attribute vec3 position;\n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
uniform mat4 RefTransfMatrix;\n\
attribute vec3 color;\n\
varying vec3 vColor;\n\
\n\
void main()\n\
{\n\
    vec4 rotatedPos = RefTransfMatrix * vec4(position.xyz, 1.0);\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
 \n\
    vColor=color;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos;\n\
}";
ShaderSource.TextureA1FS = "precision mediump float;\n\
varying vec4 vColor;\n\
varying vec2 vTextureCoord;\n\
uniform sampler2D uSampler;\n\
\n\
void main()\n\
{\n\
    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n\
}\n\
";
ShaderSource.TextureA1VS = "attribute vec3 position;\n\
attribute vec4 aVertexColor;\n\
attribute vec2 aTextureCoord;\n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
varying vec4 vColor;\n\
varying vec2 vTextureCoord;\n\
\n\
void main()\n\
{\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + position.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
 \n\
    vColor=aVertexColor;\n\
    vTextureCoord = aTextureCoord;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos;\n\
}";
ShaderSource.TextureFS = "precision mediump float;\n\
varying vec4 vColor;\n\
varying vec2 vTextureCoord;\n\
uniform sampler2D uSampler;\n\
\n\
void main()\n\
{\n\
    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n\
}";
ShaderSource.TextureNormalFS = "	precision mediump float;\n\
	varying vec4 vColor;\n\
	varying vec2 vTextureCoord;\n\
	uniform sampler2D uSampler;\n\
	varying vec3 vLightWeighting;\n\
\n\
	void main()\n\
    {\n\
		vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n\
        \n\
		gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);\n\
	}\n\
";
ShaderSource.TextureNormalVS = "attribute vec3 position;\n\
attribute vec4 aVertexColor;\n\
attribute vec2 aTextureCoord;\n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
varying vec4 vColor;\n\
varying vec2 vTextureCoord;\n\
attribute vec3 aVertexNormal;\n\
varying vec3 uAmbientColor;\n\
varying vec3 vLightWeighting;\n\
uniform mat3 uNMatrix;\n\
\n\
void main()\n\
{\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + position.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
    \n\
    vColor = aVertexColor;\n\
    vTextureCoord = aTextureCoord;\n\
    \n\
    vLightWeighting = vec3(1.0, 1.0, 1.0);\n\
    uAmbientColor = vec3(0.7, 0.7, 0.7);\n\
    vec3 uLightingDirection = vec3(0.8, 0.2, -0.9);\n\
    vec3 directionalLightColor = vec3(0.4, 0.4, 0.4);\n\
    vec3 transformedNormal = uNMatrix * aVertexNormal;\n\
    float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);\n\
    vLightWeighting = uAmbientColor + directionalLightColor * directionalLightWeighting;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos;\n\
}\n\
";
ShaderSource.TextureVS = "attribute vec3 position;\n\
attribute vec4 aVertexColor;\n\
attribute vec2 aTextureCoord;\n\
uniform mat4 Mmatrix;\n\
uniform mat4 ModelViewProjectionMatrixRelToEye;\n\
uniform vec3 buildingPosHIGH;\n\
uniform vec3 buildingPosLOW;\n\
uniform vec3 encodedCameraPositionMCHigh;\n\
uniform vec3 encodedCameraPositionMCLow;\n\
varying vec4 vColor;\n\
varying vec2 vTextureCoord;\n\
\n\
void main()\n\
{\n\
    vec4 rotatedPos = Mmatrix * vec4(position.xyz, 1.0);\n\
    vec3 objPosHigh = buildingPosHIGH;\n\
    vec3 objPosLow = buildingPosLOW.xyz + rotatedPos.xyz;\n\
    vec3 highDifference = objPosHigh.xyz - encodedCameraPositionMCHigh.xyz;\n\
    vec3 lowDifference = objPosLow.xyz - encodedCameraPositionMCLow.xyz;\n\
    vec4 pos = vec4(highDifference.xyz + lowDifference.xyz, 1.0);\n\
\n\
    vColor=aVertexColor;\n\
    vTextureCoord = aTextureCoord;\n\
\n\
    gl_Position = ModelViewProjectionMatrixRelToEye * pos;\n\
    \n\
}";

'use strict';

/**
 * Returns the first parameter if not undefined, otherwise the second parameter.
 * Useful for setting a default value for a parameter.
 *
 * @exports defaultValue
 *
 * @param {*} a
 * @param {*} b
 * @returns {*} Returns the first parameter if not undefined, otherwise the second parameter.
 *
 * @example
 * param = defaultValue(param, 'default');
 * 
 * @copyright https://github.com/AnalyticalGraphicsInc/cesium
 */
function defaultValue(a, b) 
{
	if (a !== undefined) 
	{
		return a;
	}
	return b;
}
'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class ByteColor
 */
var ByteColor = function() 
{
	if (!(this instanceof ByteColor)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.ByteR = 0;
	this.ByteG = 0;
	this.ByteB = 0;
	this.ByteAlfa = 255;
};

/**
 * 어떤 일을 하고 있습니까?
 */
ByteColor.prototype.destroy = function() 
{
	this.ByteR = null;
	this.ByteG = null;
	this.ByteB = null;
	this.ByteAlfa = null;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param byteRed 변수
 * @param byteGreen 변수
 * @param byteBlue 변수
 */
ByteColor.prototype.set = function(byteRed, byteGreen, byteBlue) 
{
	this.ByteR = byteRed;
	this.ByteG = byteGreen;
	this.ByteB = byteBlue;
};

/**
* 어떤 일을 하고 있습니까?
* @class Point2D
*/
var Point2D = function() 
{
	if (!(this instanceof Point2D)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.x = 0.0;
	this.y = 0.0;
	this.IdxInIist; // delete this.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @class Point3DAux
 */
var Point3DAux = function() 
{
	if (!(this instanceof Point3DAux)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.x = 0.0;
	this.y = 0.0;
	this.z = 0.0;
	//this.IdxInIist;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class TTriangle
 */
var TTriangle = function() 
{
	if (!(this instanceof TTriangle)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.mVertex1;
	this.mVertex2;
	this.mVertex3;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param vtx1 변수
 * @param vtx2 변수
 * @param vtx3 변수
 */
TTriangle.prototype.setVertices = function(vtx1, vtx2, vtx3) 
{
	this.mVertex1 = vtx1;
	this.mVertex2 = vtx2;
	this.mVertex3 = vtx3;
};

/**
 * 어떤 일을 하고 있습니까?
 */
TTriangle.prototype.invert = function() 
{
	var vertexAux = this.mVertex2;
	this.mVertex2 = this.mVertex3;
	this.mVertex3 = vertexAux;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class TTrianglesList
 */
var TTrianglesList = function() 
{
	if (!(this instanceof TTrianglesList)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.tTrianglesArray = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns tTri
 */
TTrianglesList.prototype.newTTriangle = function() 
{
	var tTri = new TTriangle();
	this.tTrianglesArray.push(tTri);
	return tTri;
};

/**
 * 어떤 일을 하고 있습니까?
 */
TTrianglesList.prototype.invertTrianglesSense= function() 
{
	for (var i = 0, triCount = this.tTrianglesArray.length; i < triCount; i++) 
	{
		this.tTrianglesArray[i].invert();
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param idx 변수
 * @returns tTrianglesArray[idx]
 */
TTrianglesList.prototype.getTTriangle = function(idx) 
{
	if (idx >= 0 && idx < this.tTrianglesArray.length) 
	{
		return this.tTrianglesArray[idx];
	}
	else
	{
		return undefined;
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @class TTrianglesMatrix
 */
var TTrianglesMatrix = function() 
{
	if (!(this instanceof TTrianglesMatrix)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.tTrianglesListsArray = [];
	// SCRATX.*********************
	this.totalTTrianglesArraySC = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns tTrianglesList
 */
TTrianglesMatrix.prototype.newTTrianglesList = function() 
{
	var tTrianglesList = new TTrianglesList();
	this.tTrianglesListsArray.push(tTrianglesList);
	return tTrianglesList;
};

/**
 * 어떤 일을 하고 있습니까?
 */
TTrianglesMatrix.prototype.invertTrianglesSense = function() 
{
	for (var i = 0, tTriListsCount = this.tTrianglesListsArray.length; i < tTriListsCount; i++) 
	{
		this.tTrianglesListsArray[i].invertTrianglesSense();
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param resultTotalTTrianglesArray 변수
 * @returns resultTotalTTrianglesArray
 */
TTrianglesMatrix.prototype.getTotalTTrianglesArray = function(resultTotalTTrianglesArray) 
{
	for (var i = 0, tTriListsCount = this.tTrianglesListsArray.length; i < tTriListsCount; i++) 
	{
		for (var j = 0, tTrianglesCount = this.tTrianglesListsArray[i].tTrianglesArray.length; j < tTrianglesCount; j++) 
		{
			var tTriangle = this.tTrianglesListsArray[i].getTTriangle(j);
			resultTotalTTrianglesArray.push(tTriangle);
		}
	}

	return resultTotalTTrianglesArray;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns shortArray
 */
TTrianglesMatrix.prototype.getVBOIndicesShortArray = function() 
{
	this.totalTTrianglesArraySC.length = 0;
	this.totalTTrianglesArraySC = this.getTotalTTrianglesArray(this.totalTTrianglesArraySC);

	var tTriangle;
	var tTrianglesCount = this.totalTTrianglesArraySC.length;
	var shortArray = new Uint16Array(tTrianglesCount * 3);
	for (var i = 0; i < tTrianglesCount; i++) 
	{
		tTriangle = this.totalTTrianglesArraySC[i];
		shortArray[i*3] = tTriangle.mVertex1.mIdxInList;
		shortArray[i*3+1] = tTriangle.mVertex2.mIdxInList;
		shortArray[i*3+2] = tTriangle.mVertex3.mIdxInList;
	}

	return shortArray;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class VertexMatrix
 */
var VertexMatrix = function() 
{
	if (!(this instanceof VertexMatrix)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.vertexListsArray = [];
	// SCTRATXH.******************
	this.totalVertexArraySC = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vertexList
 */
VertexMatrix.prototype.newVertexList = function() 
{
	var vertexList = new VertexList();
	this.vertexListsArray.push(vertexList);
	return vertexList;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param idx 변수
 * @returns vertexListArray[idx]
 */
VertexMatrix.prototype.getVertexList = function(idx) 
{
	if (idx >= 0 && idx < this.vertexListsArray.length) 
	{
		return this.vertexListsArray[idx];
	}
	else 
	{
		return undefined;
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param resultBox
 * @returns resultBox
 */
VertexMatrix.prototype.getBoundingBox = function(resultBox) 
{
	if (resultBox === undefined) { resultBox = new BoundingBox(); }

	this.totalVertexArraySC.length = 0;
	this.totalVertexArraySC = this.getTotalVertexArray(this.totalVertexArraySC);
	for (var i = 0, totalVertexCount = this.totalVertexArraySC.length; i < totalVertexCount; i++) 
	{
		if (i === 0) { resultBox.init(this.totalVertexArraySC[i].point3d); }
		else { resultBox.addPoint(this.totalVertexArraySC[i].point3d); }
	}
	return resultBox;
};

/**
 * 어떤 일을 하고 있습니까?
 */
VertexMatrix.prototype.setVertexIdxInList = function() 
{
	var idxInIist = 0;
	for (var i = 0, vertexListsCount = this.vertexListsArray.length; i < vertexListsCount; i++) 
	{
		var vtxList = this.vertexListsArray[i];
		for (var j = 0, vertexCount = vtxList.vertexArray.length; j < vertexCount; j++) 
		{
			var vertex = vtxList.getVertex(j);
			vertex.mIdxInList = idxInIist;
			idxInIist++;
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vertexCount
 */
VertexMatrix.prototype.getVertexCount = function() 
{
	var vertexCount = 0;
	for (var i = 0, vertexListsCount = this.vertexListsArray.length; i < vertexListsCount; i++) 
	{
		vertexCount += this.vertexListsArray[i].getVertexCount();
	}

	return vertexCount;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param resultTotalVertexArray 변수
 * @returns resultTotalVertexArray
 */
VertexMatrix.prototype.getTotalVertexArray = function(resultTotalVertexArray) 
{
	for (var i = 0, vertexListsCount = this.vertexListsArray.length; i < vertexListsCount; i++) 
	{
		var vtxList = this.vertexListsArray[i];
		for (var j = 0, vertexCount = vtxList.vertexArray.length; j < vertexCount; j++) 
		{
			var vertex = vtxList.getVertex(j);
			resultTotalVertexArray.push(vertex);
		}
	}

	return resultTotalVertexArray;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param resultFloatArray 변수
 * @returns resultFloatArray
 */
VertexMatrix.prototype.getVBOVertexColorFloatArray = function(resultFloatArray) 
{
	this.totalVertexArraySC.length = 0;
	this.totalVertexArraySC = this.getTotalVertexArray(this.totalVertexArraySC);

	var totalVertexCount = this.totalVertexArraySC.length;
	if (resultFloatArray === undefined) { resultFloatArray = new Float32Array(totalVertexCount*6); }

	for (var i = 0; i < totalVertexCount; i++) 
	{
		var vertex = this.totalVertexArraySC[i];
		resultFloatArray[i*6] = vertex.point3d.x;
		resultFloatArray[i*6+1] = vertex.point3d.y;
		resultFloatArray[i*6+2] = vertex.point3d.z;

		resultFloatArray[i*6+3] = vertex.color4.r;
		resultFloatArray[i*6+4] = vertex.color4.g;
		resultFloatArray[i*6+5] = vertex.color4.b;
	}

	return resultFloatArray;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param resultFloatArray 변수
 * @returns resultFloatArray
 */
VertexMatrix.prototype.getVBOVertexColorRGBAFloatArray = function(resultFloatArray) 
{
	this.totalVertexArraySC.length = 0;
	this.totalVertexArraySC = this.getTotalVertexArray(this.totalVertexArraySC);

	var totalVertexCount = this.totalVertexArraySC.length;
	if (resultFloatArray === undefined) { resultFloatArray = new Float32Array(totalVertexCount * 7); }

	for (var i = 0; i < totalVertexCount; i++) 
	{
		var vertex = this.totalVertexArraySC[i];
		resultFloatArray[i*7] = vertex.point3d.x;
		resultFloatArray[i*7+1] = vertex.point3d.y;
		resultFloatArray[i*7+2] = vertex.point3d.z;

		resultFloatArray[i*7+3] = vertex.color4.r;
		resultFloatArray[i*7+4] = vertex.color4.g;
		resultFloatArray[i*7+5] = vertex.color4.b;
		resultFloatArray[i*7+6] = vertex.color4.a;
	}

	return resultFloatArray;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param resultFloatArray 변수
 * @returns resultFloatArray
 */
VertexMatrix.prototype.getVBOVertexFloatArray = function(resultFloatArray) 
{
	this.totalVertexArraySC.length = 0;
	this.totalVertexArraySC = this.getTotalVertexArray(this.totalVertexArraySC);

	var totalVertexCount = this.totalVertexArraySC.length;
	if (resultFloatArray === undefined) { resultFloatArray = new Float32Array(totalVertexCount * 3); }

	for (var i = 0; i < totalVertexCount; i++) 
	{
		var vertex = this.totalVertexArraySC[i];
		resultFloatArray[i*3] = vertex.point3d.x;
		resultFloatArray[i*3+1] = vertex.point3d.y;
		resultFloatArray[i*3+2] = vertex.point3d.z;
	}

	return resultFloatArray;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param dirX 변수
 * @param dirY 변수
 * @param dirZ 변수
 * @param distance 변수
 */
VertexMatrix.prototype.translateVertices = function(dirX, dirY, dirZ, distance) 
{
	for (var i = 0, vertexListsCount = this.vertexListsArray.length; i < vertexListsCount; i++) 
	{
		this.vertexListsArray[i].translateVertices(dirX, dirY, dirZ, distance);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param tTrianglesMatrix 변수
 */
VertexMatrix.prototype.makeTTrianglesLateralSidesLOOP = function(tTrianglesMatrix) 
{
	// condition: all the vertex lists must have the same number of vertex.***
	var vtxList1;
	var vtxList2;
	var tTrianglesList;
	var tTriangle1;
	var tTriangle2;
	var vertexCount = 0;
	for (var i = 0, vertexListsCount = this.vertexListsArray.length; i < vertexListsCount - 1; i++) 
	{
		vtxList1 = this.vertexListsArray[i];
		vtxList2 = this.vertexListsArray[i+1];
		tTrianglesList = tTrianglesMatrix.newTTrianglesList();

		vertexCount = vtxList1.vertexArray.length;
		for (var j = 0; j < vertexCount; j++) 
		{
			tTriangle1 = tTrianglesList.newTTriangle();
			tTriangle2 = tTrianglesList.newTTriangle();

			if (j === vertexCount -1) 
			{
				tTriangle1.setVertices(vtxList1.getVertex(j), vtxList2.getVertex(j), vtxList2.getVertex(0));
				tTriangle2.setVertices(vtxList1.getVertex(j), vtxList2.getVertex(0), vtxList1.getVertex(0));
			}
			else 
			{
				tTriangle1.setVertices(vtxList1.getVertex(j), vtxList2.getVertex(j), vtxList2.getVertex(j+1));
				tTriangle2.setVertices(vtxList1.getVertex(j), vtxList2.getVertex(j+1), vtxList1.getVertex(j+1));
			}
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param transformMatrix
 */
VertexMatrix.prototype.transformPointsByMatrix4 = function(transformMatrix) 
{
	for (var i = 0, vertexListsCount = this.vertexListsArray.length; i < vertexListsCount; i++) 
	{
		var vtxList = this.vertexListsArray[i];
		vtxList.transformPointsByMatrix4(transformMatrix);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @class Polygon
 */
var Polygon = function() 
{
	if (!(this instanceof Polygon)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.mPoint3DArray = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @param point3d 변수
 */
Polygon.prototype.addPoint3D = function(point3d) 
{
	this.mPoint3DArray.push(point3d);
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns point3d
 */
Polygon.prototype.newPoint3D = function() 
{
	var point3d = new Point3D();
	this.mPoint3DArray.push(point3d);
	return point3d;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class TrianglesSurface
 */
var TrianglesSurface= function() 
{
	if (!(this instanceof TrianglesSurface)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.mPoint3DArray = [];
	this.mTrianglesArray = [];
};

/**
 * 어떤 일을 하고 있습니까?
 */
TrianglesSurface.prototype.destroy = function() 
{
	// 1rst, destroy ftriangles.**********************************
	for (var i = 0, ftrianglesCount = this.mTrianglesArray.length; i < ftrianglesCount; i++) 
	{
		var ftriangle = this.mTrianglesArray[i];
		if (ftriangle!==null){ ftriangle.destroy(); }
		ftriangle = null;
	}
	this.mTrianglesArray = null;

	// 2nd, destroy points3d.*************************************
	for (var i = 0, pointsCount = this.mPoint3DArray.length; i < pointsCount; i++) 
	{
		var point = this.mPoint3DArray[i];
		if (point!==null) { point.destroy(); }
		point = null;
	}
	this.mPoint3DArray = null;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param generalVBOArraysContainer 변수
 */
TrianglesSurface.prototype.getVertexColorsIndicesArrays = function(generalVBOArraysContainer) 
{
	var currentMeshArrays = null;
	var meshArraysCount = generalVBOArraysContainer.meshArrays.length;
	if (meshArraysCount === 0) 
	{
		currentMeshArrays = generalVBOArraysContainer.newVertexColorIdxArray();
	}
	else 
	{
		currentMeshArrays = generalVBOArraysContainer.meshArrays[meshArraysCount - 1]; // take the last.***
	}

	// max unsigned short =  65,535
	var maxIndices = 65000;

	for (var i = 0, ftrianglesCount = this.mTrianglesArray.length; i < ftrianglesCount; i++) 
	{
		if (currentMeshArrays.meshVertices.length/3 >= maxIndices) 
		{
			currentMeshArrays = generalVBOArraysContainer.newVertexColorIdxArray();
		}

		var ftriangle = this.mTrianglesArray[i];
		var idxP1 = ftriangle.mPoint1Idx;
		var idxP2 = ftriangle.mPoint2Idx;
		var idxP3 = ftriangle.mPoint3Idx;

		var colorP1 = ftriangle.mColor1;
		var colorP2 = ftriangle.mColor2;
		var colorP3 = ftriangle.mColor3;

		var p1 = this.mPoint3DArray[idxP1];
		var p2 = this.mPoint3DArray[idxP2];
		var p3 = this.mPoint3DArray[idxP3];

		// Point 1.***
		currentMeshArrays.meshVertices.push(p1.x);
		currentMeshArrays.meshVertices.push(p1.y);
		currentMeshArrays.meshVertices.push(p1.z);
		currentMeshArrays.mesh_tri_indices.push(currentMeshArrays.meshVertices.length/3 - 1);
		currentMeshArrays.mesh_colors.push(colorP1.r);
		currentMeshArrays.mesh_colors.push(colorP1.g);
		currentMeshArrays.mesh_colors.push(colorP1.b);

		// Point 2.***
		currentMeshArrays.meshVertices.push(p2.x);
		currentMeshArrays.meshVertices.push(p2.y);
		currentMeshArrays.meshVertices.push(p2.z);
		currentMeshArrays.mesh_tri_indices.push(currentMeshArrays.meshVertices.length/3 - 1);
		currentMeshArrays.mesh_colors.push(colorP2.r);
		currentMeshArrays.mesh_colors.push(colorP2.g);
		currentMeshArrays.mesh_colors.push(colorP2.b);

		// Point 3.***
		currentMeshArrays.meshVertices.push(p3.x);
		currentMeshArrays.meshVertices.push(p3.y);
		currentMeshArrays.meshVertices.push(p3.z);
		currentMeshArrays.mesh_tri_indices.push(currentMeshArrays.meshVertices.length/3 - 1);
		currentMeshArrays.mesh_colors.push(colorP3.r);
		currentMeshArrays.mesh_colors.push(colorP3.g);
		currentMeshArrays.mesh_colors.push(colorP3.b);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param generalVertexIdxVBOArraysContainer = 변수
 */
TrianglesSurface.prototype.getVertexIndicesArrays = function(generalVertexIdxVBOArraysContainer) 
{
	var currentMeshArrays = null;
	var meshArraysCount = generalVertexIdxVBOArraysContainer._meshArrays.length;
	if (meshArraysCount === 0) 
	{
		currentMeshArrays = generalVertexIdxVBOArraysContainer.newVertexIdxArray();
	}
	else 
	{
		currentMeshArrays = generalVertexIdxVBOArraysContainer._meshArrays[meshArraysCount - 1]; // take the last.***
	}

	// max unsigned short =  65,535
	var maxIndices = 65000;

	var ftrianglesCount = this.mTrianglesArray.length;
	var currVtxCount = currentMeshArrays.meshVertices.length/3;
	for (var i = 0, vtxCount = this.mPoint3DArray.length; i < vtxCount; i++) 
	{
		var point = this.mPoint3DArray[i];
		currentMeshArrays.meshVertices.push(point.x);
		currentMeshArrays.meshVertices.push(point.y);
		currentMeshArrays.meshVertices.push(point.z);
	}

	for (var i = 0; i < ftrianglesCount; i++) 
	{
		if (currentMeshArrays.meshVertices.length/3 >= maxIndices) 
		{
			currentMeshArrays = generalVertexIdxVBOArraysContainer.newVertexIdxArray();
			currVtxCount = 0;
		}

		var ftriangle = this.mTrianglesArray[i];
		var idxP1 = ftriangle.mPoint1Idx;
		var idxP2 = ftriangle.mPoint2Idx;
		var idxP3 = ftriangle.mPoint3Idx;

		currentMeshArrays.mesh_tri_indices.push(idxP1 + currVtxCount);
		currentMeshArrays.mesh_tri_indices.push(idxP2 + currVtxCount);
		currentMeshArrays.mesh_tri_indices.push(idxP3 + currVtxCount);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param generalVertexIdxVBOArraysContainer 변수
 */
TrianglesSurface.prototype.getVertexIndicesArraysOriginal = function(generalVertexIdxVBOArraysContainer) 
{
	var currentMeshArrays = null;
	var meshArraysCount = generalVertexIdxVBOArraysContainer._meshArrays.length;
	if (meshArraysCount === 0) 
	{
		currentMeshArrays = generalVertexIdxVBOArraysContainer.newVertexIdxArray();
	}
	else 
	{
		currentMeshArrays = generalVertexIdxVBOArraysContainer._meshArrays[meshArraysCount - 1]; // take the last.***
	}

	// max unsigned short =  65,535
	var maxIndices = 65000;

	for (var i = 0, ftrianglesCount = this.mTrianglesArray.length; i < ftrianglesCount; i++) 
	{
		if (currentMeshArrays.meshVertices.length/3 >= maxIndices) 
		{
			currentMeshArrays = generalVertexIdxVBOArraysContainer.newVertexIdxArray();
		}

		var ftriangle = this.mTrianglesArray[i];
		var idxP1 = ftriangle.mPoint1Idx;
		var idxP2 = ftriangle.mPoint2Idx;
		var idxP3 = ftriangle.mPoint3Idx;

		var p1 = this.mPoint3DArray[idxP1];
		var p2 = this.mPoint3DArray[idxP2];
		var p3 = this.mPoint3DArray[idxP3];

		// Point 1.***
		currentMeshArrays.meshVertices.push(p1.x);
		currentMeshArrays.meshVertices.push(p1.y);
		currentMeshArrays.meshVertices.push(p1.z);
		currentMeshArrays.mesh_tri_indices.push(currentMeshArrays.meshVertices.length/3 - 1);

		// Point 2.***
		currentMeshArrays.meshVertices.push(p2.x);
		currentMeshArrays.meshVertices.push(p2.y);
		currentMeshArrays.meshVertices.push(p2.z);
		currentMeshArrays.mesh_tri_indices.push(currentMeshArrays.meshVertices.length/3 - 1);

		// Point 3.***
		currentMeshArrays.meshVertices.push(p3.x);
		currentMeshArrays.meshVertices.push(p3.y);
		currentMeshArrays.meshVertices.push(p3.z);
		currentMeshArrays.mesh_tri_indices.push(currentMeshArrays.meshVertices.length/3 - 1);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns point3d
 */
TrianglesSurface.prototype.newPoint3D = function() 
{
	var point3d = new Point3D();
	this.mPoint3DArray.push(point3d);
	return point3d;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns ftriangle
 */
TrianglesSurface.prototype.newTriangle = function() 
{
	var ftriangle = new Triangle();
	this.mTrianglesArray.push(ftriangle);
	return ftriangle;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param matrix4 변수
 * @returns transformedTrianglesSurface
 */
TrianglesSurface.prototype.getTransformedTrianglesSurface = function(matrix4) 
{
	var transformedTrianglesSurface = new TrianglesSurface();

	// 1) copy and transform the points3d.***
	for (var i = 0, pointsCount = this.mPoint3DArray.length; i < pointsCount; i++) 
	{
		var point3d = this.mPoint3DArray[i];
		var transformedPoint = matrix4.transformPoint3D(point3d);
		transformedTrianglesSurface.mPoint3DArray.push(transformedPoint);
	}

	// 2) copy the triangles.***
	for (var i = 0, triCount = this.mTrianglesArray.length; i < triCount; i++) 
	{
		var tri = this.mTrianglesArray[i];
		var transformedTri = transformedTrianglesSurface.newTriangle();
		transformedTri.setPoints3DIndices(tri.mPoint1Idx, tri.mPoint2Idx, tri.mPoint3Idx);
	}
	return transformedTrianglesSurface;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns bb
 */
TrianglesSurface.prototype.getBoundingBox = function() 
{
	var pointsCount = this.mPoint3DArray.length;
	if (pointsCount === 0) { return null; }

	var bb = new BoundingBox();
	var firstPoint3d = this.mPoint3DArray[0];
	bb.init(firstPoint3d);

	for (var i = 1; i < pointsCount; i++) 
	{
		var point3d = this.mPoint3DArray[i];
		bb.addPoint(point3d);
	}

	return bb;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class Fpolyhedron
 */
var Fpolyhedron= function() 
{
	if (!(this instanceof Fpolyhedron)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.mFTrianglesSurfacesArray = [];
	this.mIFCEntityType = -1;
};

/**
 * 어떤 일을 하고 있습니까?
 */
Fpolyhedron.prototype.destroy = function() 
{
	for (var i = 0, ftriSurfacesCount = this.mFTrianglesSurfacesArray.length; i < ftriSurfacesCount; i++) 
	{
		var ftrianglesSurface = this.mFTrianglesSurfacesArray[i];
		if (ftrianglesSurface!==null){ ftrianglesSurface.destroy(); }
		ftrianglesSurface = null;
	}
	this.mFTrianglesSurfacesArray = null;
	this.mIFCEntityType = null;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param generalVBOArraysContainer 변수
 */
Fpolyhedron.prototype.getVertexColorsIndicesArrays = function(generalVBOArraysContainer) 
{
	for (var i = 0, ftriSurfacesCount = this.mFTrianglesSurfacesArray.length; i < ftriSurfacesCount; i++) 
	{
		var ftrianglesSurface = this.mFTrianglesSurfacesArray[i];
		ftrianglesSurface.getVertexColorsIndicesArrays(generalVBOArraysContainer);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param generalVertexIdxVBOArraysContainer 변수
 */
Fpolyhedron.prototype.getVertexIndicesArrays = function(generalVertexIdxVBOArraysContainer) 
{
	for (var i = 0, ftriSurfacesCount = this.mFTrianglesSurfacesArray.length; i < ftriSurfacesCount; i++) 
	{
		var ftrianglesSurface = this.mFTrianglesSurfacesArray[i];
		ftrianglesSurface.getVertexIndicesArrays(generalVertexIdxVBOArraysContainer);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns ftrianglesSurface
 */
Fpolyhedron.prototype.newFTrianglesSurface = function() 
{
	var ftrianglesSurface = new TrianglesSurface();
	this.mFTrianglesSurfacesArray.push(ftrianglesSurface);
	return ftrianglesSurface;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param matrix4
 * @returns transformedFPolyhedron
 */
Fpolyhedron.prototype.getTransformedFPolyhedron = function(matrix4) 
{
	var transformedFPolyhedron = new Fpolyhedron();
	for (var i = 0, ftriSurfacesCount = this.mFTrianglesSurfacesArray.length; i < ftriSurfacesCount; i++) 
	{
		var ftrianglesSurface = this.mFTrianglesSurfacesArray[i];
		var transformedFtrianglesSurface = ftrianglesSurface.getTransformedTrianglesSurface(matrix4);
		transformedFPolyhedron.mFTrianglesSurfacesArray.push(transformedFtrianglesSurface);
	}

	return transformedFPolyhedron;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns bb
 */
Fpolyhedron.prototype.getBoundingBox = function() 
{
	var ftriSurfacesCount = this.mFTrianglesSurfacesArray.length;
	if (ftriSurfacesCount === 0) { return null; }

	var bb = null;
	for (var i = 0; i < ftriSurfacesCount; i++) 
	{
		var ftrianglesSurface = this.mFTrianglesSurfacesArray[i];
		var currentBb = ftrianglesSurface.getBoundingBox();
		if (bb === null) 
		{
			if (currentBb !== null) { bb = currentBb; }
		}
		else 
		{
			if (currentBb !== null) { bb.addBox(currentBb); }
		}
	}

	return bb;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class FpolyhedronsList
 */
var FpolyhedronsList= function() 
{
	if (!(this instanceof FpolyhedronsList)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.mFPolyhedronsArray = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @param generalVBOArraysContainer 변수
 */
FpolyhedronsList.prototype.getVertexColorsIndicesArrays = function(generalVBOArraysContainer) 
{
	for (var i = 0, fpolyhedronsCount = this.mFPolyhedronsArray.length; i < fpolyhedronsCount; i++) 
	{
		var fpolyhedron = this.mFPolyhedronsArray[i];
		if (fpolyhedron.mIFCEntityType !== 27 && fpolyhedron.mIFCEntityType !== 26) // 27 = ifc_space, 26 = ifc_windows.***
		{ fpolyhedron.getVertexColorsIndicesArrays(generalVBOArraysContainer); }
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns fpolyhedron
 */
FpolyhedronsList.prototype.newFPolyhedron = function() 
{
	var fpolyhedron = new Fpolyhedron();
	this.mFPolyhedronsArray.push(fpolyhedron);
	return fpolyhedron;
};



/**
 * 어떤 일을 하고 있습니까?
 * @class Reference
 */
var Reference = function() 
{
	if (!(this instanceof Reference)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	// 1) Object ID.***
	this._id = 0;

	// 2) Block Idx.***
	this._block_idx = -1;

	// 3) Transformation Matrix.***
	this._matrix4 = new Matrix4();

	// 4) New. Only save the cache_key, and free geometry data.***
	//this._VBO_ByteColorsCacheKeys_Container = new VBOByteColorCacheKeysContainer(); // provisionally delete this.***

	// 4') may be only save the cache_key_idx.***
	this._VBO_ByteColorsCacheKeys_Container_idx = -1; // Test. Do this for possibly use with workers.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @param matrix 변수
 */
Reference.prototype.multiplyTransformMatrix = function(matrix) 
{
	var multipliedMat = this._matrix4.getMultipliedByMatrix(matrix); // Original.***
	//var multipliedMat = matrix.getMultipliedByMatrix(this._matrix4); // Test.***
	this._matrix4 = multipliedMat;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param blocksList 변수
 * @returns bb
 */
Reference.prototype.getBoundingBox = function(blocksList) 
{
	var block = blocksList.getBlock(this._block_idx);
	if (block === null) { return null; }

	var block_fpolyhedron = block._fpolyhedron;
	var transformed_fpolyhedron = block_fpolyhedron.getTransformedFPolyhedron(this._matrix4);
	var bb = transformed_fpolyhedron.getBoundingBox();
	return bb;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class CompoundReference
 */
var CompoundReference = function() 
{
	if (!(this instanceof CompoundReference)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this._referencesList = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @param blocksList 변수
 * @returns bb
 */
CompoundReference.prototype.getBoundingBox = function(blocksList) 
{
	var bb = null;
	for (var i=0, references_count = this._referencesList.length; i<references_count; i++) 
	{
		var reference = this._referencesList[i];
		var currentBb = reference.getBoundingBox(blocksList);
		if (bb === null) 
		{
			if (currentBb !== null) { bb = currentBb; }
		}
		else 
		{
			if (currentBb !== null) { bb.addBox(currentBb); }
		}
	}

	return bb;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns ref
 */
CompoundReference.prototype.newReference = function() 
{
	var ref = new Reference();
	this._referencesList.push(ref);
	return ref;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class CompoundReferencesList
 */
var CompoundReferencesList = function() 
{
	if (!(this instanceof CompoundReferencesList)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.name = "";
	this._compoundRefsArray = [];
	this._lodLevel = -1;
	this._ocCulling = new OcclusionCullingOctree();
	this._currentVisibleIndices = []; // Determined by occlusion culling.***
	this._currentVisibleIndicesSC = []; // Determined by occlusion culling.***
	this._currentVisibleIndicesSC_2 = []; // Determined by occlusion culling.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
CompoundReferencesList.prototype.updateCurrentVisibleIndices = function(eye_x, eye_y, eye_z) 
{
	this._currentVisibleIndicesSC = this._ocCulling._infinite_ocCulling_box.getIndicesVisiblesForEye(eye_x, eye_y, eye_z, this._currentVisibleIndicesSC);
	this._currentVisibleIndicesSC_2 = this._ocCulling._ocCulling_box.getIndicesVisiblesForEye(eye_x, eye_y, eye_z, this._currentVisibleIndicesSC_2);
	this._currentVisibleIndices = this._currentVisibleIndicesSC.concat(this._currentVisibleIndicesSC_2);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
CompoundReferencesList.prototype.updateCurrentVisibleIndicesInterior = function(eye_x, eye_y, eye_z) 
{
	this._currentVisibleIndices = this._ocCulling._ocCulling_box.getIndicesVisiblesForEye(eye_x, eye_y, eye_z, this._currentVisibleIndices);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param blocksList 변수
 * @returns bb
 */
CompoundReferencesList.prototype.getBoundingBox = function(blocksList) 
{
	var bb = null;
	for (var i = 0, compRefsCount = this._compoundRefsArray.length; i < compRefsCount; i++) 
	{
		var compRef = this._compoundRefsArray[i];
		var currentBb = compRef.getBoundingBox(blocksList);
		if (bb === null) 
		{
			if (currentBb !== null) { bb = currentBb; }
		}
		else 
		{
			if (currentBb !== null) { bb.addBox(currentBb); }
		}
	}
	return bb;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns compRef
 */
CompoundReferencesList.prototype.newCompoundReference = function() 
{
	var compRef = new CompoundReference();
	this._compoundRefsArray.push(compRef);

	return compRef;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param matrix 변수
 */
CompoundReferencesList.prototype.multiplyReferencesMatrices = function(matrix) 
{
	for (var i = 0, compRefsCount = this._compoundRefsArray.length; i < compRefsCount; i++) 
	{
		var compRef = this._compoundRefsArray[i];
		for (var j = 0, refsCount = compRef._referencesList.length; j < refsCount; j++) 
		{
			var reference = compRef._referencesList[j];
			reference.multiplyTransformMatrix(matrix);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @class CompoundReferencesListContainer
 */
var CompoundReferencesListContainer = function() 
{
	if (!(this instanceof CompoundReferencesListContainer)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.compRefsListArray = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @param compoundReferenceList_name 변수
 * @param lodLevel 변수
 * @returns compoundRefList
 */
CompoundReferencesListContainer.prototype.newCompoundRefsList = function(compoundReferenceList_name, lodLevel) 
{
	var compoundRefList = new CompoundReferencesList();
	compoundRefList.name = compoundReferenceList_name;
	compoundRefList._lodLevel = lodLevel;
	this.compRefsListArray.push(compoundRefList);
	return compoundRefList;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
CompoundReferencesListContainer.prototype.updateCurrentVisibleIndicesOfLists = function(eye_x, eye_y, eye_z) 
{
	for (var i = 0, compRefListsCount = this.compRefsListArray.length; i < compRefListsCount; i++) 
	{
		this.compRefsListArray[i].updateCurrentVisibleIndices(eye_x, eye_y, eye_z);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param compRefListsName 변수
 * @returns result_compRefList
 */
CompoundReferencesListContainer.prototype.getCompRefListByName = function(compRefListsName) 
{
	var result_compRefList;
	var found = false;
	var compRefListsCount = this.compRefsListArray.length;
	var i=0;
	while (!found && i < compRefListsCount) 
	{
		if (this.compRefsListArray[i].name === compRefListsName) 
		{
			result_compRefList = this.compRefsListArray[i];
		}
		i++;
	}

	return result_compRefList;
};

//VBO container.**************************************************************************************************************** //
/*
  var VertexColorIdx_Arrays = function()
  {
	  this.meshVertices = [];
	  this.mesh_colors = [];
	  this.mesh_tri_indices = [];

	  this.meshVertexCacheKey= null;
	  this.meshColorsCacheKey= null;
	  this.meshFacesCacheKey= null;
  };

  var VBO_ArraysContainer = function()
  {
	  this.meshArrays = []; // "VertexColorIdx_Arrays" container.***
  };

  VBO_ArraysContainer.prototype.newVertexColorIdxArray = function()
  {
	  var vci_array = new VertexColorIdx_Arrays();
	  this.meshArrays.push(vci_array);
	  return vci_array;
  };
  */

// F4D Block - Reference with LightMapping.****************************************************************************** //
// Vertices and Indices VBO.********************************************************************************************* //

/**
 * 어떤 일을 하고 있습니까?
 * @class VertexIdxArrays
 */
var VertexIdxArrays = function() 
{
	if (!(this instanceof VertexIdxArrays)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.indicesCount = -1;

	this.meshVertexCacheKey= null;
	this.meshFacesCacheKey= null;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class VertexIdxVBOArraysContainer
 */
var VertexIdxVBOArraysContainer = function() 
{
	if (!(this instanceof VertexIdxVBOArraysContainer)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this._meshArrays = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vi_array
 */
VertexIdxVBOArraysContainer.prototype.newVertexIdxArray = function() 
{
	var vi_array = new VertexIdxArrays();
	this._meshArrays.push(vi_array);
	return vi_array;
};

/**
* 어떤 일을 하고 있습니까?
* @class ByteColorsVBOArrays
*/
var ByteColorsVBOArrays = function() 
{
	if (!(this instanceof ByteColorsVBOArrays)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.meshColorsCacheKey= null;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class ByteColorsVBOArraysContainer
 */
var ByteColorsVBOArraysContainer = function() 
{
	if (!(this instanceof ByteColorsVBOArraysContainer)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this._meshArrays = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns byteColors_array
 */
ByteColorsVBOArraysContainer.prototype.newByteColorsVBOArray = function() 
{
	var byteColors_array = new ByteColorsVBOArrays();
	this._meshArrays.push(byteColors_array);
	return byteColors_array;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class VertexTexcoordsArrays
 */
var VertexTexcoordsArrays = function() 
{
	if (!(this instanceof VertexTexcoordsArrays)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this._vertices_array = [];
	this._texcoords_array = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @class VNTInterleavedCacheKeys
 */
var VNTInterleavedCacheKeys = function() 
{
	if (!(this instanceof VNTInterleavedCacheKeys)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.VNT_cacheKey = null;
	this.indices_cacheKey = null;
	this._vertices_count = 0;
	this.indicesCount = 0;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class VertexTexcoordsArraysCacheKeys
 */
var VertexTexcoordsArraysCacheKeys = function() 
{
	if (!(this instanceof VertexTexcoordsArraysCacheKeys)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this._verticesArray_cacheKey = null;
	this._texcoordsArray_cacheKey = null;
	this._vertices_count = 0;
	this._normalsArray_cacheKey = null;

	// arrayBuffers.***
	this.verticesArrayBuffer;
	this.texCoordsArrayBuffer;
	this.normalsArrayBuffer;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class VertexTexcoordsArraysCacheKeysContainer
 */
var VertexTexcoordsArraysCacheKeysContainer = function() 
{
	if (!(this instanceof VertexTexcoordsArraysCacheKeysContainer)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this._vtArrays_cacheKeys_array = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns vt_cacheKey
 */
VertexTexcoordsArraysCacheKeysContainer.prototype.newVertexTexcoordsArraysCacheKey = function() 
{
	var vt_cacheKey = new VertexTexcoordsArraysCacheKeys();
	this._vtArrays_cacheKeys_array.push(vt_cacheKey);
	return vt_cacheKey;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class SimpleObject
 */
var SimpleObject = function() 
{
	if (!(this instanceof SimpleObject)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this._vtCacheKeys_container = new VertexTexcoordsArraysCacheKeysContainer();
};

/**
 * 어떤 일을 하고 있습니까?
 * @class SimpleStorey
 */
var SimpleStorey = function() 
{
	if (!(this instanceof SimpleStorey)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this._simpleObjects_array = [];
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns simpleObject
 */
SimpleStorey.prototype.newSimpleObject = function() 
{
	var simpleObject = new SimpleObject();
	this._simpleObjects_array.push(simpleObject);
	return simpleObject;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class SimpleBuilding
 */
var SimpleBuilding = function() 
{
	if (!(this instanceof SimpleBuilding)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this._simpleStoreys_list = [];
	//this._simpleBuildingImage = new Image();
	this._simpleBuildingTexture;
	//this._simpleBuildingImage.onload = function() { handleTextureLoaded(this._simpleBuildingImage, this._simpleBuildingTexture); }
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns storey
 */
SimpleBuilding.prototype.newSimpleStorey = function() 
{
	var storey = new SimpleStorey();
	this._simpleStoreys_list.push(storey);
	return storey;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class SimpleBuildingV1
 */
var SimpleBuildingV1 = function() 
{
	if (!(this instanceof SimpleBuildingV1)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	// this class is for faster rendering XDO converted projects.***
	this._simpleObjects_array = [];
	this._simpleBuildingTexture; // Mini texture. Possibly coincident with texture_3.***
	this._texture_0; // Biggest texture.***
	this._texture_1;
	this._texture_2;
	this._texture_3; // Smallest texture.***

	this.color;

	// arrayBuffers.***
	this.textureArrayBuffer; // use this for all textures.***

	// for SPEED TEST.***
	this._vnt_cacheKeys;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns simpleObject
 */
SimpleBuildingV1.prototype.newSimpleObject = function() 
{
	var simpleObject = new SimpleObject();
	this._simpleObjects_array.push(simpleObject);
	return simpleObject;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class Header
 */
var Header = function() 
{
	if (!(this instanceof Header)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this._f4d_version = 1;
	this._version = ""; // provisional for xdo.***
	this._type = -1;
	this._global_unique_id = "";

	this._latitude = 0.0;
	this._longitude = 0.0;
	this._elevation = 0.0;

	// Dont use this, if possible.***
	//this._yaw = 0.0;
	//this._pitch = 0.0;
	//this._roll = 0.0;

	this._boundingBox = new BoundingBox();
	this._octZerothBox = new BoundingBox(); // Provisionally...
	this._dataFileName = "";
	this._nailImageSize = 0;

	// Depending the bbox size, determine the LOD.***
	//this.bbox.maxLegth = 0.0;
	this.isSmall = false;

};

/**
 * 어떤 일을 하고 있습니까?
 * @class BRBuildingProject
 */
var BRBuildingProject = function() 
{
	if (!(this instanceof BRBuildingProject)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this._header = new Header();

	// Block-Reference version of buildingProjects.***
	this.move_matrix = new Float32Array(16); // PositionMatrix.***
	this.moveMatrixInv = new Float32Array(16); // Inverse of PositionMatrix.***
	this.buildingPosMatInv;
	this.buildingPosition;
	this.buildingPositionHIGH;
	this.buildingPositionLOW;

	// Blocks data.***************************************************************
	this._blocksList_Container = new BlocksListsContainer();
	this.createDefaultBlockReferencesLists();

	// Compound references data.**************************************************
	this.octree;
	this._compRefList_Container = new CompoundReferencesListContainer(); // Exterior objects lists.***

	// SimpleBuilding.***************
	this._simpleBuilding = new SimpleBuilding(); // ifc simple building.***
	this._simpleBuilding_v1;

	//this._boundingBox;
	this.radius_aprox;

	// Test for stadistic. Delete this in the future.***
	this._total_triangles_count = 0;

	// Test for use workers.*****************************************************************
	this._VBO_ByteColorsCacheKeysContainer_List = [];
	// End test for use workers.-------------------------------------------------------------

	// SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.***
	this._visibleCompRefLists_scratch = new CompoundReferencesList();
	this.point3dScratch = new Point3D();
	this.point3dScratch2 = new Point3D();

	// Header, SimpleBuildingGeometry and nailImage path-strings.**********************************
	this._f4d_rawPathName = ""; // Use only this.***

	this._f4d_headerPathName = "";
	this._f4d_header_readed = false;
	this._f4d_header_readed_finished = false;

	this._f4d_simpleBuildingPathName = "";
	this._f4d_simpleBuilding_readed = false;
	this._f4d_simpleBuilding_readed_finished = false;

	this._f4d_nailImagePathName = "";
	this._f4d_nailImage_readed = false;
	this._f4d_nailImage_readed_finished = false;

	this._f4d_lod0ImagePathName = "";
	this._f4d_lod0Image_readed = false;
	this._f4d_lod0Image_readed_finished = false;
	this._f4d_lod0Image_exists = true;

	this._f4d_lod1ImagePathName = "";
	this._f4d_lod1Image_readed = false;
	this._f4d_lod1Image_readed_finished = false;
	this._f4d_lod1Image_exists = true;

	this._f4d_lod2ImagePathName = "";
	this._f4d_lod2Image_readed = false;
	this._f4d_lod2Image_readed_finished = false;
	this._f4d_lod2Image_exists = true;

	this._f4d_lod3ImagePathName = "";
	this._f4d_lod3Image_readed = false;
	this._f4d_lod3Image_readed_finished = false;
	this._f4d_lod3Image_exists = true;

	// for SPEEDTEST. Delete after test.***
	this._xdo_simpleBuildingPathName = "";
	this._xdo_simpleBuilding_readed = false;
	this._xdo_simpleBuilding_readed_finished = false;
};

/**
 * 어떤 일을 하고 있습니까?
 */
BRBuildingProject.prototype.calculateTotalTrianglesCount = function() 
{
	// This is temp function for debugging.***
	var compRefList;
	var compRefsCount = 0;
	var interior_compRefLists_count = _interiorCompRefList_Container.compRefsListArray.length;
	for (var i=0; i<interior_compRefLists_count; i++) 
	{
		compRefList = _interiorCompRefList_Container.compRefsListArray[i];
		compRefsCount = compRefList._compoundRefsArray.length;
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param absolute_eye_x 변수
 * @param absolute_eye_y 변수
 * @param absolute_eye_z 변수
 * @returns point3dScratch2
 */
BRBuildingProject.prototype.getTransformedRelativeEyePositionToBuilding = function(absolute_eye_x, absolute_eye_y, absolute_eye_z) 
{
	// 1rst, calculate the relative eye position.***
	var buildingPosition = this.buildingPosition;
	var relative_eye_pos_x = absolute_eye_x - buildingPosition.x;
	var relative_eye_pos_y = absolute_eye_y - buildingPosition.y;
	var relative_eye_pos_z = absolute_eye_z - buildingPosition.z;

	if (this.buildingPosMatInv === undefined)
	{
		this.buildingPosMatInv = new Matrix4();
		this.buildingPosMatInv.setByFloat32Array(this.moveMatrixInv);
	}

	this.point3dScratch.set(relative_eye_pos_x, relative_eye_pos_y, relative_eye_pos_z);
	this.point3dScratch2 = this.buildingPosMatInv.transformPoint3D(this.point3dScratch, this.point3dScratch2);

	return this.point3dScratch2;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param eye_X 변수
 * @param eye_y 변수
 * @param eye_z 변수
 * @returns _header._boundingBox.isPoint3dInside(eye_x, eye_y, eye_z)
 */
BRBuildingProject.prototype.isCameraInsideOfBuilding = function(eye_x, eye_y, eye_z) 
{
	return this._header._boundingBox.isPoint3dInside(eye_x, eye_y, eye_z);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
BRBuildingProject.prototype.updateCurrentVisibleIndicesExterior = function(eye_x, eye_y, eye_z) 
{
	this._compRefList_Container.updateCurrentVisibleIndicesOfLists(eye_x, eye_y, eye_z);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 * @returns _visibleCompRefLists_scratch
 */
BRBuildingProject.prototype.getVisibleCompRefLists = function(eye_x, eye_y, eye_z) 
{
	// Old. Delete this.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	this._visibleCompRefLists_scratch = this._compRefList_Container.get_visibleCompRefObjectsList(eye_x, eye_y, eye_z, this._visibleCompRefLists_scratch);
	return this._visibleCompRefLists_scratch;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 * @returns _compRefList_Container.get_visibleCompRefObjectsList(eye_x, eye_y, eye_z)
 */
BRBuildingProject.prototype.getVisibleEXTCompRefLists = function(eye_x, eye_y, eye_z) 
{
	// Old. Delete this.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	return this._compRefList_Container.get_visibleCompRefObjectsList(eye_x, eye_y, eye_z);
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns allCompRefLists
 */
BRBuildingProject.prototype.getAllCompRefLists = function() 
{
	var allCompRefLists = this._compRefList_Container.compRefsListArray.concat(this._interiorCompRefList_Container.compRefsListArray);
	return allCompRefLists;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns radius_aprox
 */
BRBuildingProject.prototype.getRadiusAprox = function() 
{
	if (this._boundingBox === undefined) 
	{
		var compRefList = this._compRefList_Container.getCompRefListByName("Ref_Skin1");
		if (compRefList) 
		{
			this._boundingBox = new BoundingBox();
			this._boundingBox.minX = compRefList._ocCulling._ocCulling_box.minX;
			this._boundingBox.maxX = compRefList._ocCulling._ocCulling_box.maxX;
			this._boundingBox.minY = compRefList._ocCulling._ocCulling_box.minY;
			this._boundingBox.maxY = compRefList._ocCulling._ocCulling_box.maxY;
			this._boundingBox.minZ = compRefList._ocCulling._ocCulling_box.minZ;
			this._boundingBox.maxZ = compRefList._ocCulling._ocCulling_box.maxZ;

			this.radius_aprox = this._boundingBox.getMaxLength() / 2.0;
		}
	}

	return this.radius_aprox;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns _boundingBox
 */
BRBuildingProject.prototype.getBoundingBox = function() 
{
	/*
	  if(this._boundingBox === undefined)
	  {
		  var boundingBox = null;

		  var compRefLists_count = this._compRefList_Container.compRefsListArray.length;
		  for(var i=0; i<compRefLists_count; i++)
		  {
			  var compRefList = this._compRefList_Container.compRefsListArray[i];
			  var blocksList = this._blocksList_Container.blocksListsArray[i];
			  var bb = compRefList.getBoundingBox(blocksList);
			  if(this._boundingBox === undefined)
			  {
				  if(bb !== null)
				  this._boundingBox = bb;// malament. s'ha de multiplicar per el matrix de transformacio.***
			  }
			  else
			  {
				  if(bb !== null)
					  this._boundingBox.addBox(bb);
			  }

		  }
	  }
	  */

	// Return the compReflList's occlussionCullingMotherBox.***
	if (this._boundingBox === undefined) 
	{
		var compRefList = this._compRefList_Container.getCompRefListByName("Ref_Skin1");
		if (compRefList) 
		{
			this._boundingBox = new BoundingBox();
			this._boundingBox.minX = compRefList._ocCulling._ocCulling_box._minX;
			this._boundingBox.maxX = compRefList._ocCulling._ocCulling_box.maxX;
			this._boundingBox.minY = compRefList._ocCulling._ocCulling_box.minY;
			this._boundingBox.maxY = compRefList._ocCulling._ocCulling_box.maxY;
			this._boundingBox.minZ = compRefList._ocCulling._ocCulling_box.minZ;
			this._boundingBox.maxZ = compRefList._ocCulling._ocCulling_box.maxZ;

			this.radius_aprox = this._boundingBox.getMaxLength() / 2.0;
		}
	}

	return this._boundingBox;
};

/**
 * 어떤 일을 하고 있습니까?
 */
BRBuildingProject.prototype.createDefaultBlockReferencesLists = function() 
{
	// Create 5 BlocksLists: "Blocks1", "Blocks2", "Blocks3", Blocks4" and "BlocksBone".***
	this._blocksList_Container.newBlocksList("Blocks1");
	this._blocksList_Container.newBlocksList("Blocks2");
	this._blocksList_Container.newBlocksList("Blocks3");

	this._blocksList_Container.newBlocksList("BlocksBone");
	this._blocksList_Container.newBlocksList("Blocks4");
};

/**
 * 어떤 일을 하고 있습니까?
 * @class PCloudMesh
 */
var PCloudMesh = function() 
{
	if (!(this instanceof PCloudMesh)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	// this is a temporary class to render mesh from point cloud.***
	this.move_matrix = new Float32Array(16); // PositionMatrix.***
	this.moveMatrixInv = new Float32Array(16); // Inverse of PositionMatrix.***
	this.pCloudPosMat_inv;
	this._pCloudPosition;
	this._pCloudPositionHIGH;
	this._pCloudPositionLOW;

	this._header = new Header();
	this.vbo_datas = new VBOVertexIdxCacheKeysContainer(); // temp.***

	this._f4d_rawPathName = "";

	this._f4d_headerPathName = "";
	this._f4d_header_readed = false;
	this._f4d_header_readed_finished = false;

	this._f4d_geometryPathName = "";
	this._f4d_geometry_readed = false;
	this._f4d_geometry_readed_finished = false;
};

/**
 * 어떤 일을 하고 있습니까?
 * @class BRBuildingProjectsList
 */
var BRBuildingProjectsList = function() 
{
	if (!(this instanceof BRBuildingProjectsList)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this._BR_buildingsArray = [];
	this._boundingBox;
	this._pCloudMesh_array = []; // 1rst aproximation to the pointCloud data. Test.***
	//this.detailed_building; // Test.***
	//this.compRefList_array; // Test.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns br_buildingProject
 */
BRBuildingProjectsList.prototype.newBRProject = function() 
{
	//var titol = "holes a tothom"
	//var br_buildingProject = new BRBuildingProject({Titol : titol});
	var br_buildingProject = new BRBuildingProject();
	this._BR_buildingsArray.push(br_buildingProject);
	return br_buildingProject;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns _boundingBox
 */
BRBuildingProjectsList.prototype.getBoundingBox = function() 
{
	if (this._boundingBox === undefined) 
	{
		var buildingProjects_count = this._BR_buildingsArray.length;
		for (var i=0; i<buildingProjects_count; i++) 
		{
			var buildingProject = this._BR_buildingsArray[i];
			var currentBb = buildingProject.getBoundingBox();
			if (this._boundingBox === undefined) 
			{
				if (currentBb !== null)
				{ this._boundingBox = currentBb; }
			}
			else
			{
				if (currentBb !== null)
				{ this._boundingBox.addBox(currentBb); }
			}
		}
	}
	return this._boundingBox;
};

'use strict';

function ManagerUtils() {};

ManagerUtils.calculateBuildingPositionMatrix = function(neoBuilding) 
{
	// old.*** old.*** old.*** old.*** old.*** old.*** old.*** old.*** old.*** old.*** old.***
	// old.*** old.*** old.*** old.*** old.*** old.*** old.*** old.*** old.*** old.*** old.***
	// old.*** old.*** old.*** old.*** old.*** old.*** old.*** old.*** old.*** old.*** old.***
	var metaData = neoBuilding.metaData;
	if ( metaData === undefined
			|| metaData.geographicCoord.longitude === undefined
			|| metaData.geographicCoord.latitude === undefined
			|| metaData.geographicCoord.altitude === undefined ) { return false; }

	// 0) PositionMatrix.************************************************************************
	var position;
	if (neoBuilding.buildingPosition !== undefined)
	{
		position = neoBuilding.buildingPosition;
	}
	else
	{
		position = Cesium.Cartesian3.fromDegrees(metaData.geographicCoord.longitude, metaData.geographicCoord.latitude, metaData.geographicCoord.altitude);
	}
	neoBuilding.buildingPosition = position;

	// High and Low values of the position.****************************************************
	//var splitValue = Cesium.EncodedCartesian3.encode(position); // no works.***
	var splitVelue_X  = Cesium.EncodedCartesian3.encode(position.x);
	var splitVelue_Y  = Cesium.EncodedCartesian3.encode(position.y);
	var splitVelue_Z  = Cesium.EncodedCartesian3.encode(position.z);

	neoBuilding.buildingPositionHIGH = new Float32Array(3);
	neoBuilding.buildingPositionHIGH[0] = splitVelue_X.high;
	neoBuilding.buildingPositionHIGH[1] = splitVelue_Y.high;
	neoBuilding.buildingPositionHIGH[2] = splitVelue_Z.high;

	neoBuilding.buildingPositionLOW = new Float32Array(3);
	neoBuilding.buildingPositionLOW[0] = splitVelue_X.low;
	neoBuilding.buildingPositionLOW[1] = splitVelue_Y.low;
	neoBuilding.buildingPositionLOW[2] = splitVelue_Z.low;

	// Determine the elevation of the position.***********************************************************
	//var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
	//var height = cartographic.height;
	// End Determine the elevation of the position.-------------------------------------------------------
	neoBuilding.move_matrix = new Float32Array(16); // PositionMatrix.***
	neoBuilding.moveMatrixInv = new Float32Array(16); // Inverse of PositionMatrix.***
	neoBuilding.transfMat = new Matrix4();
	neoBuilding.transfMatInv = new Matrix4();
	Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, neoBuilding.move_matrix);
	neoBuilding.transfMat.setByFloat32Array(neoBuilding.move_matrix);
	neoBuilding.transfMat_inv = new Float32Array(16);
	Cesium.Matrix4.inverse(neoBuilding.move_matrix, neoBuilding.transfMat_inv);

	neoBuilding.move_matrix[12] = 0;
	neoBuilding.move_matrix[13] = 0;
	neoBuilding.move_matrix[14] = 0;
	neoBuilding.buildingPosition = position;
	// note: "neoBuilding.move_matrix" is only rotation matrix.***

	Cesium.Matrix4.inverse(neoBuilding.move_matrix, neoBuilding.moveMatrixInv);
	neoBuilding.transfMatInv.setByFloat32Array(neoBuilding.moveMatrixInv);

	return true;
};
/*
ManagerUtils.worldPointToGeographicCoords = function(absolutePoint, resultGeographicCoords, magoManager) {
	if(resultGeographicCoords === undefined)
		resultGeographicCoords = new GeographicCoord();
	
	if(magoManager.configInformation.geo_view_library === Constant.WORLDWIND)
	{

	}
	else if(magoManager.configInformation.geo_view_library === Constant.CESIUM)
	{
		var cartographic = Cesium.Cartographic.fromCartesian(new Cesium.Cartesian3(absolutePoint.x, absolutePoint.y, absolutePoint.z));
		resultGeographicCoords.longitude = cartographic.longitude * (180.0/Math.PI);
		resultGeographicCoords.latitude = cartographic.latitude * (180.0/Math.PI);
		resultGeographicCoords.altitude = cartographic.height;
	}
};
*/

ManagerUtils.pointToGeographicCoord = function(point, resultGeographicCoord, magoManager) 
{
	if (magoManager.configInformation.geo_view_library === Constant.WORLDWIND)
	{
		;//
	}
	else if (magoManager.configInformation.geo_view_library === Constant.CESIUM)
	{
		var cartographic = Cesium.Cartographic.fromCartesian(new Cesium.Cartesian3(point.x, point.y, point.z));
		if (resultGeographicCoord === undefined)
		{ resultGeographicCoord = new GeographicCoord(); }
		resultGeographicCoord.setLonLatAlt(cartographic.longitude * (180.0/Math.PI), cartographic.latitude * (180.0/Math.PI), cartographic.height);
	}
	
	return resultGeographicCoord;
};

ManagerUtils.geographicCoordToWorldPoint = function(longitude, latitude, altitude, resultWorldPoint, magoManager) 
{
	if (resultWorldPoint === undefined)
	{ resultWorldPoint = new Point3D(); }

	
	if (magoManager.configInformation.geo_view_library === Constant.WORLDWIND)
	{
		var globe = magoManager.wwd.globe;
		var origin = new WorldWind.Vec3(0, 0, 0);
		origin = globe.computePointFromPosition(latitude, longitude, altitude, origin);
		
		resultWorldPoint.set(origin[0], origin[1], origin[2]);
		origin = undefined;
	}
	else if (magoManager.configInformation.geo_view_library === Constant.CESIUM)
	{
		// *if this in Cesium:
		var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude);
		resultWorldPoint.set(position.x, position.y, position.z);
		position = undefined;
	}
	
	return resultWorldPoint;
};

ManagerUtils.getTransformationMatrixInPoint = function(point, resultTMatrix, resultMatrixInv, magoManager) 
{
	if (magoManager.configInformation.geo_view_library === Constant.WORLDWIND)
	{
		;//
	}
	else if (magoManager.configInformation.geo_view_library === Constant.CESIUM)
	{
		if (resultTMatrix === undefined)
		{ resultTMatrix = new Matrix4(); }
		
		Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3(point.x, point.y, point.z), undefined, resultTMatrix._floatArrays);
		
		if (resultMatrixInv)
		{
			Cesium.Matrix4.inverseTransformation(resultTMatrix._floatArrays, resultMatrixInv._floatArrays);
		}
	}
	
	return resultTMatrix;
};

ManagerUtils.translatePivotPointGeoLocationData = function(geoLocationData, newPivotPoint) 
{
	// this function NO modifies the geographic coords.***
	// "newPivotPoint" is the desired position of the new origen of coords, for example:
	// in a building you can desire the center of the bbox as the origin of the coords.***
	if (geoLocationData === undefined)
	{ return; }

	var rawTranslation = new Point3D();
	rawTranslation.set(-newPivotPoint.x, -newPivotPoint.y, -newPivotPoint.z);

	var traslationVector;
	var realBuildingPos;
	realBuildingPos = geoLocationData.tMatrix.transformPoint3D(newPivotPoint, realBuildingPos );
	traslationVector = geoLocationData.tMatrix.rotatePoint3D(rawTranslation, traslationVector );
	geoLocationData.position.x += traslationVector.x;
	geoLocationData.position.y += traslationVector.y;
	geoLocationData.position.z += traslationVector.z;
	//geoLocationData.positionHIGH;
	geoLocationData.aditionalTraslation = traslationVector;
	geoLocationData.positionLOW[0] += traslationVector.x;
	geoLocationData.positionLOW[1] += traslationVector.y;
	geoLocationData.positionLOW[2] += traslationVector.z;

	realBuildingPos.x += traslationVector.x;
	realBuildingPos.y += traslationVector.y;
	realBuildingPos.z += traslationVector.z;

	if (geoLocationData.pivotPoint === undefined)
	{ geoLocationData.pivotPoint = new Point3D(); }

	geoLocationData.pivotPoint.set(realBuildingPos.x, realBuildingPos.y, realBuildingPos.z);
};

ManagerUtils.calculateGeoLocationData = function(longitude, latitude, altitude, heading, pitch, roll, resultGeoLocationData, magoManager) 
{
	if (resultGeoLocationData === undefined)
	{ resultGeoLocationData = new GeoLocationData(); }

	// 0) Position.********************************************************************************************
	if (resultGeoLocationData.geographicCoord === undefined)
	{ resultGeoLocationData.geographicCoord = new GeographicCoord(); }

	if (longitude !== undefined)
	{ resultGeoLocationData.geographicCoord.longitude = longitude; }

	if (latitude !== undefined)
	{ resultGeoLocationData.geographicCoord.latitude = latitude; }

	if (altitude !== undefined)
	{ resultGeoLocationData.geographicCoord.altitude = altitude; }

	if (heading !== undefined)
	{ resultGeoLocationData.heading = heading; }

	if (pitch !== undefined)
	{ resultGeoLocationData.pitch = pitch; }

	if (roll !== undefined)
	{ resultGeoLocationData.roll = roll; }

	if (resultGeoLocationData.geographicCoord.longitude === undefined || resultGeoLocationData.geographicCoord.latitude === undefined)
	{ return; }
	
	if (magoManager.configInformation === undefined)
	{ return; }

	resultGeoLocationData.position = this.geographicCoordToWorldPoint(longitude, latitude, altitude, resultGeoLocationData.position, magoManager);

	// High and Low values of the position.********************************************************************
	if (resultGeoLocationData.positionHIGH === undefined)
	{ resultGeoLocationData.positionHIGH = new Float32Array([0.0, 0.0, 0.0]); }
	if (resultGeoLocationData.positionLOW === undefined)
	{ resultGeoLocationData.positionLOW = new Float32Array([0.0, 0.0, 0.0]); }
	this.calculateSplited3fv([resultGeoLocationData.position.x, resultGeoLocationData.position.y, resultGeoLocationData.position.z], resultGeoLocationData.positionHIGH, resultGeoLocationData.positionLOW);

	// Determine the elevation of the position.***********************************************************
	//var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
	//var height = cartographic.height;
	// End Determine the elevation of the position.-------------------------------------------------------
	if (resultGeoLocationData.tMatrix === undefined)
	{ resultGeoLocationData.tMatrix = new Matrix4(); }
	else
	{ resultGeoLocationData.tMatrix.Identity(); }

	if (resultGeoLocationData.geoLocMatrix === undefined)
	{ resultGeoLocationData.geoLocMatrix = new Matrix4(); }
	else
	{ resultGeoLocationData.geoLocMatrix.Identity(); }

	if (resultGeoLocationData.geoLocMatrixInv === undefined)
	{ resultGeoLocationData.geoLocMatrixInv = new Matrix4(); }
	else
	{ resultGeoLocationData.geoLocMatrixInv.Identity(); }

	//---------------------------------------------------------

	if (resultGeoLocationData.tMatrixInv === undefined)
	{ resultGeoLocationData.tMatrixInv = new Matrix4(); }
	else
	{ resultGeoLocationData.tMatrixInv.Identity(); }

	if (resultGeoLocationData.rotMatrix === undefined)
	{ resultGeoLocationData.rotMatrix = new Matrix4(); }
	else
	{ resultGeoLocationData.rotMatrix.Identity(); }

	if (resultGeoLocationData.rotMatrixInv === undefined)
	{ resultGeoLocationData.rotMatrixInv = new Matrix4(); }
	else
	{ resultGeoLocationData.rotMatrixInv.Identity(); }

	var xRotMatrix = new Matrix4();  // created as identity matrix.***
	var yRotMatrix = new Matrix4();  // created as identity matrix.***
	var zRotMatrix = new Matrix4();  // created as identity matrix.***

	if (resultGeoLocationData.heading !== undefined && resultGeoLocationData.heading !== 0)
	{
		zRotMatrix.rotationAxisAngDeg(resultGeoLocationData.heading, 0.0, 0.0, -1.0);
	}

	if (resultGeoLocationData.pitch !== undefined && resultGeoLocationData.pitch !== 0)
	{
		xRotMatrix.rotationAxisAngDeg(resultGeoLocationData.pitch, -1.0, 0.0, 0.0);
	}

	if (resultGeoLocationData.roll !== undefined && resultGeoLocationData.roll !== 0)
	{
		yRotMatrix.rotationAxisAngDeg(resultGeoLocationData.roll, 0.0, -1.0, 0.0);
	}
	
	if (magoManager.configInformation.geo_view_library === Constant.WORLDWIND)
	{
		// * if this in webWorldWind:
		var xAxis = new WorldWind.Vec3(0, 0, 0),
			yAxis = new WorldWind.Vec3(0, 0, 0),
			zAxis = new WorldWind.Vec3(0, 0, 0);
		var rotMatrix = WorldWind.Matrix.fromIdentity();
		var tMatrix = WorldWind.Matrix.fromIdentity();
		
		WorldWind.WWMath.localCoordinateAxesAtPoint([resultGeoLocationData.position.x, resultGeoLocationData.position.y, resultGeoLocationData.position.z], magoManager.wwd.globe, xAxis, yAxis, zAxis);

		rotMatrix.set(
			xAxis[0], yAxis[0], zAxis[0], 0,
			xAxis[1], yAxis[1], zAxis[1], 0,
			xAxis[2], yAxis[2], zAxis[2], 0,
			0, 0, 0, 1); 
				
		tMatrix.set(
			xAxis[0], yAxis[0], zAxis[0], resultGeoLocationData.position.x,
			xAxis[1], yAxis[1], zAxis[1], resultGeoLocationData.position.y,
			xAxis[2], yAxis[2], zAxis[2], resultGeoLocationData.position.z,
			0, 0, 0, 1);
				
		var columnMajorArray = WorldWind.Matrix.fromIdentity(); 
		columnMajorArray = rotMatrix.columnMajorComponents(columnMajorArray); // no used.***
			
		var matrixInv = WorldWind.Matrix.fromIdentity();
		matrixInv.invertMatrix(rotMatrix);
		var columnMajorArrayAux_inv = WorldWind.Matrix.fromIdentity();
		var columnMajorArray_inv = matrixInv.columnMajorComponents(columnMajorArrayAux_inv); 
		
		var tMatrixColMajorArray = WorldWind.Matrix.fromIdentity();
		tMatrixColMajorArray = tMatrix.columnMajorComponents(tMatrixColMajorArray);
		resultGeoLocationData.tMatrix.setByFloat32Array(tMatrixColMajorArray);
		
		resultGeoLocationData.geoLocMatrix.copyFromMatrix4(resultGeoLocationData.tMatrix); // "geoLocMatrix" is the pure transformation matrix, without heading or pitch or roll.***

		var zRotatedTMatrix = zRotMatrix.getMultipliedByMatrix(resultGeoLocationData.tMatrix, zRotatedTMatrix);
		var zxRotatedTMatrix = xRotMatrix.getMultipliedByMatrix(zRotatedTMatrix, zxRotatedTMatrix);
		var zxyRotatedTMatrix = yRotMatrix.getMultipliedByMatrix(zxRotatedTMatrix, zxyRotatedTMatrix);
		resultGeoLocationData.tMatrix = zxyRotatedTMatrix;

		resultGeoLocationData.rotMatrix.copyFromMatrix4(resultGeoLocationData.tMatrix);
		resultGeoLocationData.rotMatrix._floatArrays[12] = 0;
		resultGeoLocationData.rotMatrix._floatArrays[13] = 0;
		resultGeoLocationData.rotMatrix._floatArrays[14] = 0;
		
		// now calculate the inverses of the matrices.***
		var tMatrixInv = WorldWind.Matrix.fromIdentity();
		tMatrixInv.invertMatrix(resultGeoLocationData.tMatrix._floatArrays);
		resultGeoLocationData.tMatrixInv.setByFloat32Array(tMatrixInv);
		
		var rotMatrixInv = WorldWind.Matrix.fromIdentity();
		rotMatrixInv.invertMatrix(resultGeoLocationData.rotMatrix._floatArrays);
		resultGeoLocationData.rotMatrixInv.setByFloat32Array(rotMatrixInv);
		
		var geoLocMatrixInv = WorldWind.Matrix.fromIdentity();
		geoLocMatrixInv.invertMatrix(resultGeoLocationData.geoLocMatrix._floatArrays);
		resultGeoLocationData.geoLocMatrixInv.setByFloat32Array(geoLocMatrixInv);
	}
	else if (magoManager.configInformation.geo_view_library === Constant.CESIUM)
	{
		// *if this in Cesium:
		Cesium.Transforms.eastNorthUpToFixedFrame(resultGeoLocationData.position, undefined, resultGeoLocationData.tMatrix._floatArrays);
		resultGeoLocationData.geoLocMatrix.copyFromMatrix4(resultGeoLocationData.tMatrix);// "geoLocMatrix" is the pure transformation matrix, without heading or pitch or roll.***

		var zRotatedTMatrix = zRotMatrix.getMultipliedByMatrix(resultGeoLocationData.tMatrix, zRotatedTMatrix);
		var zxRotatedTMatrix = xRotMatrix.getMultipliedByMatrix(zRotatedTMatrix, zxRotatedTMatrix);
		var zxyRotatedTMatrix = yRotMatrix.getMultipliedByMatrix(zxRotatedTMatrix, zxyRotatedTMatrix);
		resultGeoLocationData.tMatrix = zxyRotatedTMatrix;

		resultGeoLocationData.rotMatrix.copyFromMatrix4(resultGeoLocationData.tMatrix);
		resultGeoLocationData.rotMatrix._floatArrays[12] = 0;
		resultGeoLocationData.rotMatrix._floatArrays[13] = 0;
		resultGeoLocationData.rotMatrix._floatArrays[14] = 0;

		// now, calculates the inverses.***
		Cesium.Matrix4.inverseTransformation(resultGeoLocationData.tMatrix._floatArrays, resultGeoLocationData.tMatrixInv._floatArrays);
		Cesium.Matrix4.inverseTransformation(resultGeoLocationData.rotMatrix._floatArrays, resultGeoLocationData.rotMatrixInv._floatArrays);
		Cesium.Matrix4.inverseTransformation(resultGeoLocationData.geoLocMatrix._floatArrays, resultGeoLocationData.geoLocMatrixInv._floatArrays);
	}

	// finally assing the pivotPoint.***
	if (resultGeoLocationData.pivotPoint === undefined)
	{ resultGeoLocationData.pivotPoint = new Point3D(); }

	resultGeoLocationData.pivotPoint.set(resultGeoLocationData.position.x, resultGeoLocationData.position.y, resultGeoLocationData.position.z);

	return resultGeoLocationData;
};

ManagerUtils.calculateGeoLocationDataByAbsolutePoint = function(absoluteX, absoluteY, absoluteZ, resultGeoLocationData, magoManager) 
{

	if (resultGeoLocationData === undefined)
	{ resultGeoLocationData = new GeoLocationData(); }

	// 0) Position.********************************************************************************************
	if (resultGeoLocationData.geographicCoord === undefined)
	{ resultGeoLocationData.geographicCoord = new GeographicCoord(); }
	
	if (magoManager.configInformation === undefined)
	{ return; }
	
	if (resultGeoLocationData.position === undefined)
	{ resultGeoLocationData.position = new Point3D(); }
		
	resultGeoLocationData.position.x = absoluteX;
	resultGeoLocationData.position.y = absoluteY;
	resultGeoLocationData.position.z = absoluteZ;
		
	if (magoManager.configInformation.geo_view_library === Constant.WORLDWIND)
	{
		var globe = magoManager.wwd.globe;
		var resultCartographic = new WorldWind.Vec3(0, 0, 0);
		resultCartographic = globe.computePositionFromPoint(absoluteX, absoluteY, absoluteZ, resultCartographic);
		resultGeoLocationData.geographicCoord.longitude = resultCartographic.longitude;
		resultGeoLocationData.geographicCoord.latitude = resultCartographic.latitude;
		resultGeoLocationData.geographicCoord.altitude = resultCartographic.altitude;
	}
	else if (magoManager.configInformation.geo_view_library === Constant.CESIUM)
	{
		// *if this in Cesium:
		//resultGeoLocationData.position = Cesium.Cartesian3.fromDegrees(resultGeoLocationData.geographicCoord.longitude, resultGeoLocationData.geographicCoord.latitude, resultGeoLocationData.geographicCoord.altitude);
		// must find cartographic data.***
		var cartographic = new Cesium.Cartographic();
		var cartesian = new Cesium.Cartesian3();
		cartesian.x = absoluteX;
		cartesian.y = absoluteY;
		cartesian.z = absoluteZ;
		cartographic = Cesium.Cartographic.fromCartesian(cartesian, magoManager.scene._globe._ellipsoid, cartographic);
		resultGeoLocationData.geographicCoord.longitude = cartographic.longitude * 180.0/Math.PI;
		resultGeoLocationData.geographicCoord.latitude = cartographic.latitude * 180.0/Math.PI;
		resultGeoLocationData.geographicCoord.altitude = cartographic.height;
	}

	// High and Low values of the position.********************************************************************
	if (resultGeoLocationData.positionHIGH === undefined)
	{ resultGeoLocationData.positionHIGH = new Float32Array([0.0, 0.0, 0.0]); }
	if (resultGeoLocationData.positionLOW === undefined)
	{ resultGeoLocationData.positionLOW = new Float32Array([0.0, 0.0, 0.0]); }
	this.calculateSplited3fv([resultGeoLocationData.position.x, resultGeoLocationData.position.y, resultGeoLocationData.position.z], resultGeoLocationData.positionHIGH, resultGeoLocationData.positionLOW);

	// Determine the elevation of the position.***********************************************************
	//var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
	//var height = cartographic.height;
	// End Determine the elevation of the position.-------------------------------------------------------
	if (resultGeoLocationData.tMatrix === undefined)
	{ resultGeoLocationData.tMatrix = new Matrix4(); }
	else
	{ resultGeoLocationData.tMatrix.Identity(); }

	if (resultGeoLocationData.geoLocMatrix === undefined)
	{ resultGeoLocationData.geoLocMatrix = new Matrix4(); }
	else
	{ resultGeoLocationData.geoLocMatrix.Identity(); }

	if (resultGeoLocationData.geoLocMatrixInv === undefined)
	{ resultGeoLocationData.geoLocMatrixInv = new Matrix4(); }
	else
	{ resultGeoLocationData.geoLocMatrixInv.Identity(); }

	//---------------------------------------------------------

	if (resultGeoLocationData.tMatrixInv === undefined)
	{ resultGeoLocationData.tMatrixInv = new Matrix4(); }
	else
	{ resultGeoLocationData.tMatrixInv.Identity(); }

	if (resultGeoLocationData.rotMatrix === undefined)
	{ resultGeoLocationData.rotMatrix = new Matrix4(); }
	else
	{ resultGeoLocationData.rotMatrix.Identity(); }

	if (resultGeoLocationData.rotMatrixInv === undefined)
	{ resultGeoLocationData.rotMatrixInv = new Matrix4(); }
	else
	{ resultGeoLocationData.rotMatrixInv.Identity(); }

	var xRotMatrix = new Matrix4();  // created as identity matrix.***
	var yRotMatrix = new Matrix4();  // created as identity matrix.***
	var zRotMatrix = new Matrix4();  // created as identity matrix.***

	if (resultGeoLocationData.heading !== undefined && resultGeoLocationData.heading !== 0)
	{
		zRotMatrix.rotationAxisAngDeg(resultGeoLocationData.heading, 0.0, 0.0, -1.0);
	}

	if (resultGeoLocationData.pitch !== undefined && resultGeoLocationData.pitch !== 0)
	{
		xRotMatrix.rotationAxisAngDeg(resultGeoLocationData.pitch, -1.0, 0.0, 0.0);
	}

	if (resultGeoLocationData.roll !== undefined && resultGeoLocationData.roll !== 0)
	{
		yRotMatrix.rotationAxisAngDeg(resultGeoLocationData.roll, 0.0, -1.0, 0.0);
	}
	
	if (magoManager.configInformation.geo_view_library === Constant.WORLDWIND)
	{
		// * if this in webWorldWind:
		var xAxis = new WorldWind.Vec3(0, 0, 0),
			yAxis = new WorldWind.Vec3(0, 0, 0),
			zAxis = new WorldWind.Vec3(0, 0, 0);
		var rotMatrix = WorldWind.Matrix.fromIdentity();
		var tMatrix = WorldWind.Matrix.fromIdentity();
		
		WorldWind.WWMath.localCoordinateAxesAtPoint([resultGeoLocationData.position.x, resultGeoLocationData.position.y, resultGeoLocationData.position.z], magoManager.wwd.globe, xAxis, yAxis, zAxis);

		rotMatrix.set(
			xAxis[0], yAxis[0], zAxis[0], 0,
			xAxis[1], yAxis[1], zAxis[1], 0,
			xAxis[2], yAxis[2], zAxis[2], 0,
			0, 0, 0, 1); 
				
		tMatrix.set(
			xAxis[0], yAxis[0], zAxis[0], resultGeoLocationData.position.x,
			xAxis[1], yAxis[1], zAxis[1], resultGeoLocationData.position.y,
			xAxis[2], yAxis[2], zAxis[2], resultGeoLocationData.position.z,
			0, 0, 0, 1);
				
		var columnMajorArray = WorldWind.Matrix.fromIdentity(); 
		columnMajorArray = rotMatrix.columnMajorComponents(columnMajorArray); // no used.***
			
		var matrixInv = WorldWind.Matrix.fromIdentity();
		matrixInv.invertMatrix(rotMatrix);
		var columnMajorArrayAux_inv = WorldWind.Matrix.fromIdentity();
		var columnMajorArray_inv = matrixInv.columnMajorComponents(columnMajorArrayAux_inv); 
		
		var tMatrixColMajorArray = WorldWind.Matrix.fromIdentity();
		tMatrixColMajorArray = tMatrix.columnMajorComponents(tMatrixColMajorArray);
		resultGeoLocationData.tMatrix.setByFloat32Array(tMatrixColMajorArray);
		
		resultGeoLocationData.geoLocMatrix.copyFromMatrix4(resultGeoLocationData.tMatrix); // "geoLocMatrix" is the pure transformation matrix, without heading or pitch or roll.***

		var zRotatedTMatrix = zRotMatrix.getMultipliedByMatrix(resultGeoLocationData.tMatrix, zRotatedTMatrix);
		var zxRotatedTMatrix = xRotMatrix.getMultipliedByMatrix(zRotatedTMatrix, zxRotatedTMatrix);
		var zxyRotatedTMatrix = yRotMatrix.getMultipliedByMatrix(zxRotatedTMatrix, zxyRotatedTMatrix);
		resultGeoLocationData.tMatrix = zxyRotatedTMatrix;

		resultGeoLocationData.rotMatrix.copyFromMatrix4(resultGeoLocationData.tMatrix);
		resultGeoLocationData.rotMatrix._floatArrays[12] = 0;
		resultGeoLocationData.rotMatrix._floatArrays[13] = 0;
		resultGeoLocationData.rotMatrix._floatArrays[14] = 0;
		
		// now calculate the inverses of the matrices.***
		var tMatrixInv = WorldWind.Matrix.fromIdentity();
		tMatrixInv.invertMatrix(resultGeoLocationData.tMatrix._floatArrays);
		resultGeoLocationData.tMatrixInv.setByFloat32Array(tMatrixInv);
		
		var rotMatrixInv = WorldWind.Matrix.fromIdentity();
		rotMatrixInv.invertMatrix(resultGeoLocationData.rotMatrix._floatArrays);
		resultGeoLocationData.rotMatrixInv.setByFloat32Array(rotMatrixInv);
		
		var geoLocMatrixInv = WorldWind.Matrix.fromIdentity();
		geoLocMatrixInv.invertMatrix(resultGeoLocationData.geoLocMatrix._floatArrays);
		resultGeoLocationData.geoLocMatrixInv.setByFloat32Array(geoLocMatrixInv);
	}
	else if (magoManager.configInformation.geo_view_library === Constant.CESIUM)
	{
		// *if this in Cesium:
		Cesium.Transforms.eastNorthUpToFixedFrame(resultGeoLocationData.position, undefined, resultGeoLocationData.tMatrix._floatArrays);
		resultGeoLocationData.geoLocMatrix.copyFromMatrix4(resultGeoLocationData.tMatrix);// "geoLocMatrix" is the pure transformation matrix, without heading or pitch or roll.***

		var zRotatedTMatrix = zRotMatrix.getMultipliedByMatrix(resultGeoLocationData.tMatrix, zRotatedTMatrix);
		var zxRotatedTMatrix = xRotMatrix.getMultipliedByMatrix(zRotatedTMatrix, zxRotatedTMatrix);
		var zxyRotatedTMatrix = yRotMatrix.getMultipliedByMatrix(zxRotatedTMatrix, zxyRotatedTMatrix);
		resultGeoLocationData.tMatrix = zxyRotatedTMatrix;

		resultGeoLocationData.rotMatrix.copyFromMatrix4(resultGeoLocationData.tMatrix);
		resultGeoLocationData.rotMatrix._floatArrays[12] = 0;
		resultGeoLocationData.rotMatrix._floatArrays[13] = 0;
		resultGeoLocationData.rotMatrix._floatArrays[14] = 0;

		// now, calculates the inverses.***
		Cesium.Matrix4.inverse(resultGeoLocationData.tMatrix._floatArrays, resultGeoLocationData.tMatrixInv._floatArrays);
		Cesium.Matrix4.inverse(resultGeoLocationData.rotMatrix._floatArrays, resultGeoLocationData.rotMatrixInv._floatArrays);
		Cesium.Matrix4.inverse(resultGeoLocationData.geoLocMatrix._floatArrays, resultGeoLocationData.geoLocMatrixInv._floatArrays);
	}

	// finally assing the pivotPoint.***
	if (resultGeoLocationData.pivotPoint === undefined)
	{ resultGeoLocationData.pivotPoint = new Point3D(); }

	resultGeoLocationData.pivotPoint.set(resultGeoLocationData.position.x, resultGeoLocationData.position.y, resultGeoLocationData.position.z);

	return resultGeoLocationData;
};

ManagerUtils.calculateSplitedValues = function(value, resultSplitValue)
{
	if (resultSplitValue === undefined)
	{ resultSplitValue = new SplitValue(); }

	var doubleHigh;
	if (value >= 0.0) 
	{
		doubleHigh = Math.floor(value / 65536.0) * 65536.0;
		resultSplitValue.high = doubleHigh;
		resultSplitValue.low = value - doubleHigh;
	}
	else 
	{
		doubleHigh = Math.floor(-value / 65536.0) * 65536.0;
		resultSplitValue.high = -doubleHigh;
		resultSplitValue.low = value + doubleHigh;
	}

	return resultSplitValue;
};

ManagerUtils.calculateSplited3fv = function(point3fv, resultSplitPoint3fvHigh, resultSplitPoint3fvLow)
{
	if (point3fv === undefined)
	{ return undefined; }

	if (resultSplitPoint3fvHigh === undefined)
	{ resultSplitPoint3fvHigh = new Float32Array(3); }

	if (resultSplitPoint3fvLow === undefined)
	{ resultSplitPoint3fvLow = new Float32Array(3); }

	var posSplitX = new SplitValue();
	posSplitX = this.calculateSplitedValues(point3fv[0], posSplitX);
	var posSplitY = new SplitValue();
	posSplitY = this.calculateSplitedValues(point3fv[1], posSplitY);
	var posSplitZ = new SplitValue();
	posSplitZ = this.calculateSplitedValues(point3fv[2], posSplitZ);

	resultSplitPoint3fvHigh[0] = posSplitX.high;
	resultSplitPoint3fvHigh[1] = posSplitY.high;
	resultSplitPoint3fvHigh[2] = posSplitZ.high;

	resultSplitPoint3fvLow[0] = posSplitX.low;
	resultSplitPoint3fvLow[1] = posSplitY.low;
	resultSplitPoint3fvLow[2] = posSplitZ.low;
};

ManagerUtils.getBuildingCurrentPosition = function(renderingMode, neoBuilding) 
{
	// renderingMode = 0 => assembled.***
	// renderingMode = 1 => dispersed.***

	if (neoBuilding === undefined) { return undefined; }

	var realBuildingPos;

	// 0 = assembled mode. 1 = dispersed mode.***
	if (renderingMode === 1) 
	{
		if (neoBuilding.geoLocationDataAux === undefined) 
		{
			var realTimeLocBlocksList = MagoConfig.getData().alldata;
			var newLocation = realTimeLocBlocksList[neoBuilding.buildingId];
			// must calculate the realBuildingPosition (bbox_center_position).***

			if (newLocation) 
			{
				neoBuilding.geoLocationDataAux = ManagerUtils.calculateGeoLocationData(newLocation.LONGITUDE, newLocation.LATITUDE, newLocation.ELEVATION, neoBuilding.geoLocationDataAux);

				//this.pointSC = neoBuilding.bbox.getCenterPoint(this.pointSC);
				neoBuilding.point3dScratch.set(0.0, 0.0, 50.0);
				realBuildingPos = neoBuilding.geoLocationDataAux.tMatrix.transformPoint3D(neoBuilding.point3dScratch, realBuildingPos );
			}
			else 
			{
				// use the normal data.***
				neoBuilding.point3dScratch = neoBuilding.bbox.getCenterPoint(neoBuilding.point3dScratch);
				realBuildingPos = neoBuilding.transfMat.transformPoint3D(neoBuilding.point3dScratch, realBuildingPos );
			}
		}
		else 
		{
			//this.pointSC = neoBuilding.bbox.getCenterPoint(this.pointSC);
			neoBuilding.point3dScratch.set(0.0, 0.0, 50.0);
			realBuildingPos = neoBuilding.geoLocationDataAux.tMatrix.transformPoint3D(neoBuilding.point3dScratch, realBuildingPos );
		}
	}
	else 
	{
		neoBuilding.point3dScratch = neoBuilding.bbox.getCenterPoint(neoBuilding.point3dScratch);
		realBuildingPos = neoBuilding.transfMat.transformPoint3D(neoBuilding.point3dScratch, realBuildingPos );
	}

	return realBuildingPos;
};

'use strict';

/**
 * 사용하지 않음
 */
!(function() 
{

	var URL = window.URL || window.webkitURL;
	if (!URL) 
	{
		throw new Error('This browser does not support Blob URLs');
	}

	if (!window.Worker) 
	{
		throw new Error('This browser does not support Web Workers');
	}

	function Multithread(threads) 
	{
		this.threads = Math.max(2, threads | 0);
		this._queue = [];
		this._queueSize = 0;
		this._activeThreads = 0;
		this._debug = {
			start : 0,
			end   : 0,
			time  : 0
		};
	}

	Multithread.prototype._worker = {
		JSON: function() 
		{
			var /**/name/**/ = (/**/func/**/);
			self.addEventListener('message', function(e) 
			{
				var data = e.data;
				var view = new DataView(data);
				var len = data.byteLength;
				var str = Array(len);
				for (var i=0;i<len;i++) 
				{
					str[i] = String.fromCharCode(view.getUint8(i));
				}
				var args = JSON.parse(str.join(''));
				var value = (/**/name/**/).apply(/**/name/**/, args);
				try 
				{
					data = JSON.stringify(value);
				}
				catch (ex) 
				{
					throw new Error('Parallel function must return JSON serializable response');
				}
				len = typeof(data)==='undefined'?0:data.length;
				var buffer = new ArrayBuffer(len);
				view = new DataView(buffer);
				for (i=0;i<len;i++) 
				{
					view.setUint8(i, data.charCodeAt(i) & 255);
				}
				self.postMessage(buffer, [buffer]);
				self.close();
			});
		},
		Int32: function() 
		{
			var /**/name/**/ = (/**/func/**/);
			self.addEventListener('message', function(e) 
			{
				var data = e.data;
				var view = new DataView(data);
				var len = data.byteLength / 4;
				var arr = Array(len);
				for (var i=0;i<len;i++) 
				{
					arr[i] = view.getInt32(i*4);
				}
				var value = (/**/name/**/).apply(/**/name/**/, arr);
				if (!(value instanceof Array)) { value = [value]; }
				len = value.length;
				var buffer = new ArrayBuffer(len * 4);
				view = new DataView(buffer);
				for (i=0;i<len;i++) 
				{
					view.setInt32(i*4, value[i]);
				}
				self.postMessage(buffer, [buffer]);
				self.close();
			});
		},
		Float64: function() 
		{
			var /**/name/**/ = (/**/func/**/);
			self.addEventListener('message', function(e) 
			{
				var data = e.data;
				var view = new DataView(data);
				var len = data.byteLength / 8;
				var arr = Array(len);
				for (var i=0;i<len;i++) 
				{
					arr[i] = view.getFloat64(i*8);
				}
				var value = (/**/name/**/).apply(/**/name/**/, arr);
				if (!(value instanceof Array)) { value = [value]; }
				len = value.length;
				var buffer = new ArrayBuffer(len * 8);
				view = new DataView(buffer);
				for (i=0;i<len;i++) 
				{
					view.setFloat64(i*8, value[i]);
				}
				self.postMessage(buffer, [buffer]);
				self.close();
			});
		}
	};

	Multithread.prototype._encode = {
		JSON: function(args) 
		{
			try 
			{
				var data = JSON.stringify(args);
			}
			catch (e) 
			{
				throw new Error('Arguments provided to parallel function must be JSON serializable');
			}
			len = data.length;
			var buffer = new ArrayBuffer(len);
			var view = new DataView(buffer);
			for (var i=0;i<len;i++) 
			{
				view.setUint8(i, data.charCodeAt(i) & 255);
			}
			return buffer;
		},
		Int32: function(args) 
		{
			len = args.length;
			var buffer = new ArrayBuffer(len*4);
			var view = new DataView(buffer);
			for (var i=0;i<len;i++) 
			{
				view.setInt32(i*4, args[i]);
			}
			return buffer;
		},
		Float64: function(args) 
		{
			len = args.length;
			var buffer = new ArrayBuffer(len*8);
			var view = new DataView(buffer);
			for (var i=0;i<len;i++) 
			{
				view.setFloat64(i*8, args[i]);
			}
			return buffer;
		}
	};

	Multithread.prototype._decode = {
		JSON: function(data) 
		{
			var view = new DataView(data);
			var len = data.byteLength;
			var str = Array(len);
			for (var i=0;i<len;i++) 
			{
				str[i] = String.fromCharCode(view.getUint8(i));
			}
			if (!str.length) 
			{
				return;
			}
			else 
			{
				return JSON.parse(str.join(''));
			}
		},
		Int32: function(data) 
		{
			var view = new DataView(data);
			var len = data.byteLength / 4;
			var arr = Array(len);
			for (var i=0;i<len;i++) 
			{
				arr[i] = view.getInt32(i*4);
			}
			return arr;
		},
		Float64: function(data) 
		{
			var view = new DataView(data);
			var len = data.byteLength / 8;
			var arr = Array(len);
			for (var i=0;i<len;i++) 
			{
				arr[i] = view.getFloat64(i*8);
			}
			return arr;
		},
	};

	Multithread.prototype._execute = function(resource, args, type, callback) 
	{
		if (!this._activeThreads) 
		{
			this._debug.start = (new Date()).valueOf();
		}
		if (this._activeThreads < this.threads) 
		{
			this._activeThreads++;
			var t = (new Date()).valueOf();
			var worker = new Worker(resource);
			var buffer = this._encode[type](args);
			var decode = this._decode[type];
			var self = this;
			if (type==='JSON') 
			{
				var listener = function(e) 
				{
					callback.call(self, decode(e.data));
					self.ready();
				};
			}
			else 
			{
				var listener = function(e) 
				{
					callback.apply(self, decode(e.data));
					self.ready();
				};
			}
			worker.addEventListener('message', listener);
			worker.postMessage(buffer, [buffer]);
		}
		else 
		{
			this._queueSize++;
			this._queue.push([resource, args, type, callback]);
		}
	};

	Multithread.prototype.ready = function() 
	{
		this._activeThreads--;
		if (this._queueSize) 
		{
			this._execute.apply(this, this._queue.shift());
			this._queueSize--;
		}
		else if (!this._activeThreads) 
		{
			this._debug.end = (new Date()).valueOf();
			this._debug.time = this._debug.end - this._debug.start;
		}
	};

	Multithread.prototype._prepare = function(fn, type) 
	{

		fn = fn;

		var name = fn.name;
		var fnStr = fn.toString();
		if (!name) 
		{
			name = '$' + ((Math.random()*10)|0);
			while (fnStr.indexOf(name) !== -1) 
			{
				name += ((Math.random()*10)|0);
			}
		}

		var script = this._worker[type]
			.toString()
			.replace(/^.*?[\n\r]+/gi, '')
			.replace(/\}[\s]*$/, '')
			.replace(/\/\*\*\/name\/\*\*\//gi, name)
			.replace(/\/\*\*\/func\/\*\*\//gi, fnStr);

		var resource = URL.createObjectURL(new Blob([script], {type: 'text/javascript'}));

		return resource;

	};

	Multithread.prototype.process = function(fn, callback) 
	{

		var resource = this._prepare(fn, 'JSON');
		var self = this;

		return function() 
		{
			self._execute(resource, [].slice.call(arguments), 'JSON', callback);
		};

	};

	Multithread.prototype.processInt32 = function(fn, callback) 
	{

		var resource = this._prepare(fn, 'Int32');
		var self = this;

		return function() 
		{
			self._execute(resource, [].slice.call(arguments), 'Int32', callback);
		};

	};

	Multithread.prototype.processFloat64 = function(fn, callback) 
	{

		var resource = this._prepare(fn, 'Float64');
		var self = this;

		return function() 
		{
			self._execute(resource, [].slice.call(arguments), 'Float64', callback);
		};

	};

	window.Multithread = Multithread;

})();
'use strict';

//importScripts('../Build/CesiumUnminified/SonGeometryJScript.js'); // No.***
//importScripts('GeometryUtil.js'); // Yes.***
//importScripts('GeometryModifier.js');
//importScripts('Point3D.js');
//importScripts('CullingVolume.js');

// Test son.*****************************************************
var currentCamPos = new Point3D();
var lastCamPos = new Point3D();
var squareDistUmbral = 22.0;
var building_project;
var compRefList_array_background;

//var compRefList_Container = new CompoundReferencesListContainer();
//var interiorCompRefList_Container = new CompoundReferencesListContainer();

/**
 * 어떤 일을 하고 있습니까?
 */
var geoModifier = new GeometryModifier();
// End test son.-------------------------------------------------

onmessage = function(e) 
{
	console.log('Message received from main script');
	var workerResult = 'Result: sonete';

	console.log('Posting message back to main script');
	//postMessage(workerResult);
	var result = possibleCameraPositionChanged(e);
	postMessage([result]);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param value 변수
 */
function setTest(value) 
{
	squareDistUmbral = value;
}

/*
function getFrustumIntersectedProjectBuildings(projectsList, cullingVolume)
{
	var buildings_array = [];
	var last_squared_dist = undefined;
	var detailed_building = undefined;
	var building_projects_count = projectsList._BR_buildingsArray.length;

	for(var p_counter = 0; p_counter<building_projects_count; p_counter++)
	{
		var BR_Project = projectsList._BR_buildingsArray[p_counter];
		var squaredDistToCamera = Cartesian3.distanceSquared(cameraPosition, BR_Project.buildingPosition);
		var min_squaredDist_to_see_detailed = 40000;
		var min_squaredDist_to_see = 10000000;

		if(squaredDistToCamera > min_squaredDist_to_see)
			continue;

		var boundingSphere_Aux = new BoundingSphere();
		boundingSphere_Aux.center = BR_Project.buildingPosition;
		boundingSphere_Aux.radius = 50.0; // 50m. Provisional.***

		//----------------------------------------------------------------------------------------------------------------------------
		// var frameState = scene._frameState;

		var frustumCull = frameState.cullingVolume.computeVisibility(boundingSphere_Aux);
		if(frustumCull !== Intersect.OUTSIDE)
		{
			if(squaredDistToCamera < min_squaredDist_to_see_detailed)// min dist to see detailed.***
			{
				if(last_squared_dist)
				{
					if(squaredDistToCamera < last_squared_dist)
					{
						last_squared_dist = squaredDistToCamera;
						buildings_array.push(detailed_building);
						detailed_building = BR_Project;
					}
					else{
						buildings_array.push(BR_Project);
					}
				}
				else{
					last_squared_dist = squaredDistToCamera;
					detailed_building = BR_Project;
				}
			}
			else{
				buildings_array.push(BR_Project);
			}
		}

	}


	return buildings_array;
};
*/

/**
 * 어떤 일을 하고 있습니까?
 * @param e 변수
 */
function possibleCameraPositionChanged(e) 
{
	var compRefList_Container = e.data[0];
	var interiorCompRefList_Container = e.data[1];
	var camPos = e.data[2];
	//var compRefList_array = e.data[2];

	var eye_x = camPos.x;
	var eye_y = camPos.y;
	var eye_z = camPos.z;

	var interior_visibleCompRefLists = geoModifier.compoundReferencesListContainerGetVisibleCompRefObjectsList(interiorCompRefList_Container, eye_x, eye_y, eye_z);
	var visibleCompRefLists = geoModifier.compoundReferencesListContainerGetVisibleCompRefObjectsList(compRefList_Container, eye_x, eye_y, eye_z);
	var total_visibleCompRefLists = visibleCompRefLists.concat(interior_visibleCompRefLists);
	//var interior_visibleCompRefLists = interiorCompRefList_Container.get_visibleCompRefObjectsList(eye_x, eye_y, eye_z); // Cannot use alien functions.***
	//var visibleCompRefLists = compRefList_Container.get_visibleCompRefObjectsList(eye_x, eye_y, eye_z); // Cannot use alien functions.***
	//var total_visibleCompRefLists = visibleCompRefLists.concat(interior_visibleCompRefLists);

	return total_visibleCompRefLists;
	/*
	// 1rst, frustum culling.*******************
	var projectsList = e.data[0];
	var cullingVolume = e.data[1];
	//var projects_list = getFrustumIntersectedProjectBuildings(projectsList, cullingVolume);


	var squaredDist = lastCamPos.squareDistTo(currentCamPos.x, currentCamPos.y, currentCamPos.z);
	if(squaredDist > squareDistUmbral)
	{
		// Camera position changed.***
		lastCamPos.set(currentCamPos.x, currentCamPos.y, currentCamPos.z);

	}
	else{
		// Camera doesnt moved.***
	}
	*/
}

/*
// An example.***
var i = 0;

function timedCount() {
    i = i + 1;
    postMessage(i);
    setTimeout("timedCount()",500);
}

//timedCount();
*/
/*
var n = 1;
search: while (true) {
  n += 1;
  for (var i = 2; i <= Math.sqrt(n); i += 1)
    if (n % i == 0)
     continue search;
  // found a prime!
  postMessage(n);
}
*/
