package co.kesti.smartcity.controller.member;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import co.kesti.smartcity.common.define.Define;
import co.kesti.smartcity.common.util.ResultUtil;
import co.kesti.smartcity.common.vo.ResultVo;
import co.kesti.smartcity.component.ApiRestTemplate;
import co.kesti.smartcity.component.EmailSender;
import co.kesti.smartcity.component.SmsSender;
import co.kesti.smartcity.error.ApplicationException;
import co.kesti.smartcity.error.ResponseCode;
import co.kesti.smartcity.error.UserException;
import co.kesti.smartcity.security.vo.UserAccount;
import co.kesti.smartcity.vo.ComMbrFindVo;
import lombok.extern.slf4j.Slf4j;

/**
 * 회원 REST 컨트롤러
 * @author atom
 * @since 2020.07.20
 */
@Slf4j
@RestController
public class MemberRestController {

    @Autowired
    private ApiRestTemplate apiRestTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailSender emailSender;

    @Autowired
    private SmsSender smsSender;

    /**
     * 탈퇴 처리
     * @param mbrPwd
     * @param user
     * @return
     */
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/mypage/rest/procWithDraw")
    public ResultVo<?> procWithDraw(@RequestParam(value="mbrPwd", required=true) String mbrPwd, @AuthenticationPrincipal UserAccount user) {
        // 권한 체크
        if (user == null) {
            throw new UserException("회원정보가 존재하지 않습니다.");
        }

        // 비밀번호 체크
        if (!passwordEncoder.matches(mbrPwd, user.getAccount().getMbrPwd())) {
            throw new UserException("비밀번호가 일치하지 않습니다.");
        }

        // 파라미터
        MultiValueMap<String, Object> paramMap = new LinkedMultiValueMap<String, Object>();
        paramMap.add("mbrSeq", user.getMbrSeq());
        paramMap.add("mbrId", user.getMbrId());

        // 삭제 처리
        ResultVo<String> resVo = apiRestTemplate.post("/api/member/deleteMbr", paramMap, String.class);

        if (resVo == null || !resVo.isStatus()) {
            throw new UserException("처리 중 에러가 발생했습니다.");
        }

        return ResultUtil.success();
    }

    /**
     * 메일 인증키 발송
     * @param userNm
     * @param email
     * @return
     */
    @PostMapping("/member/rest/sendMailAuthKey")
    public ResultVo<?> sendMailAuthKey(ComMbrFindVo param, HttpServletRequest request) {
        // 파라미터
        MultiValueMap<String, Object> paramMap = new LinkedMultiValueMap<String, Object>();
        paramMap.add("mbrId", param.getMbrId());
        paramMap.add("userNm", param.getUserNm());
        paramMap.add("email", param.getEmail());

        // 회원 체크 여부 조회
        ResultVo<Boolean> resVo = apiRestTemplate.post("/api/member/selectMbrChkYn", paramMap, Boolean.class);

        // 메일 발송
        if (resVo != null && resVo.isStatus()) {
            // 회원체크여부
            Boolean mbrChkYn = resVo.getData();

            if (mbrChkYn) {
                String authKey = emailSender.sendAuthKey(param.getEmail());
                log.debug(">>> authKey : {}", authKey);

                // 세션 인증키 설정
                HttpSession session = request.getSession();
                session.setAttribute(Define.MBR_FIND_AUTH_KEY, authKey);
            }
        }

        return ResultUtil.success();
    }

    /**
     * SMS 인증키 발송
     * @param userNm
     * @param mphonNo
     * @return
     */
    @PostMapping("/member/rest/sendSmsAuthKey")
    public ResultVo<?> sendSmsAuthKey(ComMbrFindVo param, HttpServletRequest request) {
        // 파라미터
        MultiValueMap<String, Object> paramMap = new LinkedMultiValueMap<String, Object>();
        paramMap.add("mbrId", param.getMbrId());
        paramMap.add("userNm", param.getUserNm());
        paramMap.add("mphonNo", param.getMphonNo());

        // 회원 체크 여부 조회
        ResultVo<Boolean> resVo = apiRestTemplate.post("/api/member/selectMbrChkYn", paramMap, Boolean.class);

        // SMS 발송
        if (resVo != null && resVo.isStatus()) {
            // 회원체크여부
            Boolean mbrChkYn = resVo.getData();

            if (mbrChkYn) {
                String authKey = smsSender.sendAuthKey(param.getMphonNo());
                log.debug(">>> authKey : {}", authKey);

                // 세션 인증키 설정
                HttpSession session = request.getSession();
                session.setAttribute(Define.MBR_FIND_AUTH_KEY, authKey);
            }
        }

        return ResultUtil.success();
    }

    /**
     * 회원 아이디 찾기
     * @param param
     * @return
     */
    @PostMapping("/member/rest/findMbrId")
    public ResultVo<?> findMbrId(ComMbrFindVo param, HttpServletRequest request) {
        // 세션
        HttpSession session = request.getSession();

        // 세션 인증키
        String mbrFindAuthKey = (String) session.getAttribute(Define.MBR_FIND_AUTH_KEY);
        log.debug(">>> mbrFindAuthKey : {}", mbrFindAuthKey);

        if (mbrFindAuthKey == null) {
            throw new UserException("올바른 인증번호를 입력해주세요.");
        }

        // 인증키 체크
        if (!mbrFindAuthKey.equals(param.getAuthKey())) {
            throw new UserException("올바른 인증번호를 입력해주세요.");
        }

        // 파라미터
        MultiValueMap<String, Object> paramMap = new LinkedMultiValueMap<String, Object>();
        paramMap.add("userNm", param.getUserNm());
        paramMap.add("email",  param.getEmail());
        paramMap.add("mphonNo", param.getMphonNo());

        // 회원 아이디 찾기
        ResultVo<String> resVo = apiRestTemplate.post("/api/member/findMbrId", paramMap, String.class);

        if (resVo == null || !resVo.isStatus()) {
            throw new UserException("회원정보가 존재하지 않습니다.");
        }

        // 회원ID
        String mbrId = resVo.getData();
        log.debug(">>> mbrId : {}", mbrId);

        // 세션 인증키 제거
        session.removeAttribute(Define.MBR_FIND_AUTH_KEY);

        return ResultUtil.success(mbrId);
    }

    /**
     * 회원 비밀번호 찾기
     * @param param
     * @return
     */
    @PostMapping("/member/rest/findMbrPwd")
    public ResultVo<?> findMbrPwd(ComMbrFindVo param, HttpServletRequest request) {
        // 세션
        HttpSession session = request.getSession();

        // 세션 인증키
        String mbrFindAuthKey = (String) session.getAttribute(Define.MBR_FIND_AUTH_KEY);
        log.debug(">>> mbrFindAuthKey : {}", mbrFindAuthKey);

        if (mbrFindAuthKey == null) {
            throw new UserException("올바른 인증번호를 입력해주세요.");
        }

        // 인증키 체크
        if (!mbrFindAuthKey.equals(param.getAuthKey())) {
            throw new UserException("올바른 인증번호를 입력해주세요.");
        }

        // 파라미터
        MultiValueMap<String, Object> paramMap = new LinkedMultiValueMap<String, Object>();
        paramMap.add("mbrId", param.getMbrId());
        paramMap.add("userNm", param.getUserNm());
        paramMap.add("email",  param.getEmail());
        paramMap.add("mphonNo", param.getMphonNo());
        paramMap.add("authKey", mbrFindAuthKey);

        // 회원 비밀번호 찾기
        ResultVo<String> resVo = apiRestTemplate.post("/api/member/findMbrPwd", paramMap, String.class);

        if (resVo == null || !resVo.isStatus()) {
            throw new UserException("회원정보가 존재하지 않습니다.");
        }

        // 회원ID
        String mbrId = resVo.getData();
        log.debug(">>> mbrId : {}", mbrId);

        // 세션 인증ID 설정
        session.setAttribute(Define.MBR_FIND_AUTH_ID, mbrId);

        return ResultUtil.success();
    }

    /**
     * 비밀번호 재설정 처리
     * @param userNm
     * @param mphonNo
     * @return
     */
    @PostMapping("/member/rest/procPwdRst")
    public ResultVo<?> procPwdRst(@RequestParam(value="mbrPwd", required=true) String mbrPwd, HttpServletRequest request) {
        // 세션
        HttpSession session = request.getSession();

        // 세션 인증ID
        String mbrFindAuthId = (String) session.getAttribute(Define.MBR_FIND_AUTH_ID);

        // 세션 인증키
        String mbrFindAuthKey = (String) session.getAttribute(Define.MBR_FIND_AUTH_KEY);

        log.debug(">>> mbrFindAuthId : {}", mbrFindAuthId);
        log.debug(">>> mbrFindAuthKey : {}", mbrFindAuthKey);

        if (StringUtils.isBlank(mbrFindAuthId) || StringUtils.isBlank(mbrFindAuthKey)) {
            throw new UserException("올바른 접근이 아닙니다.");
        }

        // 파라미터
        MultiValueMap<String, Object> paramMap = new LinkedMultiValueMap<String, Object>();
        paramMap.add("mbrId", mbrFindAuthId);
        paramMap.add("mbrPwd", mbrPwd);
        paramMap.add("authKey", mbrFindAuthKey);

        // 회원 비밀번호 수정
        ResultVo<String> resVo = apiRestTemplate.post("/api/member/updateMbrPwd", paramMap, String.class);

        if (resVo == null || !resVo.isStatus()) {
            throw new ApplicationException(ResponseCode.INTERNAL_SERVER_ERROR);
        }

        // 세션 인증 제거
        session.removeAttribute(Define.MBR_FIND_AUTH_ID);
        session.removeAttribute(Define.MBR_FIND_AUTH_KEY);

        return ResultUtil.success();
    }

}
