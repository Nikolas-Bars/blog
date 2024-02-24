type RegisterUserType = {
    login:string
    password:string
    email:string
    code?:string
    expirationDate: Date
    isConfirmed?:boolean
}

export const testSeeder = {
    createUserDto() {
        return {
            login: 'testLogin',
            email: 'test@mail.com',
            password: '12345678'
        }
    }
}