const success = (data) => (JSON.stringify({success: true, data: data}, null, 2))

const fail = (messaeg) => (JSON.stringify({seccess: false,  messaeg}, null, 2))

export {success, fail}