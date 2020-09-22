package co.kesti.smartcity.vo;

import co.kesti.smartcity.common.vo.BaseVo;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 회원 찾기 요청 VO
 */
@Data
@EqualsAndHashCode(callSuper=false)
public class ComMbrFindVo extends BaseVo {

    private static final long serialVersionUID = 1L;

    /* 회원Id */
    private String mbrId;

    /* 사용자명 */
    private String userNm;

    /* 이메일 */
    private String email;

    /* 전화번호 */
    private String mphonNo;

    /* 인증키 */
    private String authKey;

}
