export const getDiscordInstallURL = (callback: CallableFunction) => {
    fetch('api/discord/install')
        .then(res => res.json())
        .then(res => {
            callback(res.data.url)
        })
}