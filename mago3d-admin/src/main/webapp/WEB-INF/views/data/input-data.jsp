<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglib.jsp" %>
<%@ include file="/WEB-INF/views/common/config.jsp" %>

<!DOCTYPE html>
<html lang="${accessibility}">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width">
	<title>${sessionSiteName }</title>
	<link rel="stylesheet" href="/css/${lang}/font/font.css" />
	<link rel="stylesheet" href="/images/${lang}/icon/glyph/glyphicon.css" />
	<link rel="stylesheet" href="/externlib/${lang}/normalize/normalize.min.css" />
	<link rel="stylesheet" href="/externlib/${lang}/jquery-ui/jquery-ui.css" />
	<link rel="stylesheet" href="/css/${lang}/style.css" />
</head>

<body>
	<%@ include file="/WEB-INF/views/layouts/header.jsp" %>
	<%@ include file="/WEB-INF/views/layouts/menu.jsp" %>
	
	<div class="site-body">
		<div class="container">
			<div class="site-content">
				<%@ include file="/WEB-INF/views/layouts/sub_menu.jsp" %>
				<div class="page-area">
					<%@ include file="/WEB-INF/views/layouts/page_header.jsp" %>
					
					<div class="page-content">
						<div class="content-desc u-pull-right"><span class="icon-glyph glyph-emark-dot color-warning"></span>체크표시는 필수입력 항목입니다.</div>
						<div class="tabs">
							<ul>
								<li><a href="#data_info_tab">기본정보</a></li>
							</ul>
							<div id="data_info_tab">
								<form:form id="dataInfo" modelAttribute="dataInfo" method="post" onsubmit="return false;">
								<table class="input-table scope-row">
									<col class="col-label" />
									<col class="col-input" />
									<tr>
										<th class="col-label" scope="row">
											<form:label path="data_key">Key</form:label>
											<span class="icon-glyph glyph-emark-dot color-warning"></span>
										</th>
										<td class="col-input">
											<form:hidden path="duplication_value"/>
											<form:input path="data_key" cssClass="m" />
					  						<input type="button" id="data_duplication_buttion" value="중복확인" />
					  						<form:errors path="data_key" cssClass="error" />
										</td>
									</tr>
									<tr>
										<th class="col-label" scope="row">
											<form:label path="data_group_name">데이터 그룹</form:label>
											<span class="icon-glyph glyph-emark-dot color-warning"></span>
										</th>
										<td class="col-input">
											<form:hidden path="data_group_id" />
				 							<form:input path="data_group_name" cssClass="m" readonly="true" />
											<input type="button" id="data_group_buttion" value="그룹선택" />
										</td>
									</tr>
									<tr>
										<th class="col-label" scope="row">
											<form:label path="data_name">이름</form:label>
										</th>
										<td class="col-input">
											<form:input path="data_name" class="m" />
					  						<form:errors path="data_name" cssClass="error" />
										</td>
									</tr>
									<tr>
										<th class="col-label" scope="row">
											<form:label path="latitude">위도</form:label>
											<span class="icon-glyph glyph-emark-dot color-warning"></span>
										</th>
										<td class="col-input">
											<form:input path="latitude" class="m" />
					  						<form:errors path="latitude" cssClass="error" />
										</td>
									</tr>
									<tr>
										<th class="col-label" scope="row">
											<form:label path="longitude">경도</form:label>
											<span class="icon-glyph glyph-emark-dot color-warning"></span>
										</th>
										<td class="col-input">
											<form:input path="longitude" class="m" />
					  						<form:errors path="longitude" cssClass="error" />
										</td>
									</tr>
									<tr>
										<th class="col-label" scope="row">
											<form:label path="height">높이</form:label>
											<span class="icon-glyph glyph-emark-dot color-warning"></span>
										</th>
										<td class="col-input">
											<form:input path="height" class="m" />
					  						<form:errors path="height" cssClass="error" />
										</td>
									</tr>
									<tr>
										<th class="col-label" scope="row">
											<form:label path="heading">Heading</form:label>
											<span class="icon-glyph glyph-emark-dot color-warning"></span>
										</th>
										<td class="col-input">
											<form:input path="heading" class="m" />
					  						<form:errors path="heading" cssClass="error" />
										</td>
									</tr>
									<tr>
										<th class="col-label" scope="row">
											<form:label path="pitch">Pitch</form:label>
											<span class="icon-glyph glyph-emark-dot color-warning"></span>
										</th>
										<td class="col-input">
											<form:input path="pitch" class="m" />
					  						<form:errors path="pitch" cssClass="error" />
										</td>
									</tr>
									<tr>
										<th class="col-label" scope="row">
											<form:label path="roll">Roll</form:label>
											<span class="icon-glyph glyph-emark-dot color-warning"></span>
										</th>
										<td class="col-input">
											<form:input path="roll" class="m" />
					  						<form:errors path="roll" cssClass="error" />
										</td>
									</tr>
								</table>
								
								<div class="button-group">
									<div id="insertDataLink" class="center-buttons">
										<input type="submit" value="저장" onclick="insertData();" />
										<a href="/data/list-data.do" class="button">목록</a>
									</div>
								</div>
								</form:form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<%@ include file="/WEB-INF/views/layouts/footer.jsp" %>
	
	<!-- Dialog -->
	<div class="dialog" title="데이터 그룹">
		<div class="dialog-data-group">
<c:if test="${!empty dataGroupList }">
			<ul>
	<c:set var="groupDepthValue" value="0" />
	<c:forEach var="dataGroup" items="${dataGroupList }" varStatus="status">
		<c:if test="${groupDepthValue eq '0' && dataGroup.depth eq 1 }">
				<li>
					<input type="radio" id="radio_group_${dataGroup.data_group_id }" name="radio_group" value="${dataGroup.data_group_id }_${dataGroup.data_group_name }" />
					<label for="radio_group_${dataGroup.data_group_id }">${dataGroup.data_group_name }</label>
		</c:if>
		<c:if test="${groupDepthValue eq '1' && dataGroup.depth eq 1 }">
				</li>
				<li>
					<input type="radio" id="radio_group_${dataGroup.data_group_id }" name="radio_group" value="${dataGroup.data_group_id }_${dataGroup.data_group_name }" />
					<label for="radio_group_${dataGroup.data_group_id }">${dataGroup.data_group_name }</label>
		</c:if>
		<c:if test="${groupDepthValue eq '1' && dataGroup.depth eq 2 }">
					<ul>
						<li>
							<input type="radio" id="radio_group_${dataGroup.data_group_id }" name="radio_group" value="${dataGroup.data_group_id }_${dataGroup.data_group_name }" />
							<label for="radio_group_${dataGroup.data_group_id }">${dataGroup.data_group_name }</label>
		</c:if>
		<c:if test="${groupDepthValue eq '2' && dataGroup.depth eq 1 }">
						</li>
					</ul>
				</li>
				<li>
					<input type="radio" id="radio_group_${dataGroup.data_group_id }" name="radio_group" value="${dataGroup.data_group_id }_${dataGroup.data_group_name }" />
					<label for="radio_group_${dataGroup.data_group_id }">${dataGroup.data_group_name }</label>
		</c:if>
		<c:if test="${groupDepthValue eq '2' && dataGroup.depth eq 2 }">
						</li>
						<li>
							<input type="radio" id="radio_group_${dataGroup.data_group_id }" name="radio_group" value="${dataGroup.data_group_id }_${dataGroup.data_group_name }" />
							<label for="radio_group_${dataGroup.data_group_id }">${dataGroup.data_group_name }</label>
		</c:if>
		<c:if test="${groupDepthValue eq '2' && dataGroup.depth eq 3 }">
							<ul style="padding-left: 30px;">
								<li>
									<input type="radio" id="radio_group_${dataGroup.data_group_id }" name="radio_group" value="${dataGroup.data_group_id }_${dataGroup.data_group_name }" />
									<label for="radio_group_${dataGroup.data_group_id }">${dataGroup.data_group_name }</label>
		</c:if>
		<c:if test="${groupDepthValue eq '3' && dataGroup.depth eq 1 }">
								</li>
							</ul>
						</li>
					</ul>
				</li>
				<li>
					<input type="radio" id="radio_group_${dataGroup.data_group_id }" name="radio_group" value="${dataGroup.data_group_id }_${dataGroup.data_group_name }" />
					<label for="radio_group_${dataGroup.data_group_id }">${dataGroup.data_group_name }</label>
		</c:if>		
		<c:if test="${groupDepthValue eq '3' && dataGroup.depth eq 2 }">
								</li>
							</ul>
						</li>
						<li>
							<input type="radio" id="radio_group_${dataGroup.data_group_id }" name="radio_group" value="${dataGroup.data_group_id }_${dataGroup.data_group_name }" />
							<label for="radio_group_${dataGroup.data_group_id }">${dataGroup.data_group_name }</label>
		</c:if>			
		<c:if test="${groupDepthValue eq '3' && dataGroup.depth eq 3 }">
								</li>
								<li>
									<input type="radio" id="radio_group_${dataGroup.data_group_id }" name="radio_group" value="${dataGroup.data_group_id }_${dataGroup.group_name }" />
									<label for="radio_group_${dataGroup.data_group_id }">${dataGroup.group_name }</label>
		</c:if>	
		<c:if test="${dataGroup.depth eq '3' && status.last }">
								</li>
							</ul>
						</li>
					</ul>
				</li>
		</c:if>
		<c:if test="${dataGroup.depth eq '2' && status.last }">
						</li>
					</ul>
				</li>
		</c:if>
		<c:if test="${dataGroup.depth eq '1' && status.last }">
				</li>
		</c:if>
		<c:set var="groupDepthValue" value="${dataGroup.depth }" />			
	</c:forEach>
			</ul>
</c:if>
		</div>
			
		<div class="button-group">
			<input type="submit" id="button_groupSelect" name="button_groupSelect" value="선택" />
		</div>
	</div>

<script src="/externlib/${lang}/jquery/jquery.js"></script>
<script src="/externlib/${lang}/jquery-ui/jquery-ui.js"></script>		
<script type="text/javascript" src="/js/${lang}/common.js"></script>
<script type="text/javascript" src="/js/${lang}/message.js"></script>
<script type="text/javascript">
	// 0은 비표시, 1은 표시
	var dataDeviceArray = new Array("0", "0", "0", "0", "0", "0");
	var dataDeviceCount = 0;
	$(document).ready(function() {
		$( ".tabs" ).tabs();
		
		initJqueryCalendar();
	});
	
	// 그룹 선택
	$( "#data_group_buttion" ).on( "click", function() {
		dialog.dialog( "open" );
	});
	var dialog = $( ".dialog" ).dialog({
		autoOpen: false,
		height: 600,
		width: 600,
		modal: true,
		resizable: false
	});
	
	// 아이디 중복 확인
	$( "#data_duplication_buttion" ).on( "click", function() {
		var dataKey = $("#data_key").val();
		if (dataKey == "") {
			alert(JS_MESSAGE["data.key.empty"]);
			$("#data_id").focus();
			return false;
		}
		var info = "data_key=" + dataKey;
		$.ajax({
			url: "/data/ajax-data-key-duplication-check.do",
			type: "POST",
			data: info,
			cache: false,
			//async:false,
			dataType: "json",
			success: function(msg){
				if(msg.result == "success") {
					if(msg.duplication_value != "0") {
						alert(JS_MESSAGE["data.key.duplication"]);
						$("#data_key").focus();
						return false;
					} else {
						alert(JS_MESSAGE["data.key.enable"]);
						$("#duplication_value").val(msg.duplication_value);
					}
				} else {
					alert(JS_MESSAGE[msg.result]);
				}
			},
			error:function(request,status,error) {
				//alert(JS_MESSAGE["ajax.error.message"]);
				alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
    		}
		});
	});
	
	// 그룹 선택
	$( "#button_groupSelect" ).on( "click", function() {
		var radioObj = $(":radio[name=radio_group]:checked").val();
		if (!radioObj) {
			alert('그룹이 선택되지 않았습니다.');
	        return false;
	    } else {
	    	var splitValues = radioObj.split("_");
	    	var dataGroupName = "";
	    	for(var i = 1; i < splitValues.length; i++) {
	    		dataGroupName = dataGroupName + splitValues[i];
	    		if(i != splitValues.length - 1) {
	    			dataGroupName = dataGroupName + "_";
	    		}
			}	    	
	    	$("#data_group_id").val(splitValues[0]);
			$("#data_group_name").val(dataGroupName);
			dialog.dialog( "close" );
	    }
	});
	
	// Data 정보 저장
	var insertDataFlag = true;
	function insertData() {
		if (checkData() == false) {
			return false;
		}
		if(insertDataFlag) {
			insertDataFlag = false;
			var info = $("#dataInfo").serialize();
			$.ajax({
				url: "/data/ajax-insert-data-info.do",
				type: "POST",
				data: info,
				cache: false,
				async:false,
				dataType: "json",
				success: function(msg){
					if(msg.result == "success") {
						alert(JS_MESSAGE["data.insert"]);
						$("#duplication_value").val("");
					}
					insertDataFlag = true;
				},
				error:function(request,status,error){
			        alert(JS_MESSAGE["ajax.error.message"]);
			        insertDataFlag = true;
				}
			});
		} else {
			alert(JS_MESSAGE["button.dobule.click"]);
			return;
		}
	}
	
	function checkData() {
		if ($("#data_key").val() == "") {
			alert(JS_MESSAGE["data.key.empty"]);
			$("#data_key").focus();
			return false;
		}
		if($("#duplication_value").val() == null || $("#duplication_value").val() == "") {
			alert("Key 중복확인을 해주십시오.");
			return false;
		} else if($("#duplication_value").val() == "1") {
			alert("사용중인 Key 입니다. 다른 Key를 선택해 주십시오.");
			return false;
		}
		if ($("#data_group_id").val() == "") {
			alert(JS_MESSAGE["data.group.id.empty"]);
			$("#data_group_id").focus();
			return false;
		}
		if ($("#latitude").val() == "") {
			alert(JS_MESSAGE["data.latitude.empty"]);
			$("#latitude").focus();
			return false;
		}
		if (!isNumber($("#latitude").val())) {
			$("#latitude").focus();
			return false;
		}
		if ($("#longitude").val() == "") {
			alert(JS_MESSAGE["data.longitude.empty"]);
			$("#longitude").focus();
			return false;
		}
		if (!isNumber($("#longitude").val())) {
			$("#logitude").focus();
			return false;
		}
		if ($("#height").val() == "") {
			alert(JS_MESSAGE["data.height.empty"]);
			$("#height").focus();
			return false;
		}
		if (!isNumber($("#height").val())) {
			$("#height").focus();
			return false;
		}
		if ($("#heading").val() == "") {
			alert(JS_MESSAGE["data.heading.empty"]);
			$("#heading").focus();
			return false;
		}
		if (!isNumber($("#heading").val())) {
			$("#heading").focus();
			return false;
		}
		if($("#pitch").val() == "") {
			alert(JS_MESSAGE["data.pitch.empty"]);
			$("#pitch").focus();
			return false;
		}
		if (!isNumber($("#pitch").val())) {
			$("#pitch").focus();
			return false;
		}
		if($("#roll").val() == "") {
			alert(JS_MESSAGE["data.roll.empty"]);
			$("#roll").focus();
			return false;
		}
		if (!isNumber($("#roll").val())) {
			$("#roll").focus();
			return false;
		}
	}
</script>
</body>
</html>