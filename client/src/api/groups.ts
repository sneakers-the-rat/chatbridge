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

export const deleteGroup = (id: string, callback: CallableFunction) => {
    fetch('api/groups', {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id
        })
    })
        .then(result => result.json())
        .then(result => callback(result))
}