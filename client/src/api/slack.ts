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
                callback(res.data.channels.sort())
            }
        })

}