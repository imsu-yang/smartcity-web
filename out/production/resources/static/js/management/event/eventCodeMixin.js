/**
 * Description : 커뮤니티 > 이벤트 코드 mixin
 * Author      : atom
 * Date        : 2020.08.01
 */
var evtCdMixin = {

    data: function() {
        return {
            // 공통코드정보
            comCdVo: {
                // 이벤트발생구분목록
                evtOccrDivList: [
                    {
                        key: "A",
                        txt: "다바이스 연결 상태"
                    },
                    {
                        key: "B",
                        txt: "디바이스 측정"
                    }
                ],

                // 이벤트발생구분정보
                evtOccrDivMap: {
                    "A": "다바이스 연결 상태",
                    "B": "디바이스 측정"
                },

                // 이벤트발생조건구분목록
                evtOccrCondDivList: [
                    {
                        key: "HH",
                        txt: "시간"
                    },
                    {
                        key: "MM",
                        txt: "분"
                    },
                    {
                        key: "SS",
                        txt: "초"
                    }
                ],

                // 이벤트발생조건구분정보
                evtOccrCondDivMap: {
                    "HH": "시간",
                    "MM": "분",
                    "SS": "초"
                },
            }
        };
    }

};
