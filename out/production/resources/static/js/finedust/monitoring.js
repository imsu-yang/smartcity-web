
var monitoringApp = new Vue({
    el: "#monitoring",
    data: {
        vmap: '',
        markerLayer: '',
        compareDevices: [],
        testDevices: [],
        device: '',
        compareDevices: [],     //특정 디바이스의 비교 디바이스들
        testDevices: [],        //내 디바이스들
        device:'',              //특정 디바이스
        selObsItemId: '',
        selCompareDeviceId: ''
    },
    mixins: [mntrMixin],
    watch: {

    },
    methods: {
        /**
        * 해당 기기의 선택한 측정항목 조회
        */
        selectObsItemId: function(obsItemId) {
            console.log("------- selectObsItemId "+obsItemId+" -------");
            this.selObsItemId = obsItemId;

            // 디바이스 측정 통계 목록 조회
            this.selectDevObsStscList();
        },
        /**
        * 선택한 비교 디바이스 조회
        */
        selectCompareDevice: function(devId) {
            console.log("------- selectCompareDevice "+devId+" -------");
            this.selCompareDeviceId = devId;

            this.compareDevices.forEach(function (item, index) {
                if (item.devId == devId) {
                    console.log(item);
                }
            });

            // 디바이스 측정 통계 목록 조회
            this.selectDevObsStscList();
        },
        /**
         *  선택한 테스트 디바이스 조회
        */
        selectTestDevice: function(devId) {

            var $this = this;
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/management/monitor/device/"+devId,
                reqType: "url",
                success: function(res) {
                    console.log("------- select device ("+devId+") -----");

                    $this.device = res.data;

                    $this.selObsItemId = $this.device.obsDataList[0].obsItemId;

                    console.log($this.device);
                    console.log($this.device.devId);
                    $this.getCompareDevices($this.device.devId);
                }
            });

        },
        /**
         * 나의 모든 테스트 디바이스들 조회
         */
        getMyDevices: function() {
            var $this = this;

            AjaxUtil.post({
                /**
                 * API Mapping : co.kesti.smartcity.controller.DevInfoController.getMyTestDevInfoList(RequestMy)
                 * Referenced table : testbedweb.dev_info, testbedweb.dev_realtime_obs
                 * */
                url: GblVar.apiUrl + "/api/management/monitor/my/test-devices",
                param: {
                    cretrId: SessionUtil.getMbrId(),
                    adminYn: SessionUtil.getAdminYn()
                },
                reqType: "json",
                success: function(res) {
                    console.log("------- my test devices -----");
                    $this.testDevices = res.data;

                    for (var idx in $this.testDevices) {
                        var device = $this.testDevices[idx];
                        $this.addMarker(device);
                    }

                    if ($this.testDevices.length > 0) {
                        var device = $this.testDevices[0];
                        $this.selectTestDevice(device.devInfo.devId);
                        //$this.getCompareDevices(device.devInfo.devId);
                    }
                }
            });
        },
        /**
         * 해당 기기의 모든 비교 디바이스들 정보 조회
         */
        getCompareDevices: function(devId) {
            var $this = this;
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/management/monitor/compare-devices/" + devId,
                reqType: "url",
                success: function(res) {
                    console.log("------- compareDevices -----");
                    console.log(res.data);
                    $this.compareDevices = res.data;

                }
            });
        },
        /**
         * 지도 객체 생성
         */
        drawDeviceMap: function() {
            // EPSG:3857
            vw.ol3.MapOptions = {
                basemapType: vw.ol3.BasemapType.GRAPHIC,
                controlDensity: vw.ol3.DensityType.EMPTY,
                interactionDensity: vw.ol3.DensityType.BASIC,
                controlsAutoArrange: true,
                homePosition: vw.ol3.CameraPosition,
                initPosition: vw.ol3.CameraPosition
            };

            this.vmap = new vw.ol3.Map("vmap",  vw.ol3.MapOptions);

            var initLocation = [14115692.360860242,4488954.793474106];
            this.vmap.getView().setCenter(initLocation);
            this.vmap.getView().setZoom(12);

            this.markerLayer = new vw.ol3.layer.Marker(this.vmap);
            this.vmap.addLayer(this.markerLayer);

        },
        /**
         * //지도 위에 마커를 그린다
         * @param deviceMonitor
         */
        addMarker: function(deviceMonitor) {
            var longitude = deviceMonitor.devInfo.lngitVal;
            var latitude = deviceMonitor.devInfo.latitVal;
            var devName = deviceMonitor.devInfo.devName;
            var address = deviceMonitor.address;
            var markerIcon = deviceMonitor.markerIcon;
            const content = `
                <div>
<!--                    <a href="javascript:selectTestDeviceOnMap('\${deviceMonitor.devInfo.devId}')" style="color: #239deb;">디바이스 선택</a>-->
                    <label>${deviceMonitor.devInfo.devId}</label>
                    <a href="javascript:selectTestDeviceOnMap('${deviceMonitor.devInfo.devId}')" style="color: #239deb;">디바이스 선택</a>
                    <a href="/finedust/statistics" style="color: #e48150;">측정값 상세보기</a>
                </div>`;

            // console.log("add marker: "+longitude+", "+latitude+", "+devName+", "+markerIcon);
            vw.ol3.markerOption = {
                x : longitude,
                y : latitude,
                epsg : "EPSG:4326",
                title : devName,
                contents : content,
                iconUrl : '/img/'+markerIcon,
                text : {
                    offsetX: 0.5, //위치설정
                    offsetY: 20,   //위치설정
                    font: '14px Calibri,sans-serif',
                    fill: {color: '#000'},
                    stroke: {color: '#fff', width: 2},
                    text: ""
                },
                attr: {"id":deviceMonitor.devInfo.devId, "name":"속성명1"}
            };
            this.markerLayer.addMarker(vw.ol3.markerOption);

        },
        initPage: function() {
            this.drawDeviceMap();
            this.getMyDevices();
        }
    },
    mounted: function() {
        // 페이지 초기화
        this.initPage();

        // 차트 리사이즈
        this.onChrtResize();
    }
});

function selectTestDeviceOnMap(devId) {
    monitoringApp.selectTestDevice(devId);
}