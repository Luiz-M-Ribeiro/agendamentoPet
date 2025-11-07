import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// === CONFIGURAÇÃO DO FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyANa7p9unsKM6UClfukM29VUd33os1Yi0o",
  authDomain: "agendamento-b189c.firebaseapp.com",
  databaseURL: "https://agendamento-b189c-default-rtdb.firebaseio.com",
  projectId: "agendamento-b189c",
  storageBucket: "agendamento-b189c.firebasestorage.app",
  messagingSenderId: "1066468784759",
  appId: "1:1066468784759:web:64d948af34987c0cdb2472"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// === CADASTRO ===
const btnCadastrar = document.getElementById("btnCadastrar");
if (btnCadastrar) {
  btnCadastrar.addEventListener("click", async () => {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const tipoUsuario = document.getElementById("tipoUsuario").value;
    const msg = document.getElementById("msg");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, senha);
      await setDoc(doc(db, "usuarios", userCred.user.uid), {
        nome,
        email,
        tipoUsuario
      });
      msg.style.color = "green";
      msg.textContent = "✅ Cadastro realizado com sucesso!";
      setTimeout(() => window.location.href = "login.html", 1500);
    } catch (error) {
      msg.style.color = "red";
      msg.textContent = "❌ Erro ao cadastrar: " + error.message;
    }
  });
}

// === LOGIN ===
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
  btnLogin.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const msg = document.getElementById("msg");

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, senha);
      const userDoc = await getDoc(doc(db, "usuarios", userCred.user.uid));
      const userData = userDoc.data();

      msg.style.color = "green";
      msg.textContent = "✅ Login bem-sucedido!";

      // Redireciona com base no tipo
      if (userData.tipoUsuario === "admin") {
        window.location.href = "admin-agendamentos.html";
      } else {
        window.location.href = "agendamento.html";
      }
    } catch (error) {
      msg.style.color = "red";
      msg.textContent = "❌ Email ou senha inválidos.";
    }
  });
}

// === VERIFICAÇÃO DE LOGIN NAS PÁGINAS PROTEGIDAS ===
onAuthStateChanged(auth, async (user) => {
  const path = window.location.pathname;

  if (path.includes("agendamento") || path.includes("admin-agendamentos")) {
    if (!user) {
      alert("Você precisa fazer login para acessar esta página.");
      window.location.href = "login.html";
      return;
    }

    const userDoc = await getDoc(doc(db, "usuarios", user.uid));
    const tipo = userDoc.exists() ? userDoc.data().tipoUsuario : null;

    // Protege página admin
    if (path.includes("admin-agendamentos") && tipo !== "admin") {
      alert("Acesso restrito a administradores.");
      window.location.href = "agendamento.html";
    }
  }
});

// === LOGOUT ===
export async function sair() {
  await signOut(auth);
  window.location.href = "login.html";
}
