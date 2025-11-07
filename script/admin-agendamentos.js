import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore, collection, onSnapshot, deleteDoc, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { sair } from "./auth.js";

// === CONFIG FIREBASE (mesma usada no agendamento.js) ===
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

document.getElementById("btnLogout").addEventListener("click", sair);

// === Referência da tabela ===
const lista = document.getElementById("listaAgendamentos");

// === Atualização em tempo real ===
onSnapshot(collection(db, "agendamentos"), (snapshot) => {
  lista.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const ag = docSnap.data();
    const id = docSnap.id;

    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td contenteditable="true" data-field="nomeDono">${ag.nomeDono}</td>
      <td contenteditable="true" data-field="nomePet">${ag.nomePet}</td>
      <td contenteditable="true" data-field="telefone">${ag.telefone}</td>
      <td contenteditable="true" data-field="servico">${ag.servico}</td>
      <td contenteditable="true" data-field="data">${ag.data}</td>
      <td contenteditable="true" data-field="hora">${ag.hora}</td>
      <td contenteditable="true" data-field="observacoes">${ag.observacoes || ""}</td>
      <td>
        <button class="btnSalvar" data-id="${id}">💾</button>
        <button class="btnExcluir" data-id="${id}">🗑️</button>
      </td>
    `;
    lista.appendChild(linha);
  });

  // === Eventos dos botões ===
  document.querySelectorAll(".btnExcluir").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (confirm("Deseja realmente excluir este agendamento?")) {
        await deleteDoc(doc(db, "agendamentos", id));
        alert("Agendamento excluído com sucesso!");
      }
    });
  });

  document.querySelectorAll(".btnSalvar").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const linha = btn.closest("tr");
      const campos = linha.querySelectorAll("[contenteditable='true']");

      const dadosAtualizados = {};
      campos.forEach(campo => {
        const nomeCampo = campo.dataset.field;
        dadosAtualizados[nomeCampo] = campo.textContent.trim();
      });

      await updateDoc(doc(db, "agendamentos", id), dadosAtualizados);
      alert("✅ Agendamento atualizado com sucesso!");
    });
  });
});
