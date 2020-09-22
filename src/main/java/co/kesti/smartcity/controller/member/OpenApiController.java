package co.kesti.smartcity.controller.member;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Slf4j
@Controller
@RequestMapping("/open-api")
public class OpenApiController {


    /**
     * 오픈 api 신청
     */
    @GetMapping("/apply")
    public String openApi(HttpServletRequest request) {
        return "openapi/apply";
    }

}
