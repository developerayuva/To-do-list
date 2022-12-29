exports.getDate = () => {
    let date = new Date();
    const formattedDate = date.toLocaleString("en-En", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
    
    return formattedDate;
};

exports.getDay = () => {
    let date = new Date();
    const formattedDate = date.toLocaleString("en-En", {
        weekday: "long",
    });
    
    return formattedDate;
}
