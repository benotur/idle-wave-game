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
}

class Warrior extends Character {
    constructor(name) {
        super(name, 100, 10, 10);
    }
}

class Monk extends Character {
    constructor(name) {
        super(name, 85, 11, 7);
    }
    healAttack(enemy) {
        // Use heal.png as damage ability
        const damageDealt = this.attack * 1.3;
        enemy.health -= damageDealt;
        return damageDealt;
    }
}

class Lancer extends Character {
    constructor(name) {
        super(name, 90, 13, 6);
    }
}

export { Character, Archer, Warrior, Monk, Lancer };