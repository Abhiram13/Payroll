export default class Logger {
   static #red: string = '\x1b[31m%s\x1b[0m';
   static #blue: string = '\x1b[36m%s\x1b[0m'
   static #yellow: string = '\x1b[33m%s\x1b[0m';
   static #white: string = '\x1b[37m%s\x1b[0m';

   static info(...arg: any): void {
      console.log(`[${Logger.#blue}]`, 'INFO', ...arg);
   }

   static error(...arg: any): void {
      console.log(`[${Logger.#red}]`, 'ERROR', ...arg);
   }

   static warn(...arg: any): void {
      console.log(`[${Logger.#yellow}]`, 'WARN', ...arg);
   }

   static log(...arg: any): void {
      console.log(`[${Logger.#white}]`, 'LOG', ...arg);
   }
}