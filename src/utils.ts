import { val } from "cheerio/lib/api/attributes";

export function isObject<T>(obj: any): obj is T {
  return Object.prototype.toString.call(obj) == "[object Object]";
}

export function isRegExp(obj: any): obj is RegExp {
  return Object.prototype.toString.call(obj) == "[object RegExp]";
}

export function isPrimitive(value: any) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

export function isArray<T>(obj: any): obj is Array<T> {
  return Object.prototype.toString.call(obj) == "[object Array]";
}

export function isString(obj: any): obj is string {
  return Object.prototype.toString.call(obj) == "[object String]";
}

export function isBlob(obj: any): obj is Blob {
  return Object.prototype.toString.call(obj) == "[object Blob]";
}

export function isNumber(obj: any): obj is number {
  return Object.prototype.toString.call(obj) == "[object Number]";
}

export function isFunction(obj: any): obj is Function {
  return Object.prototype.toString.call(obj) == "[object Function]";
}

export function isDate(obj: any): obj is Date {
  return Object.prototype.toString.call(obj) == "[object Date]";
}
/**
 *
 * 判断是否为空
 * @export
 * @param {*} obj
 * @return {*}  {boolean}
 */
export function isEmpty(obj: any): boolean {
  return obj === undefined || obj === null || obj === "";
}

/**
 *
 * 遍历对象
 * @export
 * @param {Record<string, any>} obj
 * @param {((value: any, key: string, obj: any) => void | boolean)} handler
 * @param {*} [context]
 * @returns {void}
 */
export function walkObj(
  obj: Record<string, any>,
  handler: (value: any, key: string, obj: any) => void | boolean,
  context?: any
): void {
  if (isEmpty(obj)) {
    console.error("遍历的obj对象为空");
    return;
  }
  const keys = Object.keys(obj);
  const len = keys.length;
  let key = null,
    value = null;
  for (let i = 0; i < len; i++) {
    key = keys[i];
    value = obj[key];
    if (!isEmpty(handler)) {
      const stop = handler.call(context, value, key, obj);
      if (stop) {
        return;
      }
    }
  }
}

export function walkArray(
  array: Array<any>,
  handler: (item: any, index: number, data: Array<any>) => void | boolean,
  context?: any
): void {
  if (isEmpty(array)) {
    return;
  }
  const len = array.length;
  let value;
  for (let i = 0; i < len; i++) {
    value = array[i];
    if (!isEmpty(handler)) {
      const stop: boolean | void = handler.call(context, value, i, array);
      if (stop) {
        return;
      }
    }
  }
}

/**
 *
 * 序列化对象
 * @export
 * @param {*} obj
 * @returns
 */
export function stringify(obj: any) {
  if (!obj) return "" + obj;
  return JSON.stringify(obj, (key: string, value: any) => {
    if (key === "") {
      return value;
    }
    // if(isObject<Object>(value)){
    //   walkObj(value,(key,val)=>{
    //     value[key]=stringify(val);
    //   })
    //   return value;
    // }
    // if(isArray<any>(value)){
    //   walkArray(value,(val,index)=>{
    //     value[index]=stringify(val);
    //   })
    //   return value;
    // }

    if (isFunction(value) || isRegExp(value)) {
      return value.toString();
    }
    if (isDate(value)) {
      return `new Date(${value.getTime()})`;
    }
    return value;
  });
}
