// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyCjNCNR7ur2_f_4DNaH09Bceex_69htNiE",
  authDomain: "soundnovel-nira14.firebaseapp.com",
  projectId: "soundnovel-nira14",
  storageBucket: "soundnovel-nira14.firebasestorage.app",
  messagingSenderId: "967512531407",
  appId: "1:967512531407:web:db80c5056620fd631572ba",
  measurementId: "G-RT15PNGKSF"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 外部で使えるようにする
window.db = db;
window.collection = collection;
window.addDoc = addDoc;
window.getDocs = getDocs;
window.getDoc = getDoc;
window.doc = doc;
window.deleteDoc = deleteDoc;
window.orderBy = orderBy;
window.query = query;
window.serverTimestamp = serverTimestamp;

// script.js から発火される「publishStory」イベントを検知し、Firestoreに保存する
window.addEventListener('publishStory', async (e) => {
  const story = e.detail;

  try {
    // Firebaseへ保存
    const docRef = await addDoc(collection(db, 'stories'), {
      ...story,
      createdAt: serverTimestamp() // サーバー側の日時を使用
    });

    console.log("保存成功", docRef.id);

    // 下書きをクリア
    localStorage.removeItem('draft_story');

    // 演出
    const container = document.querySelector('.container');
    if (container) {
      container.classList.add('camera-down-leave');
    }

    // 音響効果
    if (window.playPageTurn) window.playPageTurn();
    if (window.saveBgmTime) window.saveBgmTime();

    // 少し待って遷移
    setTimeout(() => {
      location.href = 'novels.html';
    }, 700);

  } catch (error) {
    console.error(error);
    alert('投稿に失敗しました');
  }
});