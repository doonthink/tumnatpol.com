import fs from 'fs';

const businessChecksFile = 'data/businessChecks.json';
const ordersFile = 'data/orders.json';

const businessChecks = JSON.parse(fs.readFileSync(businessChecksFile, 'utf8'));
const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));

for (let bc of businessChecks) {
  if (!bc.memberName) {
    const order = orders.find(o => String(o.member_id) === String(bc.member_id));
    if (order) {
      bc.memberName = order.customer;
    }
  }
}

fs.writeFileSync(businessChecksFile, JSON.stringify(businessChecks, null, 2));
console.log('Fixed business checks from orders.');
