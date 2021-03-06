import {remote} from 'electron';

let shortcuts = {};

/**
 * Unregister global hotkey
 * @param  {gui.Shortcut | string | object} hotkey
 * @return {void}
 */
const unregisterGlobalShortcut = (name) => {
    const accelerator = shortcuts[name];
    if(accelerator) {
        remote.globalShortcut.unregister(accelerator);
        delete shortcuts[name];
        if(DEBUG) {
            console.color(`GLOBAL HOTKEY REMOVE ${name}: ${accelerator}`, 'purpleOutline');
        }
    }
};

/**
 * Register global hotkey
 * @param  {object} option
 * @param  {string} name
 * @return {void}
 */
const registerGlobalShortcut = (name, accelerator, callback) => {
    unregisterGlobalShortcut(name);
    shortcuts[name] = accelerator;
    remote.globalShortcut.register(accelerator, () => {
        if(DEBUG) {
            console.color(`GLOBAL KEY ACTIVE ${name}: ${accelerator}`, 'redOutline');
        }
        callback();
    });
    if(DEBUG) {
        console.color(`GLOBAL HOTKEY BIND ${name}: ${accelerator}`, 'purpleOutline');
    }
};

/**
 * Check a shortcu whether is registered
 */
const isGlobalShortcutRegistered = (accelerator) => {
    return remote.globalShortcut.isRegistered(accelerator);
};

export default {
    unregisterAll: remote.globalShortcut.unregisterAll,
    unregisterGlobalShortcut,
    registerGlobalShortcut,
    isGlobalShortcutRegistered
};
