import axios from "axios";

export default class NotificationSystem {
  constructor(apiKey, projectID, devoptions) {
    if (!apiKey) {
      throw new Error("apiKey is required");
    }

    if (!projectID) {
      throw new Error("projectID is required");
    }

    this.apiOrigin = devoptions.apiOrigin
      ? devoptions.apiOrigin
      : "https://utification.appdevland.tech";
    this.apiKey = apiKey;
    this.projectID = projectID;
  }

  localFetch(location, body) {
    body.data = body.body;
    return axios({ url: this.apiOrigin + location, ...body });
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

    if (res.status !== 201 && res.status !== 200) {
      console.error(
        "Error occured when when querying the database.... wump wump wump"
      );
      console.error(res);
    }

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

    if (res.status !== 201 && res.status !== 200) {
      console.error("error sending notification wump wump wump....");
      console.error(res);
      return;
    }

    console.log(res);
    console.log("notifications sent successfully");
    return res;
  }
}
