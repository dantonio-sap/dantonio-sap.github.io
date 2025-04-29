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
  const { user } = cds.context!;
  console.log(JSON.stringify(user));
  const thisUser = {
    ID: user?.id,
    firstName: user?.attr.givenName,
    lastName: user?.attr.familyName,
    email: user?.attr.email,
    companyId: user?.attr.sapBpidOrg[0],
    company: user?.attr.company[0],
    type: user?.attr.type[0],
  };

  // Check if exists and add if not, else update
  const existingUser = await SELECT.one.from(Users).where({ ID: thisUser.ID });
  if (existingUser) {
    await UPDATE.entity(Users, { ID: existingUser.ID }).with({
      firstName: thisUser.firstName,
      lastName: thisUser.lastName,
      email: thisUser.email,
      companyId: thisUser.companyId,
      company: thisUser.company,
      type: thisUser.type,
    });
  } else {
    await INSERT.into(Users).entries(thisUser);
  }

  return existingUser ?? thisUser;
};
