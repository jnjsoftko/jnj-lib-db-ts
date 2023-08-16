/** sqlMysql
 *
 * Description
 *   - Functions For sql statement(string) in mysql
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
 *   -
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
 * Create Sql Unit For Mysql
 * @param arr - Array(line) of Arrays(Mysql Schema[GoogleSheet])
 * @returns Create Table Sql Phrase Unit For Mysql
 *
 * @example
 * sqlCreateTableUnitMysql(['nid', 'int', 'NO', 'PRI', 'NULL', 'auto_increment', '', '공고 고유번호'])
 * => "`nid` int NOT NULL PRIMARY KEY auto_increment"
 */
const sqlCreateTableUnitMysql = (arr: string[]) => {
  if (arr[0] == "-") return "";
  const arrConverted = [sqlKeyStr(arr[0]), arr[1], sqlFieldNull(arr[2]), sqlFieldKey(arr[3]), sqlFieldDefault(arr[4]), arr[5]];
  return `${arrConverted.join(" ").replace(/ {2,}/g, " ").trim()}, `;
};

/**
 * Returns Sql String For Create Table in Mysql
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
const sqlCreateTableMysql = ({ tableName = "", schemaArrs = [[""]] }) => {
  let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (`;
  sql += schemaArrs.slice(1).reduce((acc, cur) => `${acc}\n  ${sqlCreateTableUnitMysql(cur)}`, "");

  return `${sql.trim().slice(0, -1)}\n);`;
};

/**
 * Returns Sql String For Backup Table in Mysql
 *
 * @param tableName - Table Name
 * @param filePath - Backup File Path
 *
 * @remarks
 * [MySQL table into CSV file](https://gist.github.com/gaerae/6219678)
 * mysql -p my_db -e "SELECT * FROM my_table" | sed 's/\t/","/g;s/^/"/;s/$/"/;' > my_table.csv
 */
const sqlBackupTableMysql = (tableName: string, filePath: string) => {
  return `SELECT * FROM ${tableName}
  INTO OUTFILE '${filePath}'
  CHARACTER SET euckr
  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
  ESCAPED BY '\\'
  LINES TERMINATED BY '\n'`;
};

// & Export AREA
// &---------------------------------------------------------------------------
export {
  // sqlCreateTableUnitMysql, // Create Sql Unit For Mysql
  sqlCreateTableMysql, // Returns Sql String For Create Table in Mysql
  sqlBackupTableMysql, // Returns Sql String For Backup Table in Mysql
};
