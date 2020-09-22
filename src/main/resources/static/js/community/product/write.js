
var productWriteApp = new Vue({
    el: "#productWrite",
    data: {
        mode: '',
        obsItems: [],
        prdtTypes: [],
        product: {
            prdtSeq: '',
            cretrId: SessionUtil.getMbrId(),
            prdtType: '',
            obsItem: '',
            prdtName: '',
            prdtContents: '',
            imageFile: '',
            attachedFile: '',
        }

    },
    methods: {
        initArgs: function() {
            this.prdtSeq = WebUtil.nvl(DocUtil.getElId("argPrdtSeq").value, null);
            if (WebUtil.isNotNull(this.prdtSeq)) {
                this.mode = "modify";
            } else {
                this.mode = "write";
            }
        },
        initPage: function() {
            this.getObsItems();
            this.getPrdtTypes();
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
                    $this.product.obsItem = "all";

                }
            });
        },
        getPrdtTypes: function() {
            var $this = this;
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/cdDtlList/OBSTYPE",
                reqType: "url",
                success: function(res) {
                    console.log("------- options -----");
                    console.log(res.data);
                    $this.prdtTypes = res.data;
                    $this.product.prdtType = $this.prdtTypes[0].cdDtlKey.dtlCd;

                }
            });
        },

        write: function () {
            if (this.isValidForm()) {
                var $this = this;

                var formData = new FormData();
                formData.append("prdtSeq",         $this.product.prdtSeq);
                formData.append("prdtName",         $this.product.prdtName);
                formData.append("prdtType",    $this.product.prdtType);
                formData.append("obsItem",       $this.product.obsItem);
                formData.append("prdtContents",       $this.product.prdtContents);
                formData.append("cretrId",       $this.product.cretrId);
                formData.append("imageFile",       $this.product.imageFile);
                formData.append("attachedFile",       $this.product.attachedFile);

                AjaxUtil.form({
                    url: "/community/product",
                    param: formData,
                    success: function (response) {
                        console.log(response);
                        window.location.href = "/community/product/list";
                    }
                });
            }
        },
        handleImageFileUpload(){
            this.product.imageFile = this.$refs.imageFile.files[0];
        },
        handleAttachedFileUpload(){
            this.product.attachedFile = this.$refs.attachedFile.files[0];
        },
        getProduct: function() {
            var $this = this;

            if ($this.mode == "modify") {
                AjaxUtil.get({
                    url: GblVar.apiUrl + "/api/community/product/"+this.prdtSeq,
                    success: function(res) {
                        console.log("--------- loaded --------");
                        console.log(res.data);
                        $this.product = res.data;
                        var itemSize = res.data.obsItem.split(",").length;
                        console.log("obsItem count: "+itemSize);
                        if (itemSize > 1) {
                            $this.product.obsItem = "all";
                        }

                    }
                });
            }
        },
        isValidForm: function() {

            var regex = /^[가-힣a-zA-Z\s0-9]{1,20}$/
            if (!regex.test(this.product.prdtName)) {
                LayerUtil.alert({
                    msg: "디바이스 이름은 최대 20자까지 한글, 영문, 숫자, 띄어쓰기가 가능하며, 기호는 사용 불가합니다.)",
                    callback: function () {
                        DocUtil.getElId("prdtName").focus();
                    }
                });
                return false;
            }

            if (WebUtil.isNull(this.product.prdtContents)) {
                LayerUtil.alert({
                    msg: "내용을 입력해주세요.",
                    callback: function () {
                        DocUtil.getElId("prdtContent").focus();
                    }
                });
                return false;
            }

            return true;
        }
    },
    mounted: function() {

        this.initArgs();
        this.initPage();
        this.getProduct();


    }

});
