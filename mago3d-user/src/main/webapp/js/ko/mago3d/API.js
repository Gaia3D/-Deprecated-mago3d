'use strict';

/**
 * API
 * @class API
 * @param apiName api이름
 */
var API = function(apiName) {
	if(!(this instanceof API)) {
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
//	// highlighting
//	this.highLightedBuildings = [];
//	// color
//	this.colorBuildings = [];
//	// show/hide
//	this.hideBuildings = [];
	
	// 0 = block mode, 1 = object mode
	this.mouseMoveMode = 0;
	
	// 이슈 등록 표시
	this.issueInsertEnable = false;
	// object 정보 표시
	this.objectInfoViewEnable = false;
	// 이슈 목록 표시
	this.issueListEnable = false;
	//
	this.insertIssueState = 0;
};

API.prototype.getMagoEnable = function() {
	return this.magoEnable;
};
API.prototype.setMagoEnable = function(magoEnable) {
	this.magoEnable = magoEnable;
};

API.prototype.getAPIName = function() {
	return this.apiName;
};

API.prototype.getProjectId = function() {
	return this.projectId;
};
API.prototype.setProjectId = function(projectId) {
	this.projectId = projectId;
};

API.prototype.getBlockId = function() {
	return this.blockId;
};
API.prototype.setBlockId = function(blockId) {
	this.blockId = blockId;
};

API.prototype.getBlockIds = function() {
	return this.blockIds;
};
API.prototype.setBlockIds = function(blockIds) {
	this.blockIds = blockIds;
};

API.prototype.getObjectIds = function() {
	return this.objectIds;
};
API.prototype.setObjectIds = function(objectIds) {
	this.objectIds = objectIds;
};

API.prototype.getIssueId = function() {
	return this.issueId;
};
API.prototype.setIssueId = function(issueId) {
	this.issueId = issueId;
};
API.prototype.getIssueType = function() {
	return this.issueType;
};
API.prototype.setIssueType = function(issueType) {
	this.issueId = issueType;
};

API.prototype.getDataKey = function() {
	return this.dataKey;
};
API.prototype.setDataKey = function(dataKey) {
	this.dataKey = dataKey;
};

API.prototype.getRenderMode = function() {
	return this.renderMode;
};
API.prototype.setRenderMode = function(renderMode) {
	this.renderMode = renderMode;
};

API.prototype.getLatitude = function() {
	return this.latitude;
};
API.prototype.setLatitude = function(latitude) {
	this.latitude = latitude;
};

API.prototype.getLongitude = function() {
	return this.longitude;
};
API.prototype.setLongitude = function(longitude) {
	this.longitude = longitude;
};

API.prototype.getElevation = function() {
	return this.elevation;
};
API.prototype.setElevation = function(elevation) {
	this.elevation = elevation;
};

API.prototype.getHeading = function() {
	return this.heading;
};
API.prototype.setHeading = function(heading) {
	this.heading = heading;
};

API.prototype.getPitch = function() {
	return this.pitch;
};
API.prototype.setPitch = function(pitch) {
	this.pitch = pitch;
};

API.prototype.getRoll = function() {
	return this.roll;
};
API.prototype.setRoll = function(roll) {
	this.roll = roll;
};

API.prototype.getColor = function() {
	return this.color;
};
API.prototype.setColor = function(color) {
	this.color = color;
};

API.prototype.getBlockType = function() {
	return this.blockType;
};
API.prototype.setBlockType = function(blockType) {
	this.blockType = blockType;
};

API.prototype.getShowOutFitting = function() {
	return this.showOutFitting;
};
API.prototype.setShowOutFitting = function(showOutFitting) {
	this.showOutFitting = showOutFitting;
};

API.prototype.getShowBoundingBox = function() {
	return this.showBoundingBox;
};
API.prototype.setShowBoundingBox = function(showBoundingBox) {
	this.showBoundingBox = showBoundingBox;
};

API.prototype.getShowShadow = function() {
	return this.showShadow;
};
API.prototype.setShowShadow = function(showShadow) {
	this.showShadow = showShadow;
};

API.prototype.getFrustumFarDistance = function() {
	return this.frustumFarDistance;
};
API.prototype.setFrustumFarDistance = function(frustumFarDistance) {
	this.frustumFarDistance = frustumFarDistance;
};

API.prototype.getMouseMoveMode = function() {
	return this.mouseMoveMode;
};
API.prototype.setMouseMoveMode = function(mouseMoveMode) {
	this.mouseMoveMode = mouseMoveMode;
};

API.prototype.getIssueInsertEnable = function() {
	return this.issueInsertEnable;
};
API.prototype.setIssueInsertEnable = function(issueInsertEnable) {
	this.issueInsertEnable = issueInsertEnable;
};
API.prototype.getObjectInfoViewEnable = function() {
	return this.objectInfoViewEnable;
};
API.prototype.setObjectInfoViewEnable = function(objectInfoViewEnable) {
	this.objectInfoViewEnable = objectInfoViewEnable;
};
API.prototype.getIssueListEnable = function() {
	return this.issueListEnable;
};
API.prototype.setIssueListEnable = function(issueListEnable) {
	this.issueListEnable = issueListEnable;
};

API.prototype.getInsertIssueState = function() {
	return this.insertIssueState;
};
API.prototype.setInsertIssueState = function(insertIssueState) {
	this.insertIssueState = insertIssueState;
};

API.prototype.getDrawType = function() {
	return this.drawType;
};
API.prototype.setDrawType = function(drawType) {
	this.drawType = drawType;
};