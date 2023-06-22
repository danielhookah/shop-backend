const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const addMonths = (date, months) => {
    return new Date(date.setMonth(date.getMonth() + months));
}

module.exports = {
    addDays,
    addMonths
}
