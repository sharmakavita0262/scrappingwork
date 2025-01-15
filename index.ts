import Container, { Service } from 'typedi';
import { ILoginProps, LoginBotService } from './services/login.service';
import { UserBotService } from './services/user.service';

@Service()
export class Scraper {
  public serviceLogin = Container.get(LoginBotService);
  public serviceUser = Container.get(UserBotService);

  public async login(props: ILoginProps) {
    try {
      this.serviceLogin.execute(props);
    } catch (error) {
      throw error;
    }
  }

  public async getProfile() {
    try {
      return await this.serviceUser.getProfile();
    } catch (error) {
      throw error;
    }
  }
}
