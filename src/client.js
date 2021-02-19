import axios from "axios";

export default class NotificationSystem {
  constructor(projectID, devoptions) {
    if (!projectID) {
      throw new Error("projectID is required");
    }

    this.apiOrigin = devoptions.apiOrigin
      ? devoptions.apiOrigin
      : "https://utification.appdevland.tech";
    this.publicVAPIDKey = devoptions.publicVAPIDKey
      ? devoptions.publicVAPIDKey
      : "BGNtEcQWz8Dnt8DUWAkfSacCO1f2PE6TUOUzoNuw_2WF_TPi16G8urTAegQiI9YuUiYVa7-Anjh_weGb-OiDN4w";
    this.projectID = projectID;
  }

  async subscribe(registration, filters) {
    let sub;
    try {
      sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(this.publicVAPIDKey),
      });
    } catch (err) {
      console.error(`Error occured when adding a subscription to the client`);
      console.error(err);
      return;
    }

    let res = await this.localFetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        subscription: sub,
        projectID: this.projectID,
        filters: filters,
      }),
    });
    if (res.status !== 200 && res.status !== 201) {
      console.error("error occured when adding subscription to server");
      console.error(res);
      return;
    }
    console.log(res.data);
    console.log("web push subscribed!");
    return sub;
  }

  async updateSubscription(sub, filters) {
    let res = await this.localFetch("/api/subscribe", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        subscription: sub,
        projectID: this.projectID,
        filters: filters,
      }),
    });

    if (res.status !== 200 && res.status !== 201) {
      console.error(`Error when updating subscription on the server`);
      console.error(res);
      return;
    }

    console.log(res.data);
    console.log("subscription updated successfully");
    return sub;
  }

  localFetch(location, body) {
    body.data = body.body;
    return axios({ url: this.apiOrigin + location, ...body });
  }

  async unsubscribe(sub) {
    let res = await this.localFetch("/api/subscribe", {
      method: "DELETE",
      body: JSON.stringify({
        subscription: sub,
        projectID: this.projectID,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (res.status !== 200 && res.status !== 201) {
      console.error(
        "error occured while deleting subscription on the server wump wump wump"
      );
      console.error(res);
      return;
    }

    console.log(res.data);
    await sub.unsubscribe();
    console.log("web push unsubscribed!");
    return sub;
  }
}

const base64ToUint8Array = (base64) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
