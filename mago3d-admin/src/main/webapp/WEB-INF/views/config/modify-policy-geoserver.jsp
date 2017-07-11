<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div id="geoserver_tab">
	<form:form id="policyGeoServer" modelAttribute="policy" method="post" onsubmit="return false;">
		<form:hidden path="policy_id"/>
	<table class="input-table scope-row">
		<col class="col-label l" />
		<col class="col-input" />
		<tr>
  			<th>
		  		<span>사용유무</span>
 			</th>
 			<td class="col-input radio-set">
 				<form:radiobutton path="geo_server_enable" value="true" label="사용" />
				<form:radiobutton path="geo_server_enable" value="false" label="사용안함" />
	  		</td>
  		</tr>
		<tr>
			<th class="col-label l" scope="row">
				<form:label path="geo_server_url">URL</form:label>
			</th>
			<td class="col-input">
				<form:input path="geo_server_url" cssClass="l" />
				<form:errors path="geo_server_url" cssClass="error" />
			</td>
		</tr>
		<tr>
			<th class="col-label l" scope="row">
				<form:label path="geo_server_layers">Layers</form:label>
			</th>
			<td class="col-input">
				<form:input path="geo_server_layers" cssClass="m" />
				<form:errors path="geo_server_layers" cssClass="error" />
			</td>
		</tr>
		<tr>
			<th class="col-label l" scope="row">
				<form:label path="geo_server_parameters_service">Parameters Service</form:label>
			</th>
			<td class="col-input">
				<form:input path="geo_server_parameters_service" cssClass="m" />
				<form:errors path="geo_server_parameters_service" cssClass="error" />
			</td>
		</tr>
		<tr>
			<th class="col-label l" scope="row">
				<form:label path="geo_server_parameters_version">Parameters Version</form:label>
			</th>
			<td class="col-input">
				<form:input path="geo_server_parameters_version" cssClass="m" />
				<form:errors path="geo_server_parameters_version" cssClass="error" />
			</td>
		</tr>
		<tr>
			<th class="col-label l" scope="row">
				<form:label path="geo_server_parameters_request">Parameters Request</form:label>
			</th>
			<td class="col-input">
				<form:input path="geo_server_parameters_request" cssClass="m" />
				<form:errors path="geo_server_parameters_request" cssClass="error" />
			</td>
		</tr>
		<tr>
			<th class="col-label l" scope="row">
				<form:label path="geo_server_parameters_transparent">Parameters Transparent</form:label>
			</th>
			<td class="col-input">
				<form:input path="geo_server_parameters_transparent" cssClass="m" />
				<form:errors path="geo_server_parameters_transparent" cssClass="error" />
			</td>
		</tr>
		<tr>
			<th class="col-label l" scope="row">
				<form:label path="geo_server_parameters_format">Parameters Format</form:label>
			</th>
			<td class="col-input">
				<form:input path="geo_server_parameters_format" cssClass="m" />
				<form:errors path="geo_server_parameters_format" cssClass="error" />
			</td>
		</tr>
	</table>
	<div class="button-group">
		<div class="center-buttons">
			<a href="#" onclick="updatePolicyGeoServer();" class="button">저장</a>
		</div>
	</div>
	</form:form>
</div>