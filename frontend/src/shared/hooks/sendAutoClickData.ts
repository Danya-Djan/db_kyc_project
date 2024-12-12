import axios from "axios"

export const sendAutoClickData = (userId: number | undefined, points: number, time: number) => {
    axios.post('https://script.google.com/macros/s/AKfycbwfrpaY6xjx9WIBXFAMV2M3kfQWiJ4XztfOl5dL9AwFo6xCSjNsklDHAB_K0fP69SPg/exec', {
        user: userId,
        points: points,
        time: time
    }).then(resp=> {
        //console.log(resp);
    }).catch(err => {
        //console.log(err)
    })
}