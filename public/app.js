// API Configuration
const API_BASE_URL = 'http://localhost:5501/api/v1';

// State Management
let currentUser = null;
let authToken = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupEventListeners();
});

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        showDashboard();
    } else {
        showAuth();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('signOutBtn').addEventListener('click', () => {
        signOut();
    });

    // Form switches
    document.getElementById('showSignUp').addEventListener('click', (e) => {
        e.preventDefault();
        showSignUpForm();
    });
    
    document.getElementById('showSignIn').addEventListener('click', (e) => {
        e.preventDefault();
        showSignInForm();
    });

    // Form submissions
    document.getElementById('signUpFormElement').addEventListener('submit', handleSignUp);
    document.getElementById('signInFormElement').addEventListener('submit', handleSignIn);
    document.getElementById('createSubscriptionForm').addEventListener('submit', handleCreateSubscription);
    
    // Payment method change handler
    const paymentMethodSelect = document.getElementById('subscriptionPaymentMethod');
    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener('change', handlePaymentMethodChange);
    }
    
    // Set today's date as default start date
    setDefaultStartDate();
    
    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    // Format expiry date input
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', formatExpiryDate);
    }
}

// Show auth section
function showAuth() {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('signOutBtn').style.display = 'none';
}

// Show dashboard
function showDashboard() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    document.getElementById('signOutBtn').style.display = 'inline-block';
    
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        setDefaultStartDate(); // Set start date to today when dashboard loads
        loadSubscriptions();
    }
}

// Show sign up form
function showSignUpForm() {
    document.getElementById('signInForm').style.display = 'none';
    document.getElementById('signUpForm').style.display = 'block';
    clearErrors();
}

// Show sign in form
function showSignInForm() {
    document.getElementById('signUpForm').style.display = 'none';
    document.getElementById('signInForm').style.display = 'block';
    clearErrors();
}

// Handle sign up
async function handleSignUp(e) {
    e.preventDefault();
    clearErrors();
    
    const formData = {
        name: document.getElementById('signUpName').value,
        email: document.getElementById('signUpEmail').value,
        password: document.getElementById('signUpPassword').value
    };

    try {
        // backend call for user sign up
        const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.data.token;
            currentUser = data.data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showDashboard();
        } else {
            // If user already exists with subscriptions, guide them to sign in
            if (data.error && data.error.includes('Please sign in instead')) {
                showError('signUpError', data.error + ' Click "Sign In" below.');
                setTimeout(() => {
                    showSignInForm();
                }, 2000);
            } else {
                showError('signUpError', data.error || data.message || 'Sign up failed');
            }
        }
    } catch (error) {
        showError('signUpError', 'Network error. Please try again.');
    }
}

// Handle sign in
async function handleSignIn(e) {
    e.preventDefault();
    clearErrors();
    
    const formData = {
        email: document.getElementById('signInEmail').value,
        password: document.getElementById('signInPassword').value
    };

    try {
        console.log('Signing in with:', { email: formData.email });
        // backend call for user sign in
        const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        console.log('Sign-in response:', { status: response.status, data });

        if (response.ok) {
            authToken = data.data.token;
            currentUser = data.data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showDashboard();
        } else {
            // If user doesn't have a subscription, guide them to sign up
            if (data.error && data.error.includes('No subscription found')) {
                const errorMsg = data.error + ' Click "Sign Up" below to create an account.';
                console.error('Sign-in error:', errorMsg);
                showError('signInError', errorMsg);
                // Optionally auto-switch to sign up form after a delay
                setTimeout(() => {
                    showSignUpForm();
                }, 2000);
            } else {
                const errorMsg = data.error || data.message || `Sign-in failed (${response.status})`;
                console.error('Sign-in error:', errorMsg);
                showError('signInError', errorMsg);
            }
        }
    } catch (error) {
        console.error('Sign-in network error:', error);
        showError('signInError', `Network error: ${error.message}. Make sure the server is running on ${API_BASE_URL}`);
    }
}

// Handle sign out
function signOut() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    showAuth();
    showSignInForm();
}

// Handle payment method change
function handlePaymentMethodChange() {
    const paymentMethod = document.getElementById('subscriptionPaymentMethod').value;
    const creditCardFields = document.getElementById('creditCardFields');
    
    if (paymentMethod === 'Credit Card') {
        creditCardFields.style.display = 'block';
        // Make credit card fields required
        document.getElementById('cardNumber').required = true;
        document.getElementById('cardExpiry').required = true;
        document.getElementById('cardCVV').required = true;
    } else {
        creditCardFields.style.display = 'none';
        // Remove required from credit card fields
        document.getElementById('cardNumber').required = false;
        document.getElementById('cardExpiry').required = false;
        document.getElementById('cardCVV').required = false;
    }
}

// Format card number with spaces
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
}

// Format expiry date as MM/YY
function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

// Set default start date to today
function setDefaultStartDate() {
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('subscriptionStartDate');
    if (startDateInput) {
        startDateInput.value = today;
    }
}

// Handle create subscription
async function handleCreateSubscription(e) {
    e.preventDefault();
    clearSubscriptionMessages();
    
    const paymentMethod = document.getElementById('subscriptionPaymentMethod').value;
    let paymentMethodValue = paymentMethod;
    
    // If credit card, include card details
    if (paymentMethod === 'Credit Card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCVV = document.getElementById('cardCVV').value;
        
        if (!cardNumber || !cardExpiry || !cardCVV) {
            showError('createSubscriptionError', 'Please fill in all credit card details');
            return;
        }
        
        // Get last 4 digits for display
        const lastFour = cardNumber.slice(-4);
        paymentMethodValue = `Credit Card ending in ${lastFour}`;
    }
    
    const formData = {
        name: document.getElementById('subscriptionName').value,
        price: parseFloat(document.getElementById('subscriptionPrice').value),
        currency: document.getElementById('subscriptionCurrency').value,
        frequency: document.getElementById('subscriptionFrequency').value,
        category: document.getElementById('subscriptionCategory').value,
        paymentMethod: paymentMethodValue,
        startDate: document.getElementById('subscriptionStartDate').value
    };

    try {
        // backend call for creating subscription
        const response = await fetch(`${API_BASE_URL}/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess('createSubscriptionSuccess', 'Subscription created successfully!');
            // Reset form but keep defaults
            document.getElementById('subscriptionCurrency').value = 'EUR';
            document.getElementById('subscriptionFrequency').value = 'monthly';
            document.getElementById('subscriptionPaymentMethod').value = '';
            document.getElementById('cardNumber').value = '';
            document.getElementById('cardExpiry').value = '';
            document.getElementById('cardCVV').value = '';
            document.getElementById('creditCardFields').style.display = 'none';
            setDefaultStartDate(); // Reset to today
            loadSubscriptions();
        } else {
            showError('createSubscriptionError', data.error || data.message || 'Failed to create subscription');
        }
    } catch (error) {
        showError('createSubscriptionError', 'Network error. Please try again.');
    }
}

// Load subscriptions
async function loadSubscriptions() {
    if (!currentUser) return;

    const subscriptionsList = document.getElementById('subscriptionsList');
    subscriptionsList.innerHTML = '<p class="loading">Loading subscriptions...</p>';

    try {
        // backend call for getting user subscriptions
        const response = await fetch(`${API_BASE_URL}/subscriptions/user/${currentUser._id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            displaySubscriptions(data.data || []);
        } else {
            subscriptionsList.innerHTML = '<p class="error-message">Failed to load subscriptions</p>';
        }
    } catch (error) {
        subscriptionsList.innerHTML = '<p class="error-message">Network error. Please try again.</p>';
    }
}

// Display subscriptions
function displaySubscriptions(subscriptions) {
    const subscriptionsList = document.getElementById('subscriptionsList');
    
    if (subscriptions.length === 0) {
        subscriptionsList.innerHTML = `
            <div class="empty-state">
                <p>No subscriptions yet.</p>
                <p>Add your first subscription above!</p>
            </div>
        `;
        return;
    }

    subscriptionsList.innerHTML = subscriptions.map(sub => `
        <div class="subscription-item">
            <div class="subscription-details">
                <h4>${sub.name}</h4>
                <p><strong>Price:</strong> ${sub.price} ${sub.currency} (${sub.frequency})</p>
                <p><strong>Category:</strong> ${sub.category}</p>
                <p><strong>Payment Method:</strong> ${sub.paymentMethod}</p>
                <p><strong>Start Date:</strong> ${new Date(sub.startDate).toLocaleDateString()}</p>
                <p><strong>Renewal Date:</strong> ${sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Status:</strong> ${sub.status}</p>
            </div>
            <div class="subscription-actions">
                <button class="btn btn-delete" onclick="deleteSubscription('${sub._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Delete subscription
async function deleteSubscription(subscriptionId) {
    if (!confirm('Are you sure you want to delete this subscription?')) {
        return;
    }

    try {
        // backend call for deleting subscription
        const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            loadSubscriptions();
        } else {
            alert(data.error || data.message || 'Failed to delete subscription');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

// Utility functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    successElement.textContent = message;
    successElement.classList.add('show');
    setTimeout(() => {
        successElement.classList.remove('show');
    }, 3000);
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
}

function clearSubscriptionMessages() {
    document.getElementById('createSubscriptionError').classList.remove('show');
    document.getElementById('createSubscriptionSuccess').classList.remove('show');
}

