package co.kesti.smartcity.security.service;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import co.kesti.smartcity.common.define.Define;
import co.kesti.smartcity.common.define.MemberType;
import co.kesti.smartcity.common.vo.ResultVo;
import co.kesti.smartcity.security.vo.AccountVo;
import co.kesti.smartcity.security.vo.UserAccount;
import lombok.extern.slf4j.Slf4j;

/**
 * 사용자 계정 서비스
 * @author atom
 * @since 2020.07.16
 */
@Service
@Slf4j
public class UserAccountService implements UserDetailsService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.url}")
    private String apiUrl;

    @Override
    public UserDetails loadUserByUsername(String mbrId) throws UsernameNotFoundException {
        log.debug(">>> mbrId : {}", mbrId);

        // header 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // 파라미터
        MultiValueMap<String, String> paramMap = new LinkedMultiValueMap<String, String>();
        paramMap.add("mbrId", mbrId);
        paramMap.add("pwdYn", Define.YES);

        // 엔티티
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<MultiValueMap<String, String>>(paramMap, headers);

        // 회원 정보 조회
        String reqUrl = apiUrl + "/api/member/selectMbrInfo";
        String jsonVal = restTemplate.postForObject(reqUrl, entity, String.class);

        // 결과값
        Gson gson = new Gson();
        Type resType = new TypeToken<ResultVo<AccountVo>>() {}.getType();
        ResultVo<AccountVo> resVo = gson.fromJson(jsonVal, resType);

        // log.debug(">>> resVo : {}", ToStringBuilder.reflectionToString(resVo, ToStringStyle.MULTI_LINE_STYLE).toString());

        if (resVo == null || !resVo.isStatus()) {
            throw new UsernameNotFoundException(mbrId + " is not found");
        }

        // 계정정보
        AccountVo account = resVo.getData();

        if (account == null) {
            throw new UsernameNotFoundException(mbrId + " is not found");
        }

        // log.debug(">>> user : {}", ToStringBuilder.reflectionToString(user, ToStringStyle.MULTI_LINE_STYLE).toString());

        // 권한 목록
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(MemberType.USER.getRoleCd()));

        // return new User(memId, pwd, authorities);

        // 커스텀 사용자 상세
        return new UserAccount(account, authorities);
    }

}
