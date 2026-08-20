import fs from 'fs';
let reg = fs.readFileSync('src/pages/Register.tsx', 'utf-8');
reg = reg.replace('>\n              อีเมล\n            </button>', '>\n              {t("email")}\n            </button>');
reg = reg.replace('>\n              เบอร์โทรศัพท์ (OTP)\n            </button>', '>\n              {t("phone_otp")}\n            </button>');
fs.writeFileSync('src/pages/Register.tsx', reg);
