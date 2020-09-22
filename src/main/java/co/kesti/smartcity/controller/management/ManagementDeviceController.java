package co.kesti.smartcity.controller.management;

import co.kesti.smartcity.model.request.RequestCmntPrdt;
import co.kesti.smartcity.model.request.RequestDevInfo;
import co.kesti.smartcity.model.response.ApiResponse;
import co.kesti.smartcity.service.HttpClientTemplate;
import co.kesti.smartcity.service.UploadManager;
import co.kesti.smartcity.util.JsonUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Slf4j
@RequiredArgsConstructor
@Controller
@RequestMapping("/management")
public class ManagementDeviceController {
    @Value("${api.url}")
    private String apiUrl;
    @Value("${vworld.key}")
    private String vworldKey;

    private final UploadManager uploadManager;
    private final HttpClientTemplate httpClientTemplate;

    /**
     * 디바이스 목록
     * list
     *
     * @return
     * @since 2020. 09. 16
     */
    @GetMapping("/device/list")
    public String list() {
        return "management/device/list";
    }

    /**
     * 디바이스 상세정보
     * read
     *
     * @return
     * @since 2020. 09. 16
     */
    @GetMapping("/device/read")
    public String read() {
        return "management/device/read";
    }

    /**
     * 디바이스 등록
     * write
     *
     * @return
     * @since 2020. 09. 16
     */
    @GetMapping("/device/write")
    public String write(Model model) {
        model.addAttribute("vworldKey", this.vworldKey);
        return "management/device/write";
    }

    @GetMapping("/device/connect")
    public String connect() {
        return "management/device/connect";
    }

    @RequestMapping(value = "/device/{mode}", method = RequestMethod.POST,  produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody()
    public ApiResponse createDevice(
            @PathVariable String mode,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            RequestDevInfo request) {

        if (imageFile != null) {
            String imagePath = uploadManager.uploadFile(imageFile, "management/device/image/");
            request.setDevImgPath(imagePath);
        }

        request.setGatewayConnId("GatewayTEST_ID");

        String url = StringUtils.join(apiUrl, "/api/management/device/", mode);
        return httpClientTemplate.post(url, request, ApiResponse.class);
    }
}