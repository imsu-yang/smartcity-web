package co.kesti.smartcity.common.define;

/**
 * 회원 유형
 */
public enum MemberType {

    USER("ROLE_USER", "정회원"),
    ADMIN("ROLE_ADMIN", "관리자");

    private String roleCd;
    private String roleNm;

    MemberType(String roleCd, String roleNm) {
        this.roleCd = roleCd;
        this.roleNm = roleNm;
    }

    public String getRoleCd(){
        return this.roleCd;
    }

    public String getRoleNm(){
        return this.roleNm;
    }

}
