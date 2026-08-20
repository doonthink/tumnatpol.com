const a = undefined;
try {
  let b = a?.toLowerCase().includes("");
  console.log("No error", b);
} catch (e) {
  console.log("Error:", e.message);
}
