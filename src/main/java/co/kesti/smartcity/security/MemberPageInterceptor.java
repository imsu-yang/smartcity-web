package co.kesti.smartcity.security;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import lombok.extern.slf4j.Slf4j;

/**
 * 회원 페이지 인터셉터
 */
@Slf4j
public class MemberPageInterceptor extends HandlerInterceptorAdapter {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        String reqUrl = request.getRequestURI();
        log.debug(">>> reqUrl : {}", reqUrl);

        // 홈으로 리다이렉트
        if (StringUtils.indexOf(reqUrl, "/member") > -1 && isAuthenticated()) {
            response.sendRedirect(request.getContextPath() + "/");

            return false;
        }

        return true;
    }

    /**
     * 권한 체크
     */
    private boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || AnonymousAuthenticationToken.class.isAssignableFrom(authentication.getClass())) {
            return false;
        }

        return authentication.isAuthenticated();
    }

}
