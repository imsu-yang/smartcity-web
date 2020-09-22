package co.kesti.smartcity.controller.management;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 관리 > 이벤트 컨트롤러
 * @author atom
 * @since 2020.07.31
 */
@Controller
@RequestMapping("/management/event")
public class MangementEventController {

    /**
     * 이벤트 목록
     * @return
     */
    @GetMapping("/list")
    public String eventList() {
        return "management/event/eventList";
    }

    /**
     * 이벤트 쓰기
     * @return
     */
    @GetMapping("/write")
    public String eventWrite() {
        return "management/event/eventWrite";
    }

    /**
     * 이벤트 읽기
     * @return
     */
    @GetMapping("/read")
    public String eventRead() {
        return "management/event/eventRead";
    }

}
