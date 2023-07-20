// [[SQLite] 데이터 추가/변경하기(UPDATE, REPLACE INTO, INSERT OR IGNORE INTO)](https://heytech.tistory.com/43)

// & sql Base: (Using at select / inseret / update / ...) Wrap key(field)/val
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
 * Convert Val string[] to serialized string (Wrap with '`')
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

// & Field (Using at create table)
/**
 * Convert Mysql Schema (Googlesheet) to Sql(CREATE TABLE) String For Datatype
 * @param str - 'varchar(100)'|'int'|... (Mysql Datatype)
 * @returns 'integer'|'real'|'text'|'date'|'datetime'|'timestamp'
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
  if (["date", "time"].some((dtype) => str.includes(dtype))) {
    return str;
  }

  if (str.includes("int")) {
    str = "integer";
  } else if (
    ["float", "decimal", "double"].some((dtype) => str.includes(dtype))
  ) {
    str = "real";
  } else {
    str = "text";
  }
  return str;
};

/**
 * Convert Mysql Schema (Googlesheet) to Sql(CREATE TABLE) String For Null
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
 * Convert Mysql Schema (Googlesheet) to Sql(CREATE TABLE) String For Key(Primary)
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
 * Convert Mysql Schema (Googlesheet) to Sql(CREATE TABLE) String For Default
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

/**
 * Convert Mysql Schema (Googlesheet) to Sql(CREATE TABLE) String For Extra Phrase
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
const sqlFieldExtra = (str: string) => {
  if (!str) return "";
  str = str.toUpperCase();
  return str
    .replace("AUTO_INCREMENT", "AUTOINCREMENT")
    .replace("DEFAULT_GENERATED", "")
    .replace(" ON UPDATE CURRENT_TIMESTAMP", "");
};

// & sql Unit
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
const sqlWhereLikeUnit = (
  wordsStr: string,
  field: string,
  { sep = "and", isNot = false }
) => {
  const notTag = isNot ? " not" : " ";
  const words = wordsStr.trim().split(",");
  if (words.length === 0 || wordsStr.trim() === "") {
    return "";
  }
  const whereStr = words
    .map((word) => `\`${field}\`${notTag} like '%${word}%'`)
    .join(` ${sep} `);
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
const sqlWhereEqualUnit = (
  wordsStr: string,
  field: string,
  { sep = "and", isNot = false }
) => {
  const words = wordsStr.trim().split(",");
  if (words.length === 0 || wordsStr.trim() === "") {
    return "";
  }
  const whereStr = words
    .map((word) => `\`${field}\`${isNot ? " !=" : " ="} '%${word}%'`)
    .join(` ${sep} `);
  return whereStr;
};

// ** CREATE TABLE(GoogleSheet -> Create Table Sql)
// const schemaArrs = [
//   ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra', '_colNum', '_remark'],
//   ['nid', 'int', 'NO', 'PRI', 'NULL', 'auto_increment', '', '공고 고유번호'],
//   ['제목', 'varchar(100)', 'YES', '', 'test'],
//   ['updated_at', 'datetime', 'NO', '', 'CURRENT_TIMESTAMP', 'DEFAULT_GENERATED on update CURRENT_TIMESTAMP']
// ];

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
  const arrConverted = [
    sqlKeyStr(arr[0]),
    arr[1],
    sqlFieldNull(arr[2]),
    sqlFieldKey(arr[3]),
    sqlFieldDefault(arr[4]),
    arr[5],
  ];
  return `${arrConverted.join(" ").replace(/ {2,}/g, " ").trim()}, `;
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
    sqlFieldType(arr[1]),
    sqlFieldNull(arr[2]),
    sqlFieldKey(arr[3]),
    sqlFieldDefault(arr[4]),
    sqlFieldExtra(arr[5]),
  ];
  return `${arrConverted.join(" ").replace(/ {2,}/g, " ").trim()}, `;
};

// & CRUD
/**
 * SELECT Sql
 *
 * @param tableName -
 * @param fields
 * @param addStr
 * @returns SELECT Sql Phrase Unit For (Mysql|Sqlite)
 *
 * @example
 * sqlSelect()
 * =>
 */
const sqlSelect = (tableName: string, { fields = [], addStr = "" }) => {
  const _fields =
    fields.length > 0
      ? fields.map((field) => sqlKeyStr(field.trim())).join(", ")
      : "*";
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
 * sqlInsertOne()
 * =>
 */
const sqlInsertOne = (tableName: string, data: any) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  return `INSERT IGNORE INTO ${tableName} (${sqlJoinKeys(
    keys
  )}) VALUES (${sqlJoinVals(values)});`;
};

/**
 * DELETE Sql
 *
 * @param tableName -
 * @param addStr
 * @returns INSERT Sql Phrase Unit For (Mysql|Sqlite)
 *
 * @example
 * sqlDelete()
 * =>
 */
const sqlDelete = (tableName: string, addStr: string) => {
  return `DELETE FROM ${tableName} ${addStr}`;
};
// DELETE FROM ${table_name} WHERE ${this.sqlWhere(
//   condition
// )};`

// & MYSQL
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
const sqlCreateTableMysql = ({ tableName = "", schemaArrs = [[]] }) => {
  let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (`;
  sql += schemaArrs
    .slice(1)
    .reduce((acc, cur) => `${acc}\n  ${sqlCreateTableUnitMysql(cur)}`, "");

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

// & SQLITE
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
  sql += schemaArrs
    .slice(1)
    .reduce((acc, cur) => `${acc}\n  ${sqlCreateTableUnitSqlite(cur)}`, "");

  return `${sql.trim().slice(0, -1)}\n);`;
};

// & POCKETBASE
// const schemaArrs = [
//   ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra', '_colNum', '_remark'],
//   ['nid', 'int', 'NO', 'PRI', 'NULL', 'auto_increment', '', '공고 고유번호'],
//   ['제목', 'varchar(100)', 'YES', '', 'test'],
//   ['updated_at', 'datetime', 'NO', '', 'CURRENT_TIMESTAMP', 'DEFAULT_GENERATED on update CURRENT_TIMESTAMP']
// ];
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
  schemaArrs = [[]],
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
  sqlSelect,
  sqlCreateTableMysql,
  sqlCreateTableSqlite,
  pocketbaseSchemaFromMysqlSchema,
};
