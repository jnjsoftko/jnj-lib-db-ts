/** PbApi
 *
 * Description
 *   - A Class For Using Pocketbase API
 *
 * Functions
 *   [X]
 *
 * Usages
 *   - const pba = PbApi("http://127.0.0.1:8090")
 *   - pba.init(<email>, <password>)
 *
 * Requirements
 *   - pocketbase.exe serve --dir="backend/pocketbase/sqlite" --http="127.0.0.1:8090"
 *
 *   - jnj-lib-base jnj-lib-doc jnj-lib-google
 *   - sqlite3 pocketbase mysql
 *   ```sh
 *   $ npm install jnj-lib-base jnj-lib-google jnj-lib-doc jnj-lib-db
 *   $ npm @octokit/rest dotenv googleapis@105 @google-cloud/local-auth@2.1.0 csv js-yaml ini xlsx sqlite3 pocketbase mysql
 *   ```
 *
 *  > `/.env`
 *  ```
 *  ENV_SETTINGS_PATH=C:/JnJ-soft/Developments/_Settings
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

// & Import AREA
// &---------------------------------------------------------------------------
// ? Builtin Modules

// ? External Modules
import PocketBase from "pocketbase";

// ? UserMade Modules
import { loadCsv } from "jnj-lib-doc";

// ? Local Modules
import { updateDictKeys, updateDictsKeys } from "./pbUtils.js";

// & Class AREA
// &---------------------------------------------------------------------------
class PbApi {
  pb;

  // * CONSTRUCTOR
  constructor(url: string) {
    this.pb = new PocketBase(url);
  }

  // * init
  async init(email: string, password: string) {
    await this.pb.admins.authWithPassword(email, password);
  }

  // * CRUD
  /**
   * Create Base Collection
   *
   * @param name - collection name
   * @param schema - collection schema
   *
   * @example
   *
   * createBaseCollection = async('level', [])
   */
  async createBaseCollection({ name = "", schema }) {
    await this.pb.collections.create({
      name,
      type: "base",
      schema,
    });
  }

  /**
   * Query
   *
   * @param name - collection name
   * @param data - insert/update data(dict)
   * @param id - update/delete id(string)
   * @param maps - key map
   * @param act - insert/update/delete/upsert
   *
   * @example
   *
   * insert('level', {})
   */
  async query({ name, option = {}, filter = "", id, page = 1, perPage = 50, maps, act = "list" }) {
    // async query({ name, sort='-created', id, expand='', filter='', maps = {}, act = 'list' }) {
    // data = maps == {} ? data : updateDictKeys(data, maps);
    let data;
    act = act.toLowerCase();
    switch (act) {
      case "list":
        data = await this.pb.collection(name).getFullList(option ?? { sort: "-created" });
        break;
      case "search":
        // option: {filter: 'created >= "2022-01-01 00:00:00" && someField1 != someField2', expand: 'relField1,relField2.subRelField'}
        data = await this.pb.collection(name).getList(page, perPage, option);
        break;
      case "first":
        // filter = grade != "gold"
        data = await this.pb.collection(name).getFirstListItem(filter, option);
        // return data;
        break;
      case "view":
        data = await this.pb.collection(name).getOne(id, option);
        break;
      // break;
    }
    if (!maps) {
      // console.log('maps1', maps);
      return data;
    } else if (act === "first" || act == "view") {
      console.log(data);
      return updateDictKeys(data, maps);
    } else {
      console.log("maps3", maps);
      data.items = updateDictsKeys(data.items, maps);
      return data;
    }
    // console.log('maps', maps);
    // return data;
    // return !maps || maps == {} ? data : updateDictKeys(data, maps);
  }

  /**
   * Mutate One Record in Collection
   *
   * @param name - collection name
   * @param data - insert/update data(dict)
   * @param id - update/delete id(string)
   * @param maps - key map
   * @param act - insert/update/delete/upsert
   *
   * @example
   *
   * insert('level', {})
   */
  async mutateOne({ name, data, id, maps = null, act = "insert" }) {
    data = !maps ? data : updateDictKeys(data, maps);
    switch (act.toLowerCase()) {
      case "insert":
        await this.pb.collection(name).create(data);
        break;
      case "update":
        await this.pb.collection(name).update(id, data);
        break;
      case "delete":
        await this.pb.collection(name).delete(id);
        break;
      case "upsert":
        // data = maps == {} ? data : updateDictKeys(data, maps);
        await this.pb.collection(name).delete(id);
        break;
    }
  }

  /**
   * Mutate Many Records in Collection
   *
   * @param name - collection name
   * @param data - insert/update data(dicts)
   * @param ids - update/delete ids(arrary of string)
   * @param maps - key map
   * @param act - insert/update/delete/upsert
   *
   * @example
   *
   * insert('level', {})
   */
  async mutate({ name, data, ids, maps, act = "insert" }) {
    data = !maps ? data : updateDictsKeys(data, maps);
    switch (act.toLowerCase()) {
      case "insert":
        for (let d of data) {
          await this.pb.collection(name).create(d);
        }
        break;
      case "update":
        for (let i = 0; i < ids.length; i++) {
          await this.pb.collection(name).update(ids[i], data[i]);
        }
        break;
      case "delete":
        for (let id of ids) {
          await this.pb.collection(name).delete(id);
        }
        break;
      // case 'delete':
      //   for (let id of ids) {
      //     await this.pb.collection(name).delete(id);
      //   }
      //   break;
    }
  }

  /**
   * Insert Data By Csv
   *
   * @param name - collection name
   * @param data - inserted data(dicts)
   *
   * @example
   *
   * await insertByCsv("level", "../data/level.csv");
   */
  async insertByCsv({ name = "", path = "", maps = null }) {
    let data = loadCsv(path);
    data = !maps ? data : updateDictKeys(data, maps);
    await this.mutate({ name, data, ids: null, maps, act: "insert" });
  }
}

// & Export AREA
// &---------------------------------------------------------------------------
export { PbApi };
