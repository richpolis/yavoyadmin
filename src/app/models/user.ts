export interface User {
    objectId: string;
    username: string;
    firstName: string;
    lastName: string;
    birthday: Date;
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
}