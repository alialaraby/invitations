export class SchemaValidators{

    public static validateEmail(email: string){
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return emailRegex.test(email);
    }

    public static validatePhone(phone: string){
        const phoneRegex = /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/;
        return phoneRegex.test(phone);
    }
}