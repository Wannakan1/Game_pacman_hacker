# Hacker Maze

A browser maze game in the style of Pac-Man. Collect every binary code in a randomly generated maze, answer decrypt challenges, and avoid the police.

## Play

Open `index.html` in a modern browser. No build step or dependencies.

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | W A S D | On-screen pad |
| Hack police | Space | Hack button |
| Pause | P or Esc | Pause button |
| Answer a challenge | 1 2 3 or click | Tap |

## Rules

- Collect all `0 1 0 1 0 1 0 1` codes to win.
- Challenges appear while collecting. A correct answer freezes the police for 2 seconds and boosts your speed for 5 seconds.
- Police patrol and chase. Contact costs HP, and they speed up as you collect more codes.
- Pick up a laptop, then press Space to hack nearby police and freeze them for 5 seconds. Charges are limited.
- A small green arrow around the hacker points to the nearest code, with the distance in tiles.

## Files

- `index.html` – screens and HUD markup
- `style.css` – theme and layout
- `game.js` – game logic and canvas rendering
