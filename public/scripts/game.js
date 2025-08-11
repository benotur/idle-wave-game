let player = {
    class: 'Archer',
    level: 1,
    maxHealth: 100,
    health: 100,
    gold: 0,
    xp: 0
};

const difficulties = ['Normal', 'Hard'];
let currentDifficulty = 'Normal';
let currentStage = 1;
let currentStageWave = 1;
let mobsInWave = [];
const mobsPerWave = 3;
const wavesPerStage = 10;
const stagesPerDifficulty = 10;

function selectClass(className) {
    player.class = className;
    player.level = 1;
    player.maxHealth = 100;
    player.health = 100;
    player.xp = 0;
    player.gold = 0;
    updatePlayerBox();
}

window.selectClass = selectClass;

function updatePlayerBox() {
    // Health bar
    const healthFill = document.getElementById('player-health-fill');
    healthFill.style.width = `${(player.health / player.maxHealth) * 100}%`;
    updateLevelBar();
    updateGoldCounter();
}

function updateLevelBar() {
    const xpForLevel = 50 * player.level;
    const percent = (player.xp / xpForLevel) * 100;
    document.getElementById('level-bar-fill').style.width = percent + '%';
    document.getElementById('level-label').textContent = `${player.level} (${player.xp}/${xpForLevel})`;
}

function updateGoldCounter() {
    document.getElementById('gold').textContent = `Gold: ${player.gold}`;
}

function spawnMobs() {
    mobsInWave = [];
    const mobArea = document.getElementById('mob-area');
    mobArea.innerHTML = '';
    for (let i = 0; i < mobsPerWave; i++) {
        let baseHealth = 40 + 20 * currentStage + 10 * (currentDifficulty === 'Hard' ? currentStage : 0);
        const mob = {
            id: i,
            name: `Mob ${i + 1}`,
            maxHealth: baseHealth,
            health: baseHealth
        };
        mobsInWave.push(mob);

        const mobDiv = document.createElement('div');
        mobDiv.className = 'entity-box mob-box';
        mobDiv.id = `mob-${mob.id}`;
        mobDiv.innerHTML = `
            <div class="health-bar mob-health-bar">
                <div class="health-fill" id="mob-health-fill-${mob.id}"></div>
            </div>
            <div class="entity-label">${mob.name}</div>
        `;
        mobArea.appendChild(mobDiv);
        updateMobBox(mob);
    }
}

function updateMobBox(mob) {
    const fill = document.getElementById(`mob-health-fill-${mob.id}`);
    fill.style.width = `${(mob.health / mob.maxHealth) * 100}%`;
}

function attackMob(mob) {
    if (mob.health <= 0) return;
    const damage = 20;
    mob.health -= damage;
    if (mob.health < 0) mob.health = 0;
    updateMobBox(mob);
    showDamageOutput(mob, damage);
    if (mob.health === 0) {
        showXPDrop(mob, 5);
        showCoinDrop(mob, 10);
        player.gold += 10;
        player.xp += 5;
        checkPlayerLevelUp();
        updatePlayerBox();
    }
}

function showDamageOutput(mob, damage) {
    const mobDiv = document.getElementById(`mob-${mob.id}`);
    const dmgDiv = document.createElement('div');
    dmgDiv.className = 'damage-output';
    dmgDiv.textContent = `-${damage}`;
    mobDiv.appendChild(dmgDiv);
    setTimeout(() => dmgDiv.remove(), 900);
}

function showXPDrop(mob, xp) {
    const mobDiv = document.getElementById(`mob-${mob.id}`);
    const xpDiv = document.createElement('div');
    xpDiv.className = 'xp-drop';
    xpDiv.textContent = `+${xp} XP`;
    mobDiv.appendChild(xpDiv);
    setTimeout(() => xpDiv.remove(), 900);
}

function showCoinDrop(mob, coins) {
    const mobDiv = document.getElementById(`mob-${mob.id}`);
    const coinDiv = document.createElement('div');
    coinDiv.className = 'coin-drop';
    coinDiv.textContent = `+${coins}💰`;
    mobDiv.appendChild(coinDiv);
    setTimeout(() => coinDiv.remove(), 900);
}

function checkPlayerLevelUp() {
    const xpForLevel = 50 * player.level;
    if (player.xp >= xpForLevel) {
        player.level++;
        player.xp = 0;
        player.maxHealth += 20;
        player.health = player.maxHealth;
        showLevelUpEffect();
        updatePlayerBox();
    }
}

function playerAutoAttack() {
    mobsInWave.forEach(mob => {
        if (mob.health > 0) {
            attackMob(mob);
            return;
        }
    });
}

function startStage() {
    currentStageWave = 1;
    startWave();
}

function startWave() {
    document.getElementById('current-wave').textContent = `${currentDifficulty} ${currentStage}-${currentStageWave}`;
    spawnMobs();
    updatePlayerBox();
}

function nextWaveOrStage() {
    setTimeout(() => {
        if (currentStageWave < wavesPerStage) {
            currentStageWave++;
            startWave();
        } else {
            if (currentStage < stagesPerDifficulty) {
                currentStage++;
                currentStageWave = 1;
                showStageUpEffect();
                startWave();
            } else {
                const currentDiffIndex = difficulties.indexOf(currentDifficulty);
                if (currentDiffIndex < difficulties.length - 1) {
                    currentDifficulty = difficulties[currentDiffIndex + 1];
                    currentStage = 1;
                    currentStageWave = 1;
                    showDifficultyUpEffect();
                    startWave();
                } else {
                    showGameCompleteEffect();
                }
            }
        }
    }, 500);
}

function showLevelUpEffect() {
    const header = document.querySelector('header');
    const effect = document.createElement('div');
    effect.textContent = 'Level Up!';
    effect.className = 'levelup-effect';
    header.appendChild(effect);
    setTimeout(() => effect.remove(), 1800);
}

function showStageUpEffect() {
    const header = document.querySelector('header');
    const effect = document.createElement('div');
    effect.textContent = `Stage ${currentStage} Unlocked!`;
    effect.className = 'stageup-effect';
    header.appendChild(effect);
    setTimeout(() => effect.remove(), 1500);
}

function showDifficultyUpEffect() {
    const header = document.querySelector('header');
    const effect = document.createElement('div');
    effect.textContent = `Difficulty "${currentDifficulty}" Unlocked!`;
    effect.className = 'difficultyup-effect';
    header.appendChild(effect);
    setTimeout(() => effect.remove(), 2000);
}

function showGameCompleteEffect() {
    const header = document.querySelector('header');
    const effect = document.createElement('div');
    effect.textContent = `All Difficulties Complete!`;
    effect.className = 'gamecomplete-effect';
    header.appendChild(effect);
    setTimeout(() => effect.remove(), 2500);
}

function startAutoWaveProgression() {
    setInterval(() => {
        if (mobsInWave.every(mob => mob.health <= 0)) {
            nextWaveOrStage();
        }
    }, 1200);
}

window.onload = function() {
    updatePlayerBox();
    startStage();
    setInterval(playerAutoAttack, 2000);
    startAutoWaveProgression();
};