/** pbUtils
 *
 * Description
 *   - Pocketbase Uitliy Functions
 *
 * Functions
 *   [X]
 *
 * Usages
 * -
 * Requirements
 * - jnj-lib-base
 *
 * References
 *   -
 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */

// & Import AREA
// &---------------------------------------------------------------------------

// ? UserMade Modules
import { getUpsertDicts, removeDictKeys } from "jnj-lib-base";

// & Variable AREA
// &---------------------------------------------------------------------------
const DEL_FIELDS = ["id", "created", "updated", "collectionId", "collectionName", "expand"];

// & Function AREA
// &---------------------------------------------------------------------------
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
const updateDictKeys = (dict: any, maps: any, keys: string[] = []) => {
  const dels = !keys || keys.length == 0 ? DEL_FIELDS : Object.keys(dict).filter((key: string) => !keys.includes(key));

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
};

/**
 * Update Dicts Keys
 *
 * @example
 * updateDictsKeys([{a: 1, b: 2, c: 3, d: 4}, {a: 6, b: 7, c: 8, d: 9}], {a: 'a1', c: 'c1'}, ['a', 'b', 'c'])
 * => [{a1: 1, b: 2, c1: 3}, {a1: 6, b: 7, c1: 8}]
 */
const updateDictsKeys = (dicts: any[], maps: any, keys: string[] = []) => {
  const dels = !keys || keys.length == 0 ? DEL_FIELDS : Object.keys(dicts[0]).filter((key: string) => !keys.includes(key));

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
};

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

// const upsertPbDicts = (olds: any[], news: any[], keys: any[]) => {
//   const upserts = {
//     adds: [], // 추가 data
//     delIds: [], // 삭제 id
//     upds: [], // 변경 data
//     updIds: [], // 변경 id
//   };

//   // Check for adds and upds dicts
//   news.forEach((newDict) => {
//     const matchingOldDict = olds.find((oldDict) =>
//       keys.every((key) => newDict[key] === oldDict[key])
//     );

//     if (!matchingOldDict) {
//       upserts.adds.push(newDict);
//     } else if (
//       !Object.entries(newDict).every(
//         ([key, value]) => matchingOldDict[key] === value
//       )
//     ) {
//       upserts.upds.push(newDict);
//       upserts.updIds.push(matchingOldDict.id);
//     }
//   });

//   // Check for dels dicts
//   olds.forEach((oldDict) => {
//     const matchingNewDict = news.find((newDict) =>
//       keys.every((key) => oldDict[key] === newDict[key])
//     );

//     if (!matchingNewDict) {
//       upserts.delIds.push(oldDict.id);
//     }
//   });

//   return upserts;
// }

// & Export AREA
// &---------------------------------------------------------------------------
export {
  updateDictKeys,
  updateDictsKeys,
  // upsertPbDicts,
};
