
const { v4: uuidv4 } = require('uuid');

export class UUIDHelper {

    public static generateUUID(){
        return uuidv4();
    }
}