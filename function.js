import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCwTyKZQs8aI94Ez1Z8sXdcm3qT1Q51CgI",
  authDomain: "kano-auto-hub.firebaseapp.com",
  projectId: "kano-auto-hub",
  storageBucket: "kano-auto-hub.firebasestorage.app",
  messagingSenderId: "461639442333",
  appId: "1:461639442333:web:8224be6fe4542f1d845974"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check Login Status
onAuthStateChanged(auth, user => {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        if (user) {
            adminPanel.classList.remove('hidden');
        } else {
            adminPanel.classList.add('hidden');
        }
    }
    renderInventory();
});

// Login Logic
document.getElementById('btnLogin').onclick = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        document.getElementById('loginModal').style.display = 'none';
        alert("Welcome back, Boss!");
    } catch (e) {
        alert("Login Failed: Check your email and password.");
    }
};

// Logout Logic
document.getElementById('btnLogout').onclick = () => signOut(auth);

// Add Car (Using Image Link)
document.getElementById('btnUpload').onclick = async () => {
    const name = document.getElementById('carTitle').value;
    const price = document.getElementById('carPrice').value;
    const imgUrl = prompt("Paste the Image Link (URL) of the car:");

    if (name && price && imgUrl) {
        await addDoc(collection(db, "cars"), {
            name: name,
            price: price,
            img: imgUrl,
            time: Date.now()
        });
        alert("Car added to Kano Auto Hub!");
    }
};

// Show Cars on Page
function renderInventory() {
    const q = query(collection(db, "cars"), orderBy("time", "desc"));
    onSnapshot(q, (snapshot) => {
        const grid = document.getElementById('carGrid');
        grid.innerHTML = "";
        snapshot.forEach(docSnap => {
            const car = docSnap.data();
            const id = docSnap.id;
            const card = document.createElement('div');
            card.className = 'car-card';
            card.innerHTML = `
                <img src="${car.img}" style="width:100%; border-radius:8px;">
                <h3>${car.name}</h3>
                <p>₦${Number(car.price).toLocaleString()}</p>
                <a href="https://wa.me/2348000000000" class="btn-wa">WhatsApp Dealer</a>
                ${auth.currentUser ? `<button onclick="deleteCar('${id}')" style="background:red; color:white; border:none; padding:5px; margin-top:10px; cursor:pointer; width:100%;">DELETE</button>` : ''}
            `;
            grid.appendChild(card);
        });
    });
}

window.deleteCar = async (id) => {
    if (confirm("Remove this car?")) {
        await deleteDoc(doc(db, "cars", id));
    }
};
