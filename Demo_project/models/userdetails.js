class UserDetails {


    constructor(Id, create_time, email, password, membership_id, name, active, disk_usage, last_login, user_type, deleted, address,profile) {
        this.id = Id;
        this.create_time = create_time;
        this.email = email;
        this.password = password;
        this.membership_id = membership_id;
        this.name = name;
        this.active = active;
        this.disk_usage = disk_usage;
        this.last_login = last_login;
        this.user_type = user_type;
        this.deleted = deleted;
        var add = address.map(a=>a.toUserAddressModel());;
        //this.profile = profile.map(p=>p.toUserProfileModel());
        this.address = add[0];
        var pro = profile.map(p=>p.toUserProfileModel());
        this.profile = pro[0];
    }
}
//this.address = address.map(a=>a.toUserAddressModel());
//this.profile = profile.map(p=>p.toUserProfileModel());
module.exports = UserDetails;