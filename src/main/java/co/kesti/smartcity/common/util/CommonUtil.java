package co.kesti.smartcity.common.util;

import java.util.Random;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * 공통 유틸
 * @author atom
 * @since 2020.07.16
 */
@Slf4j
public class CommonUtil {

    /**
     * ajax 여부
     * @param request
     * @return
     */
    public static boolean isAjax(HttpServletRequest request) {
        String accept = request.getHeader("accept");
        String ajax = request.getHeader("X-Requested-With");

        log.debug("CommonUtil.isAjax => accept : {}, ajax : {}", accept, ajax);

        if (StringUtils.indexOf(accept, "json") > -1 && StringUtils.isNotBlank(ajax)) {
            return true;
        }

        return false;
    }

    /**
     * 랜덤키 구하기
     * @param cnt
     * @return
     */
    public static String getRandomKey(int cnt) {
        StringBuffer randKey = new StringBuffer();
        Random random = new Random();
        int randIdx = 0;
        int m = 0;

        for (m = 0; m < cnt; m++) {
            randIdx = random.nextInt(3);

            switch (randIdx) {
                case 0:
                    // a-z
                    randKey.append((char) ((int) (random.nextInt(26)) + 97));
                    break;
                case 1:
                    // A-Z
                    randKey.append((char) ((int) (random.nextInt(26)) + 65));
                    break;
                case 2:
                    // 0-9
                    randKey.append((random.nextInt(10)));
                    break;
            }
        }

        return randKey.toString();
    }

}
