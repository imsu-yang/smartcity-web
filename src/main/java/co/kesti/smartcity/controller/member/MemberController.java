package co.kesti.smartcity.controller.member;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import co.kesti.smartcity.common.define.Define;
import lombok.extern.slf4j.Slf4j;

/**
 * 회원 컨트롤러
 * @author atom
 * @since 2020.07.16
 */
@Slf4j
@Controller
@RequestMapping("/member")
public class MemberController {

    /**
     * 로그인
     * @return
     */
    @GetMapping("/login")
    public String login(HttpServletRequest request) {
        String uri = request.getHeader("referer");

        if (StringUtils.isNotBlank(uri) && !uri.contains("/member/login")) {
            request.getSession().setAttribute("prevPage", uri);
        }

        return "member/login";
    }

    /**
     * 아이디 찾기
     * @return
     */
    @GetMapping("/idFind")
    public String idFind(HttpServletRequest request) {
        // 세션
        HttpSession session = request.getSession();

        // 세션 인증ID 제거
        if (session.getAttribute(Define.MBR_FIND_AUTH_ID) != null) {
            session.removeAttribute(Define.MBR_FIND_AUTH_ID);
        }

        // 세션 인증키 제거
        if (session.getAttribute(Define.MBR_FIND_AUTH_KEY) != null) {
            session.removeAttribute(Define.MBR_FIND_AUTH_KEY);
        }

        return "member/idFind";
    }

    /**
     * 비밀번호 찾기
     * @return
     */
    @GetMapping("/passwordFind")
    public String passwordFind(HttpServletRequest request) {
        // 세션
        HttpSession session = request.getSession();

        // 세션 인증ID 제거
        if (session.getAttribute(Define.MBR_FIND_AUTH_ID) != null) {
            session.removeAttribute(Define.MBR_FIND_AUTH_ID);
        }

        // 세션 인증키 제거
        if (session.getAttribute(Define.MBR_FIND_AUTH_KEY) != null) {
            session.removeAttribute(Define.MBR_FIND_AUTH_KEY);
        }

        return "member/passwordFind";
    }

    /**
     * 비밀번호 재설정
     * @return
     */
    @GetMapping("/passwordReset")
    public String passwordReset(HttpServletRequest request) {
        // 세션
        HttpSession session = request.getSession();

        // 세션 인증ID
        String mbrFindAuthId = (String) session.getAttribute(Define.MBR_FIND_AUTH_ID);

        // 세션 인증키
        String mbrFindAuthKey = (String) session.getAttribute(Define.MBR_FIND_AUTH_KEY);

        log.debug(">>> mbrFindAuthId  : {}", mbrFindAuthId);
        log.debug(">>> mbrFindAuthKey : {}", mbrFindAuthKey);

        // 세션 인증 체크
        if (StringUtils.isBlank(mbrFindAuthId) || StringUtils.isBlank(mbrFindAuthKey)) {
            return "redirect:/member/login";
        }

        return "member/passwordReset";
    }

    /**
     * 회원 가입
     * @return
     */
    @GetMapping("/join")
    public String join() {
        return "member/join";
    }

    /**
     * 회원 등록
     * @return
     */
    @GetMapping("/write")
    public String write() {
        return "member/write";
    }


}
