# Board layout format

Each board defines a fixed coordinate system (`width` × `height`). All hold positions are relative to that.

## Board config

```json
{
  "id": "tavor",
  "name": "Tavor",
  "base_width": 20,
  "base_height": 20,
  "holds": [ ... ]
}
```

- **base_width**, **base_height** – coordinate system for hold positions.
- **aspect_ratio** – image width/height (e.g. 1.5 for 3:2). Keeps holds aligned with the board photo across screen sizes. Match your image’s aspect ratio.

## Hold position (multipliers)

Each hold has a `position` object and a `type`:

```json
{
  "index": 0,
  "difficulty": 7,
  "type": "Full",
  "position": { "x": 0, "y": 1.6, "width": 4, "height": 7.6 }
}
```

- **x**, **width** – multipliers of `base_width`. Percentage = (value / base_width) × 100
- **y**, **height** – multipliers of `base_height`. Percentage = (value / base_height) × 100

## Type (enum)

- **Mono** – 1 finger → Mono.jpg
- **Dou** – 2 fingers → 2FingersHold.jpg
- **Tree** – 3 fingers → 34FingersHold.jpg
- **Full** – 4–5 fingers → 5FingersHold.jpg

## How to edit

1. Open the board JSON (e.g. `tavor.json`)
2. Change `x`, `y`, `width`, `height` for any hold
3. Change `type` to change the hold image
4. Save – positions and images update immediately

## Tips

- Hold values are multipliers: `width: 4` with `base_width: 20` = 20% of container
- Change `base_width` or `base_height` to scale all holds
- Overlapping holds are allowed (e.g. multi-row holds)
- Add new holds by adding a new object with `index`, `difficulty`, `type`, and `position` (x, y, width, height)
