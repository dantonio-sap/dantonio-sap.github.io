using {cuid} from '@sap/cds/common';

namespace btp.ai.bestpractices;

entity Users : cuid {
  firstName : String;
  lastName  : String;
  email     : String;
  companyId : String;
}
