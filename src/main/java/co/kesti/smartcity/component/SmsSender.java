package co.kesti.smartcity.component;

import java.util.HashMap;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import co.kesti.smartcity.common.util.CommonUtil;
import co.kesti.smartcity.error.ApplicationException;
import co.kesti.smartcity.error.ResponseCode;
import lombok.extern.slf4j.Slf4j;
import net.nurigo.java_sdk.api.Message;
import net.nurigo.java_sdk.exceptions.CoolsmsException;

/**
 * SMS 발송
 * @author atom
 * @since 2020.08.10
 */
@Slf4j
@Component
public class SmsSender {

    @Value("${site.name}")
    private String siteName;

    @Value("${sms.api.key}")
    private String smsApiKey;

    @Value("${sms.api.secret}")
    private String smsApiSecret;

    @Value("${sms.from-tel-num}")
    private String smsFromTelNum;

    /**
     * 인증키 발송
     */
    public String sendAuthKey(String toTelNum) {
        // 인증키
        String authKey = CommonUtil.getRandomKey(10);

        // 내용
        String cont = "[" + siteName + "] 인증번호입니다.\n" + authKey;

        // cool sms 생성
        Message coolSms = new Message(smsApiKey, smsApiSecret);
        HashMap<String, String> params = new HashMap<String, String>();
        params.put("to", toTelNum);        // 수신번호
        params.put("from", smsFromTelNum); // 발신번호
        params.put("type", "SMS");         // Message type(SMS, LMS, MMS, ATA)
        params.put("text", cont);          // 문자내용
        params.put("app_version", "JAVA SDK v1.2");

        try {
            JSONObject obj = (JSONObject) coolSms.send(params);
            log.debug(">>> obj : {}", obj.toString());
        } catch (CoolsmsException e) {
            log.debug(">>> code : {}", e.getCode());
            log.debug(">>> message : {}", e.getMessage());
            throw new ApplicationException(ResponseCode.INTERNAL_SERVER_ERROR);
        }

        return authKey;
    }

}
