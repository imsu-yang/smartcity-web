/**
 * Description : 포럼 쓰기
 * Author      : atom
 * Date        : 2020.07.20
 */
var frumWriteApp = new Vue({
    el: "#forumWrite",
    data: {
        // 모드
        mode: "",

        // 회원명
        mbrNm: SessionUtil.getMbrNm(),

        // 포럼정보
        frumVo: {
            forumTitle: "",
            forumContents: "",
            attachedFilePath: "",
            hitCnt: 0,
            recmdCnt: 0,
            atchFile: null
        },

        // 파일유형목록
        fileTypeList: ["image/jpeg", "image/png"],

        // 파일최대사이즈 - 50MB
        fileMaxSize: 50 * 1024 * 1024
    },
    mixins: [frumMixin],
    methods: {
        /**
         * 페이지 초기화
         */
        initPage: function() {
            this.mode = "C";

            if (WebUtil.isNotNull(this.argVo.forumSeq)) {
                this.mode = "U";

                // 포럼 수정 정보 조회
                this.selectFrumUptInfo();
            }
        },

        /**
         * 포럼 수정 정보 조회
         */
        selectFrumUptInfo: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/community/forum/selectFrumUptInfo",
                param: {
                    forumGroupSeq: this.argVo.forumGroupSeq,
                    forumSeq: this.argVo.forumSeq,
                    mbrId: this.mbrId,
                    admYn: SessionUtil.getAdminYn()
                },
                success: function(response) {
                    $this.frumVo = response.data;
                },
                error: function(msg) {
                    LayerUtil.alert({
                        msg: msg,
                        callback: function() {
                            $this.onFrumInitMove();
                        }
                    });
                }
            });
        },

        /**
         * 포럼 저장
         */
        saveFrum: function() {
            // 폼 유효성 체크
            if (!this.isValidForm()) {
                return false;
            }

            // 메세지
            var $this = this;
            var reqMsg = "등록하시겠습니까?";
            var cmptMsg = "등록되었습니다";

            if (this.mode == "U") {
                reqMsg = "수정하시겠습니까?";
                cmptMsg = "수정되었습니다";
            }

            LayerUtil.confirm({
                msg: reqMsg,
                callback: function(resYn) {
                    if (resYn) {
                        var formData = new FormData();
                        formData.append("forumGroupSeq",    $this.argVo.forumGroupSeq);
                        formData.append("forumSeq",         $this.argVo.forumSeq);
                        formData.append("forumTitle",       $this.frumVo.forumTitle);
                        formData.append("forumContents",    $this.frumVo.forumContents);
                        formData.append("attachedFilePath", $this.frumVo.attachedFilePath);
                        formData.append("atchFile",         $this.frumVo.atchFile);
                        formData.append("mbrId",            $this.mbrId);
                        formData.append("admYn",            SessionUtil.getAdminYn());

                        AjaxUtil.form({
                            url: "/community/forum/save",
                            param: formData,
                            success: function(response) {
                                LayerUtil.alert({
                                    msg: cmptMsg,
                                    callback: function() {
                                        if ($this.mode == "U") {
                                            $this.onFrumListMove();
                                        } else {
                                            $this.onFrumInitMove();
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },

        /**
         * 폼 유효성 체크
         */
        isValidForm: function() {
            if (WebUtil.isNull(this.frumVo.forumTitle)) {
                LayerUtil.alert({
                    msg: "제목을 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("forumTitle").focus();
                    }
                });
                return false;
            }

            if (WebUtil.isNull(this.frumVo.forumContents)) {
                LayerUtil.alert({
                    msg: "내용을 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("forumContents").focus();
                    }
                });
                return false;
            }

            return true;
        },

        /**
         * 포럼 취소
         */
        cnclFrum: function() {
            var $this = this;

            LayerUtil.confirm({
                msg: "게시물 작성을 취소하시겠습니까?",
                callback: function(resYn) {
                    if (resYn) {
                        $this.onFrumListMove();
                    }
                }
            });
        },

        /**
         * 첨부 파일 변경
         */
        onAtchFileChange: function(fileList) {
            var fileRow = fileList[0];

            // 확장자 체크
            if (this.fileTypeList.indexOf(fileRow.type) == -1) {
                LayerUtil.alert({ msg: "[jpg, png] 이미지 파일만 등록 가능합니다." });
                document.getElementById("frumAtchFile").value = "";
                return false;
            }

            // 파일 사이즈 체크
            if (fileRow.size > this.fileMaxSize) {
                LayerUtil.alert({ msg: "첨부파일은 50MB까지 가능합니다." });
                document.getElementById("frumAtchFile").value = "";
                return false;
            }

            this.frumVo.atchFile = fileRow;
        }
    },
    mounted: function() {
        // 아규먼트 초기화
        this.initArg();

        // 페이지 초기화
        this.initPage();
    }
});
