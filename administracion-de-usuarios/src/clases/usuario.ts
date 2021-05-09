export interface Usuario {
    nombre?: string;
    apellido?: string;
    documento?: number;
    correo?: string;
    password?: string;
    isCreated: boolean;
    isAdmin: boolean;
    img_src: string;
}
