import axios from "axios";

/**
 * @param {string} location the api route to fetch
 * @param body the fetch request body (includes headers/request body/method etc)
 */
export default function localFetch(apiOrigin, location, body) {
  body.data = body.body;
  return axios({ url: this.apiOrigin + location, ...body });
}
