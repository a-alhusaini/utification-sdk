This is the SDK for the utification platform (of course!)

NOTE: This project is very alpha bu i've stabilized it now.. it shouldn't break anymore but no promises!

# Client SDK Example Usage

    import ClientSDK from "utification-sdk/dist/client"

    let clientSDK = new ClientSDK("your project ID here (you can get it from the utification dashboard)")

    // create a variable for your service worker
    async function createRegistration() {
      let registration = await navigator.serviceWorker.ready
      return registration
    }

    let registration
    createRegistration().then(res => registration = res)

    // add a subscriber to your list
    clientSDK.subscribe(registration)

    // update a subscription
    clientSDK.updateSubscription(registration.pushManager.getSubscription(), {// the options you want to add to this subscription})

    // remove a subscriber from your list
    clientSDK.unsubscribe(registration.pushManager.getSubscription())

# Server SDK Example Usage

    import ServerSDK from "utification-sdk/dist/server"

    let serverSDK = new ServerSDK("your api key", "your project ID")

    // the first option is for the filters you want to use. If you had a subscriber
    // who is called john then you would put name: "john" in the first option
    serverSDK.sendNotification({}, {title: "notification title", body:"notification body"})

## Warning

The serverside SDK SHOULD NEVER BE USED ON THE CLIENT SIDE since it exposes your API key.
