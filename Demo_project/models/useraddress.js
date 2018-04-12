class UserAddress {

    constructor(id,user_id,name, institution, occupation,phone, address, city, postcode, state, country){
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.institution = institution;
        this.occupation = occupation;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.postcode = postcode;
        this.state = state;
        this.country = country;
    }
}

module.exports = UserAddress;