export default function localFetch(location, body) {
  body.data = body.body;
  return axios({ url: this.apiOrigin + location, ...body });
}
