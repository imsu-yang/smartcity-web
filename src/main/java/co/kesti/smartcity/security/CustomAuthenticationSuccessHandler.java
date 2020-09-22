package co.kesti.smartcity.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import co.kesti.smartcity.common.define.Define;
import co.kesti.smartcity.common.util.CommonUtil;
import co.kesti.smartcity.common.util.ResultUtil;
import co.kesti.smartcity.common.vo.ResultVo;
import co.kesti.smartcity.security.vo.UserAccount;
import lombok.extern.slf4j.Slf4j;

/**
 * 권한 성공 핸들러
 * @author atom
 * @since 2020.07.16
 */
@Slf4j
public class CustomAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.url}")
    private String apiUrl;

    @Value("${server.session.timeout}")
    private Integer maxInactiveInterval;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // 세션 정보
        UserAccount user = (UserAccount) authentication.getPrincipal();

        log.debug(">>> mbrId : {}", user.getMbrId());

        // header 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // 파라미터
        MultiValueMap<String, Object> paramMap = new LinkedMultiValueMap<String, Object>();
        paramMap.add("mbrSeq", user.getMbrSeq());
        paramMap.add("mbrId",  user.getMbrId());

        // 엔티티
        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<MultiValueMap<String, Object>>(paramMap, headers);

        // 로그인 실패 건수 초기화 수정
        String reqUrl = apiUrl + "/api/member/updateLognFailCntReset";
        restTemplate.postForObject(reqUrl, entity, String.class);

        // 세션 타임아웃 설정
        request.getSession().setMaxInactiveInterval(maxInactiveInterval);

        // 로그인 버튼 눌러 접속했을 경우
        String prevPage = (String) request.getSession().getAttribute("prevPage");

        if (prevPage != null) {
            request.getSession().removeAttribute("prevPage");
        }

        // 강제 인터셉트 했을 경우 - Security가 요청을 가로챈 경우 사용자가 원래 요청했던 URI 정보를 저장한 객체
        RequestCache requestCache = new HttpSessionRequestCache();
        SavedRequest savedRequest = requestCache.getRequest(request, response);
        String prevUrl = "";

        if (savedRequest != null) {
            prevUrl = savedRequest.getRedirectUrl();

            // 세션에 저장된 객체 제거
            requestCache.removeRequest(request, response);

            log.debug(">>> 1. prevUrl : {}", prevUrl);

        } else if (StringUtils.isNotBlank(prevPage)) {
            prevUrl = prevPage;

            log.debug(">>> 2. prevUrl : {}", prevUrl);
        }

        if (CommonUtil.isAjax(request)) {
            // 인증 세션 에러 초기화
            clearAuthenticationAttributes(request);

            // 결과값 설정
            Map<String, String> resultMap = new HashMap<>();
            resultMap.put("prevUrl", prevUrl);

            // JSON 결과값
            ResultVo<Map<String, String>> resultVo = ResultUtil.success(resultMap);
            Gson gson = new GsonBuilder().serializeNulls().create();

            response.setStatus(HttpStatus.OK.value());
            response.setContentType(Define.ContType.JSON);
            response.getWriter().write(gson.toJson(resultVo));
            response.getWriter().flush();
            response.getWriter().close();
        } else {
            super.onAuthenticationSuccess(request, response, authentication);
            // response.sendRedirect(prevUrl);
        }
    }
}
