import localFetch from "./utils/localFetch";

export default class NotificationSystem {
  /**
   *
   * @param {string} apiKey your utification API Key (visit your dashboard to see <it></it>)
   * @param {string} projectID the ID of the project you want to connect to
   * @param {object} devoptions options for SDK development DO NOT USE IF YOU ARE NOT DEVELOPING THE SDK
   * @param {string} devoptions.apiOrigin the origin of the API you are using
   */
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

  /**
   * query all the users in the database with a mongodb query
   * @param {object} query the mongodb query you want to send to the database
   */
  async query(query) {
    let res = await localFetch("/api/query", {
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

  /**
   *
   * @param {object} filters a mongodb query that notifications will bem atched to
   * @param {object} notificationOptions the notification payload that must be sent to the client
   */
  async sendNotification(filters, notificationOptions) {
    let res = await localFetch("/api/push", {
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
