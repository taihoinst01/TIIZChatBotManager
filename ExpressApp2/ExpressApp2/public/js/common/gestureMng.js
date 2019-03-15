//가장 먼저 실행.
var language;
;(function($) {
    $.ajax({
        url: '/jsLang',
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            language= data.lang;
        }
    });
})(jQuery);

$(document).ready(function() {
    makeGetureTable();
});

$(document).ready(function() {

    //검색
    $('#searchBtn').click(function() {
        makeGetureTable(1);
    });

    //엔터로 검색
    $('#searchName, #searchId').on('keypress', function(e) {
        if (e.keyCode == 13) makeGetureTable();
    });
});

$(document).on('click', '#gestureListTablePaging .li_paging', function (e) {
    if (!$(this).hasClass('active')) {
        makeGetureTable($(this).val());
    }
});

var searchQuestiontText = ""; //페이징시 필요한 검색어 담아두는 변수
var searchIntentText = ""; //페이징시 필요한 검색어 담아두는 변수
var listPageNo = "";
function makeGetureTable(page) {
    if (page) {
        //$('#currentPage').val(1);
        searchQuestiontText = $('#searchQuestion').val();
        searchIntentText = $('#searchIntent').val();
    }

    params = {
        //'currentPage': ($('#currentPage').val() == '') ? 1 : $('#currentPage').val(),
        'currentPage': ($('#currentPage').val() == '') ? 1 : page,
        'searchQuestiontText': searchQuestiontText,
        'searchIntentText': searchIntentText
    };
    listPageNo = ($('#currentPage').val() == '') ? 1 : page;
    $.ajax({
        type: 'POST',
        data: params,
        url: '/qna/selectGestureList',
        success: function (data) {
            if (data.loginStatus == '___LOGIN_TIME_OUT_Y___') {
                alert($('#timeoutLogOut').val());
                location.href = '/users/logout';
            }
            if (data.loginStatus == '___DUPLE_LOGIN_Y___') {
                alert($('#timeoutLogOut').val());
                location.href = '/users/logout';
            }
            if (data.loginStatus == 'DUPLE_LOGIN') { 
                alert($('#dupleMassage').val());
                location.href = '/users/logout';
            }

            if (data.rows) {

                var tableHtml = "";
                var saveTableHtml = "";
                for (var i = 0; i < data.rows.length; i++) {
                    var gestureText = "";
                    switch (data.rows[i].GESTURE){
                        case 1:
                            gestureText = "화남. 화내며 분해하는 모습";
                            break;
                        case 2:
                            gestureText = "야호. 한쪽팔을 들며 점프";
                            break;
                        case 3:
                            gestureText = "혼란. 머리를 양손으로 잡고 좌우로 흔들고 찡그린 표정";
                            break;
                        case 4:
                            gestureText = "울리. 양손으로 눈물을 훔침";
                            break;
                        case 5:
                            gestureText = "귀여움. 양손으로 V를 함.";
                            break;
                        case 6:
                            gestureText = "멍때리기. 귀를 쫑긋하고 가만히 서 있음.";
                            break;
                        case 7:
                            gestureText = "신남. 양팔을 위로 뻗으며 팔짝팔짝 뛴다";
                            break;
                        case 8:
                            gestureText = "인사. 허리를 90도로 꺽으며 공손하게 인사";
                            break;
                        case 9:
                            gestureText = "인사. 가볍게 손을 흔들며 인사";
                            break;
                        case 10:
                            gestureText = "기본표정.잔잔한 미소";
                            break;
                        case 11:
                            gestureText = "흥미. 눈이 반짝반짝하는 표정으로 고개를 앞으로 내밀며 관심을 보임";
                            break;
                        case 12:
                            gestureText = "기쁨.";
                            break;
                        case 13:
                            gestureText = "좋음. 눈에 하트가 뿅뿅";
                            break;
                        case 14:
                            gestureText = "부정. 팔로 X자 표현";
                            break;
                        case 15:
                            gestureText = "부정. 팔을 허리에 대고 고개를 흔듬";
                            break;
                        case 16:
                            gestureText = "긍정. 손으로 OK";
                            break;
                        case 17:
                            gestureText = "긍정. 팔로 동그라미 표현";
                            break;
                        case 18:
                            gestureText = "졸림. 졸다가 넘어질뻔 함";
                            break;
                        case 19:
                            gestureText = "생각하는 표정. 고개를 갸우뚱";
                            break;
                        case 20:
                            gestureText = "윙크";
                            break;
                        default:
                            gestureText = "gesture Error";
                    }

                    tableHtml += '<tr><td>' + data.rows[i].NUM + '</td>';
                    tableHtml += '<td class="txt_left">' + data.rows[i].DLG_QUESTION + '</td>';
                    tableHtml += '<td>' + data.rows[i].INTENT + '</td>';
                    tableHtml += '<td class="txt_left">' + data.rows[i].subQryList[0].ANSWER + '</td>';
                    tableHtml += '<td class="text01">' + gestureText + '</td>';
                    tableHtml += '<td>';
                    tableHtml += '<input type="hidden" name="hiddenGestureVal" value="' + data.rows[i].GESTURE + '"/>'
                    tableHtml += '<button type="button" class="btn btn-default btn-sm" id="update_gesture" dlg_id="' + data.rows[i].DLG_ID + '"><i class="fa fa-edit"></i> '+language.UPDATE+'</button>';
                    tableHtml += '</td>';
                    tableHtml += '</tr>';
                }
                //tableHtml += '</tr>';

                saveTableHtml = tableHtml;
                
                if (saveTableHtml == "") {
                    saveTableHtml = '<tr><td colspan="4" class="text-center">No Gesture Data</td></tr>';
                }
                $('#gestureListBody').html(saveTableHtml);

                //사용자의 appList 출력
                $('#gestureListBody').find('tr').eq(0).children().eq(0).trigger('click');

                $('#gestureListTablePaging .pagination').html('').append(data.pageList);

            } else {
                saveTableHtml = '<tr><td colspan="6" class="text-center">No Gesture Data</td></tr>';
                $('#gestureListBody').html(saveTableHtml);
                $('#gestureListTablePaging .pagination').html('');
            }

        }
    });
}

//수정폼
$(document).on("click", "#update_gesture", function () {
        
    document.gestureForm.reset();
    var dlg_id = $(this).attr("dlg_id");
    var tr = $(this).parent().parent();
    var td = tr.children();
    var gestureVal = td.eq(5).find('input[name=hiddenGestureVal]').val();
    document.gestureForm.DLG_ID.value = dlg_id;
    
    $('#DLG_QUESTION').html(td.eq(1).text());
    $('#INTENT').html(td.eq(2).text());
    $('#DLG_ANSWER').html(td.eq(3).text());
    getGestureSelect(gestureVal);
    
    $('#footer_button').html('<button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i> '+language.CLOSE+'</button><button type="button" class="btn btn-primary" id="updateGestureBtn"><i class="fa fa-edit"></i> '+language.UPDATE+'</button>');

    $('#gestureFormModal').modal('show');
});

//수정 버튼
$(document).on("click", "#updateGestureBtn", function () {
    updateGesture();
});

function getGestureSelect(gestureVal){
    var select_gesture = "";
    for(var i=1; i<21; i++){
        var gestureText = "";
        var selectText = "";
        switch (i){
            case 1:
                gestureText = "화남. 화내며 분해하는 모습";
                break;
            case 2:
                gestureText = "야호. 한쪽팔을 들며 점프";
                break;
            case 3:
                gestureText = "혼란. 머리를 양손으로 잡고 좌우로 흔들고 찡그린 표정";
                break;
            case 4:
                gestureText = "울리. 양손으로 눈물을 훔침";
                break;
            case 5:
                gestureText = "귀여움. 양손으로 V를 함.";
                break;
            case 6:
                gestureText = "멍때리기. 귀를 쫑긋하고 가만히 서 있음.";
                break;
            case 7:
                gestureText = "신남. 양팔을 위로 뻗으며 팔짝팔짝 뛴다";
                break;
            case 8:
                gestureText = "인사. 허리를 90도로 꺽으며 공손하게 인사";
                break;
            case 9:
                gestureText = "인사. 가볍게 손을 흔들며 인사";
                break;
            case 10:
                gestureText = "기본표정.잔잔한 미소";
                break;
            case 11:
                gestureText = "흥미. 눈이 반짝반짝하는 표정으로 고개를 앞으로 내밀며 관심을 보임";
                break;
            case 12:
                gestureText = "기쁨.";
                break;
            case 13:
                gestureText = "좋음. 눈에 하트가 뿅뿅";
                break;
            case 14:
                gestureText = "부정. 팔로 X자 표현";
                break;
            case 15:
                gestureText = "부정. 팔을 허리에 대고 고개를 흔듬";
                break;
            case 16:
                gestureText = "긍정. 손으로 OK";
                break;
            case 17:
                gestureText = "긍정. 팔로 동그라미 표현";
                break;
            case 18:
                gestureText = "졸림. 졸다가 넘어질뻔 함";
                break;
            case 19:
                gestureText = "생각하는 표정. 고개를 갸우뚱";
                break;
            case 20:
                gestureText = "윙크";
                break;
            default:
                gestureText = "gesture Error";
        }

        if(i==gestureVal){
            selectText = "selected";
        }
        select_gesture += "<option value='"+i+"' "+selectText+">"+gestureText+"</option>";
        $('#GESTURE').html(select_gesture);
    }
}

function updateGesture() {
    var saveArr = new Array();
    var data = new Object();

    data.DLG_ID = document.gestureForm.DLG_ID.value;
    data.GESTURE = document.gestureForm.GESTURE.value
    
    saveArr.push(data);

    var jsonData = JSON.stringify(saveArr);
    var params = {
        'saveArr': jsonData
    };
    $.ajax({
        type: 'POST',
        datatype: "JSON",
        data: params,
        url: '/qna/updateGesture',
        success: function (data) {
            if (data.loginStatus == '___LOGIN_TIME_OUT_Y___') {
                alert($('#timeoutLogOut').val());
                location.href = '/users/logout';
            }
            if (data.loginStatus == '___DUPLE_LOGIN_Y___') {
                alert($('#timeoutLogOut').val());
                location.href = '/users/logout';
            }
            if (data.loginStatus == 'DUPLE_LOGIN') { 
                alert($('#dupleMassage').val());
                location.href = '/users/logout';
            }
            console.log(data);
            if (data.status === 200) {
                $('#gestureFormModal').modal('hide');
                $('#proc_content').html(language.REGIST_SUCC);
                $('#proc_footer_button').html('<button type="button" class="btn btn-default" onClick="reloadPage();return false;"><i class="fa fa-times"></i> Close</button>');
                $('#procGesture').modal('show');
            } else {
                $('#gestureFormModal').modal('hide');
                $('#proc_content').html(language.It_failed);
                $('#proc_footer_button').html('<button type="button" class="btn btn-default" onClick="reloadPage();return false;"><i class="fa fa-times"></i> Close</button>');
                $('#procGesture').modal('show');
            }
        }
    });
}

function reloadPage(){
    //window.location.reload();
    $('#procGesture').modal('hide');
    makeGetureTable(listPageNo);
    
}