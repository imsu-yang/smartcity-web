package co.kesti.smartcity.controller.community;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 커뮤니티 > 자료실 컨트롤러
 * @author atom
 * @since 2020.07.25
 */
@Controller
@RequestMapping("/community")
public class CommunityUploadController {

    /**
     * 자료실 목록
     * @return
     */
    @GetMapping("/upload/list")
    public String uploadList() {
        return "community/upload/uploadList";
    }

    /**
     * 자료실 상세
     * @return
     */
    @GetMapping("/upload/read")
    public String uploadRead() {
        return "community/upload/uploadRead";
    }

}
