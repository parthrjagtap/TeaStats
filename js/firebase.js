import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebase = {
    apiKey: "AIzaSyA_Ylx97NTLEloDSXGPu_cnSalbYLbSBeg",
    authDomain: "tea-stats.firebaseapp.com",
    projectId: "tea-stats",
    storageBucket: "tea-stats.appspot.com",
    messagingSenderId: "114184022516",
    appId: "1:114184022516:web:ba4e22a7f8b747f3b131a1",
    measurementId: "G-6RLR7M7XF9"
};

const app = initializeApp(firebase);
const db = getFirestore(app);

export { db };
