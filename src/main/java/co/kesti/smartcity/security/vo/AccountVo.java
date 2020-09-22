package co.kesti.smartcity.security.vo;

import co.kesti.smartcity.common.vo.BaseVo;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 계정 VO
 */
@Data
@EqualsAndHashCode(callSuper=false)
public class AccountVo extends BaseVo {

    private static final long serialVersionUID = 1L;

    /* 회원기본 회원일련번호 */
    private Long mbrSeq;

    /* 회원기본 회원아이디 */
    private String mbrId;

    /* 사용자명 */
    private String userNm;

    /* 비밀번호 */
    private String mbrPwd;

    /* 이메일 */
    private String email;

    /* 전화 번호 */
    private String mphonNo;

    /* 이메일 수신 여부 */
    private String emailRecptnYn;

    /* SMS 수신 여부 */
    private String smsRecptnYn;

    /* 회원 등급 */
    private String mbrClas;

    /* 사용자 토큰 */
    private String userTokn;

    /* 삭제 여부 */
    private String delYn;

    /* IP 주소 */
    private String ipAddress;

    /* 회원 비밀번호 신규 */
    private String mbrPwdNew;

    /* 비밀번호 변경일 */
    private String chgPwdDt;

    /* 임시 비밀번호 발급 여부 */
    private String tmpPwdIssYn;

    /* 비고 */
    private String rmark;

    /* 로그인 실패 횟수 */
    private Integer loginFailTmscnt;

}
