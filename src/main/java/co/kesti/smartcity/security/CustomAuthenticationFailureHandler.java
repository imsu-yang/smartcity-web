package co.kesti.smartcity.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import co.kesti.smartcity.common.define.Define;
import co.kesti.smartcity.common.util.CommonUtil;
import co.kesti.smartcity.common.util.ResultUtil;
import co.kesti.smartcity.common.vo.ResultVo;
import lombok.extern.slf4j.Slf4j;

/**
 * 권한 실패 핸들러
 * @author atom
 * @since 2020.07.16
 */
@Slf4j
public class CustomAuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.url}")
    private String apiUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.debug(">>> UNAUTHORIZED : {}", exception.getMessage());

        // header 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // 파라미터
        MultiValueMap<String, String> paramMap = new LinkedMultiValueMap<String, String>();
        paramMap.add("mbrId", request.getParameter("username"));

        // 엔티티
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<MultiValueMap<String, String>>(paramMap, headers);

        // 로그인 실패 건수 더하기 수정
        String reqUrl = apiUrl + "/api/member/updateLognFailCntPlus";
        restTemplate.postForObject(reqUrl, entity, String.class);

        if (CommonUtil.isAjax(request)) {
            String errMsg = "가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.";
            ResultVo<String> resultVo = ResultUtil.fail(Define.INT_999, errMsg);
            Gson gson = new GsonBuilder().serializeNulls().create();

            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(Define.ContType.JSON);
            response.getWriter().write(gson.toJson(resultVo));
            response.getWriter().flush();
            response.getWriter().close();
        } else {
            response.sendRedirect("/login?error=true");
        }
    }

}
