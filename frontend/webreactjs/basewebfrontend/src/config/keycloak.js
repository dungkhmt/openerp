import Keycloak from "keycloak-js";
import { config } from "./config";

//
export const initOptions = { pkceMethod: "S256" };

// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = new Keycloak({
  url: `${config.url.KEYCLOAK_BASE_URL}`,
  realm: "OpenERP",
  clientId: "openerp-ui",
});

export default keycloak;
