
import { ConfigState, CycleState, CHAKRA_NAMES, CHAKRA_EMOJIS, ELEMENT_NAMES, ELEMENT_EMOJIS } from '../types';

export const calculateCycleState = (baseDateStr: string): CycleState => {
  const now = new Date();
  const targetTime = now.getTime() + (2 * 60 * 60 * 1000); 
  
  const chakraBase = new Date(baseDateStr).getTime();
  const diffTime = targetTime - chakraBase;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const dayOfCycle = ((diffDays % 28) + 28) % 28 + 1; 

  const chakraIndex = Math.floor((dayOfCycle - 1) / 4);
  const elementIndex = (dayOfCycle - 1) % 4;

  const moonRef = new Date('2024-10-17T11:26:00Z').getTime();
  const synodicMonth = 29.53059 * 24 * 60 * 60 * 1000;
  
  const diffMoon = targetTime - moonRef;
  const moonAge = ((diffMoon % synodicMonth) + synodicMonth) % synodicMonth;
  const moonAgeDays = moonAge / (24 * 60 * 60 * 1000);

  let moonEmoji = "🌖";
  let moonText = "";
  let moonPhase = "Intermedia";

  if (moonAgeDays < 1.5 || moonAgeDays > 28.0) {
    moonEmoji = "🌕"; moonPhase = "Luna Llena"; moonText = "_¡Feliz luna llena!_";
  } else if (moonAgeDays >= 13.5 && moonAgeDays <= 16.5) {
    moonEmoji = "🌑"; moonPhase = "Luna Nueva"; moonText = "_¡Feliz Luna Nueva!_";
  } else if (moonAgeDays > 1.5 && moonAgeDays < 7) { moonEmoji = "🌖"; moonPhase = "Menguante Gibosa"; }
  else if (moonAgeDays >= 7 && moonAgeDays < 10) { moonEmoji = "🌗"; moonPhase = "Cuarto Menguante"; }
  else if (moonAgeDays >= 10 && moonAgeDays < 13.5) { moonEmoji = "🌘"; moonPhase = "Menguante Balsámica"; }
  else if (moonAgeDays > 16.5 && moonAgeDays < 21) { moonEmoji = "🌒"; moonPhase = "Creciente"; }
  else if (moonAgeDays >= 21 && moonAgeDays < 24) { moonEmoji = "🌓"; moonPhase = "Cuarto Creciente"; }
  else { moonEmoji = "🌔"; moonPhase = "Creciente Gibosa"; }

  return {
    dayOfCycle,
    moonAge: moonAgeDays,
    chakraIndex,
    elementIndex,
    moonPhase,
    moonEmoji,
    chakraName: CHAKRA_NAMES[chakraIndex],
    chakraEmoji: CHAKRA_EMOJIS[chakraIndex],
    elementName: ELEMENT_NAMES[elementIndex],
    elementEmoji: ELEMENT_EMOJIS[elementIndex],
    moonText
  };
};

export const generateFixedScript = (config: ConfigState): string => {
  return `name: Daily Cosmic Calendar

on:
  schedule:
    - cron: '0 22 * * *'
  workflow_dispatch: 

jobs:
  update-calendar:
    runs-on: ubuntu-latest
    steps:
      - name: Update Daily Message
        env:
          BOT_TOKEN: \${{ secrets.TELEGRAM_BOT_TOKEN }}
        shell: python
        run: |
          import os, json, urllib.request, urllib.error
          from datetime import datetime, timedelta

          now = datetime.now() + timedelta(hours=2)
          chakra_base = datetime(1989, 12, 25)
          diff_days = (now - chakra_base).days
          day_of_cycle = (diff_days % 28) + 1
          
          CHAKRAS = ["MULADHARA", "SVADHISTHANA", "MANIPURA", "ANAHATA", "VISHUDDHA", "AJNA", "SAHASRARA"]
          CH_EM = ["❤️", "🧡", "💛", "💚", "🩵", "💙", "💜"]
          EL_EM = ["⛰ TIERRA", "💧 AGUA", "🌬 AIRE", "🔥 FUEGO"]
          
          c_idx = (day_of_cycle - 1) // 4
          e_idx = (day_of_cycle - 1) % 4
          
          full_msg = f"{CH_EM[c_idx]} {CHAKRAS[c_idx]} · {EL_EM[e_idx]}"
          if now.weekday() == 6: full_msg += " · 📱"

          token = os.environ.get("BOT_TOKEN")
          chat_id = "${config.chatId}"
          message_id = ${config.messageId}

          url = f"https://api.telegram.org/bot{token}/editMessageText"
          payload = {
              "chat_id": chat_id, 
              "message_id": message_id, 
              "text": full_msg, 
              "parse_mode": "Markdown",
              "reply_markup": {
                  "inline_keyboard": [[
                      {"text": "🥚", "web_app": {"url": "${config.miniAppUrl}"}}
                  ]]
              }
          }
          
          req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
          try:
              with urllib.request.urlopen(req) as r: print("✅ ACTUALIZADO")
          except Exception as e: print(f"❌ ERROR: {e}"); exit(1)
`;
};

export const generateInitScript = (config: ConfigState) => "Script de inicio...";
export const generateCryptoScript = (config: ConfigState) => "Script de crypto...";
export const generateSchumannScript = (config: ConfigState) => "Script de schumann...";
export const generateMiniAppButtonScript = () => "Botón manual...";
