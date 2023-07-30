import { getUpsertDicts, removeDictKeys } from "jnj-lib-base";

const DEL_FIELDS = [
  "id",
  "created",
  "updated",
  "collectionId",
  "collectionName",
  "expand",
];

/**
 * Update Dict Keys
 *
 * @example
 *
 * updateDictKeys({a: 1, b: 2, c: 3, d: 4}, {a: 'a1', c: 'c1'}, ['a', 'b', 'c'])
 *
 * => {a1: 1, b: 2, c1: 3}
 *
 *
 */
function updateDictKeys(dict: any, maps: any, keys: string[] = []) {
  const dels =
    !keys || keys.length == 0
      ? DEL_FIELDS
      : Object.keys(dict).filter((key: string) => !keys.includes(key));

  dict = removeDictKeys(dict, dels);

  if (!maps || Object.keys(maps).length == 0) {
    return dict;
  }

  const _dict = {};

  for (let [key, val] of Object.entries(dict)) {
    if (maps.hasOwnProperty(key)) {
      _dict[maps[key]] = dict[key];
    } else {
      _dict[key] = dict[key];
    }
  }

  // console.log("@@@@updateDictKeys _dict", _dict);
  return _dict;
}

/**
 * Update Dicts Keys
 *
 * @example
 * updateDictsKeys([{a: 1, b: 2, c: 3, d: 4}, {a: 6, b: 7, c: 8, d: 9}], {a: 'a1', c: 'c1'}, ['a', 'b', 'c'])
 * => [{a1: 1, b: 2, c1: 3}, {a1: 6, b: 7, c1: 8}]
 */
function updateDictsKeys(dicts: any[], maps: any, keys: string[] = []) {
  const dels =
    !keys || keys.length == 0
      ? DEL_FIELDS
      : Object.keys(dicts[0]).filter((key: string) => !keys.includes(key));

  dicts = dicts.map((dict) => removeDictKeys(dict, dels));

  if (!maps || Object.keys(maps).length == 0) {
    return dicts;
  }

  const _dicts = dicts.map((dict) => {
    const _dict = {};

    for (let [key, val] of Object.entries(dict)) {
      if (maps.hasOwnProperty(key)) {
        _dict[maps[key]] = dict[key];
      } else {
        _dict[key] = dict[key];
      }
    }

    return _dict;
  });

  return _dicts;
}

/**
 * Pocketbase용 upsert dicts
 * @param olds: 현재 pocketbase records(`id` 포함)
 * @param news: upseret 예정 dicts
 * @param keys: (동일 record 여부)비교 keys
 *
 * @example
 * const olds = [ { id: 111, a: 1, b: 2, c: 3 }, { id: 222, a: 4, b: 5, c: 6 }, { id: 333, a: 4, b: 6, c: 9 }, { id: 444, a: 5, b: 6, c: 9 }];
 * const news = [ { a: 1, b: 2, d: 3 }, { a: 4, b: 6, d: 8 }, { a: 4, b: 8, d: 10 }];
 * const keys = ['a', 'b'];
 * upsertPbDicts(olds, news, keys)
 * => { adds: [ { a: 4, b: 8, d: 10 } ], delIds: [ 222, 444 ], upds: [ { a: 1, b: 2, d: 3 }, { a: 4, b: 6, d: 8 } ], updIds: [ 111, 333 ]
}
 */

function upsertPbDicts(olds: any[], news: any[], keys: any[]) {
  const upserts = {
    adds: [], // 추가 data
    delIds: [], // 삭제 id
    upds: [], // 변경 data
    updIds: [], // 변경 id
  };

  // Check for adds and upds dicts
  news.forEach((newDict) => {
    const matchingOldDict = olds.find((oldDict) =>
      keys.every((key) => newDict[key] === oldDict[key])
    );

    if (!matchingOldDict) {
      upserts.adds.push(newDict);
    } else if (
      !Object.entries(newDict).every(
        ([key, value]) => matchingOldDict[key] === value
      )
    ) {
      upserts.upds.push(newDict);
      upserts.updIds.push(matchingOldDict.id);
    }
  });

  // Check for dels dicts
  olds.forEach((oldDict) => {
    const matchingNewDict = news.find((newDict) =>
      keys.every((key) => oldDict[key] === newDict[key])
    );

    if (!matchingNewDict) {
      upserts.delIds.push(oldDict.id);
    }
  });

  return upserts;
}

/**
 * Convert Mysql Schema (Googlesheet) to Sql(CREATE TABLE) String For Datatype
 * @param str - 'varchar(100)'|'int'|... (Mysql Datatype)
 * @returns text|number|bool|email|url|datetime|select|file|relation|json
 *
 * @remarks
 *   - For Only Sqlite, No Need for Mysql
 *
 * @example
 * sqlFieldType('varchar(100)')
 * => 'text'
 */
const sqlFieldType = (str: string) => {
  str = str.toLowerCase();
  if (str.includes("tinyint")) {
    str = "bool";
  } else if (
    ["int", "float", "decimal", "double"].some((dtype) => str.includes(dtype))
  ) {
    str = "number";
  } else {
    str = "text";
  }
  return str;
};

/**
 * Pocketbase Schema From Mysql Schema
 *
 * @param schema - []
 *
 * @example
 *
 * pocketbaseSchemaFromMysqlSchema(schemaArrs)
 * =>
 */
const pocketbaseSchemaFromMysqlSchema = (
  schemaArrs: any[],
  hasHeader = true
) => {
  let schema = [];
  if (hasHeader) {
    schemaArrs = schemaArrs.slice(1);
  }
  for (const arr of schemaArrs) {
    let field = { name: arr[0], type: sqlFieldType(arr[1]) };
    if (arr[2].trim() == "NO") {
      field["required"] = true;
    }
    schema.push(field);
  }
  return schema;
};

export {
  updateDictKeys,
  updateDictsKeys,
  upsertPbDicts,
  sqlFieldType,
  pocketbaseSchemaFromMysqlSchema,
};
