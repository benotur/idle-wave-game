class Mob {
    constructor(name, health, damage, speed) {
        this.name = name;
        this.health = health;
        this.damage = damage;
        this.speed = speed;
        this.isDefeated = false;
    }

    attack(target) {
        if (!this.isDefeated) {
            target.takeDamage(this.damage);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.defeat();
        }
    }

    defeat() {
        this.isDefeated = true;
    }
}

const mobs = {
    goblin: new Mob('Goblin', 30, 5, 1),
    skeleton: new Mob('Skeleton', 50, 10, 1.5),
    orc: new Mob('Orc', 80, 15, 1),
    dragon: new Mob('Dragon', 200, 25, 0.5)
};

export { Mob, mobs };