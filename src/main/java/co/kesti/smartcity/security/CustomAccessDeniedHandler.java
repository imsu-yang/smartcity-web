package co.kesti.smartcity.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import co.kesti.smartcity.common.define.Define;
import co.kesti.smartcity.common.util.CommonUtil;
import co.kesti.smartcity.common.util.ResultUtil;
import co.kesti.smartcity.common.vo.ResultVo;
import lombok.extern.slf4j.Slf4j;

/**
 * 인증이 된 이후에 권한 상태에 대한 접근제어 핸들러
 * @author atom
 * @since 2020.07.16
 */
@Slf4j
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        log.debug(">>> FORBIDDEN : {}", accessDeniedException.getMessage());

        if (CommonUtil.isAjax(request)) {
            ResultVo<String> resultVo = ResultUtil.fail(Define.INT_999, "접근 권한이 없습니다.");
            Gson gson = new GsonBuilder().serializeNulls().create();

            response.setStatus(HttpStatus.FORBIDDEN.value());
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
