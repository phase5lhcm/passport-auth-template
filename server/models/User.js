import mongoose from 'mongoose';

const ThirdPartyProviderSchema = new mongoose.Schema({
    provider_name: {
        type: String,
        default: null,
    },
    provider_id: {
        type: String,
        default: null,
    },
    provider_data: {
        type: {},
        default: null,
    },
});
/**
 * referral_code: This is a custom function and creates a six-character hash of the email.
 * I.e., a new referral code is created whenever somebody signs up.
 *
 * date: Date when the user has been created
 */

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        email_is_verified: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
        },
        referral_code: {
            type: String,
            default: function () {
                let hash = 0;
                for (let i = 0; i < this.email.length; i++) {
                    hash = this.email.charCodeAt(i) + ((hash << 5) - hash);
                }
                let res = (hash & 0x00ffffff).toString(16).toUpperCase();
                return '00000'.substring(0, 6 - res.length) + res;
            },
        },
        referred_by: {
            type: String,
            default: null,
        },
        third_party_auth: [ThirdPartyProviderSchema],
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { strict: false }
);
export default mongoose.model('User', UserSchema);
