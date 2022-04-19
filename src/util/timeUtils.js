
export const secondsToTime = (e) => {
    const h = Math.floor(e / 3600).toString().padStart(2,'0'),
        m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
        s = Math.floor(e % 60).toString().padStart(2,'0');
    
    return h + ':' + m + ':' + s;
}

export const timestampToDate = (unixTimestamp, mins=true) => {
    const date = new Date(unixTimestamp);
    const formattedDate = date.toDateString();
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();

    if(mins) {
        return formattedDate + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    } else {
        return formattedDate;
    }

}