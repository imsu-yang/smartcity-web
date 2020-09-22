package co.kesti.smartcity.controller.member;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 마이페이지 컨트롤러
 * @author atom
 * @since 2020.07.18
 */
@Controller
@RequestMapping("/mypage")
public class MypageController {

    /**
     * 회원 정보
     * @return
     */
    @GetMapping("/edit")
    public String edit() {
        return "mypage/edit";
    }

    /**
     * 회원 탈퇴
     * @return
     */
    @GetMapping("/withdraw")
    public String withdraw() {
        return "mypage/withdraw";
    }


    /**
     * 신청 현황
     */
    @GetMapping("/status/list")
    public String statusList() {
        return "mypage/status/list";
    }

    /**
     * 신청 내용
     */
    @GetMapping("/status/read")
    public String statusRead() {
        return "mypage/status/read";
    }

    /**
     * 나의 작성글
     */
    @GetMapping("/mywrite/list")
    public String myWriteList() {
        return "mypage/mywrite/list";
    }

    /**
     * 나의 디바이스
     */
    @GetMapping("/mydevice/list")
    public String myDeviceList() { return "mypage/mydevice/list"; }
}
