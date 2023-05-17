import * as fs from 'fs/promises';
import path from 'path';

const dir = path?.join(__dirname, '..', "..");
const folderWithPath: string = `${dir}/.logs`;
const fileName: string = fileNameWithDate();

type LogType = "ERROR" | "LOG" | "INFO" | "WARN";

export async function writeFile(): Promise<void> {
   try {            
      await fs?.mkdir(folderWithPath, {recursive: true});      
      Logger.info('Log Folder was created');
   } catch (e: any) {
      Logger.error('error at creating Log folder: ', e?.message);
   }
}

async function appendFile(content: any, type: LogType = 'LOG'): Promise<void> {
   try {
      const TIMESTAMP: string = new Date().toLocaleTimeString()?.substring(0, 8);      
      const logInformation: string = `${TIMESTAMP} [${type}] - ${content}\n`;
      fs.appendFile(`${folderWithPath}/${fileName}.log`, logInformation);
   } catch (e: any) {
      Logger.error(`Error at appending file at ${folderWithPath}/${fileName}.log: `, e);
   }
}

function fileNameWithDate(): string {
   let date = new Date().toLocaleString();
   let [d, t] = date?.split(", ");
   let [dt, m, y] = d?.split("/");
   let [h, mi, s] = t?.split(":");

   return `${dt}_${m}_${y}`;
}

export default class Logger {
   static #red: string = '\x1b[31m%s\x1b[0m';
   static #blue: string = '\x1b[36m%s\x1b[0m'
   static #yellow: string = '\x1b[33m%s\x1b[0m';
   static #white: string = '\x1b[37m%s\x1b[0m';

   static info(...arg: any): void {
      console.log(`[${Logger.#blue}]`, 'INFO', ...arg);
      appendFile(arg, 'INFO');
   }

   static error(...arg: any): void {
      console.log(`[${Logger.#red}]`, 'ERROR', ...arg);
      appendFile(arg, 'ERROR');
   }

   static warn(...arg: any): void {
      console.log(`[${Logger.#yellow}]`, 'WARN', ...arg);
      appendFile(arg, 'WARN');
   }

   static log(...arg: any): void {
      console.log(`[${Logger.#white}]`, 'LOG', ...arg);
      appendFile(arg, 'LOG');
   }
}