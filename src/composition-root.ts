import {UserRepositoryClass} from "./repositories/user-repository";
import {UserServiceClass} from "./services/user.service";
import {UserController} from "./routes/users-controller";
import {LikesHistoryRepositoryClass} from "./repositories/likes-history-repository-class";
import {LikesHistoryServiceClass} from "./services/likes.service";
import {LikesController} from "./routes/likes-controller";

const UserRepository = new UserRepositoryClass()

export const UserService = new UserServiceClass(UserRepository)

export const UserControllerInstance = new UserController(UserService)


export const LikesHistoryRepository = new LikesHistoryRepositoryClass()

export const LikesHistoryService = new LikesHistoryServiceClass(LikesHistoryRepository)

export const LikesHistoryControllerInstance = new LikesController(LikesHistoryService)

