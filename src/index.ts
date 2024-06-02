/** index
 *
 * Description
 *   - Start Point for jnj-lib-db
 *
 * Functions
 *   [X]
 *
 * Usages
 *
 * Requirements
 *   - jnj-lib-base jnj-lib-doc jnj-lib-google
 *   - sqlite3 pocketbase mysql
 *   ```sh
 *   $ npm install jnj-lib-base jnj-lib-google jnj-lib-doc jnj-lib-db
 *   $ npm @octokit/rest dotenv googleapis@105 @google-cloud/local-auth@2.1.0 csv js-yaml ini xlsx sqlite3 pocketbase mysql
 *   ```
 *
 *  > `/.env`
 *  ```
 *  DEV_SETTINGS=C:/JnJ-soft/Developments/_Settings
 *  PUBLIC_POCKETBASE_URL="http://127.0.0.1:8090"
 *  POCKETBASE_ADMIN_EMAIL=
 *  POCKETBASE_ADMIN_PASSWORD=
 *  ```
 *
 * References
 *   -
 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */

// & Export AREA
// &---------------------------------------------------------------------------
export {
  // ? sql basic
  sqlKeyStr, // Convert key string(Wrap with '`') ex) sqlKeyStr('a') => `a`
  sqlValStr, // Convert val(ue) string(Wrap with `'`) ex) sqlValStr(a) => '1'
  sqlKeyValStr, // Convert Key equal Val string, ex) sqlKeyValStr('a', 1) => `a` = '1'
  sqlJoinKeys, // Convert Key string[] to serialized string (Wrap with '`') ex) sqlJoinKeys(['a', 'b']) => `a`, `b`
  sqlJoinVals, // Convert Val string[] to serialized string (Wrap with `'`) ex) sqlJoinVals([1, '2']) => '1', '2'
  sqlJoinKeyVals, // sqlJoinKeyVals(['a', 'b'], [1, '2']) => `a` = '1', `b` = '2'
  // ? field schema
  sqlFieldNull, // Convert Mysql Schema (Googlesheet) to sql(CREATE TABLE) String For Null
  sqlFieldKey, //Convert Mysql Schema (Googlesheet) to sql(CREATE TABLE) String For Key(Primary)
  sqlFieldDefault, // Convert Mysql Schema (Googlesheet) to sql(CREATE TABLE) String For Default
  // ? sql unit
  sqlWhereLikeUnit, // ex) sqlWhereLikeUnit('word1,word2', 'field1', {sep: 'or'}) => "`field1` like '%word1%' or `field1` like '%word2%'`"
  sqlWhereEqualUnit, // ex) sqlWhereEqualUnit('word1,word2', 'field1', {isNot: true}) => "`field1` != 'word1' and `field1` != 'word2'"
  // ? CRUD
  sqlSelect, // ex) sqlSelect('table1', {fields = ['field1', 'field2'], addStr = "where `field1`='val1'"}) => SELECT `field1`, `field2` FROM table1 where field1=val1
  sqlInsertOne, // ex) sqlInsertOne('table1', {'field1': 'val1', 'field2': 'val2'}) => INSERT IGNORE INTO table1 (`field1`, `field2`) VALUES ('val1', 'val2');
  sqlDelete, // ex) sqlDelete('table1', "where `field1`='val1'") => DELETE FROM table1 where `field1`='val1'
} from "./sqlCommon.js";

export {
  // sqlCreateTableUnitMysql, // Create Sql Unit For Mysql
  sqlCreateTableMysql, // Returns Sql String For Create Table in Mysql
  sqlBackupTableMysql, // Returns Sql String For Backup Table in Mysql
} from "./sqlMysql.js";

export {
  // sqlFieldTypeSqlite, // Convert Mysql Schema (Googlesheet) to sqlite sql(CREATE TABLE) String For Datatype
  // sqlFieldExtraSqlite, // Convert Mysql Schema (Googlesheet) to sqlite sql(CREATE TABLE) String For Extra Phrase
  sqlCreateTableUnitSqlite, // Create Sql Unit For Sqlite
  sqlCreateTableSqlite, // Returns Sql String For Create Table in Sqlite
} from "./sqlSqlite.js";

export {
  // sqlFieldTypePocketbase, // Convert Mysql Schema (Googlesheet) to pocketbase sql(CREATE TABLE) String For Datatype
  pocketbaseSchemaFromMysqlSchema, // Returns Sql String For Create Table in Sqlite
} from "./sqlPocketbase.js";

export { Sqlite } from "./Sqlite.js";

export { PbApi } from "./PbApi.js";

export { PbRest } from "./PbRest.js";
