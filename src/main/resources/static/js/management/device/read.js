
var deviceReadApp = new Vue({
    el: "#deviceRead",
    data: {
        showPopup: 'none',
        popup: {
            obsItem: '',
            obsUnit: ''
        },
        obsItems: [],
        obsUnits: [],
        devId: null,
        device: '',
        devObsInfos: [],
        obsItem: '',
        obsUnit: '',
    },
    methods: {
        initPage: function() {
            this.getDevice();
            this.getObsInfoList();
            this.getObsItems();
            this.getObsUnits();
        },

        getObsItems: function() {
            var $this = this;
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/cdDtlList/OBS",
                reqType: "url",
                success: function(res) {
                    console.log("------- options -----");
                    console.log(res.data);
                    $this.obsItems = res.data;
                    $this.popup.obsItem = $this.obsItems[0].cdDtlKey.dtlCd;
                }
            });
        },

        getObsUnits: function() {
            var $this = this;
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/cdDtlList/OBSUNIT",
                reqType: "url",
                success: function(res) {
                    console.log("------- options -----");
                    console.log(res.data);
                    $this.obsUnits = res.data;
                    $this.popup.obsUnit = $this.obsUnits[0].dtlCdNm;

                    console.log("SEL: "+$this.obsUnits[0].dtlCdNm);
                }
            });
        },

        getDevice: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/management/device/"+this.devId,
                success: function(res) {
                    console.log("-------- device ---------");
                    console.log(res.data);
                    $this.device = res.data;

                }
            });
        },

        getObsInfoList: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/deviceObsInfos/"+this.devId,
                success: function(res) {
                    console.log("-------- devObsInfos ---------");
                    console.log(res.data);
                    $this.devObsInfos = res.data;

                }
            });
        },
        addDevObsInfo: function() {
          console.log("addDevObsInfo:");
            var $this = this;
            AjaxUtil.post({
                url: GblVar.apiUrl + "/api/deviceObsInfo",
                param: { devId: $this.devId, obsItemId: $this.popup.obsItem, unitType: $this.popup.obsUnit},
                reqType: "json",
                success: function(res) {
                    console.log("-------- devObsInfos ---------");
                    console.log(res.data);
                    $this.getObsInfoList();

                    $this.hideObsInfoPopup();
                }
            });
        },
        modifyObsInfo: function(selIdx) {
            var $this = this;
            if (SessionUtil.getMbrYn()) {
                if (SessionUtil.getMbrId() != $this.device.cretrId) {
                    console.log(SessionUtil.getMbrId()+", "+this.device.devId);
                    LayerUtil.alert("게시글 작성자만 수정할 수 있습니다.");
                } else {
                    $this.showObsInfoPopup();

                    $this.devObsInfos.forEach(function (item, index) {
                        if (selIdx == index) {
                            $this.popup.obsItem = item.obsItemId;
                            $this.popup.obsUnit = item.unitType;
                        }
                    });



                }

            } else {
                WebUtil.goLogin();
            }
        },
        hideObsInfoPopup: function() {
            this.showPopup = 'none';
        },
        showObsInfoPopup: function() {
            var $this = this;
            if (SessionUtil.getMbrYn()) {
                this.showPopup = 'block';

                $this.devObsInfos.forEach(function (item, index) {
                    if (0 == index) {
                        $this.popup.obsItem = item.obsItemId;
                        $this.popup.obsUnit = item.unitType;
                    }
                });
            } else {
                WebUtil.goLogin();
            }
        },
        deleteObsInfo: function(obsItemId) {
            var $this = this;
            if (SessionUtil.getMbrYn()) {
                if (SessionUtil.getMbrId() != $this.device.cretrId) {
                    console.log(SessionUtil.getMbrId()+", "+this.device.devId);
                    LayerUtil.alert("게시글 작성자만 삭제할 수 있습니다.");
                } else {
                   LayerUtil.confirm({
                        msg: "해당 측정항목을 삭제하시겠습니까?",
                        callback: function (resYn) {
                            if (resYn) {
                                console.log("delete obsItemId:"+obsItemId+", devId:"+$this.device.devId);
                                AjaxUtil.delete({
                                    url: GblVar.apiUrl + "/api/deviceObsInfo/"+$this.device.devId+"/"+obsItemId,
                                    reqType: "json",
                                    success: function (res) {
                                        $this.getObsInfoList();
                                    }
                                });
                            }
                        }
                    });
                }


            } else {
                WebUtil.goLogin();
            }
        },
        modifyDevice: function() {
            if (SessionUtil.getMbrYn()) {

                window.location.href = "/management/device/write?devId=" + this.devId

            } else {
                WebUtil.goLogin();
            }
        },
        modifyDevice: function() {
            var $this = this;
            if (SessionUtil.getMbrYn()) {
                if (SessionUtil.getMbrId() != $this.device.cretrId) {
                    console.log(SessionUtil.getMbrId()+", "+$this.device.cretrId);
                    LayerUtil.alert("게시글 작성자만 수정할 수 있습니다.");
                } else {
                    window.location.href = "/management/device/write?devId="+$this.devId;
                }


            } else {
                WebUtil.goLogin();
            }
        },
        deleteDevice: function() {
            var $this = this;
            if (SessionUtil.getMbrYn()) {
                if (SessionUtil.getMbrId() != $this.device.cretrId) {
                    console.log(SessionUtil.getMbrId()+", "+$this.device.cretrId);
                    LayerUtil.alert("게시글 작성자만 삭제할 수 있습니다.");
                } else {

                    LayerUtil.confirm({
                        msg: "해당 게시글을 삭제하시겠습니까?",
                        callback: function (resYn) {
                            if (resYn) {
                                AjaxUtil.delete({
                                    url: GblVar.apiUrl + "/api/management/device/" + $this.devId,
                                    reqType: "json",
                                    success: function (res) {
                                        window.location.href = "/management/device/list";
                                    }
                                });
                            }
                        }
                    });
                }


            } else {
                WebUtil.goLogin();
            }
        },
        toWriteDevice: function() {
            if (SessionUtil.getMbrYn()) {
                window.location.href = "/management/device/write";
            } else {
                WebUtil.goLogin();

            }
        },
        toDeviceList: function() {
            window.location.href = "/management/device/list";
        }
    },
    mounted: function() {
        this.devId = WebUtil.nvl(DocUtil.getElId("argDevId").value, null);

        this.initPage();

    }
});
