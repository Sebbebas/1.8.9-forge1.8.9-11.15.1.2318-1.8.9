import DeepProxy from 'DeepProxy';

const PDDEFAULT_FILE_NAME = ".persistantData.json";

const ensureSerializable = value => {
  if (typeof value === 'object')
    Object.values(value).forEach(ensureSerializable);

  if (typeof value === 'symbol')
    throw new Error(`[PersistentData] Attempt to store a Symbol. Symbols are not serializable.`);

  if (typeof value === 'function')
    throw new Error(`[PersistentData] Attempt to store a function. Functions are not serializable.`);
}

export default class PDObject {
  static pdObjects = {};

  constructor(moduleName, defaultValue = {}, fileName = PDDEFAULT_FILE_NAME) {
    if (PDObject.pdObjects[moduleName]?.includes(fileName)) {
      throw new Error('A PDObject has already been created for ' +
        `module ${moduleName} with the name ${fileName}. The file name can be` + 
        'specified by a third parameter to the constructor.');
    }

    if (PDObject.pdObjects[moduleName] === undefined) {
      PDObject.pdObjects[moduleName] = [fileName];
    } else {
      PDObject.pdObjects[moduleName].push(fileName);
    }

    if (typeof defaultValue !== 'object') {
      throw new Error('PDObjects can only wrap objects.');
    }

    let value = defaultValue;
    const fileStr = FileLib.read(moduleName, fileName);
    
    if (fileStr === undefined || fileStr === null) {
      FileLib.write(moduleName, fileName, JSON.stringify(defaultValue, null, 4));
    } else {
      try {
        value = JSON.parse(fileStr);
      } catch (e) {
        throw new Error(`Unable to read persistent data file: ${e}`);
      }
    }

    return new DeepProxy(value, {
      get(target, path) {
        const value = target[path];
        if (typeof value === 'object') {
          return this.nest(value);
        }
        return value;
      },
      set(target, path, value) {
        ensureSerializable(value);
        target[path] = value;
        FileLib.write(moduleName, fileName, JSON.stringify(this.rootTarget, null, 4));
      },
    });
  }
}
