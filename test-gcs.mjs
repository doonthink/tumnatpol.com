import { Storage } from '@google-cloud/storage';
async function test() {
  const storage = new Storage();
  const [buckets] = await storage.getBuckets();
  console.log("Buckets:", buckets.map(b => b.name));
}
test().catch(console.error);
