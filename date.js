exports.getDate = function () { // same as module.exports
    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    return today.toLocaleDateString("en-US", options);
};

exports.getDay = function () { // Anonymous function
    const today = new Date();

    const options = {
        weekday: "long"
    }

    return today.toLocaleDateString("en-US", options);;
};