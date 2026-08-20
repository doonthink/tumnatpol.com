const video = { title: undefined };
const search = "hello";
try {
    const matchSearch = video.title?.toLowerCase().includes(search.toLowerCase()) || video.description?.toLowerCase().includes(search.toLowerCase());
    console.log("No error", matchSearch);
}
catch (e) {
    console.log("Error:", e.message);
}
export {};
