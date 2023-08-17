/** sqlPocketbase
 *
 * Description
 *   - Functions For sql statement(string) in pocketbase
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
 *   - https://pocketbase.io/docs/collections
 *   - https://pocketbase.io/docs/js-collections/#create-new-collection
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
 * Convert Mysql Schema (Googlesheet) to pocketbase sql(CREATE TABLE) String For Datatype
 * @param str - 'varchar(100)'|'int'|... (Mysql Datatype)
 * @returns text|number|bool|email|url|date|select|file|relation|json
 *
 * @remarks
 *   - For Only Sqlite, No Need for Mysql
 *
 * @example
 * sqlFieldType('varchar(100)')
 * => 'text'
 */
const sqlFieldTypePocketbase = (str: string) => {
  str = str.toLowerCase();
  if (str.includes("tinyint")) {
    str = "bool";
  } else if (["int", "float", "decimal", "double"].some((dtype) => str.includes(dtype))) {
    str = "number";
  } else if (["date", "time"].some((dtype) => str.includes(dtype))) {
    str = "date";
  } else {
    str = "text";
  }
  return str;
};

/**
 * Pocketbase Schema From Mysql Schema
 * TODO: email, url, json type 구현 (_remark 활용?)
 * TODO: relation type 구현(collectionId <- tableName)
 * @param schema - []
 *
 * @example
 *
 * pocketbaseSchemaFromMysqlSchema(schemaArrs)
 * =>
 */
const pocketbaseSchemaFromMysqlSchema = (schemaArrs: string[][], hasHeader = true) => {
  let schema: any[] = [];
  if (hasHeader) {
    schemaArrs = schemaArrs.slice(1);
  }
  for (const arr of schemaArrs) {
    let field = { name: arr[0], type: sqlFieldTypePocketbase(arr[1]), required: false };
    if (arr[2].trim() == "NO") {
      field["required"] = true;
    }
    schema.push(field);
  }
  return schema;
};

// const schemaArrs = [
//   ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra', '_colNum', '_remark'],
//   ['nid', 'int', 'NO', 'PRI', 'NULL', 'auto_increment', '', '공고 고유번호'],
//   ['제목', 'varchar(100)', 'YES', '', 'test'],
//   ['updated_at', 'datetime', 'NO', '', 'CURRENT_TIMESTAMP', 'DEFAULT_GENERATED on update CURRENT_TIMESTAMP']
// ];

// & Export AREA
// &---------------------------------------------------------------------------
export {
  // sqlFieldTypePocketbase, // Convert Mysql Schema (Googlesheet) to pocketbase sql(CREATE TABLE) String For Datatype
  pocketbaseSchemaFromMysqlSchema, // Returns Sql String For Create Table in Sqlite
};

// & Test AREA
// &---------------------------------------------------------------------------
// * https://pocketbase.io/docs/collections
// text	"", "example"
// editor	"", "<p>example</p>"
// number	0, -1, 1, 1.5	+ (add), - (subtract)
// bool	false, true
// email	"", "test@example.com"
// url	"", "https://example.com"
// date	"", "2022-01-01 00:00:00.000Z"
// select (single)	"", "optionA"
// select (multiple)	[], ["optionA", "optionB"]	+ (append), - (remove)
// relation (single)	"", "JJ2YRU30FBG8MqX"
// relation (multiple)	[], ["JJ2YRU30FBG8MqX", "eP2jCr1h3NGtsbz"]	+ (append), - (remove)
// file (single)	"", "example123_Ab24ZjL.png"
// file (multiple)	[], ["file1_Ab24ZjL.png", "file2_Frq24ZjL.txt"]	- (remove)
// json	any json value
