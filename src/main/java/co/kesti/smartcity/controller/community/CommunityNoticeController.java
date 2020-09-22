package co.kesti.smartcity.controller.community;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 커뮤니티 > 공지사항 컨트롤러
 * @author atom
 * @since 2020.07.16
 */
@Controller
@RequestMapping("/community")
public class CommunityNoticeController {

    /**
     * 공지사항 목록
     * @return
     */
    @GetMapping("/notice/list")
    public String noticeList() {
        return "community/notice/noticeList";
    }

    /**
     * 공지사항 상세
     * @return
     */
    @GetMapping("/notice/read")
    public String noticeRead() {
        return "community/notice/noticeRead";
    }

}
