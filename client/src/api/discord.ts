export const getDiscordInstallURL = (callback: CallableFunction) => {
    fetch('api/discord/install')
        .then(res => res.json())
        .then(res => {
            callback(res.data.url)
        })
}

export const getDiscordChannels = (callback: CallableFunction) => {
    fetch('api/discord/channels')
        .then(res => res.json())
        .then(res => {
            callback(res.data.channels)
        })
}