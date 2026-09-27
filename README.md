# 🎂 Sikadev's 3D Birthday Universe ✨

A memorable, interactive 3D WebGL Birthday celebration created for **Sikadev** to share with friends, family, and loved ones ("Lovelies") on WhatsApp.

---

## 🌟 Key Features

1. **Blow the Mic (Web Audio API)**
   - Connects to the user's microphone.
   - Real-time wind/breath turbulence analyzer. When someone blows into their phone or laptop mic, the 3D candle flames flicker, blow out into rising smoke wisps, and trigger a full-screen celebration!
   - Includes a fallback `"💨 Tap to Blow"` button for friends without microphone permissions.

2. **Full-Screen Confetti & Audio Fanfare**
   - Multi-cannon celebration fireworks with gold/purple streamers.
   - Procedural Web Audio synthesizer that plays the celebratory Birthday Fanfare.

3. **3D Cake & Orbiting Wish Constellation (Three.js)**
   - 2-tier cosmic birthday cake with realistic candles and dynamic point lights.
   - Procedural 1,200-particle starfield.
   - Floating glowing 3D star orbs in orbit representing friends' wishes. Tap any star in 3D to inspect the wish!
   - Touch drag / mouse drag support to smoothly rotate the universe.

4. **Direct WhatsApp Integration**
   - **Send to WhatsApp Button:** Automatically formats the friend's name, custom wish message, and selected vibe badge into a pre-filled WhatsApp chat link!
   - **Viral Share on WhatsApp Button:** Generates an invitation link for friends to pass it along to WhatsApp group chats.
   - Complete OpenGraph tags for rich preview cards when the link is pasted into WhatsApp.

---

## 🚀 Live Local Preview

The preview server is running right now at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📲 How to Put Your Phone Number For WhatsApp Wishes

Open `app.js` and set your phone number with your country code:

```javascript
const SIKADEV_CONFIG = {
  name: "Sikadev",
  defaultPhone: "1234567890", // e.g. "233xxxxxxxxx" or your country code + phone
};
```
*(If left blank, WhatsApp will automatically let your friends choose you from their contact list when they tap Send!)*

---

## 🌐 1-Minute Free Deployment (To Share on WhatsApp)

### Option 1: Netlify Drop (Fastest - 30 Seconds)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this folder (`intelligent-planck`).
3. You immediately get a live public link (e.g., `https://sikadev-birthday.netlify.app`) to share on WhatsApp!

### Option 2: GitHub Pages
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: Sikadev 3D Birthday Universe"
   git push origin main
   ```
2. In your repo: Go to **Settings** -> **Pages** -> Source: **Deploy from a branch (`main`)** -> Save.
3. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

### Option 3: Vercel
Run in terminal:
```bash
npx vercel
```
Follow the prompt for an instant live deployment.
