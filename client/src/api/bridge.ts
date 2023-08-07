
export const getBridgeByStateToken = (callback: CallableFunction) => {
    fetch('api/bridge')
        .then(res => res.json())
        .then((res) => {
            if (res.status === 'success'){
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
        callback(res)
        // if (res.status === "success") {
        //     callback()
        // }
    })
}