import "isomorphic-unfetch";

export default class NotificationSystem {
  constructor(projectID, apiOrigin) {
    this.apiOrigin = apiOrigin
      ? apiOrigin
      : "https://utification.appdevland.tech";
    this.publicVAPIDKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
    this.projectID = projectID;
  }

  async subscribe(registration, filters) {
    let sub;
    try {
      sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(
          process.env.NEXT_PUBLIC_PUBLIC_KEY
        ),
      });
    } catch (err) {
      console.error(`error occured when creating subscription: ${err}`);
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
    if (!res.ok) {
      console.error("error occured when adding subscription");
      return;
    }
    console.log(await res.json());
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

    if (!res.ok) {
      console.error(`error when updating subscription`);
      return;
    }

    console.log(await res.json());
    console.log("subscription updated successfully");
    return sub;
  }

  localFetch(location, body) {
    return fetch(this.apiOrigin + location, body);
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

    if (!res.ok) {
      console.error("error occured while deleting subscription wump wump wump");
      return;
    }

    console.log(await res.json());
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
