class UserProfile {


    constructor(Id,user_id, name, company_type, company_role, desc_of_company, webpage){
        this.id = Id;
        this.user_id = user_id;
        this.name = name;
        this.company_type = company_type;
        this.company_role = company_role;
        this.desc_of_company = desc_of_company;
        this.webpage = webpage;
    }
}

module.exports = UserProfile;