const xlsx = require('xlsx');

const exportToExcel = (data, filePath) => {
    // Create a new workbook
    const workbook = xlsx.utils.book_new();

    // Convert JSON data to a worksheet
    const worksheet = xlsx.utils.json_to_sheet(data);

    // Append worksheet to workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Leads');

    // Write workbook to file
    xlsx.writeFile(workbook, filePath);
};

module.exports = exportToExcel;
