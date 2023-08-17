/** sqlSqlite
 *
 * Description
 *   - Functions For sql statement(string) in sqlite
 *
 * Functions
 *   [X]
 *
 * Usages
 *   -
 *
 * Requirements
 *
 * References
 *   - [[SQLite] 데이터 추가/변경하기(UPDATE, REPLACE INTO, INSERT OR IGNORE INTO)](https://heytech.tistory.com/43)
 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */
//
// & Import AREA
// &---------------------------------------------------------------------------
// ? Local Modules
import {
  // ? sql basic
  sqlKeyStr, // Convert key string(Wrap with '`') ex) sqlKeyStr('a') => `a`
  // sqlValStr, // Convert val(ue) string(Wrap with `'`) ex) sqlValStr(a) => '1'
  // sqlKeyValStr, // Convert Key equal Val string, ex) sqlKeyValStr('a', 1) => `a` = '1'
  // sqlJoinKeys, // Convert Key string[] to serialized string (Wrap with '`') ex) sqlJoinKeys(['a', 'b']) => `a`, `b`
  // sqlJoinVals, // Convert Val string[] to serialized string (Wrap with `'`) ex) sqlJoinVals([1, '2']) => '1', '2'
  // sqlJoinKeyVals, // sqlJoinKeyVals(['a', 'b'], [1, '2']) => `a` = '1', `b` = '2'
  // ? field schema
  sqlFieldNull, // Convert Mysql Schema (Googlesheet) to sql(CREATE TABLE) String For Null
  sqlFieldKey, //Convert Mysql Schema (Googlesheet) to sql(CREATE TABLE) String For Key(Primary)
  sqlFieldDefault, // Convert Mysql Schema (Googlesheet) to sql(CREATE TABLE) String For Default
  // ? sql unit
  // sqlWhereLikeUnit, // ex) sqlWhereLikeUnit('word1,word2', 'field1', {sep: 'or'}) => "`field1` like '%word1%' or `field1` like '%word2%'`"
  // sqlWhereEqualUnit, // ex) sqlWhereEqualUnit('word1,word2', 'field1', {isNot: true}) => "`field1` != 'word1' and `field1` != 'word2'"
  // ? CRUD
  // sqlSelect, // ex) sqlSelect('table1', {fields = ['field1', 'field2'], addStr = "where `field1`='val1'"}) => SELECT `field1`, `field2` FROM table1 where field1=val1
  // sqlInsertOne, // ex) sqlInsertOne('table1', {'field1': 'val1', 'field2': 'val2'}) => INSERT IGNORE INTO table1 (`field1`, `field2`) VALUES ('val1', 'val2');
  // sqlDelete, // ex) sqlDelete('table1', "where `field1`='val1'") => DELETE FROM table1 where `field1`='val1'
} from "./sqlCommon.js";

// & Function AREA
// &---------------------------------------------------------------------------
/**
 * Convert Mysql Schema (Googlesheet) to sqlite sql(CREATE TABLE) String For Datatype
 * @param str - 'varchar(100)'|'int'|... (Mysql Datatype)
 * @returns 'integer'|'real'|'text'|'blob'
 *
 * @remarks
 *   - For Only Sqlite, No Need for Mysql
 *
 * @example
 * sqlFieldType('varchar(100)')
 * => 'text'
 */
const sqlFieldTypeSqlite = (str: string) => {
  str = str.toLowerCase();
  if (str.includes("int")) {
    str = "integer";
  } else if (["float", "decimal", "double"].some((dtype) => str.includes(dtype))) {
    str = "real";
  } else {
    str = "text";
  }
  return str;
};

/**
 * Convert Mysql Schema (Googlesheet) to sqlite sql(CREATE TABLE) String For Extra Phrase
 * @param str - 'AUTO_INCREMENT'|'DEFAULT_GENERATED'|...
 * @returns 'AUTOINCREMENT'|''
 *
 * @remarks
 *   - For Only Sqlite, No Need for Mysql
 *
 * @example
 * sqlFieldExtra('AUTO_INCREMENT')
 * => 'AUTOINCREMENT'
 */
const sqlFieldExtraSqlite = (str: string) => {
  if (!str) return "";
  str = str.toUpperCase();
  return str.replace("AUTO_INCREMENT", "AUTOINCREMENT").replace("DEFAULT_GENERATED", "").replace(" ON UPDATE CURRENT_TIMESTAMP", "");
};

/**
 * Create Sql Unit For Sqlite
 * @param arr - Array(line) of Arrays(Mysql Schema[GoogleSheet])
 * @returns Create Table Sql Phrase Unit For Sqlite
 *
 * @example
 * sqlCreateTableUnitSqlite(['nid', 'int', 'NO', 'PRI', 'NULL', 'auto_increment', '', '공고 고유번호'])
 * => "`nid` integer NOT NULL PRIMARY KEY AUTOINCREMENT"
 */
const sqlCreateTableUnitSqlite = (arr: string[]) => {
  if (arr[0] == "-") return "";
  const arrConverted = [
    sqlKeyStr(arr[0]),
    sqlFieldTypeSqlite(arr[1]),
    sqlFieldNull(arr[2]),
    sqlFieldKey(arr[3]),
    sqlFieldDefault(arr[4]),
    sqlFieldExtraSqlite(arr[5]),
  ];
  return `${arrConverted.join(" ").replace(/ {2,}/g, " ").trim()}, `;
};

// ^ sql (sqlite)
// ^---------------------------------------------------------------------------
/**
 * Returns Sql String For Create Table in Sqlite
 *
 * @param tableName - Table Name
 * @param schemaArrs - Table Schema string[][]
 *
 * @remakrs
 *
 * @example
 *
 * ```
 * ```
 */
const sqlCreateTableSqlite = ({ tableName = "", schemaArrs = [[]] }) => {
  let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (`;
  sql += schemaArrs.slice(1).reduce((acc, cur) => `${acc}\n  ${sqlCreateTableUnitSqlite(cur)}`, "");

  return `${sql.trim().slice(0, -1)}\n);`;
};

// & Export AREA
// &---------------------------------------------------------------------------
export {
  // sqlFieldTypeSqlite, // Convert Mysql Schema (Googlesheet) to sqlite sql(CREATE TABLE) String For Datatype
  // sqlFieldExtraSqlite, // Convert Mysql Schema (Googlesheet) to sqlite sql(CREATE TABLE) String For Extra Phrase
  sqlCreateTableUnitSqlite, // Create Sql Unit For Sqlite
  sqlCreateTableSqlite, // Returns Sql String For Create Table in Sqlite
};
