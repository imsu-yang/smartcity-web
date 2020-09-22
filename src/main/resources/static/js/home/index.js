
var homeApp = new Vue({
    el: "#fullpage",
    data: {
        vmap: '',
        markerLayer: '',
        testDevices: [],
        stats: {
            device: {
                static: 0,
                move: 0,
                port: 0
            },
            testDevice: {
                static: 0,
                move: 0,
                port: 0
            },
            country: {
                korea: 0,
                usa: 0,
                indonesia: 0,
                taiwan: 0,
                vietnam: 0
            },

        },
        device:'',

        // 공지사항목록
        notiList: [],

        // 포럼그룹목록
        frumGrpList: []
    },
    watch: {

    },
    methods: {
        getDeviceStats: function() {
            var $this = this;
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/management/monitor/stats-device",
                reqType: "url",
                success: function(res) {
                    console.log("------- device Stats -----");
                    console.log(res.data);
                    $this.stats = res.data;
                }
            });
        },
        getTestDevices: function() {
            var $this = this;
            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/management/monitor/test-devices",
                reqType: "url",
                success: function(res) {
                    console.log("------- test Devices -----");
                    console.log(res.data);
                    $this.testDevices = res.data;

                    for (var idx in $this.testDevices ) {
                        var deviceMonitor = $this.testDevices[idx];
                        $this.addMarker(deviceMonitor);
                    }
                }
            });
        },
        drawDeviceMap: function() {

            var $this = this;
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


            this.vmap.on("click", function (evt) {
                var coordinate = evt.coordinate; //좌표정보

                var lonlat = ol.proj.transform(coordinate,'EPSG:900913', "EPSG:4326");
                var longitude = lonlat[0];
                var latitude = lonlat[1];
                console.log("click: "+coordinate);

            });

        },
        addMarker: function(deviceMonitor) {
            var longitude = deviceMonitor.devInfo.lngitVal;
            var latitude = deviceMonitor.devInfo.latitVal;
            var devName = deviceMonitor.devInfo.devName;
            var address = deviceMonitor.address;
            var markerIcon = deviceMonitor.markerIcon;
            var content = "<div>" +
                // "<p><i><img src=\"../img/location_icon.png\" alt=\"위치 아이콘\"></i>"+address+"</p>" +
                "<a href=\"javascript:selectDeviceOnMap('"+deviceMonitor.devInfo.devId+"')\" style='color:#239deb'>비교 디바이스 추가</a>" +
                "<a href=\"/finedust/statistics\" style='color:#e48150'>측정값 상세보기</a>" +
                "</div>";

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

        /**
         * 메인 공지사항 목록 조회
         */
        selectMainNotiList: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/community/notice/selectMainNotiList",
                param: null,
                success: function(response) {
                    $this.notiList = response.data;
                }
            });
        },

        /**
         * 포럼 그룹 목록 조회
         */
        selectFrumGrpList: function() {
            var $this = this;

            AjaxUtil.get({
                url: GblVar.apiUrl + "/api/community/forum/selectFrumGrpList",
                param: null,
                success: function(response) {
                    $this.frumGrpList = response.data;
                }
            });
        },

        /**
         * 페이지 초기화
         */
        initPage: function() {
            this.drawDeviceMap();
            this.getTestDevices();
            this.getDeviceStats();
            this.selectMainNotiList();
            this.selectFrumGrpList();
        }
    },
    mounted: function() {
        // 페이지 초기화
        this.initPage();
    }
});

function selectDeviceOnMap(devId) {
    window.location.href = "/management/device/write?devId="+devId;
}

