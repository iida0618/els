let jsonArray;

fetch("https://script.google.com/macros/s/AKfycbzmlrkPAu-n3oTHlCzdamehUPrZ2pguJUsfFFC_-Tx5boqEgAYgR7lKsHsp_RN0j4P8/exec")
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
            if (questionlist[h]['正答'] == i) {
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

// function submitForm() {
//     let questiontype = getParam('type');
//     let questionlist = jsonArray[questiontype];
//     console.log(questionlist);

//     let url = "https://script.google.com/macros/s/AKfycbwHAHfO6_D_lfYrLhtWZLs7qsHs88Wi582EwVuq1F1sKwzQMFvpWZyoxkkdJizRcvzA/exec";

//     for (h = 0; h < questionlist.length; h++) {
//         let form = document.getElementById("form-" + questionlist[h]['ID']);
//         let formData = new FormData(form);

//         let xhr = new XMLHttpRequest();
//         xhr.open("POST", url);
//         xhr.send(formData);

//         $("input:radio[name=answer" + questionlist[h]['ID'] + "]:checked").checked = false;
//     }

//     var radios = document.getElementsByTagName('input');
//     for (var i = 0; i < radios.length; i++) {
//         if (radios[i].type === 'radio') {
//             radios[i].checked = false;
//         }
//     }
// }

function submitResult() {
    let questiontype = getParam('type');
    let questionlist = jsonArray[questiontype];
    console.log(questionlist);

    for (h = 0; h < questionlist.length; h++) {
        let form = document.getElementById("form-" + questionlist[h]['ID']);
        return submitForm(form);
    }

    var radios = document.getElementsByTagName('input');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].type === 'radio') {
            radios[i].checked = false;
        }
    }
}


function submitForm(a) {
    event.preventDefault(); // デフォルトの送信処理を防止

    var form = a;
    var formData = new FormData(form);

    var payload = {};

    for (const [name, value] of formData) {
        if (!payload[name]) {
            payload[name] = value;
        } else {
            payload[name] += "&" + value;
        }
    }

    var url = "https://script.google.com/macros/s/AKfycbzmlrkPAu-n3oTHlCzdamehUPrZ2pguJUsfFFC_-Tx5boqEgAYgR7lKsHsp_RN0j4P8/exec";
    var options = {
        method: "post",
        payload: payload
    };

    var xhr = new XMLHttpRequest();
    xhr.open(options.method, url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
        }
    };
    var encodedData = Object.keys(options.payload).map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(options.payload[k]);
    }).join("&");
    xhr.send(encodedData);
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