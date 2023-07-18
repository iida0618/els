let jsonArray;
const currentUrl = location.href;
console.log(currentUrl);
if (getParam('type') == null || getParam('type') == "" || getParam('ID') == null || getParam('ID') == "") {
    window.location.href = '../select.html';
}
let url = "https://script.google.com/macros/s/AKfycbxuVLHrK-UzIzIk3cXItB3TYICWcibXNzbLmR63smy0H3CbjHC9b7birLx2QZZN7q7r/exec";

fetch(url)
    .then(response => response.json())
    .then(data => {
        // 各シート名とデータが含まれるオブジェクトを処理する
        console.log(data);
        jsonArray = data;
        showQuestion();
    });

//問題を表示する関数
function showQuestion() {
    let questiontype = getParam('type');
    console.table(jsonArray[questiontype]);

    let questionlist = jsonArray[questiontype];
    console.log(questionlist);

document.getElementById('question-title').innerHTML = getParam('type')

    let questiontitle = '';
    for (h = 0; h < questionlist.length; h++) {
        questiontitle += '<div class="questionarea" id="' + questionlist[h]['ID'] + '"><div class="title" >' + questionlist[h]['ID'] + '：' + questionlist[h]['問題文'] + '</div></div>'
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
            // 正解の選択肢(value=TRUE)
            if (questionlist[h]['正答'] == questionlist[h]['選択肢' + Number(i)]) {
                answer += '<div class="answerform"><label for="answer' + questionlist[h]['ID'] + '-' + Number(i) + '"><input type="radio" id="answer' + questionlist[h]['ID'] + '-' + Number(i) + '" name="answer' + questionlist[h]['ID'] + '" value="true">' + questionlist[h]['選択肢' + Number(i)] + '</label></div>'
            }
            // 不正解の選択肢(value=FALSE)
            else {
                answer += '<div class="answerform"><label for="answer' + questionlist[h]['ID'] + '-' + Number(i) + '"><input type="radio" id="answer' + questionlist[h]['ID'] + '-' + Number(i) + '" name="answer' + questionlist[h]['ID'] + '" value="false">' + questionlist[h]['選択肢' + Number(i)] + '</label></div>'
            }
        }
        document.getElementById('form-' + questionlist[h]['ID']).innerHTML = answer;
        answer = '';
    }
}

var questionarea = $(".questionarea").length;


let userArray;

async function getUsers() {
    const response = await fetch("https://script.google.com/macros/s/AKfycbygMkwZCa-6mJ7uU5AROMwA-SZ_Px5jqRyOqDehW0a3qeqNdEsseADX9FY7tTihue0d/exec");
    const users = await response.json();
    userArray = users;
}
getUsers();

//選択された回答を送信する関数
function submitForm() {
    getUsers();
    let userId = getParam('ID');

    // ロード画面を表示する要素のIDを取得
    const loader = document.getElementById('loader');
    // ロード画面を表示
    loader.style.display = 'block';

    // シート名を変数に格納
    let sheetName = getParam('type');

    let questiontype = getParam('type');
    let questionlist = jsonArray[questiontype];

    //ループ間の待機時間を1.0秒に設定
    let delay = 1000;

    let promise = Promise.resolve();
    questionlist.forEach((question, h) => {
        promise = promise.then(() => {
            return new Promise((resolve) => {

                let form = document.getElementById("form-" + question['ID']);
                let formData = new FormData(form);

                userArray[0] = userArray[0].filter(user => user.ID === userId);

                if (userArray[0].length > 0) {
                    // シート名を formData に追加
                    formData.append("sheetName", sheetName);

                    //formDataの追加
                    formData.append("ID", questionlist[h]['ID']);
                    console.log(questionlist[h]['ID'])
                    formData.append("category", questionlist[h]['category']);
                    formData.append("type", questionlist[h]['type']);
                    formData.append("level", questionlist[h]['level']);

                    formData.append("user", userArray[0][0]['ID']);
                    formData.append("学部", userArray[0][0]['学部']);
                    formData.append("学年", userArray[0][0]['学年']);
                    formData.append("授業年度", userArray[0][0]['授業年度']);
                    formData.append("class", userArray[0][0]['class']);
                    let radios = form.querySelectorAll('input[type=radio]:checked');

                    if (radios.length > 0) {
                        radios.forEach((radio) => {
                            formData.append(radio.name, radio.value);
                            formData.append("結果", radio.value);
                            formData.append("status", "回答");
                            formData.append("selected", radio.labels[0].textContent);
                        });
                    } else {
                        //未選択の場合、結果をFALSE,statusを未回答に設定
                        let radio = form.querySelector('input[type=radio]');
                        formData.append(radio.name, radio.value);
                        formData.append("結果", "FALSE");
                        formData.append("status", "未回答");
                        formData.append("selected", "");
                    }

                    let xhr = new XMLHttpRequest();
                    xhr.open("POST", "https://script.google.com/macros/s/AKfycbxQ0tnDA6q9SrXHDdgqHlzJUTPy5Cgbs4kKr68vH1e3O_Eb0v7W_sSfW9nLIMONf_cz/exec");
                    xhr.send(formData);
                    console.log('done');
                    history.pushState(null, null, currentUrl);
                    setTimeout(() => {
                        resolve();
                    }, delay);
                } else {
                    // ロード画面を非表示にする
                    loader.style.display = 'none';
                    // アラートを出す
                    alert("登録されてないユーザーです");
                    window.location.href = '../select.html';
                    return;
                }

            });
        });
    });

    promise.then(() => {
        // ロード画面を非表示にする
        loader.style.display = 'none';
        // アラートを出す
        alert("回答の送信が完了しました！");
        $('.answerform').removeClass('selected');
        // 全てのラジオボタンの選択を解除
        var radios = document.getElementsByTagName('input');
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].type === 'radio') {
                radios[i].checked = false;
            }
        }
    });
}

//送信前にポップアップを表示する関数
function validateForm() {
    // ラジオボタンの要素を取得する
    let questiontype = getParam('type');
    let questionlist = jsonArray[questiontype];
    console.log(questionlist);

    let hasUnchecked = false;
    let checkedCount = 0;

    for (let i = 0; i < questionlist.length; i++) {
        const radios = document.getElementsByName("answer" + questionlist[i]['ID']);
        let checked = false;

        for (let j = 0; j < radios.length; j++) {
            if (radios[j].checked) {
                checkedCount++;
                checked = true;
                break;
            }
        }

        if (!checked) {
            hasUnchecked = true;
            break;
        }
    }

    if (hasUnchecked) {
        if (confirm("未選択の項目がありますが、送信してもよろしいですか？")) {
            // はいを選んだ場合
            submitForm();
            return true;
        } else {
            // いいえを選んだ場合
            return false;
        }
    }

    if (checkedCount === 0) {
        alert("少なくとも1つの選択肢を選択してください。");
        return false;
    }

    // 送信を許可した場合はsubmitForm()を呼び出す
    submitForm();
    return true;
}

$(function () {
    //ページャーをクリックしたときの動作
    $(document).on('click', '.answerform', (function () {
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
    }));
})

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