class Character {
    constructor(name, health, attack, defense, level = 1) {
        this.name = name;
        this.health = health;
        this.attack = attack;
        this.defense = defense;
        this.level = level;
    }

    levelUp() {
        this.level++;
        this.health += 10; // Example increment
        this.attack += 2;  // Example increment
        this.defense += 1; // Example increment
    }

    attackEnemy(enemy) {
        const damageDealt = Math.max(0, this.attack - enemy.defense);
        enemy.health -= damageDealt;
        return damageDealt;
    }

    isAlive() {
        return this.health > 0;
    }
}

class Archer extends Character {
    constructor(name) {
        super(name, 80, 12, 5);
    }

    specialAttack(enemy) {
        const damageDealt = this.attack * 1.5; // Special attack deals 1.5x damage
        enemy.health -= damageDealt;
        return damageDealt;
    }
}

class Warrior extends Character {
    constructor(name) {
        super(name, 100, 10, 10);
    }

    shieldBlock() {
        this.defense += 5; // Temporarily increase defense
    }
}

class Mage extends Character {
    constructor(name) {
        super(name, 70, 15, 3);
    }

    castSpell(enemy) {
        const damageDealt = this.attack * 2; // Spell deals double damage
        enemy.health -= damageDealt;
        return damageDealt;
    }
}

class Tamer extends Character {
    constructor(name) {
        super(name, 90, 8, 6);
    }

    summonPet() {
        // Logic for summoning a pet to assist in battle
    }
}

export { Character, Archer, Warrior, Mage, Tamer };