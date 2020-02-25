import { UserDTO } from "../dtos/UserDTO";
import { User } from "../models/User";

export function userDTOToUserConverter(userDTO:UserDTO):User{
    return new User(
        userDTO.userId,
        userDTO.username,
        userDTO.password,
        userDTO.firstName,
        userDTO.lastName,
        userDTO.email,
        userDTO.role
    )
}