<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglib.jsp" %>
<%@ include file="/WEB-INF/views/common/config.jsp" %>

<!DOCTYPE html>
<html lang="${accessibility}">
<head>
    <meta charset="utf-8">
    <title>Mago3D</title>
    <!--[if lt IE 9]>
    	<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    
	<script type="text/javascript" src="/externlib/${lang}/jquery/jquery.js"></script>
	<link href="https://fonts.googleapis.com/css?family=Noto+Sans" rel="stylesheet">
	<link rel="stylesheet" href="/css/${lang}/homepage-style.css"  type="text/css" />
	<script type="text/javascript" src="/js/analytics.js"></script>
	<script type="text/javascript" src="/js/${lang }/common.js"></script>
	<script type="text/javascript" src="/js/${lang }/message.js"></script>
</head>

<body>
	<nav class="nav">
		<div>
			<h1>mago3D</h1>
			<ul class="menu">
				<li><a href="/homepage/about.do">mago3D</a></li>
				<li><a href="/homepage/demo.do">Demo</a></li>
				<li><a href="/homepage/download.do">Download</a></li>
				<li><a href="/homepage/tutorials.do">Tutorials</a></li>
			</ul>
			<ul class="language">
				<li id="languageKO" class="on"><a href="#" onclick ="changeLanguage('ko');">KO</a></li>
				<li id="languageEN" ><a href="#" onclick ="changeLanguage('ko');">EN</a></li>
			</ul>
		</div>
	</nav>

	<section>
		<div class="contents">



			<div class="fullbox" style="opacity: 1; height: 1070.44px;">
			<iframe id="ytplayer" src="../images/ko/204.mov" muted="muted" title="" style="width: 100%; height: 1070.44px; margin-top: 0px; margin-left: 0px;" width="100%" height="100%" frameborder="0"></iframe>
			</div>
			<div class="pattern_bg" style="height: 1070.44px;"></div>



		</div>
	</section>

	<footer>
		<div>
			<h2>
				Contact
				<span></span>
			</h2>
			<p>
				Mago3d에 관심이 있는 고객님께서는 아래의 담당자 email, phone 또는 방문을 부탁 드립니다.
			</p>
			<ul class="contact">
				<li class="company">www.gaia3d.com</li>
				<li class="address">080 2 3397 3475</li>
				<li class="mail">mago3d@gaia3d.com</li>
			</ul>
			<p class="copyright">
				&copy; 2017. Mago3D all rights reserved.
			</p>
		</div>
	</footer>
	<!-- //FOOTER -->
</body>
</html>