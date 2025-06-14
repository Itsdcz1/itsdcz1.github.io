let playerData = {};
let currentSort = { key: "KDR", desc: true };

async function loadStats() {
    try {
        const response = await fetch(`stats/event1stats.yml?nocache=${Date.now()}`);
        const yamlText = await response.text();
        playerData = jsyaml.load(yamlText);
        renderTable();
    } catch (err) {
        console.error("Failed to load stats.yml:", err);
    }
}

function sortPlayers(data, key, desc = true) {
    return Object.entries(data).sort(([, a], [, b]) => {
        const valA = parseFloat(a[key]);
        const valB = parseFloat(b[key]);
        return desc ? valB - valA : valA - valB;
    });
}

function renderTable() {
    const tbody = document.getElementById("stats-body");
    tbody.innerHTML = "";

    const sortedPlayers = sortPlayers(playerData, currentSort.key, currentSort.desc);

    sortedPlayers.forEach(([uuid, data], index) => {
      const row = document.createElement("tr");

      const playerCell = document.createElement("td");
      playerCell.innerHTML = `
        <div class="player-row">
          <img class="player-head" src="https://mc-heads.net/avatar/${uuid}" alt="${data.name}" />
          <strong class="player-name">${data.name}</strong>
        </div>
      `;

      const rankCell = document.createElement("td");
      rankCell.textContent = index + 1;

      const killsCell = document.createElement("td");
      killsCell.innerHTML = `<span class="kills">${data.kills}</span>`;

      const deathsCell = document.createElement("td");
      deathsCell.innerHTML = `<span class="deaths">${data.deaths}</span>`;

      const kdrCell = document.createElement("td");
      kdrCell.innerHTML = `<span class="kdr">${data.KDR}</span>`;

      row.appendChild(playerCell);
      row.appendChild(rankCell);
      row.appendChild(killsCell);
      row.appendChild(deathsCell);
      row.appendChild(kdrCell);
      tbody.appendChild(row);
    });
}

document.querySelectorAll('.sortable').forEach(header => {
    header.addEventListener('click', () => {
      const key = header.getAttribute('data-sort');
      if (currentSort.key === key) {
        currentSort.desc = !currentSort.desc; // toggle
      } else {
        currentSort = { key: key, desc: true };
      }
      renderTable();
    });
});

loadStats();