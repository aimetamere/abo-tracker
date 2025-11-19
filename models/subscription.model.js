import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription Name is required'],
        trim: true, // trim: true removes leading and trailing whitespace from strings before saving to the database.
        minlength: 2,
        maxlength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Subscription Price is required'],
        min: [0, 'Subscription Price must be greater than 0'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GDP'],
        default: 'EUR',
    },
    frequency: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly',
    },
    category: {
        type: String,
        enum: ['photos'],
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        enum: ['active', 'inactive', 'cancelled'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start Date must be in the past',
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'renewal date must be after start date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },

}, { timestamps: true });


// Auto-calculate renewal date if data is missing 
// how it works:
// jan 1st
// monthly
// jan 31st
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    // auto-update the status if renewal date has passed 
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }
    next();
});

const Subscriptions = mongoose.model('Subscription', subscriptionSchema);

export default Subscriptions;