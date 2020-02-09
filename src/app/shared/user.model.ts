export class UserModel {
  public constructor(
    public email: string,
    public name: string,
    public password: string,
    public passwordConfirmation: string,
    public risk?: number,
    public id?: number
  ) {
  }
}
