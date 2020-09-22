/**
 * Description : vue 공통 유틸
 * Author      : atom
 * Date        : 2020.07.21
 */

// 숫자 포맷
Vue.filter("formatNumberComa", function(value) {
    if (WebUtil.isNull(value)) {
        return "";
    }

    return WebUtil.addThousandComma(value);
});

// 엔터 br 변환
Vue.filter("enterToBr", function(value) {
    if (WebUtil.isNull(value)) {
        return "";
    }

    return WebUtil.enterToBr(value);
});

// 전역 변수
Vue.mixin({
    data: function() {
        return {
            ComVar: {
                apiUrl: GblVar.apiUrl
            },
            ComUtil: {
                /**
                 * null 체크
                 */
                isNull: function(str) {
                    return WebUtil.isNull(str);
                },

                /**
                 * not null 체크
                 */
                isNotNull: function(str) {
                    return WebUtil.isNotNull(str);
                },

                /**
                 * 숫자 input
                 */
                onNumInput: function(obj, key, target) {
                    // 원본값
                    var orgVal = target.value;

                    // 커서 위치
                    var cursorIndex = orgVal.length - target.selectionStart;

                    // 신규값 - 숫자 체크
                    var newVal = orgVal.replace(/[^0-9]+/g, "");
                    obj[key] = newVal;
                    target.value = newVal;

                    // 커서 위치 설정
                    cursorIndex = newVal.length - cursorIndex;
                    target.setSelectionRange(cursorIndex, cursorIndex);
                }
            },
            AuthUtil: {
                /**
                 * 관리자여부
                 */
                getAdminYn: function() {
                    return SessionUtil.getAdminYn();
                }
            }
        };
    }
});
