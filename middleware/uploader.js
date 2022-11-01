const config = require('config');
const path = require('path');

module.exports = async (uploadedFile) => {
    const file = uploadedFile;
    const fileName = file.name;
    let pathFolder = path.resolve(__dirname, config.get('path_folder'));
    
    try {
        await file.mv(`${pathFolder}/${fileName}`);
        return `${pathFolder}/${fileName}`;
    } catch (error) {
        throw error;
    }
}