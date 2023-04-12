// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZe1EOhspxHmBFESDNM5wP-UXcVPJMiCI",
  authDomain: "netflix-clone-7db7e.firebaseapp.com",
  projectId: "netflix-clone-7db7e",
  storageBucket: "netflix-clone-7db7e.appspot.com",
  messagingSenderId: "391930987638",
  appId: "1:391930987638:web:3016479093096e8db38b57",
};

// 使用 getApps() 函式來檢查是否已經建立了 Firebase 應用程式實例。
// 如果沒有則使用 initializeApp() 建立一個新的實例，並將 Firebase 的配置作為參數傳入。
// 如果已經建立了應用程式實例，則使用 getApp() 函式來取得現有的應用程式實例。
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();

export { auth, db };
export default app;
