import sqlite3 from "sqlite3";
// import path from 'path';
// import { fileURLToPath } from 'url';
import { sqlSelect, sqlCreateTableMysql, sqlCreateTableSqlite } from "./sql.js";

export class Sqlite {
  public conn: any;

  constructor(dbPath: string) {
    this.setConn(dbPath);
  }

  /**
   * Returns Query Result.
   *
   * @param sql
   *
   * @example
   * ```
   *
   *
   * # result
   *
   * ```
   */
  setConn = (dbPath: string) => {
    // const __dirname = path.dirname(fileURLToPath(import.meta.url));
    // const dbPath = path.join(__dirname, DB_PATH);
    this.conn = new sqlite3.Database(dbPath);
  };

  /**
   * Returns Query Result.
   *
   * @param sql
   *
   * @example
   * ```
   *
   *
   * # result
   *
   * ```
   */
  query = (sql: string) => {
    return new Promise((resolve, reject) => {
      this.conn.all(sql, [], (err: any, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };

  /**
   * Returns Find Result.
   *
   * @param tableName -
   * @param fields -
   * @param addStr -
   *
   * @example
   * ```
   *
   *
   * # result
   *
   * ```
   */
  find = (tableName: string, { fields = [], addStr = "" }) => {
    return this.query(sqlSelect(tableName, { fields, addStr }));
  };

  // find = (tableName, { fields = '', addStr = '' }) => {
  //   const sql = sqlSelect(tableName, { fields, addStr });
  //   return new Promise((resolve, reject) => {
  //     this.conn.all(sql, [], (err, rows) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(rows);
  //       }
  //     });
  //   });
  // };
}

// // https://www.devkuma.com/docs/sqlite/
// // https://alvinalexander.com/android/sqlite-default-datetime-field-current-time-now/
// // [Datatypes In SQLite](https://www.sqlite.org/datatype3.html)

// // 1XYOgmYG3SqAhqChUKpg4CRy9SnZ4Z5E3XQK3pRJ40Sw: moongobid@gmail.com  BidNotice > Admin >Table2

// // @@ auto_increment => primary key autoincrement

// //  on update current_timestamp => 제거(Error)

// // CREATE TABLE IF NOT EXISTS testTable (
// //   nid integer primary key autoincrement,
// //   sn integer,
// //   created_at timestamp default current_timestamp,
// //   updated_at datetime default current_timestamp on update current_timestamp
// // );

// // * MYSQL
// // CREATE TABLE IF NOT EXISTS testTable (
// //   nid int not null auto_increment,
// //   sn int,
// //   기관명 varchar(40),
// //   제목 varchar(100),
// //   상세페이지주소 varchar(800),
// //   작성일 date,
// //   scraped_at datetime,
// //   created_at timestamp not null default current_timestamp,
// //   updated_at datetime not null default current_timestamp on update current_timestamp
// // );

// // // * SQLITE
// // CREATE TABLE IF NOT EXISTS testTable (
// //   nid integer not null primary key autoincrement,
// //   sn integer,
// //   기관명 text,
// //   제목 text,
// //   상세페이지주소 text,
// //   작성일 date,
// //   scraped_at datetime,
// //   created_at timestamp not null default current_timestamp,
// //   updated_at datetime not null default current_timestamp
// // );

// // * http://localhost:5173/notices/api/settings/tables/keywords

// // // & sql
// // const sqlCreateTableSqlite = ({ tableName, arrSchema }) => {
// //   let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

// //   const convTypeSql = (str) => {
// //     str = str.toLowerCase();
// //     if (str.includes('date')) {
// //       return str;
// //     }

// //     if (str.includes('int')) {
// //       str = 'integer';
// //     } else if (['float', 'decimal', 'double'].some((dtype) => str.includes(dtype))) {
// //       str = 'real';
// //     } else {
// //       str = 'text';
// //     }
// //     return str;
// //   };

// //   const convNullSql = (str) => {
// //     return str.toUpperCase() == 'YES' ? '' : 'NOT NULL';
// //   };

// //   const convKeySql = (str) => {
// //     return str.toUpperCase() == 'PRI' ? 'PRIMARY KEY' : str;
// //   };

// //   const convDefaultSql = (str) => {
// //     return str.toUpperCase() == 'NULL' ? '' : `DEFAULT ${str}`;
// //   };

// //   const convExtraSql = (str) => {
// //     if (!str) return '';
// //     str = str.toUpperCase();
// //     return str.replace('_', '').replace(' ON UPDATE CURRENT_TIMESTAMP', '');
// //   };

// //   const createSqlFromArrForMysql = (arr) => {
// //     if (arr[0] == '-') return '';
// //     const arrConverted = [
// //       arr[0],
// //       convTypeSql(arr[1]),
// //       convNullSql(arr[2]),
// //       convKeySql(arr[3]),
// //       convDefaultSql(arr[4]),
// //       convExtraSql(arr[5])
// //     ];
// //     return `${arrConverted.join(' ').replace(/ {2,}/g, ' ').trim()}, `;
// //   };

// //   sql += arrSchema.slice(1).reduce((acc, cur) => `${acc}/n  ${createSqlFromArrForMysql(cur)}`, '');

// //   return `${sql.trim().slice(0, -1)}/n);`;
// // };

// // * sql :
// // * CREATE TABLE
// const arrSchema = [
//   ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra', '_colNum', '_remark'],
//   ['nid', 'int', 'NO', 'PRI', 'NULL', 'auto_increment', '', '공고 고유번호'],
//   ['sn', 'int', 'NO', '', 'NULL', '', '', '일련번호(단위 관공서)'],
//   ['기관명', 'varchar(40)', 'NO', '', 'NULL'],
//   ['제목', 'varchar(100)', 'YES', '', 'test'],
//   ['상세페이지주소', 'varchar(800)', 'YES', '', 'NULL'],
//   ['작성일', 'date', 'YES', '', 'NULL'],
//   ['작성자', 'varchar(20)', 'YES', '', 'NULL'],
//   ['created_at', 'timestamp', 'NO', '', 'CURRENT_TIMESTAMP', 'DEFAULT_GENERATED'],
//   ['updated_at', 'datetime', 'NO', '', 'CURRENT_TIMESTAMP', 'DEFAULT_GENERATED on update CURRENT_TIMESTAMP']
// ];

// const tableName = 'testTable';

// const sql = sqlCreateTableMysql({ tableName, arrSchema });

// console.log(sql);
