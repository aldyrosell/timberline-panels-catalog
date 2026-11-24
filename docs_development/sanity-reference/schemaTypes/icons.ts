type IconOption = { title: string; value: string };

const options = (entries: Record<string, string>): IconOption[] =>
  Object.entries(entries).map(([value, title]) => ({ title, value }));

export const TRUST_POINT_ICONS = options({ droplet: "Water drop", layers: "Layers", users: "People" });

export const VALUE_PROP_ICONS = options({
  droplet: "Water drop",
  layers: "Layers",
  palette: "Palette",
  truck: "Delivery truck",
});

export const REASON_ICONS = options({
  gem: "Gem",
  layers: "Layers",
  person: "Person",
  shield: "Shield",
});

export const STAT_ICONS = options({
  building: "Building",
  layers: "Layers",
  trophy: "Trophy",
  truck: "Delivery truck",
});

export const TESTIMONIAL_ICONS = options({
  home: "Home",
  house: "House",
  office: "Office",
  van: "Van",
});
