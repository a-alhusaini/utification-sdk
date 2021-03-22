import axios from "axios";

/**
 * @param {string} apiOrigin the place where the call is supposed to be sent to
 * @param {string} location the api route to fetch
 * @param body the fetch request body (includes headers/request body/method etc)
 */
export default function localFetch(apiOrigin, location, body) {
  body.data = body.body;
  return axios({ url: apiOrigin + location, ...body });
}
