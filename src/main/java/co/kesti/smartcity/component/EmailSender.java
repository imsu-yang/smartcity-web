package co.kesti.smartcity.component;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import co.kesti.smartcity.common.util.CommonUtil;
import co.kesti.smartcity.error.ApplicationException;
import co.kesti.smartcity.error.ResponseCode;

/**
 * 이메일 발송
 * @author atom
 * @since 2020.08.08
 */
@Component
public class EmailSender {

    @Value("${site.name}")
    private String siteName;

    @Value("${mail.host}")
    private String mailHost;

    @Value("${mail.port}")
    private int mailPort;

    @Value("${mail.user}")
    private String mailUser;

    @Value("${mail.name}")
    private String mailName;

    @Value("${mail.password}")
    private String mailPwd;

    /**
     * 인증키 발송
     */
    public String sendAuthKey(String toEmail) {
        // 인증키
        String authKey = CommonUtil.getRandomKey(10);

        // SMTP 서버 정보 설정
        Properties props = new Properties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.host", mailHost);
        props.put("mail.smtp.port", mailPort);
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.enable", "true");
        // props.put("mail.debug", "true");

        // 세션
        Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(mailUser, mailPwd);
            }
        });

        try {
            // 타이틀
            String tit = "[" + siteName + "] 인증번호입니다.";

            // 내용
            String cont = "인증번호 : " + authKey;

            // 메일 정보
            MimeMessage msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(mailUser, mailName));
            msg.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
            msg.setSubject(tit);
            msg.setContent(cont, "text/html; charset=utf-8");

            // 메일 발송
            Transport.send(msg);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ApplicationException(ResponseCode.INTERNAL_SERVER_ERROR);
        }

        return authKey;
    }

}
