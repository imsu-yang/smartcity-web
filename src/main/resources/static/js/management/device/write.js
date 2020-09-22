let deviceWriteApp = new Vue({
    el: "#deviceWrite",
    data: {
        mode: '',
        deviceMap: '',
        compareDeviceMap: '',
        // markerLayer: '',
        selectMarker: '',
        showPopupBg: 'block',
        compareDevices: [],
        selectedDevice: '',
        prdtTypes: [],
        popup: {
            manufacturer: {
                searchMode: true, // 검색 모드
                show: false,
                keyword: '',
                manufacturerId: '',
                manufactureName: '',
                searchList: [],
                searchNone: 'none'

            },
            deviceMap: {
                show: 'block',
                latitude: 14115658.06979287,
                longitude: 4492233.209207459,
                locationText: '',
                lonlat: '',
                marker: '',
                markerLayer: ''
            },
            compareDeviceMap: {
                show: 'block',
                markerLayer: ''
            }

        },
        mode: '',
        protocolRules: [],
        device: {
            devId: '',
            devName: '',
            devPassword: '',
            protocolType: '표준',
            protocolRule: '',
            devImgPath: '',
            userDefName: '',
            manufacturerId: '',
            manufacturerName: '',
            location: '',
            userDefName: '',
            imageFile: '',
            cretrId: SessionUtil.getMbrId(),
            latitVal: '',
            lngitVal: '',
            addedCompareDevices: [],
            compareDeviceDevIds: '',
            prdtType: ''
        }
    },
    methods: {
        initArgs: function () {
            this.device.devId = WebUtil.nvl(DocUtil.getElId("argDevId").value, null);
            this.mode = WebUtil.isNotNull(this.device.devId) ? "modify" : "write";
        },
        getProtocolRules: function () {
            let $this = this;
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/cdDtlList/PROTR",
                reqType: "url",
                success: function (res) {
                    console.log("------- options -----");
                    console.log(res.data);
                    $this.protocolRules = res.data;

                    $this.device.protocolRule = res.data[0].dtlCd;
                }
            });
        },
        getPrdtTypes: function () {
            var $this = this;
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/cdDtlList/OBSTYPE",
                reqType: "url",
                success: function (res) {
                    console.log("------- options -----");
                    console.log(res.data);
                    $this.prdtTypes = res.data;

                    $this.device.prdtType = $this.prdtTypes[0].cdDtlKey.dtlCd;
                }
            });
        },

        getAddedCompareDeviceDevId: function () {
            let devIds = [];
            this.device.addedCompareDevices.forEach(item => devIds.push(item.devId));

            return devIds.join(',');
        },

        handleImageFileUpload: function () {
            this.device.imageFile = this.$refs.imageFile.files[0];
        },

        /**
         * 디바이스 등록, API 호출
         * */
        write: function () {
            let $this = this;
            if ($this.isValidForm()) {
                /**
                 * {
                 *     devId: 디바이스 ID,
                 *     devName: 디바이스 이름,
                 *     devPassword: 디바이스 패스워드,
                 *     manufacturerId: 기업 ID (기업명을 직접 입력할 경우 MANF999),
                 *     manufacturerName: 기업명,
                 *     protocolType: 프로토콜 구분,
                 *     protocolRule: 프로토콜 유형,
                 *     imageFile: 디바이스 이미지 파일명,
                 *     userDefName: 사용자 정의 모델명,
                 *     latitVal: 디바이스 위치의 위도,
                 *     lngitVal: 디바이스 위치의 경도,
                 *     cretrId: 회원 아이디,
                 *     prdtType: 측정기 유형 (고정형, 이동형, 휴대형),
                 *     addedCompareDevices: 추가된 비교 디바이스 리스트 [디바이스 ID 1, 디바이스 ID 2, ...]
                 * }
                 * */
                let formData = new FormData();

                formData.append("devId",         $this.device.devId);
                formData.append("devName",         $this.device.devName);
                formData.append("devPassword",    $this.device.devPassword);
                formData.append("mbrSeq",     SessionUtil.getMbrSeq());

                formData.append("manufacturerId",       $this.device.manufacturerId);
                formData.append("manufacturerName",       $this.device.manufacturerName);
                formData.append("protocolType",       $this.device.protocolType);
                formData.append("protocolRule",       $this.device.protocolRule);

                formData.append("imageFile",       $this.device.imageFile);
                formData.append("userDefName",       $this.device.userDefName);
                formData.append("latitVal",       $this.device.latitVal);
                formData.append("lngitVal",       $this.device.lngitVal);
                formData.append("cretrId",       $this.device.cretrId);
                formData.append("prdtType",       $this.device.prdtType);
                formData.append("addedCompareDevices",       $this.getAddedCompareDeviceDevId());

                console.log($this.device);

                AjaxUtil.form({
                    url: "/management/device/" + $this.mode,
                    param: formData,
                    success: () => window.location.href = "/management/device/list"
                });
            }
        },

        cancel: function () {
            window.location.href = "/management/device/read?devId=" + this.device.devId;
        },

        /**
         * 기업명 검색
         * */
        searchManufacturer: function() {
            let $this = this;

            if (this.isValidSearchForm()) {
                AjaxUtil.post({
                    url: GblVar.apiUrl + "/api/management/search/manufacturer",
                    param: { keyword: this.popup.manufacturer.keyword },
                    reqType: "json",
                    success: function (res) {
                        console.log("-------- search " + res.data.length + "--------");
                        console.log(res.data);

                        $this.popup.manufacturer.searchList = res.data;
                        $this.popup.manufacturer.searchNone = res.data.length === 0 ? "block" : "none";
                    }
                });
            }
        },

        /**
         * 기업명 선택
         * */
        selectManufacturer: function (manufacturerId, manufacturerName) {
            // this.popup.manufacturer.manufacturerId = manufacturerId;
            // this.popup.manufacturer.manufactureName = manufactureName;
            console.log("select: "+manufacturerName);
            this.device.manufacturerId = manufacturerId;
            this.device.manufacturerName = manufacturerName;
            this.popup.manufacturer.keyword = manufacturerName;
        },
        writeSearchManufacturer: function () {
            this.hideManufacturerPopup();
        },

        /**
         * 기업명 검색 팝업 숨기기
         * */
        hideManufacturerPopup: function () {
            console.log("hide");
            this.showPopupBg = 'none';
            this.popup.manufacturer.show = 'none';
        },

        /**
         * 기업명 검색 팝업 보이기
         * */
        showManufacturerPopup: function () {
            this.popup.manufacturer.searchMode = true;
            this.showPopupBg = 'block';
            this.popup.manufacturer.show = 'block';
        },

        /**
         * 기업명 직접 입력
         * */
        writeManufacturer: function () {
            this.popup.manufacturer.searchMode = false;
            this.device.manufacturerId = 'MANF999';
            this.device.manufacturerName = '';
            DocUtil.getElId("manufacturerName").focus();
        },
        initDeviceMap: function () {
            let $this = this;
            vw.ol3.MapOptions = {
                basemapType: vw.ol3.BasemapType.GRAPHIC,
                controlDensity: vw.ol3.DensityType.EMPTY,
                interactionDensity: vw.ol3.DensityType.BASIC,
                controlsAutoArrange: true,
                homePosition: vw.ol3.CameraPosition,
                initPosition: vw.ol3.CameraPosition
            };

            this.deviceMap = new vw.ol3.Map("deviceMap",  vw.ol3.MapOptions);


            const initLocation = [14115692.360860242,4488954.793474106];
            this.deviceMap.getView().setCenter(initLocation);
            this.deviceMap.getView().setZoom(11);

            this.popup.deviceMap.markerLayer = new vw.ol3.layer.Marker(this.deviceMap);
            this.deviceMap.addLayer(this.popup.deviceMap.markerLayer);

            this.deviceMap.on("click", function (evt) {
                const coordinate = evt.coordinate; //좌표정보
                const lonlat = ol.proj.transform(coordinate, "EPSG:900913", "EPSG:4326");
                const longitude = lonlat[0];
                const latitude = lonlat[1];

                $this.popup.deviceMap.longitude = longitude;
                $this.popup.deviceMap.latitude = latitude;

                $this.device.lngitVal = longitude;
                $this.device.latitVal = latitude;
                $this.device.location = "위도: "+ $this.device.latitVal+" / 경도: "+$this.device.lngitVal;
                $this.popup.deviceMap.markerLayer.hideAllMarker();

                $this.addMyDeviceMarker($this.popup.deviceMap.markerLayer);
            });

            $this.hideMapPopup();
        },

        /**
         * 지도에 디바이스 마커 추가
         * */
        addMarker: function (longitude, latitude, title, content, icon, markerLayer) {
            vw.ol3.markerOption = {
                x : longitude,
                y : latitude,
                epsg : "EPSG:4326",
                contents : content,
                title : title,
                iconUrl : icon
            };
            markerLayer.addMarker(vw.ol3.markerOption);
        },
        initCompareDeviceMap: function () {

            let $this = this;
            vw.ol3.MapOptions = {
                basemapType: vw.ol3.BasemapType.GRAPHIC,
                controlDensity: vw.ol3.DensityType.EMPTY,
                interactionDensity: vw.ol3.DensityType.BASIC,
                controlsAutoArrange: true,
                homePosition: vw.ol3.CameraPosition,
                initPosition: vw.ol3.CameraPosition
            };

            this.compareDeviceMap = new vw.ol3.Map("compareDeviceMap",  vw.ol3.MapOptions);

            const initLocation = [14115692.360860242,4488954.793474106];
            this.compareDeviceMap.getView().setCenter(initLocation);
            this.compareDeviceMap.getView().setZoom(11);

            this.compareDeviceMap.markerLayer = new vw.ol3.layer.Marker(this.compareDeviceMap);
            this.compareDeviceMap.addLayer(this.compareDeviceMap.markerLayer);


            // this.compareDeviceMap.on("click", function (evt) {
            //     var coordinate = evt.coordinate; //좌표정보
            //     var lonlat = ol.proj.transform(coordinate,'EPSG:900913', "EPSG:4326");
            //     var longitude = lonlat[0];
            //     var latitude = lonlat[1];
            // });

            $this.hideMapPopup();
        },

        getMyDeviceInfo: function () {
            let $this = this;
            if (this.mode === "modify") {
                AjaxUtil.get({
                    url: GblVar.apiUrl + "/api/management/device/" + this.device.devId,
                    reqType: "url",
                    success: function (res) {
                        // $this.device = res.data;
                        console.log("modify device");
                        console.log(res.data);

                        $this.device.devId = res.data.devId;
                        $this.device.devName = res.data.devName;
                        $this.device.devPassword = res.data.devPassword;
                        $this.device.protocolType = res.data.protocolType;
                        $this.device.protocolRule = res.data.protocolRule;
                        // $this.device.devImgPath = res.data.devImgPath;
                        $this.device.userDefName = res.data.userDefName;
                        $this.device.manufacturerId= res.data.manufacturerId;
                        $this.device.manufacturerName= res.data.manufacturerName;
                        $this.device.location= "위도: "+ res.data.latitVal+" / 경도: "+res.data.lngitVal;
                        $this.device.userDefName= res.data.userDefName;
                        // $this.device.imageFile= res.data.;
                        $this.device.cretrId = SessionUtil.getMbrId();
                        $this.device.latitVal = res.data.latitVal;
                        $this.device.lngitVal = res.data.lngitVal;
                        // $this.device.addedCompareDevices: [];
                        // $this.device.compareDeviceDevIds = res.data.compareDeviceDevIds;
                        $this.device.prdtType= res.data.prdtType;

                        // $this.device = { ...res.data };
                        // $this.device.addedCompareDevices = [];

                        $this.getCompareDevices();
                    }
                });
            }
        },
        getCompareDevices: function(devId) {
            var $this = this;
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/management/monitor/compare-devices/"+$this.device.devId,
                reqType: "url",
                success: function(res) {
                    console.log("------- compareDevices -----");
                    console.log(res.data);
                    $this.compareDevices = res.data;

                    $this.compareDeviceMap.markerLayer.hideAllMarker();

                    // 내 디바이스 마커 표시
                    $this.addMyDeviceMarker($this.compareDeviceMap.markerLayer);

                    // 비교디바이스 마커 표시
                    for (var idx in $this.compareDevices ) {
                        var device = $this.compareDevices[idx];
                        var longitude = device.devInfo.lngitVal;
                        var latitude = device.devInfo.latitVal;
                        var devName = device.devInfo.devName;
                        var devId = device.devInfo.devId;
                        var icon = '/img/'+device.markerIcon;
                        var content = "<a href=\"javascript:addCompareDevice('"+devId+"');\">비교디바이스 추가</a>";

                        $this.addMarker(longitude, latitude, devName, content, icon, $this.compareDeviceMap.markerLayer);


                        if (device.devId == devId) {
                            console.log("add: "+devId);
                            $this.device.addedCompareDevices.push(device);
                        }
                    }

                }
            });
        },
        addCompareDevicesMaker: function() {
            var $this = this;
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/management/monitor/compare-devices",
                reqType: "url",
                success: function(res) {
                    $this.compareDevices = res.data;
                    $this.compareDeviceMap.markerLayer.hideAllMarker();
                    
                    // 내 디바이스 마커 표시
                    $this.addMyDeviceMarker($this.compareDeviceMap.markerLayer);

                    // 비교디바이스 마커 표시
                    for (var idx in $this.compareDevices ) {
                        var device = $this.compareDevices[idx];
                        var longitude = device.devInfo.lngitVal;
                        var latitude = device.devInfo.latitVal;
                        var devName = device.devInfo.devName;
                        var devId = device.devInfo.devId;
                        var icon = '/img/'+device.markerIcon;
                        var content = "<a href=\"javascript:addCompareDevice('"+devId+"');\">비교디바이스 추가</a>";
                        
                        $this.addMarker(longitude, latitude, devName, content, icon, $this.compareDeviceMap.markerLayer);
                    }
                }
            });
        },

        /**
         *  내 디바이스의 위치를 등록
         */
        selectMyDeviceLocation: function () {
            this.hideMapPopup();
            this.device.latitVal = this.popup.deviceMap.latitude;
            this.device.lngitVal = this.popup.deviceMap.longitude;
            this.device.location = "위도: "+ this.device.latitVal+" / 경도: "+this.device.lngitVal;
        },
        showMyDevicePopup: function () {
            this.showPopupBg = 'block';
            this.popup.deviceMap.show = 'block';
            this.popup.compareDeviceMap.show = 'none';

            this.popup.deviceMap.markerLayer.hideAllMarker();

            // 내 디바이스 마커 표시
            this.addMyDeviceMarker(this.popup.deviceMap.markerLayer);
        },
        showCompareDevicesPopup: function () {
            if (this.device.addedCompareDevices.length === 2)
                LayerUtil.alert({ msg: "비교 디바이스는 최대 2개까지 추가할 수 있습니다." });
            else {
                this.showPopupBg = 'block';
                this.popup.compareDeviceMap.show = 'block';
                this.popup.deviceMap.show = 'none';

                this.addCompareDevicesMaker();
            }
        },
        deleteCompareDevice: function () {
            this.device.addedCompareDevices.pop();
        },
        addMyDeviceMarker: function (markerLayer) {
            if (this.device.lngitVal && this.device.latitVal)
                this.addMarker(this.device.lngitVal, this.device.latitVal, "내 디바이스", "", "/img/marker.png", markerLayer);
        },
        showCompareDevicePopup: function (devId) {
            this.showPopupBg = 'block';
            this.popup.deviceMap.show = 'block';
            this.popup.compareDeviceMap.show = 'none'

            this.popup.deviceMap.markerLayer.hideAllMarker();

            // 내 디바이스 마커 표시
            this.addMyDeviceMarker(this.popup.deviceMap.markerLayer);

            // 선택한 디바이스 마커표시
            for (let idx in this.compareDevices ) {
                const device = this.compareDevices[idx];

                if (device.devId === devId) {
                    const longitude = device.devInfo.lngitVal;
                    const latitude = device.devInfo.latitVal;
                    const devName = device.devInfo.devName;
                    const icon = '/img/' + device.markerIcon;
                    this.addMarker(longitude, latitude, devName, "", icon, this.popup.deviceMap.markerLayer);
                }
            }
        },
        hideMapPopup: function () {
            this.showPopupBg = 'none';
            this.popup.deviceMap.show = 'none';
            this.popup.compareDeviceMap.show = 'none';
        },
        existDevice: function (devId) {
            for (let idx in this.device.addedCompareDevices ) {
                const device = this.device.addedCompareDevices[idx];
                if (device.devId === devId) return true;
            }
            return false;
        },
        isValidSearchForm: function () {
            if (this.popup.manufacturer.keyword.length === 0) {
                LayerUtil.alert({
                    msg: "검색어를 입력해주세요,",
                    callback: DocUtil.getElId("searchKeyword").focus
                });
                return false;
            }
            return true;
        },

        isValidForm: function () {
            if (this.device.devName === "") {
                LayerUtil.alert({
                    msg: "디바이스 이름은 필수 입력입니다.",
                    callback: option => DocUtil.getElId("deviceName").focus(option)
                });
                return false;
            }

            const regex = /^[가-힣a-zA-Z\s0-9]{1,20}$/
            if (!regex.test(this.device.devName)) {
                LayerUtil.alert({
                    msg: "디바이스 이름은 최대 20자까지 한글, 영문, 숫자, 띄어쓰기가 가능하며, 기호는 사용 불가합니다.",
                    callback: option => DocUtil.getElId("deviceName").focus(option)
                });
                return false;
            }

            if (this.device.devId === "") {
                LayerUtil.alert({
                    msg: "디바이스 ID는 필수 입력입니다.",
                    callback: option => DocUtil.getElId("deviceID").focus(option)
                });
                return false;
            }

            if (!regex.test(this.device.devId)) {
                LayerUtil.alert({
                    msg: "디바이스 ID는 최대 20자까지 한글, 영문, 숫자, 띄어쓰기가 가능하며, 기호는 사용 불가합니다.",
                    callback: option => DocUtil.getElId("deviceID").focus(option)
                });
                return false;
            }

            if (this.device.password === "") {
                LayerUtil.alert({
                    msg: "디바이스 패스워드는 필수 입력입니다.",
                    callback: option => DocUtil.getElId("devicePW").focus(option)
                });
                return false;
            }

            const regexPassword = /^[a-zA-Z\s0-9]{9,12}$/
            if (!regexPassword.test(this.device.password)) {
                LayerUtil.alert({
                    msg: "디바이스 패스워드는 9~12자 영어, 숫자만 가능하며, 한글, 기호, 띄어쓰기는 사용 불가합니다.",
                    callback: option => DocUtil.getElId("devicePW").focus(option)
                });
                return false;
            }

            if (this.device.location === "") {
                LayerUtil.alert({
                    msg: "디바이스 위치는 필수 입력입니다.",
                    callback: option => DocUtil.getElId("deviceLoc").focus(option)
                });
                return false;
            }

            return true;
        }
    },
    mounted: function () {

        this.initArgs();
        this.getProtocolRules();
        this.getPrdtTypes();

        this.initCompareDeviceMap();
        this.initDeviceMap();

        this.getMyDeviceInfo();
    }
});

function addCompareDevice(devId) {
    for (let idx in deviceWriteApp.compareDevices) {
        const device = deviceWriteApp.compareDevices[idx];
        if (device.devId === devId) {
            console.log(" - " + devId + ", exist" + existDevice(devId));
            if (!existDevice(devId))
                deviceWriteApp.device.addedCompareDevices.push(device);
        }
    }

    deviceWriteApp.hideMapPopup();
}

function existDevice(devId) {
    for (let idx in deviceWriteApp.device.addedCompareDevices ) {
        const device = deviceWriteApp.device.addedCompareDevices[idx];
        if (device.devId === devId) return true;
    }
    return false;
}