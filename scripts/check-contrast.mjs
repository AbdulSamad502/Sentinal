/**
 * WCAG AA contrast check for the verdict colours specifically -- the brief
 * calls these out because they carry meaning and therefore must also carry
 * text contrast, in both themes.
 */
function relLuminance(hex) {
  const c = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const lin = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(hexA, hexB) {
  const [l1, l2] = [relLuminance(hexA), relLuminance(hexB)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

const grounds = {
  "light ground": "#F2F1ED",
  "light surface": "#FFFFFF",
  "dark ground": "#1A1815",
  "dark surface": "#242019",
};

const verdicts = {
  "light SAFE": "#2E7D5B",
  "light REVIEW": "#A6720C",
  "light CONDITIONAL": "#B4571C",
  "light STOP": "#A83228",
  "light accent": "#6E4A7E",
  "dark SAFE": "#6BC49A",
  "dark REVIEW": "#E0A93C",
  "dark CONDITIONAL": "#EE9152",
  "dark STOP": "#F07F72",
  "dark accent": "#B98FC9",
};

console.log("Verdict/accent text colour vs its own theme's surfaces (AA normal text needs >= 4.5):\n");

for (const [label, hex] of Object.entries(verdicts)) {
  const theme = label.startsWith("light") ? "light" : "dark";
  for (const [groundLabel, groundHex] of Object.entries(grounds)) {
    if (!groundLabel.startsWith(theme)) continue;
    const ratio = contrastRatio(hex, groundHex);
    const pass = ratio >= 4.5;
    console.log(
      `  ${label.padEnd(18)} on ${groundLabel.padEnd(14)} = ${ratio.toFixed(2)}  ${pass ? "PASS" : "FAIL <-- "}`,
    );
  }
}
