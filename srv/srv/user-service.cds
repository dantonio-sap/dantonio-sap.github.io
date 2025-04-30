service UserService @(
    path    : '/user',
    requires: 'any'
) {
    @cds.api.ignore
    @cds.persistence.skip
    entity userInfo {
        key ID        : String;
            firstName : String;
            lastName  : String;
            email     : String;
    };

    function getUserInfo @(restrict: [{to: 'authenticated-user'}])() returns userInfo;
    function login()                                                 returns Boolean;
    function loginSuccess()                                          returns String;
}
