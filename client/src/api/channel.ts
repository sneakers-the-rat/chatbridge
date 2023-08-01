export const createChannel = (
    channel_name: string,
    bridge_id: string,
    invite_token: string,
    callback: CallableFunction
) => {
    fetch('api/channel/create',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          channel_name, bridge_id, invite_token
        })
    }).then(result => result.json())
        .then(result => {
            console.log(result);
            callback(result)
        })
}