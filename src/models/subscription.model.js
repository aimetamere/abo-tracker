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
// jan 1st, monthly -> feb 1st (add 1 month)
// jan 1st, yearly -> jan 1st next year (add 1 year)
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        this.renewalDate = new Date(this.startDate);
        
        // Calculate renewal date based on frequency
        if (this.frequency === 'monthly') {
            // Add 1 month
            this.renewalDate.setMonth(this.renewalDate.getMonth() + 1);
        } else if (this.frequency === 'yearly') {
            // Add 1 year
            this.renewalDate.setFullYear(this.renewalDate.getFullYear() + 1);
        }
    }

    // auto-update the status if renewal date has passed 
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }
    next();
});

const Subscriptions = mongoose.model('Subscription', subscriptionSchema);

export default Subscriptions;