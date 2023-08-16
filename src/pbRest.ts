/** PbRest
 *
 * Description
 *   - A Class For Using Pocketbase Rest API
 *
 * Functions
 *   [X]
 *
 * Usages
 *   -
 *
 * Requirements
 *   - pocketbase.exe serve --dir="backend/pocketbase/sqlite" --http="127.0.0.1:8090"
 *
 * References
 *   - https://inpa.tistory.com/entry/AXIOS-📚-설치-사용
 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */
//
// & Import AREA
// &---------------------------------------------------------------------------
// ? Builtin Modules

// ? External Modules
import axios from "axios";

// ? UserMade Modules
import { loadCsv } from "jnj-lib-doc";

// & Function AREA
// &---------------------------------------------------------------------------
// { method, headers, params, data, token }
const requestAxios = async (url: string, option: any) => {
  let method = option.method ?? "GET";
  const params = option.params ?? {};
  const data = option.data ?? {};
  const token = option.token ?? undefined;
  const headers =
    option.headers ?? token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        };

  // console.log(`url: ${url}, token: ${token}`);
  // console.log(headers);
  let response;
  method = method.toUpperCase();
  switch (method) {
    case "GET":
      response = await axios({ method, url, headers, params });
      break;
    case "DELETE":
      response = await axios({ method, url, headers });
      break;
    default:
      response = await axios({ method, url, headers, params, data });
  }
  return response;
};

// & Class AREA
// &---------------------------------------------------------------------------
export class PbRest {
  baseUrl: string = "";
  token: string = "";

  // * CONSTRUCTOR
  constructor(pbServerUrl: string) {
    this.baseUrl = `${pbServerUrl}`;
  }

  /**
   * Set Token(Admin/User)
   */
  async init(email: string, password: string, isAdmin = true) {
    if (isAdmin) {
      await this.getAdminToken(email, password);
    } else {
      await this.getUserToken(email, password);
    }
  }

  /**
   * Get Admin Token
   */
  async getAdminToken(email: string, password: string) {
    const url = `${this.baseUrl}/api/admins/auth-with-password`;
    const data = {
      identity: email,
      password: password,
    };

    const response = await requestAxios(url, { method: "POST", data });
    this.token = response.data.token;
  }

  /**
   * Get User Token
   */
  async getUserToken(email: string, password: string) {
    const url = `${this.baseUrl}/api/collections/users/auth-with-password`;

    const data = {
      identity: email,
      password: password,
    };
    const response = await requestAxios(url, { method: "POST", data });
    this.token = response.data.token;
  }

  /**
   * Query(list/search/first/view)
   */
  async query({ name = "", id = "", params = {}, act = "list" }) {
    act = act.toLowerCase();
    let response;
    switch (act) {
      case "list":
        response = await requestAxios(`${this.baseUrl}/api/collections/${name}/records`, { token: this.token });
        return response?.data?.items;
      case "search":
        response = await requestAxios(`${this.baseUrl}/api/collections/${name}/records`, { params, token: this.token });
        return response?.data?.items;
      case "first":
        response = await requestAxios(`${this.baseUrl}/api/collections/${name}/records`, { params, token: this.token });
        return response?.data?.items[0];
      case "view":
        response = await requestAxios(`${this.baseUrl}/api/collections/${name}/records/${id}`, { params, token: this.token });
        return response?.data;
    }
  }

  /**
   * MutateOne()
   */
  async mutateOne({ name = "", id = "", params = {}, data = {}, act = "insert" }) {
    act = act.toLowerCase();
    let response;
    switch (act) {
      case "insert":
        response = await requestAxios(`${this.baseUrl}/api/collections/${name}/records`, { method: "POST", params, data, token: this.token });
        return response?.data;
      case "update":
        response = await requestAxios(`${this.baseUrl}/api/collections/${name}/records/${id}`, { method: "PATCH", params, data, token: this.token });
        return response?.data;
      case "delete":
        response = await requestAxios(`${this.baseUrl}/api/collections/${name}/records/${id}`, { method: "DELETE", token: this.token });
        return response?.data;
      // case "upsert":
      // response = await requestAxios(
      //   `${this.baseUrl}/api/collections/${name}/records/${id}`,
      //   { params, token: this.token }
      // );
      // return response?.data;
    }
    // return response?.data;
  }

  /**
   * MutateOne()
   */
  async mutate({ name = "", ids = [], params = {}, data = [{}], act = "insert" }) {
    act = act.toLowerCase();
    let response;
    switch (act) {
      case "insert":
        for (let d of data) {
          await this.mutateOne({ name, data, act });
        }
        break;
      case "update":
        for (let i = 0; i < ids.length; i++) {
          await this.mutateOne({
            name,
            id: ids[i],
            params,
            data: data[i],
            act,
          });
        }
        break;
      case "delete":
        for (let i = 0; i < ids.length; i++) {
          await this.mutateOne({ name, id: ids[i], act });
        }
        break;
      // case "upsert":
      // response = await requestAxios(
      //   `${this.baseUrl}/api/collections/${name}/records/${id}`,
      //   { params, token: this.token }
      // );
      // return response?.data;
    }
    // return response?.data;
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
  async insertByCsv({ name, path, maps = {} }) {
    let data = loadCsv(path);
    await this.mutate({ name, data });
  }
}

// & Test AREA
// &---------------------------------------------------------------------------
// // * Realtime
// const pbRealtime = async ({ name, id, token }) => {
//   const url = `${pocketbaseUrl}/api/realtime`;

//   const response = await axios({
//     method: 'SSE', // 요청 방식
//     url, // 요청 주소
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//     params, // ?파라미터를 전달
//     data
//   });
//   return response.data;
// };
