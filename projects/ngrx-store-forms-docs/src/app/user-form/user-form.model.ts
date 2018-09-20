export interface UserAddress {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface UserForm {
  userName: string;
  name: string;
  addresses: UserAddress[];
}
