const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const config = require('config');
const CREDENTIALS = JSON.parse(fs.readFileSync('client_secret.json'));
const { google } = require('googleapis');

exports.addSheetRow = async (rowData, publicUrl) => {
    try {
        const doc = new GoogleSpreadsheet('1XR_CX_PpzPSxds6Gbs9QDYgzcvleKCaX-nI4wq3VOho');
        await doc.useServiceAccountAuth({
            client_email: CREDENTIALS.client_email,
            private_key: CREDENTIALS.private_key
        });
        await doc.loadInfo();

        let sheet = doc.sheetsByIndex[0];
        await sheet.addRow({ 
            Selected_Position: rowData.position,
            Years_Of_Experience: rowData.expyears,
            Why_Unique: rowData.uniquereason,
            Why_Choose_You: rowData.choosereason,
            Career_Brief: rowData.careerbrief,
            CV_Link: publicUrl,
        });
    } catch (error) { throw error }
}

exports.uploadToDrive = async (file, filePath) => {

    try {
        const oAuth2Client = new google.auth.OAuth2(config.get('CLIENT_ID'), config.get('CLIENT_SECRET'), config.get('REDIRECT_URI'));
        oAuth2Client.setCredentials({ refresh_token: config.get('REFRESH_TOKEN') });
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    
        const response = await drive.files.create({
            requestBody: {
                parents: ['1HWx6Di9elT3bUzg3hLwBM216JWmnr-WC'],
                name: file.name,
                mimeType: file.mimetype
            },
            media: {
                mimeType: file.mimetype,
                body: fs.createReadStream(filePath)
            }
        });
        
        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        let publicUrl = await drive.files.get({
            fileId: response.data.id,
            fields: ['webViewLink', 'webContentLink']
        });

        return publicUrl.data.webViewLink;
    } catch (error) { throw error; }
}