package co.kesti.smartcity.controller.testbed;

import groovyjarjarpicocli.CommandLine;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@Controller
@RequestMapping("/testbed")
public class TestbedController {

    /**
     * 테스트배드 신청하기
     * write
     *
     * @return
     * @since 2020. 09. 16
     */
    @GetMapping("/write")
    public String write() {
        return "testbed/write";
    }

    /**
     * 테스트베드 소개
     * intro
     *
     * @param req HttpRequest
     * @param res HttpResponse
     * @return
     * @since 2020. 09. 16
     */
   @GetMapping("/intro")
    public String intro(HttpServletResponse res, HttpServletRequest req, Model model) {
        String gbn = req.getParameter("gbn");
        model.addAttribute("gbn", gbn);
        return "testbed/intro";
    }

    /**
     * 테스트베드 신청 프로세스
     * process
     *
     * @return
     * @since 2020. 09. 16
     */
    @GetMapping("/process")
    public String process() { return "testbed/process"; }
}