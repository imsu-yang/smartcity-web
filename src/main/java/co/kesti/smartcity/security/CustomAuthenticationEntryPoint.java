package co.kesti.smartcity.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import co.kesti.smartcity.common.define.Define;
import co.kesti.smartcity.common.util.CommonUtil;
import co.kesti.smartcity.common.util.ResultUtil;
import co.kesti.smartcity.common.vo.ResultVo;
import lombok.extern.slf4j.Slf4j;

/**
 * 인증되기 전 권한 상태에 대한 접근제어 핸들러
 * @author atom
 * @since 2020.08.05
 */
@Slf4j
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        log.debug(">>> UNAUTHORIZED : {}", authException.getMessage());

        if (CommonUtil.isAjax(request)) {
            ResultVo<String> resultVo = ResultUtil.fail(Define.INT_999, "접근 권한이 없습니다.");
            Gson gson = new GsonBuilder().serializeNulls().create();

            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(Define.ContType.JSON);
            response.getWriter().write(gson.toJson(resultVo));
            response.getWriter().flush();
            response.getWriter().close();
        } else {
            // String requestUri = request.getRequestURI();
            String url = request.getContextPath() + "/member/login";

            response.sendRedirect(url);
        }
    }

}
