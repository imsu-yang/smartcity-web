package co.kesti.smartcity.controller.community;

import co.kesti.smartcity.common.vo.ResultVo;
import co.kesti.smartcity.model.request.RequestCmntPrdt;
import co.kesti.smartcity.model.response.ApiResponse;
import co.kesti.smartcity.service.HttpClientTemplate;
import co.kesti.smartcity.service.UploadManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Slf4j
@RequiredArgsConstructor
@Controller
@RequestMapping("/community")
public class CommunityProductController {

    @Value("${api.url}")
    private String apiUrl;

    private final UploadManager uploadManager;
    private final HttpClientTemplate httpClientTemplate;

    /**
     * 제품등록
     */
    @GetMapping("/product/write")
    public String write() {
        return "community/product/write";
    }

    /**
     * 제품 상세
     */
    @GetMapping("/product/read")
    public String read() {
        return "community/product/read";
    }


    /**
     * 제품소개
     */
    @GetMapping("/product/list")
    public String list() {
        return "community/product/list";
    }


    @RequestMapping(value = "/product", method = RequestMethod.POST,  produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody()
    public ApiResponse createProduct(MultipartHttpServletRequest req, RequestCmntPrdt request) {

        if (req.getMultiFileMap().containsKey("imageFile")) {
            String imagePath = uploadManager.uploadFile(req.getFile("imageFile"), "community/product/image/");
            request.setPrdtImgPath(imagePath);
        }

        if (req.getMultiFileMap().containsKey("attachedFile")) {
            String attachedFilePath = uploadManager.uploadFile(req.getFile("attachedFile"), "community/product/file/");
            request.setAttachedFilePath(attachedFilePath);
        }

        String url = StringUtils.join(apiUrl, "/api/community/product");
        return httpClientTemplate.post(url, request, ApiResponse.class);
    }

}
