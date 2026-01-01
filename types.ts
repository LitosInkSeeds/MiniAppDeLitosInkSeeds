
export interface CycleState {
  dayOfCycle: number;
  moonAge: number;
  chakraIndex: number;
  elementIndex: number;
  moonPhase: string;
  moonEmoji: string;
  chakraName: string;
  chakraEmoji: string;
  elementName: string;
  elementEmoji: string;
  moonText: string;
}

export interface ConfigState {
  baseDate: string; 
  telegramToken: string;
  chatId: string;
  messageId: number; 
  cryptoMessageId: number; 
  schumannMessageId: number;
  miniAppUrl: string;
}

export const CHAKRA_NAMES = ["MULADHARA", "SVADHISTHANA", "MANIPURA", "ANAHATA", "VISHUDDHA", "AJNA", "SAHASRARA"];
export const CHAKRA_EMOJIS = ["❤️", "🧡", "💛", "💚", "🩵", "💙", "💜"];
export const ELEMENT_NAMES = ["TIERRA", "AGUA", "AIRE", "FUEGO"];
export const ELEMENT_EMOJIS = ["⛰", "💧", "🌬", "🔥"];
