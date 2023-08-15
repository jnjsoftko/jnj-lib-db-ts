import sqlite3 from "sqlite3";
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
