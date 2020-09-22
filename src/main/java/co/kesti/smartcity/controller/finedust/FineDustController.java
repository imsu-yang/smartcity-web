package co.kesti.smartcity.controller.finedust;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 미세먼지 컨트롤러
 * @author atom
 * @since 2020.07.26
 */
@Controller
@RequestMapping("/finedust")
public class FineDustController {
    @Value("${vworld.key}")
    private String vworldKey;

    /**
     * 디바이스별 최신값 표출
     * @return
     */
    @GetMapping("/monitoring")
    public String forumIntro(Model model) {
        model.addAttribute("vworldKey", this.vworldKey);
        return "finedust/monitoring";
    }

    /**
     * 디바이스별 통계정보 표출
     * @return
     */
    @GetMapping("/statistics")
    public String forumList() {
        return "finedust/statistics";
    }

    /**
     * 디바이스 상태 정보 표출
     * @return
     */
    @GetMapping("/state")
    public String forumWrite() {
        return "finedust/state";
    }

}
