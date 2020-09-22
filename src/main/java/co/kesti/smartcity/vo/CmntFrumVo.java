package co.kesti.smartcity.vo;

import co.kesti.smartcity.common.vo.BaseVo;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 커뮤니티 > 포럼 VO
 */
@Data
@EqualsAndHashCode(callSuper=false)
public class CmntFrumVo extends BaseVo {

    private static final long serialVersionUID = 1L;

    /* 포럼그룹일련번호 */
    private Long forumGroupSeq;

    /* 포럼일련번호 */
    private Long forumSeq;

    /* 포럼주제 */
    private String forumTitle;

    /* 포럼내용 */
    private String forumContents;

    /* 첨부파일경로 */
    private String attachedFilePath;

    /* 회원ID */
    private String mbrId;

    /* 관리자여부 */
    private Boolean admYn = false;

}
