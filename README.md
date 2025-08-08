# Idle Wave Game

## Overview
Idle Wave Game is a 2D idle game where players choose a character class (Archer, Warrior, Mage, or Tamer) to clear waves of mobs. Players will progress through levels, defeat bosses, and collect items to upgrade their characters.

## Game Features
- **Character Classes**: Choose from four unique classes, each with distinct abilities and playstyles.
- **Wave Management**: Clear waves of mobs, with each level consisting of five smaller waves followed by a boss fight.
- **Item Research**: Collect items of varying rarities to research and upgrade weapons and equipment.
- **Firebase Integration**: Save and retrieve player progress and item research using Firebase Realtime Database.

## Project Structure
```
idle-wave-game
├── public
│   ├── index.html          # Main HTML document for the game
│   ├── styles
│   │   └── main.css        # Styles for the game interface
│   ├── scripts
│   │   ├── game.js         # Main game logic
│   │   ├── classes.js      # Character classes definition
│   │   ├── mobs.js         # Mob definitions
│   │   ├── items.js        # Item management
│   │   └── firebase.js     # Firebase integration
│   └── assets              # Placeholders for sprites and sounds
├── firebase.json           # Firebase configuration
├── package.json            # npm configuration
└── README.md               # Project documentation
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies using npm:
   ```
   npm install
   ```
4. Set up Firebase by configuring the `firebase.json` file with your project settings.
5. Run the game locally by opening `public/index.html` in your web browser.

## Game Mechanics
- Players will face waves of mobs, each with increasing difficulty.
- After clearing a set of waves, players will encounter a boss fight.
- Players can collect items to enhance their characters and unlock new abilities through research.

## Future Development
- Additional character classes and mobs.
- Enhanced graphics and sound effects.
- More complex game mechanics and features.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.