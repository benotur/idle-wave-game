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
        this.health += 10;
        this.attack += 2;
        this.defense += 1;
    }

    attackEnemy(enemy) {
        const damageDealt = Math.max(0, this.attack - (enemy.defense || 0));
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
        const damageDealt = this.attack * 1.5;
        enemy.health -= damageDealt;
        return damageDealt;
    }
}

class Warrior extends Character {
    constructor(name) {
        super(name, 100, 10, 10);
    }
    shieldBlock() {
        this.defense += 5;
    }
}

class Mage extends Character {
    constructor(name) {
        super(name, 70, 15, 3);
    }
    castSpell(enemy) {
        const damageDealt = this.attack * 2;
        enemy.health -= damageDealt;
        return damageDealt;
    }
}

class Tamer extends Character {
    constructor(name) {
        super(name, 90, 8, 6);
    }
    summonPet() {
        // Pet logic
    }
}

export { Character, Archer, Warrior, Mage, Tamer };