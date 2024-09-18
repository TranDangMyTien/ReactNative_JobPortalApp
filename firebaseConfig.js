// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7LTcOQ9jrbEpZkyPl93o-jc0pATEJa-A",
  authDomain: "oujob-aa6f4.firebaseapp.com",
  projectId: "oujob-aa6f4",
  storageBucket: "oujob-aa6f4.appspot.com",
  messagingSenderId: "682401577366",
  appId: "1:682401577366:web:be9db1363a007ffbcec5b7",
  measurementId: "G-Y2WSQQ57Q7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);


//IOS: 899497425158-6vcg6s5t4s0o64drl57uitivp0d4jebo.apps.googleusercontent.com
// BF:2E:47:2C:EA:E4:18:AE:7C:0E:34:0F:9F:A8:41:9D:DA:CA:0C:D6
//Android: 899497425158-vhcrste5is511btu4vijtadb4sssetl1.apps.googleusercontent.com
//https://console.cloud.google.com/apis/credentials/oauthclient/682401577366-u811p6igcvdmh11ao3rhtannd1e4b4p4.apps.googleusercontent.com?project=oujob2024