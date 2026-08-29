FROM node:22-alpine

WORKDIR /app

# คัดลอกไฟล์จัดการ package
COPY package.json ./

# บังคับใช้ npm install แทน npm ci เพื่อตัดปัญหาไฟล์ lock ไม่ตรงกัน
RUN npm install

# คัดลอกโค้ดทั้งหมด
COPY . .

# สร้าง Build
RUN npm run build

# เปิด Port 3000
EXPOSE 3000

# รันเซิร์ฟเวอร์
CMD ["npm", "start"]
