import cds, { Request } from "@sap/cds";
import { getUserInfo, login, loginSuccess } from "#cds-models/UserService";
import xsenv from "@sap/xsenv";

const { Users } = cds.entities;
const xsuaa: any = xsenv.getServices({ xsuaa: { tag: "xsuaa" } }).xsuaa;
export class UserService extends cds.ApplicationService {
  init() {
    // handlers
    this.on(login, (req) => loginHandler(req));
    this.on(loginSuccess, (req) => loginSuccessHandler(req));
    this.on(getUserInfo, (req) => getUserInfoHandler(req));

    return super.init();
  }
}

const loginHandler = async (req: Request) => {
  const { http } = cds.context!;
  const origin_uri = http?.req.query.origin_uri;
  console.log(http?.req);
  const callback_url = `${http?.req.protocol}://${http?.req.get("host")}/user/loginSuccess?origin_uri=${origin_uri}`;
  const authorize_url = `${xsuaa.url}/oauth/authorize?response_type=code&client_id=${xsuaa.clientid}&redirect_uri=${callback_url}`;

  http?.res.redirect(authorize_url);
};

const loginSuccessHandler = async (req: Request) => {
  const { http } = cds.context!;
  const origin_uri = http?.req.query.origin_uri;
  const callback_url = `${http?.req.protocol}://${http?.req.get("host")}/user/loginSuccess?origin_uri=${origin_uri}`;

  const code = http?.req.query?.code || null;
  if (code) {
    // Get Token
    const token_url = `${xsuaa.url}/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${callback_url}`;
    const encodedCredentials = btoa(`${xsuaa.clientid}:${xsuaa.clientsecret}`);
    const token_response = await fetch(token_url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    });
    const token_data = await token_response.json();
    http?.res.redirect(`${origin_uri}?t=${token_data.access_token}`);
  } else {
    http?.res.redirect(`${origin_uri}?e=UNAUTHORIZED`);
  }
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
