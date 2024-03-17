import {UserRepositoryClass} from "./repositories/user-repository";
import {UserServiceClass} from "./services/user.service";
import {UserController} from "./routes/users-controller";

const UserRepository = new UserRepositoryClass()

const UserService = new UserServiceClass(UserRepository)

export const UserControllerInstance = new UserController(UserService)

