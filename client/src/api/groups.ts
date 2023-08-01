export const groupInvite = (token: string, callback: CallableFunction) => {
    fetch('api/groups/invite', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: token
        })
    })
        .then(result => result.json())
        .then(result => callback(result))
}