let jsonArray;
const currentUrl = location.href;
console.log(currentUrl);
let url = "https://script.google.com/macros/s/AKfycbw3nGs_X5Zvuy1voLOXy-q8c-B_1LV84WKhZFcokqof_PHtQDnzfAbYybmLnqQJlPVC/exec";

fetch(url)
    .then(response => response.json())
    .then(data => {
        // 各シート名とデータが含まれるオブジェクトを処理する
        console.log(data);
        jsonArray = data;
        showQuestion();
    });

function showQuestion() {
    let questiontype = getParam('type');
    console.table(jsonArray[questiontype]);

    let questionlist = jsonArray[questiontype];
    console.log(questionlist);

    let questiontitle = '';
    for (h = 0; h < questionlist.length; h++) {
        questiontitle += '<div class="questionarea" id="' + questionlist[h]['ID'] + '"><div class="title" >' + questionlist[h]['問題文'] + '</div></div>'
    }
    document.getElementById('myForm').innerHTML = questiontitle;

    let form = '';
    for (h = 0; h < questionlist.length; h++) {
        form = '<form id="form-' + questionlist[h]['ID'] + '"></form>'
        document.getElementById(questionlist[h]['ID']).innerHTML += form
    }

    let answer = '';
    for (h = 0; h < questionlist.length; h++) {
        for (i = 1; i < 5; i++) {
            // 正解の選択肢
            if (questionlist[h]['正答'] == questionlist[h]['選択肢' + Number(i)]) {
                console.log(questionlist[h]['選択肢' + Number(i)]);
                answer += '<div class="answerform"><label for="answer' + questionlist[h]['ID'] + '-' + Number(i) + '"><input type="radio" id="answer' + questionlist[h]['ID'] + '-' + Number(i) + '" name="answer' + questionlist[h]['ID'] + '" value="ID=' + questionlist[h]['ID'] + '&category=' + questionlist[h]['category'] + '&type=' + questionlist[h]['type'] + '&level=' + questionlist[h]['level'] + '&結果=TRUE">' + questionlist[h]['選択肢' + Number(i)] + '</label></div>'
            }
            // 不正解の選択肢
            else {
                answer += '<div class="answerform"><label for="answer' + questionlist[h]['ID'] + '-' + Number(i) + '"><input type="radio" id="answer' + questionlist[h]['ID'] + '-' + Number(i) + '" name="answer' + questionlist[h]['ID'] + '" value="ID=' + questionlist[h]['ID'] + '&category=' + questionlist[h]['category'] + '&type=' + questionlist[h]['type'] + '&level=' + questionlist[h]['level'] + '&結果=FALSE">' + questionlist[h]['選択肢' + Number(i)] + '</label></div>'
            }
        }
        document.getElementById('form-' + questionlist[h]['ID']).innerHTML = answer;
        answer = '';
    }
}

var questionarea = $(".questionarea").length;




function submitForm() {


    // const data = [];
    // const forms = document.querySelectorAll("form");

    // forms.forEach((form) => {
    //     const formData = new FormData(form);
    //     const entries = formData.entries();

    //     const checked = [];
    //     for (let pair of entries) {
    //         if (pair[1] === "TRUE") {
    //             const [key, value] = pair[0].split("=");
    //             checked.push({
    //                 [key]: value
    //             });
    //         }
    //     }
    //     data.push(checked);
    // });

    // const url = "https://script.google.com/macros/s/AKfycbxrdega3vG9SKmIz-udWA58jEP47R8iCjPw_IhbzRD010OGDINBTzy6GMcTqoEwVf4s/exec";
    // const options = {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         'Access-Control-Allow-Origin': '*'
    //     },
    //     body: JSON.stringify(data),
    // };

    // fetch(url, options)
    //     .then((response) => console.log(response))
    //     .catch((error) => console.log(error));



    // console.log("発動した")

    let questiontype = getParam('type');
    let questionlist = jsonArray[questiontype];
    console.log(questionlist);

    let form = '';
    let formData = '';
    let xhr = '';
    let selectedform = [];
    for (h = 0; h < questionlist.length; h++) {
        form = document.getElementById("form-" + questionlist[h]['ID']);


        for (var i = 0; i < form.length; i++) {
            if (form[i].checked == true) {
                selectedform.push([new FormData(form)]);
            }
        }
    }

    console.log(selectedform);



    for (h = 0; h < questionlist.length; h++) {
        form = document.getElementById("form-" + questionlist[h]['ID']);

        for (var i = 0; i < form.length; i++) {
            if (form[i].checked == true) {
                formData = new FormData(form);
                console.log(formData);

                xhr = new XMLHttpRequest();
                xhr.open("POST", "https://script.google.com/macros/s/AKfycbyqmkIgpyD42a68H-qqytIt1E_HOQuV6NicDBMJl8uflJzjsBD06OkCoGPwtWBTScwX/exec");
                xhr.send(formData);
                console.log('done');
                // 現在のURLを https://example.com/new/path に書き換え、かつページを再ロードせずに移動する
                history.pushState(null, null, currentUrl);
            } else {
                // 現在のURLを https://example.com/new/path に書き換え、かつページを再ロードせずに移動する
                history.pushState(null, null, currentUrl);
            }
        }
        // 現在のURLを https://example.com/new/path に書き換え、かつページを再ロードせずに移動する
        history.pushState(null, null, currentUrl);

    }


    var radios = document.getElementsByTagName('input');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].type === 'radio') {
            radios[i].checked = false;
        }
    }
}

//クエリの取得
/**
 * Get the URL parameter value
 *
 * @param  name {string} パラメータのキー文字列
 * @return  url {url} 対象のURL文字列（任意）
 */
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}