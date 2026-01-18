function main() {
  const script = document.createElement("script");
  script.src = `./overrides.js?${Date.now()}`;
  document.head.appendChild(script);
}

main();
