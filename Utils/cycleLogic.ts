
import { ConfigState, CycleState, CHAKRA_NAMES, CHAKRA_EMOJIS, ELEMENT_NAMES, ELEMENT_EMOJIS } from '../types';

export const calculateCycleState = (baseDateStr: string): CycleState => {
  const now = new Date();
  const targetTime = now.getTime() + (2 * 60 * 60 * 1000); 
  const chakraBase = new Date(baseDateStr).getTime();
  const diffDays = Math.floor((targetTime - chakraBase) / (1000 * 60 * 60 * 24));
  const dayOfCycle = ((diffDays % 28) + 28) % 28 + 1; 

  const chakraIndex = Math.floor((dayOfCycle - 1) / 4);
  const elementIndex = (dayOfCycle - 1) % 4;

  const moonRef = new Date('2024-10-17T11:26:00Z').getTime();
  const synodicMonth = 29.53059 * 24 * 60 * 60 * 1000;
  const moonAgeDays = ((targetTime - moonRef) % synodicMonth + synodicMonth) % synodicMonth / (24 * 60 * 60 * 1000);

  let moonEmoji = "🌕";
  let moonPhase = "Llena";
  if (moonAgeDays >= 13.5 && moonAgeDays <= 16.5) { moonEmoji = "🌑"; moonPhase = "Nueva"; }
  else if (moonAgeDays < 7) { moonEmoji = "🌖"; moonPhase = "Menguante"; }
  else if (moonAgeDays < 13.5) { moonEmoji = "🌗"; moonPhase = "Cuarto"; }
  else if (moonAgeDays < 21) { moonEmoji = "🌒"; moonPhase = "Creciente"; }
  else { moonEmoji = "🌓"; moonPhase = "Cuarto"; }

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
    moonText: ""
  };
};

export const generateFixedScript = (config: ConfigState): string => `name: Daily Update\non: {schedule: [{cron: '0 22 * * *'}], workflow_dispatch: null}\njobs: { update: { runs-on: ubuntu-latest, steps: [{ name: Update, env: { BT: "\${{ secrets.TELEGRAM_BOT_TOKEN }}" }, shell: python, run: "import os, json, urllib.request\\nurl = f\\"https://api.telegram.org/bot{os.environ['BT']}/editMessageText\\"\\np = { \\"chat_id\\": \\"${config.chatId}\\", \\"message_id\\": ${config.messageId}, \\"text\\": \\"Ciclo Cosmico Actualizado\\", \\"reply_markup\\": {\\"inline_keyboard\\": [[{\\"text\\": \\"🥚 Abrir MiniApp\\", \\"web_app\\": {\\"url\\": \\"${config.miniAppUrl}\\"}}]]} }\\nreq = urllib.request.Request(url, data=json.dumps(p).encode(), headers={'Content-Type': 'application/json'})\\nurllib.request.urlopen(req)" }] } }`;
export const generateInitScript = (config: ConfigState): string => `name: Init\non: [workflow_dispatch]\njobs: { setup: { runs-on: ubuntu-latest, steps: [{ name: Send, env: { BT: "\${{ secrets.TELEGRAM_BOT_TOKEN }}" }, shell: python, run: "import os, json, urllib.request\\nurl = f\\"https://api.telegram.org/bot{os.environ['BT']}/sendMessage\\"\\np = { \\"chat_id\\": \\"${config.chatId}\\", \\"text\\": \\"🚀 Sistema Iniciado\\", \\"reply_markup\\": {\\"inline_keyboard\\": [[{\\"text\\": \\"🥚\\", \\"web_app\\": {\\"url\\": \\"${config.miniAppUrl}\\"}}]]} }\\nreq = urllib.request.Request(url, data=json.dumps(p).encode(), headers={'Content-Type': 'application/json'})\\nurllib.request.urlopen(req)" }] } }`;
export const generateCryptoScript = (config: ConfigState): string => ``; // Opcional
export const generateSchumannScript = (config: ConfigState): string => ``; // Opcional
export const generateMiniAppButtonScript = (): string => `{"text": "🥚", "web_app": {"url": "${window.location.href}"}}`;
