const success = (data) => (JSON.stringify({success: true, data: data}, null, 2))

const fail = (message) => (JSON.stringify({seccess: false,  message}, null, 2))

export {success, fail}