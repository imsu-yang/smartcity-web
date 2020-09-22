package co.kesti.smartcity.security.vo;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import lombok.Getter;
import lombok.Setter;

/**
 * 사용자 계정
 * @author atom
 * @since 2020.07.16
 */
public class UserAccount extends User {

    private static final long serialVersionUID = 1L;

    @Getter @Setter
    private Long mbrSeq;

    @Getter @Setter
    private String mbrId;

    @Getter @Setter
    private String userNm;

    @Getter @Setter
    private AccountVo account;

    public UserAccount(AccountVo account, Collection<? extends GrantedAuthority> authorities) {
        super(account.getMbrId(), account.getMbrPwd(), authorities);

        // 계정정보
        this.mbrSeq = account.getMbrSeq();
        this.mbrId  = account.getMbrId();
        this.userNm = account.getUserNm();
        this.setAccount(account);
    }

}
