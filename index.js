
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js"

const firebaseConfig = {
  apiKey: "AIzaSyBjoxb19fWnFguzRXBRH5jhjpMEddNb-0I",
  authDomain: "fyptraffic-92fba.firebaseapp.com",
  databaseURL: "https://fyptraffic-92fba-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fyptraffic-92fba",
  storageBucket: "fyptraffic-92fba.appspot.com",
  messagingSenderId: "707494421168",
  appId: "1:707494421168:web:537ac76b5cdb09acc3d175",
  measurementId: "G-XF7ZJ9DP8W"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;







      