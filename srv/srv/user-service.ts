import cds, { Request } from "@sap/cds";
import { getUserInfo, login, logoutSuccess } from "#cds-models/UserService";

const { Users } = cds.entities;

export class UserService extends cds.ApplicationService {
  init() {
    // handlers
    this.on(login, (req) => loginHandler(req));
    this.on(logoutSuccess, (req) => logoutSuccessHandler(req));
    this.on(getUserInfo, (req) => getUserInfoHandler(req));

    return super.init();
  }
}

const loginHandler = async (req: Request) => {
  const { http, user } = cds?.context!;
  const origin_uri = http?.req.query.origin_uri;

  http?.res.redirect(origin_uri!.toString());
};

const logoutSuccessHandler = async (req: Request) => {
  const { http, user } = cds?.context!;
  const origin_uri = http?.req.query.origin_uri;

  console.log(`redirecting to ${origin_uri!.toString()}: User=${req.user.id}`);
  http?.res.redirect(origin_uri!.toString());
};

const getUserInfoHandler = async (req: Request) => {
  const { user } = cds?.context!;

  const thisUser = {
    firstName: user?.attr.givenName,
    lastName: user?.attr.familyName,
    email: user?.attr.email,
    companyId: null,
  };

  // Check if exists and add if not, else update
  const existingUser = await SELECT.one.from(Users).where({ email: thisUser.email });
  let newUser;
  if (existingUser) {
    await UPDATE.entity(Users, { ID: existingUser.ID }).with({
      firstName: thisUser.firstName,
      lastName: thisUser.lastName,
      companyId: thisUser.companyId,
    });
  } else {
    newUser = await INSERT.into(Users).entries(thisUser);
  }

  return existingUser || thisUser;
};
