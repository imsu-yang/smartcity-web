package co.kesti.smartcity.controller;

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
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Slf4j
@RequiredArgsConstructor
@Controller
@RequestMapping("/")
public class HomeController {
    @Value("${vworld.key}")
    private String vworldKey;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("vworldKey", this.vworldKey);
        return "home/index";
    }
}