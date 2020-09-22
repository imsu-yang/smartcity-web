/**
 * Description : 자료실 상세
 * Author      : atom
 * Date        : 2020.07.25
 */
var upldReadApp = new Vue({
    el: "#uploadRead",
    data: {
        // 아규먼트정보
        argVo: {
            uploadSeq: null,
            curPage: null,
            schTpCd: null,
            schKwd: null
        },

        // 회원아이디
        mbrId: "",

        // 자료실정보
        upldVo: {}
    },
    methods: {
        /**
         * 페이지 초기화
         */
        initPage: function() {
            // 자료실 정보 조회
            this.selectUpldInfo();
        },

        // 아규먼트 초기화
        initArg: function() {
            this.argVo.uploadSeq = WebUtil.nvl(DocUtil.getElId("argUploadSeq").value, null);
            this.argVo.curPage   = WebUtil.nvl(DocUtil.getElId("argCurPage").value, "");
            this.argVo.schTpCd   = WebUtil.nvl(DocUtil.getElId("argSchTpCd").value, "");
            this.argVo.schKwd    = WebUtil.nvl(DocUtil.getElId("argSchKwd").value, "");

            // 회원아이디
            this.mbrId = SessionUtil.getMbrId();
        },

        /**
         * 자료실 정보 조회
         */
        selectUpldInfo: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/community/upload/selectUpldReadInfo",
                param: {
                    uploadSeq: this.argVo.uploadSeq,
                    mbrId: this.mbrId
                },
                success: function(response) {
                    $this.upldVo = response.data;
                },
                error: function(msg) {
                    LayerUtil.alert({
                        msg: msg,
                        callback: function() {
                            $this.onUpldListMove();
                        }
                    });
                }
            });
        },

        /**
         * 파라미터 구하기
         */
        getParam: function() {
            var result = "";

            if (WebUtil.isNotNull(this.argVo.curPage)) {
                result += "&curPage=" + this.argVo.curPage;
            }

            if (WebUtil.isNotNull(this.argVo.schTpCd)) {
                result += "&schTpCd=" + this.argVo.schTpCd;
            }

            if (WebUtil.isNotNull(this.argVo.schKwd)) {
                result += "&schKwd=" + encodeURIComponent(this.argVo.schKwd);
            }

            if (WebUtil.isNotNull(result) && result.charAt(0) == "&") {
                result = "?" + result.substring(1);
            }

            return result;
        },

        /**
         * 자료실 목록 이동
         */
        onUpldListMove: function() {
            window.location.href = "/community/upload/list" + this.getParam();
        },

        /**
         * 이전 자료실 이동
         */
        onUpldPrevMove: function() {
            if (WebUtil.isNotNull(this.upldVo.prevSeq)) {
                window.location.href = "/community/upload/read?uploadSeq=" + this.upldVo.prevSeq;
            }
        },

        /**
         * 다음 자료실 이동
         */
        onUpldNextMove: function() {
            if (WebUtil.isNotNull(this.upldVo.nextSeq)) {
                window.location.href = "/community/upload/read?uploadSeq=" + this.upldVo.nextSeq;
            }
        }
    },
    mounted: function() {
        // 아규먼트 초기화
        this.initArg();

        // 페이지 초기화
        this.initPage();
    }
});
