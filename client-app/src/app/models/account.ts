export interface Account {
    id?: string;
    first_name: string;
    second_name: string;
    email: string;
    image?: string;
}

export interface AccountFormValues {
    email: string;
    user_name?: string;
    password?: string;
    first_name?: string;
    second_name?: string;
}
