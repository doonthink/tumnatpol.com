import "./lib/apiInterceptor";
import './i18n';
import {StrictMode} from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}>
      <App />
    </GoogleReCaptchaProvider>
  </StrictMode>,
);
