export enum Genders{
    Male = 'male',
    Female = 'female'
}

export enum TripTypes{
    Daily = 'daily',
    Private = 'private',
    Pooling = 'pooling',
    Tour = 'tour',
}

export enum PassengerTripTypes{
    Trip = 'Trip',
    Tour = 'tour',
}

export enum TripStatus{
    // NotStarted = 'notStarted',
    Ready = 'ready', //created by admin (not yet accepted by any pilot)
    AcceptedByPilot = 'acceptedByPilot',
    Started = 'started', // pilot started the trip
    Completed = 'completed', // pilot ended/completed the trip
    Cancelled = 'cancelled', // pilot cancelled the trip
}

export enum RequestedTripStatus{
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected',
}

export enum PaymentMethods{
    Cash = 'cash',
    Visa = 'visa'
}

export enum BoatStatus{
    Ready = 'ready',
    NeedMaintenance = 'needMaintenance',
    InMaintenance = 'inMaintenance',
}

export enum UserType{
    Admin = 'admin',
    Pilot = 'pilot',
    Passenger = 'passenger',
    CorporateAdmin = 'corporateAdmin',
    FamilyAdmin = 'familyAdmin',
    Dependent = 'dependent',
    Student = 'student',
}

export enum PassengerStatus{
    OnBoarded = 'onBoarded',
    DroppedOff = 'droppedOff',
    Waiting = 'waiting',
    Cancelled = 'cancelled',
}

export enum FuelType{
    Diesel = 'diesel',
    Gasoline = 'gasoline',
    Electric = 'electric',
}

export enum PromocodeType{
    PerUserTimely = 'perUserTimely',
    PerUser = 'perUserPerUsage',
    SpecificUser = 'specificUsers',
}

export enum PaymentStatus{
    Pending = 'pending',
    Failed = 'failed',
    Successful = 'successful',
}

export enum StudentAccountStatus{
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected',
}

export enum EmergencyType{
    Maintenance = 'maintenance',
    Emergency = 'emergency',
}

export enum AdminRoles{
    SuperAdmin = 'superAdmin',
    Admin = 'admin',
    CorporateAdmin = 'corporateAdmin',
    Analyst = 'analyst',
}