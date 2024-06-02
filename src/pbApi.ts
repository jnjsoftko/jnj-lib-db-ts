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

// & Import AREA
// &---------------------------------------------------------------------------
// ? Builtin Modules

// ? External Modules
import PocketBase from "pocketbase";

// ? UserMade Modules
import { loadCsv } from "jnj-lib-doc";

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
}

// & Export AREA
// &---------------------------------------------------------------------------
export { PbApi };
