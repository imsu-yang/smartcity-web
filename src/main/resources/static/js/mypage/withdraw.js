/**
 * Description : 회원 탈퇴
 * Author      : atom
 * Date        : 2020.07.18
 */
var mypageWithDrawApp = new Vue({
    el: "#mypageWithDraw",
    data: {
        // 회원비밀번호
        mbrPwd: ""
    },
    methods: {
        /**
         * 탈퇴 처리
         */
        procWithDraw: function() {
            var $this = this;

            if (WebUtil.isNull(this.mbrPwd)) {
                LayerUtil.alert({
                    msg: "비밀번호를 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("mbrPwd").focus();
                    }
                });
                return false;
            }

            LayerUtil.confirm({
                msg: "탈퇴하시겠습니까?",
                callback: function(resYn) {
                    if (resYn) {
                        AjaxUtil.post({
                            url: "/mypage/rest/procWithDraw",
                            param: { mbrPwd: $this.mbrPwd },
                            reqType: "url",
                            success: function(response) {
                                window.location.href = "/logout";
                            }
                        });
                    }
                }
            });
        }
    },
    mounted: function() {
    }
});
