const a = 123;
try {
  a?.toLowerCase();
} catch (e) {
  console.log("Error:", e.message);
}
