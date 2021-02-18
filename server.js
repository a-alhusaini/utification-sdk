import "isomorphic-unfetch";

export default class NotificationSystem {
  constructor(apiKey, projectID, apiOrigin) {
    this.apiOrigin = apiOrigin
      ? apiOrigin
      : "https://utification.appdevland.tech";
    this.apiKey = apiKey;
    this.projectID = projectID;
    this.publicVAPIDKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
  }

  localFetch(location, body) {
    return fetch(this.apiOrigin + location, body);
  }

  async query(query) {
    let res = await this.localFetch("/api/query", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        projectID: this.projectID,
        apiKey: this.apiKey,
        query,
      }),
    });
    return res;
  }

  async sendNotification(filters, notificationOptions) {
    let res = await this.localFetch("/api/push", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        projectID: this.projectID,
        apiKey: this.apiKey,
        filters,
        notificationOptions,
      }),
    });

    if (!res.ok) {
      console.error("error occured when sending notifications");
      return;
    }

    console.log("notifications sent successfully");
    return res.json();
  }
}
