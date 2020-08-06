import firebase from 'firebase/app'; //evitar errores con /app
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA8mDNf01hBJ4CKpU4OhvcVPgEGLDQPlFA",
    authDomain: "crud-tareas-6fa39.firebaseapp.com",
    databaseURL: "https://crud-tareas-6fa39.firebaseio.com",
    projectId: "crud-tareas-6fa39",
    storageBucket: "crud-tareas-6fa39.appspot.com",
    messagingSenderId: "924290933731",
    appId: "1:924290933731:web:151b97451c32e1ce42f6d6"
};

//Initialize Firebase
firebase.initializeApp(firebaseConfig);

export {firebase}