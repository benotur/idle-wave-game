import { Archer, Warrior, Monk, Lancer } from './classes.js';
import { Mob, mobs } from './mobs.js';
import { Item, items } from './items.js';

let player = null;
let currentClass = 'Archer';
let currentWave = 1;
let enemiesDefeated = 0;
let mobsInWave = [];
let bossActive = false;
let researchedItems = [];
let gold = 0;
const mobsPerWave = 5;
const totalWaves = 5;
let autoAttackInterval = null;

// Ranges for each class (pixels from left)
const classRanges = {
    Warrior: 80,
    Lancer: 120,
    Monk: 160,
    Archer: 220
};

// --- CHARACTER SELECTION & SWITCHING ---
function selectClass(className) {
    const name = player ? player.name : prompt("Enter your character's name:");
    switch (className) {
        case 'Archer': player = new Archer(name); break;
        case 'Lancer': player = new Lancer(name); break;
        case 'Monk': player = new Monk(name); break;
        case 'Warrior': player = new Warrior(name); break;
    }
    currentClass = className;
    updatePlayerInfo();
    updateCharacterSprite();
}
window.selectClass = selectClass;

function updateCharacterSprite() {
    animateCharacterIdle();
    // Add health bar above character
    const sprite = document.getElementById('player-sprite');
    let healthBar = document.getElementById('player-health-bar');
    if (!healthBar) {
        healthBar = document.createElement('div');
        healthBar.id = 'player-health-bar';
        healthBar.style.width = '96px';
        healthBar.style.height = '10px';
        healthBar.style.background = '#eee';
        healthBar.style.borderRadius = '5px';
        healthBar.style.position = 'absolute';
        healthBar.style.top = '-16px';
        healthBar.style.left = '0';
        healthBar.innerHTML = `<div id="player-hp-bar-inner" style="height:10px;background:#27ae60;width:100%;border-radius:5px;"></div>`;
        sprite.style.position = 'relative';
        sprite.prepend(healthBar);
    }
    updateCharacterHealthBar();
}

function updateCharacterHealthBar() {
    const hpBar = document.getElementById('player-hp-bar-inner');
    if (hpBar && player) {
        const percent = Math.max(0, player.health / (100 + (player.level - 1) * 10)) * 100;
        hpBar.style.width = percent + '%';
    }
}

// --- CHARACTER SPRITE SHEET ANIMATION (IDLE ONLY FOR NOW) ---
function animateCharacterIdle() {
    const idleFrames = {
        Archer: { file: 'Archer/archer_idle.png', frames: 6, width: 1152, height: 192 },
        Lancer: { file: 'Lancer/lancer_idle.png', frames: 12, width: 3840, height: 320 },
        Monk: { file: 'Monk/monk_idle.png', frames: 6, width: 1152, height: 192 },
        Warrior: { file: 'Warrior/warrior_idle.png', frames: 8, width: 1536, height: 192 }
    };
    const data = idleFrames[currentClass];
    const frameWidth = Math.floor(data.width / data.frames);
    const displayHeight = 144; // On-screen height
    const scale = displayHeight / data.height;
    const displayWidth = Math.floor(frameWidth * scale);

    const sprite = document.getElementById('player-sprite');
    clearInterval(sprite._idleAnim);

    sprite.innerHTML = `<div id="idle-anim"
        style="
            width:${displayWidth}px;
            height:${displayHeight}px;
            background: url('assets/${data.file}') left top / ${data.width * scale}px ${displayHeight}px no-repeat;
            image-rendering: pixelated;
        ">
    </div>`;

    let frame = 0;
    sprite._idleAnim = setInterval(() => {
        const offset = -frame * displayWidth;
        sprite.firstChild.style.backgroundPosition = `${offset}px 0px`;
        frame = (frame + 1) % data.frames;
    }, 180);
}

// --- GAME LOOP ---
function startWave() {
    bossActive = false;
    mobsInWave = [];
    enemiesDefeated = 0;
    document.getElementById('current-wave').textContent = currentWave;
    document.getElementById('enemies-defeated').textContent = enemiesDefeated;
    document.getElementById('boss-container').style.display = 'none';
    document.getElementById('mob-lane').innerHTML = '';
    for (let i = 0; i < mobsPerWave; i++) {
        const mobType = Object.values(mobs)[Math.floor(Math.random() * 3)];
        const mob = new Mob(mobType.name, mobType.health, mobType.damage, mobType.speed);
        mobsInWave.push(mob);
        addMobToUI(mob, i);
    }
}

function addMobToUI(mob, idx) {
    const mobFrames = {
        'Goblin': { file: 'Warrior/warrior_run.png', frames: 6, width: 1152, height: 192 },
        'Skeleton': { file: 'Warrior/warrior_run.png', frames: 6, width: 1152, height: 192 },
        'Orc': { file: 'Warrior/warrior_run.png', frames: 6, width: 1152, height: 192 }
    };
    const data = mobFrames[mob.name] || mobFrames['Goblin'];
    const frameWidth = Math.floor(data.width / data.frames);
    const displayHeight = 96;
    const scale = displayHeight / data.height;
    const displayWidth = Math.floor(frameWidth * scale);

    const mobDiv = document.createElement('div');
    mobDiv.className = 'mob';
    mobDiv.id = `mob-${idx}`;
    mobDiv.style.right = '0px';
    mobDiv.style.position = 'absolute';
    mobDiv.style.bottom = '0';

    // Health bar
    mobDiv.innerHTML = `
        <div class="mob-health-bar" style="width:${displayWidth}px;height:8px;position:absolute;top:-14px;left:0;background:#eee;border-radius:4px;">
            <div id="mob-hp-bar-${idx}" style="height:8px;background:#e74c3c;width:100%;border-radius:4px;"></div>
        </div>
        <div class="mob-run-anim"
            style="
                width:${displayWidth}px;
                height:${displayHeight}px;
                background: url('assets/${data.file}') left top / ${data.width * scale}px ${displayHeight}px no-repeat;
                image-rendering: pixelated;
            ">
        </div>
    `;
    document.getElementById('mob-lane').appendChild(mobDiv);
    animateMobRun(mobDiv, idx, data.frames, displayWidth);
}

function animateMobRun(mobDiv, idx, frames, displayWidth) {
    let position = 0;
    let frame = 0;
    const range = classRanges[currentClass];
    const animDiv = mobDiv.querySelector('.mob-run-anim');
    const interval = setInterval(() => {
        position += 4;
        mobDiv.style.right = `${position}px`;
        // Animate run frames
        animDiv.style.backgroundPosition = `${-frame * displayWidth}px 0px`;
        frame = (frame + 1) % frames;
        // Check if mob is in attack range
        if (position >= range && !mobsInWave[idx].isDefeated) {
            clearInterval(interval);
            attackMob(idx);
        }
        if (mobsInWave[idx].isDefeated) {
            clearInterval(interval);
        }
    }, 120);
}

function attackMob(idx) {
    if (!player || bossActive) return;
    const mob = mobsInWave[idx];
    if (mob && !mob.isDefeated) {
        let dmg = player.attackEnemy(mob);
        document.getElementById(`mob-hp-${idx}`).textContent = Math.max(0, mob.health);

        // Update mob health bar
        const hpBar = document.getElementById(`mob-hp-bar-${idx}`);
        if (hpBar) {
            const percent = Math.max(0, mob.health / mobs[mob.name.toLowerCase()].health) * 100;
            hpBar.style.width = percent + '%';
        }

        // Animate attack effect from character to mob
        let effectImg;
        if (currentClass === 'Archer') {
            effectImg = 'assets/Archer/arrow.png';
        } else if (currentClass === 'Warrior') {
            effectImg = 'assets/Warrior/warrior_attack2.png';
        } else if (currentClass === 'Monk') {
            effectImg = 'assets/Monk/heal.png';
        } else if (currentClass === 'Lancer') {
            effectImg = 'assets/Lancer/lancer_attack.png';
        }
        const effect = document.createElement('img');
        effect.src = effectImg;
        effect.className = 'attack-effect';
        effect.style.left = '90px';
        effect.style.bottom = '60px';
        effect.style.width = '32px';
        effect.style.height = '32px';
        document.getElementById('battlefield').appendChild(effect);
        setTimeout(() => effect.remove(), 500);

        if (mob.health <= 0) {
            mob.defeat();
            mobDiv = document.getElementById(`mob-${idx}`);
            if (mobDiv) mobDiv.style.opacity = 0.5;
            enemiesDefeated++;
            gold += 10;
            document.getElementById('enemies-defeated').textContent = enemiesDefeated;
            updateGold();
            checkWaveCleared();
        }
    }
}

function checkWaveCleared() {
    if (enemiesDefeated >= mobsPerWave) {
        gold += 50; // Earn gold for clearing wave
        updateGold();
        startBossFight();
    }
}

function startBossFight() {
    bossActive = true;
    document.getElementById('mob-lane').innerHTML = '';
    document.getElementById('boss-container').style.display = 'block';
    const boss = new Mob(mobs.dragon.name, mobs.dragon.health, mobs.dragon.damage, mobs.dragon.speed);
    document.getElementById('boss-container').innerHTML = `
        <div id="boss">
            <img src="assets/Warrior/warrior_idle.png" alt="Dragon" style="width:48px;height:48px;">
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
                gold += 100; // Earn gold for boss
                updateGold();
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
    clearInterval(autoAttackInterval);
    document.getElementById('game-container').innerHTML = `
        <h2>Congratulations, ${player.name}!</h2>
        <p>You cleared all waves!</p>
        <p>Gold earned: <span id="gold">${gold}</span></p>
        <button onclick="window.location.reload()">Restart</button>
    `;
}

function updatePlayerInfo() {
    document.getElementById('player-class').textContent = `Class: ${currentClass}`;
    document.getElementById('player-level').textContent = `Level: ${player.level}`;
    document.getElementById('player-health').textContent = `Health: ${player.health}`;
}

function updateGold() {
    let goldEl = document.getElementById('gold');
    if (!goldEl) {
        goldEl = document.createElement('span');
        goldEl.id = 'gold';
        document.getElementById('player-info').appendChild(goldEl);
    }
    goldEl.textContent = `Gold: ${gold}`;
}

function updateInventoryBar() {
    for (let i = 1; i <= 4; i++) {
        const slot = document.getElementById(`item-slot-${i}`);
        const item = researchedItems[i - 1];
        if (item) {
            slot.textContent = item.name[0];
            slot.title = `${item.name} (Lv.${item.level})`;
        } else {
            slot.textContent = '';
            slot.title = '';
        }
    }
}

document.getElementById('research-button').onclick = function () {
    const rarities = ['common', 'rare', 'epic'];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    const itemArr = items[rarity];
    const item = itemArr[Math.floor(Math.random() * itemArr.length)];
    researchedItems.push(item);
    alert(`Researched: ${item.name} (${item.rarity})`);
    updateInventoryBar();
};

document.getElementById('upgrade-button').onclick = function () {
    if (researchedItems.length === 0) {
        alert('No items researched yet!');
        return;
    }
    const item = researchedItems[researchedItems.length - 1];
    item.upgrade();
    alert(`Upgraded: ${item.name} to level ${item.level}`);
    updateInventoryBar();
};

// --- AUTO ATTACK (IDLE GAMEPLAY) ---
function startAutoAttack() {
    clearInterval(autoAttackInterval);
    autoAttackInterval = setInterval(() => {
        // Only auto-attack boss
        if (bossActive) {
            const bossDiv = document.getElementById('boss');
            if (bossDiv && bossDiv.style.opacity !== '0.5') {
                bossDiv.click();
            }
        }
    }, 1000);
}

window.onload = function () {
    selectClass(currentClass);
    startWave();
};