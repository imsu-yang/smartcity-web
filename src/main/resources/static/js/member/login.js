/**
 * Description : 회원 로그인
 * Author      : atom
 * Date        : 2020.07.16
 */
var memLognApp = new Vue({
    el: "#memberLogin",
    data: {
        mbrId: "",  //회원아이디
        mbrPwd: ""  //회원비밀번호
    },
    methods: {
        /**
         * 로그인 처리
         */
        procLogn: function() {
            if (WebUtil.isNull(this.mbrId)) {
                LayerUtil.alert({
                    msg: "아이디를 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("mbrId").focus();
                    }
                });
                return false;
            }

            if (WebUtil.isNull(this.mbrPwd)) {
                LayerUtil.alert({
                    msg: "비밀번호를 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("mbrPwd").focus();
                    }
                });
                return false;
            }

            // 로그인 처리
            AjaxUtil.post({
                url: "/member/login",
                param: {
                    username: this.mbrId,
                    password: this.mbrPwd
                },
                reqType: "url",
                success: function(response) {
                    if (WebUtil.isNotNull(response.data.prevUrl)) {
                        window.location.replace(response.data.prevUrl);
                    } else {
                        window.location.replace("/");
                    }
                }
            });
        }

        //임시 소스(운영 반영시 삭제 필요)
        ,procLognAdminPass: function() {
            AjaxUtil.post({
                url: "/member/login",
                param: {
                    username: "admin",
                    password: 1111
                },
                reqType: "url",
                success: function(response) {
                    if (WebUtil.isNotNull(response.data.prevUrl)) {
                        window.location.replace(response.data.prevUrl);
                    } else {
                        window.location.replace("/");
                    }
                }
            });
        }

        //임시 소스(운영 반영시 삭제 필요)
        ,procLognPersonPass: function() {
            AjaxUtil.post({
                url: "/member/login",
                param: {
                    username: "test004",
                    password: 1111
                },
                reqType: "url",
                success: function(response) {
                    if (WebUtil.isNotNull(response.data.prevUrl)) {
                        window.location.replace(response.data.prevUrl);
                    } else {
                        window.location.replace("/");
                    }
                }
            });
        }
    },
    mounted: function() {
        // 아이디 포커스
        DocUtil.getElId("mbrId").focus();
    }
});
