import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";

// Your specific Firebase configuration (Already filled for you!)
const firebaseConfig = {
  apiKey: "AIzaSyCwTyKZQs8aI94Ez1Z8sXdcm3qT1Q51CgI",
  authDomain: "kano-auto-hub.firebaseapp.com",
  projectId: "kano-auto-hub",
  storageBucket: "kano-auto-hub.firebasestorage.app",
  messagingSenderId: "461639442333",
  appId: "1:461639442333:web:8224be6fe4542f1d845974",
  measurementId: "G-9G0FYLCZFK"
};

const MY_WHATSAPP = "2348000000000"; // Change this to your real number later!

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const appId = "kano-autohub-v1"; 

let isAdmin = false;

// UI Logic
const loginModal = document.getElementById('loginModal');
const adminPanel = document.getElementById('adminPanel');

document.getElementById('adminTrigger').onclick = () => loginModal.style.display = 'flex';
document.getElementById('closeLogin').onclick = () => loginModal.style.display = 'none';

document.getElementById('btnLogin').onclick = async () => {
    const e = document.getElementById('email').value;
    const p = document.getElementById('pass').value;
    try {
        await signInWithEmailAndPassword(auth, e, p);
        loginModal.style.display = 'none';
    } catch (err) { alert("Login failed. Check your Firebase Users tab."); }
};

document.getElementById('btnLogout').onclick = () => signOut(auth);

onAuthStateChanged(auth, user => {
    isAdmin = !!user;
    adminPanel.classList.toggle('hidden', !isAdmin);
    renderInventory();
});

function renderInventory() {
    const q = query(collection(db, 'cars'), orderBy('time', 'desc'));
    onSnapshot(q, s => {
        const grid = document.getElementById('carGrid');
        grid.innerHTML = "";
        s.forEach(snap => {
            const car = snap.data();
            const id = snap.id;
            const div = document.createElement('div');
            div.className = 'car-card';
            div.innerHTML = `
                ${isAdmin ? `<button class="del-btn" onclick="removeCar('${id}')">DELETE</button>` : ''}
                <div class="img-box"><img src="${car.img}"></div>
                <div class="details">
                    <h3>${car.name}</h3>
                    <p>Price: ₦${car.price}</p>
                    <a href="https://wa.me/${MY_WHATSAPP}" class="btn-wa">WhatsApp</a>
                </div>`;
            grid.appendChild(div);
        });
    });
}

document.getElementById('btnUpload').onclick = async () => {
    const name = document.getElementById('carTitle').value;
    const price = document.getElementById('carPrice').value;
    const file = document.getElementById('carFile').files[0];
    if(!file) return alert("Select a photo");
    
    const sRef = ref(storage, `cars/${Date.now()}`);
    await uploadBytes(sRef, file);
    const img = await getDownloadURL(sRef);
    await addDoc(collection(db, 'cars'), { name, price, img, time: Date.now() });
    alert("Uploaded!");
};

window.removeCar = async (id) => { if(confirm("Delete?")) await deleteDoc(doc(db, 'cars', id)); };
