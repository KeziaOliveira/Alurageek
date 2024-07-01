// URL da API
const apiUrl = "http://localhost:3000/personagens";

// Função para obter os personagens
async function fetchPersonagens() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Erro ao buscar dados");
    }
    const data = await response.json();
    console.log("Dados recebidos:", data);
    displayPersonagens(data);
  } catch (error) {
    console.error("Erro:", error);
  }
}

// Função para exibir os personagens no HTML
function displayPersonagens(personagens) {
  if (!Array.isArray(personagens)) {
    console.error("Dados inválidos:", personagens);
    return;
  }

  const personagensList = document.getElementById("personagens-list");
  personagensList.innerHTML = ""; // Limpa a lista antes de adicionar os personagens

  personagens.forEach((personagem) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            <h2>${personagem.name}</h2>
            <p>Ano: ${personagem.year}</p>
            <img src="${personagem.image}" alt="${personagem.name}" />
            <button class="delete-button" data-id="${personagem.id}">
                <img src="/assets/trash-solid.svg" alt="Excluir" />
            </button>
        `;
    personagensList.appendChild(listItem);
  });

  // Adiciona eventos de clique para os botões de excluir
  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const personagemId = e.target.closest("button").dataset.id;
      await deletePersonagem(personagemId);
    });
  });
}

// Função para adicionar um novo personagem
async function addPersonagem(personagem) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personagem),
    });
    if (!response.ok) {
      throw new Error("Erro ao adicionar personagem");
    }
    fetchPersonagens(); // Atualiza a lista de personagens após adicionar um novo
  } catch (error) {
    console.error("Erro:", error);
  }
}

// Função para excluir um personagem
async function deletePersonagem(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao excluir personagem");
    }
    fetchPersonagens(); // Atualiza a lista de personagens após excluir um
  } catch (error) {
    console.error("Erro:", error);
  }
}

// Evento para o botão "Adicionar Novo Personagem"
document.getElementById("add-button").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const year = document.getElementById("year").value;
  const imageInput = document.getElementById("image");
  const imageFile = imageInput.files[0];

  if (name && year && imageFile) {
    try {
      const imageDataUrl = await readFileAsDataURL(imageFile);
      const newPersonagem = {
        name,
        year,
        image: imageDataUrl,
      };

      await addPersonagem(newPersonagem);

      // Limpar o formulário após adicionar
      document.getElementById("add-personagem-form").reset();
    } catch (error) {
      console.error("Erro ao ler arquivo de imagem:", error);
    }
  } else {
    alert("Por favor, preencha todos os campos.");
  }
});

// Função para ler o arquivo de imagem como Data URL
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Evento para o botão "Limpar"
document.getElementById("clear-button").addEventListener("click", () => {
  document.getElementById("add-personagem-form").reset();
});

// Chama a função para buscar e exibir os personagens ao carregar a página
fetchPersonagens();
