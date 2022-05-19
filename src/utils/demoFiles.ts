const accountFile = `
message LogInRequest {
    repeated common.Info name = 1;
    optional string password = 2;
    optional map<string, int> dick = 3;
    list<string> strList = 8;
    list<map<string, string>> infoList = 4;
    list<map<string, map<string, common.Info>>> userInfos = 5;
    map<string, list<common.Info>> infos = 7;
}

message LogInResponse {
    list<string> strList = 8;
    string status = 1;
}

service AccountService {
    rpc queryArticle(LogInRequest) returns (LogInResponse) {}
    rpc queryArticle(LogInRequest, string, int) returns (LogInResponse) {}
}

service ContactService {
    rpc queryContact(LogInRequest) returns (LogInResponse) {}
    rpc queryDick(LogInRequest, string, int) returns (LogInResponse) {}
}
`

const commonFile = `
message Info {
    string status = 1;
}

message User {
    string username = 1;
    optional string password = 2;
    optional string nickname = 3;
}

message ContactGroup {
    string name = 1;
    optional string create_time = 2;
    repeated string usernames = 3;
}

message QueryContactsRequest {
    string username = 1;
}

message QueryContactsResponse {
    repeated ContactGroup contact_groups = 1;
}

message InsertContactGroupRequest {
    string name = 1;
}

message MoveContactRequest {
    string username = 1;
    string source = 2;
    string destination = 3;
}
`

const demoFiles: Map<string, string> = new Map<string, string>([
    ["account", accountFile],
    ["common", commonFile]
])

export default demoFiles