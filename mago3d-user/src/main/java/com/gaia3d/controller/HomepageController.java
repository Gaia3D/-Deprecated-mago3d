package com.gaia3d.controller;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gaia3d.domain.CacheManager;
import com.gaia3d.domain.CommonCode;
import com.gaia3d.domain.DataGroup;
import com.gaia3d.domain.DataInfo;
import com.gaia3d.domain.Issue;
import com.gaia3d.domain.Pagination;
import com.gaia3d.domain.Policy;
import com.gaia3d.domain.SessionKey;
import com.gaia3d.domain.UserSession;
import com.gaia3d.service.DataService;
import com.gaia3d.service.IssueService;
import com.gaia3d.util.DateUtil;
import com.gaia3d.util.StringUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/homepage/")
public class HomepageController {
	
	@Autowired
	private IssueService issueService;
	@Autowired
	private DataService dataService;

	/**
	 * 메인
	 * @param model
	 * @return
	 */
	@GetMapping(value = "index.do")
	public String index(HttpServletRequest request, Model model) {
		String lang = null;
		lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		return "/homepage/" + lang + "/index";
	}
	
	/**
	 * 메인
	 * @param model
	 * @return
	 */
	@GetMapping(value = "about.do")
	public String about(HttpServletRequest request, Model model) {
		String lang = null;
		lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		log.info("@@ lang = {}", lang);
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		return "/homepage/" + lang + "/about";
	}
	
	/**
	 * 메인
	 * @param model
	 * @return
	 */
	
	@GetMapping(value = "news.do")
	public String news(HttpServletRequest request, Model model) {
		String lang = null;
		lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		log.info("@@ lang = {}", lang);
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		return "/homepage/" + lang + "/news";
	}	
	
	/**
	 * demo
	 * @param model
	 * @return
	 */
	@GetMapping(value = "demo.do")
	public String demo(HttpServletRequest request, HttpServletResponse response, 
			@RequestParam(defaultValue="1") String pageNo, @RequestParam(defaultValue="cesium") String viewLibrary, String device, Model model) throws Exception {
		
		log.info("@@ viewLibrary = {}", viewLibrary);
		String viewName = "cesium";
		String lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		
		Issue issue = new Issue();
		UserSession userSession = (UserSession)request.getSession().getAttribute(UserSession.KEY);
		if(userSession == null) {
			issue.setUser_id("guest");
			issue.setUser_name("guest");
		} else {
			issue.setUser_id(userSession.getUser_id());
			issue.setUser_name(userSession.getUser_name());
		}
		
		log.info("@@ issue = {}", issue);
		if(StringUtil.isNotEmpty(issue.getStart_date())) {
			issue.setStart_date(issue.getStart_date().substring(0, 8) + DateUtil.START_TIME);
		}
		if(StringUtil.isNotEmpty(issue.getEnd_date())) {
			issue.setEnd_date(issue.getEnd_date().substring(0, 8) + DateUtil.END_TIME);
		}
		long totalCount = issueService.getIssueTotalCountByUserId(issue);
		
		Pagination pagination = new Pagination(request.getRequestURI(), getSearchParameters(issue), totalCount, Long.valueOf(pageNo).longValue(), 10l);
		log.info("@@ pagination = {}", pagination);
		
		issue.setOffset(pagination.getOffset());
		issue.setLimit(pagination.getPageRows());
		List<Issue> issueList = new ArrayList<>();
		if(totalCount > 0l) {
			issueList = issueService.getListIssueByUserId(issue);
		}
		
		List<DataGroup> projectDataGroupList = CacheManager.getProjectDataGroupList();
		Map<String, Map<String, DataInfo>> dataGroupMap = CacheManager.getDataGroupMap();
		Policy policy = CacheManager.getPolicy();
		@SuppressWarnings("unchecked")
		List<CommonCode> issuePriorityList = (List<CommonCode>)CacheManager.getCommonCode(CommonCode.ISSUE_PRIORITY);
		@SuppressWarnings("unchecked")
		List<CommonCode> issueTypeList = (List<CommonCode>)CacheManager.getCommonCode(CommonCode.ISSUE_TYPE);
		
		boolean isMobile = isMobile(request);
		if(viewLibrary.equals("cesium")) {
			policy.setGeo_view_library("cesium");
			viewName = "cesium";
			if(!"pc".equals(device) && isMobile) {
				viewName = "cesium-mobile";
			}
		} else if(viewLibrary.equals("worldwind")) {
			policy.setGeo_view_library("worldwind");
			viewName = "worldwind";
			if(!"pc".equals(device) && isMobile) {
				viewName = "worldwind-mobile";
			}
		}
		
		ObjectMapper mapper = new ObjectMapper();
		
		model.addAttribute("issue", issue);
		model.addAttribute("now_latitude", policy.getGeo_init_latitude());
		model.addAttribute("now_longitude", policy.getGeo_init_longitude());
		model.addAttribute(pagination);
		model.addAttribute("totalCount", totalCount);
		model.addAttribute("issueList", issueList);
		model.addAttribute("projectDataGroupList", projectDataGroupList);
		model.addAttribute("dataGroupMap", mapper.writeValueAsString(dataGroupMap));
		model.addAttribute("cache_version", policy.getContent_cache_version());
		model.addAttribute("policyJson", mapper.writeValueAsString(policy));
		model.addAttribute("issuePriorityList", issuePriorityList);
		model.addAttribute("issueTypeList", issueTypeList);
		
		log.info("@@@@@@ policy = {}", mapper.writeValueAsString(policy));
		log.info("@@@@@@ dataGroupMap = {}", mapper.writeValueAsString(dataGroupMap));
		
//		response.setHeader("Pragma", "No-cache");
//		response.setHeader("Cache-Control", "No-cache");
//		response.setHeader("Expires", "1");

		return "/homepage/" + lang + "/" + viewName;
	}
	
	private boolean isMobile(HttpServletRequest request) { 
		String userAgent = request.getHeader("user-agent"); 
		boolean mobile1 = userAgent.matches(".*(iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson).*"); 
		boolean mobile2 = userAgent.matches(".*(LG|SAMSUNG|Samsung).*"); 
		if(mobile1 || mobile2) { 
			return true; 
		}
		return false;
	}
	
	/**
	 * 메인
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "ajax-list-issue.do", produces="application/json; charset=utf8")
	@ResponseBody
	public Map<String, Object> ajaxListIssue(HttpServletRequest request, Issue issue, @RequestParam(defaultValue="1") String pageNo) {
		
		Map<String, Object> jSONObject = new HashMap<String, Object>();
		String result = "success";
		try {
			UserSession userSession = (UserSession)request.getSession().getAttribute(UserSession.KEY);
			if(userSession == null) {
				issue.setUser_id("guest");
				issue.setUser_name("guest");
			} else {
				issue.setUser_id(userSession.getUser_id());
				issue.setUser_name(userSession.getUser_name());
			}
			
			log.info("@@ issue = {}", issue);
			if(StringUtil.isNotEmpty(issue.getStart_date())) {
				issue.setStart_date(issue.getStart_date().substring(0, 8) + DateUtil.START_TIME);
			}
			if(StringUtil.isNotEmpty(issue.getEnd_date())) {
				issue.setEnd_date(issue.getEnd_date().substring(0, 8) + DateUtil.END_TIME);
			}
			
			long totalCount = 0l;
			DataInfo dataInfo = null;
			if(DataInfo.DATA_NAME.equals(issue.getSearch_word())) {
				dataInfo = new DataInfo();
				dataInfo.setData_group_id(issue.getData_group_id());
				dataInfo.setSearch_word(issue.getSearch_word());
				dataInfo.setSearch_option(issue.getSearch_option());
				dataInfo.setSearch_value(issue.getSearch_value());
				dataInfo.setStart_date(issue.getStart_date());
				dataInfo.setEnd_date(issue.getEnd_date());
				dataInfo.setOrder_word(issue.getOrder_word());
				dataInfo.setOrder_value(issue.getOrder_value());
				dataInfo.setList_counter(issue.getList_counter());
				totalCount = dataService.getDataTotalCount(dataInfo);
			} else {
				totalCount = issueService.getIssueTotalCountByUserId(issue);
			}
			
			long pageRows = 10l;
			if(issue.getList_counter() != null && issue.getList_counter().longValue() > 0) pageRows = issue.getList_counter().longValue();
			Pagination pagination = new Pagination(request.getRequestURI(), getSearchParameters(issue), totalCount, Long.valueOf(pageNo).longValue(), pageRows);
			log.info("@@ pagination = {}", pagination);
			
			if(DataInfo.DATA_NAME.equals(issue.getSearch_word())) {
				dataInfo.setOffset(pagination.getOffset());
				dataInfo.setLimit(pagination.getPageRows());
				List<DataInfo> dataInfoList = new ArrayList<DataInfo>();
				if(totalCount > 0l) {
					dataInfoList = dataService.getListData(dataInfo);
				}
				jSONObject.put("dataInfoList", dataInfoList);
			} else {
				issue.setOffset(pagination.getOffset());
				issue.setLimit(pagination.getPageRows());
				List<Issue> issueList = new ArrayList<Issue>();
				if(totalCount > 0l) {
					issueList = issueService.getListIssueByUserId(issue);
				}
				jSONObject.put("issueList", issueList);
			}
			
			jSONObject.put("totalCount", totalCount);
		} catch(Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}
	
		jSONObject.put("result", result);
		return jSONObject;
	}
	
	/**
	 * 메인
	 * @param model
	 * @return
	 */
	@GetMapping(value = "download.do")
	public String download(HttpServletRequest request, Model model) {
		String lang = null;
		lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		return "/homepage/" + lang + "/download";
	}
	
	/**
	 * 메인
	 * @param model
	 * @return
	 */
	@GetMapping(value = "tutorials.do")
	public String tutorials(HttpServletRequest request, Model model) {
		String lang = null;
		lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		return "/homepage/" + lang + "/tutorials";
	}
	
	/**
	 * 메인
	 * @param model
	 * @return
	 */
	@GetMapping(value = "docs.do")
	public String doc(HttpServletRequest request, Model model) {
		String lang = null;
		lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		return "/homepage/" + lang + "/docs";
	}
	
	/**
	 * 
	 * @param request
	 * @param model
	 * @return
	 */
	@GetMapping(value = "api.do")
	public String api(HttpServletRequest request, Model model) {
		String lang = null;
		lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		return "/homepage/" + lang + "/api";
	}
	/**
	 * @param request
	 * @param model
	 * @return
	 */
	@GetMapping(value = "spec.do")
	public String Spec(HttpServletRequest request, Model model) {
		String lang = null;
		lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		return "/homepage/" + lang + "/spec";
	}
	
	/**
	 * @param request
	 * @param model
	 * @return
	 */
	@GetMapping(value = "faq.do")
	public String Faq(HttpServletRequest request, Model model) {
		String lang = null;
		lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		return "/homepage/" + lang + "/faq";
	}
	
	/**
	 * @param request
	 * @param model
	 * @return
	 */
	@GetMapping(value = "article1.do")
	public String article1(HttpServletRequest request, Model model) {
		String lang = null;
		lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		return "/homepage/" + lang + "/article1";
	}
	
	/**
	 * @param request
	 * @param model
	 * @return
	 */
	@GetMapping(value = "article2.do")
	public String article2(HttpServletRequest request, Model model) {
		String lang = null;
		lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		return "/homepage/" + lang + "/article2";
	}
	
	/**
	 * @param request
	 * @param model
	 * @return
	 */
	@GetMapping(value = "article3.do")
	public String article3(HttpServletRequest request, Model model) {
		String lang = null;
		lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		return "/homepage/" + lang + "/article3";
	}
	
	/**
	 * @param request
	 * @param model
	 * @return
	 */
	@GetMapping(value = "article4.do")
	public String article4(HttpServletRequest request, Model model) {
		String lang = null;
		lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		return "/homepage/" + lang + "/article4";
	}
	
	/**
	 * @param request
	 * @param model
	 * @return
	 */
	@GetMapping(value = "news-listview.do")
	public String newsListview(HttpServletRequest request, Model model) {
		String lang = null;
		lang = (String)request.getSession().getAttribute(SessionKey.LANG.name());
		if(lang == null || "".equals(lang)) {
			lang = "ko";
		}
		return "/homepage/" + lang + "/news-listview";
	}
	
	/**
	 * 언어 설정
	 * @param model
	 * @return
	 */
	@GetMapping(value = "ajax-change-language.do")
	@ResponseBody
	public Map<String, Object> ajaxChangeLanguage(HttpServletRequest request, @RequestParam("lang") String lang, Model model) {
		Map<String, Object> jSONObject = new HashMap<String, Object>();
		String result = "success";
		try {
			log.info("@@ lang = {}", lang);
			if(lang != null && !"".equals(lang) && ("ko".equals(lang) || "en".equals(lang))) {
				request.getSession().setAttribute(SessionKey.LANG.name(), lang);
			}
		} catch(Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}
	
		jSONObject.put("result", result);
		
		return jSONObject;
	}
	
	/**
	 * 검색 조건
	 * @param issue
	 * @return
	 */
	private String getSearchParameters(Issue issue) {
		StringBuilder builder = new StringBuilder(100);
		builder.append("&");
		builder.append("search_word=" + StringUtil.getDefaultValue(issue.getSearch_word()));
		builder.append("&");
		builder.append("search_option=" + StringUtil.getDefaultValue(issue.getSearch_option()));
		builder.append("&");
		try {
			builder.append("search_value=" + URLEncoder.encode(StringUtil.getDefaultValue(issue.getSearch_value()), "UTF-8"));
		} catch(Exception e) {
			e.printStackTrace();
			builder.append("search_value=");
		}
		builder.append("&");
		builder.append("start_date=" + StringUtil.getDefaultValue(issue.getStart_date()));
		builder.append("&");
		builder.append("end_date=" + StringUtil.getDefaultValue(issue.getEnd_date()));
		builder.append("&");
		builder.append("order_word=" + StringUtil.getDefaultValue(issue.getOrder_word()));
		builder.append("&");
		builder.append("order_value=" + StringUtil.getDefaultValue(issue.getOrder_value()));
		return builder.toString();
	}
	
	/**
	 * 목록 페이지 이동 검색 조건
	 * @param issue
	 * @return
	 */
	private String getListParameters(HttpServletRequest request) {
		StringBuilder builder = new StringBuilder(100);
		String pageNo = request.getParameter("pageNo");
		builder.append("pageNo=" + pageNo);
		builder.append("&");
		builder.append("search_word=" + StringUtil.getDefaultValue(request.getParameter("search_word")));
		builder.append("&");
		builder.append("search_option=" + StringUtil.getDefaultValue(request.getParameter("search_option")));
		builder.append("&");
		try {
			builder.append("search_value=" + URLEncoder.encode(StringUtil.getDefaultValue(request.getParameter("search_value")), "UTF-8"));
		} catch(Exception e) {
			e.printStackTrace();
			builder.append("search_value=");
		}
		builder.append("&");
		builder.append("start_date=" + StringUtil.getDefaultValue(request.getParameter("start_date")));
		builder.append("&");
		builder.append("end_date=" + StringUtil.getDefaultValue(request.getParameter("end_date")));
		builder.append("&");
		builder.append("order_word=" + StringUtil.getDefaultValue(request.getParameter("order_word")));
		builder.append("&");
		builder.append("order_value=" + StringUtil.getDefaultValue(request.getParameter("order_value")));
		return builder.toString();
	}
}
