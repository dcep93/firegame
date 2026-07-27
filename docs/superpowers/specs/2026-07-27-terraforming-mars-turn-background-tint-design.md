# Terraforming Mars Turn Background Tint Design

## Goal

Tint the Terraforming Mars player page's starfield background to communicate
the current action state without covering the stars or game content:

- pink when it is the player's turn and Pass is selectable;
- yellow when it is the player's turn and Pass is not selectable; and
- unchanged when it is not the player's turn.

## State

The extension will reuse its existing live DOM capability checks:

- `isCurrentPlayerTurn()` requires an enabled control in the canonical Actions
  workflow;
- `hasEnabledExactPassOption()` requires exactly one enabled radio labeled
  `Pass for this generation`.

The state is active only when tfmars420 helpers are enabled and `#player-home`
exists. A current turn with exact Pass availability produces `can-pass`; a
current turn without it produces `no-pass`; every other condition produces
`idle`.

The Actions mirror is not canonical and therefore cannot influence these
checks.

## Presentation

Apply one mutually exclusive class to `#player-home`:

- `tfmars420-turn-can-pass`
- `tfmars420-turn-no-pass`

CSS uses a large inset translucent shadow, which is painted over the existing
background but under the page content. This preserves the upstream fixed
gradient and `stars.jpg` layers.

Both turn-state classes run one shared native CSS animation:

- duration: four seconds for one complete cycle;
- timing: `ease-in-out`;
- repetition: infinite;
- `0%` and `100%`: tint opacity `0`;
- `50%`: tint opacity `0.25`.

The can-Pass class supplies pink `255, 79, 191`; the cannot-Pass class supplies
yellow `255, 214, 64`. The shared keyframes animate the inset shadow with the
state class's RGB custom property. No upstream background declaration is
replaced, and JavaScript does not run an animation timer.

## Lifecycle

Update the tint:

- during initial Terraforming Mars setup;
- after relevant Terraforming Mars DOM mutations;
- during queue/network-driven UI updates; and
- immediately when extension helpers are enabled or disabled.

Each update removes both classes before applying the one current state. Missing
containers and disabled helpers are safe no-op cleanup states.

## Verification

Automated tests will cover idle, pink, and yellow state resolution; exclusive
class application; missing containers; extension-disable cleanup; exact Pass
eligibility reuse; the shared four-second animation; exact opacity endpoints;
CSS colors and the background-preserving technique; and all initial, DOM,
queue/network, and toggle refresh hooks. The full extension suite will then
guard existing queue, autopilot, Actions mirror, and hotkey behavior.
