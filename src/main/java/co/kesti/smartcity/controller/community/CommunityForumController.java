package co.kesti.smartcity.controller.community;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import co.kesti.smartcity.common.util.ResultUtil;
import co.kesti.smartcity.common.vo.ResultVo;
import co.kesti.smartcity.error.ApplicationException;
import co.kesti.smartcity.error.ResponseCode;
import co.kesti.smartcity.service.UploadManager;
import co.kesti.smartcity.vo.CmntFrumVo;

/**
 * 커뮤니티 > 포럼 컨트롤러
 * @author atom
 * @since 2020.07.20
 */
@Controller
@RequestMapping("/community/forum")
public class CommunityForumController {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UploadManager uploadManager;

    @Value("${api.url}")
    private String apiUrl;

    /**
     * 포럼 소개
     * @return
     */
    @GetMapping("/intro")
    public String forumIntro() {
        return "community/forum/forumIntro";
    }

    /**
     * 포럼 목록
     * @return
     */
    @GetMapping("/list")
    public String forumList() {
        return "community/forum/forumList";
    }

    /**
     * 포럼 쓰기
     * @return
     */
    @GetMapping("/write")
    public String forumWrite() {
        return "community/forum/forumWrite";
    }

    /**
     * 포럼 읽기
     * @return
     */
    @GetMapping("/read")
    public String forumRead() {
        return "community/forum/forumRead";
    }

    /**
     * 포럼 저장
     * @param param
     * @param atchFile
     * @return
     */
    @ResponseBody
    @PostMapping(value = "/save")
    public ResultVo<?> forumSave(CmntFrumVo param, @RequestPart(value="atchFile", required=false) MultipartFile atchFile) {
        if (atchFile != null) {
            String atchPath = uploadManager.uploadFile(atchFile, "community/forum/image/");
            param.setAttachedFilePath(atchPath);
        }

        // header 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 엔티티
        HttpEntity<CmntFrumVo> entity = new HttpEntity<>(param, headers);

        // 포럼 저장
        String reqUrl = apiUrl + "/api/community/forum/saveFrum";
        ResultVo<?> resVo = restTemplate.postForObject(reqUrl, entity, ResultVo.class);

        if (resVo == null || !resVo.isStatus()) {
            throw new ApplicationException(ResponseCode.INTERNAL_SERVER_ERROR);
        }

        return ResultUtil.success();
    }

}
