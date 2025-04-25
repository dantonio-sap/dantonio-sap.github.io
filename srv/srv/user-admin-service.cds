using btp.ai.bestpractices as db from '../db/schema';

service UserAdminService @(requires: 'viewer') {
    entity Users @(restrict: [
        {
            grant: 'READ',
            to   : 'viewer'
        },
        {
            grant: 'WRITE',
            to   : 'admin'
        }
    ]) as projection on db.Users;
}
