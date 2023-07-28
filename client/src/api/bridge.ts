
export const getBridgeByStateToken = (callback: CallableFunction) => {
    fetch('api/bridge')
        .then(res => res.json())
        .then((res) => {
            console.log('bridge result', res)
            if (res.status === 'success'){
                console.log('successful get bridge')
                callback(res.data)
            }
        })
}

export const setBridgeLabel = (label:string, callback: CallableFunction) => {
    fetch('api/bridge',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Label: label
        })
    }).then(res => res.json())
    .then((res) => {
        if (res.status === "success") {
            callback()
        }
    })
}