import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBj5cnZHDoFBejc_tlYF9cyJHH0XAWO9aE",
	authDomain: "lembar-edukatif.firebaseapp.com",
	projectId: "lembar-edukatif",
	storageBucket: "lembar-edukatif.firebasestorage.app",
	messagingSenderId: "647416969251",
	appId: "1:647416969251:web:580c56879b5cf7a1aa5996",
	measurementId: "G-QT3VE92LYV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, addDoc, collection, doc, getDoc, getDocs };
