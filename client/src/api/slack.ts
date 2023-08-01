export const getSlackInstallURL = (callback: CallableFunction) => {
    fetch('api/slack/install')
        .then(res => res.json())
        .then(res => {
            console.log('Got slack url', res);
            callback(res.data.url, res.data.state_token)
        })

}


export const getSlackChannels = (callback: CallableFunction) => {
    fetch('api/slack/channels')
        .then(res => res.json())
        .then(res => {
            console.log('Got slack channels', res);
            if (res.status === "success"){
                console.log('channels api client', res.data)
                callback(res.data.channels)
            }
        })

}

export const joinSlackChannel = (channel: string, callback: CallableFunction) => {
    fetch('api/slack/channels', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            channel_id: channel
        })
    }).then(res => res.json())
        .then(res => {
            callback(res)
        })
}

export const getBotInfo = (callback: CallableFunction) => {
    fetch('api/slack/info')
        .then(res => res.json())
        .then(res => callback(res))
}