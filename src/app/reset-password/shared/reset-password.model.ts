export class ResetPasswordModel {
  constructor(
    public password: string,
    public passwordConfirmation: string,
    public resetPasswordToken: string
  ) {
  }
}
