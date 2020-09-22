/**
 * Description : 포럼 읽기
 * Author      : atom
 * Date        : 2020.07.20
 */
var frumReadApp = new Vue({
    el: "#forumRead",
    data: {
        // 포럼정보
        frumVo: {},

        // 포럼코멘트목록
        frumCmtList: [],

        // 포럼코멘트내용
        frumCmtCont: ""
    },
    mixins: [frumMixin],
    methods: {
        /**
         * 페이지 초기화
         */
        initPage: function() {
            // 포럼 읽기 정보 조회
            this.selectFrumReadInfo();

            // 포럼 코멘트 목록 조회
            this.selectFrumCmtList();
        },

        /**
         * 포럼 읽기 정보 조회
         */
        selectFrumReadInfo: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/community/forum/selectFrumReadInfo",
                param: {
                    forumGroupSeq: this.argVo.forumGroupSeq,
                    forumSeq: this.argVo.forumSeq,
                    mbrId: this.mbrId
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
         * 포럼 코멘트 목록 조회
         */
        selectFrumCmtList: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/community/forum/selectFrumCmtList",
                param: {
                    forumGroupSeq: this.argVo.forumGroupSeq,
                    forumSeq: this.argVo.forumSeq,
                    mbrId: this.mbrId
                },
                success: function(response) {
                    $this.frumCmtList = response.data;
                }
            });
        },

        /**
         * 포럼 쓰기 이동
         */
        onFrumWritMove: function() {
            window.location.href = "/community/forum/write?" + this.getParam("writ");
        },

        /**
         * 포럼 수정 이동
         */
        onFrumUptMove: function() {
            window.location.href = "/community/forum/write?" + this.getParam("read");
        },

        /**
         * 포럼 삭제
         */
        deleteFrum: function() {
            var $this = this;

            LayerUtil.confirm({
                msg: "삭제하시겠습니까?",
                callback: function(resYn) {
                    if (resYn) {
                        AjaxUtil.post({
                            url: GblVar.apiUrl + "/api/community/forum/deleteFrum",
                            param: {
                                forumGroupSeq: $this.argVo.forumGroupSeq,
                                forumSeq: $this.argVo.forumSeq,
                                mbrId: $this.mbrId,
                                admYn: SessionUtil.getAdminYn()
                            },
                            reqType: "url",
                            success: function(response) {
                                LayerUtil.alert({
                                    msg: "삭제되었습니다.",
                                    callback: function() {
                                        $this.onFrumListMove();
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },

        /**
         * 포럼 추천 처리
         */
        procFrumRcmd: function() {
            if (!SessionUtil.getMbrYn()) {
                WebUtil.goLogin();
                return false;
            }

            var $this = this;

            LayerUtil.confirm({
                msg: "추천하시겠습니까?",
                callback: function(resYn) {
                    if (resYn) {
                        AjaxUtil.post({
                            url: GblVar.apiUrl + "/api/community/forum/procFrumRcmd",
                            param: {
                                forumGroupSeq: $this.argVo.forumGroupSeq,
                                forumSeq: $this.argVo.forumSeq,
                                mbrId: $this.mbrId
                            },
                            reqType: "url",
                            success: function(response) {
                                LayerUtil.alert({
                                    msg: "추천되었습니다.",
                                    callback: function() {
                                        $this.frumVo.recmdCnt = $this.frumVo.recmdCnt + 1;
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },

        /**
         * 포럼 코멘트 등록
         */
        insertFrumCmt: function() {
            if (!SessionUtil.getMbrYn()) {
                LayerUtil.confirm({
                    msg: "로그인이 필요한 서비스입니다.<br />로그인 페이지로 이동하시겠습니까?",
                    callback: function(resYn) {
                        if (resYn) {
                            WebUtil.goLogin();
                        }
                    }
                });
                return false;
            }

            if (WebUtil.isNull(this.frumCmtCont)) {
                LayerUtil.alert({
                    msg: "댓글을 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("frumCmtCont").focus();
                    }
                });
                return false;
            }

            var $this = this;

            LayerUtil.confirm({
                msg: "등록하시겠습니까?",
                callback: function(resYn) {
                    if (resYn) {
                        AjaxUtil.post({
                            url: GblVar.apiUrl + "/api/community/forum/insertFrumCmt",
                            param: {
                                forumGroupSeq: $this.argVo.forumGroupSeq,
                                forumSeq: $this.argVo.forumSeq,
                                forumCommentContent: $this.frumCmtCont,
                                mbrId: $this.mbrId
                            },
                            reqType: "url",
                            success: function(response) {
                                LayerUtil.alert({
                                    msg: "등록되었습니다.",
                                    callback: function() {
                                        // 댓글 초기화
                                        $this.frumCmtCont = "";

                                        // 포럼 코멘트 목록 조회
                                        $this.selectFrumCmtList();
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },

        /**
         * 포럼 코멘트 수정 클릭
         */
        onFrumCmtUptClick: function(index) {
            DocUtil.getElId("frumCmtUptCont" + index).value = this.frumCmtList[index].forumCommentContent;
            DocUtil.getElId("frumCmtUptWrap" + index).style.display = "";
            DocUtil.getElId("frumCmtTxtWrap" + index).style.display = "none";
            DocUtil.getElId("frumCmtBtnCncl" + index).style.display = "";
        },

        /**
         * 포럼 코멘트 취소 클릭
         */
        onFrumCmtCnclClick: function(index) {
            DocUtil.getElId("frumCmtUptWrap" + index).style.display = "none";
            DocUtil.getElId("frumCmtTxtWrap" + index).style.display = "";
            DocUtil.getElId("frumCmtBtnCncl" + index).style.display = "none";
        },

        /**
         * 포럼 코멘트 삭제 클릭
         */
        onFrumCmtDelClick: function(index) {
            var $this = this;

            LayerUtil.confirm({
                msg: "삭제하시겠습니까?",
                callback: function(resYn) {
                    if (resYn) {
                        AjaxUtil.post({
                            url: GblVar.apiUrl + "/api/community/forum/deleteFrumCmt",
                            param: {
                                forumCommentSeq: $this.frumCmtList[index].forumCommentSeq,
                                mbrId: $this.mbrId
                            },
                            reqType: "url",
                            success: function(response) {
                                LayerUtil.alert({
                                    msg: "삭제되었습니다.",
                                    callback: function() {
                                        // 배열 제거
                                        $this.frumCmtList.splice(index, 1);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },

        /**
         * 포럼 코멘트 수정
         */
        updateFrumCmt: function(index) {
            var cmtCont = DocUtil.getElId("frumCmtUptCont" + index).value;

            if (WebUtil.isNull(cmtCont)) {
                LayerUtil.alert({
                    msg: "댓글을 입력해주세요.",
                    callback: function() {
                        DocUtil.getElId("frumCmtUptCont" + index).focus();
                    }
                });
                return false;
            }

            var $this = this;

            LayerUtil.confirm({
                msg: "수정하시겠습니까?",
                callback: function(resYn) {
                    if (resYn) {
                        AjaxUtil.post({
                            url: GblVar.apiUrl + "/api/community/forum/updateFrumCmt",
                            param: {
                                forumCommentSeq: $this.frumCmtList[index].forumCommentSeq,
                                forumCommentContent: cmtCont,
                                mbrId: $this.mbrId
                            },
                            reqType: "url",
                            success: function(response) {
                                LayerUtil.alert({
                                    msg: "수정되었습니다.",
                                    callback: function() {
                                        $this.frumCmtList[index].forumCommentContent = cmtCont;
                                        $this.onFrumCmtCnclClick(index);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    },
    mounted: function() {
        // 아규먼트 초기화
        this.initArg();

        // 페이지 초기화
        this.initPage();
    }
});
