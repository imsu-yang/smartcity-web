/*!
 * 공통 js 
 */
// viewport 
var windowWidth = window.screen.width
setViewPort(windowWidth);
function setViewPort(w_width) {
	if (w_width <= 640 ){
		$("meta[name=viewport]").attr("content", "width=640, maximum-scale=1.0, user-scalable=no, target-densitydpi=medium-dpi");
	} else {
		$("meta[name=viewport]").attr("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no");
	}
}
$(window).resize(function(){
	var windowWidth = window.screen.width
	setViewPort(windowWidth);
});

// gnb
$(document).ready(function(){
	var gnbHtml = $('#header .gnb').html();
	$('#m_menu .gnb').html(gnbHtml)
})


// 공통 js
$(window).load(function(){
	
	// 맨위로 가기 버튼
	$('#footer .top_btn').click(function(){
		if ( $('.wrap').hasClass('main')){ // fullpage 일경우
			fullpage_api.moveTo('01');
		} else{
			$('html, body').animate( { scrollTop : 0 }, 200 );
		}
	});
	// quick 버튼
	$('.quick_wrap .quick_btn').click(function(){
		$(this).toggleClass('on');
		$(this).prev().toggleClass('on');
	});
	// PC메뉴
	$('#header .gnb > ul > li > a').mouseenter(function(){
		$('#header .gnb').addClass('on');
		$('#header .gnb > ul > li ul.depth02').show();
	});
	$('#header .gnb').mouseleave(function(){
		$('#header .gnb').removeClass('on');
		$('#header .gnb > ul > li ul.depth02').hide();
	});
	// 모바일메뉴 
	$("#m_menu .gnb > ul > li > a").click(function(){
		var subcont = $(this).next("ul");

		if( subcont.is(":visible") ){ //닫을 때
			subcont.slideUp();
			$(this).parent().removeClass("on");
			$("#m_menu .gnb > ul > li ul").slideUp();
		}else{
			subcont.slideDown(); // 열릴 때						 
			$("#m_menu .gnb > ul > li > ul").not(subcont).slideUp();
			$("#m_menu .gnb > ul > li").not(this).removeClass("on");
			$(this).parent().addClass("on");
		}         
	});
	$('#header .m_menu_btn').click(function(){
		$("#m_menu_bg").fadeIn(200);
		$('#m_menu').delay(400).removeClass('off');
	});
	$('#m_menu_bg, #m_menu .x_btn').click(function(){
		$('#m_menu').addClass('off');
		$("#m_menu_bg").delay(200).fadeOut(200);
	});


	// 서브페이지 상단 sub_visual 공통
	$(".depth01 > p").click(function(){
		if ( $(this).parent().find(">ul").css("display") == "none" )
		{
			$(".depth02 > ul").stop().slideUp("fast");
			$(this).parent().find(">ul").slideDown("fast");
		}else{
			$(this).parent().find(">ul").slideUp("fast");
		}
	});
	$(".depth02 > p").click(function(){
		if ( $(this).parent().find(">ul").css("display") == "none" )
		{
			$(".depth01 > ul").stop().slideUp("fast");
			$(this).parent().find(">ul").slideDown("fast");
		}else{
			$(this).parent().find(">ul").slideUp("fast");
		}
	});
	
})


	