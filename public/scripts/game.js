import { Archer, Warrior, Mage, Tamer } from './classes.js';
import { Mob, mobs } from './mobs.js';
import { Item, items } from './items.js';

// --- GLOBALS ---
let player = null;
let currentWave = 1;
let enemiesDefeated = 0;
let mobsInWave = [];
let bossActive = false;
let researchedItems = [];
const mobsPerWave = 5;
const totalWaves = 5;

// --- CHARACTER SELECTION ---
window.selectClass = function(className) {
    const name = prompt("Enter your character's name:");
    switch (className) {
        case 'Archer': player = new Archer(name); break;
        case 'Warrior': player = new Warrior(name); break;
        case 'Mage': player = new Mage(name); break;
        case 'Tamer': player = new Tamer(name); break;
    }
    document.getElementById('character-selection').style.display = 'none';
    updatePlayerInfo();
    startWave();
};

// --- GAME LOOP ---
function startWave() {
    bossActive = false;
    mobsInWave = [];
    enemiesDefeated = 0;
    document.getElementById('current-wave').textContent = currentWave;
    document.getElementById('enemies-defeated').textContent = enemiesDefeated;
    document.getElementById('boss-container').style.display = 'none';
    document.getElementById('mobs-container').innerHTML = '';
    // Spawn mobs
    for (let i = 0; i < mobsPerWave; i++) {
        const mobType = Object.values(mobs)[Math.floor(Math.random() * 3)]; // random normal mob
        const mob = new Mob(mobType.name, mobType.health, mobType.damage, mobType.speed);
        mobsInWave.push(mob);
        addMobToUI(mob, i);
    }
}

function addMobToUI(mob, idx) {
    const mobDiv = document.createElement('div');
    mobDiv.className = 'mob';
    mobDiv.id = `mob-${idx}`;
    mobDiv.innerHTML = `<strong>${mob.name}</strong> <br> HP: <span id="mob-hp-${idx}">${mob.health}</span>`;
    mobDiv.onclick = () => attackMob(idx);
    document.getElementById('mobs-container').appendChild(mobDiv);
}

function attackMob(idx) {
    if (!player || bossActive) return;
    const mob = mobsInWave[idx];
    if (mob && !mob.isDefeated) {
        const dmg = player.attackEnemy(mob);
        document.getElementById(`mob-hp-${idx}`).textContent = Math.max(0, mob.health);
        if (mob.health <= 0) {
            mob.defeat();
            document.getElementById(`mob-${idx}`).style.opacity = 0.5;
            enemiesDefeated++;
            document.getElementById('enemies-defeated').textContent = enemiesDefeated;
            checkWaveCleared();
        }
    }
}

function checkWaveCleared() {
    if (enemiesDefeated >= mobsPerWave) {
        startBossFight();
    }
}

function startBossFight() {
    bossActive = true;
    document.getElementById('mobs-container').innerHTML = '';
    document.getElementById('boss-container').style.display = 'block';
    const boss = new Mob(mobs.dragon.name, mobs.dragon.health, mobs.dragon.damage, mobs.dragon.speed);
    document.getElementById('boss-container').innerHTML = `
        <div id="boss">
            <strong>${boss.name} (Boss)</strong><br>
            HP: <span id="boss-hp">${boss.health}</span>
        </div>
    `;
    document.getElementById('boss').onclick = () => {
        if (!boss.isDefeated) {
            const dmg = player.attackEnemy(boss);
            document.getElementById('boss-hp').textContent = Math.max(0, boss.health);
            if (boss.health <= 0) {
                boss.defeat();
                document.getElementById('boss').style.opacity = 0.5;
                setTimeout(nextLevel, 1500);
            }
        }
    };
}

function nextLevel() {
    currentWave++;
    if (currentWave > totalWaves) {
        endGame();
    } else {
        player.levelUp();
        updatePlayerInfo();
        startWave();
    }
}

function endGame() {
    document.getElementById('game-container').innerHTML = `
        <h2>Congratulations, ${player.name}!</h2>
        <p>You cleared all waves!</p>
        <button onclick="window.location.reload()">Restart</button>
    `;
}

// --- PLAYER INFO UI ---
function updatePlayerInfo() {
    document.getElementById('player-class').textContent = `Class: ${player.constructor.name}`;
    document.getElementById('player-level').textContent = `Level: ${player.level}`;
    document.getElementById('player-health').textContent = `Health: ${player.health}`;
}

// --- ITEM RESEARCH & UPGRADE ---
document.getElementById('research-button').onclick = function() {
    // Randomly research an item
    const rarities = ['common', 'rare', 'epic'];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    const itemArr = items[rarity];
    const item = itemArr[Math.floor(Math.random() * itemArr.length)];
    researchedItems.push(item);
    alert(`Researched: ${item.name} (${item.rarity})`);
    // Optionally, save to Firebase here
};

document.getElementById('upgrade-button').onclick = function() {
    if (researchedItems.length === 0) {
        alert('No items researched yet!');
        return;
    }
    const item = researchedItems[researchedItems.length - 1];
    item.upgrade();
    alert(`Upgraded: ${item.name} to level ${item.level}`);
    // Optionally, save to Firebase here
};

// --- KEYBOARD ATTACK ---
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        // Attack first alive mob or boss
        if (!bossActive) {
            for (let i = 0; i < mobsInWave.length; i++) {
                if (!mobsInWave[i].isDefeated) {
                    attackMob(i);
                    break;
                }
            }
        } else {
            const bossDiv = document.getElementById('boss');
            if (bossDiv && bossDiv.style.opacity !== '0.5') {
                bossDiv.click();
            }
        }
    }
});

// --- INIT ---
window.onload = function() {
    // Wait for character selection
};