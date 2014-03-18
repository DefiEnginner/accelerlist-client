export class User {
	constructor(userName, businessName, email, phone, sellerId, authToken,
		marketplaceId, role, trialRemaining, user_settings, plan,
		lifetime_user) {
        this.userName = userName;
        this.businessName = businessName;
        this.email = email;
        this.phone = phone;
        this.sellerId = sellerId;
        this.authToken = authToken;
        this.marketplaceId = marketplaceId;
        this.role = role;
		this.plan = plan;
		this.lifetime_user = lifetime_user;
		this.trialRemaining = trialRemaining;
		this.settings = user_settings;
    }

}
