
import { Usuario } from "./usuario";
export interface User {
    uid: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    profile?: Usuario;
}
