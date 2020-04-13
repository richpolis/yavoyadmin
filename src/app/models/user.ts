export interface User {
    objectId: string;
    username: string;
    firstName: string;
    lastName: string;
    birthday: any;
    email: string;
    password: string;
    sessionToken: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    ACL: any;
    isRepresentativeCircle: boolean;
    contact: any;
    status: string;
    circle: any;
    role: any;
    approved: boolean;
    request: boolean;
    selected: boolean;
    city: string;
    phone: string;
}