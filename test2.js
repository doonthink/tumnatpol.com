const a = undefined;
try {
  a?.toLowerCase().includes("");
} catch (e) {
  console.log(e.message);
}
