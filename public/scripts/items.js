class Item {
    constructor(name, rarity) {
        this.name = name;
        this.rarity = rarity;
        this.level = 1;
    }

    upgrade() {
        this.level++;
        console.log(`${this.name} upgraded to level ${this.level}`);
    }

    getRarity() {
        return this.rarity;
    }

    getDetails() {
        return {
            name: this.name,
            rarity: this.rarity,
            level: this.level
        };
    }
}

const items = {
    common: [
        new Item('Wooden Bow', 'common'),
        new Item('Iron Sword', 'common'),
        new Item('Basic Staff', 'common')
    ],
    rare: [
        new Item('Elven Bow', 'rare'),
        new Item('Steel Sword', 'rare'),
        new Item('Mage\'s Staff', 'rare')
    ],
    epic: [
        new Item('Dragon Bow', 'epic'),
        new Item('Legendary Sword', 'epic'),
        new Item('Archmage\'s Staff', 'epic')
    ]
};

export { Item, items };