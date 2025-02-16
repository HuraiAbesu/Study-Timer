let timer;
let isRunning = false;
let studyTime = 1500; // 初期勉強時間: 25分
let breakTime = 300; // 初期休憩時間: 5分
let timeLeft = studyTime;
let onBreak = false;
let loopCount = 3;
let currentLoop = 1;
let activeAlarm = null;

function setTimers() {
    const studyMinutes = parseInt(document.getElementById("studyMinutes").value, 10);
    const breakMinutes = parseInt(document.getElementById("breakMinutes").value, 10);
    loopCount = parseInt(document.getElementById("loopCount").value, 10);
    studyTime = studyMinutes * 60;
    breakTime = breakMinutes * 60;
    timeLeft = studyTime;
    onBreak = false; // 初期状態は勉強モード
    document.getElementById("timer").textContent = formatTime(timeLeft);
    document.getElementById("timer").style.color = "#4a90e2"; // 勉強時間は青色
    drawAnalogClock();
}

function startTimer() {
    if (!isRunning) {
        setTimers(); // スタート時に自動的にセット
        timer = setInterval(updateTimer, 1000);
        isRunning = true;
    }
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    setTimers();
    isRunning = false;
    currentLoop = 1;
    document.getElementById("resumeButton").style.display = "none";
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
        drawAnalogClock(); // アナログ時計を毎秒更新
    } else {
        clearInterval(timer);
        isRunning = false;
        if (onBreak) {
            playAlarm("alarmSound1", "休憩終了です！");
            onBreak = false;
            timeLeft = studyTime; // 次は勉強時間にリセット
            document.getElementById("timer").style.color = "#4a90e2"; // 青色に戻す
        } else {
            playAlarm("alarmSound2", "休憩時間です！");
            onBreak = true;
            timeLeft = breakTime; // 次は休憩時間にリセット
            document.getElementById("timer").style.color = "#FF8C00"; // オレンジ色
        }
    }
}

function updateDisplay() {
    if (onBreak) {
        document.getElementById("timer").textContent = `休憩時間: ${formatTime(timeLeft)}`;
    } else {
        document.getElementById("timer").textContent = formatTime(timeLeft);
    }
}

function resumeTimer() {
    timer = setInterval(updateTimer, 1000); // タイマーの再スタート
    isRunning = true;
}

// アラームのループ再生
function playAlarm(alarmId, message) {
    activeAlarm = document.getElementById(alarmId);
    activeAlarm.play();
    showPopup(message);
}

// ポップアップ表示と非表示
function showPopup(message) {
    document.getElementById("popupMessage").textContent = message;
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    if (activeAlarm) {
        activeAlarm.pause();
        activeAlarm.currentTime = 0;
    }
    resumeTimer(); // ポップアップ閉じたらタイマー再スタート
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// アナログ時計描画関数
function drawAnalogClock() {
    const canvas = document.getElementById("analogClock");
    const ctx = canvas.getContext("2d");
    const radius = canvas.height / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(radius, radius);

    // 時計の外枠
    ctx.beginPath();
    ctx.arc(0, 0, radius - 5, 0, 2 * Math.PI);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 4;
    ctx.stroke();

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    drawHand(ctx, (minutes * Math.PI / 30) + (seconds * Math.PI / 1800), radius * 0.6, 6); // 分針
    drawHand(ctx, (seconds * Math.PI / 30), radius * 0.9, 3); // 秒針
    ctx.translate(-radius, -radius);
}

// 時計の針を描画する関数
function drawHand(ctx, position, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(position);
    ctx.lineTo(0, -length);
    ctx.strokeStyle = "#333";
    ctx.stroke();
    ctx.rotate(-position);
}

window.onload = setTimers;
