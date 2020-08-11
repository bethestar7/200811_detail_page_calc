$(document).ready(function(){
    // 8/11
    $('#crush').change(function(){
        var $sel = $(this).val(); //value값이 없으므로 text를 담게 됨
        $('.result_opt1').text($sel);
    });
    $('#gram').change(function(){
        var $sel = $(this).val();
        $('.result_opt2').text($sel);
    });

    var $str_price = $('.det_price span').text();            //기본판매가 담기(문자)
    var $num_price = parseFloat($str_price.replace(',', ''));//기본판매가를 (쉼표빼면서) 문자열에서 수로 변경하기
    var $total = 0;        //총금액의 숫자형 데이터
    var $final_total = ''; //총금액의 문자형 데이터
    var $each_price = 0;       //각 선택 박스의 금액(숫자형)
    var $each_calc_price = []; //각 아이템 별로 1개 단위마다 기본값(대기값) (배열 데이터)
    var $amount = [];          //각 아이템 별 수량 (배열 데이터)
    var $each_total_price = [];//각 아이템 별 최종값 (배열 데이터)

    $('.total_price_num span').text($total); //초기의 총 금액

    var $each_box = `
    <li class="my_item">
        <div class="det_count">
            <div class="det_count_tit">
                <p class="opt_01">원두(분쇄없음)</p>
                <p class="opt_02">200g</p>
            </div>
            <div class="det_count_bx">
                <a class="minus" href="#">－</a>
                <input type="text" value="1" readonly>
                <a class="plus" href="#">＋</a>
            </div>
            <div class="det_count_price"><span class="each_price">14,000</span>원</div>
            <div class="item_del"><span>×</span></div>
        </div>
    </li>
    `;

    $('.det_total_price').hide(); //일단 처음에는 총 가격을 숨기기
    $('select#crush option:eq(0), select#gram option:eq(0)').prop('selected', true); //처음엔 '옵션선택'보이게하기

    function calc_price(){
        //각 항목에 대한 추가(위에 선언한 변수들)
        $total = 0; //값이 추가되는 부분을 막아야 함. 클릭할 때마다 새로 받아오기?
        for(i=0; i<$each_total_price.length; i++){
            $total += $each_total_price[i]; //최종 배열 데이터 내의 모든 값을 더해서 $total에 담음
        }
        
        if($total == 0){ //총 금액이 0이라면 
            $('.det_total_price').hide(); //.det_total_price를 보여주지 않는다.
            $('select option').prop('selected', false); //option값도 기본으로 다시 바꿔놓기
            $('select#crush option:eq(0), select#gram option:eq(0)').prop('selected', true); //option값도 기본으로 다시 바꿔놓기
        }else{           //총 금액이 0이 아니라면 
            $('.det_total_price').show(); //.det_total_price를 보여준다.
        }

        $final_total = $total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');//문자형으로 바꾸기
        $('.total_price_num span').text($final_total); //릐얼 총 금액 표기 (각 li금액 전부 포함한)
    };

    //각 아이템 박스에서 'x' 클릭 시
    $(document).on('click', '.item_del', function(){
        var $del_index = $(this).closest('li').index();
        $each_total_price.splice($del_index, 1); //해당하는 인덱스번호부터 개수만큼 데이터를 삭제하고 나머지는 저장
        $each_calc_price.splice($del_index, 1);
        $amount.splice($del_index, 1);

        console.log($each_total_price);
        console.log($each_calc_price);
        console.log($amount);

        $(this).closest('li').remove(); //숨기는 게 아니고 아예 날려야 함

        calc_price();
    });

    //조건. 1번 셀렉트 박스가 선택된 상태된 후, 2번 셀렉트 박스가 선택됐을 때 change 이벤트를 걸어서 각 세부항목인 .my_item을 ul의 마지막 자식으로 추가
    $('.form_crush select').change(function(){ //첫번째 박스 선택해야 두번째 박스 선택 가능하게
        $('.form_gram select').removeAttr('disabled'); 
    });
    $('.form_gram select').change(function(){
        $('.opt_box').append($each_box);

        var $opt_01 = $('#crush option:selected').text();
        console.log('나의 첫번째 선택: ' + $opt_01);
        var $opt_02 = $('#gram option:selected').text();
        console.log('나의 두번째 선택: ' + $opt_02);
        var $opt_02_val = parseFloat($(this).val()); //this 대신 '.form_gram select' 해도 됨. 숫자로 저장하기
        console.log('나의 두번째 선택 value값: ' + $opt_02_val);
        $('.opt_box li:last .opt_01').text($opt_01); //last를 안 하면 모든 li가 다 바뀜
        $('.opt_box li:last .opt_02').text($opt_02);

        $present_price = $num_price + $opt_02_val;
        console.log('선택을 마친 기본가 + 옵션가: ' + $present_price);
       
        $each_total_price.push($present_price); //$present_price를 $each_total_price배열의 마지막 인덱스로 추가(변동값)
        console.log($each_total_price); //옵션가 포함한 가격을 배열데이터로 저장한 것임

        $each_calc_price.push($present_price); //1개 단위마다 기본값에 $present_price 넣음
        console.log($each_calc_price);  //내부에서 +나 -버튼 클릭시, 수량과 함께 계산해야 할 데이터(각 기본값?)(고정값)

        $amount.push(1); //각 아이템 별 수량 (배열 데이터)에 초기값으로 1 넣음(숫자형데이터)
        console.log($amount);
        
        var $result_opt = $present_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); //문자열로바꾸면서쉼표넣기
        $('.opt_box li:last .each_price').text($result_opt); //li박스 추가 시, each_price자리에 넣음

        calc_price();
    });

    //각 아이템 박스에서 '-' 클릭 시
    $(document).on('click', '.minus', function(){
        var $index = $(this).closest('li').index();
        if($amount[$index] != 1){ //1이 아니면 수량 감소, 1인 경우에는 수량 감소 안 시킴
            $amount[$index]--; //수량 감소
            console.log($amount);
            $(this).siblings('input').val($amount[$index]); //인풋박스에 감소 수량 표기

            $each_total_price[$index] = $each_calc_price[$index] * $amount[$index];//최종 배열 데이터 = 기본값 * 수량. 각 선택박스의 최종 값
            console.log($each_total_price);//변동값(수량바꿀때마다 바뀜)
            console.log($each_calc_price); //고정값

            var $result_price = $each_total_price[$index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            $(this).closest('.det_count_bx').siblings('.det_count_price').find('.each_price').text($result_price);//각li의 가격 자리에 가격 넣는 거

            calc_price();
        }
        return false;
    });

    //각 아이템 박스에서 '+' 클릭 시
    $(document).on('click', '.plus', function(){
        var $index = $(this).closest('li').index();
        $amount[$index]++; //수량 증가. 셀렉트박스 선택할 때마다 $amount에 1이 들어가서 배열이 이루어짐. 첫번째 박스가 생성됐다면 $amount=[1] 인 상태. 여기서 $index에 해당 클릭한 a의 부모인 li의 인덱스번호를 넣어서 0번 index가 75번줄에 들어가면 amount의 0번 인덱스인 1이 되고 ++니까 결론적으로 2가 됨
        //console.log($amount[$index]); //1, 2, 3, 4, 5, 6...
        console.log($amount);         //[1, 1], [1, 2]...

        $(this).siblings('input').val($amount[$index]); //인풋박스에 증가 수량 표기
        $each_total_price[$index] = $each_calc_price[$index] * $amount[$index];//최종 배열 데이터 = 기본값 * 수량. 각 선택박스의 최종 값
        console.log($each_total_price);//변동값(수량바꿀때마다 바뀜)
        console.log($each_calc_price); //고정값

        var $result_price = $each_total_price[$index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        $(this).closest('.det_count_bx').siblings('.det_count_price').find('.each_price').text($result_price);//각li의 가격 자리에 가격 넣는 거

        calc_price();

        return false;
    });


});