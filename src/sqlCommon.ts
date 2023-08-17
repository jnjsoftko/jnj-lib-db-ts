/** sql
 *
 * Description
 *   - Functions For sql statement(string) in mysql, sqlite
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

// & Function AREA
// &---------------------------------------------------------------------------

// * sql Base: (Using at select / inseret / update / ...) Wrap key(field)/val
/**
 * Convert key string(Wrap with '`')
 */
const sqlKeyStr = (key: string) => {
  return "`" + key + "`";
};

/**
 * Convert val(ue) string(Wrap with `'`)
 */
const sqlValStr = (val: any) => {
  if (typeof val === "string") {
    return "'" + val.replace("'", "\\'").replace('"', '\\"') + "'";
  }
  return val;
};

/**
 * Convert Key equal Val string
 *
 * @example
 * ```
 * sqlKeyValStr('a', 1);
 *
 * # result
 * `a` = '1'
 * ```
 */
const sqlKeyValStr = (key: string, val: any) => {
  return `${sqlKeyStr(key)} = ${sqlValStr(val)}`;
};

/**
 * Convert Key string[] to serialized string (Wrap with '`')
 *
 * @example
 * ```
 * sqlJoinKeys(['a', 'b']);
 *
 * # result
 * `a`, `b`
 * ```
 */
const sqlJoinKeys = (keys: string[]) => {
  return keys.map(sqlKeyStr).join(", ");
};

/**
 * Convert Val string[] to serialized string (Wrap with `'`)
 *
 * @example
 * ```
 * sqlJoinVals([1, '2']);
 *
 * # result
 * '1', '2'
 * ```
 */
const sqlJoinVals = (vals: any[]) => {
  return vals.map(sqlValStr).join(", ");
};

/**
 * Convert Key and Val string[] to serialized string (Wrap with '`')
 *
 * @example
 * ```
 * sqlJoinKeyVals(['a', 'b'], [1, '2']);
 *
 * # result
 * `a` = '1', `b` = '2'
 * ```
 */
const sqlJoinKeyVals = (keys: string[], vals: any[]) => {
  return keys.map((k, i) => sqlKeyValStr(k, vals[i])).join(", ");
};

// * Convert Field(mysql schema(in googlesheet) -> sql) (Using at create table)
/**
 * Convert Mysql Schema (Googlesheet) to sql(CREATE TABLE) String For Null
 * @param str - 'YES'|'NO'
 * @returns ''|'NOT NULL'
 *
 * @remarks
 *   - For Only Sqlite, No Need for Mysql
 *
 * @example
 * sqlFieldNull('YES')
 * => ''
 */
const sqlFieldNull = (str: string) => {
  return str.toUpperCase() == "YES" ? "" : "NOT NULL";
};

/**
 * Convert Mysql Schema (Googlesheet) to sql(CREATE TABLE) String For Key(Primary)
 * @param str - ''|'PRI'
 * @returns ''|'NOT NULL'
 *
 * @remarks
 *   - Sqlite | Mysql
 *
 * @example
 * sqlFieldKey('PRI')
 * => 'PRIMARY KEY'
 */
const sqlFieldKey = (str: string) => {
  return str.toUpperCase() == "PRI" ? "PRIMARY KEY" : str;
};

/**
 * Convert Mysql Schema (Googlesheet) to sql(CREATE TABLE) String For Default
 * @param str - 'NULL'|'<str>' (default value)
 * @returns ''|'DEFAULT <str>'
 *
 * @remarks
 *   - Sqlite | Mysql
 *
 * @example
 * sqlFieldDefault('default1')
 * => 'DEFAULT default1'
 */
const sqlFieldDefault = (str: string) => {
  return str.toUpperCase() == "NULL" ? "" : `DEFAULT ${str}`;
};

// * sql Unit (sql statement(string) unit)
/**
 * Create Sql Where Like Phrase Unit For given Params(wordsStr, field, sep, isNot)
 * @param wordsStr - 'word1,word2'
 * @param field - 'word1,word2'
 * @param sep - separator(operator) 'and'|'and'
 * @param isNot - false|true
 * @returns Where Phrase Unit
 *
 * @example
 * sqlWhereLikeUnit('word1,word2', 'field1', {sep: 'or'})
 * => "`field1` like '%word1%' or `field1` like '%word2%'`"
 */
const sqlWhereLikeUnit = (wordsStr: string, field: string, { sep = "and", isNot = false }) => {
  const notTag = isNot ? " not" : " ";
  const words = wordsStr.trim().split(",");
  if (words.length === 0 || wordsStr.trim() === "") {
    return "";
  }
  const whereStr = words.map((word) => `\`${field}\`${notTag} like '%${word}%'`).join(` ${sep} `);
  return whereStr;
};

/**
 * Create Sql Where Equal Phrase Unit For given Params(wordsStr, field, sep, isNot)
 * @param wordsStr - 'word1,word2'
 * @param field - 'word1,word2'
 * @param sep - separator(operator) 'and'|'and'
 * @param isNot - false|true
 * @returns Where Phrase Unit
 *
 * @example
 *
 * @example
 * sqlWhereEqualUnit('word1,word2', 'field1', {isNot: true})
 * => "`field1` != 'word1' and `field1` != 'word2'"
 */
const sqlWhereEqualUnit = (wordsStr: string, field: string, { sep = "and", isNot = false }) => {
  const words = wordsStr.trim().split(",");
  if (words.length === 0 || wordsStr.trim() === "") {
    return "";
  }
  const whereStr = words.map((word) => `\`${field}\`${isNot ? " !=" : " ="} '%${word}%'`).join(` ${sep} `);
  return whereStr;
};

// * sql CRUD (mysql / sqlite)
/**
 * SELECT Sql
 *
 * @param tableName -
 * @param fields
 * @param addStr
 * @returns SELECT Sql Phrase Unit For (Mysql|Sqlite)
 *
 * @example
 *   sqlSelect('table1', {fields = ['field1', 'field2'], addStr = "where `field1`='val1'"})
 *   => SELECT `field1`, `field2` FROM table1 where `field1`='val1'
 */
const sqlSelect = (tableName: string, { fields = [""], addStr = "" }) => {
  const _fields = fields.length > 0 ? fields.map((field) => sqlKeyStr(field.trim())).join(", ") : "*";
  const sql = `SELECT ${_fields} FROM ${tableName}`;
  return addStr ? `${sql} ${addStr};` : `${sql};`;
};

/**
 * INSERT Sql
 *
 * @param tableName -
 * @param data
 * @returns INSERT Sql Phrase Unit For (Mysql|Sqlite)
 *
 * @example
 *  sqlInsertOne('table1', {'field1': 'val1', 'field2': 'val2'})
 *  => INSERT INTO table1 (`field1`, `field2`) VALUES ('val1', 'val2')
 */
const sqlInsertOne = (tableName: string, data: any) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  return `INSERT INTO ${tableName} (${sqlJoinKeys(keys)}) VALUES (${sqlJoinVals(values)});`;
  // return `INSERT IGNORE INTO ${tableName} (${sqlJoinKeys(keys)}) VALUES (${sqlJoinVals(values)});`;
};

/**
 * DELETE Sql
 *
 * @param tableName -
 * @param addStr
 * @returns INSERT Sql Phrase Unit For (Mysql|Sqlite)
 *
 * @example
 *  sqlDelete('table1', "where `field1`='val1'")
 *  => DELETE FROM table1 where `field1`='val1'
 */
const sqlDelete = (tableName: string, addStr: string) => {
  return `DELETE FROM ${tableName} ${addStr}`;
};

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
};
