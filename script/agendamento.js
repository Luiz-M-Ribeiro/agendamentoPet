import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { sair } from "./auth.js";

// === CONFIG FIREBASE (preencha com seus dados) ===
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
const db = getFirestore(app);

// === BOTÃO SAIR ===
document.getElementById("btnLogout").addEventListener("click", sair);

// === FORMULÁRIO DE AGENDAMENTO ===
const form = document.getElementById("formAgendamento");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Captura os valores dos campos
  const nomeDono = form.nomeDono.value.trim();
  const nomePet = form.nomePet.value.trim();
  const telefone = form.telefone.value.trim();
  const servico = form.servico.value;
  const data = form.data.value;
  const hora = form.hora.value;
  const observacoes = form.observacoes.value.trim();

  // Verificação básica
  if (!nomeDono || !nomePet || !telefone || !servico || !data || !hora) {
    msg.style.color = "red";
    msg.textContent = "⚠️ Preencha todos os campos obrigatórios.";
    return;
  }

  try {
    // Salva o agendamento no Firestore
    await addDoc(collection(db, "agendamentos"), {
      nomeDono,
      nomePet,
      telefone,
      servico,
      data,
      hora,
      observacoes,
      criadoEm: serverTimestamp()
    });

    msg.style.color = "green";
    msg.textContent = "✅ Agendamento realizado com sucesso!";
    form.reset(); // Limpa o formulário
  } catch (error) {
    msg.style.color = "red";
    msg.textContent = "❌ Erro ao salvar agendamento: " + error.message;
  }
});
