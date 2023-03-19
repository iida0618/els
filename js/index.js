let jsonArray;

fetch("https://script.google.com/macros/s/AKfycbxZWn3KevKdBOh3-dRfRd2hdmj3pRafkwyjeTdS9TKED9uOX2RqdpWhsUpKVeo0UkNA/exec")
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

var questionarea = $(".questionarea").length;


function submitForm() {
    let questiontype = getParam('type');
    let questionlist = jsonArray[questiontype];
    console.log(questionlist);

    var form = ''
    for (h = 0; h < questionlist.length; h++) {
        form = document.getElementById("form-" + questionlist[h]['ID']);
        var formData = new FormData(form);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://script.google.com/macros/s/AKfycbxZWn3KevKdBOh3-dRfRd2hdmj3pRafkwyjeTdS9TKED9uOX2RqdpWhsUpKVeo0UkNA/exec");
        xhr.send(formData);
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