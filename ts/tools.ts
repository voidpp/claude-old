
import { LocalStorageSchema } from "./types";

const localStorageHandler = {
    get: (target: LocalStorageSchema, name: string) => {
        const res = window.localStorage.getItem(name);
        return res == undefined ? target[name] : JSON.parse(res);
    },
    set: (target: LocalStorageSchema, name: string, value: any, receiver: any) => {
        window.localStorage.setItem(name, JSON.stringify(value));
        return true;
    },
}

export const claudeLocalStorage = new Proxy<LocalStorageSchema>(new LocalStorageSchema(), localStorageHandler);

export function copy<T>(data: T): T {
    return JSON.parse(JSON.stringify(data))
}
